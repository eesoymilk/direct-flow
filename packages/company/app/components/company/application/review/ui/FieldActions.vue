<template>
  <div class="w-full flex gap-2">
    <UButton
      v-if="!isVerified"
      icon="i-lucide-check"
      label="驗證"
      color="success"
      variant="subtle"
      block
      @click="$emit('verify')"
    />
    <!-- Issue Modal -->
    <CompanyApplicationReviewIssueModal
      v-if="!hasIssue"
      :title="modalTitle"
      :description="modalDescription"
      :field-path="fieldPath"
      @submit="(issue) => $emit('addIssue', issue)"
    >
      <UButton
        icon="i-lucide-alert-triangle"
        label="標記問題"
        color="warning"
        variant="subtle"
        block
      />
    </CompanyApplicationReviewIssueModal>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isVerified?: boolean;
  hasIssue?: boolean;
  modalTitle?: string;
  modalDescription?: string;
  fieldPath: string;
}

interface Emits {
  verify: [];
  addIssue: [issue: ReviewIssueSchema];
}

defineProps<Props>();
defineEmits<Emits>();
</script>
