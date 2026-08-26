# Impact measurement

## North-star

Verified successful fulfilments per active service area per week.

## Counted

`impact_records` created when a donation reaches `recipient_confirmed` (idempotent).

## Not counted

Drafts, cancelled, expired, disputed (until resolved), or unverified estimates.

## Forbidden without methodology

Meal equivalents, monetary value, carbon/waste tonnes.

## APIs

- Public aggregate: `GET /impact/summary`
- Donor: `GET /impact/mine`
- Admin: `GET /impact/admin`
