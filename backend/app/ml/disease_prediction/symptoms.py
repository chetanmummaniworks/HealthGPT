from __future__ import annotations

import json
from pathlib import Path


# ============================================================
# PATH
# ============================================================

# This file is located at:
#
# backend/
#   app/
#     ml/
#       disease_prediction/
#         symptoms.py
#
# The vocabulary JSON is in the same directory.

BASE_DIR = Path(__file__).resolve().parent

VOCABULARY_PATH = BASE_DIR / "symptom_vocabulary.json"


# ============================================================
# LOAD SYMPTOM VOCABULARY
# ============================================================

def load_symptom_vocabulary() -> list[str]:
    """
    Load the authoritative symptom vocabulary from
    symptom_vocabulary.json.

    The ordering is important because the trained
    Logistic Regression model expects the exact same
    feature ordering used during training.
    """

    if not VOCABULARY_PATH.exists():
        raise FileNotFoundError(
            f"Symptom vocabulary not found at: {VOCABULARY_PATH}"
        )

    with VOCABULARY_PATH.open(
        "r",
        encoding="utf-8",
    ) as file:
        symptoms = json.load(file)

    if not isinstance(symptoms, list):
        raise RuntimeError(
            "symptom_vocabulary.json must contain a JSON array."
        )

    symptoms = [
        str(symptom).strip()
        for symptom in symptoms
        if str(symptom).strip()
    ]

    if len(symptoms) != 377:
        raise RuntimeError(
            f"Expected 377 symptoms, found {len(symptoms)}."
        )

    return symptoms


# ============================================================
# SYMPTOM SET
# ============================================================

def get_symptom_set() -> set[str]:
    """
    Return symptoms as a set for fast lookup.
    """

    return set(load_symptom_vocabulary())


# ============================================================
# DEBUG
# ============================================================

if __name__ == "__main__":

    symptoms = load_symptom_vocabulary()

    print(f"Total symptoms: {len(symptoms)}")

    print("\nFirst 20 symptoms:")

    for symptom in symptoms[:20]:
        print(f" - {symptom}")

    print("\nLast 20 symptoms:")

    for symptom in symptoms[-20:]:
        print(f" - {symptom}")