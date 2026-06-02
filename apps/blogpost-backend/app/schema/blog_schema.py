from pydantic import BaseModel, Field
from typing import List, Optional


class BlogPostCreate(BaseModel):
    """
    Schema for creating a new blog post.
    """
    title: str
    content: str
    image_urls: List[str] = Field(default_factory=list)


class BlogPostResponse(BaseModel):
    """
    Schema for the response when fetching blog posts, includes additional metadata.
    """
    id: str
    title: str
    content: str
    image_urls: List[str] = Field(default_factory=list)
    author_name: str
    author_id: Optional[str] = None
    created_at: str