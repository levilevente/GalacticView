import os

import httpx
from fastapi import Request, HTTPException

CORE_BACKEND_URL = os.getenv("CORE_BACKEND_URL", "http://localhost:8001")


async def _verify_session(session_cookie: str) -> dict:
    """
    Forwards the session cookie to the core-backend and returns the user dict.
    Raises HTTPException on any auth failure.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{CORE_BACKEND_URL}/auth/me",
                cookies={"session": session_cookie},
            )
        except httpx.RequestError as exc:
            raise HTTPException(status_code=502, detail="Auth service unavailable") from exc

    if response.status_code == 401:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Auth service returned an error")

    return response.json().get("user", {})


async def require_auth(request: Request) -> None:
    """
    Lightweight auth guard — verifies the session cookie is present and valid.
    Use as a dependency on endpoints that need auth but don't need the user's name.
    """
    session_cookie = request.cookies.get("session")
    if not session_cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")

    await _verify_session(session_cookie)


async def get_author_name(request: Request) -> str:
    """
    Resolves the author name by forwarding the session cookie
    to the core-backend's /auth/me endpoint.
    """
    session_cookie = request.cookies.get("session")
    if not session_cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user = await _verify_session(session_cookie)
    name = user.get("username") or f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
    if not name:
        raise HTTPException(status_code=401, detail="Could not resolve author identity")

    return name
