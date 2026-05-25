from fastapi import Request, HTTPException, Depends
from firebase_admin import auth
from app.core.database import SessionLocal

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
    
def get_db():
    """
    Dependency that creates a new PostgreSQL session per HTTP request 
    and safely closes it when the request is finished.
    """
    db = SessionLocal()
    try:
        # Hands the database session to your controller
        yield db
    finally:
        # Ensures the connection is closed even if an error occurs
        db.close()