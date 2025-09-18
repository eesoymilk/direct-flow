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
          v-if="partner.person.idNumber"
          :label="partner.person.idNumber"
          color="neutral"
          variant="subtle"
        />
        <UBadge
          v-if="partner.shares !== undefined"
          :label="`${partner.shares.toLocaleString()} 股`"
          color="info"
          variant="subtle"
        />
        <UBadge
          v-if="partner.capitalContribution !== null"
          :label="`NT$ ${partner.capitalContribution.toLocaleString()}`"
          color="success"
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
            :value="partner.person.name"
            v-bind="partnerStatusesProps.name"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="partnerStatuses.name.isVerified"
                :has-issue="partnerStatuses.name.hasIssue"
                :field-path="`partners[${index}].name`"
                @verify="() => $emit('verifyField', 'name', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- ID Number -->
          <CompanyApplicationReviewUiFieldCard
            label="身分證字號"
            :value="partner.person.idNumber"
            v-bind="partnerStatusesProps.idNumber"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="partnerStatuses.idNumber.isVerified"
                :has-issue="partnerStatuses.idNumber.hasIssue"
                :field-path="`partners[${index}].idNumber`"
                @verify="() => $emit('verifyField', 'idNumber', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Address -->
          <CompanyApplicationReviewUiFieldCard
            label="地址"
            :value="partner.person.address"
            v-bind="partnerStatusesProps.address"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="partnerStatuses.address.isVerified"
                :has-issue="partnerStatuses.address.hasIssue"
                :field-path="`partners[${index}].address`"
                @verify="() => $emit('verifyField', 'address', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Cellphone -->
          <CompanyApplicationReviewUiFieldCard
            label="手機"
            :value="partner.person.cellphone"
            v-bind="partnerStatusesProps.cellphone"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="partnerStatuses.cellphone.isVerified"
                :has-issue="partnerStatuses.cellphone.hasIssue"
                :field-path="`partners[${index}].cellphone`"
                @verify="() => $emit('verifyField', 'cellphone', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Email -->
          <CompanyApplicationReviewUiFieldCard
            label="電子郵件"
            :value="partner.person.email"
            v-bind="partnerStatusesProps.email"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="partnerStatuses.email.isVerified"
                :has-issue="partnerStatuses.email.hasIssue"
                :field-path="`partners[${index}].email`"
                @verify="() => $emit('verifyField', 'email', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Shares -->
          <CompanyApplicationReviewUiFieldCard
            v-if="partner.shares !== undefined"
            label="持股數"
            :value="partner.shares?.toLocaleString() || '0'"
            v-bind="partnerStatusesProps.shares"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="partnerStatuses.shares.isVerified"
                :has-issue="partnerStatuses.shares.hasIssue"
                :field-path="`partners[${index}].shares`"
                @verify="() => $emit('verifyField', 'shares', index)"
                @add-issue="(issue) => $emit('addFieldIssue', issue)"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <!-- Capital Contribution -->
          <CompanyApplicationReviewUiFieldCard
            label="出資額"
            :value="
              partner.capitalContribution !== null
                ? `NT$ ${partner.capitalContribution?.toLocaleString()}`
                : '未填寫'
            "
            v-bind="partnerStatusesProps.capitalContribution"
          >
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="partnerStatuses.capitalContribution.isVerified"
                :has-issue="partnerStatuses.capitalContribution.hasIssue"
                :field-path="`partners[${index}].capitalContribution`"
                @verify="
                  () => $emit('verifyField', 'capitalContribution', index)
                "
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
import type { FieldStatus, PartnerField } from "../types";

interface Props {
  partner: PartnerResponse;
  index: number;
  isExpanded: boolean;
  overallStatus: {
    hasVerified: boolean;
    hasIssues: boolean;
  };
  partnerStatuses: Record<PartnerField, FieldStatus>;
  partnerStatusesProps: Record<
    PartnerField,
    {
      statusLabel: string;
      statusBadgeColor: "success" | "warning" | "neutral";
    }
  >;
}

const props = defineProps<Props>();

defineEmits<{
  toggle: [];
  verifyField: [field: PartnerField, index: number];
  addFieldIssue: [issue: ReviewIssueSchema];
}>();

const title = computed(
  () =>
    `股東 ${props.index + 1}${props.partner.person.name ? ` - ${props.partner.person.name}` : ""}`
);
</script>
