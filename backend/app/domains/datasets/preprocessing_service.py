from __future__ import annotations

import re
import warnings
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Optional

import numpy as np
import pandas as pd


class IssueSeverity(str, Enum):
    """Severity levels for data issues."""
    CRITICAL = "critical"      # Data unusable without fixing
    WARNING = "warning"        # Data usable but quality concerns
    INFO = "info"              # Informational, no action needed


class ActionType(str, Enum):
    """Types of preprocessing actions taken."""
    DROP_DUPLICATES = "drop_duplicates"
    DROP_MISSING_ROWS = "drop_missing_rows"
    FILL_MISSING = "fill_missing"
    STRIP_WHITESPACE = "strip_whitespace"
    COERCE_NUMERIC = "coerce_numeric"
    PARSE_DATES = "parse_dates"
    FIX_CATEGORICAL = "fix_categorical"
    REMOVE_CONSTANT = "remove_constant"
    REMOVE_HIGH_CARDINALITY = "remove_high_cardinality"
    FIX_NEGATIVE_VALUES = "fix_negative_values"
    NO_ACTION = "no_action"


@dataclass
class DataIssue:
    """Represents a single data quality issue found during validation."""
    column: str
    issue_type: str
    severity: IssueSeverity
    description: str
    affected_rows: int
    affected_percentage: float
    sample_values: list[Any] = field(default_factory=list)
    recommended_action: Optional[ActionType] = None
    details: dict[str, Any] = field(default_factory=dict)


@dataclass
class PreprocessingAction:
    """Represents a preprocessing action that was or will be taken."""
    column: str
    action: ActionType
    reason: str
    rows_affected: int
    before_sample: list[Any] = field(default_factory=list)
    after_sample: list[Any] = field(default_factory=list)
    warning: Optional[str] = None


@dataclass
class PreprocessingReport:
    """Complete preprocessing report for a dataset."""
    dataset_id: str
    dataset_name: str
    timestamp: str

    # Original state
    original_shape: tuple[int, int]
    original_dtypes: dict[str, str]
    original_missing: int
    original_duplicates: int

    # Issues found
    issues: list[DataIssue] = field(default_factory=list)

    # Actions taken
    actions_taken: list[PreprocessingAction] = field(default_factory=list)

    # Final state
    final_shape: tuple[int, int] = (0, 0)
    final_dtypes: dict[str, str] = field(default_factory=dict)
    final_missing: int = 0

    # Status
    status: str = "pending"  # "ready", "ready_with_warnings", "critical_issues"
    warnings: list[str] = field(default_factory=list)
    critical_issues: list[str] = field(default_factory=list)

    # Recommendations for user
    user_recommendations: list[str] = field(default_factory=list)


class PreprocessingService:
    """Comprehensive data preprocessing service with validation and reporting."""

    # Configuration constants
    HIGH_CARDINALITY_THRESHOLD = 0.95  # Drop if unique values > 95% of rows
    HIGH_MISSING_THRESHOLD = 0.50      # Warn if missing > 50%
    CRITICAL_MISSING_THRESHOLD = 0.80  # Critical if missing > 80%
    CONSTANT_COLUMN_THRESHOLD = 1      # Drop if only 1 unique value
    MAX_CATEGORIES_FOR_CATEGORICAL = 50  # Warn if categorical has >50 unique values
    OUTLIER_IQR_MULTIPLIER = 1.5
    OUTLIER_Z_SCORE_THRESHOLD = 3.0

    # Common date formats to try
    DATE_FORMATS = [
        "%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y/%m/%d",
        "%d-%m-%Y", "%m-%d-%Y", "%Y.%m.%d", "%d.%m.%Y",
        "%Y-%m-%d %H:%M:%S", "%d/%m/%Y %H:%M:%S", "%m/%d/%Y %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%SZ",
    ]

    def __init__(self):
        self.report: Optional[PreprocessingReport] = None
        self._df: Optional[pd.DataFrame] = None

    def process_dataset(
        self,
        df: pd.DataFrame,
        dataset_id: str,
        dataset_name: str,
        auto_clean: bool = True,
        aggressive_clean: bool = False,
    ) -> tuple[pd.DataFrame, PreprocessingReport]:
        """
        Main entry point: inspect, validate, clean, and report on a dataset.

        Args:
            df: Input DataFrame
            dataset_id: Unique identifier for the dataset
            dataset_name: Human-readable name
            auto_clean: If True, automatically apply safe cleaning operations
            aggressive_clean: If True, apply more aggressive cleaning (drop high missing, etc.)

        Returns:
            Tuple of (cleaned DataFrame, PreprocessingReport)
        """
        self._df = df.copy()
        self.report = PreprocessingReport(
            dataset_id=dataset_id,
            dataset_name=dataset_name,
            timestamp=datetime.now(timezone.utc).isoformat(),
            original_shape=df.shape,
            original_dtypes=df.dtypes.astype(str).to_dict(),
            original_missing=int(df.isna().sum().sum()),
            original_duplicates=int(df.duplicated().sum()),
        )

        # Step 1: Inspect and validate
        self._inspect_dataset()

        # Step 2: Apply cleaning if requested
        if auto_clean:
            self._apply_cleaning(aggressive=aggressive_clean)

        # Step 3: Final assessment
        self._finalize_report()

        return self._df, self.report

    def validate_only(self, df: pd.DataFrame, dataset_id: str, dataset_name: str) -> PreprocessingReport:
        """Run validation only, no cleaning."""
        self._df = df.copy()
        self.report = PreprocessingReport(
            dataset_id=dataset_id,
            dataset_name=dataset_name,
            timestamp=datetime.now(timezone.utc).isoformat(),
            original_shape=df.shape,
            original_dtypes=df.dtypes.astype(str).to_dict(),
            original_missing=int(df.isna().sum().sum()),
            original_duplicates=int(df.duplicated().sum()),
        )
        self._inspect_dataset()
        self._finalize_report()
        return self.report

    # ==================== INSPECTION & VALIDATION ====================

    def _inspect_dataset(self) -> None:
        """Run all validation checks on the dataset."""
        if self._df is None or self.report is None:
            return

        df = self._df

        # Check each column
        for col in df.columns:
            self._check_missing_values(col)
            self._check_whitespace(col)
            self._check_data_types(col)
            self._check_duplicates_in_column(col)
            self._check_categorical_consistency(col)
            self._check_numeric_validity(col)
            self._check_date_validity(col)
            self._check_constant_column(col)
            self._check_high_cardinality(col)
            self._check_outliers(col)
            self._check_negative_values(col)

        # Dataset-level checks
        self._check_duplicate_rows()
        self._check_empty_dataset()
        self._check_single_column()

    def _check_missing_values(self, col: str) -> None:
        """Check for missing values in a column."""
        df = self._df
        missing = df[col].isna().sum()
        total = len(df)
        pct = missing / total if total > 0 else 0

        if missing > 0:
            severity = IssueSeverity.CRITICAL if pct >= self.CRITICAL_MISSING_THRESHOLD else (
                IssueSeverity.WARNING if pct >= self.HIGH_MISSING_THRESHOLD else IssueSeverity.INFO
            )

            action = None
            if pct >= self.CRITICAL_MISSING_THRESHOLD:
                action = ActionType.DROP_MISSING_ROWS
            elif pct >= self.HIGH_MISSING_THRESHOLD:
                action = ActionType.FILL_MISSING

            self.report.issues.append(DataIssue(
                column=col,
                issue_type="missing_values",
                severity=severity,
                description=f"Column has {missing} missing values ({pct:.1%})",
                affected_rows=int(missing),
                affected_percentage=float(pct),
                sample_values=df[col].dropna().head(3).tolist(),
                recommended_action=action,
                details={"missing_count": int(missing), "total_rows": int(total)}
            ))

    def _check_whitespace(self, col: str) -> None:
        """Check for leading/trailing whitespace in string columns."""
        df = self._df
        if df[col].dtype == "object":
            # Check for strings with leading/trailing whitespace
            str_series = df[col].astype(str)
            has_leading = str_series.str.match(r"^\s").any()
            has_trailing = str_series.str.match(r"\s$").any()

            if has_leading or has_trailing:
                # Count affected
                affected = str_series[str_series != str_series.str.strip()].shape[0]
                pct = affected / len(df) if len(df) > 0 else 0

                self.report.issues.append(DataIssue(
                    column=col,
                    issue_type="whitespace",
                    severity=IssueSeverity.WARNING,
                    description=f"Column has {affected} values with leading/trailing whitespace",
                    affected_rows=int(affected),
                    affected_percentage=float(pct),
                    sample_values=df[col].dropna().head(3).tolist(),
                    recommended_action=ActionType.STRIP_WHITESPACE,
                    details={"has_leading": bool(has_leading), "has_trailing": bool(has_trailing)}
                ))

    def _check_data_types(self, col: str) -> None:
        """Check if column data types are appropriate."""
        df = self._df
        dtype = df[col].dtype

        # Check if numeric column stored as object (likely due to mixed types)
        if dtype == "object":
            # Try to infer if it should be numeric - handle currency, commas, etc.
            non_null = df[col].dropna()
            if len(non_null) > 0:
                # Sample to check
                sample = non_null.head(100)
                numeric_count = 0
                for val in sample:
                    try:
                        # First try to clean common currency/formatting characters
                        cleaned = str(val).replace(',', '').replace('$', '').replace('%', '').strip()
                        float(cleaned)
                        numeric_count += 1
                    except (ValueError, TypeError):
                        pass

                if numeric_count / len(sample) > 0.8:  # 80% look numeric
                    self.report.issues.append(DataIssue(
                        column=col,
                        issue_type="incorrect_dtype",
                        severity=IssueSeverity.WARNING,
                        description=f"Column appears numeric but stored as object ({numeric_count}/{len(sample)} sample values parse as numbers after cleaning)",
                        affected_rows=int(len(df) * (numeric_count / len(sample))),
                        affected_percentage=float(numeric_count / len(sample)),
                        sample_values=sample.head(3).tolist(),
                        recommended_action=ActionType.COERCE_NUMERIC,
                        details={"numeric_ratio": numeric_count / len(sample)}
                    ))

        # Check if datetime stored as object
        if dtype == "object":
            non_null = df[col].dropna()
            if len(non_null) > 0:
                sample = non_null.head(50)
                date_count = 0
                for val in sample:
                    if self._looks_like_date(val):
                        date_count += 1

                if date_count / len(sample) > 0.7:
                    self.report.issues.append(DataIssue(
                        column=col,
                        issue_type="incorrect_dtype",
                        severity=IssueSeverity.INFO,
                        description=f"Column appears to contain dates but stored as object ({date_count}/{len(sample)} sample values look like dates)",
                        affected_rows=int(len(df) * (date_count / len(sample))),
                        affected_percentage=float(date_count / len(sample)),
                        sample_values=sample.head(3).tolist(),
                        recommended_action=ActionType.PARSE_DATES,
                        details={"date_ratio": date_count / len(sample)}
                    ))

    def _looks_like_date(self, val: Any) -> bool:
        """Check if a value looks like a date."""
        if not isinstance(val, str):
            return False
        val = val.strip()
        for fmt in self.DATE_FORMATS:
            try:
                datetime.strptime(val, fmt)
                return True
            except ValueError:
                continue
        return False

    def _check_duplicates_in_column(self, col: str) -> None:
        """Check for duplicate values in a column (potential ID column)."""
        df = self._df
        if df[col].dtype in ["object", "int64", "float64"]:
            nunique = df[col].nunique()
            total = len(df)
            if nunique == total and total > 1:
                # Could be an ID column - this is actually good, but note it
                pass

    def _check_categorical_consistency(self, col: str) -> None:
        """Check for inconsistent categorical values (case, spacing, etc.)."""
        df = self._df
        if df[col].dtype == "object":
            non_null = df[col].dropna().astype(str)
            if len(non_null) > 0:
                # Check for case inconsistency
                lower_counts = non_null.str.lower().value_counts()
                original_counts = non_null.value_counts()

                if len(lower_counts) < len(original_counts):
                    # There are case variations
                    variations = original_counts[original_counts.index.str.lower().duplicated(keep=False)]
                    if len(variations) > 0:
                        self.report.issues.append(DataIssue(
                            column=col,
                            issue_type="categorical_inconsistency",
                            severity=IssueSeverity.WARNING,
                            description=f"Column has case inconsistencies (e.g., 'Value' vs 'value')",
                            affected_rows=int(variations.sum()),
                            affected_percentage=float(variations.sum() / len(df)),
                            sample_values=variations.head(5).index.tolist(),
                            recommended_action=ActionType.FIX_CATEGORICAL,
                            details={"case_variations": variations.to_dict()}
                        ))

    def _check_numeric_validity(self, col: str) -> None:
        """Check numeric columns for invalid values (inf, extremely large)."""
        df = self._df
        if pd.api.types.is_numeric_dtype(df[col]):
            # Check for infinities
            inf_count = np.isinf(df[col]).sum()
            if inf_count > 0:
                self.report.issues.append(DataIssue(
                    column=col,
                    issue_type="infinite_values",
                    severity=IssueSeverity.CRITICAL,
                    description=f"Column contains {inf_count} infinite values",
                    affected_rows=int(inf_count),
                    affected_percentage=float(inf_count / len(df)),
                    sample_values=[],
                    recommended_action=ActionType.FILL_MISSING,
                    details={"inf_count": int(inf_count)}
                ))

            # Check for extremely large values (potential overflow)
            finite_vals = df[col][np.isfinite(df[col])]
            if len(finite_vals) > 0:
                max_val = finite_vals.max()
                min_val = finite_vals.min()
                if abs(max_val) > 1e15 or abs(min_val) > 1e15:
                    self.report.issues.append(DataIssue(
                        column=col,
                        issue_type="extreme_values",
                        severity=IssueSeverity.WARNING,
                        description=f"Column has extremely large values (max={max_val:.2e}, min={min_val:.2e})",
                        affected_rows=0,
                        affected_percentage=0.0,
                        sample_values=[float(max_val), float(min_val)],
                        details={"max": float(max_val), "min": float(min_val)}
                    ))

    def _check_date_validity(self, col: str) -> None:
        """Check date columns for invalid or out-of-range dates."""
        df = self._df
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            # Check for NaT (Not a Time)
            nat_count = df[col].isna().sum()
            if nat_count > 0:
                self.report.issues.append(DataIssue(
                    column=col,
                    issue_type="invalid_dates",
                    severity=IssueSeverity.WARNING,
                    description=f"Column has {nat_count} invalid/unparseable dates (NaT)",
                    affected_rows=int(nat_count),
                    affected_percentage=float(nat_count / len(df)),
                    sample_values=[],
                    recommended_action=ActionType.FILL_MISSING,
                    details={"nat_count": int(nat_count)}
                ))

            # Check for unreasonable dates (e.g., year < 1900 or > 2100)
            valid_dates = df[col].dropna()
            if len(valid_dates) > 0:
                year_min = valid_dates.dt.year.min()
                year_max = valid_dates.dt.year.max()
                if year_min < 1900 or year_max > 2100:
                    self.report.issues.append(DataIssue(
                        column=col,
                        issue_type="unreasonable_dates",
                        severity=IssueSeverity.WARNING,
                        description=f"Column has dates outside reasonable range (year {year_min}-{year_max})",
                        affected_rows=0,
                        affected_percentage=0.0,
                        sample_values=[str(year_min), str(year_max)],
                        details={"year_min": int(year_min), "year_max": int(year_max)}
                    ))

    def _check_constant_column(self, col: str) -> None:
        """Check if column has only one unique value (constant)."""
        df = self._df
        nunique = df[col].nunique(dropna=False)
        if nunique <= self.CONSTANT_COLUMN_THRESHOLD:
            self.report.issues.append(DataIssue(
                column=col,
                issue_type="constant_column",
                severity=IssueSeverity.WARNING,
                description=f"Column has only {nunique} unique value(s) - may not be useful for analysis",
                affected_rows=len(df),
                affected_percentage=1.0,
                sample_values=df[col].dropna().unique().tolist()[:3],
                recommended_action=ActionType.REMOVE_CONSTANT,
                details={"nunique": int(nunique)}
            ))

    def _check_high_cardinality(self, col: str) -> None:
        """Check for high cardinality categorical columns."""
        df = self._df
        if df[col].dtype == "object":
            nunique = df[col].nunique(dropna=True)
            total = len(df.dropna(subset=[col]))
            if total > 0 and nunique / total > self.HIGH_CARDINALITY_THRESHOLD:
                self.report.issues.append(DataIssue(
                    column=col,
                    issue_type="high_cardinality",
                    severity=IssueSeverity.WARNING,
                    description=f"Column has very high cardinality ({nunique} unique values, {nunique/total:.1%} of rows)",
                    affected_rows=0,
                    affected_percentage=float(nunique / total),
                    sample_values=df[col].dropna().unique()[:5].tolist(),
                    recommended_action=ActionType.REMOVE_HIGH_CARDINALITY,
                    details={"nunique": int(nunique), "total_non_null": int(total)}
                ))
            elif nunique > self.MAX_CATEGORIES_FOR_CATEGORICAL:
                self.report.issues.append(DataIssue(
                    column=col,
                    issue_type="high_cardinality",
                    severity=IssueSeverity.INFO,
                    description=f"Column has many categories ({nunique} unique values) - may not be suitable for categorical analysis",
                    affected_rows=0,
                    affected_percentage=0.0,
                    sample_values=df[col].dropna().unique()[:5].tolist(),
                    details={"nunique": int(nunique)}
                ))

    def _check_outliers(self, col: str) -> None:
        """Detect outliers using IQR and Z-score methods."""
        df = self._df
        if pd.api.types.is_numeric_dtype(df[col]):
            clean = df[col].dropna()
            if len(clean) > 4:  # Need at least a few values
                # IQR method
                Q1 = clean.quantile(0.25)
                Q3 = clean.quantile(0.75)
                IQR = Q3 - Q1
                lower = Q1 - self.OUTLIER_IQR_MULTIPLIER * IQR
                upper = Q3 + self.OUTLIER_IQR_MULTIPLIER * IQR
                iqr_outliers = clean[(clean < lower) | (clean > upper)]

                # Z-score method
                z_scores = np.abs((clean - clean.mean()) / clean.std())
                z_outliers = clean[z_scores > self.OUTLIER_Z_SCORE_THRESHOLD]

                total_outliers = len(set(iqr_outliers.index) | set(z_outliers.index))
                if total_outliers > 0:
                    pct = total_outliers / len(df)
                    self.report.issues.append(DataIssue(
                        column=col,
                        issue_type="outliers",
                        severity=IssueSeverity.INFO,
                        description=f"Column has {total_outliers} potential outliers (IQR: {len(iqr_outliers)}, Z-score: {len(z_outliers)})",
                        affected_rows=int(total_outliers),
                        affected_percentage=float(pct),
                        sample_values=pd.concat([iqr_outliers.head(2), z_outliers.head(2)]).unique().tolist(),
                        details={
                            "iqr_lower": float(lower),
                            "iqr_upper": float(upper),
                            "iqr_outliers": int(len(iqr_outliers)),
                            "z_outliers": int(len(z_outliers)),
                            "mean": float(clean.mean()),
                            "std": float(clean.std())
                        }
                    ))

    def _check_negative_values(self, col: str) -> None:
        """Check for negative values in columns that shouldn't have them."""
        df = self._df
        if pd.api.types.is_numeric_dtype(df[col]):
            # Heuristic: columns with names suggesting non-negative
            non_negative_hints = [
                "age", "count", "quantity", "amount", "price", "cost", "revenue",
                "salary", "income", "population", "area", "size", "length",
                "weight", "height", "duration", "time", "distance", "score",
                "rating", "percent", "ratio", "index", "id", "number", "num"
            ]
            col_lower = col.lower()
            if any(hint in col_lower for hint in non_negative_hints):
                neg_count = (df[col] < 0).sum()
                if neg_count > 0:
                    self.report.issues.append(DataIssue(
                        column=col,
                        issue_type="negative_values",
                        severity=IssueSeverity.WARNING,
                        description=f"Column likely should not have negative values but has {neg_count}",
                        affected_rows=int(neg_count),
                        affected_percentage=float(neg_count / len(df)),
                        sample_values=df[df[col] < 0][col].head(3).tolist(),
                        recommended_action=ActionType.FIX_NEGATIVE_VALUES,
                        details={"negative_count": int(neg_count)}
                    ))

    def _check_duplicate_rows(self) -> None:
        """Check for duplicate rows in the dataset."""
        df = self._df
        dup_count = df.duplicated().sum()
        if dup_count > 0:
            self.report.issues.append(DataIssue(
                column="__dataset__",
                issue_type="duplicate_rows",
                severity=IssueSeverity.WARNING,
                description=f"Dataset has {dup_count} duplicate rows",
                affected_rows=int(dup_count),
                affected_percentage=float(dup_count / len(df)),
                sample_values=[],
                recommended_action=ActionType.DROP_DUPLICATES,
                details={"duplicate_count": int(dup_count)}
            ))

    def _check_empty_dataset(self) -> None:
        """Check if dataset is empty."""
        df = self._df
        if len(df) == 0:
            self.report.issues.append(DataIssue(
                column="__dataset__",
                issue_type="empty_dataset",
                severity=IssueSeverity.CRITICAL,
                description="Dataset has no rows",
                affected_rows=0,
                affected_percentage=1.0,
                sample_values=[],
                details={}
            ))
        if len(df.columns) == 0:
            self.report.issues.append(DataIssue(
                column="__dataset__",
                issue_type="empty_dataset",
                severity=IssueSeverity.CRITICAL,
                description="Dataset has no columns",
                affected_rows=0,
                affected_percentage=1.0,
                sample_values=[],
                details={}
            ))

    def _check_single_column(self) -> None:
        """Check if dataset has only one column."""
        df = self._df
        if len(df.columns) == 1:
            self.report.issues.append(DataIssue(
                column="__dataset__",
                issue_type="single_column",
                severity=IssueSeverity.INFO,
                description="Dataset has only one column - limited analysis possible",
                affected_rows=0,
                affected_percentage=0.0,
                sample_values=[],
                details={"column": df.columns[0]}
            ))

    # ==================== CLEANING ACTIONS ====================

    def _apply_cleaning(self, aggressive: bool = False) -> None:
        """Apply cleaning actions based on issues found."""
        if self._df is None or self.report is None:
            return

        df = self._df

        # 1. Strip whitespace from string columns
        self._strip_whitespace()

        # 2. Drop duplicate rows
        self._drop_duplicate_rows()

        # 3. Coerce numeric columns
        self._coerce_numeric_columns()

        # 4. Parse date columns
        self._parse_date_columns()

        # 5. Fix categorical inconsistencies
        self._fix_categorical_inconsistencies()

        # 6. Handle missing values
        self._handle_missing_values(aggressive=aggressive)

        # 7. Fix negative values in non-negative columns
        self._fix_negative_values()

        # 8. Remove constant columns (if aggressive)
        if aggressive:
            self._remove_constant_columns()
            self._remove_high_cardinality_columns()

        # Update dataframe reference
        self._df = df

    def _strip_whitespace(self) -> None:
        """Strip whitespace from string columns."""
        if self._df is None or self.report is None:
            return
        df = self._df

        for col in df.select_dtypes(include=["object"]).columns:
            before_sample = df[col].dropna().head(3).tolist()
            df[col] = df[col].astype(str).str.strip()
            # Replace 'nan' string back to NaN
            df[col] = df[col].replace("nan", np.nan)
            after_sample = df[col].dropna().head(3).tolist()

            if before_sample != after_sample:
                self.report.actions_taken.append(PreprocessingAction(
                    column=col,
                    action=ActionType.STRIP_WHITESPACE,
                    reason="Removed leading/trailing whitespace from string values",
                    rows_affected=len(df),
                    before_sample=before_sample,
                    after_sample=after_sample
                ))

    def _drop_duplicate_rows(self) -> None:
        """Drop duplicate rows."""
        if self._df is None or self.report is None:
            return
        df = self._df

        dup_count = df.duplicated().sum()
        if dup_count > 0:
            before_shape = df.shape
            df.drop_duplicates(inplace=True)
            after_shape = df.shape

            self.report.actions_taken.append(PreprocessingAction(
                column="__dataset__",
                action=ActionType.DROP_DUPLICATES,
                reason=f"Removed {dup_count} duplicate rows",
                rows_affected=int(dup_count),
                before_sample=[f"Shape: {before_shape}"],
                after_sample=[f"Shape: {after_shape}"]
            ))

    def _coerce_numeric_columns(self) -> None:
        """Convert object columns that are mostly numeric to numeric type."""
        if self._df is None or self.report is None:
            return
        df = self._df

        for col in df.select_dtypes(include=["object"]).columns:
            # Check if issue exists for this column
            issue = next((i for i in self.report.issues
                         if i.column == col and i.issue_type == "incorrect_dtype"
                         and i.recommended_action == ActionType.COERCE_NUMERIC), None)
            if issue:
                before_sample = df[col].dropna().head(3).tolist()
                # Try to convert - clean currency/formatting first
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    # Clean common formatting characters
                    cleaned = df[col].astype(str).str.replace(r'[,$%]', '', regex=True).str.strip()
                    converted = pd.to_numeric(cleaned, errors="coerce")

                # Only apply if conversion successful for most values
                success_rate = converted.notna().sum() / df[col].notna().sum() if df[col].notna().sum() > 0 else 0
                if success_rate > 0.8:
                    df[col] = converted
                    after_sample = df[col].dropna().head(3).tolist()

                    self.report.actions_taken.append(PreprocessingAction(
                        column=col,
                        action=ActionType.COERCE_NUMERIC,
                        reason=f"Converted object column to numeric (success rate: {success_rate:.1%})",
                        rows_affected=int(df[col].notna().sum()),
                        before_sample=before_sample,
                        after_sample=after_sample,
                        warning=f"{int((1-success_rate)*100)}% of values could not be converted and became NaN" if success_rate < 1.0 else None
                    ))

    def _parse_date_columns(self) -> None:
        """Parse object columns that look like dates."""
        if self._df is None or self.report is None:
            return
        df = self._df

        for col in df.select_dtypes(include=["object"]).columns:
            issue = next((i for i in self.report.issues
                         if i.column == col and i.issue_type == "incorrect_dtype"
                         and i.recommended_action == ActionType.PARSE_DATES), None)
            if issue:
                before_sample = df[col].dropna().head(3).tolist()
                parsed = self._try_parse_dates(df[col])
                if parsed is not None:
                    df[col] = parsed
                    after_sample = df[col].dropna().head(3).tolist()

                    self.report.actions_taken.append(PreprocessingAction(
                        column=col,
                        action=ActionType.PARSE_DATES,
                        reason="Parsed date strings to datetime objects",
                        rows_affected=int(df[col].notna().sum()),
                        before_sample=before_sample,
                        after_sample=after_sample
                    ))

    def _try_parse_dates(self, series: pd.Series) -> Optional[pd.Series]:
        """Try to parse a series as dates using multiple formats."""
        for fmt in self.DATE_FORMATS:
            try:
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    parsed = pd.to_datetime(series, format=fmt, errors="coerce")
                if parsed.notna().sum() / series.notna().sum() > 0.7:
                    return parsed
            except Exception:
                continue
        # Try pandas inference as last resort
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                parsed = pd.to_datetime(series, infer_datetime_format=True, errors="coerce")
            if parsed.notna().sum() / series.notna().sum() > 0.7:
                return parsed
        except Exception:
            pass
        return None

    def _fix_categorical_inconsistencies(self) -> None:
        """Fix case inconsistencies in categorical columns."""
        if self._df is None or self.report is None:
            return
        df = self._df

        for col in df.select_dtypes(include=["object"]).columns:
            issue = next((i for i in self.report.issues
                         if i.column == col and i.issue_type == "categorical_inconsistency"), None)
            if issue:
                before_sample = df[col].dropna().head(3).tolist()
                # Standardize to title case
                df[col] = df[col].astype(str).str.strip().str.title()
                df[col] = df[col].replace("Nan", np.nan)
                after_sample = df[col].dropna().head(3).tolist()

                self.report.actions_taken.append(PreprocessingAction(
                    column=col,
                    action=ActionType.FIX_CATEGORICAL,
                    reason="Standardized categorical values to Title Case",
                    rows_affected=int(df[col].notna().sum()),
                    before_sample=before_sample,
                    after_sample=after_sample
                ))

    def _handle_missing_values(self, aggressive: bool = False) -> None:
        """Handle missing values based on column type and missing percentage."""
        if self._df is None or self.report is None:
            return
        df = self._df

        for col in df.columns:
            missing = df[col].isna().sum()
            if missing == 0:
                continue

            pct = missing / len(df)
            issue = next((i for i in self.report.issues
                         if i.column == col and i.issue_type == "missing_values"), None)

            if issue and issue.severity == IssueSeverity.CRITICAL:
                # Critical missing - drop rows (aggressive) or flag
                if aggressive:
                    before_rows = len(df)
                    df.dropna(subset=[col], inplace=True)
                    after_rows = len(df)

                    self.report.actions_taken.append(PreprocessingAction(
                        column=col,
                        action=ActionType.DROP_MISSING_ROWS,
                        reason=f"Dropped rows with missing values in critical column ({pct:.1%} missing)",
                        rows_affected=before_rows - after_rows,
                        before_sample=[f"Rows: {before_rows}"],
                        after_sample=[f"Rows: {after_rows}"],
                        warning=f"Dropped {before_rows - after_rows} rows ({pct:.1%} of data)"
                    ))
            elif issue and issue.severity == IssueSeverity.WARNING:
                # High missing - fill with appropriate strategy
                if pd.api.types.is_numeric_dtype(df[col]):
                    fill_val = df[col].median()
                    method = "median"
                elif pd.api.types.is_datetime64_any_dtype(df[col]):
                    fill_val = df[col].mode().iloc[0] if not df[col].mode().empty else pd.NaT
                    method = "mode"
                else:
                    fill_val = df[col].mode().iloc[0] if not df[col].mode().empty else "Unknown"
                    method = "mode"

                before_sample = df[col].dropna().head(3).tolist()
                df[col] = df[col].fillna(fill_val)
                after_sample = df[col].head(3).tolist()

                self.report.actions_taken.append(PreprocessingAction(
                    column=col,
                    action=ActionType.FILL_MISSING,
                    reason=f"Filled missing values with {method} ({pct:.1%} missing)",
                    rows_affected=int(missing),
                    before_sample=before_sample,
                    after_sample=after_sample,
                    warning=f"Imputed {missing} values with {method}" if pct > 0.1 else None
                ))
            elif issue and issue.severity == IssueSeverity.INFO and aggressive:
                # Low missing - fill if aggressive mode
                if pd.api.types.is_numeric_dtype(df[col]):
                    fill_val = df[col].median()
                else:
                    fill_val = df[col].mode().iloc[0] if not df[col].mode().empty else "Unknown"

                before_sample = df[col].dropna().head(3).tolist()
                df[col] = df[col].fillna(fill_val)
                after_sample = df[col].head(3).tolist()

                self.report.actions_taken.append(PreprocessingAction(
                    column=col,
                    action=ActionType.FILL_MISSING,
                    reason=f"Filled minor missing values ({pct:.1%})",
                    rows_affected=int(missing),
                    before_sample=before_sample,
                    after_sample=after_sample
                ))

    def _fix_negative_values(self) -> None:
        """Fix negative values in columns that shouldn't have them."""
        if self._df is None or self.report is None:
            return
        df = self._df

        for col in df.select_dtypes(include=[np.number]).columns:
            issue = next((i for i in self.report.issues
                         if i.column == col and i.issue_type == "negative_values"), None)
            if issue:
                neg_mask = df[col] < 0
                neg_count = neg_mask.sum()
                if neg_count > 0:
                    before_sample = df[col].head(3).tolist()
                    # Replace negatives with NaN then fill with median
                    df.loc[neg_mask, col] = np.nan
                    fill_val = df[col].median()
                    df[col] = df[col].fillna(fill_val)
                    after_sample = df[col].head(3).tolist()

                    self.report.actions_taken.append(PreprocessingAction(
                        column=col,
                        action=ActionType.FIX_NEGATIVE_VALUES,
                        reason=f"Replaced {neg_count} negative values with column median",
                        rows_affected=int(neg_count),
                        before_sample=before_sample,
                        after_sample=after_sample,
                        warning=f"Negative values replaced - verify this is appropriate for your data"
                    ))

    def _remove_constant_columns(self) -> None:
        """Remove columns with only one unique value."""
        if self._df is None or self.report is None:
            return
        df = self._df

        for col in df.columns:
            issue = next((i for i in self.report.issues
                         if i.column == col and i.issue_type == "constant_column"), None)
            if issue:
                before_sample = [f"Column: {col}, Unique: {df[col].nunique()}"]
                df.drop(columns=[col], inplace=True)

                self.report.actions_taken.append(PreprocessingAction(
                    column=col,
                    action=ActionType.REMOVE_CONSTANT,
                    reason="Removed constant column (no analytical value)",
                    rows_affected=0,
                    before_sample=before_sample,
                    after_sample=[f"Column removed"],
                    warning="Column permanently removed from dataset"
                ))

    def _remove_high_cardinality_columns(self) -> None:
        """Remove extremely high cardinality columns (likely IDs)."""
        if self._df is None or self.report is None:
            return
        df = self._df

        for col in df.select_dtypes(include=["object"]).columns:
            issue = next((i for i in self.report.issues
                         if i.column == col and i.issue_type == "high_cardinality"
                         and i.recommended_action == ActionType.REMOVE_HIGH_CARDINALITY), None)
            if issue:
                before_sample = [f"Column: {col}, Unique: {df[col].nunique()}"]
                df.drop(columns=[col], inplace=True)

                self.report.actions_taken.append(PreprocessingAction(
                    column=col,
                    action=ActionType.REMOVE_HIGH_CARDINALITY,
                    reason="Removed high cardinality column (likely identifier, not analytical)",
                    rows_affected=0,
                    before_sample=before_sample,
                    after_sample=[f"Column removed"],
                    warning="Column permanently removed - verify it's not needed for joins"
                ))

    # ==================== REPORT FINALIZATION ====================

    def _finalize_report(self) -> None:
        """Finalize the preprocessing report with status and recommendations."""
        if self._df is None or self.report is None:
            return

        df = self._df

        # Update final state
        self.report.final_shape = df.shape
        self.report.final_dtypes = df.dtypes.astype(str).to_dict()
        self.report.final_missing = int(df.isna().sum().sum())

        # Determine status
        critical_count = sum(1 for i in self.report.issues if i.severity == IssueSeverity.CRITICAL)
        warning_count = sum(1 for i in self.report.issues if i.severity == IssueSeverity.WARNING)

        if critical_count > 0:
            self.report.status = "critical_issues"
            self.report.critical_issues = [
                f"{i.column}: {i.description}" for i in self.report.issues
                if i.severity == IssueSeverity.CRITICAL
            ]
        elif warning_count > 0:
            self.report.status = "ready_with_warnings"
            self.report.warnings = [
                f"{i.column}: {i.description}" for i in self.report.issues
                if i.severity == IssueSeverity.WARNING
            ]
        else:
            self.report.status = "ready"

        # Generate user recommendations
        self._generate_recommendations()

    def _generate_recommendations(self) -> None:
        """Generate actionable recommendations for the user."""
        if self.report is None:
            return

        recs = []

        # Missing data recommendations
        high_missing = [i for i in self.report.issues
                       if i.issue_type == "missing_values" and i.severity in [IssueSeverity.WARNING, IssueSeverity.CRITICAL]]
        if high_missing:
            cols = [i.column for i in high_missing]
            recs.append(f"Consider investigating missing data in columns: {', '.join(cols)}. "
                       f"Missingness may indicate data collection issues.")

        # Duplicate rows
        if any(i.issue_type == "duplicate_rows" for i in self.report.issues):
            recs.append("Duplicate rows were detected and removed. Verify this is expected for your data source.")

        # Type conversions
        type_issues = [i for i in self.report.issues if i.issue_type == "incorrect_dtype"]
        if type_issues:
            recs.append(f"Column type corrections applied to: {', '.join(i.column for i in type_issues)}. "
                       "Verify the converted data matches your expectations.")

        # Outliers
        outlier_cols = [i.column for i in self.report.issues if i.issue_type == "outliers"]
        if outlier_cols:
            recs.append(f"Outliers detected in: {', '.join(outlier_cols)}. "
                       "Consider whether to keep, cap, or investigate these values.")

        # High cardinality
        high_card = [i.column for i in self.report.issues
                    if i.issue_type == "high_cardinality" and i.severity == IssueSeverity.WARNING]
        if high_card:
            recs.append(f"High cardinality columns: {', '.join(high_card)}. "
                       "These may be ID columns - consider excluding from categorical analysis.")

        # Constant columns
        const_cols = [i.column for i in self.report.issues if i.issue_type == "constant_column"]
        if const_cols:
            recs.append(f"Constant columns detected: {', '.join(const_cols)}. "
                       "These provide no analytical value and can be removed.")

        # Negative values
        neg_cols = [i.column for i in self.report.issues if i.issue_type == "negative_values"]
        if neg_cols:
            recs.append(f"Negative values in presumably non-negative columns: {', '.join(neg_cols)}. "
                       "Verify if negatives are valid or data entry errors.")

        # General
        if self.report.original_shape[0] != self.report.final_shape[0]:
            rows_removed = self.report.original_shape[0] - self.report.final_shape[0]
            recs.append(f"{rows_removed} rows removed during cleaning. "
                       f"Original: {self.report.original_shape[0]}, Final: {self.report.final_shape[0]}")

        if self.report.original_shape[1] != self.report.final_shape[1]:
            cols_removed = self.report.original_shape[1] - self.report.final_shape[1]
            recs.append(f"{cols_removed} columns removed during cleaning. "
                       f"Original: {self.report.original_shape[1]}, Final: {self.report.final_shape[1]}")

        if not recs:
            recs.append("Dataset is clean and ready for analysis!")

        self.report.user_recommendations = recs

    # ==================== REPORT OUTPUT ====================

    def to_dict(self) -> dict:
        """Convert report to dictionary for JSON serialization."""
        if self.report is None:
            return {}

        return {
            "dataset_id": self.report.dataset_id,
            "dataset_name": self.report.dataset_name,
            "timestamp": self.report.timestamp,
            "status": self.report.status,
            "original_shape": self.report.original_shape,
            "final_shape": self.report.final_shape,
            "original_missing": self.report.original_missing,
            "final_missing": self.report.final_missing,
            "original_duplicates": self.report.original_duplicates,
            "issues": [
                {
                    "column": i.column,
                    "issue_type": i.issue_type,
                    "severity": i.severity.value,
                    "description": i.description,
                    "affected_rows": i.affected_rows,
                    "affected_percentage": i.affected_percentage,
                    "sample_values": i.sample_values[:5],  # Limit samples
                    "recommended_action": i.recommended_action.value if i.recommended_action else None,
                    "details": i.details,
                }
                for i in self.report.issues
            ],
            "actions_taken": [
                {
                    "column": a.column,
                    "action": a.action.value,
                    "reason": a.reason,
                    "rows_affected": a.rows_affected,
                    "before_sample": a.before_sample[:3],
                    "after_sample": a.after_sample[:3],
                    "warning": a.warning,
                }
                for a in self.report.actions_taken
            ],
            "warnings": self.report.warnings,
            "critical_issues": self.report.critical_issues,
            "user_recommendations": self.report.user_recommendations,
        }

    def to_summary_string(self) -> str:
        """Generate a human-readable summary of the preprocessing report."""
        if self.report is None:
            return "No report available."

        r = self.report
        lines = [
            f"+{'='*60}+",
            f"| PREPROCESSING REPORT: {r.dataset_name} ({r.dataset_id})",
            f"| Generated: {r.timestamp}",
            f"| Status: {r.status.upper().replace('_', ' ')}",
            f"+{'='*60}+",
            f"| SHAPE: {r.original_shape[0]} rows x {r.original_shape[1]} cols -> {r.final_shape[0]} rows x {r.final_shape[1]} cols",
            f"| MISSING: {r.original_missing} -> {r.final_missing}",
            f"| DUPLICATES: {r.original_duplicates} removed",
            f"+{'='*60}+",
        ]

        # Issues summary
        critical = [i for i in r.issues if i.severity == IssueSeverity.CRITICAL]
        warnings = [i for i in r.issues if i.severity == IssueSeverity.WARNING]
        infos = [i for i in r.issues if i.severity == IssueSeverity.INFO]

        if critical:
            lines.append(f"| CRITICAL ISSUES ({len(critical)}):")
            for i in critical:
                lines.append(f"|   * {i.column}: {i.description}")
        if warnings:
            lines.append(f"| WARNINGS ({len(warnings)}):")
            for i in warnings:
                lines.append(f"|   * {i.column}: {i.description}")
        if infos:
            lines.append(f"| INFO ({len(infos)}):")
            for i in infos[:5]:  # Limit info display
                lines.append(f"|   * {i.column}: {i.description}")
            if len(infos) > 5:
                lines.append(f"|   ... and {len(infos) - 5} more")

        # Actions taken
        if r.actions_taken:
            lines.append(f"+{'='*60}+")
            lines.append(f"| ACTIONS TAKEN ({len(r.actions_taken)}):")
            for a in r.actions_taken:
                lines.append(f"|   * {a.column}: {a.action.value} - {a.reason}")
                if a.warning:
                    lines.append(f"|     WARNING: {a.warning}")

        # Recommendations
        if r.user_recommendations:
            lines.append(f"+{'='*60}+")
            lines.append(f"| RECOMMENDATIONS:")
            for rec in r.user_recommendations:
                lines.append(f"|   -> {rec}")

        lines.append(f"+{'='*60}+")

        return "\n".join(lines)

    def get_status_badge(self) -> str:
        """Get a status badge string for UI display."""
        if self.report is None:
            return "❓ UNKNOWN"

        status_map = {
            "ready": "✅ READY",
            "ready_with_warnings": "⚠️ READY WITH WARNINGS",
            "critical_issues": "❌ CRITICAL ISSUES",
            "pending": "⏳ PENDING",
        }
        return status_map.get(self.report.status, self.report.status.upper())


# Convenience function for quick preprocessing
def preprocess_dataset(
    df: pd.DataFrame,
    dataset_id: str,
    dataset_name: str,
    auto_clean: bool = True,
    aggressive_clean: bool = False,
) -> tuple[pd.DataFrame, PreprocessingReport]:
    """Quick function to preprocess a dataset."""
    service = PreprocessingService()
    return service.process_dataset(df, dataset_id, dataset_name, auto_clean, aggressive_clean)


def validate_dataset(
    df: pd.DataFrame,
    dataset_id: str,
    dataset_name: str,
) -> PreprocessingReport:
    """Quick function to validate a dataset without cleaning."""
    service = PreprocessingService()
    return service.validate_only(df, dataset_id, dataset_name)