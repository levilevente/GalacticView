from pydantic import BaseModel, Field

class TextAndImageStructure(BaseModel):
    title: str = Field(description="A catchy title for the topic")
    content: str = Field(description="A detailed summary of the topic")
    images: list[dict[str, str]] = Field(
        description="A list of image results with URLs and titles"
    )


class TextResponseStructure(BaseModel):
    title: str = Field(description="A catchy title for the topic")
    content: str = Field(description="A detailed summary of the topic")


class ImageResponseStructure(BaseModel):
    images: list[dict[str, str]] = Field(
        description="A list of image results with URLs and titles"
    )

class SpaceResponseStructure(BaseModel):
    title: str = Field(description="A catchy title for the topic")
    content: str = Field(description="A detailed summary of the topic or the main response message")
    key_metrics: list[str] = Field(description="A list of key metrics, facts, or bullet points related to the query")
