from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import get_current_user
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import generate_chat_response


router = APIRouter(
    prefix="/chat",
    tags=["HealthGPT Chat"],
)


@router.post(
    "",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
)
def chat(
    request: ChatRequest,
    current_user=Depends(get_current_user),
):

    try:

        response = generate_chat_response(
            message=request.message,

            conversation=[
                item.model_dump()
                for item in request.conversation
            ],

            context=(
                request.context.model_dump()
                if request.context
                else None
            ),

            # Get language from the authenticated user
            language=current_user.preferred_language,
        )

    except Exception as exc:

        print(
            f"Gemini chat failed: {exc}"
        )

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "The AI chat service is temporarily "
                "unavailable. Please try again later."
            ),
        ) from exc


    return ChatResponse(
        response=response,
    )