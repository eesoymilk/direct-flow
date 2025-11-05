<template>
  <div>
    <AppHeader class="z-10" :navigation-items="items" />
    <main class="flex-1 pt-20 relative min-h-screen">
      <slot />
    </main>
    <AppFooter class="z-10" />
  </div>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[]>([
  {
    label: "首頁",
    icon: "i-lucide-home",
    to: "/",
  },
  {
    label: "客戶管理",
    icon: "i-lucide-building-2",
    to: "/clients",
  },
  {
    label: "財報建構",
    icon: "i-lucide-file-text",
    to: "/builder",
  },
  {
    label: "審計案件",
    icon: "i-lucide-folder-open",
    to: "/projects",
  },
  {
    label: "報告產生",
    icon: "i-lucide-file-chart-line",
    to: "/reports",
  },
]);
</script>
