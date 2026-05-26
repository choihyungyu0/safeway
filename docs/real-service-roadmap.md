# Real-Service Roadmap

## 1. Current Prototype State

The frontend screens are implemented and use deterministic generated fixtures
from `SafeWay.zip`. A FastAPI scaffold now exposes mock `/api/*` endpoints, and
the frontend API adapters can fall back to fixtures when the backend is not
running.

No real public data API is called yet.

## 2. Target Production Architecture

- React/Vite frontend served through CDN or container
- FastAPI backend as the only trusted API boundary
- PostgreSQL + PostGIS for shelters, routes, climate risk zones, and feedback
- Redis for cache, job state, and rate limiting
- Scheduled ingestion workers for public data
- Admin dashboard consuming backend aggregation endpoints

## 3. Public Data Sources

Candidate production data sources:

- data.go.kr public facility and shelter datasets
- KMA weather and special warning data
- AirKorea air quality observations
- Sejong city public facility, CCTV, streetlight, bus/BRT stop data
- Local GIS boundaries, walkable roads, parks, and green space layers

All service keys must be stored on the backend only.

## 4. Backend Environment Variables

Backend-only:

- `DATA_GO_KR_SERVICE_KEY`
- `KMA_API_KEY`
- `AIRKOREA_API_KEY`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `CORS_ORIGINS`

Frontend:

- `VITE_API_BASE_URL`
- `VITE_KAKAO_MAP_APP_KEY`

Warning: public data service keys must not be stored in frontend `VITE_*`
variables. Vite variables are bundled into browser code.

## 5. Data Ingestion Schedule

- Weather and air quality: every 10 minutes
- Shelter/facility metadata: daily, with manual admin refresh
- CCTV, streetlight, and bus/BRT layers: daily or weekly depending on source
- Data quality metrics: after every ingestion run
- Route analytics: near-real-time append, daily aggregation

## 6. Recommendation Algorithm Flow

1. Receive route search request and user type.
2. Generate candidate paths from map or routing provider.
3. Enrich candidates with climate observations, risk zones, shelter buffers,
   green space, transit access, lighting, CCTV, and exposure length.
4. Apply base scoring weights and user-type weights.
5. Normalize final safety score to `0..100`.
6. Return ranked recommendations with explainable reasons and nearby shelters.

## 7. Map Integration Plan

- Keep Kakao Map API key in `VITE_KAKAO_MAP_APP_KEY`.
- Keep all public-data and routing secrets on the backend.
- Serve shelter and risk layer data from backend APIs.
- Render map tiles in frontend only after key configuration exists.
- Use PostGIS to simplify nearby shelter and risk-zone spatial queries.

## 8. Admin Operation Plan

- Admin pages should read dashboard summaries from backend aggregation endpoints.
- Data status should reflect ingestion runs and quality metrics.
- Reports should be generated from persisted route, climate, shelter, and
  feedback data.
- Settings changes should be audited and stored in `system_settings`.

## 9. Privacy And Security Checklist

- Do not expose public data API keys to the browser.
- Store passwords and admin auth through a real identity flow before production.
- Use HTTPS only in deployed environments.
- Apply CORS allowlists per environment.
- Minimize retained location history.
- Aggregate analytics before public reporting.
- Audit admin settings and data refresh actions.
- Redact free-text feedback in exports when needed.

## 10. Deployment Checklist

- Configure backend secrets in the deployment platform.
- Apply database migrations and PostGIS extensions.
- Seed generated SafeWay fixtures.
- Start scheduled ingestion workers.
- Configure frontend `VITE_API_BASE_URL`.
- Configure `VITE_KAKAO_MAP_APP_KEY` only for map rendering.
- Run typecheck, lint, tests, and production build.
- Verify `/api/health`, `/api/climate/current`, `/api/shelters`, and admin endpoints.
