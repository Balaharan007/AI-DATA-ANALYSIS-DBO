from __future__ import annotations

from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection

from .config import settings

_client: MongoClient | None = None
_db: Database | None = None


def get_mongo_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(settings.mongodb_url)
    return _client


def get_database() -> Database:
    global _db
    if _db is None:
        _db = get_mongo_client()[settings.mongodb_db_name]
    return _db


def get_users_collection() -> Collection:
    return get_database()[settings.mongodb_users_collection]


def init_indexes():
    """Create database indexes."""
    users_col = get_users_collection()
    # Unique index on email
    users_col.create_index("email", unique=True)
    # Index on createdAt for sorting
    users_col.create_index("createdAt")