from __future__ import annotations

import json
from pathlib import Path

import pandas as pd


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[4]

RAW_DATA_PATH = (
    PROJECT_ROOT
    / "datasets"
    / "disease_prediction"
    / "raw"
    / "Final_Augmented_dataset_Diseases_and_Symptoms.csv"
)

PROCESSED_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "disease_prediction"
    / "processed"
)

REPORT_PATH = PROCESSED_DIR / "audit_report.json"


# ============================================================
# CONFIGURATION
# ============================================================

TARGET_COLUMN = "diseases"

MIN_SAMPLES_PER_CLASS = 100


# ============================================================
# LOAD DATA
# ============================================================

def load_dataset() -> pd.DataFrame:
    """Load the raw disease/symptom dataset."""

    if not RAW_DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at: {RAW_DATA_PATH}"
        )

    print(f"Loading dataset from:\n{RAW_DATA_PATH}")

    df = pd.read_csv(RAW_DATA_PATH)

    print(f"Loaded dataset with shape: {df.shape}")

    return df


# ============================================================
# BASIC DATASET INFORMATION
# ============================================================

def inspect_basic_information(df: pd.DataFrame) -> dict:
    """Collect basic dataset information."""

    feature_columns = [
        column for column in df.columns
        if column != TARGET_COLUMN
    ]

    return {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "target_column": TARGET_COLUMN,
        "feature_count": len(feature_columns),
        "feature_columns": feature_columns,
        "data_types": {
            column: str(dtype)
            for column, dtype in df.dtypes.items()
        },
    }


# ============================================================
# MISSING VALUES
# ============================================================

def inspect_missing_values(df: pd.DataFrame) -> dict:
    """Inspect missing values."""

    missing = df.isna().sum()

    columns_with_missing = {
        column: int(count)
        for column, count in missing.items()
        if count > 0
    }

    return {
        "total_missing_values": int(missing.sum()),
        "columns_with_missing_values": columns_with_missing,
    }


# ============================================================
# DUPLICATES
# ============================================================

def inspect_duplicates(df: pd.DataFrame) -> dict:
    """Inspect exact duplicate rows."""

    duplicate_count = int(df.duplicated().sum())

    return {
        "duplicate_rows": duplicate_count,
        "duplicate_percentage": round(
            duplicate_count / len(df) * 100,
            4,
        ),
        "unique_rows": int(df.drop_duplicates().shape[0]),
    }


# ============================================================
# SYMPTOM PATTERNS
# ============================================================

def inspect_symptom_patterns(df: pd.DataFrame) -> dict:
    """Analyze unique symptom vectors."""

    X = df.drop(columns=[TARGET_COLUMN])

    unique_patterns = int(X.drop_duplicates().shape[0])

    repeated_patterns = len(df) - unique_patterns

    return {
        "total_rows": int(len(df)),
        "unique_symptom_patterns": unique_patterns,
        "repeated_symptom_patterns": int(repeated_patterns),
        "unique_pattern_percentage": round(
            unique_patterns / len(df) * 100,
            4,
        ),
    }


# ============================================================
# CLASS DISTRIBUTION
# ============================================================

def inspect_class_distribution(df: pd.DataFrame) -> dict:
    """Analyze disease/class distribution."""

    counts = df[TARGET_COLUMN].value_counts()

    return {
        "number_of_classes": int(counts.shape[0]),
        "minimum_samples_per_class": int(counts.min()),
        "maximum_samples_per_class": int(counts.max()),
        "mean_samples_per_class": round(float(counts.mean()), 4),
        "median_samples_per_class": float(counts.median()),

        "classes_at_least_10": int((counts >= 10).sum()),
        "classes_at_least_25": int((counts >= 25).sum()),
        "classes_at_least_50": int((counts >= 50).sum()),
        "classes_at_least_100": int((counts >= 100).sum()),
        "classes_at_least_200": int((counts >= 200).sum()),
        "classes_at_least_500": int((counts >= 500).sum()),
        "classes_at_least_1000": int((counts >= 1000).sum()),

        "class_distribution": {
            str(label): int(count)
            for label, count in counts.items()
        },
    }


# ============================================================
# CONFLICTING SYMPTOM PATTERNS
# ============================================================

def inspect_conflicting_patterns(df: pd.DataFrame) -> dict:
    """
    Find symptom patterns associated with multiple diseases.

    A symptom vector is considered conflicting if the exact same
    symptom combination appears with more than one target class.
    """

    X = df.drop(columns=[TARGET_COLUMN])

    grouped = (
        df.groupby(list(X.columns), sort=False)[TARGET_COLUMN]
        .nunique()
    )

    conflict_counts = grouped[grouped > 1]

    return {
        "unique_symptom_patterns": int(len(grouped)),
        "conflicting_patterns": int(len(conflict_counts)),
        "conflict_percentage": round(
            len(conflict_counts) / len(grouped) * 100,
            4,
        ),
        "maximum_diseases_for_one_pattern": int(grouped.max()),
        "patterns_by_number_of_diseases": {
            str(int(number_of_diseases)): int(count)
            for number_of_diseases, count
            in grouped.value_counts().sort_index().items()
        },
    }


# ============================================================
# FEATURE TYPES
# ============================================================

def inspect_features(df: pd.DataFrame) -> dict:
    """Inspect feature characteristics."""

    feature_columns = [
        column for column in df.columns
        if column != TARGET_COLUMN
    ]

    feature_info = {}

    for column in feature_columns:
        unique_values = df[column].dropna().unique()

        feature_info[column] = {
            "dtype": str(df[column].dtype),
            "unique_values": [
                int(value)
                if hasattr(value, "item")
                else value
                for value in unique_values[:20]
            ],
            "unique_value_count": int(
                df[column].nunique(dropna=True)
            ),
        }

    return {
        "feature_count": len(feature_columns),
        "features": feature_info,
    }


# ============================================================
# FILTERING ANALYSIS
# ============================================================

def inspect_filtered_dataset(df: pd.DataFrame) -> dict:
    """
    Analyze the dataset after applying the minimum
    samples-per-class threshold.
    """

    class_counts = df[TARGET_COLUMN].value_counts()

    selected_classes = class_counts[
        class_counts >= MIN_SAMPLES_PER_CLASS
    ].index

    filtered_df = df[
        df[TARGET_COLUMN].isin(selected_classes)
    ].copy()

    X = filtered_df.drop(columns=[TARGET_COLUMN])

    grouped = (
        filtered_df.groupby(list(X.columns), sort=False)[TARGET_COLUMN]
        .nunique()
    )

    return {
        "minimum_samples_per_class": MIN_SAMPLES_PER_CLASS,
        "rows": int(len(filtered_df)),
        "classes": int(filtered_df[TARGET_COLUMN].nunique()),
        "unique_symptom_patterns": int(
            X.drop_duplicates().shape[0]
        ),
        "duplicate_rows": int(
            filtered_df.duplicated().sum()
        ),
        "conflicting_patterns": int(
            (grouped > 1).sum()
        ),
        "conflict_percentage": round(
            (grouped > 1).sum() / len(grouped) * 100,
            4,
        ),
    }


# ============================================================
# MAIN AUDIT
# ============================================================

def run_audit() -> dict:
    """Run the complete dataset audit."""

    print("\n" + "=" * 70)
    print("HealthGPT AI — Disease Prediction Dataset Audit")
    print("=" * 70)

    df = load_dataset()

    if TARGET_COLUMN not in df.columns:
        raise ValueError(
            f"Target column '{TARGET_COLUMN}' was not found."
        )

    report = {
        "dataset": {
            "filename": RAW_DATA_PATH.name,
            "absolute_path": str(RAW_DATA_PATH),
        },

        "basic_information": inspect_basic_information(df),

        "missing_values": inspect_missing_values(df),

        "duplicates": inspect_duplicates(df),

        "symptom_patterns": inspect_symptom_patterns(df),

        "class_distribution": inspect_class_distribution(df),

        "conflicting_patterns": inspect_conflicting_patterns(df),

        "features": inspect_features(df),

        "filtered_dataset": inspect_filtered_dataset(df),
    }

    PROCESSED_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    with REPORT_PATH.open(
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            report,
            file,
            indent=2,
            ensure_ascii=False,
        )

    print("\n" + "=" * 70)
    print("AUDIT COMPLETE")
    print("=" * 70)

    print(f"\nRows: {report['basic_information']['rows']}")
    print(
        f"Features: "
        f"{report['basic_information']['feature_count']}"
    )
    print(
        f"Diseases: "
        f"{report['class_distribution']['number_of_classes']}"
    )

    print(
        f"Duplicate rows: "
        f"{report['duplicates']['duplicate_rows']}"
    )

    print(
        f"Unique symptom patterns: "
        f"{report['symptom_patterns']['unique_symptom_patterns']}"
    )

    print(
        f"Conflicting patterns: "
        f"{report['conflicting_patterns']['conflicting_patterns']}"
    )

    print(
        f"Filtered diseases (>= {MIN_SAMPLES_PER_CLASS} samples): "
        f"{report['filtered_dataset']['classes']}"
    )

    print(
        f"\nReport saved to:\n{REPORT_PATH}"
    )

    return report


if __name__ == "__main__":
    run_audit()