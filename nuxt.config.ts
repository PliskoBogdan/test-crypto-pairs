import tailwindcss from "@tailwindcss/vite";
import svgLoader from 'vite-svg-loader';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  css: ['./app/assets/css/main.css'],
  imports: {
    autoImport: true,
  },
  vite: {
    plugins: [
      tailwindcss(),
      svgLoader()
    ],
  },

  modules: ['@pinia/nuxt'],
})