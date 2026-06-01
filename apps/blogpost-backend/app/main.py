# app/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.routes import blogs
from app.core.aws import dynamodb

load_dotenv()

app = FastAPI(title="GalacticView Blog Content Service")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS, 
    allow_credentials=True,                  
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["System"])
async def health_check():
    """
    Kubernetes will use this endpoint to check if the service is alive and healthy.
    """
    try:
        dynamodb.meta.client.list_tables(Limit=1)
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "status": "healthy", 
        "database": db_status,
        "service": "blog-content"
    }

app.include_router(blogs.router)