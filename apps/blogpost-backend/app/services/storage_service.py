import os
import uuid
from typing import BinaryIO
from urllib.parse import urlparse

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
        if self.s3_endpoint:
            extra_args["ACL"] = "public-read"
        return extra_args

    def _canonical_url(self, s3_key: str) -> str:
        return f"{self._get_base_url()}/{s3_key}"

    def _presign_url(self, s3_key: str, expires_in: int = 86400) -> str:
        if self.s3_endpoint:
            return self._canonical_url(s3_key)
        return s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket_name, "Key": s3_key},
            ExpiresIn=expires_in,
        )

    def presign_from_url(self, image_url: str, expires_in: int = 86400) -> str:
        key = self._url_to_key(image_url)
        return self._presign_url(key, expires_in=expires_in)

    def _url_to_key(self, image_url: str) -> str:
        url_without_query = image_url.split("?", 1)[0].rstrip("/")
        parsed = urlparse(url_without_query)
        host = parsed.netloc
        path = parsed.path.lstrip("/")

        if host.startswith("s3.") or host == "s3.amazonaws.com":
            bucket, _, key = path.partition("/")
            if bucket == self.bucket_name and key:
                return key

        if host.startswith(f"{self.bucket_name}."):
            if path:
                return path

        if self.s3_public_endpoint:
            localstack_host = urlparse(self.s3_public_endpoint.rstrip("/")).netloc
            if host == localstack_host and path.startswith(f"{self.bucket_name}/"):
                return path[len(self.bucket_name) + 1 :]

        raise ImagePromotionError(
            temp_image_url=image_url,
            message="Unrecognized image URL — only uploaded images are accepted.",
        )

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

        return self._presign_url(s3_key)

    def promote_image(self, temp_image_url: str) -> str:
        """
        Moves an image from temp/ to published/ and returns the new URL.
        All URLs are guaranteed to come from our own upload endpoint.
        """
        source_key = self._url_to_key(temp_image_url)

        if source_key.startswith("published/"):
            return self._canonical_url(source_key)

        if not source_key.startswith("temp/"):
            raise ImagePromotionError(
                temp_image_url=temp_image_url,
                message="Unrecognized image URL — only uploaded images are accepted.",
            )

        filename = source_key.removeprefix("temp/")
        new_key = f"published/{filename}"

        if self._object_exists(new_key):
            return self._canonical_url(new_key)

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
        if self.s3_endpoint:
            copy_args["ACL"] = "public-read"
        s3_client.copy_object(**copy_args)
        s3_client.delete_object(Bucket=self.bucket_name, Key=source_key)

        return self._canonical_url(new_key)
