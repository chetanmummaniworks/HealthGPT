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
        "total wbc count",
        "white blood cells",
        "white blood cell",
        "total leukocyte count",
        "wbc",
        "tlc",
    ],

    "rbc": [
        "red blood cells",
        "red blood cell",
        "red cell count",
        "rbc",
    ],

    "platelets": [
        "platelet count",
        "platelets",
        "platelet",
    ],

    "hematocrit": [
        "hematocrit",
        "haematocrit",
        "hct",
        "pcv",
    ],

    "mcv": [
        "mcv",
    ],

    "mch": [
        "mch",
    ],

    "mchc": [
        "mchc",
    ],

    "rdw": [
        "rdw",
        "row",  # common OCR misread of RDW
    ],

    "neutrophils": [
        "neutrophils",
    ],

    "lymphocytes": [
        "lymphocytes",
    ],

    "eosinophils": [
        "eosinophils",
    ],

    "monocytes": [
        "monocytes",
    ],

    "basophils": [
        "basophils",
    ],

    "glucose": [
        "fasting blood sugar",
        "fasting glucose",
        "blood glucose",
        "blood sugar",
        "glucose",
    ],

    "creatinine": [
        "serum creatinine",
        "creatinine",
    ],

    "urea": [
        "blood urea nitrogen",
        "blood urea",
        "urea",
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
        line = line.replace("_", " ")

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

    candidates.sort(reverse=True)

    for _, test_name, alias in candidates:
        if lower_line.startswith(alias.lower()):
            return test_name

    return None


def find_matched_alias(line: str, test_name: str):
    """
    Find the alias at the beginning of an OCR line.
    """

    lower_line = line.lower()

    aliases = sorted(
        TEST_ALIASES[test_name],
        key=len,
        reverse=True,
    )

    for alias in aliases:
        if lower_line.startswith(alias.lower()):
            return alias

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

    if lower_text in QUALITATIVE_VALUES:
        return {
            "value": None,
            "result": text,
            "qualitative_value": text,
        }

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

    range_match = re.fullmatch(
        r"\s*"
        r"[-+]?\d+(?:[.,]\d+)?"
        r"\s*[-–—]\s*"
        r"[-+]?\d+(?:[.,]\d+)?"
        r"\s*",
        text,
    )

    if range_match:
        normalized = re.sub(
            r"\s*[-–—]\s*",
            "-",
            text.strip(),
        )

        return {
            "value": None,
            "result": normalized,
            "qualitative_value": None,
        }

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

    if re.search(r"\d", text):
        return {
            "value": None,
            "result": text,
            "qualitative_value": None,
        }

    return None


# ============================================================
# REFERENCE RANGE EXTRACTION
# ============================================================

def extract_reference_range(text: str):
    """
    Extract the first numeric reference range appearing
    after the reported result.

    Example:
        "15 male : 14 - 16 g%"
        -> "14 - 16"
    """

    matches = re.finditer(
        r"(?<!\d)"
        r"(\d+(?:[.,]\d+)?)"
        r"\s*[-–—]\s*"
        r"(\d+(?:[.,]\d+)?)"
        r"(?!\d)",
        text,
    )

    for match in matches:
        return (
            f"{match.group(1)} - "
            f"{match.group(2)}"
        )

    return None


# ============================================================
# UNIT EXTRACTION
# ============================================================

def extract_unit(text: str):
    """
    Extract common laboratory units.
    """

    text = text.strip()

    unit_match = re.search(
        r"("
        r"g/dl|mg/dl|mmol/l|"
        r"mg/l|g/l|"
        r"g%|"
        r"fl|pg|"
        r"/cu\.?\s*mm|"
        r"/ul|/µl|"
        r"/hpf|/lpf|"
        r"%|"
        r"\bhpf\b|\blpf\b"
        r")",
        text,
        re.IGNORECASE,
    )

    if unit_match:
        return unit_match.group(0)

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
    """
    Parse OCR text from laboratory reports.

    The parser expects the reported value to appear on
    the same OCR line as the test name, which matches
    the Tesseract --psm 4 output used by HealthGPT.
    """

    lines = normalize_text(text)
    results = []

    for line in lines:

        test_name = find_test_name(line)

        if test_name is None:
            continue

        matched_alias = find_matched_alias(
            line,
            test_name,
        )

        if matched_alias is None:
            continue

        remainder = line[
            len(matched_alias):
        ].strip()

        if not remainder:
            continue

        # ----------------------------------------------------
        # First numeric value after the test name = result
        #
        # Example:
        # "Haemoglobin 15 male : 14 - 16 g%"
        #
        # -> value = 15
        # ----------------------------------------------------

        number_match = re.search(
            r"(?<!\d)"
            r"[-+]?"
            r"\d+(?:[.,]\d+)?"
            r"(?!\d)",
            remainder,
        )

        value = None
        result = None
        qualitative_value = None

        if number_match:

            value_text = number_match.group(0)

            try:
                value = float(
                    value_text.replace(",", "")
                )
                result = value_text

            except ValueError:
                pass

        else:

            lower_remainder = remainder.lower()

            for qualitative in sorted(
                QUALITATIVE_VALUES,
                key=len,
                reverse=True,
            ):

                if lower_remainder.startswith(
                    qualitative
                ):

                    qualitative_value = (
                        qualitative
                    )

                    result = remainder

                    break

        reference_range = extract_reference_range(
            remainder
        )

        unit = extract_unit(
            remainder
        )

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
                    "raw_line": line,
                }
            )

    return results