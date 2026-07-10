from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, Query, UploadFile

from ..storage import store
from ..services import dataset_service

router = APIRouter(tags=["datasets"])


@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    record = await dataset_service.ingest_file(file)
    return {"dataset": record}


@router.get("/datasets")
async def list_datasets():
    return store.list_datasets()


@router.get("/datasets/{dataset_id}")
async def get_dataset(dataset_id: str):
    record = store.get_dataset(dataset_id)
    if not record:
        raise HTTPException(404, "Dataset not found.")
    return record


@router.get("/datasets/{dataset_id}/preview")
async def preview_dataset(dataset_id: str, page: int = Query(1, ge=1), page_size: int = Query(25, ge=1, le=500)):
    return dataset_service.preview(dataset_id, page, page_size)


@router.delete("/datasets/{dataset_id}")
async def delete_dataset(dataset_id: str):
    if not store.get_dataset(dataset_id):
        raise HTTPException(404, "Dataset not found.")
    store.delete_dataset(dataset_id)
    return {"ok": True}
