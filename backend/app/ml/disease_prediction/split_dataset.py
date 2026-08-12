from __future__ import annotations

from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[4]

PROCESSED_DIR = (
    PROJECT_ROOT
    / "datasets"
    / "disease_prediction"
    / "processed"
)

INPUT_PATH = PROCESSED_DIR / "canonical_patterns.csv"

TRAIN_PATH = PROCESSED_DIR / "train.csv"
VALIDATION_PATH = PROCESSED_DIR / "validation.csv"
TEST_PATH = PROCESSED_DIR / "test.csv"
AMBIGUOUS_PATH = PROCESSED_DIR / "ambiguous.csv"


# ============================================================
# CONFIGURATION
# ============================================================

TARGET_COLUMN = "dominant_disease"

DOMINANCE_THRESHOLD = 0.5

TEST_SIZE = 0.15
VALIDATION_SIZE = 0.15

RANDOM_STATE = 42


# ============================================================
# LOAD DATA
# ============================================================

def load_dataset() -> pd.DataFrame:
    """Load the canonical symptom-pattern dataset."""

    if not INPUT_PATH.exists():
        raise FileNotFoundError(
            f"Canonical dataset not found: {INPUT_PATH}"
        )

    return pd.read_csv(INPUT_PATH)


# ============================================================
# REMOVE METADATA FROM MODEL FEATURES
# ============================================================

def get_feature_columns(df: pd.DataFrame) -> list[str]:
    """Return the actual symptom columns."""

    metadata_columns = {
        "pattern_count",
        "associated_disease_count",
        "dominant_disease",
        "dominant_disease_count",
        "dominance_ratio",
    }

    return [
        column
        for column in df.columns
        if column not in metadata_columns
    ]


# ============================================================
# MAIN SPLIT
# ============================================================

def main() -> None:

    print("=" * 70)
    print("HealthGPT AI — Dataset Split")
    print("=" * 70)

    df = load_dataset()

    print(f"\nCanonical dataset: {df.shape}")

    # --------------------------------------------------------
    # Separate ambiguous patterns
    # --------------------------------------------------------

    ambiguous = df[
        df["dominance_ratio"] < DOMINANCE_THRESHOLD
    ].copy()

    modeling_df = df[
        df["dominance_ratio"] >= DOMINANCE_THRESHOLD
    ].copy()

    print(
        f"\nModeling patterns: {len(modeling_df)}"
    )

    print(
        f"Ambiguous patterns: {len(ambiguous)}"
    )

    # --------------------------------------------------------
    # Check class counts
    # --------------------------------------------------------

    class_counts = (
        modeling_df[TARGET_COLUMN]
        .value_counts()
    )

    print(
        f"\nNumber of diseases: "
        f"{len(class_counts)}"
    )

    print(
        "\nMinimum patterns per disease:",
        class_counts.min(),
    )

    # --------------------------------------------------------
    # First split:
    #
    # 70% train
    # 30% temporary
    # --------------------------------------------------------

    train_df, temp_df = train_test_split(
        modeling_df,
        test_size=TEST_SIZE + VALIDATION_SIZE,
        random_state=RANDOM_STATE,
        stratify=modeling_df[TARGET_COLUMN],
    )

    # --------------------------------------------------------
    # Second split:
    #
    # temporary → validation + test
    #
    # 15% validation
    # 15% test
    # --------------------------------------------------------

    relative_test_size = (
        TEST_SIZE
        / (TEST_SIZE + VALIDATION_SIZE)
    )

    validation_df, test_df = train_test_split(
        temp_df,
        test_size=relative_test_size,
        random_state=RANDOM_STATE,
        stratify=temp_df[TARGET_COLUMN],
    )

    # --------------------------------------------------------
    # Save datasets
    # --------------------------------------------------------

    train_df.to_csv(
        TRAIN_PATH,
        index=False,
    )

    validation_df.to_csv(
        VALIDATION_PATH,
        index=False,
    )

    test_df.to_csv(
        TEST_PATH,
        index=False,
    )

    ambiguous.to_csv(
        AMBIGUOUS_PATH,
        index=False,
    )

    # --------------------------------------------------------
    # Report
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("SPLIT COMPLETE")
    print("=" * 70)

    print(
        f"\nTrain:      {len(train_df):,} "
        f"({len(train_df) / len(modeling_df) * 100:.2f}%)"
    )

    print(
        f"Validation: {len(validation_df):,} "
        f"({len(validation_df) / len(modeling_df) * 100:.2f}%)"
    )

    print(
        f"Test:       {len(test_df):,} "
        f"({len(test_df) / len(modeling_df) * 100:.2f}%)"
    )

    print(
        f"Ambiguous:  {len(ambiguous):,}"
    )

    print("\nDisease counts:")

    print(
        "Train:",
        train_df[TARGET_COLUMN].nunique(),
    )

    print(
        "Validation:",
        validation_df[TARGET_COLUMN].nunique(),
    )

    print(
        "Test:",
        test_df[TARGET_COLUMN].nunique(),
    )

    # --------------------------------------------------------
    # Verify no symptom pattern leakage
    # --------------------------------------------------------

    feature_columns = get_feature_columns(
        modeling_df
    )

    train_patterns = set(
        map(
            tuple,
            train_df[feature_columns].to_numpy(),
        )
    )

    validation_patterns = set(
        map(
            tuple,
            validation_df[feature_columns].to_numpy(),
        )
    )

    test_patterns = set(
        map(
            tuple,
            test_df[feature_columns].to_numpy(),
        )
    )

    train_val_overlap = (
        len(train_patterns & validation_patterns)
    )

    train_test_overlap = (
        len(train_patterns & test_patterns)
    )

    validation_test_overlap = (
        len(validation_patterns & test_patterns)
    )

    print("\nPattern leakage check:")

    print(
        "Train ↔ Validation:",
        train_val_overlap,
    )

    print(
        "Train ↔ Test:",
        train_test_overlap,
    )

    print(
        "Validation ↔ Test:",
        validation_test_overlap,
    )

    if any(
        value != 0
        for value in [
            train_val_overlap,
            train_test_overlap,
            validation_test_overlap,
        ]
    ):
        raise RuntimeError(
            "Symptom-pattern leakage detected!"
        )

    print(
        "\n✓ No symptom-pattern leakage detected."
    )

    print(
        f"\nFiles saved to:\n{PROCESSED_DIR}"
    )


if __name__ == "__main__":
    main()