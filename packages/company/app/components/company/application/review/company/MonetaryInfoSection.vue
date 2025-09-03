<template>
  <CompanyApplicationReviewUiSectionCard
    title="資本與股份資訊"
    description="公司資本額、股份結構與金融資訊"
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
      <!-- Capital Information -->
      <CompanyApplicationReviewUiFieldCard
        label="資本資訊"
        v-bind="getFieldStatusProps('authorizedShares')"
      >
        <template #default>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Paid-up Capital -->
            <div
              class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2"
            >
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <h5 class="text-sm font-semibold text-emerald-800">
                  實收資本額
                </h5>
              </div>
              <p class="text-xl font-bold text-emerald-700">
                NT$
                {{
                  companyMonetaryInfo.authorizedShares?.toLocaleString() ||
                  "N/A"
                }}
              </p>
            </div>

            <!-- Share Information -->
            <div
              class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3"
            >
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h5 class="text-sm font-semibold text-blue-800">股份結構</h5>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-blue-700">授權股數</span>
                  <span class="font-semibold text-blue-900">
                    {{
                      companyMonetaryInfo.authorizedShares?.toLocaleString() ||
                      "N/A"
                    }}
                    股
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-blue-700">普通股</span>
                  <span class="font-semibold text-blue-900">
                    {{
                      companyMonetaryInfo.ordinaryShares?.toLocaleString() ||
                      "N/A"
                    }}
                    股
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-blue-700">特別股</span>
                  <span class="font-semibold text-blue-900">
                    {{
                      companyMonetaryInfo.preferredShares?.toLocaleString() ||
                      "0"
                    }}
                    股
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Financial Info -->
          <div
            v-if="companyMonetaryInfo.authorizedShares === 0"
            class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-info" class="w-4 h-4 text-yellow-600" />
              <span class="text-sm font-medium text-yellow-800"
                >此公司發行無票面金額股份</span
              >
            </div>
          </div>
        </template>

        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="fieldStatuses.authorizedShares.isVerified"
            @verify="() => handleVerifyField('authorizedShares')"
            @report-issue="() => handleReportIssue('authorizedShares')"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>
    </div>
  </CompanyApplicationReviewUiSectionCard>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import {
  COMPANY_MONETARY_INFO_FIELDS,
  type CompanyMonetaryInfoField,
  useCompanyReview,
} from "./useCompanyReview";

const {
  companyMonetaryInfo,
  monetaryInfoFieldStatuses: fieldStatuses,
  monetaryInfoSectionIsOpen: isOpen,
  verifyField,
  reportFieldIssue,
  toggleSection,
} = useCompanyReview();

const status = computed(() => {
  const section = fieldStatuses.value;
  const sectionIssues = COMPANY_MONETARY_INFO_FIELDS.filter(
    (field) => section[field].hasIssue
  );
  const sectionVerifications = COMPANY_MONETARY_INFO_FIELDS.filter(
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
    totalFields: COMPANY_MONETARY_INFO_FIELDS.length,
    isComplete:
      sectionVerifications.length === COMPANY_MONETARY_INFO_FIELDS.length &&
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
      label: "驗證資本資訊",
      icon: "i-lucide-check-circle",
      color: "success",
      disabled: status.value.isComplete,
      onSelect: () => verifyAllMonetaryFields(),
    },
    {
      label: "清除標記",
      icon: "i-lucide-eraser",
      color: "gray",
      disabled: !status.value.hasIssues && !status.value.hasVerifications,
      onSelect: () => clearAllMonetaryMarkers(),
    },
    {
      label: "標記為已審核",
      icon: "i-lucide-eye-check",
      color: "primary",
      disabled: status.value.isComplete,
      onSelect: () => verifyAllMonetaryFields(),
    },
  ],
]);

const handleVerifyField = (fieldKey: CompanyMonetaryInfoField) => {
  verifyField("companyMonetaryInfo", fieldKey);
};

const handleReportIssue = (fieldKey: CompanyMonetaryInfoField) => {
  reportFieldIssue(
    "companyMonetaryInfo",
    fieldKey,
    "clarification",
    "medium",
    "需要進一步確認此欄位"
  );
};

const verifyAllMonetaryFields = () => {
  COMPANY_MONETARY_INFO_FIELDS.forEach((field) =>
    verifyField("companyMonetaryInfo", field)
  );
};

const clearAllMonetaryMarkers = () => {
  // TODO: implement clearFieldMarkers in composable for specific fields
  COMPANY_MONETARY_INFO_FIELDS.forEach((field) => {
    // Clear markers logic
  });
};

// Helper function to get field status props
const getFieldStatusProps = (
  fieldKey: CompanyMonetaryInfoField
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
