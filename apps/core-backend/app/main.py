import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.api.routes import auth
from contextlib import asynccontextmanager
import firebase_admin
from app.core.database import engine, Base

import uvicorn


def get_real_ip(request: Request) -> str:
    """
    Extract the real client IP address from the X-Forwarded-For header if present.
    WARNING: Only trust this header if set by a trusted proxy to prevent IP spoofing.
    """
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # take the first IP in the list (the original client)
        return forwarded.split(",")[0].strip()
    return request.client.host # type: ignore

limiter = Limiter(key_func=get_real_ip)

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
        Initialize Firebase Admin SDK when the FastAPI app starts.
    """
    # Initialize Firebase Admin as soon as the app starts
    try:
        firebase_admin.get_app()
    except ValueError:
        firebase_admin.initialize_app()
    yield

app = FastAPI(lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler) # type: ignore

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/health")
def health_check() -> dict:
    """
    Health check endpoint to verify that the server is running.
    """
    return {"status": "ok"}

def main() -> None:
    """
    Main function to run the FastAPI app using Uvicorn.
    """
    env = os.getenv("ENVIRONMENT", "prod")

    reload = env == "dev"
    host = "127.0.0.1"
    if env == "prod":
        host = "0.0.0.0"

    print(f"Starting server on {host}:8001 with reload={reload}")
    uvicorn.run("app.main:app", host=host, port=8001, reload=reload)

if __name__ == "__main__":
    main()