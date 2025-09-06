<template>
  <CompanyApplicationReviewUiSectionBase
    :title="`${personLabel}資料`"
    :description="`${personLabel}的個人基本資料`"
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
    <!-- Name -->
    <CompanyApplicationReviewUiFieldCard
      label="姓名"
      :value="person.name"
      v-bind="getFieldStatusProps('name')"
    >
      <template #actions>
        <CompanyApplicationReviewUiFieldActions
          :is-verified="fieldStatuses.name.isVerified"
          :has-issue="fieldStatuses.name.hasIssue"
          :field-path="`${props.personType}.name`"
          @verify="() => verifyField('name')"
          @add-issue="addFieldIssue"
        />
      </template>
    </CompanyApplicationReviewUiFieldCard>

    <!-- ID Number -->
    <CompanyApplicationReviewUiFieldCard
      label="身分證字號"
      :value="person.idNumber"
      v-bind="getFieldStatusProps('idNumber')"
    >
      <template #actions>
        <CompanyApplicationReviewUiFieldActions
          :is-verified="fieldStatuses.idNumber.isVerified"
          :has-issue="fieldStatuses.idNumber.hasIssue"
          :field-path="`${props.personType}.idNumber`"
          @verify="() => verifyField('idNumber')"
          @add-issue="addFieldIssue"
        />
      </template>
    </CompanyApplicationReviewUiFieldCard>

    <!-- Address -->
    <CompanyApplicationReviewUiFieldCard
      label="地址"
      :value="person.address"
      v-bind="getFieldStatusProps('address')"
    >
      <template #actions>
        <CompanyApplicationReviewUiFieldActions
          :is-verified="fieldStatuses.address.isVerified"
          :has-issue="fieldStatuses.address.hasIssue"
          :field-path="`${props.personType}.address`"
          @verify="() => verifyField('address')"
          @add-issue="addFieldIssue"
        />
      </template>
    </CompanyApplicationReviewUiFieldCard>

    <!-- Telephone -->
    <CompanyApplicationReviewUiFieldCard
      label="電話"
      :value="person.telephone || '未提供'"
      v-bind="getFieldStatusProps('telephone')"
    >
      <template #actions>
        <CompanyApplicationReviewUiFieldActions
          :is-verified="fieldStatuses.telephone.isVerified"
          :has-issue="fieldStatuses.telephone.hasIssue"
          :field-path="`${props.personType}.telephone`"
          @verify="() => verifyField('telephone')"
          @add-issue="addFieldIssue"
        />
      </template>
    </CompanyApplicationReviewUiFieldCard>

    <!-- Cellphone -->
    <CompanyApplicationReviewUiFieldCard
      label="手機"
      :value="person.cellphone || '未提供'"
      v-bind="getFieldStatusProps('cellphone')"
    >
      <template #actions>
        <CompanyApplicationReviewUiFieldActions
          :is-verified="fieldStatuses.cellphone.isVerified"
          :has-issue="fieldStatuses.cellphone.hasIssue"
          :field-path="`${props.personType}.cellphone`"
          @verify="() => verifyField('cellphone')"
          @add-issue="addFieldIssue"
        />
      </template>
    </CompanyApplicationReviewUiFieldCard>

    <!-- Email -->
    <CompanyApplicationReviewUiFieldCard
      label="電子郵件"
      :value="person.email || '未提供'"
      v-bind="getFieldStatusProps('email')"
    >
      <template #actions>
        <CompanyApplicationReviewUiFieldActions
          :is-verified="fieldStatuses.email.isVerified"
          :has-issue="fieldStatuses.email.hasIssue"
          :field-path="`${props.personType}.email`"
          @verify="() => verifyField('email')"
          @add-issue="addFieldIssue"
        />
      </template>
    </CompanyApplicationReviewUiFieldCard>

    <!-- Date of Birth -->
    <CompanyApplicationReviewUiFieldCard
      label="出生日期"
      :value="person.dateOfBirth || '未提供'"
      v-bind="getFieldStatusProps('dateOfBirth')"
    >
      <template #actions>
        <CompanyApplicationReviewUiFieldActions
          :is-verified="fieldStatuses.dateOfBirth.isVerified"
          :has-issue="fieldStatuses.dateOfBirth.hasIssue"
          :field-path="`${props.personType}.dateOfBirth`"
          @verify="() => verifyField('dateOfBirth')"
          @add-issue="addFieldIssue"
        />
      </template>
    </CompanyApplicationReviewUiFieldCard>
  </CompanyApplicationReviewUiSectionBase>
</template>

<script setup lang="ts">
import { usePersonReview } from "./usePersonReview";
import { usePersonReviewSection } from "./usePersonReviewSection";

const props = defineProps<{
  personType: "responsiblePerson" | "representative" | "contactPerson";
}>();

const { responsiblePerson, representative, contactPerson } = usePersonReview();

const personLabel = computed(() => getPersonLabel(props.personType));

const person = computed(() => {
  switch (props.personType) {
    case "responsiblePerson":
      return responsiblePerson.value;
    case "representative":
      return representative.value;
    case "contactPerson":
      return contactPerson.value;
    default:
      throw new Error(
        `Invalid person type: ${props.personType} in Section.vue for person ${personLabel.value}`
      );
  }
});

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
} = usePersonReviewSection({
  sectionKey: props.personType,
  sectionTitle: `${getPersonLabel(props.personType)}資料`,
  verifyAllLabel: "驗證全部",
  clearAllLabel: "清除標記",
  markReviewedLabel: "標記已檢視",
});
</script>
