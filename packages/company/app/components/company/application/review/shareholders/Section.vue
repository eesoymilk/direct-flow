<template>
  <CompanyApplicationReviewShareholdersSectionBase
    title="股東資料"
    description="股東的基本資料及持股資訊"
    empty-state-message="尚無股東資料"
    :is-open="sectionIsOpen"
    :shareholders-count="shareholders.length"
    :aggregate-status="status"
    :quick-action-items="quickActionItems"
    @toggle="handleToggleSection"
  >
    <div
      v-for="(shareholder, index) in shareholders"
      :key="shareholder.id"
      class="border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200"
    >
      <!-- Collapsible Header -->
      <div
        class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        @click="toggleShareholderExpanded(index)"
      >
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-user" class="w-5 h-5 text-blue-500" />
          <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <h4 class="font-medium text-gray-900">
              股東 {{ index + 1
              }}{{
                shareholder.person.name ? ` - ${shareholder.person.name}` : ""
              }}
            </h4>
            <div class="flex gap-2 mt-1 sm:mt-0">
              <UBadge
                v-if="shareholder.person.idNumber"
                :label="shareholder.person.idNumber"
                color="neutral"
                variant="subtle"
                size="sm"
              />
              <UBadge
                v-if="shareholder.shares !== undefined"
                :label="`${shareholder.shares.toLocaleString()} 股`"
                color="info"
                variant="subtle"
                size="sm"
              />
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Status badges for quick overview -->
          <div class="flex gap-1">
            <UBadge
              v-if="getShareholderOverallStatus(index).hasVerified"
              label="✓"
              color="success"
              variant="subtle"
              size="sm"
            />
            <UBadge
              v-if="getShareholderOverallStatus(index).hasIssues"
              label="!"
              color="warning"
              variant="subtle"
              size="sm"
            />
          </div>
          <UIcon
            :name="
              expandedShareholders[index]
                ? 'i-lucide-chevron-up'
                : 'i-lucide-chevron-down'
            "
            class="w-4 h-4 text-gray-500 transition-transform duration-200"
          />
        </div>
      </div>

      <!-- Expandable Content -->
      <div
        v-if="expandedShareholders[index]"
        class="border-t border-gray-200 p-4 bg-gray-50"
      >
        <div class="grid gap-4 grid-cols-1 md:grid-cols-2 md:gap-6">
          <!-- Name -->
          <CompanyApplicationReviewUiFieldCard
            label="姓名"
            :value="shareholder.person.name"
            v-bind="getShareholderFieldStatusProps('name', index)"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="
                  getShareholderFieldStatus('name', index).isVerified
                "
                :has-issue="getShareholderFieldStatus('name', index).hasIssue"
                :field-path="`shareholders[${index}].name`"
                @verify="() => verifyShareholderField('name', index)"
                @add-issue="addFieldIssue"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- ID Number -->
          <CompanyApplicationReviewUiFieldCard
            label="身分證字號"
            :value="shareholder.person.idNumber"
            v-bind="getShareholderFieldStatusProps('idNumber', index)"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="
                  getShareholderFieldStatus('idNumber', index).isVerified
                "
                :has-issue="
                  getShareholderFieldStatus('idNumber', index).hasIssue
                "
                :field-path="`shareholders[${index}].idNumber`"
                @verify="() => verifyShareholderField('idNumber', index)"
                @add-issue="addFieldIssue"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Address -->
          <CompanyApplicationReviewUiFieldCard
            label="地址"
            :value="shareholder.person.address"
            v-bind="getShareholderFieldStatusProps('address', index)"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="
                  getShareholderFieldStatus('address', index).isVerified
                "
                :has-issue="
                  getShareholderFieldStatus('address', index).hasIssue
                "
                :field-path="`shareholders[${index}].address`"
                @verify="() => verifyShareholderField('address', index)"
                @add-issue="addFieldIssue"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Telephone -->
          <CompanyApplicationReviewUiFieldCard
            label="電話"
            :value="shareholder.person.telephone"
            v-bind="getShareholderFieldStatusProps('telephone', index)"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="
                  getShareholderFieldStatus('telephone', index).isVerified
                "
                :has-issue="
                  getShareholderFieldStatus('telephone', index).hasIssue
                "
                :field-path="`shareholders[${index}].telephone`"
                @verify="() => verifyShareholderField('telephone', index)"
                @add-issue="addFieldIssue"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Cellphone -->
          <CompanyApplicationReviewUiFieldCard
            label="手機"
            :value="shareholder.person.cellphone"
            v-bind="getShareholderFieldStatusProps('cellphone', index)"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="
                  getShareholderFieldStatus('cellphone', index).isVerified
                "
                :has-issue="
                  getShareholderFieldStatus('cellphone', index).hasIssue
                "
                :field-path="`shareholders[${index}].cellphone`"
                @verify="() => verifyShareholderField('cellphone', index)"
                @add-issue="addFieldIssue"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Email -->
          <CompanyApplicationReviewUiFieldCard
            label="電子郵件"
            :value="shareholder.person.email"
            v-bind="getShareholderFieldStatusProps('email', index)"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="
                  getShareholderFieldStatus('email', index).isVerified
                "
                :has-issue="getShareholderFieldStatus('email', index).hasIssue"
                :field-path="`shareholders[${index}].email`"
                @verify="() => verifyShareholderField('email', index)"
                @add-issue="addFieldIssue"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Shares -->
          <CompanyApplicationReviewUiFieldCard
            v-if="shareholder.shares !== undefined"
            label="持股數"
            :value="shareholder.shares?.toLocaleString() || '0'"
            v-bind="getShareholderFieldStatusProps('shares', index)"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="
                  getShareholderFieldStatus('shares', index).isVerified
                "
                :has-issue="getShareholderFieldStatus('shares', index).hasIssue"
                :field-path="`shareholders[${index}].shares`"
                @verify="() => verifyShareholderField('shares', index)"
                @add-issue="addFieldIssue"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>
        </div>
      </div>
    </div>
  </CompanyApplicationReviewShareholdersSectionBase>
</template>

<script setup lang="ts">
import {
  SHAREHOLDER_FIELDS,
  useShareholderReviewSection,
} from "./useShareholderReviewSection";

const {
  shareholders,
  sectionIsOpen,
  status,
  quickActionItems,
  getShareholderFieldStatus,
  getShareholderFieldStatusProps,
  getShareholderStatuses,
  getShareholderOverallStatus,
  addFieldIssue,
  verifyShareholderField,
  handleToggleSection,
  fieldStatuses,
} = useShareholderReviewSection({
  sectionTitle: "股東資料",
  verifyAllLabel: "驗證全部",
  clearAllLabel: "清除標記",
  markReviewedLabel: "標記已檢視",
});

// Collapsible state management
const expandedShareholders = ref<Record<number, boolean>>({});

const toggleShareholderExpanded = (index: number) => {
  expandedShareholders.value[index] = !expandedShareholders.value[index];
};

// Initialize first few shareholders as expanded by default
onMounted(() => {
  // Expand first 3 shareholders by default for better UX
  shareholders.value.slice(0, 3).forEach((_, index) => {
    expandedShareholders.value[index] = true;
  });
});
</script>
