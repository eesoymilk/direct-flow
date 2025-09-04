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
      class="border border-gray-200 rounded-lg p-4 bg-gray-50"
    >
      <!-- Shareholder Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-user" class="w-5 h-5 text-blue-500" />
          <h4 class="font-medium text-gray-900">
            股東 {{ index + 1
            }}{{
              shareholder.person.name ? ` - ${shareholder.person.name}` : ""
            }}
          </h4>
          <UBadge
            v-if="shareholder.shares !== undefined"
            :label="`持股 ${shareholder.shares.toLocaleString()} 股`"
            color="info"
            variant="subtle"
          />
        </div>
      </div>

      <!-- Shareholder Fields -->
      <div class="grid gap-4 grid-cols-1 md:grid-cols-2 md:gap-6">
        <!-- Name -->
        <CompanyApplicationReviewUiFieldCard
          label="姓名"
          :value="shareholder.person.name"
          v-bind="getShareholderFieldStatusProps('name', index)"
        >
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="getShareholderFieldStatus('name', index).isVerified"
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
              :has-issue="getShareholderFieldStatus('idNumber', index).hasIssue"
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
              :has-issue="getShareholderFieldStatus('address', index).hasIssue"
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
  </CompanyApplicationReviewShareholdersSectionBase>
</template>

<script setup lang="ts">
import { useShareholderReviewSection } from "./useShareholderReviewSection";

const {
  shareholders,
  sectionIsOpen,
  status,
  quickActionItems,
  getShareholderFieldStatus,
  getShareholderFieldStatusProps,
  addFieldIssue,
  verifyShareholderField,
  handleToggleSection,
} = useShareholderReviewSection({
  sectionTitle: "股東資料",
  verifyAllLabel: "驗證全部",
  clearAllLabel: "清除標記",
  markReviewedLabel: "標記已檢視",
});
</script>
