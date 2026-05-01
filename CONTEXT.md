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

Transactions can be pending when a provider accepts the request but has not confirmed final success. Pending transactions appear in history with their provider reference and should not be retried unless rejected or timed out.

If provider fulfillment fails after customer payment was received, the transaction enters a refund-required state. Failed transactions remain in history for auditability and can be resolved by refunding the customer outside the app or retrying with corrected details. Retries should preserve an audit trail instead of deleting the failed attempt.

Provider operations must reach a provider pre-validation checkpoint before customer payment is accepted. If pre-validation is not confirmed, the customer payment must not proceed. Pre-validation expires after 2 minutes for MVP; after expiry, the merchant must re-run validation before accepting payment. Failures are audited and retried from the previous stable state, not from an uncertain partial state.

### Movement

User-facing copy for items shown in history. Movement is not a separate domain object from Transaction.

### Airtime Balance

Prepaid balance the merchant must have available to sell tiempo aire. Airtime operations require customer payment received and consume Airtime Balance when fulfilled. TAE commission is credited upfront as bonus Airtime Balance when the merchant buys balance. For example, if the merchant pays 100 MXN and receives 105 MXN of Airtime Balance, the extra 5 MXN is the merchant's embedded margin.

### Customer-Paid Operation

A provider-backed operation where the customer pays the merchant at the counter, but CTC Pay fulfills the provider side by reserving or debiting the merchant's prepaid Airtime Balance or Services Balance. Provider pre-validation must confirm the bill or product is payable before customer payment is accepted. For cash payments, the merchant must explicitly mark customer payment received before CTC Pay reserves balance and sends or confirms provider fulfillment. For card or debit payments, the card processor must confirm payment succeeded before CTC Pay reserves balance and submits provider fulfillment.

### Services Balance

Prepaid balance the merchant must have available to fulfill provider-backed operations other than TAE, including service bills, telepeaje, gift cards, and vales. When the customer pays cash, the merchant keeps the cash and CTC Pay debits Services Balance immediately. When the customer pays by credit or debit card, CTC Pay still debits Services Balance immediately and the card processor settles the customer payment to the merchant's bank account later, minus applicable card processing fees.

For in-flight provider operations, Services Balance is reserved immediately after customer payment succeeds and before final provider submission. The reserved debit prevents double-spending available balance. If the provider confirms success or accepted pending, the reserve becomes final. If the provider fails immediately, the reserve is released or reversed and the operation returns to the last stable audited state.

Airtime Balance and Services Balance remain separate for MVP because TAE margin is credited upfront as bonus balance while service earnings come from Merchant Spread. They should not be merged into a shared operating balance unless the business explicitly allows bonus airtime value to fund service operations.

### Merchant Spread

The merchant's service-operation earnings created by charging the customer more than the amount debited from Services Balance. For example, if a customer pays an 87 MXN total for a 75 MXN bill and CTC Pay debits 82 MXN from Services Balance, the merchant keeps a 5 MXN spread. Merchant Spread is not tracked as a separate commission balance.

### Service Fee

The additional amount charged to the customer on top of the provider bill. Service Fee is configured by provider or service category for MVP, not typed freely by the merchant. The merchant must see and confirm the final customer total before completing the operation.

### Merchant of Record

For customer card or debit payments on provider services, the merchant is the merchant of record. CTC Pay may facilitate the operation, but the card processor settles the customer payment to the merchant's bank account, minus applicable card processing fees. CTC Pay earns from the Services Balance debit, not by holding the customer's card payment.
