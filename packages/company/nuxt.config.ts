// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["../base"],

  imports: {
    dirs: ["~/shared/**"],
  },

  modules: ["@primevue/nuxt-module"],
});