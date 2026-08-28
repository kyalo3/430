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
- [~] Incremental TypeScript (JS API client shipped; `src/types/platform.ts` domain models added)

## Phase 3 — Core interaction

- [x] Donation state machine + server validation
- [x] Need/request lifecycle
- [x] Rules-based matching + concurrency-safe claim
- [x] Impact on recipient confirmation
- [x] Admin audit reasons
- [x] Richer volunteer fulfilment UI evidence flows

## Phase 4 — Journeys

- [x] Landing: mission, privacy, role CTAs (honest empty impact)
- [x] Protected role dashboards
- [x] Local demo accounts for admin/donor/recipient/volunteer (`scripts.seed_dev_users`)
- [x] Donor/recipient/volunteer/admin dashboards rebuilt around the verified journey (no retail/KES goals)
- [x] Claim auto-matches so volunteers can accept handover
- [x] Progressive onboarding checklist polish
- [x] Notification adapters (in-app + no-op email/SMS)
- [x] Partner organisations + membership (verified public names only)
- [x] Explainable matching in recipient dashboard
- [x] Volunteer service area / capacity
- [x] Admin operational metrics (`/impact/operations`)
- [x] Feature flags for webhooks and object storage (off by default)
- [x] Email verification adapter (off unless `VERIFICATION_REQUIRED=true`)
- [x] Principal journey integration test (org → list → verify → match → claim → handover → confirm → impact)

## Phase 5 — Visibility & growth

- [x] Verified impact API + methodology notes
- [x] Official reference data sync (Kenya counties bundled, World Bank cache)
- [x] Category-aware matching suggest + claim reasons from rules engine
- [x] County place normaliser (privacy-safe; OSM still deferred)
- [x] Email verify endpoint when `VERIFICATION_REQUIRED=true`
- [x] Email verify SPA (`/verify-email`) + register/login gating when verification is on
- [x] Playwright e2e (landing/guidance/verify; optional API suite with `E2E_API=1`)
- [x] Community safety guidance (no public recipient profiles)
- [x] Cookie-only SPA session (access JWT not kept in memory or localStorage)
- [x] Kenya compliance checklist (non-claiming)
- [x] Choose/Use event taxonomy (session store; no third-party tracker)

## Quality

- [x] Backend unit + integration tests (lifecycle, admin block, double-claim, volunteer assignment)
- [x] Frontend vitest smoke
- [x] GitHub Actions CI workflow (frontend blocking; backend sibling repo + submodule best-effort)
- [x] Ops / security / API / architecture docs
- [x] README rewrite
- [x] Playwright specs (landing + optional API journey when `E2E_API=1`)
- [x] Shop browse copy reframed away from checkout

## Explicitly deferred / not appropriate

Microservices, blockchain, payments, opaque AI matching, public recipient profiles, gamified vulnerability, carbon accounting without methodology.

## 90-day ops roadmap (see docs/IMPROVEMENT_BACKLOG.md)

- [x] Time windows + load class + capacity gates
- [x] Email/SMS adapters (feature-flagged; SMTP owner-configured)
- [x] Partner logistics assign + organisation impact pack
- [x] Volunteer mobile fulfilment polish (sticky progress)
