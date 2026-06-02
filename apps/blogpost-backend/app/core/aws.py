import os
import boto3
from dotenv import load_dotenv
from botocore.config import Config

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION", "eu-central-1")
DYNAMODB_ENDPOINT = os.getenv("DYNAMODB_ENDPOINT")
S3_ENDPOINT = os.getenv("S3_ENDPOINT")  # Grab the LocalStack URL

# Configure the DynamoDB resource
dynamodb_args = {"region_name": AWS_REGION}
if DYNAMODB_ENDPOINT:
    dynamodb_args["endpoint_url"] = DYNAMODB_ENDPOINT

dynamodb = boto3.resource('dynamodb', **dynamodb_args)

# Configure the S3 client (for future image uploads)
s3_args = {
    "region_name": AWS_REGION,
    "config": Config(s3={'addressing_style': 'path'}) # Forces LocalStack compatibility
}
if S3_ENDPOINT:
    s3_args["endpoint_url"] = S3_ENDPOINT # Route traffic to LocalStack!

s3_client = boto3.client('s3', **s3_args)