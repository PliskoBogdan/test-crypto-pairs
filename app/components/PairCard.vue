<template>
  <div
    class="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm cursor-pointer hover:border-emerald-400 transition"
    @click="$emit('select', pair.symbol)"
  >
    <div class="flex items-center gap-2">
      <img
        :src="pair.iconUrl"
        :alt="pair.displayName"
        class="h-8 w-8 rounded-full object-cover"
        @error="onImgError($event)"
      />
      <div>
        <div class="font-semibold">
          {{ pair.displayName }}
        </div>
        <div class="text-xs text-gray-500">
          {{ pair.symbol }}
        </div>
      </div>
      <button
        class="ml-auto text-xs text-red-500 hover:text-red-600 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125"
        @click.stop="$emit('remove', pair.symbol)"
      >
        <IconTrashBlank class="fill-red" />
      </button>
    </div>

    <div class="flex items-start gap-3">
      <div class="flex flex-col">
        <span class="text-xs text-gray-500">Price</span>
        <span class="text-base font-mono">
          <span v-if="ticker">
            {{ ticker.lastPrice.toFixed(2) }}
          </span>
          <span v-else class="text-gray-400">—</span>
        </span>
      </div>

      <div class="flex flex-col">
        <span class="text-xs text-gray-500">24h %</span>
        <span
          v-if="ticker"
          :class="[
            'text-base font-mono',
            ticker.priceChangePercent > 0 ? 'text-emerald-500' : 'text-red-500',
          ]"
        >
          {{ ticker.priceChangePercent.toFixed(2) }}%
        </span>
        <span v-else class="text-gray-400 text-base">—</span>
      </div>

      <div class="ml-auto flex flex-col items-end">
        <span class="text-xs text-gray-500">Direction</span>
        <span v-if="ticker && ticker.prevPrice" class="min-h-[24px] mt-2">
          <span
            v-if="ticker.lastPrice > ticker.prevPrice"
            class="text-emerald-500"
          >
            <img src="../assets/icons/arrow.svg" alt="price down" loading="lazy">
          </span>
          <span
            v-else-if="ticker.lastPrice < ticker.prevPrice"
            class="text-red-500"
          >
            <img src="../assets/icons/arrow-up.svg" alt="price up" loading="lazy">
          </span>
          <span v-else class="animated-dot"></span>
        </span>
        <span v-else class="animated-dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TradingPair, TickerData } from "@/stores/usePairsStore";
import IconTrashBlank from "@/assets/icons/trash-blank.svg";

const onImgError = useImgFallback()

const props = defineProps<{
  pair: TradingPair;
  ticker?: TickerData;
}>();

defineEmits<{
  (e: "select", symbol: string): void;
  (e: "remove", symbol: string): void;
}>();

</script>

<style>
@keyframes pulse-dot {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.6;
  }
}

.animated-dot {
  display: block;
  width: 12px;
  height: 12px;
  margin-top: 6px;

  background-color: #66666647;
  border-radius: 50%;

  animation: pulse-dot 1.2s ease-in-out infinite;
}
</style>