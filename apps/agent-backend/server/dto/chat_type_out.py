from pydantic import BaseModel, ConfigDict, Field


class ChatTypeOut(BaseModel):
    """Data transfer object for chat type output."""

    model_config = ConfigDict(populate_by_name=True)

    title: str
    content: str
    key_metrics: list[str] = Field(serialization_alias="keyMetrics")
