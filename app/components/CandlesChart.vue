<template>
  <div class="mt-6">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-lg font-semibold">
        {{ symbol ? `${symbol} - 1m candles` : 'Select pair to see chart' }}
      </h2>
    </div>

    <div
      ref="container"
      class="h-72 w-full rounded-lg border border-gray-200 dark:border-gray-700
             bg-white dark:bg-gray-900"
    >
      <div
        v-if="!symbol"
        class="flex h-full items-center justify-center text-sm text-gray-500"
      >
        Click on a pair card to display chart.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createChart, type IChartApi, type ISeriesApi, type CandlestickData } from 'lightweight-charts'

const props = defineProps<{
  symbol: string | null
}>()

const currentSymbol = computed(() => props.symbol)
const { candles } = useKlineStream(currentSymbol)

const container = ref<HTMLDivElement | null>(null)
let chart: IChartApi | null = null
let series: ISeriesApi<'Candlestick'> | null = null

const create = () => {
  if (!container.value || !props.symbol) return

  chart = createChart(container.value, {
    layout: {
      background: { type: 'solid', color: 'transparent' },
      textColor: '#9CA3AF',
    },
    grid: {
      vertLines: { visible: false },
      horzLines: { visible: false },
    },
    timeScale: {
      borderVisible: false,
    },
    rightPriceScale: {
      borderVisible: false,
    },
  })

  series = chart.addCandlestickSeries()
}

const destroy = () => {
  if (chart) {
    chart.remove()
    chart = null
    series = null
  }
}

watch(
  candles,
  (val) => {
    if (!series || !chart) return
    const data: CandlestickData[] = val.map(c => ({
      time: c.time / 1000, // seconds
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }))
    series.setData(data)
  },
  { deep: true },
)

watch(
  () => props.symbol,
  () => {
    destroy()
    nextTick(() => {
      create()
    })
  },
)

onMounted(() => {
  if (props.symbol) {
    create()
  }
})

onBeforeUnmount(() => {
  destroy()
})
</script>
