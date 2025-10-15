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
        選擇適當的財報模組，建構符合審計準則的財報
      </p>
      <UButton
        icon="i-lucide-shuffle"
        label="產生測試資料"
        color="neutral"
        variant="outline"
        size="sm"
        class="mt-4"
        @click="generateMockData"
      />
    </div>

    <div class="flex gap-4 md:gap-8 items-start">
      <!-- Left Panel: Global Info and Opinion Selection -->
      <div class="space-y-6 flex-1">
        <!-- Global Information Form -->
        <UCollapsible :ui="{ content: 'overflow-visible' }">
          <UButton
            class="group p-2 md:p-4 bg-primary-50 border-primary-200"
            variant="subtle"
            trailing-icon="i-lucide-chevron-down"
            :ui="{
              trailingIcon:
                'group-data-[state=open]:rotate-180 transition-transform duration-200',
            }"
            block
          >
            <template #leading>
              <div class="flex items-center gap-2 md:gap-4">
                <UIcon name="i-lucide-building-2" size="20" />
                <div class="flex flex-col items-start">
                  <span>基本資料</span>
                  <span class="text-xs text-gray-500">
                    填寫受查者基本資料
                  </span>
                </div>
              </div>
            </template>
          </UButton>
          <template #content>
            <UCard class="mt-2 md:mt-4">
              <UForm
                class="grid grid-cols-2 md:grid-cols-6 gap-4"
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

                <UFormField
                  name="isComparativeReport"
                  :class="
                    basicInfo.accountingFramework ===
                    'businessAccountingGuidelines'
                      ? 'col-span-2'
                      : 'col-span-4'
                  "
                >
                  <UCheckbox
                    v-model="basicInfo.isComparativeReport"
                    label="包含比較年份"
                  />
                </UFormField>

                <UFormField
                  name="isConsolidatedReport"
                  :class="
                    basicInfo.accountingFramework ===
                    'businessAccountingGuidelines'
                      ? 'col-span-2'
                      : 'col-span-4'
                  "
                >
                  <UCheckbox
                    v-model="basicInfo.isConsolidatedReport"
                    label="合併財報"
                  />
                </UFormField>

                <UFormField
                  name="useEquityMethodInvestment"
                  :class="
                    basicInfo.accountingFramework ===
                    'businessAccountingGuidelines'
                      ? 'col-span-2'
                      : 'col-span-4'
                  "
                >
                  <UCheckbox
                    v-model="basicInfo.useEquityMethodInvestment"
                    label="使用權益法投資"
                  />
                </UFormField>

                <UFormField
                  v-if="basicInfo.accountingFramework === 'IFRS'"
                  name="includeEmphasisOfMatterSection"
                  class="col-span-3"
                >
                  <UCheckbox
                    v-model="includeEmphasisOfMatterSection"
                    label="包含強調事項段"
                  />
                </UFormField>

                <UFormField
                  label="當期年份"
                  name="periodEnd"
                  required
                  class="col-span-full"
                >
                  <div class="gap-2 md:gap-4 flex justify-between items-center">
                    <span>民國</span>
                    <UInputNumber
                      v-model="basicInfo.currentRocYear"
                      class="flex-1"
                    />
                    <span>年</span>
                  </div>
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
                  label="會計師事務所地址"
                  name="firmAddress"
                  class="col-span-full"
                >
                  <UInput
                    v-model="basicInfo.firmAddress"
                    placeholder="請輸入會計師事務所地址（選填）"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  :label="
                    basicInfo.accountingFramework === 'IFRS'
                      ? '會計師姓名（一）'
                      : '會計師姓名'
                  "
                  name="auditorNames.0"
                  class="col-span-full"
                  required
                >
                  <UInput
                    v-model="basicInfo.auditorNames![0]"
                    placeholder="請輸入會計師姓名"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  v-if="basicInfo.accountingFramework === 'IFRS'"
                  label="會計師姓名（二）"
                  name="auditorNames.1"
                  class="col-span-full"
                  required
                >
                  <UInput
                    v-model="basicInfo.auditorNames![1]"
                    placeholder="請輸入第二位會計師姓名"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="報告日期"
                  name="reportDate"
                  class="col-span-full"
                  required
                >
                  <DatePicker
                    v-model="basicInfo.reportDate"
                    placeholder="請選擇報告日期"
                    class="w-full h-8"
                  />
                </UFormField>
              </UForm>
            </UCard>
          </template>
        </UCollapsible>

        <UCollapsible :ui="{ content: 'overflow-visible' }">
          <UButton
            class="group p-2 md:p-4 bg-primary-50 border-primary-200"
            variant="subtle"
            trailing-icon="i-lucide-chevron-down"
            :ui="{
              trailingIcon:
                'group-data-[state=open]:rotate-180 transition-transform duration-200',
            }"
            block
          >
            <template #leading>
              <div class="flex items-center gap-2 md:gap-4">
                <UIcon name="i-lucide-file-text" size="20" />
                <div class="flex flex-col items-start">
                  <span>查核意見</span>
                  <span class="text-xs text-gray-500">
                    選擇適當的查核意見類型並填寫其詳細資料
                  </span>
                </div>
              </div>
            </template>
          </UButton>
          <template #content>
            <UCard class="mt-2 md:mt-4">
              <div class="space-y-4">
                <AuditOpinionOrgChart />
                <UFormField
                  v-if="
                    opinionInfo.opinionType &&
                    opinionInfo.opinionType !== 'unqualified'
                  "
                  label="查核意見理由"
                  name="opinionType"
                  class="col-span-full"
                  required
                >
                  <UTextarea
                    v-model="opinionInfo.reason"
                    placeholder="請輸入查核意見理由"
                    class="w-full"
                  />
                </UFormField>
                <UCheckbox
                  v-model="includeOtherMatterSection"
                  label="包含其他事項段"
                />

                <URadioGroup
                  v-if="
                    includeOtherMatterSection && opinionInfo.otherMatterOption
                  "
                  v-model="opinionInfo.otherMatterOption.type"
                  :items="otherMatterOptions"
                  variant="card"
                  placeholder="其他事項選項"
                  class="w-full"
                  required
                />

                <UFormField
                  v-if="
                    includeOtherMatterSection &&
                    opinionInfo.otherMatterOption?.type ===
                      'previousReportHandledByOtherAuditor'
                  "
                  label="前次查核報告日期"
                  required
                >
                  <DatePicker
                    v-model="
                      opinionInfo.otherMatterOption.previousAuditReportDate
                    "
                    placeholder="請選擇前次查核報告日期"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  v-if="
                    includeOtherMatterSection &&
                    opinionInfo.otherMatterOption?.type ===
                      'previousReportHandledByOtherAuditor'
                  "
                  label="前次查核意見類型"
                  required
                >
                  <USelect
                    v-model="opinionInfo.otherMatterOption.previousOpinionType"
                    placeholder="請選擇前次查核意見類型"
                    class="w-full"
                    :items="[
                      {
                        label: '無保留意見',
                        value: 'unqualified',
                      },
                      {
                        label: '保留意見',
                        value: 'qualified',
                      },
                      {
                        label: '否定意見',
                        value: 'adverse',
                      },
                      {
                        label: '無法表示意見',
                        value: 'disclaimer',
                      },
                    ]"
                  />
                </UFormField>

                <UFormField
                  v-if="
                    includeOtherMatterSection &&
                    opinionInfo.otherMatterOption?.type === 'custom'
                  "
                  label="自定義其他事項"
                  required
                >
                  <UTextarea
                    v-model="opinionInfo.otherMatterOption.customDescription"
                    placeholder="請輸入自定義其他事項"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  v-if="
                    basicInfo.accountingFramework === 'IFRS' &&
                    opinionInfo.keyAuditMatterOption
                  "
                  label="關鍵查核事項段"
                  required
                >
                  <UTextarea
                    v-model="opinionInfo.keyAuditMatterOption.description"
                    placeholder="請輸入關鍵查核事項段"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  v-if="
                    basicInfo.accountingFramework === 'IFRS' &&
                    includeEmphasisOfMatterSection &&
                    opinionInfo.emphasisOfMatterOption
                  "
                  label="強調事項段"
                  required
                >
                  <UTextarea
                    v-model="opinionInfo.emphasisOfMatterOption.description"
                    placeholder="請輸入強調事項段"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </UCard>
          </template>
        </UCollapsible>
      </div>

      <!-- Right Panel: Preview -->
      <UCard class="sticky top-[90px] flex-1">
        <template #header>
          <div class="flex justify-between items-center">
            <h2
              class="text-xl font-semibold text-gray-900 flex items-center gap-2"
            >
              <UIcon name="i-lucide-eye" size="20" />
              財報預覽
            </h2>
            <USwitch v-model="highlightVariable" label="審查模式" />
          </div>
        </template>

        <div v-if="opinionInfo.opinionType" class="space-y-4">
          <div
            class="bg-white border-2 border-gray-200 rounded-lg p-6 min-h-96"
          >
            <!-- <AuditReportPreview :report-template="store.reportTemplate" /> -->
            <DocumentPreview :sections="sections" document-size="A4" />
          </div>
        </div>

        <div v-else class="text-center text-gray-500 py-12">
          <UIcon
            name="i-lucide-file-text"
            class="h-12 w-12 mx-auto mb-4 text-gray-300"
          />
          <p>請選擇查核意見類型以查看預覽</p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              icon="i-lucide-file-down"
              label="產生財報"
              color="primary"
              size="lg"
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
        </template>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { RadioGroupItem, SelectItem } from "@nuxt/ui";

const store = useAuditBuilderStore();
const {
  basicInfo,
  opinionInfo,
  includeOtherMatterSection,
  includeEmphasisOfMatterSection,
  highlightVariable,
} = storeToRefs(store);
const { generateMockData } = store;

const { sections } = useReportSections();

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

const otherMatterOptions = computed((): RadioGroupItem[] => [
  {
    label: "前年度未經查核",
    value: "missingPreviousAuditReport",
  },
  {
    label: "前次查核報告由其他會計師出具",
    value: "previousReportHandledByOtherAuditor",
  },
  {
    label: "自定義其他事項",
    value: "custom",
  },
]);

const generateReport = async () => {
  try {
    // TODO: Implement report generation
    console.log("Report generated and downloaded successfully");
  } catch (error) {
    console.error("Report generation failed:", error);
  }
};

const saveTemplate = async () => {
  try {
    // TODO: Implement template saving
  } catch (error) {
    console.error("Template saving failed:", error);
  }
};

useSeoMeta({
  title: "查核意見段建構器 - Direct Flow Audit",
  description: "建構符合審計準則的查核意見段，支援各種意見類型",
});
</script>
