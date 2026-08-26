# Deployment

## Frontend (Netlify)

- Config: `netlify.toml` (Node 22, SPA redirects, security headers)
- Env: `VITE_API_URL=/api` when using same-origin reverse proxy

## Backend

- Container: `430_backend/Dockerfile` (uvicorn workers, **no** `--reload`)
- Required env: see `430_backend/.env.example`
- Health: `/health/live`, `/health/ready`

## Docker Compose

From `C:\Dev2\kyalo3`:

```bash
docker compose up --build
```

## Admin bootstrap

```bash
cd 430_backend
.\venv\Scripts\python.exe -m scripts.bootstrap_admin --username ... --email ... --password ...
```

## Production cookies

`COOKIE_SECURE=true`, `APP_ENV=production`, strong `SECRET_KEY`, explicit `CORS_ORIGINS` and `TRUSTED_HOSTS`.
