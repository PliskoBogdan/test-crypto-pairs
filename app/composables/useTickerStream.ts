export function useTickerStream() {
  const pairsStore = usePairsStore();
  const ws = ref<WebSocket | null>(null);
  const reconnectTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

  const buildUrl = () => {
    const symbols = pairsStore.selectedSymbols;

    if (!symbols.length) {
      return null;
    }

    const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");

    return `wss://stream.binance.com:9443/stream?streams=${streams}`;
  };

  const closeWs = () => {
    if (reconnectTimeout.value) {
      clearTimeout(reconnectTimeout.value);
      reconnectTimeout.value = null;
    }

    if (ws.value) {
      ws.value.close();
      ws.value = null;
    }
  };

  const connect = () => {
    if (!import.meta.client) {
      return;
    }

    closeWs();

    const url = buildUrl();

    if (!url) {
      pairsStore.setTickerConnectionStatus("idle");
      return;
    }

    pairsStore.setTickerConnectionStatus("connecting");
    pairsStore.setTickerError(null);

    const socket = new WebSocket(url);
    ws.value = socket;

    socket.onopen = () => {
      pairsStore.setTickerConnectionStatus("open");
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        const payload = msg.data;

        if (!payload) {
          return;
        }

        const symbol = payload.s as string;
        const lastPrice = parseFloat(payload.c);
        const changePercent = parseFloat(payload.P);
        pairsStore.updateTicker(symbol, lastPrice, changePercent);
      } catch (e) {
        console.error("WS parse error", e);
      }
    };

    socket.onerror = (event) => {
      console.error("WS error", event);
      pairsStore.setTickerConnectionStatus("error");
      pairsStore.setTickerError("WebSocket error");
    };

    socket.onclose = () => {

      if (pairsStore.selectedSymbols.length > 0) {
        reconnectTimeout.value = setTimeout(() => {
          connect();
        }, 3000);
      } else {
        pairsStore.setTickerConnectionStatus("idle");
      }
    };
  };

  watch(
    () => pairsStore.selectedSymbols.slice(),
    () => {
      connect();
    },
    { deep: true }
  );

  onMounted(() => {
    connect();
  });

  onBeforeUnmount(() => {
    closeWs();
  });

  return {
    connect,
  };
}
