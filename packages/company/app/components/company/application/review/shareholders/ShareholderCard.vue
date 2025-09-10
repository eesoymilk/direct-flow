<template>
  <UCard
    class="bg-white rounded-2xl border-l-4 shadow hover:shadow-lg transition-all duration-300"
  >
    <!-- Collapsible Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-user" class="w-5 h-5 text-blue-500" />
        <h4 class="font-medium text-gray-900">
          {{ title }}
        </h4>
        <UBadge
          v-if="shareholder.person.idNumber"
          :label="shareholder.person.idNumber"
          color="neutral"
          variant="subtle"
        />
        <UBadge
          v-if="shareholder.shares !== undefined"
          :label="`${shareholder.shares.toLocaleString()} 股`"
          color="info"
          variant="subtle"
        />
      </div>
      <div class="flex items-center gap-2">
        <UBadge
          v-if="overallStatus.hasVerified"
          icon="i-lucide-check"
          label="✓"
          color="success"
          variant="subtle"
        />
        <UBadge
          v-if="overallStatus.hasIssues"
          icon="i-lucide-alert-triangle"
          label="!"
          color="warning"
          variant="subtle"
        />
        <UButton
          :icon="isExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          variant="ghost"
          class="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          @click="$emit('toggle')"
        />
      </div>
    </div>

    <!-- Expandable Content -->
    <UCollapsible :open="isExpanded" class="w-full">
      <template #content>
        <div
          class="mt-4 md:mt-6 grid gap-4 grid-cols-1 md:grid-cols-2 md:gap-6"
        >
          <!-- Name -->
          <CompanyApplicationReviewUiFieldCard
            label="姓名"
            :value="shareholder.person.name"
            v-bind="shareholderStatusesProps.name"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="shareholderStatuses.name.isVerified"
                :has-issue="shareholderStatuses.name.hasIssue"
                :field-path="`shareholders[${index}].name`"
                @verify="() => $emit('verifyField', 'name', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- ID Number -->
          <CompanyApplicationReviewUiFieldCard
            label="身分證字號"
            :value="shareholder.person.idNumber"
            v-bind="shareholderStatusesProps.idNumber"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="shareholderStatuses.idNumber.isVerified"
                :has-issue="shareholderStatuses.idNumber.hasIssue"
                :field-path="`shareholders[${index}].idNumber`"
                @verify="() => $emit('verifyField', 'idNumber', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Address -->
          <CompanyApplicationReviewUiFieldCard
            label="地址"
            :value="shareholder.person.address"
            v-bind="shareholderStatusesProps.address"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="shareholderStatuses.address.isVerified"
                :has-issue="shareholderStatuses.address.hasIssue"
                :field-path="`shareholders[${index}].address`"
                @verify="() => $emit('verifyField', 'address', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Telephone -->
          <CompanyApplicationReviewUiFieldCard
            label="電話"
            :value="shareholder.person.telephone"
            v-bind="shareholderStatusesProps.telephone"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="shareholderStatuses.telephone.isVerified"
                :has-issue="shareholderStatuses.telephone.hasIssue"
                :field-path="`shareholders[${index}].telephone`"
                @verify="() => $emit('verifyField', 'telephone', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Cellphone -->
          <CompanyApplicationReviewUiFieldCard
            label="手機"
            :value="shareholder.person.cellphone"
            v-bind="shareholderStatusesProps.cellphone"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="shareholderStatuses.cellphone.isVerified"
                :has-issue="shareholderStatuses.cellphone.hasIssue"
                :field-path="`shareholders[${index}].cellphone`"
                @verify="() => $emit('verifyField', 'cellphone', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Email -->
          <CompanyApplicationReviewUiFieldCard
            label="電子郵件"
            :value="shareholder.person.email"
            v-bind="shareholderStatusesProps.email"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="shareholderStatuses.email.isVerified"
                :has-issue="shareholderStatuses.email.hasIssue"
                :field-path="`shareholders[${index}].email`"
                @verify="() => $emit('verifyField', 'email', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Shares -->
          <CompanyApplicationReviewUiFieldCard
            v-if="shareholder.shares !== undefined"
            label="持股數"
            :value="shareholder.shares?.toLocaleString() || '0'"
            v-bind="shareholderStatusesProps.shares"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="shareholderStatuses.shares.isVerified"
                :has-issue="shareholderStatuses.shares.hasIssue"
                :field-path="`shareholders[${index}].shares`"
                @verify="() => $emit('verifyField', 'shares', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>
        </div>
      </template>
    </UCollapsible>
  </UCard>
</template>

<script setup lang="ts">
import type { FieldStatus, ShareholderField } from "../types";

interface Props {
  shareholder: ShareholderResponse;
  index: number;
  isExpanded: boolean;
  overallStatus: {
    hasVerified: boolean;
    hasIssues: boolean;
  };
  shareholderStatuses: Record<ShareholderField, FieldStatus>;
  shareholderStatusesProps: Record<
    ShareholderField,
    {
      statusLabel: string;
      statusBadgeColor: "success" | "warning" | "neutral";
    }
  >;
}

const props = defineProps<Props>();

defineEmits<{
  toggle: [];
  verifyField: [field: ShareholderField, index: number];
  addFieldIssue: [issue: ReviewIssueSchema];
}>();

const title = computed(
  () =>
    `股東 ${props.index + 1}${props.shareholder.person.name ? ` - ${props.shareholder.person.name}` : ""}`
);
</script>
