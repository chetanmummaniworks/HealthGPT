from __future__ import annotations

from pathlib import Path

import pandas as pd


# ============================================================
# PATH
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[4]

TRAIN_PATH = (
    PROJECT_ROOT
    / "datasets"
    / "disease_prediction"
    / "processed"
    / "train.csv"
)


# These columns are metadata / target-derived information.
# They MUST NOT be sent to the ML model.
METADATA_COLUMNS = {
    "pattern_count",
    "associated_disease_count",
    "dominant_disease",
    "dominant_disease_count",
    "dominance_ratio",
}


def load_symptom_vocabulary() -> list[str]:
    """
    Load the authoritative symptom vocabulary from train.csv.

    The ordering is important because the Logistic Regression
    model expects the exact same feature ordering used during
    training.
    """

    df = pd.read_csv(
        TRAIN_PATH,
        nrows=1,
    )

    symptoms = [
        column
        for column in df.columns
        if column not in METADATA_COLUMNS
    ]

    if len(symptoms) != 377:
        raise RuntimeError(
            f"Expected 377 symptoms, "
            f"found {len(symptoms)}."
        )

    return symptoms


def get_symptom_set() -> set[str]:
    """Return symptoms as a set for fast lookup."""

    return set(
        load_symptom_vocabulary()
    )


if __name__ == "__main__":

    symptoms = load_symptom_vocabulary()

    print(
        f"Total symptoms: {len(symptoms)}"
    )

    print("\nFirst 20 symptoms:")

    for symptom in symptoms[:20]:
        print(f" - {symptom}")

    print("\nLast 20 symptoms:")

    for symptom in symptoms[-20:]:
        print(f" - {symptom}")