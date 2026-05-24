# Sejong Safeway

Sejong Safeway is a React + TypeScript MVP for an AI-based climate-safe route and
shelter recommendation service for Sejong citizens.

The prototype uses mock public data to demonstrate safer route recommendations
under heat, fine dust, fog, low visibility, and night-safety conditions. It is not
a production backend integration yet.

## Demo Flow

1. Home route search
2. User type selection
3. AI recommendation comparison
4. Map-based route view with safety layers
5. Shelter detail
6. Citizen feedback
7. Admin dashboard
8. Shelter gap analysis
9. Public-data status

## Stack

- React + TypeScript + Vite
- React Router
- TanStack Query
- Zustand
- Zod
- Axios boundary for future API integration
- lucide-react
- react-kakao-maps-sdk placeholder support
- Vitest + Testing Library
- ESLint + Prettier

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
npm run format
```

## Notes

- UI copy is Korean for Sejong citizens.
- Mock fixtures live in `src/mocks/fixtures`.
- API-like mock adapters live in `src/shared/api`.
- Recommendation scoring is deterministic and isolated in
  `src/features/recommendation/scoring.ts` so it can later be replaced by a
  FastAPI service.
- No secrets or API keys are required. If `VITE_KAKAO_MAP_APP_KEY` is absent, the
  map page shows a safe fallback visual.
