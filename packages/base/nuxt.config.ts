// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-09-08",
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
    "@nuxt/ui",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
    "@nuxt/test-utils",
  ],

  css: [join(currentDir, "./app/assets/css/tailwind.css")],

  ui: {
    colorMode: false,
  },

  imports: {
    dirs: ["~/shared/**"],
  },
});