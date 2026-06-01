import uuid
from datetime import datetime, timezone
from app.repositories.blog_repo import BlogRepository
from app.schema.blog_schema import BlogPostCreate

class BlogService:
    """
    A service class responsible for handling all business logic related to blog posts.
    """
    def __init__(self, repo: BlogRepository):
        self.repo = repo

    def create_new_blog(self, post_data: BlogPostCreate) -> dict:
        """
        Creates a new blog post by generating necessary metadata and saving it to the repository.
        """
        document = post_data.model_dump()
                
        document["id"] = str(uuid.uuid4()) 
        document["created_at"] = datetime.now(timezone.utc).isoformat()
        
        return self.repo.create_post(document)

    def fetch_all_blogs(self) -> list:
        """
        Fetches all blog posts from the repository.
        """
        return self.repo.get_all_posts()

    def delete_blog(self, blog_id: str) -> dict:
        """
        Deletes a blog post by ID from the repository.
        """
        return self.repo.delete_post(blog_id)