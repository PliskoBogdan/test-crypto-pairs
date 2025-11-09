export default defineEventHandler(async (): Promise<any> => {
  const data = await $fetch<any>("https://api.binance.com/api/v3/exchangeInfo");

  const symbols = data.symbols
    .filter((s: any) => s.status === "TRADING" && s.quoteAsset === "USDT")
    .map((s: any) => {
      const base = s.baseAsset;
      const quote = s.quoteAsset;
      return {
        id: s.symbol,
        symbol: s.symbol,
        baseAsset: base,
        quoteAsset: quote,
        displayName: `${base}/${quote}`,
        iconUrl: `https://cryptoicons.org/api/icon/${base.toLowerCase()}/64`,
      };
    });

  return symbols;
});
