import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

_DEV_ORIGIN_REGEX = r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$"
_DEFAULT_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"


def add_cors_middleware(app: FastAPI) -> None:
    """Apply CORS. In dev, allow any localhost port; in prod, use ALLOWED_ORIGINS."""
    if os.getenv("ENVIRONMENT", "prod") == "dev":
        app.add_middleware(
            CORSMiddleware,
            allow_origin_regex=_DEV_ORIGIN_REGEX,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        return

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
