<template>
  <label class="inline-flex items-center cursor-pointer">
    <SunIcon class="mr-2" />
    <input
      type="checkbox"
      class="sr-only peer"
      :checked="isDark"
      tabindex="1"
      :aria-label="`site theme switch, dark theme - ${
        isDark ? 'enabled' : 'disabled'
      }`"
      @change="toggleTheme"
    />
    <div
      class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
    ></div>
    <MoonIcon class="ml-2" />
  </label>
</template>

<script setup lang="ts">
import SunIcon from "@/assets/icons/sun.svg";
import MoonIcon from "@/assets/icons/moon.svg";
const { isDark, toggleTheme } = useDarkMode();
</script>
