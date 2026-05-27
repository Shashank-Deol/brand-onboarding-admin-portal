# Elysia Onboarding — Frontend

React admin portal for brand onboarding config (CRUD). Maps to Part 1 / Part 2 of the Informa brand onboarding documentation.

The FastAPI backend in `../backend` stores brands, onboarding config sections, and metadata field mappings in PostgreSQL.

## Prerequisites

- Node.js 20+
- Backend running at `http://127.0.0.1:8000` (see `../backend`)

## Setup

```bash
cp .env.example .env
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). API calls to `/health` and `/api/*` are proxied to the FastAPI server (see `vite.config.ts`).

## Scripts

| Command                 | Description                               |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Start dev server                          |
| `npm run build`         | Production build                          |
| `npm run preview`       | Preview production build                  |
| `npm run lint`          | Run ESLint                                |
| `npm run test:e2e`      | Run Playwright smoke tests (headless)     |
| `npm run test:e2e:headed` | Run Playwright with visible browser     |
| `npm run test:e2e:ui`   | Open Playwright interactive UI runner     |

## Testing

From `frontend/`:

```bash
npx playwright install
npm run test:e2e
```

Optional:

```bash
npm run test:e2e:headed
npm run test:e2e:ui
```

Smoke test file: `test/admin-portal.spec.ts`

## Project structure

```
src/
  api/          # HTTP client + brands API
  pages/        # Brands list, brand edit (tabbed config)
  components/   # Admin layout, metadata fields panel, form fields
  types/        # TypeScript types aligned with backend schemas
```

## Admin portal

- **Brands list** — create, open, delete brands
- **Brand edit** — identity, branding/embed, model, chat history, data source, upselling, integration placeholders
- **Metadata fields** — CRUD mappings (brand field → camelCase attribute key)

Auth, Cognito, S3, and knowledge-base integrations are **not wired**—values are stored as onboarding config only.

## Documentation

| Location | Contents |
|----------|----------|
| [docs/](./docs/README.md) | Product docs (admin guide, fields reference) |
| In-app | **Documentation** link (sidebar bottom) renders markdown + Mermaid diagrams |
| [../backend/docs/](../backend/docs/README.md) | API, data model, JSONB config reference |

## Environment variables

| Variable               | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `VITE_API_BASE_URL`    | API origin for production builds (optional)      |
| `VITE_API_PROXY_TARGET`| FastAPI URL for Vite dev proxy (default `:8000`) |
