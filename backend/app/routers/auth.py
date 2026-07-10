from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from ..models import UserCreate, UserLogin, UserResponse, Token
from ..services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    """Get current authenticated user from JWT token."""
    token = credentials.credentials
    token_data = auth_service.decode_token(token)
    if not token_data or not token_data.email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = auth_service.get_user_by_email(token_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@router.post("/signup", response_model=Token)
async def signup(user_data: UserCreate):
    """Register a new user."""
    try:
        user = auth_service.register_user(user_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    # Create access token
    access_token = auth_service.create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, token_type="bearer")


@router.post("/signin", response_model=Token)
async def signin(login_data: UserLogin):
    """Sign in an existing user."""
    try:
        user = auth_service.authenticate_user(login_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    # Create access token
    access_token = auth_service.create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """Get current user info."""
    return current_user


@router.post("/signout")
async def signout():
    """Sign out (client-side token removal)."""
    return {"message": "Successfully signed out"}