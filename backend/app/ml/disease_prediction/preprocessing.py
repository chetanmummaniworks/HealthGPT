from __future__ import annotations

from pathlib import Path

import pandas as pd


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

OUTPUT_PATH = (
    PROCESSED_DIR
    / "canonical_patterns.csv"
)

TARGET_COLUMN = "diseases"

MIN_SAMPLES_PER_CLASS = 100


def load_raw_dataset() -> pd.DataFrame:
    """Load the raw dataset."""

    if not RAW_DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {RAW_DATA_PATH}"
        )

    return pd.read_csv(RAW_DATA_PATH)


def filter_classes(df: pd.DataFrame) -> pd.DataFrame:
    """
    Keep only diseases with at least MIN_SAMPLES_PER_CLASS
    observations.
    """

    class_counts = df[TARGET_COLUMN].value_counts()

    valid_classes = class_counts[
        class_counts >= MIN_SAMPLES_PER_CLASS
    ].index

    filtered = df[
        df[TARGET_COLUMN].isin(valid_classes)
    ].copy()

    return filtered


def create_pattern_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Convert individual observations into unique symptom patterns.

    For each symptom pattern we determine:
    - total occurrences
    - number of associated diseases
    - dominant disease
    - dominant disease count
    - dominance ratio
    """

    symptom_columns = [
        column
        for column in df.columns
        if column != TARGET_COLUMN
    ]

    grouped = (
        df.groupby(
            symptom_columns,
            sort=False,
            dropna=False,
        )[TARGET_COLUMN]
        .value_counts()
        .rename("disease_count")
        .reset_index()
    )

    # Total occurrences for each symptom pattern.
    pattern_totals = (
        grouped
        .groupby(symptom_columns)["disease_count"]
        .sum()
        .rename("pattern_count")
        .reset_index()
    )

    # Number of distinct diseases associated with each pattern.
    disease_counts = (
        grouped
        .groupby(symptom_columns)[TARGET_COLUMN]
        .nunique()
        .rename("associated_disease_count")
        .reset_index()
    )

    # Select the most frequent disease for each pattern.
    dominant = (
        grouped
        .sort_values(
            symptom_columns + ["disease_count"],
            ascending=[True] * len(symptom_columns) + [False],
        )
        .drop_duplicates(
            subset=symptom_columns,
            keep="first",
        )
    )

    dominant = dominant[
        symptom_columns
        + [TARGET_COLUMN, "disease_count"]
    ].rename(
        columns={
            TARGET_COLUMN: "dominant_disease",
            "disease_count": "dominant_disease_count",
        }
    )

    result = pattern_totals.merge(
        disease_counts,
        on=symptom_columns,
        how="left",
    )

    result = result.merge(
        dominant,
        on=symptom_columns,
        how="left",
    )

    result["dominance_ratio"] = (
        result["dominant_disease_count"]
        / result["pattern_count"]
    )

    return result


def save_dataset(df: pd.DataFrame) -> None:
    """Save the canonical symptom-pattern dataset."""

    PROCESSED_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    df.to_csv(
        OUTPUT_PATH,
        index=False,
    )


def main() -> None:

    print("=" * 70)
    print("HealthGPT AI — Disease Prediction Preprocessing")
    print("=" * 70)

    print("\nLoading raw dataset...")

    df = load_raw_dataset()

    print(f"Original shape: {df.shape}")

    print(
        f"\nFiltering diseases with "
        f">= {MIN_SAMPLES_PER_CLASS} samples..."
    )

    filtered = filter_classes(df)

    print(
        f"Filtered shape: {filtered.shape}"
    )

    print(
        f"Diseases remaining: "
        f"{filtered[TARGET_COLUMN].nunique()}"
    )

    print("\nCreating canonical symptom patterns...")

    canonical = create_pattern_dataset(
        filtered
    )

    print(
        f"Canonical patterns: "
        f"{len(canonical)}"
    )

    print(
        "\nDominance ratio statistics:"
    )

    print(
        canonical["dominance_ratio"]
        .describe()
        .to_string()
    )

    print(
        "\nHighly ambiguous patterns "
        "(dominance ratio < 0.5):"
    )

    ambiguous = (
        canonical["dominance_ratio"] < 0.5
    ).sum()

    print(ambiguous)

    save_dataset(canonical)

    print(
        f"\nSaved canonical dataset to:\n"
        f"{OUTPUT_PATH}"
    )


if __name__ == "__main__":
    main()