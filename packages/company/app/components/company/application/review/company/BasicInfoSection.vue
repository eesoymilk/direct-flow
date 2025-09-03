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
            :has-issue="fieldStatuses.candidateNames.hasIssue"
            field-path="company.candidateNames"
            @verify="() => verifyField('candidateNames')"
            @add-issue="submitIssue"
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
            @add-issue="submitIssue"
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
            @add-issue="submitIssue"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>

      <!-- Capital Amount -->
      <CompanyApplicationReviewUiFieldCard
        label="資本額"
        :value="`NT$ ${companyBasicInfo.capitalAmount?.toLocaleString() || 'N/A'}`"
        v-bind="getFieldStatusProps('capitalAmount')"
      >
        <template #default>
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
              <h5 class="text-sm font-semibold text-amber-800">資本額詳情</h5>
            </div>
            <p class="text-xl font-bold text-amber-700">
              NT$
              {{ companyBasicInfo.capitalAmount?.toLocaleString() || "N/A" }}
            </p>
            <p class="text-sm text-amber-600 mt-1">公司註冊登記的資本總額</p>
          </div>
        </template>
        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="fieldStatuses.capitalAmount.isVerified"
            :has-issue="fieldStatuses.capitalAmount.hasIssue"
            field-path="company.capitalAmount"
            @verify="() => verifyField('capitalAmount')"
            @add-issue="submitIssue"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>
    </template>
  </CompanyApplicationReviewUiSectionBase>
</template>

<script setup lang="ts">
import {
  type CompanyBasicInfoField,
  COMPANY_BASIC_INFO_FIELDS,
  useCompanyReview,
} from "./useCompanyReview";
import { useCompanyReviewSection } from "./useCompanyReviewSection";

const { companyBasicInfo } = useCompanyReview();

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

const submitIssue = (issue: ReviewIssueSchema) => {
  addFieldIssue(issue);
};
</script>
