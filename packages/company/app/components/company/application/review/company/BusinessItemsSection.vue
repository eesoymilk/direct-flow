<template>
  <CompanyApplicationReviewUiSectionBase
    title="營業項目"
    description="公司營業範圍與項目描述"
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
            :has-issue="fieldStatuses.businessItemsDescription.hasIssue"
            field-path="company.businessItemsDescription"
            @verify="() => verifyField('businessItemsDescription')"
            @add-issue="submitIssue"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>
    </template>
  </CompanyApplicationReviewUiSectionBase>
</template>

<script setup lang="ts">
import {
  COMPANY_BUSINESS_ITEMS_FIELDS,
  type CompanyBusinessItemsField,
  useCompanyReview,
} from "./useCompanyReview";
import { useCompanyReviewSection } from "./useCompanyReviewSection";

const { companyBusinessItems } = useCompanyReview();

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
} = useCompanyReviewSection<CompanyBusinessItemsField>({
  sectionKey: "companyBusinessItems",
  fields: COMPANY_BUSINESS_ITEMS_FIELDS,
  sectionTitle: "營業項目",
  verifyAllLabel: "驗證營業項目",
  clearAllLabel: "清除標記",
  markReviewedLabel: "標記為已審核",
});

const submitIssue = (issue: ReviewIssueSchema) => {
  addFieldIssue(issue);
};
</script>
