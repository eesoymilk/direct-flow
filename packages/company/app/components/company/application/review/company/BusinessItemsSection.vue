<template>
  <CompanyApplicationReviewUiSectionCard
    title="營業項目"
    description="公司營業範圍與項目描述"
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
      <!-- Business Description -->
      <CompanyApplicationReviewUiFieldCard
        label="營業項目描述"
        v-bind="getFieldStatusProps('businessItemsDescription')"
      >
        <template #default>
          <div class="space-y-4">
            <!-- Main Description -->
            <div
              class="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
            >
              <h5 class="text-sm font-semibold text-amber-800 mb-2">
                營業項目內容
              </h5>
              <p class="text-base text-gray-800 leading-relaxed">
                {{ companyBusinessItems.businessItemsDescription }}
              </p>
            </div>

            <!-- Future: Business categories breakdown, codes, etc. -->
            <div class="text-xs text-gray-500 italic">
              * 未來此區塊將擴展為詳細的營業項目分類與代碼管理
            </div>
          </div>
        </template>
        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="fieldStatuses.businessItemsDescription.isVerified"
            @verify="() => handleVerifyField('businessItemsDescription')"
            @report-issue="() => handleReportIssue('businessItemsDescription')"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>
    </div>
  </CompanyApplicationReviewUiSectionCard>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import {
  type CompanyBusinessItemsField,
  useCompanyReview,
} from "./useCompanyReview";

const {
  companyBusinessItems,
  businessItemsFieldStatuses: fieldStatuses,
  businessItemsSectionIsOpen: isOpen,
  verifyField,
  reportFieldIssue,
  toggleSection,
} = useCompanyReview();

// Filter fields for this section only
const businessItemsFields: CompanyBusinessItemsField[] = [
  "businessItemsDescription",
];

// Section-specific status calculation
const status = computed(() => {
  const section = fieldStatuses.value;
  const sectionIssues = businessItemsFields.filter(
    (field) => section[field].hasIssue
  );
  const sectionVerifications = businessItemsFields.filter(
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
    totalFields: businessItemsFields.length,
    isComplete:
      sectionVerifications.length === businessItemsFields.length &&
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
      label: "驗證營業項目",
      icon: "i-lucide-check-circle",
      color: "success",
      disabled: status.value.isComplete,
      onSelect: () => verifyAllBusinessItemsFields(),
    },
    {
      label: "清除標記",
      icon: "i-lucide-eraser",
      color: "gray",
      disabled: !status.value.hasIssues && !status.value.hasVerifications,
      onSelect: () => clearAllBusinessItemsMarkers(),
    },
    {
      label: "標記為已審核",
      icon: "i-lucide-eye-check",
      color: "primary",
      disabled: status.value.isComplete,
      onSelect: () => verifyAllBusinessItemsFields(),
    },
  ],
]);

const handleVerifyField = (fieldKey: CompanyBusinessItemsField) => {
  verifyField("companyBusinessItems", fieldKey);
};

const handleReportIssue = (fieldKey: CompanyBusinessItemsField) => {
  reportFieldIssue(
    "companyBusinessItems",
    fieldKey,
    "clarification",
    "medium",
    "需要進一步確認此欄位"
  );
};

const verifyAllBusinessItemsFields = () => {
  businessItemsFields.forEach((field) =>
    verifyField("companyBusinessItems", field)
  );
};

const clearAllBusinessItemsMarkers = () => {
  // TODO: implement clearFieldMarkers in composable for specific fields
  businessItemsFields.forEach((field) => {
    // Clear markers logic
  });
};

// Helper function to get field status props
const getFieldStatusProps = (
  fieldKey: CompanyBusinessItemsField
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
