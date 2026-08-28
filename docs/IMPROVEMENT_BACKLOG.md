# Sustainashare — 90-day improvement backlog

Aligned with [FUNDER_ONE_PAGER.md](./FUNDER_ONE_PAGER.md) and the production transformation doctrine. Strengthen the verified redistribution journey — do not become a shop, surveillance product, or owned fleet.

## Weeks 1–3 — Logistics diligence · **implemented**

- [x] Structured pickup windows (`window_start` / `window_end` + free-text label)
- [x] Load class: `small | medium | bulk | cold | vehicle`
- [x] Logistics mode: `volunteer | partner | either` (bulk forces partner)
- [x] Volunteer capacity gates (weighted by `capacity_cost`; cold/vehicle task types)
- [x] Donor + volunteer + admin UI for the above

## Weeks 3–6 — Notifications · **implemented (adapter)**

- [x] Email adapter behind `FEATURE_EMAIL` + SMTP_* settings
- [x] SMS stub behind `FEATURE_SMS` (provider not wired — no fake delivery claims)
- [x] Channel status recorded on notification documents
- [ ] Owner: configure SMTP (or Africa’s Talking / Twilio) in staging

## Weeks 6–10 — Partner + CSR pack · **implemented (v1)**

- [x] `POST /fulfilments/{id}/assign-partner` for verified orgs
- [x] Admin UI: assign partner on matched listings
- [x] `GET /impact/organisation/{org_id}` verified impact pack + donor dashboard card
- [ ] Multi-seat invites / billing entitlements (deferred — payments still out of scope)

## Weeks 10–12 — Volunteer field UX · **implemented (v1)**

- [x] Larger touch targets, capacity/task-type hints
- [x] Mobile sticky progress bar for active handover
- [ ] Offline queue / WhatsApp bridge (later)

## Explicitly still deferred

Payments, opaque AI matching, public recipient profiles, own fleet, carbon/meal invention, native apps.
