import uuid
from datetime import datetime
from app.repositories.blog_repo import BlogRepository
from app.schema.blog_schema import BlogPostCreate
from app.services.storage_service import StorageService

class BlogService:
    """
    A service class responsible for handling all business logic related to blog posts.
    """
    def __init__(self, repo: BlogRepository):
        self.repo = repo
        self.storage_service = StorageService()

    def create_new_blog(self, post_data: BlogPostCreate, author_name: str) -> dict:
        """
        Creates a new blog post by generating necessary metadata and saving it to the repository.
        """
        document = post_data.dict()
        document["id"] = str(uuid.uuid4())
        document["author_name"] = author_name
        document["created_at"] = datetime.utcnow().isoformat()
        
        # move all the images sent by FE to 'published/' so the 24-hour AWS grim reaper doesn't delete them
        permanent_image_urls = []
        for temp_url in document.get("image_urls", []):
            permanent_url = self.storage_service.promote_image(temp_url)
            permanent_image_urls.append(permanent_url)
            
        document["image_urls"] = permanent_image_urls
        
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