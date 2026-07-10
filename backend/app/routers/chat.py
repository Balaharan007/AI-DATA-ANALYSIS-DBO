from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, UploadFile

from .. import groq_client
from ..models import ChatRequest
from ..services import chat_service

router = APIRouter(tags=["chat"])


@router.post("/chat")
async def chat(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(400, "Message cannot be empty.")
    return chat_service.handle_chat(req.message, req.dataset_id, req.conversation_id, req.action)


@router.post("/voice")
async def voice(audio: UploadFile = File(...)):
    raw = await audio.read()
    if not raw:
        raise HTTPException(400, "Empty audio upload.")
    try:
        text = groq_client.transcribe_audio(raw, audio.filename or "audio.webm")
    except Exception as e:
        raise HTTPException(422, f"Could not transcribe audio: {e}")
    if not text or not text.strip():
        raise HTTPException(422, "Could not understand the audio. Please try again.")
    return chat_service.handle_chat(text.strip(), None, None, None)
