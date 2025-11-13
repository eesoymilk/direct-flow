<template>
  <UContainer class="space-y-8 py-8">
    <!-- Header -->
    <div class="text-center">
      <UBadge
        icon="i-lucide-file-text"
        label="財報建構器"
        color="primary"
        variant="subtle"
        size="xl"
        class="mb-4"
      />
      <h1 class="text-4xl font-bold text-gray-900 mb-3">查核意見段建構器</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        建構符合審計準則的查核意見段與資產負債表
      </p>
      <UButton
        icon="i-lucide-shuffle"
        label="產生測試資料"
        color="neutral"
        variant="outline"
        size="sm"
        class="mt-4"
        @click="store.generateMockData"
      />
    </div>

    <!-- Main Tabs -->
    <UTabs :unmount-on-hide="false" :items="mainTabs" class="w-full">
      <template #opinion>
        <BuilderOpinionBuilder />
      </template>
      <template #financial>
        <BuilderFinancialTransformBuilder />
      </template>
    </UTabs>
  </UContainer>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const store = useOpinionBuilderStore();

const mainTabs: TabsItem[] = [
  {
    label: "意見段",
    slot: "opinion",
    icon: "i-lucide-file-text",
  },
  {
    label: "資產負債表",
    slot: "financial",
    icon: "i-lucide-file-spreadsheet",
  },
];

useSeoMeta({
  title: "查核意見段建構器 - Direct Flow Audit",
  description: "建構符合審計準則的查核意見段，支援各種意見類型",
});
</script>
