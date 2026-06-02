import datetime
from typing import Any

from fastapi import HTTPException
from firebase_admin import auth
from app.repositories.user_repo import UserRepository
from app.models.user_model import User

class AuthService:
    """
    Service for handling authentication-related operations.
    """
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register_user(
        self, id_token: str, username: str, first_name: str, last_name: str
    ) -> dict[str, Any]:
        """
        1. Verify the username is available in the DB
        2. Verify with Firebase
        3. Save to PostgreSQL
        4. Mint the Session Cookie
        """
        
        if self.user_repo.get_user_by_username(username):
            raise HTTPException(status_code=400, detail="Username already taken")

        try:
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            email = decoded_token['email']
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid Firebase Token")

        existing_user = self.user_repo.get_user_by_id(uid)
        if not existing_user:
            self.user_repo.create_user(uid=uid, email=email, username=username, first_name=first_name, last_name=last_name)
        else:
            raise HTTPException(status_code=400, detail="User already exists")

        return self._create_cookie(id_token)

    def login_user(self, id_token: str) -> dict[str, Any]:
        """
        Creates cookie on login
        """
        return self._create_cookie(id_token)
    
    def get_user_by_id(self, user_id: str) -> User:
        """
        Retrieve a user by their unique ID (Firebase UID).
        """
        user = self.user_repo.get_user_by_id(user_id)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def _create_cookie(self, id_token: str) -> dict:
        """
        Create a session cookie from the Firebase ID token.
        """
        expires_in = datetime.timedelta(days=5)
        try:
            session_cookie = auth.create_session_cookie(id_token, expires_in=expires_in)
            return {
                "cookie": session_cookie,
                "expires": int(expires_in.total_seconds())
            }
        except Exception:
            raise HTTPException(status_code=401, detail="Failed to create session")