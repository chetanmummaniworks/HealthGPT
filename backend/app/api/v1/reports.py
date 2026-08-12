from pathlib import Path
import tempfile

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from app.schemas.report_history import (
    ReportHistoryItem,
    ReportHistoryResponse,
)
from sqlalchemy import select
from app.database.database import get_db
from app.models.medical_report import MedicalReport
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user

from app.schemas.ocr import (
    OCRResponse,
    ReportAnalysisRequest,
    ReportAnalysisResponse,
)

from app.services.ocr_service import (
    get_ocr_service,
)

from app.services.blood_parser import (
    parse_blood_report,
)

from app.services.report_analysis_service import (
    generate_report_explanation,
)


router = APIRouter(
    prefix="/reports",
    tags=["Blood Reports"],
)


# ============================================================
# OCR
# ============================================================

@router.post(
    "/ocr",
    response_model=OCRResponse,
    status_code=status.HTTP_200_OK,
)
async def extract_report_text(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/jpg",
    }

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Only JPEG and PNG images "
                "are supported."
            ),
        )

    suffix = Path(
        file.filename or ""
    ).suffix.lower()

    if suffix not in {
        ".jpg",
        ".jpeg",
        ".png",
    }:
        suffix = ".jpg"

    temp_path = None

    try:

        contents = await file.read()

        if not contents:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty.",
            )

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:

            temp_file.write(contents)
            temp_path = temp_file.name

        ocr_service = get_ocr_service()

        text = ocr_service.extract_text(
            temp_path
        )

        values = parse_blood_report(
            text
        )

        return OCRResponse(
            text=text,
            values=values,
        )

    except HTTPException:
        raise

    except Exception as exc:

        print(
            f"OCR failed: {exc}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Unable to process "
                "the uploaded report."
            ),
        ) from exc

    finally:

        if temp_path:

            Path(temp_path).unlink(
                missing_ok=True
            )


# ============================================================
# GEMINI REPORT ANALYSIS
# ============================================================

@router.post(
    "/analyze",
    response_model=ReportAnalysisResponse,
    status_code=status.HTTP_200_OK,
)
def analyze_report(
    request: ReportAnalysisRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    if not request.values:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No report values were provided.",
        )

    try:

        # ----------------------------------------------------
        # Convert Pydantic values into dictionaries
        # ----------------------------------------------------

        values = [
            item.model_dump()
            for item in request.values
        ]

        # ----------------------------------------------------
        # Generate Gemini explanation
        # ----------------------------------------------------

        analysis = generate_report_explanation(
            values=values,
            language=current_user.preferred_language,
        )

        # ----------------------------------------------------
        # Save report to database
        # ----------------------------------------------------

        report = MedicalReport(
            user_id=current_user.id,
            report_name="Medical Report",
            extracted_values=values,
            analysis=analysis,
        )

        db.add(report)
        db.commit()
        db.refresh(report)

    except Exception as exc:

        db.rollback()

        print(
            f"Report analysis failed: {exc}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Unable to generate "
                "report analysis."
            ),
        ) from exc

    return ReportAnalysisResponse(
        analysis=analysis,
    )
    
@router.get(
    "/history",
    response_model=ReportHistoryResponse,
    status_code=status.HTTP_200_OK,
)
def get_report_history(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    reports = db.scalars(
        select(MedicalReport)
        .where(
            MedicalReport.user_id == current_user.id
        )
        .order_by(
            MedicalReport.created_at.desc()
        )
    ).all()

    return ReportHistoryResponse(
        reports=[
            ReportHistoryItem(
                id=report.id,
                report_name=report.report_name,
                extracted_values=report.extracted_values,
                analysis=report.analysis,
                created_at=report.created_at,
            )
            for report in reports
        ]
    )