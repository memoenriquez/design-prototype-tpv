export const moneyFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatMoney = (amount: number) => `$${moneyFormatter.format(amount)}`
