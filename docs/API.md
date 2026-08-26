# API Overview

Base (versioned): `/api/v1`  
Compatibility aliases remain at root (e.g. `/token`, `/donations/`) for the current SPA.

## Auth

| Method | Path | Notes |
|--------|------|-------|
| POST | `/register` or `/api/v1/auth/register` | Roles: donor, recipient, volunteer only |
| POST | `/token` | Sets HttpOnly cookies + returns access/csrf |
| POST | `/refresh` | Rotates refresh token |
| POST | `/logout` | Revokes refresh, clears cookies |
| GET | `/users/me` | Current user |

## Donations lifecycle

`POST /donations/` → `POST /donations/{id}/transition` → `POST /donations/{id}/claim`

Statuses enforced server-side (see `THEORY_OF_CHANGE.md`).

## Matching / Impact / Health

- `POST /matching/suggest` — rules engine with human-readable reasons
- `GET /impact/summary` — verified fulfilments only
- `GET /health/live` · `GET /health/ready`

Interactive docs: `/docs` (disable with `ENABLE_DOCS=false` in production).
