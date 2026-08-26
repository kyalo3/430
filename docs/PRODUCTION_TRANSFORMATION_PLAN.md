# Production Transformation Plan

Living plan. Update as phases complete.

## Status legend

`[ ]` pending · `[~]` in progress · `[x]` done · `[!]` blocked

## Phase 0 — Reconnaissance

- [x] Inspect frontend/backend, submodule, routes, auth, env, deploy files
- [x] Baseline lint/build
- [x] docs/CURRENT_STATE_AUDIT.md
- [x] docs/THEORY_OF_CHANGE.md
- [x] docs/WINNING_THROUGH_PLATFORMS.md
- [x] This plan + architecture/security/privacy/ops docs

## Phase 1 — Production blockers

- [x] Expand gitignore; stop tracking secrets & dist (no history rewrite)
- [x] Credential rotation checklist
- [x] Typed backend settings + fail-fast config
- [x] Remove hard-coded admin; bootstrap CLI
- [x] Block public admin registration
- [x] Env-driven CORS allowlist
- [x] Cookie sessions + CSRF; short-lived access + refresh
- [x] Frontend route guards; single API client; Vite proxy
- [x] RBAC helpers; lock down sensitive routes
- [x] Indexes + audit events
- [x] Rate limiting on auth/register
- [!] External Atlas credential rotation by owner (old cluster DNS dead; local Mongo used for verification)

## Phase 2 — Architecture

- [x] Single FastAPI app + lifespan
- [x] `/api/v1` + compatibility aliases
- [x] Health live/ready
- [x] netlify.toml; Dockerfiles; docker-compose
- [x] engines / .nvmrc
- [x] Remove dead App.js / DonorDashboard_new / api.ts
- [~] Dependency upgrades (pinned compatible set)
- [~] Incremental TypeScript (JS API client shipped; domain TS deferred)

## Phase 3 — Core interaction

- [x] Donation state machine + server validation
- [x] Need/request lifecycle
- [x] Rules-based matching + concurrency-safe claim
- [x] Impact on recipient confirmation
- [x] Admin audit reasons
- [~] Richer volunteer fulfilment UI evidence flows

## Phase 4 — Journeys

- [x] Landing: mission, privacy, role CTAs (honest empty impact)
- [x] Protected role dashboards
- [~] Progressive onboarding checklist polish
- [~] Notification adapters (stubs)

## Phase 5 — Visibility & growth

- [x] Verified impact API + methodology notes
- [x] Privacy/consent foundations + export/delete
- [x] Kenya compliance checklist (non-claiming)
- [~] Full event taxonomy instrumentation across all pages

## Quality

- [x] Backend unit + integration tests (lifecycle, admin block, double-claim)
- [x] Frontend vitest smoke
- [x] GitHub Actions CI workflow
- [x] Ops / security / API / architecture docs
- [x] README rewrite
- [~] Playwright e2e (script placeholder; full suite deferred)

## Explicitly deferred / not appropriate

Microservices, blockchain, payments, opaque AI matching, public recipient profiles, gamified vulnerability, carbon accounting without methodology.
