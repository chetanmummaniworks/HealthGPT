import re


TEST_ALIASES = {
    # =========================================================
    # BLOOD
    # =========================================================

    "hemoglobin": [
        "hemoglobin",
        "haemoglobin",
        "hb",
        "hgb",
    ],

    "wbc": [
        "wbc",
        "white blood cell",
        "white blood cells",
        "total leukocyte count",
        "tlc",
    ],

    "rbc": [
        "rbc",
        "red blood cell",
        "red blood cells",
        "red cell count",
    ],

    "platelets": [
        "platelet",
        "platelets",
        "platelet count",
    ],

    "hematocrit": [
        "hematocrit",
        "haematocrit",
        "hct",
        "pcv",
    ],

    "glucose": [
        "glucose",
        "blood glucose",
        "blood sugar",
        "fasting glucose",
        "fasting blood sugar",
    ],

    "creatinine": [
        "creatinine",
        "serum creatinine",
    ],

    "urea": [
        "urea",
        "blood urea",
        "blood urea nitrogen",
        "bun",
    ],

    # =========================================================
    # URINE
    # =========================================================

    "urinary_ph": [
        "urinary ph",
        "urine ph",
    ],

    "urinary_specific_gravity": [
        "urinary specific gravity",
        "urine specific gravity",
        "specific gravity",
    ],

    "urinary_protein": [
        "urinary protein",
        "urine protein",
    ],

    "urinary_glucose": [
        "urinary glucose",
        "urine glucose",
    ],

    "urinary_ketones": [
        "urinary ketones",
        "urine ketones",
    ],

    "urobilinogen": [
        "urobilinogen",
    ],

    "urine_bilirubin": [
        "urine bilirubin",
        "urinary bilirubin",
    ],

    "urinary_nitrites": [
        "urinary nitrites",
        "urine nitrites",
    ],

    "blood_in_urine": [
        "blood [in urine]",
        "blood in urine",
    ],

    "leukocyte_esterase": [
        "leukocyte esterase",
    ],

    "pus_cells": [
        "pus cells [in urine]",
        "pus cells",
    ],

    "urinary_rbc": [
        "urinary rbc",
        "urine rbc",
    ],

    "hyaline_casts": [
        "hyaline casts",
    ],

    "pathological_casts": [
        "pathological casts",
    ],

    "yeast_cells": [
        "yeast cells",
    ],

    "crystals": [
        "crystals",
    ],
}


QUALITATIVE_VALUES = {
    "negative",
    "positive",
    "nil",
    "normal",
    "abnormal",
    "trace",
    "absent",
    "present",
}


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(text: str) -> list[str]:
    """
    Clean OCR text and return individual lines.
    """

    lines = []

    for line in text.splitlines():

        line = line.strip()

        if not line:
            continue

        line = line.replace("µ", "u")
        line = line.replace("μ", "u")

        line = re.sub(
            r"\s+",
            " ",
            line,
        )

        lines.append(line)

    return lines


# ============================================================
# NUMBER EXTRACTION
# ============================================================

def extract_number(text: str):
    """
    Extract the first numeric value from text.
    """

    match = re.search(
        r"(?<!\d)"
        r"[-+]?"
        r"\d+(?:[.,]\d+)?"
        r"(?!\d)",
        text,
    )

    if not match:
        return None

    try:
        return float(
            match.group(0).replace(",", "")
        )

    except ValueError:
        return None


# ============================================================
# TEST NAME DETECTION
# ============================================================

def find_test_name(line: str):
    """
    Determine whether an OCR line contains
    one of our known laboratory tests.
    """

    lower_line = line.lower()

    candidates = []

    for test_name, aliases in TEST_ALIASES.items():

        for alias in aliases:

            candidates.append(
                (
                    len(alias),
                    test_name,
                    alias,
                )
            )

    # Longest aliases first.
    candidates.sort(
        reverse=True
    )

    for _, test_name, alias in candidates:

        if alias.lower() in lower_line:
            return test_name

    return None


# ============================================================
# RESULT EXTRACTION
# ============================================================

def extract_result(text: str):
    """
    Extract a laboratory result while preserving
    ranges and qualitative values.
    """

    text = text.strip()

    if not text:
        return None

    lower_text = text.lower()

    # --------------------------------------------------------
    # Qualitative values
    # --------------------------------------------------------

    if lower_text in QUALITATIVE_VALUES:

        return {
            "value": None,
            "result": text,
            "qualitative_value": text,
        }

    # --------------------------------------------------------
    # NIL / NONE / NOT DETECTED
    # --------------------------------------------------------

    if lower_text in {
        "nil",
        "none",
        "not detected",
    }:

        return {
            "value": None,
            "result": text,
            "qualitative_value": text,
        }

    # --------------------------------------------------------
    # Numeric ranges
    #
    # Examples:
    # 1-2
    # 0-2
    # 1.5-2.5
    # --------------------------------------------------------

    range_match = re.search(
        r"(?<!\d)"
        r"(\d+(?:\.\d+)?)"
        r"\s*[-–—]\s*"
        r"(\d+(?:\.\d+)?)"
        r"(?!\d)",
        text,
    )

    if range_match:

        return {
            "value": None,
            "result": (
                f"{range_match.group(1)}-"
                f"{range_match.group(2)}"
            ),
            "qualitative_value": None,
        }

    # --------------------------------------------------------
    # Single numeric value
    # --------------------------------------------------------
# Single numeric value
#
# Only accept the value as numeric if the
# entire result is actually numeric.
#
# This prevents OCR strings such as:
# "0-Z/LPF"
# from becoming value = 0.

    numeric_match = re.fullmatch(
       r"[-+]?\d+(?:[.,]\d+)?",
      text.strip(),
)

    if numeric_match:

      number = float(
        numeric_match.group(0).replace(",", "")
    )

      return {
        "value": number,
        "result": text,
        "qualitative_value": None,
    }

# If the result contains a number mixed with
# other OCR text, preserve it as a raw result.
    if re.search(r"\d", text):

     return {
        "value": None,
        "result": text,
        "qualitative_value": None,
    }

    return None


# ============================================================
# UNIT EXTRACTION
# ============================================================

def extract_unit(text: str):
    """
    Extract common laboratory units.

    Only returns pH when the text actually represents
    a pH unit/value, rather than matching arbitrary
    occurrences of the letters 'ph'.
    """

    text = text.strip()

    # Longer / more specific units first.
    unit_match = re.search(
        r"(g/dl|mg/dl|mmol/l|"
        r"mg/l|g/l|"
        r"/ul|/µl|"
        r"/hpf|/lpf|"
        r"\bhpf\b|\blpf\b)",
        text,
        re.IGNORECASE,
    )

    if unit_match:
        return unit_match.group(0)

    # pH should only be recognized when it appears
    # as a standalone token.
    #
    # Examples:
    #   "5.5 pH" -> pH
    #   "pH"     -> pH
    #
    # But don't match "ph" buried inside another word.
    ph_match = re.search(
        r"\bpH\b",
        text,
        re.IGNORECASE,
    )

    if ph_match:
        return "pH"

    return None

# ============================================================
# REPORT PARSER
# ============================================================

def parse_blood_report(
    text: str,
) -> list[dict]:

    lines = normalize_text(text)

    results = []

    i = 0

    while i < len(lines):

        test_name = find_test_name(lines[i])

        if test_name is None:
            i += 1
            continue

        raw_lines = [lines[i]]

        value = None
        result = None
        qualitative_value = None
        unit = None
        reference_range = None

        found_result = False

        # Look ahead through the following OCR lines.
        for offset in range(1, 6):

            next_index = i + offset

            if next_index >= len(lines):
                break

            candidate = lines[next_index]

            # Stop when another known test begins.
            if find_test_name(candidate) is not None:
                break

            # ------------------------------------------------
            # Once we have a result, subsequent lines can
            # contain unit/reference information.
            # ------------------------------------------------

            if found_result:

                reference = extract_reference_range(
                    candidate
                )

                if reference is not None:
                    reference_range = reference
                    raw_lines.append(candidate)
                    continue

                detected_unit = extract_unit(
                    candidate
                )

                if detected_unit is not None:
                    unit = detected_unit
                    raw_lines.append(candidate)
                    continue

                # Don't consume unrelated OCR garbage.
                continue

            # ------------------------------------------------
            # Try to extract the actual result.
            # ------------------------------------------------

            parsed = extract_result(candidate)

            if parsed is not None:

                value = parsed["value"]
                result = parsed["result"]
                qualitative_value = (
                    parsed["qualitative_value"]
                )

                unit = extract_unit(candidate)

                raw_lines.append(candidate)

                found_result = True

                continue

            # ------------------------------------------------
            # A standalone unit can appear after the result.
            # ------------------------------------------------

            detected_unit = extract_unit(candidate)

            if detected_unit is not None:
                unit = detected_unit
                raw_lines.append(candidate)

        # ----------------------------------------------------
        # Store only meaningful results.
        # ----------------------------------------------------

        if (
            value is not None
            or result is not None
            or qualitative_value is not None
        ):

            results.append(
                {
                    "test": test_name,
                    "value": value,
                    "result": result,
                    "qualitative_value": (
                        qualitative_value
                    ),
                    "unit": unit,
                    "reference_range": (
                        reference_range
                    ),
                    "raw_line": " | ".join(
                        raw_lines
                    ),
                }
            )

        i += 1

    return results

def extract_reference_range(text: str):
    """
    Extract a numeric reference range from OCR text.

    Examples:
        1.005 - 1.030
        0 - 2
        1.5-2.5
    """

    text = text.strip()

    match = re.search(
        r"(\d+(?:\.\d+)?)"
        r"\s*[-–—=]\s*"
        r"(\d+(?:\.\d+)?)",
        text,
    )

    if match:
        return (
            f"{match.group(1)} - "
            f"{match.group(2)}"
        )

    return None