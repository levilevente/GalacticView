import os

from botocore.exceptions import ClientError

from app.core.aws import s3_client


def ensure_s3_bucket() -> None:
    """
    Create the blog images bucket if it does not already exist.
    Safe to call before every upload in local/dev environments.
    """
    bucket_name = os.getenv("S3_BUCKET_NAME", "galactic-blog-images")
    region = os.getenv("AWS_REGION", "eu-central-1")

    try:
        s3_client.head_bucket(Bucket=bucket_name)
        return
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code", "")
        if error_code not in {"404", "NoSuchBucket", "NotFound", "403"}:
            raise

    if region == "us-east-1":
        s3_client.create_bucket(Bucket=bucket_name)
    else:
        s3_client.create_bucket(
            Bucket=bucket_name,
            CreateBucketConfiguration={"LocationConstraint": region},
        )
