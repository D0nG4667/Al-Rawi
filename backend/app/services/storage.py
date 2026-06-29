import os
from typing import BinaryIO

import boto3
from botocore.config import Config

# Load R2 Environment Configurations
CLOUDFLARE_R2_ACCOUNT_ID = os.getenv("CLOUDFLARE_R2_ACCOUNT_ID")
CLOUDFLARE_R2_ACCESS_KEY_ID = os.getenv("CLOUDFLARE_R2_ACCESS_KEY_ID")
CLOUDFLARE_R2_SECRET_ACCESS_KEY = os.getenv("CLOUDFLARE_R2_SECRET_ACCESS_KEY")
CLOUDFLARE_R2_BUCKET_NAME = os.getenv("CLOUDFLARE_R2_BUCKET_NAME")

# Initialize S3 Client targeting Cloudflare R2 Storage endpoint
r2_client = boto3.client(
    "s3",
    endpoint_url=f"https://{CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
    if CLOUDFLARE_R2_ACCOUNT_ID
    else None,
    aws_access_key_id=CLOUDFLARE_R2_ACCESS_KEY_ID,
    aws_secret_access_key=CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    config=Config(signature_version="s3v4"),
    region_name="auto",
)


def upload_to_r2(file_obj: BinaryIO, object_name: str) -> str:
    """
    Uploads a binary file stream directly to the Cloudflare R2 bucket.
    Returns the public/access URL of the uploaded asset.
    """
    r2_client.upload_fileobj(
        file_obj,
        CLOUDFLARE_R2_BUCKET_NAME,
        object_name,
        ExtraArgs={"ContentType": "application/octet-stream"},
    )
    # Return formatted R2 URL path
    return f"https://{CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/{CLOUDFLARE_R2_BUCKET_NAME}/{object_name}"


def delete_from_r2(object_name: str) -> None:
    """
    Deletes an asset from the Cloudflare R2 bucket.
    """
    r2_client.delete_object(Bucket=CLOUDFLARE_R2_BUCKET_NAME, Key=object_name)
