<template>
  <main>
    <section class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-6">
      <PairsSelector v-once/>

      <div class="mt-2 text-xs text-gray-500 flex items-center gap-3">
        <span v-if="pairsLoading">Loading pairs...</span>
        <span v-if="pairsError" class="text-red-500">{{ pairsError }}</span>
        <span v-if="pairsStore.allPairs.length">
          {{ pairsStore.allPairs.length }} pairs available to choose from
        </span>
      </div>

      <SelectedPairsList @select-pair="onSelectPair" />
      <CandlesChart :symbol="activeSymbol" />
    </section>
  </main>
</template>

<script setup lang="ts">
import PairsSelector from '@/components/PairsSelector.vue'
import SelectedPairsList from '@/components/SelectedPairsList.vue'
import CandlesChart from '@/components/CandlesChart.vue'

const pairsStore = usePairsStore()
const { loading: pairsLoading, error: pairsError, loadPairs } = usePairs()
useTickerStream()

const activeSymbol = ref<string | null>(null)

const onSelectPair = (symbol: string) => {
  activeSymbol.value = symbol
}

onMounted(async () => {
  pairsStore.loadFromStorage()
  await loadPairs()
  // if any paires in LS take first for graphs
  if (!activeSymbol.value && pairsStore.selectedSymbols.length > 0) {
    activeSymbol.value = pairsStore.selectedSymbols[0] as string;
  }
})
</script>
