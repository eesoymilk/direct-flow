// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { DirectFlowTheme } from "./themes/directFlow";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-09-08",
  devtools: { enabled: true },

  alias: {
    "~": "/<rootDir>",
  },

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
    "@primevue/nuxt-module",
  ],

  typescript: {
    typeCheck: true,
    strict: true,
  },

  css: [join(currentDir, "./app/assets/css/tailwind.css")],

  ui: {
    colorMode: false,
    theme: {
      colors: [
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
        "neutral",
      ],
    },
  },

  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: DirectFlowTheme,
        options: {
          cssLayer: {
            name: "primevue",
            order: "theme, base, primevue",
          },
          darkModeSelector: ".dark",
        },
      },
    },
  },

  imports: {
    presets: [
      {
        from: "primevue/usetoast",
        imports: [{ name: "useToast", as: "usePrimeToast" }],
      },
      {
        from: "@nuxt/ui/composables/useToast.js",
        imports: [{ name: "useToast", as: "useNuxtUiToast" }],
      },
    ],
  },
});
