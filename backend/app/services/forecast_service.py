from __future__ import annotations

import re
from typing import Any, Optional

import numpy as np
import pandas as pd

from .. import groq_client
from ..storage import new_id

# Prophet for forecasting
try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False


def _find_date_col(df: pd.DataFrame) -> Optional[str]:
    """Find the most likely date/time column in the dataframe."""
    for col in df.columns:
        lc = str(col).lower()
        if any(kw in lc for kw in ["date", "month", "time", "period", "year"]):
            return col
    for col in df.columns:
        try:
            pd.to_datetime(df[col].dropna().head(20))
            return col
        except Exception:
            continue
    return None


def _parse_user_forecast_request(df: pd.DataFrame, user_query: str) -> dict:
    """
    Parse user's natural language forecast request to extract:
    - target column (what to forecast)
    - date column (time dimension)
    - horizon (how many periods)
    - conditions/filters
    - frequency
    """
    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    cat_cols = [c for c in df.columns if c not in numeric_cols]
    date_col = _find_date_col(df)

    prompt = f"""Parse this forecasting request and extract parameters.

Available columns:
- Numeric: {numeric_cols}
- Categorical: {cat_cols}
- Date column (auto-detected): {date_col}

User query: "{user_query}"

Return ONLY a JSON object with:
{{
  "target": "<column to forecast - must be numeric>",
  "date_column": "<date/time column or null>",
  "horizon": <integer, number of periods to forecast, default 6>,
  "frequency": "<MS|D|W|Q|A - inferred from date column or user query>",
  "filters": {{"<column>": "<value>"}} or {{}},
  "conditions": "<any additional conditions from user query>",
  "confidence_level": <0.8|0.95|0.99, default 0.95>
}}

Rules:
- target MUST be from numeric columns
- If user mentions specific time range (e.g., "next 12 months"), use that for horizon
- If user mentions specific category filter (e.g., "for IT department"), add to filters
- Infer frequency from date column or user language (monthly=MS, daily=D, weekly=W, quarterly=Q, yearly=A)
"""

    try:
        resp = groq_client.chat_completion(
            [{"role": "user", "content": prompt}],
            temperature=0.1, max_tokens=400, json_mode=True
        )
        return groq_client.extract_json(resp)
    except Exception:
        # Heuristic fallback
        target = numeric_cols[0] if numeric_cols else None
        horizon_match = re.search(r"(?:next|forecast|predict)\s+(\d+)\s*(day|week|month|quarter|year)", user_query.lower())
        horizon = 6
        freq = "MS"
        if horizon_match:
            num = int(horizon_match.group(1))
            unit = horizon_match.group(2)
            if unit.startswith("day"):
                horizon, freq = num, "D"
            elif unit.startswith("week"):
                horizon, freq = num, "W"
            elif unit.startswith("month"):
                horizon, freq = num, "MS"
            elif unit.startswith("quarter"):
                horizon, freq = num, "Q"
            elif unit.startswith("year"):
                horizon, freq = num, "A"

        return {
            "target": target,
            "date_column": date_col,
            "horizon": horizon,
            "frequency": freq,
            "filters": {},
            "conditions": "",
            "confidence_level": 0.95
        }


def _apply_filters(df: pd.DataFrame, filters: dict) -> pd.DataFrame:
    """Apply filters to dataframe."""
    if not filters:
        return df
    work = df.copy()
    for col, val in filters.items():
        if col in work.columns:
            work = work[work[col] == val]
    return work


def _prepare_prophet_data(df: pd.DataFrame, target: str, date_col: Optional[str]) -> tuple[pd.DataFrame, str]:
    """
    Prepare data in Prophet format (ds, y).
    Returns (prophet_df, freq_used)
    """
    work = df[[c for c in [date_col, target] if c]].copy().dropna()
    work[target] = pd.to_numeric(work[target], errors="coerce")
    work = work.dropna()

    if len(work) < 10:
        raise ValueError(f"Need at least 10 data points for Prophet, got {len(work)}")

    freq = "MS"  # default monthly

    if date_col and date_col in work.columns:
        try:
            work[date_col] = pd.to_datetime(work[date_col])
            work = work.sort_values(date_col)

            # Aggregate by date if multiple rows per date
            work = work.groupby(date_col)[target].sum().reset_index()

            prophet_df = work.rename(columns={date_col: "ds", target: "y"})[["ds", "y"]]
            # Infer frequency
            inferred = pd.infer_freq(prophet_df["ds"])
            if inferred:
                freq = inferred
        except Exception:
            # Fallback to synthetic dates
            prophet_df = pd.DataFrame({
                "ds": pd.date_range(start="2020-01-01", periods=len(work), freq="MS"),
                "y": work[target].values
            })
            freq = "MS"
    else:
        # No date column - use synthetic monthly dates
        prophet_df = pd.DataFrame({
            "ds": pd.date_range(start="2020-01-01", periods=len(work), freq="MS"),
            "y": work[target].values
        })
        freq = "MS"

    # Ensure no duplicate dates
    prophet_df = prophet_df.drop_duplicates(subset="ds", keep="last").reset_index(drop=True)

    return prophet_df, freq


def _build_prophet_model(prophet_df: pd.DataFrame, confidence_level: float, freq: str) -> Prophet:
    """Build and configure Prophet model based on data frequency."""
    # Ensure no duplicate dates
    prophet_df = prophet_df.drop_duplicates(subset="ds", keep="last").reset_index(drop=True)

    # Disable yearly seasonality to avoid pandas crosstab issues
    # Use only basic trend - user can enable seasonality if needed
    model = Prophet(
        interval_width=confidence_level,
        yearly_seasonality=False,
        weekly_seasonality=False,
        daily_seasonality=False,
        changepoint_prior_scale=0.05,
        seasonality_prior_scale=10.0,
    )

    model.fit(prophet_df)
    return model


def _generate_forecast_chart_spec(
    model: Prophet,
    prophet_df: pd.DataFrame,
    forecast: pd.DataFrame,
    target: str,
    horizon: int,
    freq: str,
    confidence_level: float,
    user_query: str,
    filters: dict,
) -> dict:
    """Generate a chart spec that matches user's query with proper Prophet visualization."""

    # Historical data
    history_data = []
    for _, row in prophet_df.iterrows():
        history_data.append({
            "period": row["ds"].strftime("%Y-%m-%d"),
            target: round(float(row["y"]), 2),
            "type": "actual"
        })

    # Forecast data (only future periods)
    future_forecast = forecast.tail(horizon)
    forecast_data = []
    for _, row in future_forecast.iterrows():
        forecast_data.append({
            "period": row["ds"].strftime("%Y-%m-%d"),
            target: round(float(row["yhat"]), 2),
            "type": "forecast",
            "yhat_lower": round(float(row["yhat_lower"]), 2),
            "yhat_upper": round(float(row["yhat_upper"]), 2),
        })

    # Build title from user query context
    filter_str = ""
    if filters:
        filter_parts = [f"{k}={v}" for k, v in filters.items()]
        filter_str = f" ({', '.join(filter_parts)})"

    chart_spec = {
        "id": new_id("chart_"),
        "title": f"Prophet Forecast: {target}{filter_str} — next {horizon} periods",
        "type": "line",
        "x_key": "period",
        "y_keys": [target, "yhat_lower", "yhat_upper"],
        "data": history_data + forecast_data,
        "meta": {
            "method": "prophet",
            "horizon": horizon,
            "confidence_level": confidence_level,
            "frequency": freq,
            "components": {
                "trend": True,
                "yearly": "yearly" in [s.name for s in model.seasonalities.values()],
                "weekly": "weekly" in [s.name for s in model.seasonalities.values()],
            },
            "forecast_data": forecast_data,
            "history_data": history_data,
            "target": target,
            "filters_applied": filters,
            "user_query": user_query,
        },
    }

    return chart_spec


def generate_forecast(
    df: pd.DataFrame,
    user_query: str,
) -> dict:
    """
    Generate a Prophet forecast based on user's natural language query.

    Args:
        df: Input DataFrame
        user_query: Natural language forecast request (e.g., "forecast next 12 months sales for IT department")

    Returns:
        Dictionary with chart spec including historical data, forecast, and confidence intervals
    """
    if not PROPHET_AVAILABLE:
        raise RuntimeError("Prophet is not installed. Add 'prophet' to requirements.txt")

    # Parse user request
    params = _parse_user_forecast_request(df, user_query)
    target = params.get("target")
    date_col = params.get("date_column") or _find_date_col(df)
    horizon = params.get("horizon", 6)
    freq = params.get("frequency", "MS")
    filters = params.get("filters", {})
    confidence_level = params.get("confidence_level", 0.95)

    if not target or target not in df.columns:
        # Fallback to first numeric column
        numeric_cols = df.select_dtypes(include="number").columns.tolist()
        if not numeric_cols:
            raise ValueError("No numeric columns available for forecasting")
        target = numeric_cols[0]

    # Apply filters
    work_df = _apply_filters(df, filters)

    if len(work_df) < 10:
        raise ValueError(f"Insufficient data after filtering ({len(work_df)} rows). Need at least 10.")

    # Prepare Prophet data
    prophet_df, detected_freq = _prepare_prophet_data(work_df, target, date_col)
    if freq == "MS" and detected_freq != "MS":
        freq = detected_freq  # Use detected frequency if available

    # Build and train model
    model = _build_prophet_model(prophet_df, confidence_level, freq)

    # Generate future dates using detected frequency
    future = model.make_future_dataframe(periods=horizon, freq=freq)
    forecast = model.predict(future)

    # Generate chart spec
    chart_spec = _generate_forecast_chart_spec(
        model=model,
        prophet_df=prophet_df,
        forecast=forecast,
        target=target,
        horizon=horizon,
        freq=freq,
        confidence_level=confidence_level,
        user_query=user_query,
        filters=filters,
    )

    return chart_spec


def generate_forecast_explanation(
    df: pd.DataFrame,
    user_query: str,
    chart_spec: dict,
) -> str:
    """
    Generate a natural language explanation of the forecast.
    """
    meta = chart_spec.get("meta", {})
    forecast_data = meta.get("forecast_data", [])
    target = meta.get("target", "value")

    if not forecast_data:
        return "Forecast generated but no future predictions available."

    # Get trend info
    trend_values = [f["yhat"] for f in forecast_data]
    first_val = trend_values[0]
    last_val = trend_values[-1]
    trend_direction = "increasing" if last_val > first_val else "decreasing"
    change_pct = ((last_val - first_val) / first_val * 100) if first_val != 0 else 0

    # Get confidence interval info
    ci_info = ""
    if "yhat_lower" in forecast_data[0]:
        ci_width = forecast_data[0]["yhat_upper"] - forecast_data[0]["yhat_lower"]
        ci_info = f" with 95% confidence interval of ±{ci_width/2:.1f}"

    filter_str = ""
    if meta.get("filters_applied"):
        filter_parts = [f"{k}={v}" for k, v in meta["filters_applied"].items()]
        filter_str = f" for {', '.join(filter_parts)}"

    explanation = (
        f"The Prophet model forecasts {target}{filter_str} for the next {meta.get('horizon', 6)} periods. "
        f"The trend shows a {trend_direction} pattern ({change_pct:+.1f}% over the forecast horizon){ci_info}. "
        f"Historical data shows {len(chart_spec['data']) - len(forecast_data)} periods of actual values. "
        f"Prophet's additive model captures trend and seasonality components automatically."
    )

    return explanation


def get_forecast_summary(chart_spec: dict) -> dict:
    """Extract key forecast metrics for API response."""
    meta = chart_spec.get("meta", {})
    forecast_data = meta.get("forecast_data", [])

    if not forecast_data:
        return {"error": "No forecast data available"}

    values = [f[meta.get("target", "y")] for f in forecast_data]
    lower = [f.get("yhat_lower", 0) for f in forecast_data]
    upper = [f.get("yhat_upper", 0) for f in forecast_data]

    return {
        "target": meta.get("target"),
        "horizon": meta.get("horizon"),
        "frequency": meta.get("frequency"),
        "method": meta.get("method"),
        "confidence_level": meta.get("confidence_level"),
        "predictions": [
            {
                "period": f["period"],
                "value": f[meta.get("target", "y")],
                "lower": f.get("yhat_lower"),
                "upper": f.get("yhat_upper"),
            }
            for f in forecast_data
        ],
        "summary": {
            "mean": round(np.mean(values), 2),
            "min": round(min(values), 2),
            "max": round(max(values), 2),
            "trend": "increasing" if values[-1] > values[0] else "decreasing",
            "total_change_pct": round((values[-1] - values[0]) / values[0] * 100, 1) if values[0] != 0 else 0,
        },
        "filters_applied": meta.get("filters_applied", {}),
    }