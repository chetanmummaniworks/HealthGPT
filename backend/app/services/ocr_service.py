from PIL import Image, ImageOps
import pytesseract


class OCRService:
    def __init__(self):
        pass

    def extract_text(
        self,
        image_path: str,
    ) -> str:

        image = Image.open(image_path)

        # Convert to grayscale
        image = image.convert("L")

        # Improve contrast
        image = ImageOps.autocontrast(image)

        # Upscale for better recognition
        image = image.resize(
            (image.width * 2, image.height * 2)
        )

        text = pytesseract.image_to_string(
            image_path,
    config="--psm 4",
)

        return text.strip()


_ocr_service: OCRService | None = None


def get_ocr_service() -> OCRService:

    global _ocr_service

    if _ocr_service is None:
        _ocr_service = OCRService()

    return _ocr_service