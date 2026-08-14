class OCRService:
    def __init__(self):
        import easyocr

        self.reader = easyocr.Reader(
            ["en"],
            gpu=False,
        )

    def extract_text(
        self,
        image_path: str,
    ) -> str:

        results = self.reader.readtext(
            image_path,
        )

        extracted_lines = []

        for result in results:
            text = result[1]

            if text.strip():
                extracted_lines.append(
                    text.strip()
                )

        return "\n".join(extracted_lines)


_ocr_service: OCRService | None = None


def get_ocr_service() -> OCRService:

    global _ocr_service

    if _ocr_service is None:
        _ocr_service = OCRService()

    return _ocr_service