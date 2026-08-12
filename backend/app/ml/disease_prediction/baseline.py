from __future__ import annotations

from pathlib import Path
import json
import time

import joblib
import pandas as pd

from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.preprocessing import LabelEncoder


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

TRAIN_PATH = PROCESSED_DIR / "train.csv"
VALIDATION_PATH = PROCESSED_DIR / "validation.csv"

MODEL_PATH = MODEL_DIR / "logistic_regression.joblib"
ENCODER_PATH = MODEL_DIR / "label_encoder.joblib"

METRICS_PATH = MODEL_DIR / "baseline_metrics.json"


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
# LOAD DATA
# ============================================================

def load_data():
    """Load train and validation datasets."""

    train_df = pd.read_csv(TRAIN_PATH)
    validation_df = pd.read_csv(VALIDATION_PATH)

    return train_df, validation_df


# ============================================================
# FEATURES
# ============================================================

def get_features(df: pd.DataFrame):
    """Return only symptom columns."""

    return [
        column
        for column in df.columns
        if column not in METADATA_COLUMNS
    ]


# ============================================================
# METRICS
# ============================================================

def calculate_metrics(
    y_true,
    y_pred,
):
    """Calculate baseline classification metrics."""

    return {
        "accuracy": float(
            accuracy_score(y_true, y_pred)
        ),

        "macro_precision": float(
            precision_score(
                y_true,
                y_pred,
                average="macro",
                zero_division=0,
            )
        ),

        "macro_recall": float(
            recall_score(
                y_true,
                y_pred,
                average="macro",
                zero_division=0,
            )
        ),

        "macro_f1": float(
            f1_score(
                y_true,
                y_pred,
                average="macro",
                zero_division=0,
            )
        ),

        "weighted_f1": float(
            f1_score(
                y_true,
                y_pred,
                average="weighted",
                zero_division=0,
            )
        ),
    }


# ============================================================
# TRAIN
# ============================================================

def main():

    print("=" * 70)
    print("HealthGPT AI — Logistic Regression Baseline")
    print("=" * 70)

    start_time = time.time()

    train_df, validation_df = load_data()

    feature_columns = get_features(train_df)

    print(
        f"\nTraining samples: {len(train_df):,}"
    )

    print(
        f"Validation samples: {len(validation_df):,}"
    )

    print(
        f"Features: {len(feature_columns)}"
    )

    print(
        f"Diseases: "
        f"{train_df[TARGET_COLUMN].nunique()}"
    )

    # --------------------------------------------------------
    # X / y
    # --------------------------------------------------------

    X_train = train_df[feature_columns]
    X_validation = validation_df[feature_columns]

    y_train = train_df[TARGET_COLUMN]
    y_validation = validation_df[TARGET_COLUMN]

    # --------------------------------------------------------
    # Encode target
    # --------------------------------------------------------

    encoder = LabelEncoder()

    y_train_encoded = encoder.fit_transform(
        y_train
    )

    y_validation_encoded = encoder.transform(
        y_validation
    )

    # --------------------------------------------------------
    # Logistic Regression
    # --------------------------------------------------------

    print("\nTraining Logistic Regression...")

    model = LogisticRegression(
        max_iter=1000,
        solver="saga",
        n_jobs=-1,
    )

    model.fit(
        X_train,
        y_train_encoded,
    )

    print("Training complete.")

    # --------------------------------------------------------
    # Predictions
    # --------------------------------------------------------

    print("\nGenerating validation predictions...")

    predictions = model.predict(
        X_validation
    )

    # --------------------------------------------------------
    # Metrics
    # --------------------------------------------------------

    metrics = calculate_metrics(
        y_validation_encoded,
        predictions,
    )

    print("\n" + "=" * 70)
    print("BASELINE RESULTS")
    print("=" * 70)

    for name, value in metrics.items():
        print(
            f"{name:20s}: {value:.4f}"
        )

    elapsed = time.time() - start_time

    metrics["training_time_seconds"] = elapsed

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    joblib.dump(
        model,
        MODEL_PATH,
    )

    joblib.dump(
        encoder,
        ENCODER_PATH,
    )

    with METRICS_PATH.open(
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            metrics,
            file,
            indent=2,
        )

    print(
        f"\nModel saved to:\n{MODEL_PATH}"
    )

    print(
        f"Encoder saved to:\n{ENCODER_PATH}"
    )

    print(
        f"Metrics saved to:\n{METRICS_PATH}"
    )

    print(
        f"\nTotal time: {elapsed:.2f} seconds"
    )


if __name__ == "__main__":
    main()