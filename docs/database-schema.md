# Database Schema Draft

This draft targets PostgreSQL with PostGIS. The current application still uses
deterministic fixtures and does not require a database at runtime.

## Implemented Migration

The first Alembic migration lives at:

`backend/alembic/versions/202605260001_initial_database.py`

It creates the database-backed MVP tables that are currently wired to FastAPI:

- `shelters`
- `climate_scenarios`
- `user_type_weights`
- `route_recommendations`
- `data_collection_runs`
- `system_settings`

The migration enables PostGIS only when the active Alembic dialect is
PostgreSQL. Fixture fallback remains the runtime default when `DATABASE_URL` is
unset or the database is unavailable.

Run from the repository root:

```bash
npm run backend:migrate
npm run backend:seed
```

## Extensions

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## Core Tables

### users

- `id uuid primary key default gen_random_uuid()`
- `email text unique`
- `display_name text`
- `user_type text`
- `created_at timestamptz`
- `updated_at timestamptz`

### admin_users

- `id uuid primary key default gen_random_uuid()`
- `email text unique not null`
- `name text not null`
- `role text not null`
- `department text`
- `last_login_at timestamptz`
- `created_at timestamptz`

### shelters

- `id text primary key`
- `name text not null`
- `road_address text`
- `lot_address text`
- `type text`
- `capacity integer`
- `operation_time text`
- `night_open boolean`
- `holiday_open boolean`
- `stay_available boolean`
- `managing_agency text`
- `phone text`
- `recommendation_score numeric`
- `grade text`
- `source_updated_at date`
- `geom geometry(Point, 4326)`

PostGIS note: `shelters.geom` should be indexed with `GIST` for nearby shelter
queries.

### climate_observations

- `id uuid primary key default gen_random_uuid()`
- `observed_at timestamptz not null`
- `temperature numeric`
- `humidity numeric`
- `ozone numeric`
- `visibility_km numeric`
- `source text`
- `created_at timestamptz`

### air_quality_observations

- `id uuid primary key default gen_random_uuid()`
- `observed_at timestamptz not null`
- `pm10 numeric`
- `pm25 numeric`
- `station_name text`
- `source text`
- `created_at timestamptz`

### climate_scenarios

- `id uuid primary key default gen_random_uuid()`
- `name text not null`
- `temperature numeric`
- `humidity numeric`
- `pm10 numeric`
- `pm25 numeric`
- `ozone numeric`
- `visibility_km numeric`
- `created_at timestamptz`

### route_requests

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid references users(id)`
- `start_label text`
- `destination_label text`
- `transport_mode text`
- `preference text`
- `user_type text`
- `requested_at timestamptz`

### route_candidates

- `id uuid primary key default gen_random_uuid()`
- `route_request_id uuid references route_requests(id)`
- `route_name text`
- `distance_km numeric`
- `duration_minutes integer`
- `path_geom geometry(LineString, 4326)`
- `created_at timestamptz`

PostGIS note: `route_candidates.path_geom` stores candidate route lines and can
be intersected with shelter buffers and climate risk zones.

### route_recommendations

- `id uuid primary key default gen_random_uuid()`
- `route_request_id uuid references route_requests(id)`
- `route_candidate_id uuid references route_candidates(id)`
- `recommendation_type text`
- `climate_safety_score numeric`
- `shelter_access_score numeric`
- `night_safety_score numeric`
- `exposure_score numeric`
- `final_safety_score numeric`
- `reason text`
- `created_at timestamptz`

### route_feedback

- `id uuid primary key default gen_random_uuid()`
- `route_recommendation_id uuid references route_recommendations(id)`
- `rating integer`
- `actual_travel_minutes integer`
- `perceived_risk text`
- `shelter_used boolean`
- `comment text`
- `created_at timestamptz`

### admin_alerts

- `id uuid primary key default gen_random_uuid()`
- `title text not null`
- `description text`
- `level text`
- `status text`
- `created_at timestamptz`
- `resolved_at timestamptz`

### data_collection_runs

- `id uuid primary key default gen_random_uuid()`
- `dataset_name text not null`
- `provider text`
- `status text`
- `started_at timestamptz`
- `finished_at timestamptz`
- `row_count integer`
- `error_message text`

### data_quality_metrics

- `id uuid primary key default gen_random_uuid()`
- `dataset_name text not null`
- `metric_name text not null`
- `metric_value numeric`
- `measured_at timestamptz`

### system_settings

- `key text primary key`
- `value jsonb not null`
- `updated_by uuid references admin_users(id)`
- `updated_at timestamptz`

## Spatial Support Tables

### climate_risk_zones

- `id uuid primary key default gen_random_uuid()`
- `scenario_id uuid references climate_scenarios(id)`
- `risk_type text`
- `risk_level text`
- `score numeric`
- `geom geometry(Polygon, 4326)`

PostGIS note: `climate_risk_zones.geom` should be indexed with `GIST` and used
to score candidate routes by intersection length or area.

## Seed Strategy

Initial local seed should load generated SafeWay fixtures:

- `safewayShelters.json` -> `shelters`
- `safewayClimateScenarios.json` -> `climate_scenarios`
- `safewayUserTypeWeights.json` -> `user_type_weights`
- `safewayRouteRecommendations.json` -> `route_recommendations`
- `safewayScenarioSummary.json` -> `system_settings.scenario_summary`
- `safewayAnalysisSummary.json` -> `system_settings.analysis_summary`
- `safewayImportMetadata.json` -> `data_collection_runs`

Future production migrations can expand the route tables into normalized
`route_requests`, `route_candidates`, and `route_recommendations` records once
a real routing provider is connected.
