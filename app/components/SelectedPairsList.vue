<template>
  <div class="mt-6 space-y-3">
    <div class="flex items-center gap-2 justify-between">
      <h2 class="text-lg font-semibold">Selected pairs</h2>
      

      <div>
        <span class="text-xs text-gray-500">
          WS: <span :class="statusColor">{{ statusLabel }}</span>
        </span>
        <span v-if="error" class="text-xs text-red-500">
          {{ error }}
        </span>
      </div>
    </div>

    <div v-if="!pairs.length" class="text-sm text-gray-500">
      No pairs selected yet.
    </div>

    <ul v-else v-bind="containerProps" class="max-h-72 gap-3 overflow-y-auto">
      <div v-bind="wrapperProps">
      <PairCard
        v-for="{ data } in list"
        :key="data.symbol"
        :pair="data"
        :ticker="tickers[data.symbol]"
        @remove="onRemove"
        @select="onSelect"
      />
    </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'

import type { TickerData, ConnectionStatus } from "@/stores/usePairsStore";

import PairCard from "./PairCard.vue";

const pairsStore = usePairsStore();

const pairs = computed(() => pairsStore.selectedPairs);
const { list, containerProps, wrapperProps } = useVirtualList(pairs, { itemHeight: 118 })
const tickers = computed<Record<string, TickerData>>(() => pairsStore.tickers);
const status = computed<ConnectionStatus>(
  () => pairsStore.tickerConnectionStatus
);
const error = computed(() => pairsStore.tickerError);


const statusData: Record<ConnectionStatus, { label: string; class: string }> = {
  connecting: { label: "connecting", class: "text-amber-500" },
  open: { label: "open", class: "text-emerald-500" },
  error: { label: "error", class: "text-red-500" },
  idle: { label: "", class: "" },
};

const statusLabel = computed(() => {
  return statusData[status.value].label || "idle";
});

const statusColor = computed(() => {
  return statusData[status.value].class || "text-gray-400";
});

const emit = defineEmits<{
  (e: "selectPair", symbol: string): void;
}>();

const onRemove = (symbol: string) => {
  pairsStore.removeSymbol(symbol);
};

const onSelect = (symbol: string) => {
  emit("selectPair", symbol);
};
</script>
