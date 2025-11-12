<template>
  <div class="space-y-8">
    <!-- Upload and Generation Section -->
    <BuilderFinancialUpload />

    <!-- Generated Balance Sheet Display -->
    <div v-if="balanceSheet" class="space-y-6">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-layout-grid" class="w-5 h-5" />
            <h3 class="text-lg font-semibold">資產負債表</h3>
          </div>
        </template>

        <BuilderFinancialBalanceSheetDisplay :balance-sheet="balanceSheet" />
      </UCard>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!store.isProcessing && !store.error"
      class="text-center py-16"
    >
      <UIcon
        name="i-lucide-file-spreadsheet"
        class="w-16 h-16 mx-auto text-gray-300 mb-4"
      />
      <h3 class="text-lg font-semibold text-gray-600 mb-2">
        尚未產生資產負債表
      </h3>
      <p class="text-sm text-gray-500">
        請上傳包含 TB (試算表) 工作表的 Excel 檔案以開始
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFinancialTransformerStore } from "../../composables/stores/financialTransformer";
import type { GeneratedBalanceSheet } from "../../types/financial";

const store = useFinancialTransformerStore();

// Unwrap readonly for component props
const balanceSheet = computed<GeneratedBalanceSheet | null>(() => {
  if (!store.balanceSheet) return null;
  // Use toRaw to unwrap readonly proxy completely
  return toRaw(store.balanceSheet) as GeneratedBalanceSheet;
});
</script>
