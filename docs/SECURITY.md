# Security

## Controls implemented

- Env-driven CORS allowlist (no `*` with credentials)
- Trusted hosts + security headers
- Short-lived access JWT; HttpOnly refresh cookie; CSRF for cookie mutations
- Access token not stored in `localStorage`
- Public admin registration disabled; CLI bootstrap only
- RBAC on sensitive routes; recipient PII redaction
- Password strength policy; generic registration errors
- Rate limits on auth/register
- Audit log for lifecycle and admin actions
- Atomic donation claim (prevents double allocation)

## Reporting

Email security issues privately to repository owners. Do not open public issues with exploit details.

See also `CREDENTIAL_ROTATION.md`.
