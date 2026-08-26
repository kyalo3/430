# Current State Audit — Sustainashare (25–26 Aug 2026)

**Repos:** `kyalo3/430` (frontend), `kyalo3/430_backend` (submodule + sibling clone)  
**Baseline (this run):** `npm run lint` ✅ exit 0 · `npm run build` ✅ exit 0 · Node v22.22.0 · Vite 7.2.4 · React 18.2 · FastAPI 0.101.0 (pre-upgrade)

## Priority legend

- **P0** — Production blocker / active security exposure  
- **P1** — Required for coherent production architecture  
- **P2** — Core journey quality  
- **P3** — Growth, polish, ecosystem  

## Verified findings

| ID | Finding | Priority | Evidence | Disposition |
|----|---------|----------|----------|-------------|
| F01 | `.env` / `.env.local` tracked; Mongo URI with credentials in frontend repo | P0 | `git ls-files .env` | Untrack; rotate credentials; expand gitignore |
| F02 | `dist/` committed (96+ files) | P1 | `git ls-files dist` | Untrack; ignore |
| F03 | Vite 7 requires Node ≥20.19; README says Node 16+ | P1 | package.json / README | engines + `.nvmrc` + README |
| F04 | `netifly.toml` typo; not `netlify.toml` | P1 | root file | Add correct Netlify config |
| F05 | Backend git submodule `sustainashare_backend` | P1 | `.gitmodules` | Keep; document dual-repo workflow |
| F06 | JWT in `localStorage` | P0 | AuthContext | HttpOnly cookies via same-origin proxy |
| F07 | Dashboards unprotected in live `App.jsx` | P0 | App.jsx routes | Wire PrivateRoute + RoleRoute |
| F08 | Inconsistent API base URLs / hard-coded localhost | P0 | Reports, Admin, DonorForm | Closed: DonorForm uses the shared API client; no localStorage token |
| F09 | CORS `allow_origins=["*"]` + `allow_credentials=True` | P0 | main.py | Env allowlist |
| F10 | Hard-coded default admin `admin`/`admin1` (orphaned by duplicate app) | P0 | main.py | Remove; CLI bootstrap |
| F11 | Duplicate `app = FastAPI()` — second overwrites first | P0 | main.py | Single app + lifespan |
| F12 | Duplicate `APIRouter()` drops admin donation / reviews list routes | P1 | donations.py, reviews.py | Fix routers |
| F13 | Public registration can request `admin` with hard-coded code | P0 | user.py | Block public admin; bootstrap only |
| F14 | Recipient/volunteer mutate & PII GETs often unauthenticated | P0 | recipient.py, volunteer.py | RBAC + redaction |
| F15 | No donation lifecycle / status machine | P1 | donation model | Explicit state machine |
| F16 | No indexes / unique constraints | P1 | database.py | Create on startup |
| F17 | No tests / CI | P1 | repo | Add pytest, Vitest, Playwright, GHA |
| F18 | Dead files: App.js, DonorDashboard_new.jsx, unused api.ts | P2 | src/ | Remove / replace |
| F19 | Shop UX resembles retail; risk vs theory of change | P2 | /shop routes | Reframe as surplus browse; no checkout |
| F20 | “Real-time” not present (no websockets/SSE) | P3 | codebase | Honest copy only |
| F21 | Agent doc embeds Mongo URI | P0 | `.github/agents/...` | Sanitize |
| F22 | Old FastAPI / Pydantic v1 stack | P1 | requirements.txt | Upgrade carefully |
| F23 | No health endpoints | P1 | — | `/health/live`, `/health/ready` |
| F24 | Landing JSX typo `popupType={popupType}zzzz` | P2 | Landing.jsx | Fix |

## Collections (Mongo `food_donation`)

users, donors, recipients, volunteers, donations, reviews, donation_requests, contacts (+ new: matches, fulfilments, audit_events, impact_records, consents, notifications)

## Auth flow (pre-fix)

Register → POST `/token` → JWT in localStorage → Bearer header. Frontend role from localStorage (spoofable). Backend RBAC incomplete.

## Deployment assumptions

Frontend: Netlify (misconfigured). Backend: Render URL referenced (`four30-backend.onrender.com`). Submodule for backend source.

## Real-time claim

**False.** No live push channel. Use polling or future event-driven notifications without marketing “real-time” unless implemented.
