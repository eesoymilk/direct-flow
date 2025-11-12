<template>
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
            <div class="space-y-6">
              <!-- Opinion Mode Toggle (only for comparative reports) -->
              <div
                v-if="basicInfo.isComparativeReport"
                class="border-b pb-4"
              >
                <label class="block text-sm font-medium mb-2">
                  查核意見模式
                </label>
                <URadioGroup
                  v-model="opinionMode"
                  :items="[
                    { label: '相同意見（兩年度相同）', value: 'single' },
                    { label: '不同意見（兩年度不同）', value: 'dual' },
                  ]"
                />
              </div>

              <!-- Single Opinion Mode -->
              <template v-if="opinionMode === 'single'">
                <AuditOpinionOrgChart />
                <UFormField
                  v-if="
                    opinionInfo.mode === 'single' &&
                    opinionInfo.opinion.opinionType &&
                    opinionInfo.opinion.opinionType !== 'unqualified'
                  "
                  label="查核意見理由"
                  name="opinion.reason"
                  class="col-span-full"
                  required
                >
                  <UTextarea
                    v-model="opinionInfo.opinion.reason"
                    placeholder="請輸入查核意見理由"
                    class="w-full"
                    :rows="4"
                  />
                </UFormField>
              </template>

              <!-- Dual Opinion Mode -->
              <template v-else>
                <!-- Year Tabs -->
                <UTabs v-model="selectedYearTab" :items="yearTabs" />

                <!-- Tab Content -->
                <div v-if="selectedYearTab === 'current'" class="space-y-4">
                  <AuditOpinionOrgChart year-mode="current" />

                  <UFormField
                    v-if="
                      opinionInfo.mode === 'dual' &&
                      opinionInfo.currentYearOpinion.opinionType !==
                        'unqualified'
                    "
                    label="查核意見理由"
                    name="currentYearOpinion.reason"
                    required
                  >
                    <UTextarea
                      v-model="opinionInfo.currentYearOpinion.reason"
                      placeholder="請輸入當期查核意見理由"
                      class="w-full"
                      :rows="4"
                    />
                  </UFormField>
                </div>

                <div v-else class="space-y-4">
                  <AuditOpinionOrgChart year-mode="comparative" />

                  <UFormField
                    v-if="
                      opinionInfo.mode === 'dual' &&
                      opinionInfo.comparativeYearOpinion.opinionType !==
                        'unqualified'
                    "
                    label="查核意見理由"
                    name="comparativeYearOpinion.reason"
                    required
                  >
                    <UTextarea
                      v-model="opinionInfo.comparativeYearOpinion.reason"
                      placeholder="請輸入比較期查核意見理由"
                      class="w-full"
                      :rows="4"
                    />
                  </UFormField>
                </div>

                <!-- Summary of Selected Opinions -->
                <div
                  v-if="
                    opinionInfo.mode === 'dual' &&
                    opinionInfo.currentYearOpinion.opinionType &&
                    opinionInfo.comparativeYearOpinion.opinionType
                  "
                  class="border rounded-lg p-4 bg-primary-50 space-y-2"
                >
                  <div class="font-semibold text-sm text-gray-700">
                    已選擇的查核意見：
                  </div>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-600">當期年度：</span>
                      <span class="font-medium">{{
                        getOpinionTypeLabel(
                          opinionInfo.currentYearOpinion.opinionType
                        )
                      }}</span>
                    </div>
                    <div>
                      <span class="text-gray-600">比較期年度：</span>
                      <span class="font-medium">{{
                        getOpinionTypeLabel(
                          opinionInfo.comparativeYearOpinion.opinionType
                        )
                      }}</span>
                    </div>
                  </div>
                  <div class="pt-2 border-t">
                    <span class="text-gray-600 text-sm">報告標題：</span>
                    <span class="font-semibold text-primary">{{
                      getDualOpinionTitle()
                    }}</span>
                  </div>
                </div>
              </template>

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

      <div
        v-if="
          (opinionInfo.mode === 'single' &&
            opinionInfo.opinion.opinionType) ||
          (opinionInfo.mode === 'dual' &&
            opinionInfo.currentYearOpinion.opinionType &&
            opinionInfo.comparativeYearOpinion.opinionType)
        "
        class="space-y-4"
      >
        <div
          class="bg-white border-2 border-gray-200 rounded-lg p-6 min-h-96"
        >
          <DocumentPreview :sections="sections" document-size="A4" />
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-12">
        <UIcon
          name="i-lucide-file-text"
          class="h-12 w-12 mx-auto mb-4 text-gray-300"
        />
        <p>
          {{
            opinionMode === "dual"
              ? "請為兩個年度選擇查核意見類型以查看預覽"
              : "請選擇查核意見類型以查看預覽"
          }}
        </p>
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
</template>

<script setup lang="ts">
import type { RadioGroupItem, SelectItem } from "@nuxt/ui";
import type { OpinionType } from "#shared/types/audit-report";

const store = useOpinionBuilderStore();
const {
  basicInfo,
  opinionInfo,
  includeOtherMatterSection,
  includeEmphasisOfMatterSection,
  highlightVariable,
} = storeToRefs(store);

const { sections } = useReportSections();

// Year tab state for dual opinion mode
const selectedYearTab = ref<'current' | 'comparative'>('current');

// Year tabs configuration
const yearTabs = computed(() => [
  {
    label: `當期年度 (民國${basicInfo.value.currentRocYear || '___'}年)`,
    value: 'current',
    icon: 'i-lucide-calendar',
  },
  {
    label: `比較期年度 (民國${basicInfo.value.currentRocYear ? basicInfo.value.currentRocYear - 1 : '___'}年)`,
    value: 'comparative',
    icon: 'i-lucide-calendar-clock',
  },
]);

// Opinion mode state (synced with store)
const opinionMode = computed<'single' | 'dual'>({
  get: () => opinionInfo.value.mode,
  set: (mode) => {
    if (mode === 'single') {
      opinionInfo.value = {
        mode: 'single',
        opinion: {
          year: basicInfo.value.currentRocYear || 0,
          opinionType: 'unqualified',
        },
      };
    } else {
      opinionInfo.value = {
        mode: 'dual',
        currentYearOpinion: {
          year: basicInfo.value.currentRocYear || 0,
          opinionType: 'unqualified',
        },
        comparativeYearOpinion: {
          year: (basicInfo.value.currentRocYear || 1) - 1,
          opinionType: 'unqualified',
        },
      };
    }
  },
});

// Helper to get opinion type label
const getOpinionTypeLabel = (type: OpinionType | 'qualified'): string => {
  const labels: Record<OpinionType | 'qualified', string> = {
    unqualified: '無保留意見',
    qualified: '保留意見',
    qualifiedDisclaimer: '保留意見',
    qualifiedAdverse: '保留意見',
    adverse: '否定意見',
    disclaimer: '無法表示意見',
  };
  return labels[type];
};

// Helper to get simplified opinion type
const getSimplifiedOpinionType = (type: OpinionType): OpinionType | 'qualified' => {
  if (type === 'qualifiedDisclaimer' || type === 'qualifiedAdverse') {
    return 'qualified';
  }
  return type;
};

// Helper to get dual opinion title preview
const getDualOpinionTitle = (): string => {
  if (opinionInfo.value.mode !== 'dual') return '';

  const current = getSimplifiedOpinionType(opinionInfo.value.currentYearOpinion.opinionType);
  const comparative = getSimplifiedOpinionType(opinionInfo.value.comparativeYearOpinion.opinionType);

  // If both opinions are the same, return single opinion title
  if (current === comparative) {
    return getOpinionTypeLabel(current);
  }

  // Otherwise, combine both opinion titles
  const sorted = [current, comparative].sort() as [OpinionType | 'qualified', OpinionType | 'qualified'];
  return `${getOpinionTypeLabel(sorted[0])}及${getOpinionTypeLabel(sorted[1])}`;
};

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
</script>
