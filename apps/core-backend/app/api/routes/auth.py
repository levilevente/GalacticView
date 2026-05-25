from fastapi import APIRouter, Response, HTTPException, Depends
from pydantic import BaseModel
from app.api.dependencies import get_current_user
from app.schema.user_schema import RegisterRequest
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from sqlalchemy.orm import Session
from app.database import get_db


class TokenRequest(BaseModel):
    id_token: str

router = APIRouter(prefix="/auth", tags=["auth"])

def get_auth_service(db: Session = Depends(get_db)):
    """
    DI helper
    """
    repo = UserRepository(db)
    return AuthService(repo)

@router.post("/register")
async def register(
    request: RegisterRequest, 
    response: Response, 
    service: AuthService = Depends(get_auth_service)
):
    """
    1. Verify the username is available in the DB
    2. Verify with Firebase
    3. Save to PostgreSQL
    4. Mint the Session Cookie
    """
    cookie_data = service.register_user(request.id_token, request.username)
    
    response.set_cookie(
        key="session",
        value=cookie_data["cookie"],
        max_age=cookie_data["expires"],
        httponly=True,
        samesite="lax",
        secure=False # True in production
    )
    return {"status": "success", "message": "Registered and logged in"}

@router.post("/login")
async def login(
    request: TokenRequest, 
    response: Response, 
    service: AuthService = Depends(get_auth_service)
):
    """
    Just mint the cookie, the frontend already verified the password.
    """
    cookie_data = service.login_user(request.id_token)
    
    response.set_cookie(
        key="session", value=cookie_data["cookie"], max_age=cookie_data["expires"],
        httponly=True, samesite="lax", secure=False
    )
    return {"status": "success", "message": "Login successful"}


@router.post("/logout")
async def logout(response: Response):
    """
      Clear the session cookie to log the user out.
    """
    response.delete_cookie(key="session")
    return {"status": "success", "message": "Logout successful"}


@router.get("/me")
async def get_my_profile(uid: str = Depends(get_current_user), db: Session = Depends(get_db)):
    """
      Retrieve the current user's information based on the session cookie.
    """
    repo = UserRepository(db)
    user = repo.get_user_by_id(uid)
    return user