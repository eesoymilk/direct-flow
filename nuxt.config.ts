// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-04-06",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  nitro: {
    experimental: {
      database: true,
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@nuxt/content",
    "@pinia/nuxt",
  ],

  css: ["~/assets/css/main.css"],

  ui: {
    colorMode: false,
  },
});
