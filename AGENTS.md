# AGENTS.md

## Project overview

This repository contains **Sejong Safeway**, a React + TypeScript MVP for an AI-based climate-safe route and shelter recommendation service for Sejong citizens.

The product is not a shortest-path clone. It should demonstrate a public-service prototype that recommends safer routes by considering climate risk, outdoor exposure, shelter access, public facilities, green areas, bus/BRT access, CCTV, streetlights, and user type.

Primary demo flow:

1. Home / route search
2. User type selection
3. AI recommendation results
4. Map-based route view
5. Shelter detail
6. Feedback
7. Admin dashboard
8. Shelter gap analysis
9. Public-data status

## Tech stack

Use the following stack unless the task explicitly says otherwise:

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand for small client-side state
- Zod for form/runtime validation
- Axios or a thin fetch wrapper for API boundaries
- Kakao Map integration through `react-kakao-maps-sdk` when map work is requested
- Vitest + Testing Library for tests
- ESLint + Prettier for code quality

Prefer `npm` for commands and dependency installation.

## Setup commands

Use these commands after the project is initialized:

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

If the repository is empty, initialize it with:

```bash
npm create vite@latest . -- --template react-ts
```

Then install the baseline dependencies:

```bash
npm install react-router-dom @tanstack/react-query zustand zod axios lucide-react react-kakao-maps-sdk
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event prettier eslint
```

## Repository structure

Create and maintain this structure:

```text
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  pages/
    HomePage.tsx
    UserTypePage.tsx
    RecommendationPage.tsx
    MapPage.tsx
    ShelterDetailPage.tsx
    FeedbackPage.tsx
    AdminDashboardPage.tsx
    AdminShelterGapPage.tsx
    AdminDataStatusPage.tsx
  features/
    route-search/
    user-type/
    recommendation/
    map/
    shelter/
    feedback/
    admin/
  entities/
    route/
    shelter/
    place/
    user/
    climate/
  shared/
    api/
    ui/
    lib/
    constants/
  mocks/
    fixtures/
```

Keep feature-specific UI, API adapters, schemas, and types inside the relevant `features/*` folder. Put generic UI primitives in `shared/ui`.

## MVP scope

Prioritize the MVP screens in this order:

1. Route search page
2. User type selection page
3. Recommendation results page
4. Map page with route polyline and safety layers
5. Shelter detail page
6. Feedback page
7. Admin dashboard
8. Shelter gap analysis page
9. Public-data status page

Do not overbuild authentication, real-time congestion, precise shade analysis, voice guidance, or production backend integration in the first scaffold. Use mock data and stable UI flows first.

## Routing requirements

Use React Router and create these routes:

```text
/
/user-type
/recommendations
/map
/shelters/:shelterId
/feedback/:routeLogId
/admin
/admin/shelter-gaps
/admin/data-status
```

## Domain model requirements

Use explicit TypeScript types for these concepts:

- `UserType`: GENERAL, SENIOR, CHILD, PREGNANT, DISABLED, OUTDOOR_WORKER
- `TransportMode`: WALK, BUS_BRT, BIKE, MIXED
- `RoutePreference`: SAFE, COOL, SHORTEST, TRANSIT, NIGHT_SAFE
- `RecommendationType`: SAFEWAY, TRANSIT_ALTERNATIVE, NIGHT_SAFE, SHORTEST
- `LatLng`
- `RouteSearchParams`
- `ScoreBreakdown`
- `SafeRouteRecommendation`
- `Shelter`
- `Feedback`
- `AdminDashboardSummary`
- `DataCollectionStatus`

## Recommendation logic

Implement the first version as deterministic mock logic in the frontend. Keep the recommendation engine in a separate file so it can later be replaced by FastAPI.

Base scoring weights:

- Climate safety: 30%
- Outdoor exposure safety: 20%
- Shelter access: 20%
- Green / park access: 10%
- Transit access: 10%
- Night / low-visibility safety: 10%

User-type adjustments:

- SENIOR: increase shelter access, walking distance burden, and outdoor exposure importance.
- CHILD: increase safety facilities, major-road access, and transit access importance.
- PREGNANT: increase walking distance burden, shelter access, and outdoor exposure importance.
- DISABLED: increase accessibility, route burden, and transit access importance.
- OUTDOOR_WORKER: increase heat/cold risk, shelter access, and rest-point importance.

Safety score values should always be normalized to `0..100`, where higher means safer.

## UI and design rules

- Use Korean UI copy because the service is for Sejong citizens.
- Keep code, comments, file names, variables, and commit messages in English.
- Use a mobile-first responsive layout.
- Keep the web layout presentation-friendly: search conditions, map, recommendation panels, and admin cards should work well on a laptop screen.
- Use clear public-service language. Prefer phrases like “시원한 경로”, “쉬어갈 수 있는 곳”, and “기후위험 낮음”.
- Keep the service name consistent: “세종 세이프웨이”.
- Use accessible buttons, visible focus states, semantic HTML, and readable contrast.
- Do not hardcode secrets, API keys, or private tokens.

Suggested color tokens:

```text
mainBlue: #005BD8
safeTeal: #00A6A6
green: #18A058
warningOrange: #FF8A00
nightPurple: #6C5CE7
lightBlue: #F0F7FF
grayText: #6B7280
```

## Mock data requirements

Create realistic Sejong demo fixtures under `src/mocks/fixtures`:

- `places.ts`
- `shelters.ts`
- `routes.ts`
- `climate.ts`
- `mapLayers.ts`
- `admin.ts`
- `feedback.ts`

Use sample locations such as Sejong City Hall, Government Complex Sejong, Sejong Lake Park, Naseong-dong, Dodam-dong, and Geumgang Pedestrian Bridge.

The mock recommendation result must include at least:

- Safeway route
- Transit alternative route
- Night-safe route
- Optional shortest route comparison

Each route card must display:

- Total duration
- Outdoor exposure reduction
- Number of shelters near or on route
- Climate safety score
- Natural-language recommendation reason

## API boundary

Even while using mock data, design API-like functions so the frontend can later switch to FastAPI:

```text
GET  /api/climate/current
GET  /api/places/search?keyword=
GET  /api/shelters
GET  /api/shelters/:id
POST /api/recommendations
POST /api/feedback
GET  /api/admin/dashboard
GET  /api/admin/shelter-gaps
GET  /api/admin/data-status
```

Place mock API adapters in feature folders or `shared/api`, not directly inside page components.

## Testing and quality gates

For any meaningful code change:

1. Run TypeScript checks if configured.
2. Run lint.
3. Run tests.
4. Run production build.

At minimum, add tests for:

- Recommendation scoring normalization
- User-type weight adjustment
- Route search form validation
- Rendering of recommendation cards
- Feedback form validation

Do not claim checks passed unless you actually ran them. If a command fails, report the exact failure and the most likely fix.

## Git and PR expectations

Make small, coherent commits. Recommended commit prefixes:

- `chore:` setup, dependencies, config
- `feat:` user-visible feature
- `fix:` bug fix
- `refactor:` internal code improvement
- `test:` tests only
- `docs:` documentation only

Before finishing a task, summarize:

1. What changed
2. Files touched
3. Commands run
4. Any remaining risks or TODOs

## Do not do

- Do not add a production backend unless explicitly requested.
- Do not add real authentication or OAuth flows in the initial MVP; use placeholder screens or mock behavior.
- Do not block the first scaffold on real public-data API integration.
- Do not put business logic directly in React page components.
- Do not use `any` unless there is a clear reason and a TODO explaining how to replace it.
- Do not introduce heavy UI frameworks unless explicitly requested.
- Do not store API keys in the repository.
