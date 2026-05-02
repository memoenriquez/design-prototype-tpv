# 0001. Separate Airtime and Services Balances

## Status

Accepted

## Context

CTC Pay supports two different operation families:

- Customer-paid provider operations, where the customer pays the merchant at the counter and CTC Pay fulfills the provider side using the merchant's prepaid balance.
- Merchant Collection operations, where CTC Pay works as a general payment terminal for the merchant's own sale.

TAE and services have different accounting rules. TAE gives the merchant margin upfront as bonus Airtime Balance when the merchant buys balance. Services create merchant earnings as Merchant Spread: the customer pays a total that is higher than the amount debited from Services Balance.

A single shared operating balance would be simpler to display, but it could let bonus airtime value fund service operations unless additional restrictions are added.

## Decision

CTC Pay will use separate ledger-backed prepaid balances for MVP:

- Airtime Balance funds TAE operations and includes upfront TAE bonus margin.
- Services Balance funds provider-backed operations other than TAE, including service bills, telepeaje, and gift cards.
- Merchant Collection does not use either prepaid balance.

These balances are money-like stored value and must be implemented as immutable ledger-derived balances, not mutable fields. The ledger must support posted, reserved or pending, and available balance views. Corrections use reversal or adjustment entries instead of editing posted movements.

The dashboard and history must keep balances, collections, and merchant spread visually distinct.

## Alternatives Considered

### Single Operating Balance

Rejected for MVP. It simplifies the UI but mixes TAE bonus value with service funding and creates accounting ambiguity.

### Separate Balance Per Provider

Rejected for MVP. It gives maximum accounting precision but adds operational complexity before the product needs it.

### Mutable Balance Columns

Rejected. Mutable balance fields are easier to prototype but are unsafe for money-like stored value because they weaken auditability, reversal behavior, and reconciliation.

## Consequences

Merchants will see more than one financial bucket, so the UI must explain each bucket clearly.

Backend accounting can enforce the correct funding source per operation without special cases that prevent TAE bonus value from leaking into services.

Every balance-affecting action needs idempotency and an audit trail, including top-ups, reserves, releases, final debits, and reversals.

Future business rules may allow manual transfers or a shared balance, but that would be a separate decision.
