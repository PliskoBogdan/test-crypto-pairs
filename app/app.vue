<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <div class="mx-auto max-w-6xl px-4 py-6">
      <header class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold">
          Online crypto trading pairs observer
        </h1>
        <ThemeSwitcher />
      </header>

      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
useDarkMode();
</script>