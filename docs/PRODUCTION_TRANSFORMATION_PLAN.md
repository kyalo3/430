# Production Transformation Plan

Living plan. Update as phases complete.

## Status legend

`[ ]` pending · `[~]` in progress · `[x]` done · `[!]` blocked

## Phase 0 — Reconnaissance

- [x] Inspect frontend/backend, submodule, routes, auth, env, deploy files
- [x] Baseline lint/build (lint ✅, build ✅)
- [x] docs/CURRENT_STATE_AUDIT.md
- [x] docs/THEORY_OF_CHANGE.md
- [x] docs/WINNING_THROUGH_PLATFORMS.md
- [x] This plan

## Phase 1 — Production blockers

- [x] Expand gitignore; stop tracking secrets & dist (no history rewrite)
- [x] Credential rotation checklist
- [x] Typed backend settings + fail-fast config
- [x] Remove hard-coded admin; bootstrap CLI
- [x] Block public admin registration
- [x] Env-driven CORS allowlist; no wildcard+credentials
- [x] Cookie sessions + CSRF for cookie mode; short-lived access + refresh
- [x] Frontend route guards; single API client; Vite proxy
- [x] RBAC helpers; lock down sensitive routes
- [x] Indexes + audit events
- [x] Rate limiting on auth/register/contact
- [ ] External credential rotation by owner (blocked — requires Atlas/GitHub)

## Phase 2 — Architecture

- [x] Single FastAPI app + lifespan
- [x] `/api/v1` + compatibility aliases
- [x] Health live/ready
- [x] netlify.toml; Dockerfiles; docker-compose
- [x] engines / .nvmrc
- [x] Remove dead App.js / DonorDashboard_new
- [~] Dependency upgrades (compatible pins)
- [~] Incremental TypeScript for API/auth domain

## Phase 3 — Core interaction

- [x] Donation state machine + server validation
- [x] Need/request lifecycle
- [x] Rules-based matching + concurrency-safe claim
- [x] Volunteer fulfilment tasks
- [x] Impact on recipient confirmation
- [x] Admin audit reasons

## Phase 4 — Journeys

- [x] Landing: mission, privacy, role CTAs (honest empty impact)
- [x] Protected role dashboards with next-best action
- [~] Progressive onboarding checklist
- [~] Notification adapters (in-app stub + email/SMS interfaces)

## Phase 5 — Visibility & growth

- [x] Verified impact API + methodology notes
- [x] Privacy/consent foundations + export/delete stubs
- [x] Event taxonomy module
- [x] Kenya compliance checklist (non-claiming)

## Quality

- [x] Backend tests (auth, RBAC, lifecycle, concurrency)
- [x] Frontend unit tests + Playwright smoke
- [x] GitHub Actions CI
- [x] Ops / security / API / architecture docs
- [x] README rewrite

## Explicitly deferred / not appropriate

Microservices, blockchain, payments, opaque AI matching, public recipient profiles, gamified vulnerability, carbon accounting without methodology.
