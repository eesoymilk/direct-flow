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
      <!-- Business Items (Staff Input - First Review Only) -->
      <CompanyApplicationReviewUiFieldCard
        v-if="isFirstReviewRound"
        label="營業項目編碼"
        description="工作人員根據營業項目描述設定對應的營業項目編碼"
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
            <!-- Business Items Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                營業項目編碼 (多個項目請用逗號分隔)
              </label>
              <UTextarea
                v-model="businessItemsInput"
                @input="updateBusinessItems"
                placeholder="例如：F102050, F401010, ZZ99999..."
                :rows="3"
                class="w-full"
              />
              <p class="text-xs text-gray-500 mt-1">
                參考營業項目描述設定對應的標準營業項目編碼
              </p>
            </div>

            <!-- Current Items Display -->
            <div
              v-if="staffProvidedFields.businessItems.length > 0"
              class="space-y-2"
            >
              <label class="block text-sm font-medium text-gray-700">
                已設定項目 ({{ staffProvidedFields.businessItems.length }} 個)
              </label>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(item, index) in staffProvidedFields.businessItems"
                  :key="index"
                  class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2"
                >
                  <span class="text-sm font-medium text-gray-900">{{
                    item
                  }}</span>
                  <button
                    @click="removeBusinessItem(index)"
                    class="text-red-500 hover:text-red-700 ml-1"
                  >
                    <UIcon name="i-heroicons-x-mark" class="size-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Ignore option -->
            <div class="border-t pt-3 mt-4">
              <label
                class="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  v-model="ignoreBusinessItems"
                  @change="handleIgnoreBusinessItems"
                  class="text-yellow-600 focus:ring-yellow-500"
                />
                <div>
                  <span class="text-sm font-medium text-yellow-800"
                    >稍後處理</span
                  >
                  <p class="text-xs text-yellow-600 mt-1">
                    此欄位可於公司核准後再設定
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </CompanyApplicationReviewUiFieldCard>

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
import { COMPANY_BUSINESS_ITEMS_FIELDS } from "../constants";
import { useCompanyReview } from "./useCompanyReview";
import type { CompanyBusinessItemsField } from "../types";
import { useCompanyReviewSection } from "./useCompanyReviewSection";
import { useCompanyApplicationReviewStore } from "../useCompanyApplicationReviewStore";

const { companyBusinessItems } = useCompanyReview();

// Access review store for staff-provided fields and first review round detection
const reviewStore = useCompanyApplicationReviewStore();
const { staffProvidedFields, isFirstReviewRound } = storeToRefs(reviewStore);

// Local reactive data for business items management
const businessItemsInput = ref("");
const ignoreBusinessItems = ref(false);

// Convert array to comma-separated string for display
watchEffect(() => {
  if (
    staffProvidedFields.value.businessItems.length > 0 &&
    !ignoreBusinessItems.value
  ) {
    businessItemsInput.value =
      staffProvidedFields.value.businessItems.join(", ");
  }
});

// Update business items array from textarea input
const updateBusinessItems = () => {
  if (ignoreBusinessItems.value) return;

  const items = businessItemsInput.value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  staffProvidedFields.value.businessItems = items;
};

// Remove individual business item
const removeBusinessItem = (index: number) => {
  staffProvidedFields.value.businessItems.splice(index, 1);
  // Update the input field to reflect the change
  businessItemsInput.value = staffProvidedFields.value.businessItems.join(", ");
};

// Handle ignore checkbox
const handleIgnoreBusinessItems = () => {
  if (ignoreBusinessItems.value) {
    // Clear business items when ignoring
    staffProvidedFields.value.businessItems = [];
    businessItemsInput.value = "";
  }
};

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
