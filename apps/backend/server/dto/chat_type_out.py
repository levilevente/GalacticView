from pydantic import BaseModel

class ChatTypeOut(BaseModel):
    """Data transfer object for chat type output."""
    title: str
    content: str
    key_metrics: list[str]
