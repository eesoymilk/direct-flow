<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-warning-50 border border-warning-200 rounded-lg p-6 mb-8">
        <div class="flex items-start gap-3">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="text-warning-500 mt-1"
          />
          <div>
            <h2 class="text-lg font-semibold text-warning-700 mb-2">
              功能開發中
            </h2>
            <p class="text-warning-600">
              公司變更登記系統正在開發中，預計將於近期推出。此系統將提供完整的公司資料變更登記服務。
            </p>
          </div>
        </div>
      </div>

      <h1 class="text-3xl font-bold text-primary mb-6">變更登記</h1>

      <div class="bg-surface rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">即將推出的功能</h2>
        <ul class="space-y-3">
          <li class="flex items-start gap-2">
            <UIcon
              name="i-heroicons-building-office"
              class="text-primary mt-1"
            />
            <span>公司基本資料變更</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-user-group" class="text-primary mt-1" />
            <span>股東資料變更</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-briefcase" class="text-primary mt-1" />
            <span>董事監事變更</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-document-text" class="text-primary mt-1" />
            <span>公司章程變更</span>
          </li>
        </ul>
      </div>

      <div class="text-center">
        <UButton color="primary" size="lg" to="/contact">
          聯絡我們了解更多
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
