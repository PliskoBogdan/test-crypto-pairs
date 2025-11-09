interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const CANDLES_LIMIT = 200;

export function useKlineStream(symbol: Ref<string | null>) {
  const config = useRuntimeConfig();

  const candles = ref<Candle[]>([]);
  const ws = ref<WebSocket | null>(null);

  const closeWs = () => {
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

    if (!symbol.value) {
      return;
    };

    const streamSymbol = symbol.value.toLowerCase();
    const url = `${config.public.klainBaseUrl}${streamSymbol}@kline_1m`;
    const socket = new WebSocket(url);
    ws.value = socket;

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const k = msg.k;
  
        if (!k) {
          return
        };
  
        const candle: Candle = {
          time: k.t,
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
        };

        const last = candles.value.at(-1);

        if (!last) {
          candles.value.push(candle);
          return;
        }

        if (last.time === candle.time) {
          candles.value[candles.value.length - 1] = candle;
          return;
        }

        candles.value.push(candle);

        if (candles.value.length > CANDLES_LIMIT) {
          candles.value.shift();
        }
      } catch (error) {
        console.error('Error when parse candles', error);
      }
    };
  };

  watch(symbol, () => {
    connect();
    candles.value = [];
  });

  onMounted(() => {
    connect();
  });

  onBeforeUnmount(() => {
    closeWs();
  });

  return {
    candles,
  };
}
