<template>
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
          <div v-if="basicInfo.isComparativeReport" class="border-b pb-4">
            <label class="block text-sm font-medium mb-2"> 查核意見模式 </label>
            <URadioGroup
              v-model="opinionMode"
              :items="[
                { label: '相同意見（兩年度相同）', value: 'single' },
                { label: '不同意見（兩年度不同）', value: 'dual' },
              ]"
            />
          </div>

          <!-- Single Opinion Mode -->
          <template v-if="opinionMode === 'single' && singleOpinion">
            <AuditOpinionOrgChart />
            <UFormField
              v-if="shouldShowReasonField('single')"
              label="查核意見理由"
              name="opinion.reason"
              class="col-span-full"
              required
            >
              <UTextarea
                v-model="singleOpinion.reason"
                placeholder="請輸入查核意見理由"
                class="w-full"
                :rows="4"
              />
            </UFormField>
          </template>

          <!-- Dual Opinion Mode -->
          <template
            v-else-if="
              opinionMode === 'dual' &&
              dualOpinionCurrent &&
              dualOpinionComparative
            "
          >
            <!-- Year Tabs -->
            <UTabs v-model="selectedYearTab" :items="yearTabs" />

            <!-- Current Year Tab Content -->
            <div v-if="selectedYearTab === 'current'" class="space-y-4">
              <AuditOpinionOrgChart year-mode="current" />

              <UFormField
                v-if="shouldShowReasonField('dual-current')"
                label="查核意見理由"
                name="currentYearOpinion.reason"
                required
              >
                <UTextarea
                  v-model="dualOpinionCurrent.reason"
                  placeholder="請輸入當期查核意見理由"
                  class="w-full"
                  :rows="4"
                />
              </UFormField>
            </div>

            <!-- Comparative Year Tab Content -->
            <div v-else class="space-y-4">
              <AuditOpinionOrgChart year-mode="comparative" />

              <UFormField
                v-if="shouldShowReasonField('dual-comparative')"
                label="查核意見理由"
                name="comparativeYearOpinion.reason"
                required
              >
                <UTextarea
                  v-model="dualOpinionComparative.reason"
                  placeholder="請輸入比較期查核意見理由"
                  class="w-full"
                  :rows="4"
                />
              </UFormField>
            </div>

            <!-- Summary of Selected Opinions -->
            <div
              v-if="showOpinionSummary"
              class="border rounded-lg p-4 bg-primary-50 space-y-2"
            >
              <div class="font-semibold text-sm text-gray-700">
                已選擇的查核意見：
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">當期年度：</span>
                  <span class="font-medium">{{
                    getOpinionTypeLabel(dualOpinionCurrent.opinionType)
                  }}</span>
                </div>
                <div>
                  <span class="text-gray-600">比較期年度：</span>
                  <span class="font-medium">{{
                    getOpinionTypeLabel(dualOpinionComparative.opinionType)
                  }}</span>
                </div>
              </div>
              <div class="pt-2 border-t">
                <span class="text-gray-600 text-sm">報告標題：</span>
                <span class="font-semibold text-primary">{{
                  dualOpinionTitle
                }}</span>
              </div>
            </div>
          </template>

          <!-- Other Matter Section -->
          <UCheckbox
            v-model="includeOtherMatterSection"
            label="包含其他事項段"
          />

          <URadioGroup
            v-if="includeOtherMatterSection && opinionInfo.otherMatterOption"
            v-model="opinionInfo.otherMatterOption.type"
            :items="otherMatterOptions"
            variant="card"
            placeholder="其他事項選項"
            class="w-full"
            required
          />

          <UFormField
            v-if="
              showPreviousOpinionTypeField &&
              opinionInfo.otherMatterOption?.type ===
                'previousReportHandledByOtherAuditor'
            "
            name="otherMatterOption.previousOpinionType"
            label="前次查核意見類型"
            required
          >
            <USelect
              v-model="opinionInfo.otherMatterOption.previousOpinionType"
              placeholder="請選擇前次查核意見類型"
              class="w-full"
              :items="previousOpinionTypeItems"
            />
          </UFormField>

          <UFormField
            v-if="
              showPreviousOpinionTypeField &&
              opinionInfo.otherMatterOption?.type ===
                'previousReportHandledByOtherAuditor'
            "
            name="otherMatterOption.previousAuditReportDate"
            label="前次查核報告日期"
            required
          >
            <DatePicker
              v-model="opinionInfo.otherMatterOption.previousAuditReportDate"
              placeholder="請選擇報告日期"
              class="w-full h-8"
            />
          </UFormField>

          <UFormField
            v-if="
              showCustomOtherMatterField &&
              opinionInfo.otherMatterOption?.type === 'custom'
            "
            label="自定義其他事項"
            required
          >
            <UTextarea
              v-model="opinionInfo.otherMatterOption!.customDescription"
              placeholder="請輸入自定義其他事項"
              class="w-full"
            />
          </UFormField>

          <!-- Key Audit Matter Section (IFRS only) -->
          <UFormField
            v-if="showKeyAuditMatterField && opinionInfo.keyAuditMatterOption"
            label="關鍵查核事項段"
            required
          >
            <UTextarea
              v-model="opinionInfo.keyAuditMatterOption!.description"
              placeholder="請輸入關鍵查核事項段"
              class="w-full"
            />
          </UFormField>

          <!-- Emphasis of Matter Section (IFRS only) -->
          <UFormField
            v-if="
              showEmphasisOfMatterField && opinionInfo.emphasisOfMatterOption
            "
            label="強調事項段"
            required
          >
            <UTextarea
              v-model="opinionInfo.emphasisOfMatterOption!.description"
              placeholder="請輸入強調事項段"
              class="w-full"
            />
          </UFormField>
        </div>
      </UCard>
    </template>
  </UCollapsible>
</template>

<script setup lang="ts">
const store = useOpinionBuilderStore();
const {
  basicInfo,
  opinionInfo,
  includeOtherMatterSection,
  includeEmphasisOfMatterSection,
} = storeToRefs(store);

const { opinionMode, selectedYearTab, yearTabs } = useOpinionMode();
const { getOpinionTypeLabel, getDualOpinionTitle } = useOpinionHelpers();
const { otherMatterOptions, previousOpinionTypeItems } = useFormConfiguration();

// Typed computed refs to work around discriminated union limitations
const singleOpinion = computed(() =>
  opinionInfo.value.mode === "single" ? opinionInfo.value.opinion : null
);

const dualOpinionCurrent = computed(() =>
  opinionInfo.value.mode === "dual"
    ? opinionInfo.value.currentYearOpinion
    : null
);

const dualOpinionComparative = computed(() =>
  opinionInfo.value.mode === "dual"
    ? opinionInfo.value.comparativeYearOpinion
    : null
);

// Computed properties for conditional rendering
const shouldShowReasonField = (
  mode: "single" | "dual-current" | "dual-comparative"
) => {
  if (mode === "single") {
    return (
      opinionInfo.value.mode === "single" &&
      opinionInfo.value.opinion.opinionType &&
      opinionInfo.value.opinion.opinionType !== "unqualified"
    );
  }
  if (mode === "dual-current") {
    return (
      opinionInfo.value.mode === "dual" &&
      opinionInfo.value.currentYearOpinion.opinionType !== "unqualified"
    );
  }
  if (mode === "dual-comparative") {
    return (
      opinionInfo.value.mode === "dual" &&
      opinionInfo.value.comparativeYearOpinion.opinionType !== "unqualified"
    );
  }
  return false;
};

const showOpinionSummary = computed(() => {
  return (
    opinionInfo.value.mode === "dual" &&
    opinionInfo.value.currentYearOpinion.opinionType &&
    opinionInfo.value.comparativeYearOpinion.opinionType
  );
});

const showPreviousOpinionTypeField = computed(() => {
  return (
    includeOtherMatterSection.value &&
    opinionInfo.value.otherMatterOption?.type ===
      "previousReportHandledByOtherAuditor"
  );
});

const showCustomOtherMatterField = computed(() => {
  return (
    includeOtherMatterSection.value &&
    opinionInfo.value.otherMatterOption?.type === "custom"
  );
});

const showKeyAuditMatterField = computed(() => {
  return (
    basicInfo.value.accountingFramework === "IFRS" &&
    opinionInfo.value.keyAuditMatterOption
  );
});

const showEmphasisOfMatterField = computed(() => {
  return (
    basicInfo.value.accountingFramework === "IFRS" &&
    includeEmphasisOfMatterSection.value &&
    opinionInfo.value.emphasisOfMatterOption
  );
});

const dualOpinionTitle = computed(() => {
  if (opinionInfo.value.mode !== "dual") return "";
  return getDualOpinionTitle(
    opinionInfo.value.currentYearOpinion.opinionType,
    opinionInfo.value.comparativeYearOpinion.opinionType
  );
});
</script>
