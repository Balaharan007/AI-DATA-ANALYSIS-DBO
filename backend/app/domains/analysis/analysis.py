from __future__ import annotations

import io
import json
import re
import textwrap
from typing import Any, Optional

import duckdb
import numpy as np
import pandas as pd

# Prophet for forecasting
try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False

from app.integrations.groq import groq_client
from app.storage import new_id


def df_schema_text(df: pd.DataFrame, max_cols: int = 40) -> str:
    lines = []
    for col in list(df.columns)[:max_cols]:
        s = df[col]
        sample = s.dropna().head(3).tolist()
        lines.append(f"- {col} ({s.dtype}): sample={sample}")
    return "\n".join(lines)


def df_profile_text(df: pd.DataFrame) -> str:
    return textwrap.dedent(
        f"""
        Rows: {df.shape[0]}, Columns: {df.shape[1]}
        Columns:
        {df_schema_text(df)}
        Missing values per column (top 10):
        {df.isna().sum().sort_values(ascending=False).head(10).to_string()}
        """
    ).strip()


def _safe_records(df: pd.DataFrame) -> list[dict]:
    return df.where(pd.notnull(df), None).to_dict(orient="records")


# ---------------------------------------------------------------------------
# Pandas / SQL execution sandboxes
# ---------------------------------------------------------------------------

_ALLOWED_BUILTINS = {
    "len": len, "range": range, "sum": sum, "min": min, "max": max,
    "sorted": sorted, "round": round, "abs": abs, "list": list, "dict": dict,
    "enumerate": enumerate, "zip": zip, "str": str, "int": int, "float": float,
    "bool": bool, "True": True, "False": False, "None": None,
}

_FORBIDDEN = re.compile(
    r"\b(import|open|exec|eval|__|os\.|sys\.|subprocess|globals|locals|input)\b"
)


def run_pandas_code(df: pd.DataFrame, code: str) -> Any:
    if _FORBIDDEN.search(code):
        raise ValueError("Generated code contains disallowed operations.")
    local_ns: dict[str, Any] = {"df": df.copy(), "pd": pd, "np": np}
    try:
        # If it's a single expression, eval; otherwise exec and read `result`
        compiled = compile(code, "<pandas_code>", "eval")
        result = eval(compiled, {"__builtins__": _ALLOWED_BUILTINS}, local_ns)
    except SyntaxError:
        exec(compile(code, "<pandas_code>", "exec"), {"__builtins__": _ALLOWED_BUILTINS}, local_ns)
        result = local_ns.get("result")
    return result


def run_sql(tables: dict[str, pd.DataFrame], sql: str) -> pd.DataFrame:
    con = duckdb.connect(database=":memory:")
    try:
        for name, tdf in tables.items():
            # Convert object and string columns to pandas StringDtype for DuckDB compatibility
            tdf = tdf.copy()
            for col in tdf.columns:
                if tdf[col].dtype == 'object' or str(tdf[col].dtype) == 'str':
                    tdf[col] = tdf[col].astype(pd.StringDtype())
            con.register(name, tdf)
        return con.execute(sql).fetchdf()
    finally:
        con.close()


def generate_pandas_code(df: pd.DataFrame, question: str) -> str:
    prompt = f"""You write a single pandas expression (or short snippet) operating on a
dataframe called `df` to answer the user's question. The dataframe schema:
{df_profile_text(df)}

Rules:
- Reference the dataframe only as `df`. Do not read files or import anything.
- If a single expression suffices, output just that expression.
- If you need multiple lines, assign the final answer to a variable named `result`.
- Return ONLY the Python code, no markdown fences, no explanation.

Question: {question}
"""
    code = groq_client.chat_completion(
        [{"role": "user", "content": prompt}], temperature=0.1, max_tokens=400
    )
    code = re.sub(r"^```(python)?", "", code.strip()).strip()
    code = re.sub(r"```$", "", code).strip()
    return code


def generate_sql(df: pd.DataFrame, question: str, table_name: str = "df") -> str:
    prompt = f"""Write a single DuckDB SQL query against a table named `{table_name}` to
answer the question below. Table schema:
{df_profile_text(df)}

Return ONLY the SQL query, no markdown fences, no explanation, no trailing semicolon issues.

Question: {question}
"""
    sql = groq_client.chat_completion(
        [{"role": "user", "content": prompt}], temperature=0.1, max_tokens=400
    )
    sql = re.sub(r"^```(sql)?", "", sql.strip()).strip()
    sql = re.sub(r"```$", "", sql).strip()
    return sql


# ---------------------------------------------------------------------------
# Charts
# ---------------------------------------------------------------------------

CHART_TYPES = {
    "bar", "line", "pie", "scatter", "heatmap", "histogram",
    "treemap", "box", "area", "radar", "bubble", "waterfall", "sunburst",
}

# A colorblind-friendly palette shared with the frontend
CHART_PALETTE = [
    "#6366F1", "#22C55E", "#F59E0B", "#EC4899", "#06B6D4",
    "#EF4444", "#A855F7", "#84CC16", "#F97316", "#14B8A6",
]


def build_chart_spec(df: pd.DataFrame, prompt: Optional[str], chart_type: Optional[str]) -> dict:
    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    cat_cols = [c for c in df.columns if c not in numeric_cols]

    plan_prompt = f"""Given this dataframe schema:
{df_profile_text(df)}

And this user request: "{prompt or 'Show an insightful chart of this data'}"
{'The user specified chart type: ' + chart_type if chart_type else ''}

Pick the best chart configuration. Respond with ONLY a JSON object:
{{
  "chart_type": one of {sorted(CHART_TYPES)},
  "x_key": "<column name for x-axis / category>",
  "y_keys": ["<column name(s) for values, numeric>"],
  "agg": "sum" | "mean" | "count" | "none",
  "title": "<short descriptive title — aim for 6-10 words, business-friendly>",
  "top_n": <integer, max categories to show, default 15>,
  "description": "<one-sentence plain-English explanation of what this chart reveals>"
}}
"""
    try:
        raw = groq_client.chat_completion(
            [{"role": "user", "content": plan_prompt}], temperature=0.1, max_tokens=600, json_mode=True
        )
        plan = groq_client.extract_json(raw)
    except Exception:
        # Heuristic fallback if the LLM call fails (e.g. missing/invalid GROQ_API_KEY)
        plan = {
            "chart_type": chart_type or "bar",
            "x_key": cat_cols[0] if cat_cols else (df.columns[0] if len(df.columns) else None),
            "y_keys": numeric_cols[:1],
            "agg": "sum",
            "title": None,
            "top_n": 15,
            "description": None,
        }

    x_key = plan.get("x_key") if plan.get("x_key") in df.columns else (cat_cols[0] if cat_cols else df.columns[0])
    y_keys = [y for y in plan.get("y_keys", []) if y in numeric_cols] or (numeric_cols[:1] or [df.columns[-1]])
    agg = plan.get("agg", "sum")
    ctype = chart_type or plan.get("chart_type") or "bar"
    if ctype not in CHART_TYPES:
        ctype = "bar"
    top_n = int(plan.get("top_n", 15) or 15)
    title = plan.get("title") or f"{', '.join(y_keys)} by {x_key}"
    description = plan.get("description", "")

    work = df[[x_key] + [y for y in y_keys if y != x_key]].copy()
    if ctype in {"pie", "bar", "treemap", "sunburst", "waterfall"} and agg != "none" and x_key not in numeric_cols:
        if agg == "count":
            grouped = work.groupby(x_key).size().reset_index(name=y_keys[0] if y_keys else "count")
        else:
            grouped = work.groupby(x_key, dropna=False)[[y for y in y_keys if y in numeric_cols]].agg(agg).reset_index()
        grouped = grouped.sort_values(by=grouped.columns[-1], ascending=False).head(top_n)
        data = _safe_records(grouped)
    elif ctype == "histogram":
        col = y_keys[0] if y_keys else numeric_cols[0]
        counts, edges = np.histogram(df[col].dropna(), bins=min(20, max(5, df[col].nunique())))
        data = [
            {"bin": f"{edges[i]:.2f}-{edges[i+1]:.2f}", col: int(counts[i])}
            for i in range(len(counts))
        ]
        x_key, y_keys = "bin", [col]
    else:
        trimmed = work.dropna().head(500)
        data = _safe_records(trimmed)

    return {
        "id": new_id("chart_"),
        "title": title,
        "description": description,
        "type": ctype,
        "x_key": x_key,
        "y_keys": y_keys,
        "data": data,
        "meta": {"agg": agg},
    }


# ---------------------------------------------------------------------------
# Anomaly detection
# ---------------------------------------------------------------------------

def detect_anomalies(df: pd.DataFrame, z_thresh: float = 3.0) -> tuple[list[dict], str]:
    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    if not numeric_cols:
        return [], "No numeric columns were found to analyze for anomalies."

    flagged_idx: set[int] = set()
    reasons: dict[int, list[str]] = {}

    for col in numeric_cols:
        s = df[col]
        mean, std = s.mean(), s.std(ddof=0)
        q1, q3 = s.quantile(0.25), s.quantile(0.75)
        iqr = q3 - q1
        lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr
        if std and std > 0:
            z = (s - mean) / std
        else:
            z = pd.Series(0, index=s.index)
        outliers = s[(z.abs() > z_thresh) | (s < lower) | (s > upper)]
        for idx, val in outliers.items():
            flagged_idx.add(idx)
            reasons.setdefault(idx, []).append(
                f"{col}={val:.2f} is far from the typical range ({lower:.2f} to {upper:.2f})"
            )

    if not flagged_idx:
        return [], "No statistically significant anomalies were detected (using z-score and IQR thresholds)."

    rows = df.loc[sorted(flagged_idx)].copy()
    rows["_reason"] = [", ".join(reasons[i]) for i in rows.index]
    rows = rows.head(100)
    records = _safe_records(rows)
    summary = (
        f"Flagged {len(flagged_idx)} row(s) out of {df.shape[0]} as anomalies across "
        f"{len(numeric_cols)} numeric column(s), using a combination of z-score (>|{z_thresh}|) "
        "and IQR (1.5x) outlier rules."
    )
    return records, summary


# ---------------------------------------------------------------------------
# Forecasting - Enhanced Pipeline
# ---------------------------------------------------------------------------

class ForecastError(Exception):
    """Custom exception for forecast-related errors with suggestions."""
    def __init__(self, message: str, suggestions: Optional[list[str]] = None):
        super().__init__(message)
        self.suggestions = suggestions or []


def _find_date_col(df: pd.DataFrame) -> Optional[str]:
    """Find the best date column in the dataframe."""
    for col in df.columns:
        lc = str(col).lower()
        if "date" in lc or "month" in lc or "time" in lc or "period" in lc or "year" in lc:
            return col
    for col in df.columns:
        try:
            pd.to_datetime(df[col].dropna().head(20))
            return col
        except Exception:
            continue
    return None


def _parse_forecast_query(query: str, df: pd.DataFrame) -> dict:
    """
    Use LLM to parse the user's forecast query and extract:
    - target_feature: the column to forecast
    - horizon: forecast period (e.g., 6 months, 30 days, 1 year)
    - filters: any filters/conditions mentioned
    - aggregation: how to aggregate (sum, mean, etc.)
    - date_column: preferred date column if specified
    """
    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    cat_cols = [c for c in df.columns if c not in numeric_cols]
    date_col = _find_date_col(df)

    prompt = f"""Analyze the user's forecasting request and extract structured information.

Dataset info:
- Numeric columns: {numeric_cols}
- Categorical columns: {cat_cols}
- Detected date column: {date_col}
- Row count: {len(df)}
- Date range: {df[date_col].min() if date_col and pd.api.types.is_datetime64_any_dtype(df[date_col]) else 'N/A'} to {df[date_col].max() if date_col and pd.api.types.is_datetime64_any_dtype(df[date_col]) else 'N/A'}

User query: "{query}"

Extract the following and respond with ONLY a JSON object:
{{
  "target_feature": "exact column name from numeric_cols that user wants to forecast",
  "horizon": {{"value": number, "unit": "day|week|month|quarter|year"}},
  "filters": [
    {{"column": "col_name", "operator": "eq|gt|lt|gte|lte|in|contains", "value": "value"}}
  ],
  "aggregation": "sum|mean|median|last|first",
  "date_column": "date column name if user specified one, otherwise null",
  "confidence_level": 0.95
}}

Rules:
- target_feature MUST be one of the numeric_cols listed above. If user mentions a column not in the list, find the closest match.
- If user says "next 6 months", horizon is {{"value": 6, "unit": "month"}}
- If user says "next 30 days", horizon is {{"value": 30, "unit": "day"}}
- If user says "next year", horizon is {{"value": 1, "unit": "year"}}
- If horizon not specified, use {{"value": 6, "unit": "month"}} as default
- filters: ONLY extract EXPLICIT filter conditions with BOTH column AND value (e.g., "region=North", "category=Electronics", "SeniorCitizen=Yes", "where department=Sales").
  DO NOT add a filter if user only mentions a categorical column name without a specific value (e.g., "for SeniorCitizen" without "=Yes" or "=No").
  DO NOT infer filters from time expressions like "next year", "last quarter", etc.
  If user says "for SeniorCitizen" without a value, do NOT add a filter - set filters to empty list.
- aggregation: how to aggregate the target feature over time periods (default: "sum")
- If user mentions a specific date column, use it; otherwise null
- NEVER add filters for time periods (year, month, quarter, etc.) - these are handled by horizon
"""
    try:
        raw = groq_client.chat_completion(
            [{"role": "user", "content": prompt}], temperature=0.1, max_tokens=800, json_mode=True
        )
        result = groq_client.extract_json(raw)

        # Validate target_feature exists in numeric columns
        target = result.get("target_feature")
        if target not in numeric_cols:
            # Find closest match
            target_lower = target.lower()
            best_match = None
            for col in numeric_cols:
                if target_lower in col.lower() or col.lower() in target_lower:
                    best_match = col
                    break
            if best_match:
                result["target_feature"] = best_match
            elif numeric_cols:
                result["target_feature"] = numeric_cols[0]
            else:
                raise ForecastError(
                    "No numeric columns available for forecasting.",
                    suggestions=[]
                )

        # Set defaults
        if "horizon" not in result or not result["horizon"]:
            result["horizon"] = {"value": 6, "unit": "month"}
        if "aggregation" not in result or not result["aggregation"]:
            result["aggregation"] = "sum"
        if "filters" not in result:
            result["filters"] = []
        if "confidence_level" not in result:
            result["confidence_level"] = 0.95

        return result
    except Exception as e:
        # Fallback with heuristic
        target = _guess_target_column_heuristic(df, query)
        return {
            "target_feature": target,
            "horizon": {"value": 6, "unit": "month"},
            "filters": [],
            "aggregation": "sum",
            "date_column": date_col,
            "confidence_level": 0.95
        }


def _guess_target_column_heuristic(df: pd.DataFrame, query: str) -> str:
    """Heuristic fallback for target column detection."""
    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    if not numeric_cols:
        raise ForecastError("No numeric columns available to forecast.", suggestions=[])

    lower_msg = query.lower()
    for col in numeric_cols:
        if str(col).lower() in lower_msg:
            return col
    priority = ["revenue", "sales", "orders", "profit", "amount", "total", "quantity", "count"]
    for kw in priority:
        for col in numeric_cols:
            if kw in str(col).lower():
                return col
    return numeric_cols[0]


def _apply_filters(df: pd.DataFrame, filters: list[dict]) -> pd.DataFrame:
    """Apply user-specified filters to the dataframe."""
    if not filters:
        return df

    filtered = df.copy()
    for f in filters:
        col = f.get("column")
        op = f.get("operator", "eq")
        val = f.get("value")

        if col not in filtered.columns:
            continue

        try:
            if op == "eq":
                filtered = filtered[filtered[col] == val]
            elif op == "gt":
                filtered = filtered[filtered[col] > val]
            elif op == "lt":
                filtered = filtered[filtered[col] < val]
            elif op == "gte":
                filtered = filtered[filtered[col] >= val]
            elif op == "lte":
                filtered = filtered[filtered[col] <= val]
            elif op == "in":
                if isinstance(val, list):
                    filtered = filtered[filtered[col].isin(val)]
            elif op == "contains":
                filtered = filtered[filtered[col].astype(str).str.contains(str(val), case=False, na=False)]
        except Exception:
            continue

    return filtered


def _prepare_forecast_data(df: pd.DataFrame, target: str, date_col: str,
                           aggregation: str = "sum") -> pd.DataFrame:
    """
    Prepare time series data for Prophet:
    - Select date and target columns
    - Handle missing values
    - Aggregate by date column using specified aggregation
    - Ensure regular frequency
    - Sort by date
    """
    work = df[[date_col, target]].copy()

    # Convert date column
    try:
        work[date_col] = pd.to_datetime(work[date_col])
    except Exception:
        raise ForecastError(f"Could not parse '{date_col}' as a date column.")

    # Convert target to numeric
    work[target] = pd.to_numeric(work[target], errors="coerce")

    # Drop rows with missing values in either column
    work = work.dropna(subset=[date_col, target])

    if len(work) < 3:
        raise ForecastError(f"Insufficient data after cleaning (need at least 3 rows, got {len(work)}).")

    # Sort by date
    work = work.sort_values(date_col)

    # Aggregate by date (in case of multiple rows per date)
    if aggregation == "sum":
        grouped = work.groupby(date_col)[target].sum().reset_index()
    elif aggregation == "mean":
        grouped = work.groupby(date_col)[target].mean().reset_index()
    elif aggregation == "median":
        grouped = work.groupby(date_col)[target].median().reset_index()
    elif aggregation == "last":
        grouped = work.groupby(date_col)[target].last().reset_index()
    elif aggregation == "first":
        grouped = work.groupby(date_col)[target].first().reset_index()
    else:
        grouped = work.groupby(date_col)[target].sum().reset_index()

    # Ensure we have enough data points
    if len(grouped) < 3:
        raise ForecastError(f"Insufficient unique time periods after aggregation (need at least 3, got {len(grouped)}).")

    # Check for duplicate dates after aggregation (shouldn't happen with groupby but just in case)
    grouped = grouped.drop_duplicates(subset=[date_col], keep='last').reset_index(drop=True)

    return grouped


def _infer_frequency(dates: pd.Series) -> str:
    """Infer the frequency of a datetime series."""
    try:
        freq = pd.infer_freq(dates)
        if freq:
            return freq
    except Exception:
        pass

    # Fallback: estimate from median difference
    diffs = dates.sort_values().diff().dropna()
    if len(diffs) == 0:
        return "MS"

    median_days = diffs.dt.days.median()
    if median_days <= 1:
        return "D"
    elif median_days <= 7:
        return "W"
    elif median_days <= 31:
        return "MS"
    elif median_days <= 92:
        return "QS"
    else:
        return "AS"


def _horizon_to_periods(horizon: dict, freq: str) -> int:
    """Convert horizon dict to number of periods for the given frequency."""
    value = horizon.get("value", 6)
    unit = horizon.get("unit", "month")

    # Map frequency to base unit - handle pandas frequency strings like "4MS", "MS", "D", "W", etc.
    if freq.startswith("D") or freq.startswith("B"):
        freq_base = "D"
    elif freq.startswith("W"):
        freq_base = "W"
    elif freq.startswith("M") or freq.startswith("Q") and freq[1].isdigit():
        # Handle monthly and quarterly frequencies (e.g., "MS", "4MS", "QS", "2QS")
        if "Q" in freq.upper() and freq[0].isdigit():
            freq_base = "Q"
        else:
            freq_base = "M"
    elif freq.startswith("A") or freq.startswith("Y"):
        freq_base = "A"
    else:
        freq_base = "M"

    if unit == "day":
        if freq_base == "D":
            return value
        elif freq_base == "W":
            return max(1, value // 7)
        elif freq_base == "M":
            return max(1, value // 30)
        elif freq_base == "Q":
            return max(1, value // 90)
        else:
            return max(1, value // 365)
    elif unit == "week":
        if freq_base == "D":
            return value * 7
        elif freq_base == "W":
            return value
        elif freq_base == "M":
            return max(1, value // 4)
        elif freq_base == "Q":
            return max(1, value // 13)
        else:
            return max(1, value // 52)
    elif unit == "month":
        if freq_base == "D":
            return value * 30
        elif freq_base == "W":
            return value * 4
        elif freq_base == "M":
            return value
        elif freq_base == "Q":
            return max(1, value // 3)
        else:
            return max(1, value // 12)
    elif unit == "quarter":
        if freq_base == "M":
            return value * 3
        elif freq_base == "Q":
            return value
        elif freq_base == "D":
            return value * 90
        else:
            return value * 4
    elif unit == "year":
        if freq_base == "M":
            return value * 12
        elif freq_base == "Q":
            return value * 4
        elif freq_base == "D":
            return value * 365
        else:
            return value
    else:
        return 6


def forecast_prophet(df: pd.DataFrame, target: str, horizon: int = 6,
                     confidence_level: float = 0.95, date_col: Optional[str] = None,
                     aggregation: str = "sum", filters: Optional[list] = None) -> dict:
    """
    Generate forecasts using Facebook Prophet with proper query understanding.

    This is the main entry point that handles the full pipeline:
    1. Apply filters
    2. Identify/validate date column
    3. Prepare and aggregate data
    4. Train Prophet model
    5. Generate forecast with confidence intervals
    6. Return chart spec with historical + forecast data
    """
    if not PROPHET_AVAILABLE:
        raise RuntimeError("Prophet is not installed. Add 'prophet' to requirements.txt")

    if target not in df.columns:
        raise ForecastError(
            f"Column '{target}' not found in dataset.",
            suggestions=[c for c in df.select_dtypes(include="number").columns.tolist() if c != target][:5]
        )

    # Check if target is numeric
    if not pd.api.types.is_numeric_dtype(df[target]):
        numeric_cols = df.select_dtypes(include="number").columns.tolist()
        raise ForecastError(
            f"Column '{target}' is not numeric (type: {df[target].dtype}). Forecasting requires a numeric column.",
            suggestions=numeric_cols[:5]
        )

    # Apply filters
    work_df = _apply_filters(df, filters or [])

    # Determine date column
    if date_col and date_col not in work_df.columns:
        date_col = None
    if not date_col:
        date_col = _find_date_col(work_df)

    if not date_col:
        raise ForecastError(
            "No date/time column found in the dataset. Cannot forecast without a time dimension.",
            suggestions=[]
        )

    # Prepare time series data
    ts_data = _prepare_forecast_data(work_df, target, date_col, aggregation)

    # Convert to Prophet format
    prophet_df = ts_data.rename(columns={date_col: "ds", target: "y"})[["ds", "y"]]

    # Need at least 10 data points for Prophet
    if len(prophet_df) < 10:
        raise ForecastError(
            f"Need at least 10 data points for Prophet forecasting (got {len(prophet_df)}). "
            "Try using the linear trend fallback instead.",
            suggestions=["Use simpler forecasting method", "Provide more historical data"]
        )

    # Infer frequency
    freq = _infer_frequency(prophet_df["ds"])

    # Train Prophet model - disable all built-in seasonalities to avoid crosstab issues
    # We'll add them manually if needed
    model = Prophet(
        interval_width=confidence_level,
        yearly_seasonality=False,
        weekly_seasonality=False,
        daily_seasonality=False,
        changepoint_prior_scale=0.05,
        seasonality_prior_scale=10.0,
    )

    # Add seasonality based on frequency
    # Note: We don't add yearly seasonality for monthly data as it causes crosstab errors
    # in Prophet with pandas. The trend component captures long-term patterns.
    try:
        if freq.startswith(("D", "B")):
            model.add_seasonality(name="daily", period=1, fourier_order=5)
        elif freq.startswith("W"):
            model.add_seasonality(name="weekly", period=7, fourier_order=5)
        # For monthly and lower frequencies, skip explicit seasonality to avoid crosstab issues
        # The trend component handles long-term patterns
    except Exception:
        pass

    model.fit(prophet_df)

    # Generate future dates and forecast
    future = model.make_future_dataframe(periods=horizon, freq=freq)
    forecast = model.predict(future)

    # Prepare chart data
    history_data = []
    for _, row in prophet_df.iterrows():
        history_data.append({
            "period": row["ds"].strftime("%Y-%m-%d"),
            target: round(float(row["y"]), 2),
            "type": "actual"
        })

    forecast_data = []
    future_forecast = forecast.tail(horizon)
    for _, row in future_forecast.iterrows():
        forecast_data.append({
            "period": row["ds"].strftime("%Y-%m-%d"),
            target: round(float(row["yhat"]), 2),
            "type": "forecast",
            "yhat_lower": round(float(row["yhat_lower"]), 2),
            "yhat_upper": round(float(row["yhat_upper"]), 2),
        })

    # Calculate trend direction
    trend_slope = float(forecast["trend"].iloc[-1] - forecast["trend"].iloc[-horizon-1]) / horizon if horizon > 0 else 0

    chart_spec = {
        "id": new_id("chart_"),
        "title": f"Forecast: {target} (next {horizon} periods)",
        "type": "line",
        "x_key": "period",
        "y_keys": [target, "yhat_lower", "yhat_upper"],
        "data": history_data + forecast_data,
        "meta": {
            "method": "prophet",
            "horizon": horizon,
            "confidence_level": confidence_level,
            "frequency": freq,
            "aggregation": aggregation,
            "target_feature": target,
            "date_column": date_col,
            "trend_slope": trend_slope,
            "components": {
                "trend": True,
                "yearly": "yearly" in [s.name for s in model.seasonalities.values()],
                "weekly": "weekly" in [s.name for s in model.seasonalities.values()],
            },
            "forecast_data": forecast_data,
            "history_data": history_data,
            "filters_applied": filters,
        },
    }

    return chart_spec


def forecast_linear(df: pd.DataFrame, target: str, horizon: int = 6,
                    date_col: Optional[str] = None, aggregation: str = "sum",
                    filters: Optional[list] = None) -> dict:
    """
    Simple linear trend forecasting as fallback when Prophet is unavailable or data is insufficient.
    """
    if target not in df.columns:
        raise ValueError(f"Column '{target}' not found in dataset.")

    # Apply filters
    work_df = _apply_filters(df, filters or [])

    # Determine date column
    if date_col and date_col not in work_df.columns:
        date_col = None
    if not date_col:
        date_col = _find_date_col(work_df)

    # Prepare data
    ts_data = _prepare_forecast_data(work_df, target, date_col, aggregation)

    y = ts_data[target].to_numpy(dtype=float)
    if len(y) < 3:
        raise ValueError("Not enough data points to forecast (need at least 3).")

    x = np.arange(len(y))
    coeffs = np.polyfit(x, y, deg=1)
    trend = np.poly1d(coeffs)

    future_x = np.arange(len(y), len(y) + horizon)
    preds = trend(future_x)

    history_data = []
    for i in range(len(y)):
        label = str(ts_data[date_col].iloc[i].date()) if date_col else f"P{i+1}"
        history_data.append({"period": label, target: round(float(y[i]), 2), "type": "actual"})

    forecast_data = []
    if date_col and pd.api.types.is_datetime64_any_dtype(ts_data[date_col]):
        last_date = ts_data[date_col].iloc[-1]
        freq = pd.infer_freq(ts_data[date_col]) or "MS"
        future_dates = pd.date_range(last_date, periods=horizon + 1, freq=freq)[1:]
        labels = [str(d.date()) for d in future_dates]
    else:
        labels = [f"P{len(y) + i + 1}" for i in range(horizon)]

    for label, val in zip(labels, preds):
        forecast_data.append({"period": label, target: round(float(val), 2), "type": "forecast"})

    return {
        "id": new_id("chart_"),
        "title": f"Forecast: {target} (next {horizon})",
        "type": "line",
        "x_key": "period",
        "y_keys": [target],
        "data": history_data + forecast_data,
        "meta": {
            "trend_slope": float(coeffs[0]),
            "method": "linear-trend",
            "horizon": horizon,
            "target_feature": target,
            "date_column": date_col,
            "aggregation": aggregation,
            "filters_applied": filters or {},
        },
    }


def forecast_auto(df: pd.DataFrame, target: str, horizon: int = 6,
                  confidence_level: float = 0.95, date_col: Optional[str] = None,
                  aggregation: str = "sum", filters: Optional[list] = None) -> dict:
    """
    Automatic forecasting - tries Prophet first, falls back to linear trend.
    This is the main entry point for the chat service when target is known.
    """
    # Try Prophet if available and enough data
    if PROPHET_AVAILABLE and len(df) >= 10:
        try:
            return forecast_prophet(
                df, target, horizon, confidence_level,
                date_col, aggregation, filters
            )
        except ForecastError:
            raise
        except Exception as e:
            # Fall back to linear trend on any other error
            pass

    # Fallback to linear trend
    return forecast_linear(df, target, horizon, date_col, aggregation, filters)


def forecast(df: pd.DataFrame, user_query: str) -> dict:
    """
    Main forecasting entry point that parses user query and generates forecast.

    This function:
    1. Parses the user's natural language query to identify:
       - Target feature (column) to forecast
       - Forecast horizon (e.g., next 30 days, 6 months, 1 year)
       - Any filters/conditions
       - Aggregation method
    2. Validates the target feature is numeric and a date column exists
    3. Generates the forecast using Prophet (or linear trend fallback)
    4. Returns a chart spec with historical data, forecast, and confidence intervals

    Args:
        df: Input DataFrame
        user_query: Natural language forecast request (e.g., "forecast next 12 months revenue")

    Returns:
        Chart spec dictionary with historical + forecast data

    Raises:
        ForecastError: If target feature is not suitable for forecasting
    """
    # Parse the user's query to extract forecast parameters
    params = _parse_forecast_query(user_query, df)

    target = params.get("target_feature")
    horizon_dict = params.get("horizon", {"value": 6, "unit": "month"})
    filters = params.get("filters", [])
    aggregation = params.get("aggregation", "sum")
    date_col = params.get("date_column")
    confidence_level = params.get("confidence_level", 0.95)

    # Convert horizon dict to number of periods
    # First, find the date column to determine frequency
    if date_col and date_col not in df.columns:
        date_col = None
    if not date_col:
        date_col = _find_date_col(df)

    # Prepare data to infer frequency
    if date_col:
        work_df = _apply_filters(df, filters)
        try:
            work_df[date_col] = pd.to_datetime(work_df[date_col])
            work_df = work_df.sort_values(date_col).dropna(subset=[date_col, target])
            if len(work_df) >= 2:
                freq = _infer_frequency(work_df[date_col])
            else:
                freq = "MS"
        except Exception:
            freq = "MS"
    else:
        freq = "MS"

    horizon = _horizon_to_periods(horizon_dict, freq)

    # Generate forecast using the parsed parameters
    return forecast_auto(
        df, target, horizon, confidence_level,
        date_col, aggregation, filters
    )


def _infer_frequency(dates: pd.Series) -> str:
    """Infer the frequency of a datetime series."""
    try:
        freq = pd.infer_freq(dates.sort_values())
        if freq:
            return freq
    except Exception:
        pass

    # Fallback: estimate from median difference
    diffs = dates.sort_values().diff().dropna()
    if len(diffs) == 0:
        return "MS"

    median_days = diffs.dt.days.median()
    if median_days <= 1:
        return "D"
    elif median_days <= 7:
        return "W"
    elif median_days <= 31:
        return "MS"
    elif median_days <= 92:
        return "QS"
    else:
        return "AS"


# ---------------------------------------------------------------------------
# Dashboard (KPIs + auto charts)
# ---------------------------------------------------------------------------

def build_dashboard(df: pd.DataFrame) -> dict:
    """Build dashboard with KPIs, 4 rich charts (bar, line, scatter, pie) each on a
    different feature. If fewer than 8 columns, features are reused cyclically."""
    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    cat_cols = [c for c in df.columns if c not in numeric_cols]
    all_cols = df.columns.tolist()
    n_cols = len(all_cols)

    # --- KPIs ---
    kpis = []
    for col in numeric_cols[:4]:
        total = float(df[col].sum())
        avg = float(df[col].mean())
        label = col
        if total > 1_000_000:
            display = round(total / 1_000_000, 1)
            fmt = "number"
            kpis.append({"id": new_id("kpi_"), "label": f"Total {label} (M)", "value": display, "format": fmt})
        else:
            kpis.append({
                "id": new_id("kpi_"), "label": f"Total {label}",
                "value": round(total, 2) if total != int(total) else int(total),
                "format": "number",
            })
        kpis.append({
            "id": new_id("kpi_"), "label": f"Avg {label}",
            "value": round(avg, 2) if avg != int(avg) else int(avg),
            "format": "number",
        })
    kpis.append({"id": new_id("kpi_"), "label": "Rows", "value": int(df.shape[0]), "format": "number"})
    kpis.append({"id": new_id("kpi_"), "label": "Columns", "value": int(df.shape[1]), "format": "number"})

    # --- 4 charts: bar, line, scatter, pie — each on a different feature pair ---
    charts: list[dict] = []
    directions: list[tuple[str, str]] = []

    # Helper: pick a feature pair cycling through columns if we have few
    def pick_pair(idx: int, need_cat: bool = False, need_2_num: bool = False):
        """Pick a (numeric_or_none, cat_or_none, prompt_suffix) for chart idx,
        cycling through features to maximize coverage."""
        if need_cat and cat_cols:
            c = cat_cols[idx % len(cat_cols)]
        else:
            c = cat_cols[idx % len(cat_cols)] if cat_cols else None
        if need_2_num and len(numeric_cols) >= 2:
            n1 = numeric_cols[idx % len(numeric_cols)]
            n2 = numeric_cols[(idx + 1) % len(numeric_cols)]
            return n1, n2, c
        n = numeric_cols[idx % len(numeric_cols)] if numeric_cols else None
        return n, c

    # Chart 1: Bar — numeric by categorical (or first numeric vs another if no cat)
    if cat_cols and numeric_cols:
        n, c = numeric_cols[0 % len(numeric_cols)], cat_cols[0 % len(cat_cols)]
        directions.append((f"{n} by {c}", "bar"))
    elif numeric_cols and len(numeric_cols) >= 2:
        n1 = numeric_cols[0]
        n2 = numeric_cols[1 % len(numeric_cols)]
        directions.append((f"Bar: {n1} by {n2}", "bar"))
    elif numeric_cols:
        directions.append((f"Distribution of {numeric_cols[0]}", "bar"))

    # Chart 2: Line — a different numeric by a different categorical (or same if few)
    if cat_cols and numeric_cols:
        n = numeric_cols[1 % len(numeric_cols)]
        c = cat_cols[1 % len(cat_cols)]
        directions.append((f"{n} trend over {c}", "line"))
    elif numeric_cols and len(numeric_cols) >= 2:
        n1 = numeric_cols[1 % len(numeric_cols)]
        n2 = numeric_cols[0]
        directions.append((f"{n1} vs {n2} trend", "line"))
    elif numeric_cols:
        directions.append((f"Trend of {numeric_cols[0]}", "line"))

    # Chart 3: Scatter — two different numeric columns
    if len(numeric_cols) >= 2:
        n1 = numeric_cols[2 % len(numeric_cols)]
        n2 = numeric_cols[(2 + 1) % len(numeric_cols)]
        directions.append((f"Scatter: {n2} vs {n1}", "scatter"))
    elif numeric_cols:
        # Reuse same numeric but scatter against index
        directions.append((f"Scatter: distribution of {numeric_cols[0]}", "scatter"))

    # Chart 4: Pie — numeric by categorical (different from chart 1's pairing)
    if cat_cols and numeric_cols:
        n = numeric_cols[3 % len(numeric_cols)]
        c = cat_cols[3 % len(cat_cols)]
        directions.append((f"Distribution of {n} across {c}", "pie"))
    elif cat_cols and numeric_cols:
        directions.append((f"Distribution of {numeric_cols[0]} across {cat_cols[0]}", "pie"))
    elif numeric_cols:
        directions.append((f"Proportion of {numeric_cols[0]}", "pie"))

    chart_descriptions = [
        "Bar chart comparing a key numeric metric across categories — reveals which segments drive the most value.",
        "Line chart showing how a metric trends across an ordered dimension — highlights growth, decline, and patterns.",
        "Scatter plot comparing two numeric columns — reveals correlations, clusters, and outliers in the data.",
        "Pie chart showing proportional breakdown — makes it easy to see each category's relative contribution.",
    ]

    for (prompt, ctype), desc in zip(directions, chart_descriptions):
        try:
            spec = build_chart_spec(df, prompt, ctype)
            spec["description"] = desc
            charts.append(spec)
        except Exception:
            pass

    # --- Filters ---
    filters: dict[str, Any] = {}
    date_col = _find_date_col(df)
    if date_col:
        try:
            dates = pd.to_datetime(df[date_col].dropna())
            filters["date"] = {"min": str(dates.min().date()), "max": str(dates.max().date())}
        except Exception:
            pass
    for c in cat_cols[:3]:
        vals = df[c].dropna().unique().tolist()
        if 1 < len(vals) <= 50:
            filters.setdefault("categories", [])
            filters["categories"] = [str(v) for v in vals][:20]

    return {"kpis": kpis, "charts": charts, "filters": filters or None}