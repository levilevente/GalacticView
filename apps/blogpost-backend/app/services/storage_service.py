import os
import uuid
from app.core.aws import s3_client

class StorageService:
    """
    A service class responsible for handling all interactions with the storage layer (S3).
    """
    def __init__(self):
        self.bucket_name = os.getenv("S3_BUCKET_NAME", "galactic-blog-images")
        self.s3_endpoint = os.getenv("S3_ENDPOINT")
        self.aws_region = os.getenv("AWS_REGION", "eu-central-1")

    def upload_image(self, file_obj, original_filename: str | None, content_type: str | None) -> str:
        """
        Uploads a file to the storage bucket and returns the public URL.
        """
        _, ext = os.path.splitext(original_filename or "")
        file_extension = ext.lstrip(".") or "bin"
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        s3_client.upload_fileobj(
            file_obj,
            self.bucket_name,
            unique_filename,
            ExtraArgs={
                "ContentType": content_type or "application/octet-stream", 
                "ACL": "public-read"
            }
        )
        
        if self.s3_endpoint:
            return f"{self.s3_endpoint}/{self.bucket_name}/{unique_filename}"
        return f"https://{self.bucket_name}.s3.{self.aws_region}.amazonaws.com/{unique_filename}"