from pydantic import BaseModel
from typing import List

class BlogPostCreate(BaseModel):
    """
    Schema for creating a new blog post.
    """
    title: str
    content: str
    author_id: str
    image_urls: List[str] = []

class BlogPostResponse(BlogPostCreate):
    """
    Schema for the response when fetching blog posts, includes additional metadata.
    """
    id: str
    created_at: str