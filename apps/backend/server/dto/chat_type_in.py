from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import re


class ChatTypeIn(BaseModel):
    """Data transfer object for chat type input."""
    question: str = Field(..., min_length=1, max_length=512)
    date: datetime = Field(default_factory=datetime.now)

    @field_validator('question')
    @classmethod
    def sanitize_question(cls, v: str) -> str:
        v = v.strip()
        
        # Remove HTML tags if any
        v = re.sub('<[^<]+?>', '', v)
        
        if not v:
            raise ValueError('Question cannot be empty or whitespace only')
            
        return v