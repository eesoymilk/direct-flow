// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["../base"],

  compatibilityDate: "2025-07-25",
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
    "nuxt-auth-utils",
    "@vueuse/nuxt",
  ],

  css: ["~/assets/css/main.css"],

  ui: {
    colorMode: false,
  },

  imports: {
    dirs: ["~/shared/**"],
  },
});