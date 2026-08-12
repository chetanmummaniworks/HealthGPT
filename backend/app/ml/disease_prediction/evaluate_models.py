from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
)


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

MODEL_DIR = (
    PROJECT_ROOT
    / "backend_models"
    / "disease_prediction"
)

TEST_PATH = PROCESSED_DIR / "test.csv"

LOGISTIC_MODEL_PATH = (
    MODEL_DIR / "logistic_regression.joblib"
)

LOGISTIC_ENCODER_PATH = (
    MODEL_DIR / "label_encoder.joblib"
)

XGBOOST_MODEL_PATH = (
    MODEL_DIR / "xgboost_model.joblib"
)

XGBOOST_ENCODER_PATH = (
    MODEL_DIR / "xgboost_label_encoder.joblib"
)

OUTPUT_PATH = (
    MODEL_DIR / "final_test_metrics.json"
)


# ============================================================
# CONFIGURATION
# ============================================================

TARGET_COLUMN = "dominant_disease"

METADATA_COLUMNS = {
    "pattern_count",
    "associated_disease_count",
    "dominant_disease",
    "dominant_disease_count",
    "dominance_ratio",
}


# ============================================================
# TOP-K ACCURACY
# ============================================================

def top_k_accuracy(
    y_true: np.ndarray,
    probabilities: np.ndarray,
    k: int,
) -> float:
    """
    Calculate Top-K accuracy.

    Returns the fraction of samples where the true
    class appears among the K highest-probability classes.
    """

    top_k_predictions = np.argpartition(
        probabilities,
        -k,
        axis=1,
    )[:, -k:]

    correct = np.any(
        top_k_predictions
        == y_true.reshape(-1, 1),
        axis=1,
    )

    return float(correct.mean())


# ============================================================
# METRICS
# ============================================================

def calculate_metrics(
    y_true: np.ndarray,
    predictions: np.ndarray,
    probabilities: np.ndarray,
) -> dict:

    return {
        "top_1_accuracy": float(
            accuracy_score(
                y_true,
                predictions,
            )
        ),

        "top_3_accuracy": top_k_accuracy(
            y_true,
            probabilities,
            3,
        ),

        "top_5_accuracy": top_k_accuracy(
            y_true,
            probabilities,
            5,
        ),

        "macro_precision": float(
            precision_score(
                y_true,
                predictions,
                average="macro",
                zero_division=0,
            )
        ),

        "macro_recall": float(
            recall_score(
                y_true,
                predictions,
                average="macro",
                zero_division=0,
            )
        ),

        "macro_f1": float(
            f1_score(
                y_true,
                predictions,
                average="macro",
                zero_division=0,
            )
        ),

        "weighted_f1": float(
            f1_score(
                y_true,
                predictions,
                average="weighted",
                zero_division=0,
            )
        ),
    }


# ============================================================
# FEATURES
# ============================================================

def get_feature_columns(
    df: pd.DataFrame,
) -> list[str]:

    return [
        column
        for column in df.columns
        if column not in METADATA_COLUMNS
    ]


# ============================================================
# EVALUATE MODEL
# ============================================================

def evaluate_model(
    model_name: str,
    model,
    encoder,
    X_test: pd.DataFrame,
    y_test: pd.Series,
) -> dict:

    print("\n" + "-" * 70)
    print(f"Evaluating {model_name}")
    print("-" * 70)

    y_test_encoded = encoder.transform(
        y_test
    )

    print("Generating probabilities...")

    probabilities = model.predict_proba(
        X_test
    )

    predictions = np.argmax(
        probabilities,
        axis=1,
    )

    metrics = calculate_metrics(
        y_test_encoded,
        predictions,
        probabilities,
    )

    print(
        f"\nTop-1 Accuracy : "
        f"{metrics['top_1_accuracy']:.4f}"
    )

    print(
        f"Top-3 Accuracy : "
        f"{metrics['top_3_accuracy']:.4f}"
    )

    print(
        f"Top-5 Accuracy : "
        f"{metrics['top_5_accuracy']:.4f}"
    )

    print(
        f"Macro Precision: "
        f"{metrics['macro_precision']:.4f}"
    )

    print(
        f"Macro Recall   : "
        f"{metrics['macro_recall']:.4f}"
    )

    print(
        f"Macro F1       : "
        f"{metrics['macro_f1']:.4f}"
    )

    print(
        f"Weighted F1    : "
        f"{metrics['weighted_f1']:.4f}"
    )

    return metrics


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 70)
    print("HealthGPT AI — Final Model Evaluation")
    print("=" * 70)

    # --------------------------------------------------------
    # Load test data
    # --------------------------------------------------------

    print("\nLoading test dataset...")

    test_df = pd.read_csv(
        TEST_PATH
    )

    print(
        f"Test samples: {len(test_df):,}"
    )

    feature_columns = get_feature_columns(
        test_df
    )

    print(
        f"Features: {len(feature_columns)}"
    )

    if len(feature_columns) != 377:
        raise RuntimeError(
            f"Expected 377 symptom features, "
            f"found {len(feature_columns)}."
        )

    X_test = test_df[
        feature_columns
    ]

    y_test = test_df[
        TARGET_COLUMN
    ]

    # --------------------------------------------------------
    # Load Logistic Regression
    # --------------------------------------------------------

    print(
        "\nLoading Logistic Regression..."
    )

    logistic_model = joblib.load(
        LOGISTIC_MODEL_PATH
    )

    logistic_encoder = joblib.load(
        LOGISTIC_ENCODER_PATH
    )

    # --------------------------------------------------------
    # Load XGBoost
    # --------------------------------------------------------

    print(
        "Loading XGBoost..."
    )

    xgboost_model = joblib.load(
        XGBOOST_MODEL_PATH
    )

    xgboost_encoder = joblib.load(
        XGBOOST_ENCODER_PATH
    )

    # --------------------------------------------------------
    # Evaluate Logistic Regression
    # --------------------------------------------------------

    logistic_metrics = evaluate_model(
        "Logistic Regression",
        logistic_model,
        logistic_encoder,
        X_test,
        y_test,
    )

    # --------------------------------------------------------
    # Evaluate XGBoost
    # --------------------------------------------------------

    xgboost_metrics = evaluate_model(
        "XGBoost",
        xgboost_model,
        xgboost_encoder,
        X_test,
        y_test,
    )

    # --------------------------------------------------------
    # Compare
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("FINAL TEST COMPARISON")
    print("=" * 70)

    print(
        f"\n{'Metric':<20}"
        f"{'Logistic Regression':>22}"
        f"{'XGBoost':>15}"
    )

    print("-" * 60)

    metrics_to_compare = [
        ("top_1_accuracy", "Top-1 Accuracy"),
        ("top_3_accuracy", "Top-3 Accuracy"),
        ("top_5_accuracy", "Top-5 Accuracy"),
        ("macro_precision", "Macro Precision"),
        ("macro_recall", "Macro Recall"),
        ("macro_f1", "Macro F1"),
        ("weighted_f1", "Weighted F1"),
    ]

    for key, label in metrics_to_compare:

        print(
            f"{label:<20}"
            f"{logistic_metrics[key]:>22.4f}"
            f"{xgboost_metrics[key]:>15.4f}"
        )

    # --------------------------------------------------------
    # Save results
    # --------------------------------------------------------

    results = {
        "test_samples": len(test_df),
        "features": len(feature_columns),
        "logistic_regression": logistic_metrics,
        "xgboost": xgboost_metrics,
    }

    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    with OUTPUT_PATH.open(
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            results,
            file,
            indent=2,
        )

    print(
        f"\nFinal test metrics saved to:\n"
        f"{OUTPUT_PATH}"
    )


if __name__ == "__main__":
    main()