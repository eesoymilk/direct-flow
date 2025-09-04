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
        display-class="p-4 bg-gradient-to-r from-amber-50 via-amber-100 to-orange-50 rounded-lg border border-amber-200"
        v-bind="getFieldStatusProps('businessItemsDescription')"
      >
        <p class="text-base text-gray-800 leading-relaxed font-medium">
          {{ companyBusinessItems.businessItemsDescription }}
        </p>
        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="fieldStatuses.businessItemsDescription.isVerified"
            :has-issue="fieldStatuses.businessItemsDescription.hasIssue"
            field-path="company.businessItemsDescription"
            @verify="() => verifyField('businessItemsDescription')"
            @add-issue="addFieldIssue"
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
</script>
