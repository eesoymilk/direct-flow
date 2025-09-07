<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden">
    <!-- Global Background Gradients -->
    <div
      class="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    />
    <div
      class="fixed inset-0 bg-gradient-to-tr from-cyan-50/50 via-transparent to-pink-50/50"
    />

    <!-- Floating Background Elements -->
    <div
      class="fixed top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"
    />
    <div
      class="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"
    />
    <div
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse delay-500"
    />

    <AppHeader :navigation-items="items" />
    <main class="flex-1 pt-20 relative z-10">
      <slot />
    </main>
    <AppFooter class="z-10" />
    <!-- <DebugPopover /> -->
  </div>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[]>([
  {
    label: "所有申請",
    icon: "i-lucide-file-text",
    to: "/applications",
  },
]);
</script>
