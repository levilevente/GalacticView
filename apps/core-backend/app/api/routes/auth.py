from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel
from firebase_admin import auth
import firebase_admin

import datetime

class TokenRequest(BaseModel):
    id_token: str

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
async def verify_token(request: TokenRequest, response: Response):
    """
      Verify the provided Firebase ID token and create a session cookie.
      The session cookie will be set in the response for client-side authentication.
    """
    try:
        expires_in = datetime.timedelta(days=5)

        session_cookie = auth.create_session_cookie(request.id_token, expires_in=expires_in)

        response.set_cookie(
            key = "session",
            value = session_cookie,
            max_age=int(expires_in.total_seconds()),
            httponly = True,
            secure = False, # TODO: Set to True in production with HTTPS
            samesite = "lax",
        )

        return {"status": "success", "message": "Login successful"}
    except firebase_admin.auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid ID token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))