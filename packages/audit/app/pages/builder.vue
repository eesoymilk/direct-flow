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

              <UFormField name="hasComparativePeriod" class="col-span-full">
                <UCheckbox
                  v-model="hasComparativePeriod"
                  label="包含比較年份"
                />
              </UFormField>

              <UFormField
                v-if="hasComparativePeriod"
                label="比較年份"
                name="comparativeRocYear"
                class="col-span-full"
              >
                <div class="gap-2 md:gap-4 flex justify-between items-center">
                  <span>民國</span>
                  <UInputNumber
                    v-model="basicInfo.comparativeRocYear"
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

          <UCard v-if="opinionInfo.opinionType !== 'unqualified'">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">
                查核意見之基礎
              </h3>
            </template>

            <div class="space-y-4">
              <UFormField
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
            </div>
          </UCard>

          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">其他事項段</h3>
            </template>

            <div class="space-y-4">
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
              />

              <UFormField
                v-if="
                  includeOtherMatterSection &&
                  opinionInfo.otherMatterOption?.type ===
                    'previousReportHandledByOtherAuditor'
                "
                label="前次查核報告日期"
              >
                <DatePicker
                  v-model="
                    opinionInfo.otherMatterOption.previousAuditReportDate
                  "
                  placeholder="請選擇前次查核報告日期"
                  class="w-full"
                />
              </UFormField>
            </div>
          </UCard>
        </div>

        <!-- Right Panel: Preview -->
        <div class="space-y-6">
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h2
                  class="text-xl font-semibold text-gray-900 flex items-center gap-2"
                >
                  <UIcon name="i-lucide-eye" size="20" />
                  財報預覽
                </h2>
              </div>
            </template>

            <div v-if="opinionInfo.opinionType" class="space-y-4">
              <div
                class="bg-white border-2 border-gray-200 rounded-lg p-6 min-h-96"
              >
                <!-- <AuditReportPreview :report-template="store.reportTemplate" /> -->
                <DocumentPreview :sections="sections" />
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
import type { RadioGroupItem, SelectItem } from "@nuxt/ui";

// Use the consolidated Pinia store
const store = useAuditBuilderStore();

const { sections } = useReportSections();

// Destructure needed values
const {
  basicInfo,
  opinionInfo,
  hasComparativePeriod,
  includeOtherMatterSection,
} = storeToRefs(store);

const { generateMockData } = store;

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
  // TODO: Add correct description
  {
    label: "前次查核報告由其他會計師出具",
    value: "previousReportHandledByOtherAuditor",
  },
  {
    label: "缺漏前次查核報告",
    value: "missingPreviousAuditReport",
  },
]);

const generateReport = async () => {
  try {
    // Send form data to server for document generation
    // const response = await $fetch("/api/audit/generate-report", {
    //   method: "POST",
    //   body: {},
    //   responseType: "blob",
    // });

    // Create download link from server response
    // const url = URL.createObjectURL(response);
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = `查核報告_${entityLabel}_${new Date().toISOString().split("T")[0]}.docx`;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);

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
