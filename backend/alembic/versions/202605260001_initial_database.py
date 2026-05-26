"""Initial PostgreSQL/PostGIS schema.

Revision ID: 202605260001
Revises:
Create Date: 2026-05-26
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa

try:
    from geoalchemy2 import Geometry
except ImportError:  # pragma: no cover - migration runtime dependency
    Geometry = None  # type: ignore[assignment]

revision = "202605260001"
down_revision = None
branch_labels = None
depends_on = None


def geom_column() -> sa.Column:
    if Geometry is None:
        return sa.Column("geom", sa.Text(), nullable=True)

    return sa.Column("geom", Geometry("POINT", srid=4326, spatial_index=False), nullable=True)


def upgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"

    if is_postgres:
        op.execute("CREATE EXTENSION IF NOT EXISTS postgis")

    op.create_table(
        "shelters",
        sa.Column("id", sa.String(length=80), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("road_address", sa.String(length=500), nullable=True),
        sa.Column("lot_address", sa.String(length=500), nullable=True),
        sa.Column("type", sa.String(length=100), nullable=True),
        sa.Column("area", sa.Float(), nullable=True),
        sa.Column("capacity", sa.Integer(), nullable=True),
        sa.Column("operation_start_date", sa.String(length=20), nullable=True),
        sa.Column("operation_end_date", sa.String(length=20), nullable=True),
        sa.Column("fan_count", sa.Integer(), nullable=True),
        sa.Column("air_conditioner_count", sa.Integer(), nullable=True),
        sa.Column("night_open", sa.Boolean(), nullable=False),
        sa.Column("holiday_open", sa.Boolean(), nullable=False),
        sa.Column("stay_available", sa.Boolean(), nullable=False),
        sa.Column("managing_agency", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=100), nullable=True),
        sa.Column("lat", sa.Float(), nullable=True),
        sa.Column("lng", sa.Float(), nullable=True),
        geom_column(),
        sa.Column("data_base_date", sa.String(length=20), nullable=True),
        sa.Column("capacity_score", sa.Float(), nullable=True),
        sa.Column("area_score", sa.Float(), nullable=True),
        sa.Column("cooling_score", sa.Float(), nullable=True),
        sa.Column("night_open_score", sa.Float(), nullable=True),
        sa.Column("holiday_open_score", sa.Float(), nullable=True),
        sa.Column("recommendation_score", sa.Float(), nullable=True),
        sa.Column("grade", sa.String(length=20), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_shelters_id", "shelters", ["id"])
    op.create_index("ix_shelters_name", "shelters", ["name"])
    if is_postgres:
        op.create_index("ix_shelters_geom", "shelters", ["geom"], postgresql_using="gist")

    op.create_table(
        "climate_scenarios",
        sa.Column("id", sa.String(length=80), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("temperature", sa.Float(), nullable=False),
        sa.Column("humidity", sa.Float(), nullable=False),
        sa.Column("pm10", sa.Float(), nullable=False),
        sa.Column("pm25", sa.Float(), nullable=False),
        sa.Column("ozone", sa.Float(), nullable=False),
        sa.Column("visibility_km", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_index("ix_climate_scenarios_id", "climate_scenarios", ["id"])

    op.create_table(
        "user_type_weights",
        sa.Column("id", sa.String(length=80), nullable=False),
        sa.Column("user_type_code", sa.String(length=50), nullable=False),
        sa.Column("user_type_label", sa.String(length=100), nullable=False),
        sa.Column("climate_safety_weight", sa.Float(), nullable=False),
        sa.Column("shelter_access_weight", sa.Float(), nullable=False),
        sa.Column("night_safety_weight", sa.Float(), nullable=False),
        sa.Column("exposure_time_weight", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_type_code"),
    )
    op.create_index("ix_user_type_weights_id", "user_type_weights", ["id"])

    op.create_table(
        "route_recommendations",
        sa.Column("id", sa.String(length=80), nullable=False),
        sa.Column("scenario", sa.String(length=255), nullable=False),
        sa.Column("user_type_code", sa.String(length=50), nullable=False),
        sa.Column("user_type_label", sa.String(length=100), nullable=False),
        sa.Column("route_id", sa.String(length=80), nullable=False),
        sa.Column("route_name", sa.String(length=255), nullable=False),
        sa.Column("distance_km", sa.Float(), nullable=False),
        sa.Column("shelter_within_500m_count", sa.Integer(), nullable=False),
        sa.Column("climate_risk_score", sa.Float(), nullable=False),
        sa.Column("climate_safety_score", sa.Float(), nullable=False),
        sa.Column("shelter_access_score", sa.Float(), nullable=False),
        sa.Column("night_safety_score", sa.Float(), nullable=False),
        sa.Column("exposure_score", sa.Float(), nullable=False),
        sa.Column("final_safety_score", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_route_recommendations_id", "route_recommendations", ["id"])
    op.create_index("ix_route_recommendations_route_id", "route_recommendations", ["route_id"])
    op.create_index("ix_route_recommendations_scenario", "route_recommendations", ["scenario"])
    op.create_index("ix_route_recommendations_user_type_code", "route_recommendations", ["user_type_code"])

    op.create_table(
        "data_collection_runs",
        sa.Column("id", sa.String(length=80), nullable=False),
        sa.Column("dataset_name", sa.String(length=255), nullable=False),
        sa.Column("provider", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("collected_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("row_count", sa.Integer(), nullable=True),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_data_collection_runs_id", "data_collection_runs", ["id"])

    op.create_table(
        "system_settings",
        sa.Column("key", sa.String(length=120), nullable=False),
        sa.Column("value_json", sa.JSON(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("key"),
    )


def downgrade() -> None:
    op.drop_table("system_settings")
    op.drop_index("ix_data_collection_runs_id", table_name="data_collection_runs")
    op.drop_table("data_collection_runs")
    op.drop_index("ix_route_recommendations_user_type_code", table_name="route_recommendations")
    op.drop_index("ix_route_recommendations_scenario", table_name="route_recommendations")
    op.drop_index("ix_route_recommendations_route_id", table_name="route_recommendations")
    op.drop_index("ix_route_recommendations_id", table_name="route_recommendations")
    op.drop_table("route_recommendations")
    op.drop_index("ix_user_type_weights_id", table_name="user_type_weights")
    op.drop_table("user_type_weights")
    op.drop_index("ix_climate_scenarios_id", table_name="climate_scenarios")
    op.drop_table("climate_scenarios")
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.drop_index("ix_shelters_geom", table_name="shelters")
    op.drop_index("ix_shelters_name", table_name="shelters")
    op.drop_index("ix_shelters_id", table_name="shelters")
    op.drop_table("shelters")
