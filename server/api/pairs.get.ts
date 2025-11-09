export default defineEventHandler(async (): Promise<any> => {
  const config = useRuntimeConfig();
  const data = await $fetch<any>(config.public.pairsBaseUrl);

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
        iconUrl: `${config.public.pairsIconBaseUrl}${base.toLowerCase()}.png`,
      };
    });

  return symbols;
});
