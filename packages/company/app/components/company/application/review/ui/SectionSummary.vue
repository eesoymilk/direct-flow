<template>
  <div class="space-y-4">
    <!-- Issues Summary -->
    <div
      v-if="issuesCount > 0"
      class="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200"
    >
      <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-500" />
      <span class="text-sm font-medium text-red-800">
        {{ issuesCount }} 個問題需要處理
      </span>
    </div>

    <!-- Verification Summary -->
    <div
      v-if="verifiedCount > 0"
      class="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200"
    >
      <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-500" />
      <span class="text-sm font-medium text-green-800">
        {{ verifiedCount }}/{{ totalCount }} 個欄位已驗證
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  issuesCount: number;
  verifiedCount: number;
  totalCount: number;
}

defineProps<Props>();
</script>
