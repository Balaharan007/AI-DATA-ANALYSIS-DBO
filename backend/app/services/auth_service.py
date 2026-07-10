from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from jose import jwt
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

from ..config import settings
from ..models import TokenData, UserCreate, UserInDB, UserLogin, UserResponse


class AuthService:
    def __init__(self):
        self.client = MongoClient(settings.mongodb_url)
        self.db = self.client[settings.mongodb_db_name]
        self.users = self.db[settings.mongodb_users_collection]
        self._ensure_indexes()

    def _ensure_indexes(self):
        """Create unique index on email field."""
        self.users.create_index("email", unique=True)

    def _hash_password(self, password: str) -> str:
        """Hash password using bcrypt."""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a plain password against hashed password."""
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token."""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(
                minutes=settings.jwt_access_token_expire_minutes
            )
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
        )
        return encoded_jwt

    def decode_token(self, token: str) -> Optional[TokenData]:
        """Decode JWT token and return TokenData."""
        try:
            payload = jwt.decode(
                token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
            )
            email: str = payload.get("sub")
            if email is None:
                return None
            return TokenData(email=email)
        except jwt.JWTError:
            return None

    def register_user(self, user_data: UserCreate) -> UserResponse:
        """Register a new user."""
        # Check if email already exists
        existing_user = self.users.find_one({"email": user_data.email})
        if existing_user:
            raise ValueError("Account already exists. Please sign in.")

        # Hash password
        password_hash = self._hash_password(user_data.password)

        # Create user document
        now = datetime.now(timezone.utc)
        user_doc = {
            "name": user_data.name,
            "email": user_data.email,
            "password_hash": password_hash,
            "created_at": now,
            "updated_at": now,
        }

        # Insert user
        result = self.users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id

        return self._user_doc_to_response(user_doc)

    def authenticate_user(self, login_data: UserLogin) -> UserResponse:
        """Authenticate user with email and password."""
        user_doc = self.users.find_one({"email": login_data.email})
        if not user_doc:
            raise ValueError("Account not found.")

        if not self._verify_password(login_data.password, user_doc["password_hash"]):
            raise ValueError("Invalid password.")

        return self._user_doc_to_response(user_doc)

    def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        """Get user by email."""
        user_doc = self.users.find_one({"email": email})
        if user_doc:
            return self._user_doc_to_response(user_doc)
        return None

    def get_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        """Get user by ID."""
        from bson import ObjectId

        try:
            user_doc = self.users.find_one({"_id": ObjectId(user_id)})
            if user_doc:
                return self._user_doc_to_response(user_doc)
        except Exception:
            pass
        return None

    def _user_doc_to_response(self, doc: dict) -> UserResponse:
        """Convert MongoDB document to UserResponse."""
        return UserResponse(
            id=str(doc["_id"]),
            name=doc["name"],
            email=doc["email"],
            created_at=doc["created_at"],
            updated_at=doc["updated_at"],
        )


# Global auth service instance
auth_service = AuthService()