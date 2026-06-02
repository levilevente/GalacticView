from sqlalchemy.orm import Session
from app.models.user_model import User

class UserRepository:
    """
    Repository for handling user-related database operations.
    """
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_id(self, user_id: str) -> User | None:
        """
        Retrieve a user by their unique ID (Firebase UID).
        """
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_username(self, username: str) -> User | None:
        """
        Retrieve a user by their username.
        """
        return self.db.query(User).filter(User.username == username).first()

    def create_user(self, uid: str, email: str, username: str, first_name: str, last_name: str) -> User:
        """
        Create a new user in the database.
        """
        new_user = User(
            id=uid,
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            role="user"
        )
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user