from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from .. import groq_client
from ..models import ChatRequest
from ..services import chat_service
from ..services.auth_service import auth_service

router = APIRouter(tags=["chat"])

security = HTTPBearer()


async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str | None:
    """Get current user ID from JWT token (optional)."""
    try:
        token = credentials.credentials
        token_data = auth_service.decode_token(token)
        if not token_data or not token_data.email:
            return None
        user = auth_service.get_user_by_email(token_data.email)
        if not user:
            return None
        return user.id
    except Exception:
        return None


@router.post("/chat")
async def chat(req: ChatRequest, user_id: str | None = Depends(get_current_user_id)):
    if not req.message or not req.message.strip():
        raise HTTPException(400, "Message cannot be empty.")
    # Pass user_id to the chat service
    return chat_service.handle_chat(req.message, req.dataset_id, req.conversation_id, req.action, user_id)


@router.post("/voice")
async def voice(audio: UploadFile = File(...), user_id: str | None = Depends(get_current_user_id)):
    raw = await audio.read()
    if not raw:
        raise HTTPException(400, "Empty audio upload.")
    try:
        text = groq_client.transcribe_audio(raw, audio.filename or "audio.webm")
    except Exception as e:
        raise HTTPException(422, f"Could not transcribe audio: {e}")
    if not text or not text.strip():
        raise HTTPException(422, "Could not understand the audio. Please try again.")
    return chat_service.handle_chat(text.strip(), None, None, None, user_id)
