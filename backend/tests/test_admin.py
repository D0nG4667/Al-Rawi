from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


# 1. Helper classes for mocking psycopg AsyncConnection and Cursor
class AsyncContextManagerMock:
    """Mock that implements async context manager protocols natively."""

    def __init__(self, return_value):
        self.return_value = return_value

    async def __aenter__(self):
        return self.return_value

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass


class MockConnection:
    """Mock connection implementing async context manager returning self, and cursor()."""

    def __init__(self, cursor_mock):
        self.cursor_mock = cursor_mock

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass

    def cursor(self):
        return AsyncContextManagerMock(self.cursor_mock)


def test_verify_admin_role_authorization() -> None:
    """Verifies that requests without admin role tags are rejected with 403 Forbidden."""
    # No auth headers -> 403
    response = client.get("/api/v1/admin/telemetry")
    assert response.status_code == 403
    assert "privileges required" in response.json()["detail"]

    # Non-admin role header -> 403
    response = client.get("/api/v1/admin/telemetry", headers={"X-User-Role": "guest"})
    assert response.status_code == 403

    # Valid admin role header -> 200 (Mock DB queries so they don't crash)
    mock_cursor = AsyncMock()
    mock_cursor.fetchone.return_value = (False,)
    mock_conn = MockConnection(mock_cursor)

    with (
        patch("psycopg.AsyncConnection.connect", return_value=mock_conn),
        patch("app.main.redis_client"),
    ):
        response = client.get(
            "/api/v1/admin/telemetry", headers={"X-User-Role": "admin"}
        )
        assert response.status_code == 200

        # Valid Authorization header -> 200
        response = client.get(
            "/api/v1/admin/telemetry",
            headers={"Authorization": "Bearer admin-token"},
        )
        assert response.status_code == 200


@pytest.mark.anyio
@patch("psycopg.AsyncConnection.connect")
async def test_get_admin_telemetry(mock_connect) -> None:
    """Verify admin telemetry endpoint reads vector counts and database stats correctly."""
    # Mock Cursor execution yielding vector count and connection count
    mock_cursor = AsyncMock()
    mock_cursor.fetchone.side_effect = [
        (True,),  # langchain_pg_embedding table exists
        (12408,),  # total vector count
        (3,),  # active connections count
    ]

    mock_conn = MockConnection(mock_cursor)
    mock_connect.return_value = mock_conn

    with patch("app.main.redis_client") as mock_redis:
        mock_redis.ping = AsyncMock()

        response = client.get(
            "/api/v1/admin/telemetry", headers={"X-User-Role": "admin"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["database"]["total_vectors"] == 12408
        assert data["database"]["active_connections"] == 3
        assert data["redis"]["status"] == "connected"


@pytest.mark.anyio
@patch("app.main.redis_client")
async def test_invalidate_semantic_cache(mock_redis) -> None:
    """Verify admin cache invalidation flushes matching keys from Redis."""
    mock_redis.keys = AsyncMock(return_value=["cache_tenant_1", "cache_tenant_2"])
    mock_redis.delete = AsyncMock()

    payload = {"pattern": "cache_tenant_*"}
    response = client.post(
        "/api/v1/admin/cache/invalidate",
        json=payload,
        headers={"X-User-Role": "admin"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["invalidated_keys_count"] == 2
    mock_redis.delete.assert_called_once_with("cache_tenant_1", "cache_tenant_2")


@pytest.mark.anyio
async def test_upload_mesh_validation_and_queuing() -> None:
    """Verify admin upload mesh blocks invalid formats and queues GLTF/OBJ successfully."""
    # Invalid extension -> 400
    files = {"file": ("test.png", b"fake-png-bytes", "image/png")}
    response = client.post(
        "/api/v1/admin/upload-mesh", files=files, headers={"X-User-Role": "admin"}
    )
    assert response.status_code == 400
    assert "Only .gltf and .obj" in response.json()["detail"]

    # Valid gltf file -> queued
    files = {"file": ("temple_gate.gltf", b"fake-gltf-structure", "application/json")}

    # Mock arq_pool
    mock_job = MagicMock()
    mock_job.job_id = "mesh_job_456"
    mock_arq_pool = AsyncMock()
    mock_arq_pool.enqueue_job.return_value = mock_job
    app.state.arq_pool = mock_arq_pool

    try:
        response = client.post(
            "/api/v1/admin/upload-mesh",
            files=files,
            headers={"X-User-Role": "admin"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "queued"
        assert data["job_id"] == "mesh_job_456"
        mock_arq_pool.enqueue_job.assert_called_once()
    finally:
        app.state.arq_pool = None


@pytest.mark.anyio
@patch("psycopg.AsyncConnection.connect")
async def test_log_heatmap_coordinates(mock_connect) -> None:
    """Verify admin telemetry heatmap logs coordinates to tourist_heatmap table."""
    mock_cursor = AsyncMock()
    mock_conn = MockConnection(mock_cursor)
    mock_connect.return_value = mock_conn

    payload = {
        "x": 12.34,
        "y": -5.67,
        "z": 100.89,
        "element_id": "doorway_arch",
        "session_id": "session_abc",
    }
    response = client.post(
        "/api/v1/admin/telemetry/heatmap",
        json=payload,
        headers={"X-User-Role": "admin"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # Verify SQL query executed successfully
    mock_cursor.execute.assert_any_call(
        "\n                    INSERT INTO tourist_heatmap (x, y, z, element_id, session_id)\n                    VALUES (%s, %s, %s, %s, %s);\n                    ",
        (12.34, -5.67, 100.89, "doorway_arch", "session_abc"),
    )
