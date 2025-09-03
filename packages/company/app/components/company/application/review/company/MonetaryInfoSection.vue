<template>
  <CompanyApplicationReviewUiSectionBase
    title="資本與股份資訊"
    description="公司資本額、股份結構與金融資訊"
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
      <!-- Authorized Shares -->
      <CompanyApplicationReviewUiFieldCard
        label="授權股數"
        :value="`${companyMonetaryInfo.authorizedShares?.toLocaleString() || 'N/A'} 股`"
        v-bind="getFieldStatusProps('authorizedShares')"
      >
        <template #default>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h5 class="text-sm font-semibold text-blue-800">授權股數詳情</h5>
            </div>
            <p class="text-xl font-bold text-blue-700">
              {{
                companyMonetaryInfo.authorizedShares?.toLocaleString() || "N/A"
              }}
              股
            </p>
            <p class="text-sm text-blue-600 mt-1">公司總授權發行股份數量</p>
          </div>
        </template>
        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="fieldStatuses.authorizedShares.isVerified"
            :has-issue="fieldStatuses.authorizedShares.hasIssue"
            field-path="company.authorizedShares"
            @verify="() => verifyField('authorizedShares')"
            @add-issue="submitIssue"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>

      <!-- Ordinary Shares -->
      <CompanyApplicationReviewUiFieldCard
        label="普通股"
        :value="`${companyMonetaryInfo.ordinaryShares?.toLocaleString() || 'N/A'} 股`"
        v-bind="getFieldStatusProps('ordinaryShares')"
      >
        <template #default>
          <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <h5 class="text-sm font-semibold text-emerald-800">普通股詳情</h5>
            </div>
            <p class="text-xl font-bold text-emerald-700">
              {{
                companyMonetaryInfo.ordinaryShares?.toLocaleString() || "N/A"
              }}
              股
            </p>
            <p class="text-sm text-emerald-600 mt-1">具有投票權的一般股份</p>
          </div>
        </template>
        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="fieldStatuses.ordinaryShares.isVerified"
            :has-issue="fieldStatuses.ordinaryShares.hasIssue"
            field-path="company.ordinaryShares"
            @verify="() => verifyField('ordinaryShares')"
            @add-issue="submitIssue"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>

      <!-- Preferred Shares -->
      <CompanyApplicationReviewUiFieldCard
        label="特別股"
        :value="`${companyMonetaryInfo.preferredShares?.toLocaleString() || '0'} 股`"
        v-bind="getFieldStatusProps('preferredShares')"
      >
        <template #default>
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
              <h5 class="text-sm font-semibold text-purple-800">特別股詳情</h5>
            </div>
            <p class="text-xl font-bold text-purple-700">
              {{ companyMonetaryInfo.preferredShares?.toLocaleString() || "0" }}
              股
            </p>
            <p class="text-sm text-purple-600 mt-1">具有特殊權利的優先股份</p>

            <!-- No preferred shares info -->
            <div
              v-if="
                !companyMonetaryInfo.preferredShares ||
                companyMonetaryInfo.preferredShares === 0
              "
              class="mt-3 p-2 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600"
            >
              此公司未發行特別股
            </div>
          </div>

          <!-- Additional info for no par value shares -->
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
            :is-verified="fieldStatuses.preferredShares.isVerified"
            :has-issue="fieldStatuses.preferredShares.hasIssue"
            field-path="company.preferredShares"
            @verify="() => verifyField('preferredShares')"
            @add-issue="submitIssue"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>
    </template>
  </CompanyApplicationReviewUiSectionBase>
</template>

<script setup lang="ts">
import {
  COMPANY_MONETARY_INFO_FIELDS,
  type CompanyMonetaryInfoField,
  useCompanyReview,
} from "./useCompanyReview";
import { useCompanyReviewSection } from "./useCompanyReviewSection";

const { companyMonetaryInfo } = useCompanyReview();

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
} = useCompanyReviewSection<CompanyMonetaryInfoField>({
  sectionKey: "companyMonetaryInfo",
  fields: COMPANY_MONETARY_INFO_FIELDS,
  sectionTitle: "資本與股份資訊",
  verifyAllLabel: "驗證資本資訊",
  clearAllLabel: "清除標記",
  markReviewedLabel: "標記為已審核",
});

const submitIssue = (issue: ReviewIssueSchema) => {
  addFieldIssue(issue);
};
</script>
