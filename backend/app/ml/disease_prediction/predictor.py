from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from app.ml.disease_prediction.symptoms import (
    load_symptom_vocabulary,
)


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[4]

MODEL_DIR = (
    PROJECT_ROOT
    / "backend_models"
    / "disease_prediction"
)

MODEL_PATH = (
    MODEL_DIR
    / "logistic_regression.joblib"
)

ENCODER_PATH = (
    MODEL_DIR
    / "label_encoder.joblib"
)


# ============================================================
# PREDICTOR
# ============================================================

class DiseasePredictor:
    """
    Production-facing wrapper around the trained
    Logistic Regression disease model.
    """

    def __init__(self):

        self.model = joblib.load(
            MODEL_PATH
        )

        self.encoder = joblib.load(
            ENCODER_PATH
        )

        self.symptoms = (
            load_symptom_vocabulary()
        )

        self.symptom_to_index = {
            symptom: index
            for index, symptom
            in enumerate(self.symptoms)
        }

    # --------------------------------------------------------
    # Validate symptoms
    # --------------------------------------------------------

    def validate_symptoms(
        self,
        symptoms: list[str],
    ) -> list[str]:

        unknown = [
            symptom
            for symptom in symptoms
            if symptom
            not in self.symptom_to_index
        ]

        if unknown:
            raise ValueError(
                f"Unknown symptoms: {unknown}"
            )

        return list(
            dict.fromkeys(symptoms)
        )

    # --------------------------------------------------------
    # Convert symptoms to feature vector
    # --------------------------------------------------------

    def vectorize(
    self,
    symptoms: list[str],
    ) -> pd.DataFrame:

     symptoms = self.validate_symptoms(
        symptoms
    )

     vector = np.zeros(
        len(self.symptoms),
        dtype=np.int8,
    )

     for symptom in symptoms:

        index = (
            self.symptom_to_index[
                symptom
            ]
        )

        vector[index] = 1

    # IMPORTANT:
    # Return a DataFrame with the exact same
    # feature names and ordering used during training.
     return pd.DataFrame(
        [vector],
        columns=self.symptoms,
    )
    # --------------------------------------------------------
    # Predict
    # --------------------------------------------------------

    def predict(
        self,
        symptoms: list[str],
        top_k: int = 5,
    ) -> dict:

        if not symptoms:
            raise ValueError(
                "At least one symptom is required."
            )

        if not 1 <= top_k <= 5:
            raise ValueError(
                "top_k must be between 1 and 5."
            )

        X = self.vectorize(
            symptoms
        )

        probabilities = (
            self.model.predict_proba(X)[0]
        )

        # Get top-k class indices.
        top_indices = np.argsort(
            probabilities
        )[::-1][:top_k]

        results = []

        for rank, index in enumerate(
            top_indices,
            start=1,
        ):

            disease = (
                self.encoder.inverse_transform(
                    [index]
                )[0]
            )

            score = float(
                probabilities[index]
            )

            results.append(
                {
                    "rank": rank,
                    "disease": disease,
                    "model_score": score,
                }
            )

        top_score = (
            results[0]["model_score"]
        )

        second_score = (
            results[1]["model_score"]
            if len(results) > 1
            else 0.0
        )

        margin = (
            top_score - second_score
        )

        # Initial engineering policy.
        #
        # This is NOT a medically validated
        # threshold.
        needs_caution = (
            top_score < 0.80
            or margin < 0.20
        )
        if needs_caution:
           confidence_level = "low"
        elif top_score >= 0.90 and margin >= 0.30:
            confidence_level = "high"
        else:
           confidence_level = "moderate"

        if needs_caution:
            message = (
        "The model identified candidate conditions, "
        "but the result is uncertain. The selected "
        "symptoms may overlap between multiple "
        "conditions. These results are not a medical "
        "diagnosis and should not be treated as a "
        "confirmed condition."
    )
        else:
          message = (
        "The model identified candidate conditions "
        "based on the selected symptoms. These results "
        "are not a medical diagnosis."
    )

        return {
       "results": results,
         "top_score": top_score,
    "top_two_margin": margin,
    "needs_caution": needs_caution,
    "confidence_level": confidence_level,
    "message": message,
}
# ============================================================
# SINGLETON
# ============================================================

_predictor: DiseasePredictor | None = None


def get_predictor() -> DiseasePredictor:

    global _predictor

    if _predictor is None:
        _predictor = DiseasePredictor()

    return _predictor