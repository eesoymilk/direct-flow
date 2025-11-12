<template>
  <div class="space-y-6">
    <!-- Upload Section -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">上傳財報 Excel 檔案</h3>
          <UButton
            v-if="hasData"
            label="清除資料"
            color="error"
            variant="ghost"
            icon="i-lucide-x"
            @click="handleClear"
          />
        </div>
      </template>

      <div class="space-y-4">
        <!-- File Upload -->
        <UFileUpload
          v-model="selectedFile"
          accept=".xlsx,.xls"
          icon="i-lucide-file-spreadsheet"
          label="拖曳檔案到此處或點擊選擇檔案"
          description="支援 .xlsx, .xls 格式 (需包含 TB 試算表工作表)"
          :disabled="isProcessing"
          class="min-h-48"
        >
          <template v-if="isProcessing" #default>
            <div
              class="flex flex-col items-center justify-center space-y-2 py-8"
            >
              <UIcon
                name="i-lucide-loader-circle"
                class="w-12 h-12 text-primary-500 animate-spin"
              />
              <p class="text-sm text-gray-600">解析中...</p>
            </div>
          </template>
        </UFileUpload>

        <!-- Error Display -->
        <UAlert
          v-if="store.error"
          color="error"
          variant="subtle"
          title="解析錯誤"
          :description="store.error"
        />

        <!-- Success Summary -->
        <div v-if="hasData && !store.error" class="space-y-3">
          <UAlert color="success" variant="subtle" title="檔案解析成功" />

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-xs text-gray-600 mb-1">試算表資料</p>
              <p class="text-2xl font-semibold">{{ store.tbData.length }}</p>
              <p class="text-xs text-gray-500">筆會計科目</p>
            </div>

            <div class="bg-blue-50 rounded-lg p-4">
              <p class="text-xs text-blue-700 mb-1">準備產生報表</p>
              <div class="flex items-center justify-center h-8">
                <UIcon
                  name="i-lucide-check-circle"
                  class="w-6 h-6 text-blue-600"
                />
              </div>
              <p class="text-xs text-blue-600">資產負債表</p>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Generation Section -->
    <UCard v-if="hasData && !store.error">
      <template #header>
        <h3 class="text-lg font-semibold">產生資產負債表</h3>
      </template>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">
              公司名稱 <span class="text-error-500">*</span>
            </label>
            <UInput v-model="companyName" placeholder="請輸入公司名稱" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">
              會計年度 (民國) <span class="text-error-500">*</span>
            </label>
            <UInput
              v-model.number="periodYear"
              type="number"
              placeholder="例: 113"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <UButton
            label="產生資產負債表"
            icon="i-lucide-file-spreadsheet"
            color="primary"
            :disabled="!canGenerate"
            :loading="isGenerating"
            @click="handleGenerate"
          />
        </div>

        <!-- Generated Balance Sheet Summary -->
        <div v-if="store.balanceSheet" class="mt-4">
          <UAlert
            color="success"
            variant="subtle"
            :title="`已成功產生 ${store.balanceSheet.metadata.companyName} ${store.balanceSheet.metadata.periodYear}年度資產負債表`"
          />

          <div class="mt-3">
            <div class="bg-blue-50 rounded-lg p-4 text-center">
              <p class="text-sm text-blue-700 font-medium mb-2">資產負債表</p>
              <p class="text-3xl font-bold text-blue-800">
                {{ store.balanceSheet.lineItems.length }}
              </p>
              <p class="text-sm text-blue-600 mt-1">項目</p>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useFinancialTransformerStore } from '../../../composables/stores/financialTransformer';

const store = useFinancialTransformerStore();
const selectedFile = ref<File | null>(null);
const isGenerating = ref(false);

// Form data
const companyName = ref("");
const periodYear = ref<number>(new Date().getFullYear() - 1911); // Default to current ROC year

// Computed
const isProcessing = computed(() => store.isProcessing);
const hasData = computed(() => store.tbData.length > 0);
const canGenerate = computed(
  () =>
    hasData.value &&
    companyName.value.trim().length > 0 &&
    periodYear.value > 0 &&
    !isGenerating.value
);

// Watch for file selection and process it
watch(selectedFile, async (file) => {
  if (file) {
    await processFile(file);
    // Reset to allow re-uploading the same file
    selectedFile.value = null;
  }
});

// Methods
const processFile = async (file: File) => {
  // Validate file type
  if (!file.name.match(/\.(xlsx|xls)$/i)) {
    // Note: error is readonly, so we can't set it directly
    // The store's uploadTBExcel will set the error
    return;
  }

  // Upload and parse TB file
  await store.uploadTBExcel(file);
};

const handleGenerate = () => {
  isGenerating.value = true;
  try {
    store.generateBS(
      companyName.value.trim(),
      periodYear.value
    );
  } finally {
    isGenerating.value = false;
  }
};

const handleClear = () => {
  store.clearData();
  companyName.value = "";
  periodYear.value = new Date().getFullYear() - 1911;
};
</script>
