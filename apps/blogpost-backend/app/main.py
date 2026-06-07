import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.routes import blogs
from app.core.aws import dynamodb

load_dotenv()

app = FastAPI(title="GalacticView Blog Content Service")

_DEV_ORIGIN_REGEX = r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$"
_DEFAULT_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"

if os.getenv("ENVIRONMENT", "prod") == "dev":
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=_DEV_ORIGIN_REGEX,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    allowed_origins = [
        origin.strip()
        for origin in os.getenv("ALLOWED_ORIGINS", _DEFAULT_ORIGINS).split(",")
        if origin.strip()
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/health", tags=["System"])
def health_check() -> dict[str, str]:
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