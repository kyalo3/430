# Privacy and data governance

## Principles

- Purpose limitation and data minimisation
- No public recipient profiles or vulnerability gamification
- Exact handover details revealed only after authorised assignment
- Impact metrics from verified fulfilments only
- Consent records for optional publicity (stories/photos)

## Rights workflows

- `GET /platform/privacy-notice`
- `POST /platform/consent` with purposes: `impact_story`, `photograph`, `identity_publication`, `analytics`, `operational_updates`
- `GET /platform/me/export` — account, listings, needs, consents, notifications, organisation memberships
- `POST /platform/me/delete-request` with `{ "confirmation": "DELETE" }` — immediate anonymisation and session revocation
- `POST /users/{id}/anonymise?reason=` — administrator anonymisation with audit reason

Exact addresses and recipient identity stay off catalogue and public pages. Optional stories or photographs require explicit opt-in consent.

## Kenya-focused checklist (non-claiming)

Prepare for ODPC / Data Protection Act alignment with qualified counsel:

- [ ] Appoint data protection contact
- [ ] Document processing purposes and retention
- [ ] Lawful basis mapping
- [ ] Cross-border transfer assessment (e.g. Atlas region)
- [ ] Breach response playbook
- [ ] DPIA for matching/fulfilment processing

**This document does not constitute legal compliance.**
