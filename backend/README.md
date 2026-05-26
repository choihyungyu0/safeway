# Sejong Safeway Backend

FastAPI backend scaffold for the Sejong Safeway real-service architecture.

The backend is now PostgreSQL/PostGIS-ready. Endpoints try the database first
when `USE_DATABASE=true` and `DATABASE_URL` is configured. If the database is
disabled or unavailable, services fall back to the generated SafeWay fixture
JSON under `src/mocks/fixtures/generated`.

No real public-data APIs are called yet.

## Frontend Only

From the repository root:

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5174
```

The frontend keeps using fixture fallback when the backend is not running.

## Backend Only

From the repository root:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

Health check:

```bash
curl http://localhost:8000/api/health
```

## Full Stack With Docker Compose

From the repository root:

```bash
npm run docker:up
```

Services:

- frontend: http://localhost:5174
- backend: http://localhost:8000
- postgres: localhost:5432
- redis: localhost:6379

The backend image includes the generated fixture JSON for fallback responses.

## Database Mode

1. Start PostGIS.
2. Set backend-only environment variables:

```bash
DATABASE_URL=postgresql+psycopg://safeway:safeway@localhost:5432/safeway
USE_DATABASE=true
DB_ECHO=false
```

3. Run migrations from the repository root:

```bash
npm run backend:migrate
```

4. Seed from generated SafeWay fixtures:

```bash
npm run backend:seed
```

The seed command is idempotent and upserts by stable IDs/keys.

## Direct Backend Commands

From `backend/`:

```bash
python -m alembic -c alembic.ini upgrade head
python -m app.db.seed
python -m pytest
```

If `DATABASE_URL` is not set, migrations and seed fail clearly. API runtime
continues to use fixture fallback.

## Endpoint Groups

- `GET /api/health`
- `GET /api/climate/current`
- `GET /api/climate/scenarios`
- `GET /api/shelters`
- `GET /api/shelters/{shelter_id}`
- `GET /api/shelters/nearby?lat=&lng=&radius_m=500`
- `POST /api/routes/recommend`
- `POST /api/feedback`
- `GET /api/admin/*`
- `PUT /api/admin/settings`

## Secret Handling

Public-data service keys belong only in backend environment variables. Do not
place `DATA_GO_KR_SERVICE_KEY`, `KMA_API_KEY`, `AIRKOREA_API_KEY`,
`DATABASE_URL`, `REDIS_URL`, or `JWT_SECRET` in frontend `VITE_*` variables.

Vite exposes all `VITE_` variables to the browser bundle. Only public frontend
configuration, such as `VITE_API_BASE_URL` or a future browser map app key,
belongs there.
