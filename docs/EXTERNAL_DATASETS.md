# External datasets for Sustainashare

Selection from [awesome-public-datasets](https://github.com/awesomedata/awesome-public-datasets). Public data **never replaces** first-party donation, need, match, or impact records. It must not score recipients or invent meal/carbon conversions.

## How sync works

| Dataset | Sync method | Cadence |
|---------|-------------|---------|
| Kenya counties (GADM-aligned) | Bundled JSON in the API | Ship with the app; no live download |
| Open Food Facts language | Curated category list mapped to OFF groups | Ship with the app |
| County place normaliser | `POST /platform/reference/normalize-place` against bundled counties | On blur from county fields |
| World Bank `SN.ITK.DEFC.ZS` | HTTP fetch → Mongo `reference_snapshots` | On API startup (non-blocking), admin sync, or `python -m scripts.sync_reference_data`. Cache 7 days. |

OpenStreetMap, GeoNames, and HDX are **next** (adapters not live). Nominatim must respect usage policy before any geocoding.

## Required now

| Dataset | Model fields | SDG | Business |
|---------|--------------|-----|----------|
| GADM / Kenya counties | `approx_location`, `service_area` | 11, 17 | Coverage and north-star “per service area” |
| Open Food Facts (taxonomy only) | `category`, `food_item` | 2, 12 | Shared listing language with partners |
| County place normaliser | `approx_location`, `service_area` | 11 | Fewer failed matches from spelling |
| World Bank undernourishment | none (context only) | 2 | Partner reports beside **verified** fulfilments |

## APIs

- `GET /platform/reference/catalog`
- `GET /platform/reference/service-areas`
- `GET /platform/reference/food-categories`
- `GET /platform/reference/sdg-context`
- `POST /platform/reference/normalize-place` — map free text to a Kenya county (no exact geocoding)
- `POST /platform/reference/sync` (admin) — refresh World Bank snapshot
- `POST /verify-email` — when `VERIFICATION_REQUIRED=true` (dev code `424242`)
- SPA: `/verify-email` collects email + code; register redirects here when verification is required
