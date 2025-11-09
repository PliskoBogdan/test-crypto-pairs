import { defineStore } from "pinia";

export interface TradingPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  displayName: string;
  iconUrl: string;
}

export interface TickerData {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  prevPrice?: number;
}

export type ConnectionStatus = "idle" | "connecting" | "open" | "error";

export const usePairsStore = defineStore("pairs", () => {
  const allPairs = ref<TradingPair[]>([]);
  const selectedSymbols = ref<string[]>([]);
  const tickers = reactive<Record<string, TickerData>>({});

  const tickerConnectionStatus = ref<ConnectionStatus>("idle");
  const tickerError = ref<string | null>(null);

  const selectedPairs = computed(() =>
    allPairs.value.filter((p) => selectedSymbols.value.includes(p.symbol))
  );

  function setAllPairs(pairs: TradingPair[]) {
    allPairs.value = pairs;
  }

  function toggleSymbol(symbol: string) {
    if (selectedSymbols.value.includes(symbol)) {
      selectedSymbols.value = selectedSymbols.value.filter((s) => s !== symbol);
    } else {
      selectedSymbols.value.push(symbol);
    }
  }

  function removeSymbol(symbol: string) {
    selectedSymbols.value = selectedSymbols.value.filter((s) => s !== symbol);
  }

  function setSelectedSymbols(symbols: string[]) {
    selectedSymbols.value = symbols;
  }

  function updateTicker(
    symbol: string,
    lastPrice: number,
    priceChangePercent: number
  ) {
    const prev = tickers[symbol]?.lastPrice;
    tickers[symbol] = {
      symbol,
      lastPrice,
      priceChangePercent,
      prevPrice: prev,
    };
  }

  function setTickerConnectionStatus(status: ConnectionStatus) {
    tickerConnectionStatus.value = status;
  }

  function setTickerError(message: string | null) {
    tickerError.value = message;
  }

  function loadFromStorage() {
    if (!import.meta.client) {
      return
    };

    const saved = localStorage.getItem("selectedSymbols");

    if (saved) {
      try {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) {
          selectedSymbols.value = arr;
        }
      } catch (e) {
        console.error("Failed to parse selectedSymbols from storage", e);
      }
    }
  }

  if (import.meta.client) {
    watch(
      selectedSymbols,
      (val) => {
        localStorage.setItem("selectedSymbols", JSON.stringify(val));
      },
      { deep: true }
    );
  }

  return {
    allPairs,
    selectedSymbols,
    selectedPairs,
    tickers,
    tickerConnectionStatus,
    tickerError,
    setAllPairs,
    toggleSymbol,
    removeSymbol,
    setSelectedSymbols,
    updateTicker,
    setTickerConnectionStatus,
    setTickerError,
    loadFromStorage,
  };
});
