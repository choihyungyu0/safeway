from dataclasses import dataclass, field
import os

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover - dependency is installed in backend runtime
    load_dotenv = None

if load_dotenv is not None:
    load_dotenv()


def _split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def _to_bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "y", "on"}


@dataclass(frozen=True)
class Settings:
    app_name: str = field(default_factory=lambda: os.getenv("APP_NAME", "Sejong Safeway API"))
    app_version: str = field(default_factory=lambda: os.getenv("APP_VERSION", "0.1.0"))
    environment: str = field(default_factory=lambda: os.getenv("APP_ENV", "local"))
    database_url: str | None = field(default_factory=lambda: os.getenv("DATABASE_URL") or None)
    db_echo: bool = field(default_factory=lambda: _to_bool(os.getenv("DB_ECHO"), False))
    use_database: bool | None = None
    cors_origins: list[str] | None = None

    def __post_init__(self) -> None:
        if self.use_database is None:
            object.__setattr__(
                self,
                "use_database",
                _to_bool(os.getenv("USE_DATABASE"), default=bool(self.database_url)),
            )

        if self.cors_origins is None:
            object.__setattr__(
                self,
                "cors_origins",
                _split_csv(os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174")),
            )

    @property
    def database_enabled(self) -> bool:
        return bool(self.use_database and self.database_url)


settings = Settings()
