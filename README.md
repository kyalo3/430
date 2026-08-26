# Sustainashare

Trusted resource-redistribution and impact-visibility platform connecting **donors**, **recipients**, **volunteers**, and **administrators** so surplus can be verified, matched, delivered, and accounted for.

See [`docs/THEORY_OF_CHANGE.md`](docs/THEORY_OF_CHANGE.md) and [`docs/WINNING_THROUGH_PLATFORMS.md`](docs/WINNING_THROUGH_PLATFORMS.md).

## Requirements

- **Node.js** `>=20.19` or `>=22.12` (Vite 7) — see `.nvmrc`
- **Python** 3.12+
- **MongoDB** (Atlas or local)

## Repositories

| Path | Repo |
|------|------|
| This frontend | https://github.com/kyalo3/430 |
| Backend (submodule + sibling) | https://github.com/kyalo3/430_backend |

Recommended local layout:

```
C:\Dev2\kyalo3\430
C:\Dev2\kyalo3\430_backend
```

## Quick start (two terminals)

### 1. Backend

```bash
cd C:\Dev2\kyalo3\430_backend
python -m venv venv
.\venv\Scripts\pip install -r requirements.txt
copy .env.example .env   # set MONGO_DETAILS and SECRET_KEY
.\venv\Scripts\uvicorn.exe app.main:app --reload --host 127.0.0.1 --port 8000
```

Bootstrap an admin (never self-register as admin):

```bash
.\venv\Scripts\python.exe -m scripts.bootstrap_admin --username admin --email you@example.com --password 'YourStr0ngPass!'
```

### 2. Frontend

```bash
cd C:\Dev2\kyalo3\430
copy .env.example .env.local   # VITE_API_URL=/api
npm ci
npm run dev
```

Open http://localhost:5173 — Vite proxies `/api` → backend.

## Tests

```bash
# Frontend
npm run lint
npm run build
npx vitest run

# Backend
cd ..\430_backend
.\venv\Scripts\pytest.exe -q
```

## Docker

From `C:\Dev2\kyalo3`: `docker compose up --build`

## Documentation

| Doc | Purpose |
|-----|---------|
| `docs/CURRENT_STATE_AUDIT.md` | Baseline risks |
| `docs/PRODUCTION_TRANSFORMATION_PLAN.md` | Living plan |
| `docs/ARCHITECTURE.md` | System shape |
| `docs/API.md` | Endpoints |
| `docs/SECURITY.md` | Controls |
| `docs/PRIVACY_AND_DATA_GOVERNANCE.md` | Data rights |
| `docs/DEPLOYMENT.md` | Ship / bootstrap |
| `docs/OPERATIONS_RUNBOOK.md` | Ops |
| `docs/IMPACT_MEASUREMENT.md` | Honest metrics |
| `docs/ROLLBACK_PLAN.md` | Rollback |
| `docs/CREDENTIAL_ROTATION.md` | **Owner must rotate exposed secrets** |

## Security notes

- Do not commit `.env` files.
- Dashboards are route-guarded in the UI; **backend RBAC is the security boundary**.
- Impact counters are verified fulfilments only — never invented.

## License

MIT
