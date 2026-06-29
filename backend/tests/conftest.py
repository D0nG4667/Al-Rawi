import os

# Set mock environment variables before any application code gets loaded
os.environ["GOOGLE_API_KEY"] = "mock_google_api_key_for_testing"
os.environ["DATABASE_URL"] = "postgresql://postgres:postgres@localhost:5432/neondb"
os.environ["REDIS_URL"] = "redis://localhost:6379"
os.environ["SENTRY_DSN"] = "https://mock@sentry.io/1"
