# Sustainashare — Theory of Change

## Statement

Communities simultaneously experience usable-resource surplus, unmet needs, avoidable waste, and fragmented coordination. Sustainashare connects **donors**, **recipients**, **volunteers**, **administrators**, and appropriate **institutional partners** so resources can be verified, matched, transported, received, and transparently accounted for. This reduces waste, improves food and resource security, strengthens community participation, and makes giving more trustworthy and measurable.

## Causal chain

| Level | Sustainashare logic |
|-------|---------------------|
| **Problem** | Surplus resources coexist with unmet needs; coordination, logistics, and trust gaps block redistribution. |
| **Inputs** | Donations, recipient needs, volunteers, partner organisations, platform technology, administrative oversight. |
| **Activities** | Participant verification, donation listing, needs capture, matching, reservation, collection, delivery, confirmation, feedback, impact measurement. |
| **Outputs** | Verified donations, successful matches, completed deliveries, volunteer assignments, traceable handovers. |
| **Outcomes** | Less avoidable waste, faster access to needed resources, increased trust, repeat participation, stronger community coordination. |
| **Long-term impact** | More resilient communities, improved food and resource security, transparent giving, sustainable resource sharing. |

## Core platform interaction (preserved)

Verified donor lists a suitable resource → Sustainashare connects it to a legitimate need → authorised recipient or administrator accepts the match → volunteer or approved logistics participant completes handover → recipient confirms receipt → platform produces verifiable impact evidence.

## What we deliberately are not

- A conventional online shop (browse/shop surfaces may showcase surplus categories but must serve redistribution, not retail checkout).
- A speculative AI product.
- A recipient-surveillance system.
- A social network that exposes vulnerable users.
- A fundraising or payment platform (unless requirements later justify it).
- A feature stack that does not strengthen the donation journey.

## Feature → outcome traceability matrix

| Feature / capability | Mechanism supported | Outcome / impact link | Status |
|----------------------|---------------------|------------------------|--------|
| Role-based registration (donor / recipient / volunteer) | Inputs: participants | Trustworthy participation | Implemented (admin self-reg blocked) |
| Participant verification & admin moderation | Activities: verification | Trust, safer matching | In progress |
| Donation listing with lifecycle states | Activities: listing → fulfilment | Verified donations, less waste | Implemented (server-side state machine) |
| Need / donation-request capture | Activities: needs capture | Faster access to resources | Implemented (hardened) |
| Rules-based matching with explainability | Activities: matching | Successful matches | Implemented (v1 rules) |
| Volunteer assignment & handover evidence | Activities: delivery | Traceable handovers | Implemented (v1) |
| Recipient confirmation | Activities: confirmation | Verifiable completion | Implemented |
| Impact records from completed journeys only | Outputs → outcomes | Measurable, honest impact | Implemented |
| HttpOnly session cookies + RBAC | Trust / safety | Trustworthy platform | Implemented |
| Privacy: redact recipient PII in public APIs | Dignity / non-surveillance | Trust, safer participation | Implemented |
| Audit events for admin & lifecycle changes | Accountability | Transparent giving | Implemented |
| Health checks, CI, ops docs | Platform reliability | Sustained coordination | Implemented |
| Public recipient profiles / leaderboards | — | **Not appropriate** | Explicitly rejected |
| Opaque AI matching | — | Deferred until governance exists | Later |
| Payment / fundraising rails | — | Not in scope | Not currently appropriate |

## North-star metric

**Verified successful fulfilments per active service area per week.**

Only completed, recipient-confirmed (or admin-verified) journeys count. No invented counters, meal conversions, or carbon claims without documented methodology.
