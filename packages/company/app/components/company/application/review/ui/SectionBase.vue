<template>
  <CompanyApplicationReviewUiSectionCard
    :title="title"
    :description="description"
    :is-open="isOpen"
    :section-border-class="sectionBorderClass"
    :status-icon="statusIcon"
    :status-icon-class="statusIconClass"
    :status-label="statusLabel"
    :status-badge-color="statusBadgeColor"
    @toggle="$emit('toggle')"
  >
    <template #header-actions>
      <UDropdownMenu :items="quickActionItems">
        <UButton icon="i-lucide-more-vertical" variant="ghost" />
      </UDropdownMenu>
    </template>

    <CompanyApplicationReviewUiSectionSummary
      :issues-count="status.issueCount"
      :verified-count="status.verificationCount"
      :total-count="status.totalFields"
    />

    <!-- Field Review Cards -->
    <div class="grid gap-6 px-4">
      <slot :field-statuses="fieldStatuses" />
    </div>
  </CompanyApplicationReviewUiSectionCard>
</template>

<script setup lang="ts" generic="T extends string">
import type { DropdownMenuItem } from "@nuxt/ui";

type FieldStatus = {
  hasIssue: boolean;
  issue: ReviewIssueSchema | undefined;
  isVerified: boolean;
  verification: ReviewVerificationSchema | undefined;
};

type SectionStatus = {
  hasIssues: boolean;
  hasCriticalIssues: boolean;
  hasVerifications: boolean;
  issueCount: number;
  criticalIssueCount: number;
  verificationCount: number;
  totalFields: number;
  isComplete: boolean;
};

interface Props {
  title: string;
  description: string;
  isOpen: boolean;
  sectionBorderClass: string;
  statusIcon: string;
  statusIconClass: string;
  statusLabel: string;
  statusBadgeColor:
    | "success"
    | "warning"
    | "neutral"
    | "primary"
    | "secondary"
    | "info"
    | "error";
  status: SectionStatus;
  fieldStatuses: Record<T, FieldStatus>;
  quickActionItems: DropdownMenuItem[];
}

defineProps<Props>();
defineEmits<{
  toggle: [];
}>();
</script>
