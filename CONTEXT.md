# Project Context

## Glossary

### CTC Pay

CTC Pay is a merchant-facing POS companion for small Mexican businesses. It lets a merchant sell or accept multiple operations from one mobile-first interface: airtime, service payments, card or QR charges, telepeaje, gift cards, and vales.

### Merchant

The business user operating CTC Pay to sell services, accept payments, and review operational activity.

### Operation

A merchant-initiated action in CTC Pay, such as selling airtime, charging a customer, paying a service bill, recharging telepeaje, selling a gift card, or accepting vales.

### Transaction

The persisted financial or provider record created after customer payment is captured or cash is confirmed, merchant balance is reserved, and provider fulfillment is successful or Accepted Pending. Pre-validation attempts, cash confirmation before provider acceptance, in-flight balance reserves, and voided electronic authorizations are audit events, not regular Transactions, because no final provider-accepted operation has occurred yet.

Transactions represent completed amount-affecting operations in the normal merchant history UI. If a payment is not completed, customer-facing amounts are not modified and the attempt should not appear as a regular Movement.

Provider Pre-Validation exists to prevent normal pending or refund-required merchant scenarios. Rejected, expired, failed, or cancelled attempts before completion are audit events, not regular Transactions or Movements.

If an exceptional provider failure happens after customer payment despite pre-validation, it should be handled through support or audit tooling instead of being modeled as a normal history state in the MVP UI.

Provider operations must reach a provider pre-validation checkpoint before customer payment is accepted. If pre-validation is not confirmed, the customer payment must not proceed. Pre-validation expires after 2 minutes for MVP; after expiry, the merchant must re-run validation before accepting payment. Failures are audited and retried from the previous stable state, not from an uncertain partial state.

### Authorized Customer Payment

An electronic customer payment that the processor has approved and held but not captured.
_Avoid_: Completed payment, settled payment.

### Captured Customer Payment

An electronic customer payment that the processor has captured and will settle to the merchant according to the merchant's processing agreement.
_Avoid_: Authorization, hold.

### Voided Authorization

An electronic customer payment authorization released before capture, normally because provider fulfillment was not accepted.
_Avoid_: Refund, reversal.

### Refund-Required Provider Failure

A provider-backed operation failure where customer funds were already captured or the payment rail cannot be voided, so the merchant must refund the customer or resolve the case through support.
_Avoid_: Normal pending state.

### Payment Processing Fee

The fee charged by a payment processor or payment rail for handling an electronic customer payment.
_Avoid_: Merchant Spread, Service Fee.

Passing Payment Processing Fees through to the customer as a surcharge is not assumed for MVP. Any surcharge, convenience fee, or customer-facing fee pass-through must be validated against local regulation, processor rules, and required customer disclosures before CTC Pay models it as supported behavior.

For MVP, Payment Processing Fees are settlement and reporting data, not transaction-time promises. Service transaction details may explain that electronic payment fees apply to settlement, but exact fee amounts should be shown after the processor confirms them.

Payment Processing Fee reversals on refunds are outside MVP transaction behavior. When later supported, they must be shown as processor-dependent settlement or reporting events instead of assumed on the original service transaction.

### Payment Rail Capability

The settlement behavior a customer payment method actually supports, such as authorization-before-capture, immediate capture, void, refund, or non-voidable settlement.
_Avoid_: Assuming capability from UI labels like QR, card, or debit.

### Provider Pre-Validation

The provider confirmation that a referenced bill or product is currently payable before the merchant accepts customer payment.
Provider Pre-Validation is required for Service Bills, where the provider returns a payable bill amount and CTC Pay adds the configured Service Fee to show the final customer total before payment.
For Service Bills, an active Provider Pre-Validation may survive a customer payment method change while the validation is unexpired and the customer total remains unchanged. Payment method changes affect payment orchestration, settlement, and fee reporting; they do not require provider re-validation unless they change the validated bill amount, Service Fee, or customer total.
If Provider Pre-Validation expires while the merchant is still on the payment screen, CTC Pay must block completion and require re-validation before accepting cash, authorizing electronic payment, reserving balance, or submitting provider fulfillment.
_Avoid_: Lookup, search, reference found.

### Movement

User-facing copy for items shown in history. Movement is not a separate domain object from Transaction. The history should use one unified feed by default, with filters and clear labels for operation family, product, customer payment method, balance impact, merchant earning, and status. Top-Up requests appear in the feed with requested, approved/credited, or rejected/cancelled status. Pre-validation audit events are not shown as regular movements unless needed for audit review. Electronic payment fee amounts should appear in settlement or reporting views once confirmed, not as guaranteed values in the original service Movement.

### Dashboard Balances

The home dashboard must not collapse operational balances, collections, and spread into one generic balance. It should distinguish Airtime Balance, Services Balance, today's electronic Merchant Collection volume, and today's estimated Merchant Spread.

### Ledger-Backed Balance

A money-like stored value balance whose source of truth is immutable ledger entries, not a mutable balance field. Balance displays are derived from ledger movements. Ledger-backed balances track at least posted, reserved or pending, and available views. Posted movements are not edited; corrections use reversal or adjustment entries. Balance-affecting operations must be atomic, auditable, and idempotent.

Each merchant has separate posted and reserved ledger accounts for each prepaid balance type. At minimum, the ledger distinguishes merchant Airtime posted, merchant Airtime reserved, merchant Services posted, and merchant Services reserved. Available balance is derived as posted minus reserved.

Successful provider-backed operations move value from the merchant's reserved balance into provider clearing and CTC Pay platform revenue accounts. Provider clearing tracks amounts owed to or settled with provider partners and supports later reconciliation against provider invoices or settlement reports. Platform revenue tracks CTC Pay's own earnings separately from provider payable amounts.

### Airtime Balance

Ledger-backed prepaid balance the merchant must have available to sell tiempo aire. Airtime operations require customer payment received and consume Airtime Balance when fulfilled. TAE commission is credited upfront as bonus Airtime Balance when the merchant buys balance. For example, if the merchant pays 100 MXN and receives 105 MXN of Airtime Balance, the extra 5 MXN is the merchant's embedded margin.

Changes to a merchant's TAE commission agreement apply only to future Airtime top-ups. Already credited Airtime Balance is not recalculated retroactively; corrections use explicit adjustment or reversal entries when needed.

Available Airtime Balance must cover the recharge amount before customer payment is accepted. If Airtime Balance is insufficient, CTC Pay blocks the operation and prompts the merchant to request a top-up.

TAE uses lightweight product availability validation before customer payment: the carrier must exist, the amount or package must be valid for that carrier, and Airtime Balance must be sufficient. TAE does not use the same 2-minute provider bill pre-validation flow unless a provider requires it.

If a TAE provider recharge fails after customer payment was captured, accepted as cash, or processed on a non-voidable rail, the transaction enters a refund-required state. Any Airtime Balance reserve or debit is released or reversed, the merchant refunds the customer or retries, and the failed attempt remains auditable. If TAE uses card or debit authorization before capture, immediate provider failure voids the authorization instead of creating a refund-required Transaction.

### Customer-Paid Operation

A provider-backed operation where the customer pays the merchant at the counter, but CTC Pay fulfills the provider side by reserving or debiting the merchant's prepaid Airtime Balance or Services Balance. Provider pre-validation must confirm the bill or product is payable before customer payment is accepted. For cash payments, selecting cash is not enough; the merchant must explicitly confirm cash was received before CTC Pay reserves balance and sends or confirms provider fulfillment. For electronic payments, CTC Pay must classify the payment rail by Payment Rail Capability rather than by UI label; authorization-capable card, debit, or QR rails should authorize before CTC Pay reserves balance and submits provider fulfillment, then capture only after the provider confirms success or Accepted Pending. If the provider fails before capture, CTC Pay voids the authorization and releases the balance reserve instead of creating a refund-required Transaction. Immediate-capture, non-voidable, or otherwise non-authorization-capable rails use refund-required handling if provider fulfillment fails after customer funds move.

### Merchant Collection

A general payment-terminal operation where CTC Pay collects a customer card, debit, QR, or voucher payment for the merchant's own sale. Merchant Collection is separate from provider-backed operations: it does not use Airtime Balance or Services Balance, does not require provider pre-validation, and settles according to the merchant's payment-processing arrangement. For MVP, Merchant Collection does not model cash sales because CTC Pay does not move, settle, or verify cash for the merchant's own inventory.

### Vales de Despensa

A Merchant Collection rail where the merchant accepts a customer's grocery voucher payment for the merchant's own sale.
_Avoid_: Treating accepted vales as provider-backed voucher issuance or Services Balance-funded operations.

### Services Balance

Ledger-backed prepaid balance the merchant must have available to fulfill provider-backed operations other than TAE, including service bills, telepeaje, and gift cards. Services Balance top-ups credit 1:1 with no bonus; service earnings happen later through Merchant Spread. When the customer pays cash, the merchant keeps the cash and CTC Pay debits Services Balance immediately after the merchant confirms cash received. When the customer pays by credit or debit card, CTC Pay reserves Services Balance after customer payment authorization, finalizes the debit only after provider acceptance, and the card processor captures and settles the customer payment to the merchant's bank account later, minus applicable Payment Processing Fees.

Services Balance funds three MVP product families with different validation shapes: Service Bills use Provider Pre-Validation with bill amount, Service Fee, and customer total; Telepeaje uses lightweight account or tag validation before payment; Gift Cards use fixed-denomination product availability validation before payment. Telepeaje and Gift Cards do not use the 2-minute bill pre-validation flow unless a provider explicitly requires it.

Provider Pre-Validation alone does not reserve Services Balance. CTC Pay reserves Services Balance only after cash payment is confirmed or electronic customer payment is authorized, because the merchant's funds should not be locked before the customer commits to pay.

For in-flight provider operations, Services Balance is reserved after cash confirmation or electronic payment authorization and before final provider submission. The reserved debit prevents double-spending available balance. If the provider confirms success or Accepted Pending, the reserve becomes final and electronic customer payment is captured. If the provider fails before capture, the reserve is released, the authorization is voided, and the operation returns to the last stable audited state. Refund-required handling is reserved for captured payments, non-voidable rails, or cash failures where the merchant already received customer funds.

Available Services Balance must cover the full required debit before customer payment is accepted. The full debit includes the provider bill amount plus configured CTC Pay and provider costs; covering only the provider bill is not enough.

If available Services Balance is insufficient after Service Bill pre-validation, CTC Pay must block customer payment and prompt the merchant to request a Services Balance top-up. MVP must not accept customer payment, hold provider fulfillment, create a partial reserve, or allow admin override when Services Balance cannot cover the full required debit.

Airtime Balance and Services Balance remain separate for MVP because TAE margin is credited upfront as bonus balance while service earnings come from Merchant Spread. They should not be merged into a shared operating balance unless the business explicitly allows bonus airtime value to fund service operations.

### Top-Up

A merchant request to add prepaid value to Airtime Balance or Services Balance. For MVP, top-ups are manual and admin-approved: the merchant requests an amount and balance type, pays CTC Pay outside the app or through an enabled payment rail, and an admin confirms external payment evidence before crediting the balance. A request alone is not sufficient to credit balance. Every top-up credit must be auditable and linked to the approving admin, confirmed evidence, credited balance type, credited amount, and timestamp. Airtime top-ups use preset packages whose bonus amounts come from default segment or tier configuration, with merchant-specific overrides when a merchant has a different commission agreement. Services top-ups allow any custom amount that meets the configured minimum because they credit 1:1 with no package bonus.

### Merchant Spread

The merchant's service-operation earnings created by charging the customer more than the amount debited from Services Balance. For example, if a customer pays an 87 MXN total for a 75 MXN bill and CTC Pay debits 82 MXN from Services Balance, the merchant keeps a 5 MXN spread. Merchant Spread is tracked as transaction metadata and reporting, not as a CTC Pay ledger account, because CTC Pay never controls that money.

Merchant Spread is separate from Payment Processing Fees. If the customer pays a service operation with card, debit, QR, or vales, the regular electronic payment processing fees apply to the merchant's customer payment settlement without changing the Merchant Spread amount recorded for the service operation.

### Service Fee

The additional amount charged to the customer on top of the provider bill. Service Fee is configured by provider or service category for MVP, not typed freely by the merchant. The merchant must see and confirm the final customer total before completing the operation.

### Merchant of Record

For customer card, debit, or QR payments, the merchant is the merchant of record. CTC Pay may facilitate authorization, capture, void, and refund timing according to each payment rail's capability, but the processor settles the customer payment to the merchant's bank account, minus applicable Payment Processing Fees. For provider-backed operations, CTC Pay earns from the Services Balance debit, not by holding the customer's payment. For Merchant Collection, CTC Pay may charge processing, software, or platform fees according to agreement.
