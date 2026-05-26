class PlaceholderRepository:
    """Repository seam for future PostgreSQL/PostGIS persistence.

    The current backend intentionally returns deterministic mock data. Real
    database access should be implemented here before replacing fixtures.
    """

    backend = "deterministic-mock"
