# Rollback plan

1. **Frontend:** Redeploy previous Netlify/git commit; do not rely on committed `dist`.
2. **Backend:** Redeploy previous container image / platform release.
3. **Database:** Prefer forward-fix changes; restore Atlas snapshot only for corruption.
4. **Submodule:** Pin frontend submodule SHA to last known-good backend commit.
5. **Secrets:** If a bad deploy leaked config, rotate per `CREDENTIAL_ROTATION.md` before rollback completes.
