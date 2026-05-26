# Sejong Safeway Backend

FastAPI scaffold for the Sejong Safeway real-service architecture.

The current backend intentionally returns deterministic mock data. It is ready
for frontend integration and future PostgreSQL/PostGIS repositories, but it does
not call real public data APIs and does not require API keys.

## Run Locally

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health check:

```bash
curl http://localhost:8000/api/health
```

## Endpoint Groups

- `GET /api/health`
- `GET /api/climate/current`
- `GET /api/climate/scenarios`
- `GET /api/shelters`
- `GET /api/shelters/{shelter_id}`
- `GET /api/shelters/nearby`
- `POST /api/routes/recommend`
- `POST /api/feedback`
- `GET /api/admin/*`
- `PUT /api/admin/settings`

## Production Notes

Public-data service keys belong only in backend environment variables. Do not
place `DATA_GO_KR_SERVICE_KEY`, `KMA_API_KEY`, or `AIRKOREA_API_KEY` in frontend
`VITE_*` variables.
