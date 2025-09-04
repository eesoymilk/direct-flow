<template>
  <CompanyApplicationReviewUiFieldCard
    :label="label"
    :value="value"
    v-bind="fieldStatusProps"
  >
    <template #custom-display>
      <slot>
        <CompanyApplicationReviewDocumentsDocumentPreview
          :document-status="documentStatus"
          :document-type="documentType"
          :file-url="fileUrl"
          :is-optional="isOptional"
        />
      </slot>
    </template>

    <template #actions>
      <CompanyApplicationReviewUiFieldActions
        :is-verified="isVerified"
        :has-issue="hasIssue"
        :field-path="fieldPath"
        @verify="$emit('verify')"
        @add-issue="$emit('addIssue', $event)"
      />
    </template>
  </CompanyApplicationReviewUiFieldCard>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  value?: string;
  documentStatus: "missing" | "uploaded" | "optional";
  documentType: string;
  fileUrl?: string | null;
  fieldPath: string;
  isVerified?: boolean;
  hasIssue?: boolean;
  isOptional?: boolean;
  fieldStatusProps?: Record<string, any>;
}

interface Emits {
  verify: [];
  addIssue: [issue: ReviewIssueSchema];
}

defineProps<Props>();
defineEmits<Emits>();
</script>
