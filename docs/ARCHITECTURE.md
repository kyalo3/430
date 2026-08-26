# Sustainashare Architecture

Modular monolith: React (Vite) frontend + FastAPI backend + MongoDB.

```
Browser → Nginx or Vite (/api proxy) → FastAPI (/api/v1 + legacy aliases) → MongoDB
```

## Backend modules

| Module | Responsibility |
|--------|----------------|
| `app/core/config` | Typed settings, fail-fast |
| `app/core/security` | Cookies, JWT, CSRF, passwords |
| `app/core/rbac` | Role gates, PII redaction |
| `app/core/lifecycle` | Donation/need state machines |
| `app/core/audit` | Immutable audit events |
| `app/services/donations` | Transitions, atomic claims, impact |
| `app/services/matching` | Explainable rules scoring |
| `app/routes/*` | HTTP adapters |

## Frontend

- `src/lib/api.js` — single client (`withCredentials`, CSRF, request IDs)
- `PrivateRoute` / `RoleRoute` — UX gates only; backend RBAC is authoritative
- Lazy-loaded dashboards; `ErrorBoundary`

## Deliberately not chosen

Microservices, opaque AI matching, public recipient profiles, payment rails.
