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
              :state="basicInfo"
              :schema="basicInfoSchema"
            >
              <UFormField
                label="受查者名稱"
                name="entityName"
                class="col-span-full"
                required
              >
                <UInput
                  v-model="basicInfo.entityName"
                  placeholder="請輸入受查者名稱"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="期末日期" name="periodEnd" required>
                <UInputNumber :value="basicInfo.currentYear" class="w-full" />
              </UFormField>

              <UFormField name="hasComparativePeriod" class="col-span-full">
                <UCheckbox
                  v-model="hasComparativePeriod"
                  label="包含比較期間"
                />
              </UFormField>

              <UFormField
                v-if="hasComparativePeriod"
                label="比較期間期末"
                name="comparativeYear"
              >
                <UInputNumber
                  :value="basicInfo.comparativeYear"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="會計師事務所"
                name="firmName"
                class="col-span-full"
                required
              >
                <UInput
                  v-model="basicInfo.firmName"
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
                  v-model="basicInfo.auditorName"
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
                  v-model="basicInfo.accountingFramework"
                  :items="frameworkItems"
                  placeholder="選擇適用的會計架構"
                  class="w-full"
                />
              </UFormField>
            </UForm>
          </UCard>

          <AuditOpinionOrgChart />

          <!-- Opinion Details Form -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ opinionInfo.opinionType }} - 詳細設定
              </h3>
            </template>

            <div class="space-y-4">
              <!-- Conditional fields based on opinion type -->
              <div
                v-if="opinionInfo.opinionType === 'qualified'"
                class="space-y-4"
              >
                <UFormField label="保留意見原因">
                  <UTextarea
                    v-model="opinionInfo.reason"
                    placeholder="請描述導致保留意見的具體原因"
                    :rows="4"
                  />
                </UFormField>
                <UFormField label="影響金額 (如適用)">
                  <UInput
                    v-model="opinionInfo.materialAmount"
                    placeholder="請輸入金額"
                    type="number"
                  />
                </UFormField>
              </div>

              <div
                v-if="opinionInfo.opinionType === 'adverse'"
                class="space-y-4"
              >
                <UFormField label="否定意見原因">
                  <UTextarea
                    v-model="opinionInfo.reason"
                    placeholder="請描述導致否定意見的重大違反會計準則之情形"
                    :rows="4"
                  />
                </UFormField>
              </div>

              <div
                v-if="opinionInfo.opinionType === 'disclaimer'"
                class="space-y-4"
              >
                <UFormField label="無法表示意見原因">
                  <UTextarea
                    v-model="opinionInfo.reason"
                    placeholder="請描述導致查核範圍受到限制的原因"
                    :rows="4"
                  />
                </UFormField>
              </div>

              <div
                v-if="opinionInfo.opinionType === 'unqualified'"
                class="p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <UFormField label="無保留意見不需要額外的說明或修正事項">
                  <span class="text-sm text-green-700">
                    無保留意見不需要額外的說明或修正事項
                  </span>
                </UFormField>
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

            <div v-if="opinionInfo.opinionType" class="space-y-4">
              <div
                class="bg-white border-2 border-gray-200 rounded-lg p-6 min-h-96"
              >
                <AuditReportPreview />
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
              class="flex-1"
              @click="generateReport"
            />
            <UButton
              icon="i-lucide-save"
              label="儲存範本"
              color="neutral"
              variant="outline"
              size="lg"
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
const { basicInfo, opinionInfo, hasComparativePeriod } =
  storeToRefs(auditStore);
const { generateMockData } = auditStore;

const frameworkItems: SelectItem[] = [
  {
    label: "商業會計處理準則",
    value: "businessAccountingGuidelines",
  },
  {
    label: "國際財務報導準則 (IFRS)",
    value: "IFRS",
  },
];

const generateReport = async () => {
  // TODO: Implement report generation
};

const saveTemplate = () => {
  // TODO: Implement template saving
};

useSeoMeta({
  title: "查核意見段建構器 - Direct Flow Audit",
  description: "建構符合審計準則的查核意見段，支援各種意見類型",
});
</script>
