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

    def _get_base_url(self):
        if self.s3_endpoint:
            return f"{self.s3_endpoint}/{self.bucket_name}"
        return f"https://{self.bucket_name}.s3.{self.aws_region}.amazonaws.com"

    def upload_image(self, file_obj, original_filename: str, content_type: str) -> str:
        """
        Uploads an image to S3 under the "temp/" folder and returns its URL.
        """
        file_extension = original_filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # 1. Save to the "temp/" folder
        s3_key = f"temp/{unique_filename}"
        
        s3_client.upload_fileobj(
            file_obj,
            self.bucket_name,
            s3_key,
            ExtraArgs={"ContentType": content_type, "ACL": "public-read"}
        )
        
        return f"{self._get_base_url()}/{s3_key}"

    def promote_image(self, temp_image_url: str) -> str:
        """
        Moves an image from temp/ to published/ and returns the new URL.
        """
        if "temp/" not in temp_image_url:
            return temp_image_url

        filename = temp_image_url.split("/")[-1]
        old_key = f"temp/{filename}"
        new_key = f"published/{filename}"

        try:
            # 1. Copy the file to the published folder
            copy_source = {'Bucket': self.bucket_name, 'Key': old_key}
            s3_client.copy_object(
                CopySource=copy_source,
                Bucket=self.bucket_name,
                Key=new_key,
                ACL="public-read"
            )
            
            # 2. Delete the original from the temp folder
            s3_client.delete_object(Bucket=self.bucket_name, Key=old_key)
            
            # 3. Return the permanent URL!
            return f"{self._get_base_url()}/{new_key}"
            
        except Exception as e:
            print(f"Failed to promote image {filename}: {e}")
            return temp_image_url # Fallback to temp if moving fails