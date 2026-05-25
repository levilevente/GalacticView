from pydantic import BaseModel
from datetime import datetime

class TokenRequest(BaseModel):
    """
    Request model for user authentication, containing the Firebase ID token.
    """
    id_token: str

class RegisterRequest(TokenRequest):
    """
    Request model for user registration, extending the TokenRequest with additional user details.
    """
    username: str
    first_name: str
    last_name: str

class UserResponse(BaseModel):
    """
    Response model for user information.
    """
    id: str
    email: str
    username: str
    first_name: str
    last_name: str
    role: str
    created_at: datetime

    class Config:
        """
        Pydantic configuration to enable ORM mode, allowing it to work with SQLAlchemy models.
        """
        orm_mode = True