from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import uvicorn

import os

from .service import chat_ask_question

from .dto import ChatTypeIn, ChatTypeOut

from loguru import logger

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


app = FastAPI()

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler) # type: ignore

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chat")
@limiter.limit("7/minute")
def chat_endpoint(request: Request, body: ChatTypeIn) -> ChatTypeOut:
    """
    Process chat questions using the agent and return structured responses.
    Rate limited to 7 requests per minute per IP.
    """
    logger.info("Received request to /chat endpoint")
    response_data: ChatTypeOut = chat_ask_question(body)
    logger.info("Sending response back to client")
    return response_data

def main() -> None:
    """
    Main function to run the FastAPI app using Uvicorn.
    """
    env = os.getenv("ENVIRONMENT", "prod")

    reload = env == "dev"
    host = "127.0.0.1"
    if env == "prod":
        host = "0.0.0.0"

    logger.info(f"Starting server on {host}:8000 with reload={reload}")
    uvicorn.run("server.serve:app", host=host, port=8000, reload=reload)

if __name__ == "__main__":
    main()