<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium mb-1"> Trading pairs </label>

    <div class="relative flex-1" ref="wrapper">
      <input
        v-model="search"
        type="text"
        placeholder="Search pair (e.g. BTC)"
        class="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        tabindex="1"
        @focus="handleFocus"
      />

      <ul
        v-bind="containerProps"
        class="max-h-64 overflow-y-auto p-2 bg-gray-500/5 rounded"
        :class="{ hidden: isListHidden }"
      >
        <div
          v-if="!filteredPairs.length"
          class="px-3 py-2 text-xs text-gray-500"
        >
          No pairs
        </div>

        <div v-else v-bind="wrapperProps">
          <li
            v-for="{ data } in list"
            :key="data.symbol"
            tabindex="0"
            class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            :aria-label="data.displayName"
            @click="toggle(data.symbol)"
            @keydown.enter="toggle(data.symbol)"
          >
            <img
              :src="data.iconUrl"
              :alt="data.displayName"
              class="h-5 w-5 rounded-full object-cover"
              decoding="async"
              loading="lazy"
              @error="onImgError($event)"
            />
            <span class="font-medium">{{ data.displayName }}</span>
            <span
              v-if="selectedSymbols.includes(data.symbol)"
              class="ml-auto text-xs text-emerald-500"
            >
              <img src="../assets/icons/check.svg" alt="check status" loading="lazy">
            </span>
          </li>
        </div>
      </ul>

      <button
        @click="clearSearch"
        class="absolute right-0 top-[4px] flex w-10 items-center justify-center text-lg cursor-pointer"
        tabindex="2"
      >
        &times;
      </button>
    </div>

    <div class="flex flex-wrap gap-2 mt-2">
      <button
        v-for="symbol in selectedSymbols"
        :key="symbol"
        class="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 text-xs text-emerald-800 dark:text-emerald-100"
        @click="remove(symbol)"
      >
        <span>{{ symbol }}</span>
        <span class="cursor-pointer">&times;</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'

const pairsStore = usePairsStore();

const onImgError = useImgFallback()

const search = ref<string>("");
const isListHidden = ref<boolean>(true);
const wrapper = ref<HTMLElement | null>(null);

const selectedSymbols = computed(() => pairsStore.selectedSymbols);

const filteredPairs = computed(() => {
  const term = search.value.toLowerCase().trim();
  if (!term) {
    return pairsStore.allPairs;
  }

  return pairsStore.allPairs.filter(
    (p) =>
      p.displayName.toLowerCase().includes(term) ||
      p.symbol.toLowerCase().includes(term)
  );
});

const { list, containerProps, wrapperProps } = useVirtualList(filteredPairs, { itemHeight: 36 })

const toggle = (symbol: string) => {
  pairsStore.toggleSymbol(symbol);
};

const remove = (symbol: string) => {
  pairsStore.removeSymbol(symbol);
};

const clearSearch = () => {
  search.value = "";
};

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  if (wrapper.value && !wrapper.value.contains(target)) {
    isListHidden.value = true;
  }
};

const handleEsc = (event: KeyboardEvent) => {
  if (event.key !== "Escape" || isListHidden.value) {
    return;
  }

  isListHidden.value = true;
};

const handleFocus = () => {
  isListHidden.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEsc);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEsc);
});
</script>
