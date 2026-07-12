from __future__ import annotations

import json
import re
from typing import Any, Optional

import numpy as np
import pandas as pd

from ...integrations.groq import groq_client
from ...storage import new_id

# Isolation Forest for anomaly detection
try:
    from sklearn.ensemble import IsolationForest
    from sklearn.preprocessing import StandardScaler
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


def _parse_anomaly_request(df: pd.DataFrame, user_query: str) -> dict:
    """
    Parse user's anomaly detection request to extract:
    - target columns to analyze
    - filters/conditions
    - contamination/threshold
    - method preference
    """
    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    cat_cols = [c for c in df.columns if c not in numeric_cols]

    prompt = f"""Parse this anomaly detection request and extract parameters.

Available columns:
- Numeric: {numeric_cols}
- Categorical: {cat_cols}

User query: "{user_query}"

Return ONLY a JSON object with:
{{
  "target_columns": ["<column1>", "<column2>"] or [],
  "filters": {{"<column>": "<value>"}} or {{}},
  "contamination": <float 0.01-0.5, default 0.05>,
  "method": "<isolation_forest|zscore|iqr|auto>",
  "conditions": "<any additional conditions>",
  "max_anomalies": <integer, default 50>
}}

Rules:
- target_columns should be numeric columns the user wants to check for anomalies
- If user says "all numeric columns" or doesn't specify, use all numeric columns
- If user mentions specific category filter (e.g., "in IT department"), add to filters
- contamination: proportion of expected anomalies (default 0.05 = 5%)
- method: isolation_forest (ML-based, multivariate), zscore (univariate), iqr (univariate), auto (pick best)
"""

    try:
        resp = groq_client.chat_completion(
            [{"role": "user", "content": prompt}],
            temperature=0.1, max_tokens=400, json_mode=True
        )
        return groq_client.extract_json(resp)
    except Exception:
        # Heuristic fallback
        target_cols = numeric_cols
        horizon_match = re.search(r"contamination\s*(\d*\.?\d+)", user_query.lower())
        contamination = 0.05
        if horizon_match:
            contamination = float(horizon_match.group(1))

        return {
            "target_columns": target_cols,
            "filters": {},
            "contamination": contamination,
            "method": "auto",
            "conditions": "",
            "max_anomalies": 50
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


def _prepare_anomaly_data(df: pd.DataFrame, target_columns: list | None) -> tuple[pd.DataFrame, list[str]]:
    """Prepare numeric data for anomaly detection."""
    # Only use columns that exist and are numeric
    if target_columns:
        available_cols = [c for c in target_columns if c in df.columns and pd.api.types.is_numeric_dtype(df[c])]
    else:
        available_cols = []
    if not available_cols:
        # Fallback to all numeric columns
        available_cols = df.select_dtypes(include="number").columns.tolist()

    if not available_cols:
        raise ValueError("No numeric columns available for anomaly detection")

    # Select only the target columns and drop rows with NaN in those columns
    work = df[available_cols].dropna()

    if len(work) < 10:
        raise ValueError(f"Insufficient data for anomaly detection ({len(work)} rows). Need at least 10.")

    return work, available_cols


def _detect_anomalies_isolation_forest(
    data: pd.DataFrame,
    contamination: float = 0.05,
    random_state: int = 42,
) -> tuple[np.ndarray, np.ndarray]:
    """
    Detect anomalies using Isolation Forest.

    Returns:
        (anomaly_labels, anomaly_scores)
        - anomaly_labels: 1 for normal, -1 for anomaly
        - anomaly_scores: anomaly score (lower = more anomalous)
    """
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(data)

    model = IsolationForest(
        contamination=contamination,
        random_state=random_state,
        n_estimators=100,
        max_samples="auto",
        max_features=1.0,
        bootstrap=False,
        n_jobs=-1,
    )

    labels = model.fit_predict(scaled_data)
    scores = model.decision_function(scaled_data)

    return labels, scores


def _detect_anomalies_zscore(data: pd.DataFrame, threshold: float = 3.0) -> tuple[np.ndarray, np.ndarray]:
    """
    Detect anomalies using Z-score (univariate, per column).
    Returns combined results across all columns.
    """
    labels = np.ones(len(data))
    scores = np.zeros(len(data))

    for col in data.columns:
        series = data[col]
        mean, std = series.mean(), series.std(ddof=0)
        if std > 0:
            z = np.abs((series - mean) / std)
            col_labels = np.where(z > threshold, -1, 1)
            labels = np.minimum(labels, col_labels)  # If any column flags, it's anomaly
            scores = np.maximum(scores, z)  # Max z-score across columns

    return labels, scores


def _detect_anomalies_iqr(data: pd.DataFrame, multiplier: float = 1.5) -> tuple[np.ndarray, np.ndarray]:
    """
    Detect anomalies using IQR method (univariate, per column).
    Returns combined results across all columns.
    """
    labels = np.ones(len(data))
    scores = np.zeros(len(data))

    for col in data.columns:
        series = data[col]
        q1, q3 = series.quantile(0.25), series.quantile(0.75)
        iqr = q3 - q1
        lower, upper = q1 - multiplier * iqr, q3 + multiplier * iqr
        col_labels = np.where((series < lower) | (series > upper), -1, 1)
        labels = np.minimum(labels, col_labels)
        # Score based on how far outside IQR
        outlier_score = np.where(series < lower, (lower - series) / iqr, 0) + np.where(series > upper, (series - upper) / iqr, 0)
        scores = np.maximum(scores, outlier_score)

    return labels, scores


def _build_anomaly_chart_spec(
    df: pd.DataFrame,
    anomalies_df: pd.DataFrame,
    target_columns: list[str],
    method: str,
    filters: dict,
) -> dict:
    """Build a chart spec showing anomalies."""
    # Use first two target columns for scatter plot, or first target vs index
    if len(target_columns) >= 2:
        x_col, y_col = target_columns[0], target_columns[1]
        chart_type = "scatter"
    elif len(target_columns) == 1:
        x_col = "index"
        y_col = target_columns[0]
        chart_type = "scatter"
    else:
        x_col, y_col = target_columns[0], target_columns[1] if len(target_columns) > 1 else target_columns[0]
        chart_type = "scatter"

    # Prepare data
    is_anomaly = anomalies_df["_is_anomaly"] == -1
    anomaly_data = anomalies_df[is_anomaly]
    normal_data = anomalies_df[~is_anomaly]

    chart_data = []

    if x_col == "index":
        for i, row in normal_data.iterrows():
            chart_data.append({"x": str(i), y_col: float(row[y_col]), "type": "normal"})
        for i, row in anomaly_data.iterrows():
            chart_data.append({"x": str(i), y_col: float(row[y_col]), "type": "anomaly"})
        x_key = "x"
    else:
        for i, row in normal_data.iterrows():
            chart_data.append({x_col: str(row[x_col]), y_col: float(row[y_col]), "type": "normal"})
        for i, row in anomaly_data.iterrows():
            chart_data.append({x_col: str(row[x_col]), y_col: float(row[y_col]), "type": "anomaly"})
        x_key = x_col

    filter_str = ""
    if filters:
        filter_parts = [f"{k}={v}" for k, v in filters.items()]
        filter_str = f" ({', '.join(filter_parts)})"

    return {
        "id": new_id("chart_"),
        "title": f"Anomaly Detection ({method}){filter_str} — {len(anomaly_data)} anomalies found",
        "type": chart_type,
        "x_key": x_key,
        "y_keys": [y_col],
        "data": chart_data,
        "meta": {
            "method": method,
            "target_columns": target_columns,
            "total_points": len(anomalies_df),
            "anomaly_count": len(anomaly_data),
            "anomaly_percentage": round(len(anomaly_data) / len(anomalies_df) * 100, 1),
            "filters_applied": filters,
        },
    }


def detect_anomalies(
    df: pd.DataFrame,
    user_query: str,
    target_columns: list[str] = None,
    filters: dict = None,
    contamination: float = 0.05,
    method: str = "auto",
    max_anomalies: int = 50,
) -> dict:
    """
    Detect anomalies based on user's natural language query or parameters.

    Args:
        df: Input DataFrame
        user_query: Natural language anomaly detection request
        target_columns: Optional specific columns to analyze
        filters: Optional filters to apply (e.g., {"department": "IT"})
        contamination: Expected proportion of anomalies (for isolation forest)
        method: Detection method ("isolation_forest", "zscore", "iqr", "auto")
        max_anomalies: Maximum number of anomalies to return

    Returns:
        Dictionary with anomaly results and chart spec
    """
    # Backward compatibility: if user_query looks like a target column name, treat as simple detection
    if not user_query or user_query.strip() == "":
        user_query = "find anomalies in all numeric columns"

    # Apply filters
    work_df = _apply_filters(df, filters)

    # Prepare data
    anomaly_data, available_cols = _prepare_anomaly_data(work_df, target_columns)

    # Select method if auto
    if method == "auto":
        if len(available_cols) > 1 and len(anomaly_data) >= 20:
            method = "isolation_forest"
        else:
            method = "zscore"

    # Detect anomalies
    if method == "isolation_forest":
        labels, scores = _detect_anomalies_isolation_forest(anomaly_data, contamination)
    elif method == "zscore":
        labels, scores = _detect_anomalies_zscore(anomaly_data)
    elif method == "iqr":
        labels, scores = _detect_anomalies_iqr(anomaly_data)
    else:
        raise ValueError(f"Unknown method: {method}")

    # Add results to dataframe
    result_df = anomaly_data.copy()
    result_df["_is_anomaly"] = labels
    result_df["_anomaly_score"] = scores

    # Map back to original dataframe indices
    anomaly_indices = result_df[result_df["_is_anomaly"] == -1].index.tolist()

    # Get full rows for anomalies from original filtered dataframe
    full_anomalies = work_df.loc[anomaly_indices].copy()
    full_anomalies["_anomaly_score"] = [scores[anomaly_data.index.get_loc(i)] for i in anomaly_indices]

    # Limit to max_anomalies
    if len(full_anomalies) > max_anomalies:
        # Sort by anomaly score (most anomalous first)
        full_anomalies = full_anomalies.nsmallest(max_anomalies, "_anomaly_score")

    # Build chart
    chart_spec = _build_anomaly_chart_spec(
        work_df, result_df, available_cols, method, filters
    )

    # Generate explanation
    anomaly_count = len(full_anomalies)
    total_count = len(work_df)
    pct = round(anomaly_count / total_count * 100, 1) if total_count > 0 else 0

    filter_str = ""
    if filters:
        filter_parts = [f"{k}={v}" for k, v in filters.items()]
        filter_str = f" for {', '.join(filter_parts)}"

    explanation = (
        f"Detected {anomaly_count} anomalies out of {total_count} records ({pct}%){filter_str} "
        f"using {method.replace('_', ' ').title()}. "
        f"Anomalies are rows with unusual combinations of values across {', '.join(available_cols)}. "
        f"Review the flagged rows to understand why they deviate from normal patterns."
    )

    return {
        "method": method,
        "target_columns": available_cols,
        "filters_applied": filters,
        "total_records": total_count,
        "anomaly_count": anomaly_count,
        "anomaly_percentage": pct,
        "anomalies": full_anomalies.to_dict(orient="records"),
        "chart": chart_spec,
        "explanation": explanation,
    }


def get_anomaly_summary(result: dict) -> dict:
    """Extract key anomaly metrics for API response."""
    return {
        "method": result.get("method"),
        "target_columns": result.get("target_columns"),
        "filters_applied": result.get("filters_applied", {}),
        "total_records": result.get("total_records"),
        "anomaly_count": result.get("anomaly_count"),
        "anomaly_percentage": result.get("anomaly_percentage"),
        "anomalies": result.get("anomalies", [])[:10],  # Top 10 for preview
        "chart": result.get("chart"),
        "explanation": result.get("explanation"),
    }