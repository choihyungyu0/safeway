from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

try:
    from sqlalchemy import create_engine
    from sqlalchemy.engine import Engine
    from sqlalchemy.orm import Session, sessionmaker
except ImportError as exc:  # pragma: no cover - supports fixture fallback before deps install
    create_engine = None  # type: ignore[assignment]
    Engine = object  # type: ignore[misc,assignment]
    Session = object  # type: ignore[misc,assignment]
    sessionmaker = None  # type: ignore[assignment]
    _IMPORT_ERROR: Exception | None = exc
else:
    _IMPORT_ERROR = None

_engine: Engine | None = None
_session_factory: sessionmaker[Session] | None = None


def is_database_available_for_use(force: bool = False) -> bool:
    enabled = bool(settings.database_url) if force else settings.database_enabled

    return bool(enabled and _IMPORT_ERROR is None and create_engine is not None)


def get_engine(force: bool = False) -> Engine | None:
    global _engine

    if not is_database_available_for_use(force=force) or settings.database_url is None:
        return None

    if _engine is None:
        connect_args = {}
        if settings.database_url.startswith("postgresql"):
            connect_args["connect_timeout"] = 2

        _engine = create_engine(
            settings.database_url,
            echo=settings.db_echo,
            pool_pre_ping=True,
            connect_args=connect_args,
        )

    return _engine


def get_session_factory(force: bool = False) -> sessionmaker[Session] | None:
    global _session_factory

    if _session_factory is None:
        engine = get_engine(force=force)
        if engine is None or sessionmaker is None:
            return None

        _session_factory = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

    return _session_factory


@contextmanager
def session_scope(force: bool = False) -> Iterator[Session | None]:
    factory = get_session_factory(force=force)
    if factory is None:
        if _IMPORT_ERROR is not None:
            logger.info("SQLAlchemy is unavailable; using fixture fallback: %s", _IMPORT_ERROR)
        yield None
        return

    session = factory()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
