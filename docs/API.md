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
| GET | `/donors/` · `/recipients/` · `/volunteers/` | Current role profile (created if missing) |

## Donations lifecycle

`POST /donations/` → `POST /donations/{id}/transition` → `POST /donations/{id}/claim`

Statuses enforced server-side (see `THEORY_OF_CHANGE.md`).

## Matching / Impact / Health

- `POST /matching/suggest` — rules engine with human-readable reasons
- `GET /fulfilments/eligible` · `POST /fulfilments/{id}/accept` · `POST /fulfilments/{id}/progress` — volunteer handovers; exact details after accept
- `GET /notifications/me` — in-app lifecycle notices (email/SMS adapter is no-op unless enabled)
- `GET /organisations/` — verified partner names only
- `POST /organisations/` · `GET /organisations/mine` · `POST /organisations/{id}/verify`
- `PUT /volunteers/me/logistics` — service area, capacity, task types
- `GET /impact/operations` — admin operational times and rates (verified methodology)
- `POST /storage/intent` — 501 until `FEATURE_OBJECT_STORAGE=true` (never stores files in Mongo)
- `GET /integrations/webhooks` — 404 until `FEATURE_WEBHOOKS=true`

## Privacy and administration

- `GET /platform/privacy-notice` — public purposes and non-goals
- `POST /platform/consent` — opt-in for stories/photographs only
- `GET /platform/me/export` — JSON copy of the caller’s operational data
- `POST /platform/me/delete-request` — body `{ "confirmation": "DELETE" }`; anonymises immediately
- `POST /users/{id}/anonymise?reason=` · `/suspend` · `/restore` — admin, reason required
- `GET /donations/` for non-parties returns a catalogue view (no handling notes, recipient, or volunteer ids)
- Failed logins lock an account after 5 attempts (15 minutes); response is `429` without a distinct “account exists” message beyond lockout

Interactive docs: `/docs` (disable with `ENABLE_DOCS=false` in production).
