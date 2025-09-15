<template>
  <UContainer>
    <div class="space-y-8 py-8">
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
          選擇適當的財報模組，建構符合審計準則的財報
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Left Panel: Global Info and Opinion Selection -->
        <div class="space-y-6">
          <!-- Global Information Form -->
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <Icon name="i-lucide-file-text" size="20" />
                  <h2 class="text-xl font-semibold text-gray-900">基本資料</h2>
                </div>
                <UButton
                  icon="i-lucide-shuffle"
                  label="產生測試資料"
                  color="neutral"
                  variant="subtle"
                  @click="generateMockData"
                />
              </div>
            </template>

            <UForm
              class="grid grid-cols-2 gap-4"
              :state="globalInfo"
              :schema="globalInfoSchema"
            >
              <UFormField
                label="受查者名稱"
                name="entityName"
                class="col-span-full"
                required
              >
                <UInput
                  v-model="globalInfo.entityName"
                  placeholder="請輸入受查者名稱"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="期末日期" name="periodEnd" required>
                <DatePicker
                  :value="globalInfo.periodEnd"
                  @select-date="
                    (date: Date) => updateGlobalInfo({ periodEnd: date })
                  "
                  empty-label="期末日期"
                />
              </UFormField>
              <UFormField label="期初日期" name="periodStart" required>
                <DatePicker
                  :value="globalInfo.periodStart"
                  @select-date="
                    (date: Date) => updateGlobalInfo({ periodStart: date })
                  "
                  empty-label="期初日期"
                />
              </UFormField>

              <UFormField
                name="hasComparativePeriod"
                class="col-span-full"
                required
              >
                <UCheckbox
                  v-model="hasComparativePeriod"
                  label="包含比較期間"
                  required
                />
              </UFormField>

              <UFormField
                v-if="hasComparativePeriod"
                label="比較期間期末"
                name="comparativePeriodEnd"
              >
                <DatePicker
                  :value="globalInfo.comparativePeriodEnd"
                  @select-date="
                    (date: Date) =>
                      updateGlobalInfo({
                        comparativePeriodEnd: date,
                      })
                  "
                  empty-label="比較期間期末"
                />
              </UFormField>
              <UFormField
                v-if="hasComparativePeriod"
                label="比較期間期初"
                name="comparativePeriodStart"
              >
                <DatePicker
                  :value="globalInfo.comparativePeriodStart"
                  @select-date="
                    (date: Date) =>
                      updateGlobalInfo({
                        comparativePeriodStart: date,
                      })
                  "
                  empty-label="比較期間期初"
                />
              </UFormField>

              <UFormField
                label="會計師事務所"
                name="firmName"
                class="col-span-full"
                required
              >
                <UInput
                  v-model="globalInfo.firmName"
                  placeholder="請輸入會計師事務所名稱"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="會計師姓名"
                name="auditorName"
                class="col-span-full"
                required
              >
                <UInput
                  v-model="globalInfo.auditorName"
                  placeholder="請輸入會計師姓名"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="適用會計架構"
                name="accountingFramework"
                class="col-span-full"
                required
              >
                <USelect
                  v-model="globalInfo.accountingFramework"
                  :items="frameworkItems"
                  placeholder="選擇適用的會計架構"
                  class="w-full"
                />
              </UFormField>
            </UForm>
          </UCard>

          <!-- Opinion Type Selection -->
          <UCard :class="{ 'opacity-50': !isGlobalInfoComplete }">
            <template #header>
              <h2 class="text-xl font-semibold text-gray-900">
                選擇查核意見類型
              </h2>
              <p
                v-if="!isGlobalInfoComplete"
                class="text-sm text-gray-500 mt-1"
              >
                請先完成基本資料填寫
              </p>
            </template>
          </UCard>

          <!-- Opinion Details Form -->
          <UCard v-if="selectedOpinion">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ selectedOpinionData?.title }} - 詳細設定
              </h3>
            </template>

            <div class="space-y-4">
              <!-- Conditional fields based on opinion type -->
              <div v-if="selectedOpinion === 'qualified'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    保留意見原因 *
                  </label>
                  <UTextarea
                    v-model="opinionSpecificData.qualificationReason"
                    placeholder="請描述導致保留意見的具體原因"
                    :rows="4"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    影響金額 (如適用)
                  </label>
                  <UInput
                    v-model="opinionSpecificData.materialAmount"
                    placeholder="請輸入金額"
                    type="number"
                  />
                </div>
              </div>

              <div v-if="selectedOpinion === 'adverse'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    否定意見原因 *
                  </label>
                  <UTextarea
                    v-model="opinionSpecificData.adverseReason"
                    placeholder="請描述導致否定意見的重大違反會計準則之情形"
                    :rows="4"
                  />
                </div>
              </div>

              <div v-if="selectedOpinion === 'disclaimer'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    無法表示意見原因 *
                  </label>
                  <UTextarea
                    v-model="opinionSpecificData.disclaimerReason"
                    placeholder="請描述導致查核範圍受到限制的原因"
                    :rows="4"
                  />
                </div>
              </div>

              <div
                v-if="selectedOpinion === 'unqualified'"
                class="p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-check-circle"
                    class="h-5 w-5 text-green-600"
                  />
                  <span class="text-sm text-green-700">
                    無保留意見不需要額外的說明或修正事項
                  </span>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Right Panel: Preview -->
        <div class="space-y-6">
          <UCard>
            <template #header>
              <h2
                class="text-xl font-semibold text-gray-900 flex items-center gap-2"
              >
                <UIcon name="i-lucide-eye" size="20" />
                財報預覽
              </h2>
            </template>

            <div v-if="selectedOpinion" class="space-y-4">
              <div
                class="bg-white border-2 border-gray-200 rounded-lg p-6 min-h-96"
              >
                <AuditOpinionPreview
                  :opinion-type="selectedOpinion"
                  :opinion-data="combinedOpinionData"
                />
              </div>
            </div>

            <div v-else class="text-center text-gray-500 py-12">
              <UIcon
                name="i-lucide-file-text"
                class="h-12 w-12 mx-auto mb-4 text-gray-300"
              />
              <p>請選擇查核意見類型以查看預覽</p>
            </div>
          </UCard>

          <!-- Actions -->
          <div class="flex gap-4">
            <UButton
              icon="i-lucide-file-down"
              label="產生財報"
              color="primary"
              size="lg"
              :disabled="!selectedOpinion"
              class="flex-1"
              @click="generateReport"
            />
            <UButton
              icon="i-lucide-save"
              label="儲存範本"
              color="neutral"
              variant="outline"
              size="lg"
              :disabled="!selectedOpinion"
              @click="saveTemplate"
            />
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";

const auditStore = useAuditBuilderStore();
const {
  globalInfo,
  combinedOpinionData,
  opinionSpecificData,
  selectedOpinion,
  hasComparativePeriod,
  isGlobalInfoComplete,
  opinionTypes,
  selectedOpinionData,
} = storeToRefs(auditStore);
const { generateMockData, updateGlobalInfo, selectOpinion } = auditStore;

const frameworkItems: SelectItem[] = [
  {
    label: "商業會計處理準則",
    value: "businessAccountingGuidelines",
  },
  { label: "國際財務報導準則 (IFRS)", value: "IFRS" },
];

const generateReport = async () => {
  if (!selectedOpinion) return;

  try {
    const reportData = {
      ...combinedOpinionData.value,
      materialAmount: opinionSpecificData.value.materialAmount
        ? parseInt(opinionSpecificData.value.materialAmount)
        : undefined,
      // Ensure dates are properly handled and required fields are present
      entityName: globalInfo.value.entityName || "",
      periodStart: globalInfo.value.periodStart || new Date(),
      periodEnd: globalInfo.value.periodEnd || new Date(),
      reportDate: globalInfo.value.reportDate || new Date(),
      firmName: globalInfo.value.firmName || "",
      auditorName: globalInfo.value.auditorName || "",
      accountingFramework: globalInfo.value.accountingFramework as
        | "businessAccountingGuidelines"
        | "IFRS",
    };

    const blob = await generateAuditDocxBlob(reportData);

    // Download the file
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-report-${reportData.entityName}-${reportData.periodEnd.getFullYear()}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating report:", error);
  }
};

const saveTemplate = () => {
  // TODO: Implement template saving
  console.log("Saving template:", {
    opinionType: selectedOpinion,
    globalInfo: globalInfo,
    opinionSpecificData: opinionSpecificData,
  });
};

useSeoMeta({
  title: "查核意見段建構器 - Direct Flow Audit",
  description: "建構符合審計準則的查核意見段，支援各種意見類型",
});
</script>
