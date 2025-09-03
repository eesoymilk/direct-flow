<template>
  <CompanyApplicationReviewUiSectionCard
    title="公司基本資料"
    description="公司名稱、組織類型與營業地址"
    :is-open="isOpen"
    :section-border-class="sectionBorderClass"
    :status-icon="statusIcon"
    :status-icon-class="statusIconClass"
    :status-label="statusLabel"
    :status-badge-color="statusBadgeColor"
    @toggle="toggleSection"
  >
    <template #header-actions>
      <UDropdownMenu :items="quickActionItems">
        <UButton icon="i-lucide-more-vertical" variant="ghost" />
      </UDropdownMenu>
    </template>

    <CompanyApplicationReviewUiSectionSummary
      :issues-count="status.issueCount"
      :verified-count="status.verificationCount"
      :total-count="status.totalFields"
    />

    <!-- Field Review Cards -->
    <div class="grid gap-6 px-4">
      <!-- Company Names -->
      <CompanyApplicationReviewUiFieldCard
        label="公司預查名稱"
        v-bind="getFieldStatusProps('candidateNames')"
      >
        <template #default>
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
        </template>
        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="fieldStatuses.candidateNames.isVerified"
            @verify="() => handleVerifyField('candidateNames')"
            @report-issue="() => handleReportIssue('candidateNames')"
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
            @verify="() => handleVerifyField('organizationType')"
            @report-issue="() => handleReportIssue('organizationType')"
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
            @verify="() => handleVerifyField('address')"
            @report-issue="() => handleReportIssue('address')"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>
    </div>
  </CompanyApplicationReviewUiSectionCard>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import {
  type CompanyBasicInfoField,
  useCompanyReview,
} from "./useCompanyReview";

const {
  companyBasicInfo,
  basicInfoFieldStatuses: fieldStatuses,
  basicInfoSectionIsOpen: isOpen,
  verifyField,
  reportFieldIssue,
  toggleSection,
} = useCompanyReview();

// Filter fields for this section only
const basicInfoFields: CompanyBasicInfoField[] = [
  "candidateNames",
  "organizationType",
  "address",
];

// Section-specific status calculation
const status = computed(() => {
  const section = fieldStatuses.value;
  const sectionIssues = basicInfoFields.filter(
    (field) => section[field].hasIssue
  );
  const sectionVerifications = basicInfoFields.filter(
    (field) => section[field].isVerified
  );
  const criticalIssues = sectionIssues.filter(
    (field) => section[field].issue?.severity === "critical"
  );

  return {
    hasIssues: sectionIssues.length > 0,
    hasCriticalIssues: criticalIssues.length > 0,
    hasVerifications: sectionVerifications.length > 0,
    issueCount: sectionIssues.length,
    criticalIssueCount: criticalIssues.length,
    verificationCount: sectionVerifications.length,
    totalFields: basicInfoFields.length,
    isComplete:
      sectionVerifications.length === basicInfoFields.length &&
      sectionIssues.length === 0,
  };
});

const {
  sectionBorderClass,
  statusIcon,
  statusIconClass,
  statusBadgeColor,
  statusLabel,
} = useReviewSectionStatus(status);

const quickActionItems = computed((): DropdownMenuItem[] => [
  [
    {
      label: "驗證全部欄位",
      icon: "i-lucide-check-circle",
      color: "success",
      disabled: status.value.isComplete,
      onSelect: () => verifyAllBasicInfoFields(),
    },
    {
      label: "清除所有標記",
      icon: "i-lucide-eraser",
      color: "gray",
      disabled: !status.value.hasIssues && !status.value.hasVerifications,
      onSelect: () => clearAllBasicInfoMarkers(),
    },
    {
      label: "標記為已審核",
      icon: "i-lucide-eye-check",
      color: "primary",
      disabled: status.value.isComplete,
      onSelect: () => verifyAllBasicInfoFields(),
    },
  ],
]);

const handleVerifyField = (fieldKey: CompanyBasicInfoField) => {
  verifyField("companyBasicInfo", fieldKey);
};

const handleReportIssue = (fieldKey: CompanyBasicInfoField) => {
  reportFieldIssue(
    "companyBasicInfo",
    fieldKey,
    "clarification",
    "medium",
    "需要進一步確認此欄位"
  );
};

const verifyAllBasicInfoFields = () => {
  basicInfoFields.forEach((field) => verifyField("companyBasicInfo", field));
};

const clearAllBasicInfoMarkers = () => {
  // This would need to be implemented in the composable to clear specific fields only
  basicInfoFields.forEach((field) => {
    // TODO: implement clearFieldMarkers in composable
  });
};

// Helper function to get field status props
const getFieldStatusProps = (
  fieldKey: CompanyBasicInfoField
): {
  statusLabel: string;
  statusBadgeColor: "success" | "warning" | "neutral";
} => {
  const { isVerified, hasIssue } = fieldStatuses.value[fieldKey];
  return {
    statusLabel: isVerified ? "已驗證" : hasIssue ? "有問題" : "",
    statusBadgeColor: isVerified ? "success" : hasIssue ? "warning" : "neutral",
  };
};
</script>
