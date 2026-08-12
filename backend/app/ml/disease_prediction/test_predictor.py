from app.ml.disease_prediction.predictor import (
    get_predictor,
)


def main():

    predictor = get_predictor()

    print(
        f"Loaded {len(predictor.symptoms)} symptoms."
    )

    symptoms = [
        "fever",
        "cough",
        "fatigue",
    ]

    print(
        "\nTesting symptoms:"
    )

    for symptom in symptoms:
        print(f" - {symptom}")

    result = predictor.predict(
        symptoms,
        top_k=5,
    )

    print("\nPredictions:")

    for prediction in result["results"]:

        print(
            f"{prediction['rank']}. "
            f"{prediction['disease']} "
            f"({prediction['model_score']:.4f})"
        )

    print(
        f"\nTop score: "
        f"{result['top_score']:.4f}"
    )

    print(
        f"Top-two margin: "
        f"{result['top_two_margin']:.4f}"
    )

    print(
        f"Needs caution: "
        f"{result['needs_caution']}"
    )

    print(
        f"\nMessage:\n"
        f"{result['message']}"
    )


if __name__ == "__main__":
    main()