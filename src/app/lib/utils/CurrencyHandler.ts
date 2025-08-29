export class CurrencyHandlers {
  static changeToLocaleCurrency(amount: number | null | undefined) {
    if (amount === null || amount === undefined) return "no number inputted";
    return Number(amount).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  }
}
