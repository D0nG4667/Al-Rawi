import hashlib
import hmac
from typing import Union


def generate_file_signature(file_bytes: bytes, secret_key: str) -> str:
    """
    Generates an HMAC-SHA256 signature for the given file bytes using a secret key.
    """
    key = secret_key.encode("utf-8")
    h = hmac.new(key, file_bytes, hashlib.sha256)
    return h.hexdigest()


def verify_file_signature(file_bytes: bytes, signature: str, secret_key: str) -> bool:
    """
    Verifies that the generated HMAC-SHA256 signature matches the provided signature.
    Uses hmac.compare_digest to prevent timing attacks.
    """
    expected = generate_file_signature(file_bytes, secret_key)
    return hmac.compare_digest(expected, signature)


def compute_sha256_hash(data: Union[bytes, str]) -> str:
    """
    Computes a standard SHA-256 hash of data.
    """
    if isinstance(data, str):
        data = data.encode("utf-8")
    return hashlib.sha256(data).hexdigest()
