# Project Context

## Glossary

### CTC Pay

CTC Pay is a merchant-facing POS companion for small Mexican businesses. It lets a merchant sell or accept multiple operations from one mobile-first interface: airtime, service payments, card or QR charges, telepeaje, gift cards, and vales.

### Merchant

The business user operating CTC Pay to sell services, accept payments, and review operational activity.

### Operation

A merchant-initiated action in CTC Pay, such as selling airtime, charging a customer, paying a service bill, recharging telepeaje, selling a gift card, or accepting vales.

### Transaction

The persisted financial or provider record created after customer payment succeeds and balance is reserved. Pre-validation attempts are audit events, not Transactions, because no customer payment or balance movement has occurred yet.

Transactions represent completed amount-affecting operations in the normal merchant history UI. If a payment is not completed, customer-facing amounts are not modified and the attempt should not appear as a regular Movement.

Provider Pre-Validation exists to prevent normal pending or refund-required merchant scenarios. Rejected, expired, failed, or cancelled attempts before completion are audit events, not regular Transactions or Movements.

If an exceptional provider failure happens after customer payment despite pre-validation, it should be handled through support or audit tooling instead of being modeled as a normal history state in the MVP UI.

Provider operations must reach a provider pre-validation checkpoint before customer payment is accepted. If pre-validation is not confirmed, the customer payment must not proceed. Pre-validation expires after 2 minutes for MVP; after expiry, the merchant must re-run validation before accepting payment. Failures are audited and retried from the previous stable state, not from an uncertain partial state.

### Provider Pre-Validation

The provider confirmation that a referenced bill or product is currently payable before the merchant accepts customer payment.
_Avoid_: Lookup, search, reference found.

### Movement

User-facing copy for items shown in history. Movement is not a separate domain object from Transaction. The history should use one unified feed by default, with filters and clear labels for operation family, product, customer payment method, balance impact, merchant earning, and status. Top-Up requests appear in the feed with requested, approved/credited, or rejected/cancelled status. Pre-validation audit events are not shown as regular movements unless needed for audit review.

### Dashboard Balances

The home dashboard must not collapse operational balances, collections, and spread into one generic balance. It should distinguish Airtime Balance, Services Balance, today's electronic Merchant Collection volume, and today's estimated Merchant Spread.

### Ledger-Backed Balance

A money-like stored value balance whose source of truth is immutable ledger entries, not a mutable balance field. Balance displays are derived from ledger movements. Ledger-backed balances track at least posted, reserved or pending, and available views. Posted movements are not edited; corrections use reversal or adjustment entries. Balance-affecting operations must be atomic, auditable, and idempotent.

Each merchant has separate posted and reserved ledger accounts for each prepaid balance type. At minimum, the ledger distinguishes merchant Airtime posted, merchant Airtime reserved, merchant Services posted, and merchant Services reserved. Available balance is derived as posted minus reserved.

Successful provider-backed operations move value from the merchant's reserved balance into provider clearing and CTC Pay platform revenue accounts. Provider clearing tracks amounts owed to or settled with provider partners and supports later reconciliation against provider invoices or settlement reports. Platform revenue tracks CTC Pay's own earnings separately from provider payable amounts.

### Airtime Balance

Ledger-backed prepaid balance the merchant must have available to sell tiempo aire. Airtime operations require customer payment received and consume Airtime Balance when fulfilled. TAE commission is credited upfront as bonus Airtime Balance when the merchant buys balance. For example, if the merchant pays 100 MXN and receives 105 MXN of Airtime Balance, the extra 5 MXN is the merchant's embedded margin.

Available Airtime Balance must cover the recharge amount before customer payment is accepted. If Airtime Balance is insufficient, CTC Pay blocks the operation and prompts the merchant to request a top-up.

TAE uses lightweight product availability validation before customer payment: the carrier must exist, the amount or package must be valid for that carrier, and Airtime Balance must be sufficient. TAE does not use the same 2-minute provider bill pre-validation flow unless a provider requires it.

If a TAE provider recharge fails after customer payment was received, the transaction enters a refund-required state. Any Airtime Balance reserve or debit is released or reversed, the merchant refunds the customer or retries, and the failed attempt remains auditable.

### Customer-Paid Operation

A provider-backed operation where the customer pays the merchant at the counter, but CTC Pay fulfills the provider side by reserving or debiting the merchant's prepaid Airtime Balance or Services Balance. Provider pre-validation must confirm the bill or product is payable before customer payment is accepted. For cash payments, the merchant must explicitly mark customer payment received before CTC Pay reserves balance and sends or confirms provider fulfillment. For card or debit payments, the card processor must confirm payment succeeded before CTC Pay reserves balance and submits provider fulfillment.

### Merchant Collection

A general payment-terminal operation where CTC Pay collects a customer card, debit, QR, or voucher payment for the merchant's own sale. Merchant Collection is separate from provider-backed operations: it does not use Airtime Balance or Services Balance, does not require provider pre-validation, and settles according to the merchant's payment-processing arrangement. For MVP, Merchant Collection does not model cash sales because CTC Pay does not move, settle, or verify cash for the merchant's own inventory.

### Vales de Despensa

A Merchant Collection rail where the merchant accepts a customer's grocery voucher payment for the merchant's own sale.
_Avoid_: Treating accepted vales as provider-backed voucher issuance or Services Balance-funded operations.

### Services Balance

Ledger-backed prepaid balance the merchant must have available to fulfill provider-backed operations other than TAE, including service bills, telepeaje, and gift cards. Services Balance top-ups credit 1:1 with no bonus; service earnings happen later through Merchant Spread. When the customer pays cash, the merchant keeps the cash and CTC Pay debits Services Balance immediately. When the customer pays by credit or debit card, CTC Pay still debits Services Balance immediately and the card processor settles the customer payment to the merchant's bank account later, minus applicable card processing fees.

For in-flight provider operations, Services Balance is reserved immediately after customer payment succeeds and before final provider submission. The reserved debit prevents double-spending available balance. If the provider confirms success or accepted pending, the reserve becomes final. If the provider fails immediately, the reserve is released or reversed and the operation returns to the last stable audited state.

Available Services Balance must cover the full required debit before customer payment is accepted. The full debit includes the provider bill amount plus configured CTC Pay and provider costs; covering only the provider bill is not enough.

Airtime Balance and Services Balance remain separate for MVP because TAE margin is credited upfront as bonus balance while service earnings come from Merchant Spread. They should not be merged into a shared operating balance unless the business explicitly allows bonus airtime value to fund service operations.

### Top-Up

A merchant request to add prepaid value to Airtime Balance or Services Balance. For MVP, top-ups are manual and admin-approved: the merchant requests an amount and balance type, pays CTC Pay outside the app or through an enabled payment rail, and an admin confirms the payment before crediting the balance. Every top-up credit must be auditable. Airtime top-ups use preset packages because bonus margin can depend on the package or agreement. Services top-ups allow a free amount with a minimum because they credit 1:1.

### Merchant Spread

The merchant's service-operation earnings created by charging the customer more than the amount debited from Services Balance. For example, if a customer pays an 87 MXN total for a 75 MXN bill and CTC Pay debits 82 MXN from Services Balance, the merchant keeps a 5 MXN spread. Merchant Spread is tracked as transaction metadata and reporting, not as a CTC Pay ledger account, because CTC Pay never controls that money.

### Service Fee

The additional amount charged to the customer on top of the provider bill. Service Fee is configured by provider or service category for MVP, not typed freely by the merchant. The merchant must see and confirm the final customer total before completing the operation.

### Merchant of Record

For customer card, debit, or QR payments, the merchant is the merchant of record. CTC Pay may facilitate the operation, but the card processor settles the customer payment to the merchant's bank account, minus applicable processing fees. For provider-backed operations, CTC Pay earns from the Services Balance debit, not by holding the customer's payment. For Merchant Collection, CTC Pay may charge processing, software, or platform fees according to agreement.
