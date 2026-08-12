from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd


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

VALIDATION_PATH = PROCESSED_DIR / "validation.csv"

MODEL_PATH = MODEL_DIR / "logistic_regression.joblib"
ENCODER_PATH = MODEL_DIR / "label_encoder.joblib"

REPORT_PATH = MODEL_DIR / "calibration_report.json"


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
# MAIN
# ============================================================

def main():

    print("=" * 70)
    print("HealthGPT AI — Probability Calibration Analysis")
    print("=" * 70)

    # --------------------------------------------------------
    # Load validation data
    # --------------------------------------------------------

    print("\nLoading validation dataset...")

    df = pd.read_csv(
        VALIDATION_PATH
    )

    feature_columns = get_feature_columns(
        df
    )

    if len(feature_columns) != 377:
        raise RuntimeError(
            f"Expected 377 symptom features, "
            f"found {len(feature_columns)}."
        )

    X = df[feature_columns]
    y = df[TARGET_COLUMN]

    print(
        f"Validation samples: {len(df):,}"
    )

    print(
        f"Features: {len(feature_columns)}"
    )

    # --------------------------------------------------------
    # Load model
    # --------------------------------------------------------

    print(
        "\nLoading Logistic Regression..."
    )

    model = joblib.load(
        MODEL_PATH
    )

    encoder = joblib.load(
        ENCODER_PATH
    )

    y_encoded = encoder.transform(
        y
    )

    # --------------------------------------------------------
    # Predictions
    # --------------------------------------------------------

    print(
        "Generating probabilities..."
    )

    probabilities = model.predict_proba(
        X
    )

    predictions = np.argmax(
        probabilities,
        axis=1,
    )

    correct = (
        predictions == y_encoded
    )

    confidence = probabilities.max(
        axis=1
    )

    # --------------------------------------------------------
    # Confidence statistics
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("CONFIDENCE STATISTICS")
    print("=" * 70)

    print(
        f"Mean confidence   : "
        f"{confidence.mean():.4f}"
    )

    print(
        f"Median confidence : "
        f"{np.median(confidence):.4f}"
    )

    print(
        f"Minimum confidence: "
        f"{confidence.min():.4f}"
    )

    print(
        f"Maximum confidence: "
        f"{confidence.max():.4f}"
    )

    # --------------------------------------------------------
    # Calibration buckets
    # --------------------------------------------------------

    bins = [
        0.0,
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.6,
        0.7,
        0.8,
        0.9,
        1.0,
    ]

    labels = [
        "0.0-0.1",
        "0.1-0.2",
        "0.2-0.3",
        "0.3-0.4",
        "0.4-0.5",
        "0.5-0.6",
        "0.6-0.7",
        "0.7-0.8",
        "0.8-0.9",
        "0.9-1.0",
    ]

    bucket_indices = pd.cut(
        confidence,
        bins=bins,
        labels=labels,
        include_lowest=True,
    )

    calibration_rows = []

    print("\n" + "=" * 70)
    print("CALIBRATION TABLE")
    print("=" * 70)

    print(
        f"\n{'Bucket':<12}"
        f"{'Samples':>10}"
        f"{'Mean Conf.':>15}"
        f"{'Accuracy':>15}"
        f"{'Gap':>12}"
    )

    print("-" * 65)

    for label in labels:

        mask = (
            bucket_indices == label
        )

        sample_count = int(
            mask.sum()
        )

        if sample_count == 0:
            continue

        mean_confidence = float(
            confidence[mask].mean()
        )

        accuracy = float(
            correct[mask].mean()
        )

        gap = (
            mean_confidence
            - accuracy
        )

        calibration_rows.append(
            {
                "bucket": label,
                "samples": sample_count,
                "mean_confidence": mean_confidence,
                "accuracy": accuracy,
                "calibration_gap": gap,
            }
        )

        print(
            f"{label:<12}"
            f"{sample_count:>10}"
            f"{mean_confidence:>15.4f}"
            f"{accuracy:>15.4f}"
            f"{gap:>12.4f}"
        )

    # --------------------------------------------------------
    # Expected Calibration Error
    # --------------------------------------------------------

    total_samples = len(df)

    ece = sum(
        (
            row["samples"]
            / total_samples
        )
        * abs(
            row["calibration_gap"]
        )
        for row in calibration_rows
    )

    print("\n" + "=" * 70)
    print("EXPECTED CALIBRATION ERROR")
    print("=" * 70)

    print(
        f"\nECE: {ece:.4f}"
    )

    # --------------------------------------------------------
    # Accuracy at confidence thresholds
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("CONFIDENCE THRESHOLD ANALYSIS")
    print("=" * 70)

    threshold_results = []

    for threshold in [
        0.50,
        0.60,
        0.70,
        0.80,
        0.90,
        0.95,
    ]:

        mask = (
            confidence >= threshold
        )

        count = int(
            mask.sum()
        )

        if count == 0:
            continue

        threshold_accuracy = float(
            correct[mask].mean()
        )

        coverage = float(
            mask.mean()
        )

        threshold_results.append(
            {
                "threshold": threshold,
                "samples": count,
                "coverage": coverage,
                "accuracy": threshold_accuracy,
            }
        )

        print(
            f"Threshold >= {threshold:.2f}"
            f" | Samples: {count:>6,}"
            f" | Coverage: {coverage:.4f}"
            f" | Accuracy: {threshold_accuracy:.4f}"
        )

    # --------------------------------------------------------
    # Save report
    # --------------------------------------------------------

    report = {
        "validation_samples": len(df),
        "features": len(feature_columns),
        "mean_confidence": float(
            confidence.mean()
        ),
        "median_confidence": float(
            np.median(confidence)
        ),
        "minimum_confidence": float(
            confidence.min()
        ),
        "maximum_confidence": float(
            confidence.max()
        ),
        "expected_calibration_error": float(
            ece
        ),
        "calibration_buckets": calibration_rows,
        "threshold_analysis": threshold_results,
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
            report,
            file,
            indent=2,
        )

    print("\n" + "=" * 70)
    print("CALIBRATION ANALYSIS COMPLETE")
    print("=" * 70)

    print(
        f"\nReport saved to:\n{REPORT_PATH}"
    )


if __name__ == "__main__":
    main()