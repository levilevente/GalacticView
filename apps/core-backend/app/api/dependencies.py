from fastapi import Request, HTTPException, Depends
from firebase_admin import auth


async def get_current_user(request: Request) -> str:
    """
      Dependency to get the current user based on the session cookie.
      This will be used in protected routes to ensure the user is authenticated.
    """
    session_cookie = request.cookies.get("session")
    if not session_cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
        return decoded_claims['uid']
    
    except auth.InvalidSessionCookieError:
        raise HTTPException(status_code=401, detail="Invalid session cookie")
    except auth.RevokedSessionCookieError:
        raise HTTPException(status_code=401, detail="Session cookie revoked")