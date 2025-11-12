<template>
  <div class="space-y-6">
    <!-- Upload Section -->
    <ExcelFileUpload
      @upload="handleTableUpload"
      @error="handleUploadError"
    />

    <!-- Uploaded Tables List -->
    <div v-if="financialTables.length > 0" class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          已上傳的表格 ({{ financialTables.length }})
        </h2>
        <UButton
          icon="i-lucide-trash-2"
          label="清除全部"
          color="error"
          variant="outline"
          size="sm"
          @click="handleClearAll"
        />
      </div>

      <!-- Table Cards -->
      <div
        v-for="table in financialTables"
        :key="table.id"
        class="space-y-4"
      >
        <ExcelTablePreview
          :table="table"
          @update="handleTableUpdate"
          @delete="handleTableDelete"
        />

        <ExcelTableConfig
          :table="table"
          @update="handleTableUpdate"
        />
      </div>
    </div>

    <!-- Empty State -->
    <UCard v-else class="border-dashed">
      <div class="text-center py-12 text-gray-500">
        <UIcon name="i-lucide-table" class="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p class="text-lg font-medium mb-2">尚未上傳任何表格</p>
        <p class="text-sm">請從上方上傳 Excel 檔案以開始建構財報表格</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { FinancialTable } from "../../composables/stores/opinionBuilder";

const store = useOpinionBuilderStore();
const { financialTables } = storeToRefs(store);
const {
  addFinancialTable,
  updateFinancialTable,
  removeFinancialTable,
  clearAllFinancialTables,
} = store;

// Financial table handlers
const handleTableUpload = (table: FinancialTable) => {
  addFinancialTable(table);
};

const handleTableUpdate = (updatedTable: FinancialTable) => {
  updateFinancialTable(updatedTable.id, updatedTable);
};

const handleTableDelete = (tableId: string) => {
  removeFinancialTable(tableId);
};

const handleClearAll = () => {
  if (confirm('確定要清除所有已上傳的表格嗎？此操作無法復原。')) {
    clearAllFinancialTables();
  }
};

const handleUploadError = (errorMessage: string) => {
  console.error('Upload error:', errorMessage);
  // TODO: Show toast notification
};
</script>
