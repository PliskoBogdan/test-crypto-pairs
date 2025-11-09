import type { TradingPair } from "@/stores/usePairsStore";

export function usePairs() {
  const pairsStore = usePairsStore();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadPairs = async () => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch<TradingPair[]>("/api/pairs");
      pairsStore.setAllPairs(data);
    } catch (e: any) {
      error.value = e?.message ?? "Failed to load pairs";
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    loadPairs,
  };
}
