import os
import sys

if __name__ == "__main__" and __package__ is None:
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    if repo_root not in sys.path:
        sys.path.insert(0, repo_root)

from app.core.aws import dynamodb, s3_client

def setup_dynamodb():
    """
    Creates the DynamoDB table for blog posts if it doesn't already exist.
    """
    try:
        table = dynamodb.create_table(
            TableName='GalacticBlogPosts',
            KeySchema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
            AttributeDefinitions=[{'AttributeName': 'id', 'AttributeType': 'S'}],
            BillingMode='PAY_PER_REQUEST'
        )
        table.meta.client.get_waiter('table_exists').wait(TableName='GalacticBlogPosts')
        print("Table created successfully!")
    except Exception as e:
        print(f"Table might already exist: {e}")

def setup_s3():
    """
    Creates the S3 bucket for storing blog images if it doesn't already exist.
    """
    bucket_name = os.getenv("S3_BUCKET_NAME", "galactic-blog-images")
    region = os.getenv("AWS_REGION", "eu-central-1")
    
    try:
        # AWS requires a specific LocationConstraint for regions outside us-east-1
        if region == "us-east-1":
            s3_client.create_bucket(Bucket=bucket_name)
        else:
            s3_client.create_bucket(
                Bucket=bucket_name,
                CreateBucketConfiguration={'LocationConstraint': region}
            )
        print(f"✅ S3 Bucket '{bucket_name}' created successfully!")
    except Exception as e:
        print(f"⚠️ S3 Bucket status: {e}")

def set_s3_lifecycle_rule():
    """
    Sets a lifecycle rule on the S3 bucket to automatically delete images in the "temp/" folder after 24 hours.
    """
    bucket_name = os.getenv("S3_BUCKET_NAME", "galactic-blog-images")
    
    lifecycle_configuration = {
        'Rules': [
            {
                'ID': 'DeleteTempImagesAfter24Hours',
                'Filter': {
                    'Prefix': 'temp/'
                },
                'Status': 'Enabled',
                'Expiration': {
                    'Days': 1 # Delete after 1 day
                }
            }
        ]
    }
    
    try:
        s3_client.put_bucket_lifecycle_configuration(
            Bucket=bucket_name,
            LifecycleConfiguration=lifecycle_configuration
        )
        print("✅ S3 Lifecycle Rule set: Temp images expire in 24 hours.")
    except Exception as e:
        print(f"⚠️ S3 Lifecycle configuration failed: {e}")

if __name__ == "__main__":
    setup_dynamodb()
    setup_s3()
    set_s3_lifecycle_rule()