from __future__ import annotations

import json
import time
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
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier


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

MODEL_PATH = MODEL_DIR / "xgboost_model.joblib"
ENCODER_PATH = MODEL_DIR / "xgboost_label_encoder.joblib"
METRICS_PATH = MODEL_DIR / "xgboost_metrics.json"


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

RANDOM_STATE = 42


# ============================================================
# LOAD DATA
# ============================================================

def load_data():
    """Load training and validation datasets."""

    train_df = pd.read_csv(TRAIN_PATH)
    validation_df = pd.read_csv(VALIDATION_PATH)

    return train_df, validation_df


# ============================================================
# FEATURES
# ============================================================

def get_feature_columns(df: pd.DataFrame) -> list[str]:
    """Return only the actual symptom columns."""

    return [
        column
        for column in df.columns
        if column not in METADATA_COLUMNS
    ]


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

    A prediction is considered correct if the true class
    appears among the K classes with the highest predicted
    probabilities.
    """

    top_k_predictions = np.argsort(
        probabilities,
        axis=1,
    )[:, -k:]

    correct = [
        true_label in predicted_labels
        for true_label, predicted_labels
        in zip(y_true, top_k_predictions)
    ]

    return float(np.mean(correct))


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 70)
    print("HealthGPT AI — XGBoost Multiclass Model")
    print("=" * 70)

    start_time = time.time()

    # --------------------------------------------------------
    # Load
    # --------------------------------------------------------

    print("\nLoading datasets...")

    train_df, validation_df = load_data()

    print(
        f"Training samples: {len(train_df):,}"
    )

    print(
        f"Validation samples: {len(validation_df):,}"
    )

    # --------------------------------------------------------
    # Features
    # --------------------------------------------------------

    feature_columns = get_feature_columns(
        train_df
    )

    print(
        f"Features: {len(feature_columns)}"
    )

    if len(feature_columns) != 377:
        raise RuntimeError(
            f"Expected 377 symptom features, "
            f"found {len(feature_columns)}."
        )

    print("✓ Exactly 377 symptom features detected.")

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

    num_classes = len(
        encoder.classes_
    )

    print(
        f"Diseases: {num_classes}"
    )

    if num_classes != 443:
        raise RuntimeError(
            f"Expected 443 disease classes, "
            f"found {num_classes}."
        )

    # --------------------------------------------------------
    # XGBoost
    # --------------------------------------------------------

    print("\nCreating XGBoost model...")

    model = XGBClassifier(
        objective="multi:softprob",
        num_class=num_classes,
        eval_metric="mlogloss",

        tree_method="hist",

        max_depth=6,
        learning_rate=0.1,
        n_estimators=200,

        subsample=0.8,
        colsample_bytree=0.8,

        random_state=RANDOM_STATE,

        n_jobs=-1,
    )

    # --------------------------------------------------------
    # Training
    # --------------------------------------------------------

    print("\nTraining XGBoost...")
    print(
        "This may take several minutes."
    )

    model.fit(
        X_train,
        y_train_encoded,
        eval_set=[
            (
                X_validation,
                y_validation_encoded,
            )
        ],
        verbose=True,
    )

    training_time = (
        time.time() - start_time
    )

    print("\nTraining complete.")

    # --------------------------------------------------------
    # Predictions
    # --------------------------------------------------------

    print(
        "\nGenerating validation predictions..."
    )

    probabilities = model.predict_proba(
        X_validation
    )

    predictions = np.argmax(
        probabilities,
        axis=1,
    )

    # --------------------------------------------------------
    # Metrics
    # --------------------------------------------------------

    top1 = accuracy_score(
        y_validation_encoded,
        predictions,
    )

    top3 = top_k_accuracy(
        y_validation_encoded,
        probabilities,
        3,
    )

    top5 = top_k_accuracy(
        y_validation_encoded,
        probabilities,
        5,
    )

    macro_precision = precision_score(
        y_validation_encoded,
        predictions,
        average="macro",
        zero_division=0,
    )

    macro_recall = recall_score(
        y_validation_encoded,
        predictions,
        average="macro",
        zero_division=0,
    )

    macro_f1 = f1_score(
        y_validation_encoded,
        predictions,
        average="macro",
        zero_division=0,
    )

    weighted_f1 = f1_score(
        y_validation_encoded,
        predictions,
        average="weighted",
        zero_division=0,
    )

    metrics = {
        "accuracy_top_1": float(top1),
        "accuracy_top_3": float(top3),
        "accuracy_top_5": float(top5),
        "macro_precision": float(
            macro_precision
        ),
        "macro_recall": float(
            macro_recall
        ),
        "macro_f1": float(
            macro_f1
        ),
        "weighted_f1": float(
            weighted_f1
        ),
        "training_time_seconds": float(
            training_time
        ),
        "num_classes": num_classes,
        "num_features": len(feature_columns),
        "training_samples": len(X_train),
        "validation_samples": len(
            X_validation
        ),
    }

    # --------------------------------------------------------
    # Results
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("XGBOOST VALIDATION RESULTS")
    print("=" * 70)

    print(
        f"\nTop-1 Accuracy : {top1:.4f}"
    )

    print(
        f"Top-3 Accuracy : {top3:.4f}"
    )

    print(
        f"Top-5 Accuracy : {top5:.4f}"
    )

    print(
        f"Macro Precision: {macro_precision:.4f}"
    )

    print(
        f"Macro Recall   : {macro_recall:.4f}"
    )

    print(
        f"Macro F1       : {macro_f1:.4f}"
    )

    print(
        f"Weighted F1    : {weighted_f1:.4f}"
    )

    print(
        f"Training time  : "
        f"{training_time:.2f} seconds"
    )

    # --------------------------------------------------------
    # Save artifacts
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


if __name__ == "__main__":
    main()