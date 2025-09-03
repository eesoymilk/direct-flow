<template>
  <div class="min-h-screen flex flex-col bg-background">
    <AppHeader>
      <template #right-side>
        <UNavigationMenu :items="items" />
      </template>
    </AppHeader>
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
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
