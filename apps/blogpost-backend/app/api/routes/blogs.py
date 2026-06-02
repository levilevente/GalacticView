from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List
from app.api.dependencies import get_author_name, require_auth
from app.schema.blog_schema import BlogPostCreate, BlogPostResponse
from app.repositories.blog_repo import BlogRepository
from app.services.blog_service import BlogService
from app.core.aws import dynamodb
from app.services.storage_service import StorageService, ImagePromotionError


router = APIRouter(prefix="/blogs", tags=["blogs"])

def get_blog_service():
    """
    Connect to the specific DynamoDB table
    """
    table = dynamodb.Table("GalacticBlogPosts")
    repo = BlogRepository(table)
    return BlogService(repo)

def get_storage_service():
    """
    Provides an instance of StorageService for handling S3 interactions.
    """
    return StorageService()

@router.post("/upload-image", dependencies=[Depends(require_auth)])
def upload_image(
    file: UploadFile = File(...),
    storage: StorageService = Depends(get_storage_service),
):
    """
    Receives an image file, uploads it to S3, and returns the public URL.
    """
    try:
        image_url = storage.upload_image(file.file, file.filename or "upload", file.content_type or "application/octet-stream")
        return {
            "status": "success", 
            "image_url": image_url
        }
    except ImagePromotionError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to upload image")
    
@router.post("/", response_model=BlogPostResponse)
def create_blog_post(
    request: BlogPostCreate,
    author_name: str = Depends(get_author_name),
    service: BlogService = Depends(get_blog_service),
):
    """
    Creates a new blog post. The author name is resolved from the session cookie.
    """
    try:
        return service.create_new_blog(request, author_name)
    except ImagePromotionError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[BlogPostResponse])
def get_blogs(service: BlogService = Depends(get_blog_service)):
    """
    Fetches all blog posts.
    """
    return service.fetch_all_blogs()

@router.delete("/{blog_id}", dependencies=[Depends(require_auth)])
def delete_blog(
    blog_id: str,
    service: BlogService = Depends(get_blog_service),
):
    """
    Deletes a blog post by ID.
    """
    return service.delete_blog(blog_id)