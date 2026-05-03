# 0002. Capture Electronic Provider Payments After Provider Acceptance

## Status

Accepted

## Context

Provider-backed operations have two coupled money movements: the customer's payment to the merchant and the merchant's prepaid balance funding the provider side. Capturing an authorization-capable card, debit, or QR payment before provider acceptance would create avoidable refund-required cases when the provider rejects immediately after payment.

## Decision

For authorization-capable electronic customer payments on provider-backed operations, CTC Pay will authorize the customer payment before provider submission, reserve the merchant's Airtime Balance or Services Balance, and capture the customer payment only after provider success or Accepted Pending confirmation. QR follows this rule only when the underlying payment rail supports authorization and void; otherwise QR is treated as a captured or non-voidable rail. If the provider fails before capture, CTC Pay voids the authorization and releases the merchant balance reserve.

## Consequences

Refund-required handling is a fallback for captured payments, non-voidable payment rails, and cash operational failures, not the normal electronic provider-backed flow. Future backend work must model customer payment authorization, capture, void, refund, merchant balance reserve, reserve release, and final debit as separate auditable lifecycle events.
