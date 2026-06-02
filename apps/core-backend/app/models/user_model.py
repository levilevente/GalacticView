from sqlalchemy import Column, String, DateTime
from app.core.database import Base
from datetime import datetime

class User(Base):
    """
    SQLAlchemy model representing a user in the database.
    This model includes fields for user identification, authentication, and profile information.
    """
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # Firebase UID
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    role = Column(String, default="user")
    created_at = Column(DateTime, default=datetime.utcnow)