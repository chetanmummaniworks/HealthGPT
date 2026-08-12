from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
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
AMBIGUOUS_PATH = PROCESSED_DIR / "ambiguous.csv"

MODEL_PATH = MODEL_DIR / "logistic_regression.joblib"
ENCODER_PATH = MODEL_DIR / "label_encoder.joblib"

REPORT_PATH = MODEL_DIR / "error_analysis.json"


TARGET_COLUMN = "dominant_disease"

METADATA_COLUMNS = {
    "pattern_count",
    "associated_disease_count",
    "dominant_disease",
    "dominant_disease_count",
    "dominance_ratio",
}


# ============================================================
# FEATURES
# ============================================================

def get_feature_columns(df: pd.DataFrame) -> list[str]:
    return [
        column
        for column in df.columns
        if column not in METADATA_COLUMNS
    ]


# ============================================================
# LOAD MODEL
# ============================================================

def load_model():
    model = joblib.load(MODEL_PATH)
    encoder = joblib.load(ENCODER_PATH)

    return model, encoder


# ============================================================
# NORMAL TEST-SET ANALYSIS
# ============================================================

def analyze_test_set():

    print("=" * 70)
    print("HealthGPT AI — Model Error Analysis")
    print("=" * 70)

    print("\nLoading test dataset...")

    df = pd.read_csv(TEST_PATH)

    feature_columns = get_feature_columns(df)

    X = df[feature_columns]
    y = df[TARGET_COLUMN]

    print(f"Test samples: {len(df):,}")
    print(f"Features: {len(feature_columns)}")

    model, encoder = load_model()

    y_encoded = encoder.transform(y)

    probabilities = model.predict_proba(X)

    predictions = np.argmax(
        probabilities,
        axis=1,
    )

    predicted_labels = encoder.inverse_transform(
        predictions
    )

    # --------------------------------------------------------
    # Classification report
    # --------------------------------------------------------

    report = classification_report(
        y_encoded,
        predictions,
        target_names=encoder.classes_,
        output_dict=True,
        zero_division=0,
    )

    report_df = (
        pd.DataFrame(report)
        .T
    )

    # Remove aggregate rows.
    per_class = report_df[
        ~report_df.index.isin(
            [
                "accuracy",
                "macro avg",
                "weighted avg",
            ]
        )
    ].copy()

    per_class = per_class.sort_values(
        "f1-score"
    )

    print("\n" + "=" * 70)
    print("10 WORST-PERFORMING DISEASES")
    print("=" * 70)

    print(
        per_class[
            [
                "precision",
                "recall",
                "f1-score",
                "support",
            ]
        ]
        .head(10)
        .to_string()
    )

    print("\n" + "=" * 70)
    print("10 BEST-PERFORMING DISEASES")
    print("=" * 70)

    print(
        per_class[
            [
                "precision",
                "recall",
                "f1-score",
                "support",
            ]
        ]
        .sort_values(
            "f1-score",
            ascending=False,
        )
        .head(10)
        .to_string()
    )

    # --------------------------------------------------------
    # Confusion matrix
    # --------------------------------------------------------

    cm = confusion_matrix(
        y_encoded,
        predictions,
    )

    np.fill_diagonal(
        cm,
        0,
    )

    confusion_pairs = []

    for actual_idx in range(
        len(encoder.classes_)
    ):

        for predicted_idx in range(
            len(encoder.classes_)
        ):

            count = cm[
                actual_idx,
                predicted_idx,
            ]

            if count > 0:

                confusion_pairs.append(
                    {
                        "actual": encoder.classes_[
                            actual_idx
                        ],
                        "predicted": encoder.classes_[
                            predicted_idx
                        ],
                        "count": int(count),
                    }
                )

    confusion_pairs = sorted(
        confusion_pairs,
        key=lambda x: x["count"],
        reverse=True,
    )

    print("\n" + "=" * 70)
    print("TOP 20 CONFUSION PAIRS")
    print("=" * 70)

    for pair in confusion_pairs[:20]:

        print(
            f"{pair['actual']}"
            f" -> "
            f"{pair['predicted']}"
            f" : "
            f"{pair['count']}"
        )

    # --------------------------------------------------------
    # Prediction confidence
    # --------------------------------------------------------

    max_probabilities = probabilities.max(
        axis=1
    )

    confidence_stats = {
        "mean": float(
            max_probabilities.mean()
        ),
        "median": float(
            np.median(max_probabilities)
        ),
        "minimum": float(
            max_probabilities.min()
        ),
        "maximum": float(
            max_probabilities.max()
        ),
        "below_50_percent": int(
            (max_probabilities < 0.50).sum()
        ),
        "below_70_percent": int(
            (max_probabilities < 0.70).sum()
        ),
        "below_90_percent": int(
            (max_probabilities < 0.90).sum()
        ),
    }

    print("\n" + "=" * 70)
    print("PREDICTION CONFIDENCE")
    print("=" * 70)

    for key, value in confidence_stats.items():

        print(
            f"{key}: {value}"
        )

    # --------------------------------------------------------
    # Save test predictions
    # --------------------------------------------------------

    prediction_df = df[
        [TARGET_COLUMN]
    ].copy()

    prediction_df[
        "predicted_disease"
    ] = predicted_labels

    prediction_df[
        "prediction_confidence"
    ] = max_probabilities

    prediction_df[
        "correct"
    ] = (
        prediction_df[TARGET_COLUMN]
        == prediction_df["predicted_disease"]
    )

    prediction_path = (
        MODEL_DIR
        / "test_predictions.csv"
    )

    prediction_df.to_csv(
        prediction_path,
        index=False,
    )

    return {
        "per_class_metrics": per_class.to_dict(
            orient="index"
        ),
        "confusion_pairs": confusion_pairs[
            :50
        ],
        "confidence": confidence_stats,
        "test_samples": len(df),
    }


# ============================================================
# AMBIGUOUS PATTERN ANALYSIS
# ============================================================

def analyze_ambiguous_patterns():

    print("\n" + "=" * 70)
    print("AMBIGUOUS PATTERN ANALYSIS")
    print("=" * 70)

    df = pd.read_csv(
        AMBIGUOUS_PATH
    )

    feature_columns = get_feature_columns(
        df
    )

    X = df[feature_columns]
    y = df[TARGET_COLUMN]

    model, encoder = load_model()

    y_encoded = encoder.transform(y)

    probabilities = model.predict_proba(
        X
    )

    predictions = np.argmax(
        probabilities,
        axis=1,
    )

    top1_correct = (
        predictions
        == y_encoded
    )

    top3_predictions = np.argpartition(
        probabilities,
        -3,
        axis=1,
    )[:, -3:]

    top5_predictions = np.argpartition(
        probabilities,
        -5,
        axis=1,
    )[:, -5:]

    top3_correct = np.any(
        top3_predictions
        == y_encoded[:, None],
        axis=1,
    )

    top5_correct = np.any(
        top5_predictions
        == y_encoded[:, None],
        axis=1,
    )

    print(
        f"Ambiguous patterns: {len(df):,}"
    )

    print(
        f"Top-1 accuracy: "
        f"{top1_correct.mean():.4f}"
    )

    print(
        f"Top-3 accuracy: "
        f"{top3_correct.mean():.4f}"
    )

    print(
        f"Top-5 accuracy: "
        f"{top5_correct.mean():.4f}"
    )

    return {
        "samples": len(df),
        "top_1_accuracy": float(
            top1_correct.mean()
        ),
        "top_3_accuracy": float(
            top3_correct.mean()
        ),
        "top_5_accuracy": float(
            top5_correct.mean()
        ),
    }


# ============================================================
# MAIN
# ============================================================

def main():

    test_results = analyze_test_set()

    ambiguous_results = (
        analyze_ambiguous_patterns()
    )

    final_report = {
        "test_set": test_results,
        "ambiguous_patterns": ambiguous_results,
    }

    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    with REPORT_PATH.open(
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            final_report,
            file,
            indent=2,
        )

    print("\n" + "=" * 70)
    print("ERROR ANALYSIS COMPLETE")
    print("=" * 70)

    print(
        f"\nReport saved to:\n{REPORT_PATH}"
    )


if __name__ == "__main__":
    main()