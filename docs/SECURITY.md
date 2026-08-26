# Security

## Controls implemented

- Env-driven CORS allowlist (no `*` with credentials)
- Trusted hosts + security headers
- Short-lived access JWT; HttpOnly refresh cookie; CSRF for cookie mutations
- Access token not stored in `localStorage`
- Public admin registration disabled; CLI bootstrap only
- RBAC on sensitive routes; recipient PII redaction
- Password strength policy; generic registration and login errors; account lockout after repeated failures
- Rate limits on auth/register and resource writes
- Audit log for lifecycle and admin actions
- Atomic donation claim (prevents double allocation)
- Surplus catalogue hides handling notes, recipient ids, and volunteer ids from non-parties
- Self-service and admin anonymisation; access tokens are not stored in localStorage or SPA memory

## Reporting

Email security issues privately to repository owners. Do not open public issues with exploit details.

See also `CREDENTIAL_ROTATION.md`.
