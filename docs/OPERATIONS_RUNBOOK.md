# Operations runbook

## Health

- Live: process up
- Ready: Mongo ping succeeds

## Logs

Prefer structured logs with `X-Request-ID`. Never log passwords, tokens, or full Mongo URIs.

## Backups (MongoDB Atlas)

1. Enable continuous backup / snapshots in Atlas.
2. Test restore to a scratch cluster quarterly.
3. Document RPO/RTO with the owner.

## Incidents

1. Disable docs if needed (`ENABLE_DOCS=false`).
2. Rotate `SECRET_KEY` and Mongo credentials (`CREDENTIAL_ROTATION.md`).
3. Suspend abusive accounts with reason (audited).
