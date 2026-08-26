# Credential rotation checklist (owner action required)

Do **not** paste live secrets into chat or commits.

## Exposed or at-risk credentials (as of audit)

| Secret | Where found | Action |
|--------|-------------|--------|
| MongoDB Atlas URI (user/password) | Previously tracked in `430/.env`, agent doc | Rotate Atlas database user password; update backend `.env` only; revoke old password |
| JWT `SECRET_KEY` | Local/dev defaults | Generate ≥32 char random; set in backend env; invalidate sessions |
| Hard-coded admin password `admin1` | Removed from code | If ever created in DB, disable/delete that user |
| Admin registration code `supersecret2025` | Removed from code | Treat as compromised; no longer valid |
| Render / Netlify tokens | If any in CI history | Rotate in provider consoles |
| GitHub PAT for kyalo3 | Local `gh` login | Rotate if repo was public with secrets |

## After rotation

1. Update `C:\Dev2\kyalo3\430_backend\.env` (never commit).
2. Redeploy backend with new `MONGO_DETAILS` and `SECRET_KEY`.
3. Confirm `/health/ready` succeeds.
4. Bootstrap a new admin via `python -m scripts.bootstrap_admin` if needed.
5. Ask all users to sign in again (refresh tokens invalidated when secret changes).
