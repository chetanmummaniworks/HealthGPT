from google import genai

from app.config.settings import get_settings


settings = get_settings()


client = genai.Client(
    api_key=settings.gemini_api_key,
)


SYSTEM_INSTRUCTION = """
You are HealthGPT AI, an educational healthcare assistant.

You provide general health information and help users
understand symptoms and medical concepts.

You are NOT a doctor and must NOT diagnose users.

Rules:

1. Never claim that a user has a disease.

2. Do not present an AI prediction as a confirmed diagnosis.

3. Do not describe model confidence scores as the probability
   that a user has a disease.

4. Do not invent symptoms, medical history, test results,
   medications, or diagnoses.

5. Do not prescribe medications or provide dosage instructions.

6. Do not tell users to stop or change prescribed medication.

7. If the user describes potentially serious or emergency
   symptoms, recommend seeking appropriate urgent medical care.

8. Explain medical concepts in simple language.

9. Clearly distinguish general information from diagnosis.

10. Encourage consultation with a qualified healthcare
    professional when appropriate.

11. Do not claim certainty when the available information
    is insufficient.

12. Always respond in the user's preferred language.

Keep responses concise, clear, and supportive.
"""


def generate_chat_response(
    message: str,
    conversation: list[dict],
    context: dict | None = None,
    language: str = "English",
) -> str:

    # ========================================================
    # Build previous conversation
    # ========================================================

    history = ""

    for item in conversation:

        role = item.get(
            "role",
            "user",
        )

        content = item.get(
            "content",
            "",
        )

        history += (
            f"{role.upper()}: "
            f"{content}\n"
        )


    # ========================================================
    # Build symptom-checker context
    # ========================================================

    context_text = ""

    if context:

        symptoms = context.get(
            "symptoms",
            [],
        )

        predictions = context.get(
            "predictions",
            [],
        )

        top_score = context.get(
            "top_score",
        )

        needs_caution = context.get(
            "needs_caution",
        )

        confidence_level = context.get(
            "confidence_level",
        )


        context_text = f"""
Current symptom-checker context:

Selected symptoms:
{", ".join(symptoms)}

Candidate conditions:
"""


        for prediction in predictions:

            context_text += (
                f"- {prediction['disease']} "
                f"(model score: "
                f"{prediction['model_score']:.4f})\n"
            )


        context_text += f"""
Top model score:
{top_score}

Model caution:
{needs_caution}

Confidence level:
{confidence_level}
"""


    # ========================================================
    # Build Gemini prompt
    # ========================================================

    prompt = f"""
{SYSTEM_INSTRUCTION}

IMPORTANT LANGUAGE REQUIREMENT:

The user's preferred language is:

{language}

Respond to the user entirely in {language}.

Do not switch to English unless:

1. The user explicitly asks for English, or
2. A medical/scientific term is normally written in English
   and translating it would make the explanation less clear.

Keep medical terminology understandable for a general user.

{context_text}

Previous conversation:

{history}

USER:
{message}

Respond to the user's latest message.

If symptom-checker context is provided:

- Use it to explain the model's output.
- Do not treat candidate conditions as confirmed diagnoses.
- Do not describe model scores as probabilities of disease.
- Clearly explain uncertainty when appropriate.
- If the user asks why a condition was suggested,
  relate the explanation to the selected symptoms.

Remember:

Respond entirely in {language}.
"""


    # ========================================================
    # Generate Gemini response
    # ========================================================

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )


    return response.text