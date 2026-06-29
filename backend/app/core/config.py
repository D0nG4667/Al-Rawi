from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App General Settings
    APP_NAME: str = "Al-Rawi API"
    APP_TITLE: str = "Al-Rawi API"
    APP_DESCRIPTION: str = "Saudi Heritage & Tourism AI Oracle API Platform"
    APP_VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # API Keys & Secrets
    GOOGLE_API_KEY: str
    DATABASE_URL: str
    REDIS_URL: str
    SENTRY_DSN: str | None = None

    # LangSmith settings
    LANGCHAIN_TRACING_V2: str | None = None
    LANGCHAIN_API_KEY: str | None = None
    LANGCHAIN_PROJECT: str | None = None

    # Third Party integrations
    ELEVEN_API_KEY: str | None = None
    GROQ_API_KEY: str | None = None
    OPENAI_API_KEY: str | None = None
    ANTHROPIC_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
