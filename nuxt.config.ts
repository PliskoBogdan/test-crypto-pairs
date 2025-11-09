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
  runtimeConfig: {
    public: {
      tickerStreamBaseUrl: process.env.NUXT_TICKER_STREAM_BASEURL,
      pairsIconBaseUrl: process.env.NUXT_PAIRS_ICONS_BASEURL,
      pairsBaseUrl: process.env.NUXT_PAIRS_BASEURL,
      klainBaseUrl: process.env.NUXT_KLINE_STREAM_BASEURL,
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
      svgLoader()
    ],
  },

  modules: ['@pinia/nuxt'],
})