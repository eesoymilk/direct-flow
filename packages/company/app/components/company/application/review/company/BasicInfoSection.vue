<template>
  <CompanyApplicationReviewUiSectionBase
    title="公司基本資料"
    description="公司名稱、組織類型與營業地址"
    :is-open="sectionIsOpen"
    :section-border-class="sectionBorderClass"
    :status-icon="statusIcon"
    :status-icon-class="statusIconClass"
    :status-label="statusLabel"
    :status-badge-color="statusBadgeColor"
    :status="status"
    :field-statuses="fieldStatuses"
    :quick-action-items="quickActionItems"
    @toggle="handleToggleSection"
  >
    <template #default>
      <!-- Chosen Name (Staff Input - First Review Only) -->
      <CompanyApplicationReviewUiFieldCard
        v-if="isFirstReviewRound"
        label="選定公司名稱"
        description="工作人員從候選名稱中選擇或輸入新名稱"
        display-class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4"
      >
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-user-circle"
              class="size-5 text-blue-600"
            />
            <span class="text-sm font-medium text-blue-800">工作人員輸入</span>
          </div>

          <div class="space-y-3">
            <!-- Select from candidate names or custom input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                選擇或輸入公司名稱
              </label>
              <USelect
                v-model="staffProvidedFields.chosenName"
                :items="chosenNameSelectItems"
                placeholder="選擇候選名稱或輸入自定義名稱..."
                class="w-full"
                searchable
                creatable
              />
              <p class="text-xs text-gray-500 mt-1">
                可從候選名稱選擇，或輸入自定義名稱，或選擇「稍後處理」
              </p>
            </div>
          </div>

          <!-- Current selection display -->
          <div
            v-if="showSelectionStatus"
            class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-check-circle"
                class="size-4 text-green-600"
              />
              <span class="text-sm font-medium text-green-800">
                已選擇：{{ chosenNameDisplayText }}
              </span>
            </div>
          </div>
        </div>
      </CompanyApplicationReviewUiFieldCard>

      <!-- Company Names -->
      <CompanyApplicationReviewUiFieldCard
        label="公司預查名稱"
        v-bind="getFieldStatusProps('candidateNames')"
      >
        <div class="space-y-3">
          <div
            v-for="(name, index) in companyBasicInfo.candidateNames"
            :key="index"
            class="group flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl border border-indigo-200 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div
              class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-md"
            >
              {{ index + 1 }}
            </div>
            <span
              class="text-base font-semibold text-gray-900 group-hover:text-indigo-900 transition-colors duration-200"
            >
              {{ name }}
            </span>
          </div>
        </div>
        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="fieldStatuses.candidateNames.isVerified"
            :has-issue="fieldStatuses.candidateNames.hasIssue"
            field-path="company.candidateNames"
            @verify="() => verifyField('candidateNames')"
            @add-issue="addFieldIssue"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>

      <!-- Organization Type -->
      <CompanyApplicationReviewUiFieldCard
        label="組織類型"
        :value="getOrganizationTypeLabel(companyBasicInfo.organizationType)"
        v-bind="getFieldStatusProps('organizationType')"
      >
        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="fieldStatuses.organizationType.isVerified"
            :has-issue="fieldStatuses.organizationType.hasIssue"
            field-path="company.organizationType"
            @verify="() => verifyField('organizationType')"
            @add-issue="addFieldIssue"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>

      <!-- Business Address -->
      <CompanyApplicationReviewUiFieldCard
        label="營業地址"
        :value="companyBasicInfo.address"
        v-bind="getFieldStatusProps('address')"
      >
        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="fieldStatuses.address.isVerified"
            :has-issue="fieldStatuses.address.hasIssue"
            field-path="company.address"
            @verify="() => verifyField('address')"
            @add-issue="addFieldIssue"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>

      <!-- Capital Amount -->
      <CompanyApplicationReviewUiFieldCard
        label="資本額"
        :value="`NT$ ${companyBasicInfo.capitalAmount?.toLocaleString() || 'N/A'}`"
        display-class="bg-amber-50 border border-amber-200 rounded-lg p-4"
        v-bind="getFieldStatusProps('capitalAmount')"
      >
        <div class="flex items-center gap-2 mb-3">
          <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
          <h5 class="text-sm font-semibold text-amber-800">資本額詳情</h5>
        </div>
        <p class="text-xl font-bold text-amber-700">
          NT$
          {{ companyBasicInfo.capitalAmount?.toLocaleString() || "N/A" }}
        </p>
        <p class="text-sm text-amber-600 mt-1">公司註冊登記的資本總額</p>
        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="fieldStatuses.capitalAmount.isVerified"
            :has-issue="fieldStatuses.capitalAmount.hasIssue"
            field-path="company.capitalAmount"
            @verify="() => verifyField('capitalAmount')"
            @add-issue="addFieldIssue"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>
    </template>
  </CompanyApplicationReviewUiSectionBase>
</template>

<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";
import {
  type CompanyBasicInfoField,
  COMPANY_BASIC_INFO_FIELDS,
  useCompanyReview,
} from "./useCompanyReview";
import { useCompanyReviewSection } from "./useCompanyReviewSection";

const { companyBasicInfo } = useCompanyReview();

// Access review store for staff-provided fields and first review round detection
const reviewStore = useCompanyApplicationReviewStore();
const { staffProvidedFields, isFirstReviewRound } = storeToRefs(reviewStore);

// Create select items for chosen name dropdown
const chosenNameSelectItems = computed(() => {
  const items: SelectItem[] = [];

  // Add candidate names as options
  companyBasicInfo.value.candidateNames.forEach((name) => {
    items.push({
      label: name,
      value: name,
      disabled: false,
    });
  });

  // Add "Handle Later" option
  items.push({
    label: "稍後處理 (公司核准後再設定)",
    value: "",
    disabled: false,
  });

  return items;
});

// Get display text for the current selection
const chosenNameDisplayText = computed(() => {
  return staffProvidedFields.value.chosenName === ""
    ? "稍後處理"
    : staffProvidedFields.value.chosenName;
});

// Show selection status when user has interacted with the select
const showSelectionStatus = computed(() => {
  // Show when there's a non-empty value OR when explicitly set to empty string (meaning "Handle Later" was chosen)
  return staffProvidedFields.value.chosenName !== "";
});

const {
  sectionIsOpen,
  fieldStatuses,
  status,
  sectionBorderClass,
  statusIcon,
  statusIconClass,
  statusBadgeColor,
  statusLabel,
  quickActionItems,
  addFieldIssue,
  verifyField,
  handleToggleSection,
  getFieldStatusProps,
} = useCompanyReviewSection<CompanyBasicInfoField>({
  sectionKey: "companyBasicInfo",
  fields: COMPANY_BASIC_INFO_FIELDS,
  sectionTitle: "公司基本資料",
  verifyAllLabel: "驗證全部欄位",
  clearAllLabel: "清除所有標記",
  markReviewedLabel: "標記為已審核",
});
</script>
