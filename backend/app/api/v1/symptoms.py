from fastapi import APIRouter

from app.ml.disease_prediction.symptoms import (
    load_symptom_vocabulary,
)


router = APIRouter(
    prefix="/symptoms",
    tags=["Symptoms"],
)


@router.get("")
def get_symptoms():
    """
    Return the complete symptom vocabulary
    used by the disease prediction model.
    """

    symptoms = load_symptom_vocabulary()

    return {
        "symptoms": symptoms,
        "count": len(symptoms),
    }