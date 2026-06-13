import os
import uuid
from typing import BinaryIO

from botocore.exceptions import ClientError

from app.core.aws import s3_client


class ImagePromotionError(Exception):
    """Raised when a temp image cannot be moved to the published folder."""

    def __init__(self, temp_image_url: str, message: str):
        self.temp_image_url = temp_image_url
        super().__init__(message)


class StorageService:
    """
    A service class responsible for handling all interactions with the storage layer (S3).
    """
    def __init__(self) -> None:
        self.bucket_name = os.getenv("S3_BUCKET_NAME", "galactic-blog-images")
        self.s3_endpoint = os.getenv("S3_ENDPOINT")
        self.s3_public_endpoint = os.getenv("S3_PUBLIC_ENDPOINT", self.s3_endpoint)
        self.aws_region = os.getenv("AWS_REGION", "eu-central-1")

    def _get_base_url(self) -> str:
        if self.s3_public_endpoint:
            return f"{self.s3_public_endpoint.rstrip('/')}/{self.bucket_name}"
        return f"https://{self.bucket_name}.s3.{self.aws_region}.amazonaws.com"

    def _object_exists(self, key: str) -> bool:
        try:
            s3_client.head_object(Bucket=self.bucket_name, Key=key)
            return True
        except ClientError as e:
            if e.response["Error"]["Code"] in {"404", "NoSuchKey", "NotFound"}:
                return False
            raise

    def _upload_extra_args(self, content_type: str) -> dict[str, str]:
        extra_args: dict[str, str] = {"ContentType": content_type}
        if not self.s3_endpoint:
            extra_args["ACL"] = "public-read"
        return extra_args

    def upload_image(self, file_obj: BinaryIO, original_filename: str, content_type: str) -> str:
        """
        Uploads an image to S3 under the "temp/" folder and returns its URL.
        """
        _, ext = os.path.splitext(original_filename)
        file_extension = ext.lstrip(".") or "bin"
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        s3_key = f"temp/{unique_filename}"

        s3_client.upload_fileobj(
            file_obj,
            self.bucket_name,
            s3_key,
            ExtraArgs=self._upload_extra_args(content_type),
        )

        if not self._object_exists(s3_key):
            raise ImagePromotionError(
                temp_image_url=s3_key,
                message="Image upload did not persist in storage. Please try again.",
            )

        return f"{self._get_base_url()}/{s3_key}"

    def promote_image(self, temp_image_url: str) -> str:
        """
        Moves an image from temp/ to published/ and returns the new URL.
        All URLs are guaranteed to come from our own upload endpoint.
        """
        base = f"{self._get_base_url()}/"
        if not temp_image_url.startswith(base):
            raise ImagePromotionError(
                temp_image_url=temp_image_url,
                message="Unrecognized image URL — only uploaded images are accepted.",
            )

        source_key = temp_image_url[len(base):]

        if source_key.startswith("published/"):
            return temp_image_url

        if not source_key.startswith("temp/"):
            raise ImagePromotionError(
                temp_image_url=temp_image_url,
                message="Unrecognized image URL — only uploaded images are accepted.",
            )

        filename = source_key.removeprefix("temp/")
        new_key = f"published/{filename}"

        if self._object_exists(new_key):
            return f"{self._get_base_url()}/{new_key}"

        if not self._object_exists(source_key):
            raise ImagePromotionError(
                temp_image_url=temp_image_url,
                message=(
                    "Temporary image not found in storage. "
                    "It may have expired or storage was reset — please re-upload the image."
                ),
            )

        copy_source = {"Bucket": self.bucket_name, "Key": source_key}
        copy_args: dict[str, object] = {
            "CopySource": copy_source,
            "Bucket": self.bucket_name,
            "Key": new_key,
        }
        if not self.s3_endpoint:
            copy_args["ACL"] = "public-read"
        s3_client.copy_object(**copy_args)
        s3_client.delete_object(Bucket=self.bucket_name, Key=source_key)

        return f"{self._get_base_url()}/{new_key}"