from google import genai

from app.config.settings import get_settings


settings = get_settings()


client = genai.Client(
    api_key=settings.gemini_api_key,
)


SYSTEM_INSTRUCTION = """
You are HealthGPT AI, an educational healthcare
report-explanation assistant.

Your job is to help users understand laboratory
report results in simple language.

You are NOT a doctor and must NOT diagnose the user.

IMPORTANT RULES:

1. Never claim that the user has a disease.

2. Do not turn a laboratory result into a diagnosis.

3. Explain what each reported test generally measures.

4. Clearly distinguish:

   - reported result
   - reference range
   - general interpretation

5. Treat OCR-extracted information as potentially
   imperfect.

6. If a value appears corrupted, ambiguous, or
   inconsistent, explicitly say that it should be
   verified against the original report.

7. Never invent missing values, units, reference
   ranges, symptoms, medical history, or diagnoses.

8. Do not prescribe medication.

9. Do not recommend changing or stopping prescribed
   medication.

10. If the report appears to contain a potentially
    concerning finding, recommend discussing it with
    a qualified healthcare professional rather than
    diagnosing a condition.

11. Keep the explanation concise and easy to understand.

12. Do not describe an AI interpretation as medical
    advice or a confirmed diagnosis.

13. Always respond in the user's preferred language.
"""


def generate_report_explanation(
    values: list[dict],
    language: str = "English",
) -> str:

    # ========================================================
    # Build report data
    # ========================================================

    report_lines = []


    for item in values:

        test = item.get(
            "test",
            "unknown",
        )

        value = item.get(
            "value"
        )

        result = item.get(
            "result"
        )

        qualitative_value = item.get(
            "qualitative_value"
        )

        unit = item.get(
            "unit"
        )

        reference_range = item.get(
            "reference_range"
        )


        report_lines.append(
            f"""
Test: {test}
Value: {value}
Result: {result}
Qualitative result: {qualitative_value}
Unit: {unit}
Reference range: {reference_range}
"""
        )


    report_data = "\n".join(
        report_lines
    )


    # ========================================================
    # Build Gemini prompt
    # ========================================================

    prompt = f"""
{SYSTEM_INSTRUCTION}

IMPORTANT LANGUAGE REQUIREMENT:

The user's preferred language is:

{language}

Write the entire report explanation in {language}.

Do not switch to English unless:

1. The user explicitly requests English, or
2. A medical or scientific term is normally written
   in English and translating it would make the
   explanation less clear.

Keep the explanation natural and easy to understand
for a general user.

The following information was extracted from
a laboratory report using OCR and a rule-based
parser.

IMPORTANT:
The extracted information may contain OCR errors.

LABORATORY RESULTS:

{report_data}

Please provide:

1. A short overall summary.

2. A simple explanation of each reported test.

3. Identify results that appear outside the
   supplied reference range, ONLY when the
   reference range is sufficiently clear.

4. Identify ambiguous or potentially corrupted
   OCR results separately.

5. Explain what the user should discuss with
   a healthcare professional if appropriate.

Do not diagnose the user.

Do not invent missing information.

Remember:
The complete response must be written in {language}.
"""


    # ========================================================
    # Generate Gemini response
    # ========================================================

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )


    return response.text