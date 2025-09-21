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
      :issues-count="aggregateStatus.issueCount"
      :verified-count="aggregateStatus.verificationCount"
      :total-count="aggregateStatus.totalFields"
    />

    <!-- Empty State -->
    <div v-if="partnersCount === 0" class="px-4 py-8 text-center text-gray-500">
      <UIcon
        name="i-lucide-users"
        class="w-12 h-12 mx-auto mb-2 text-gray-300"
      />
      <p>{{ emptyStateMessage }}</p>
    </div>

    <!-- Partners Content -->
    <div v-else class="space-y-6 px-2 pb-2">
      <slot />
    </div>
  </CompanyApplicationReviewUiSectionCard>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { SectionStatus } from "~/composables/useReviewSectionStatus";

interface Props {
  title: string;
  description: string;
  emptyStateMessage: string;
  isOpen: boolean;
  partnersCount: number;
  aggregateStatus: SectionStatus;
  quickActionItems: DropdownMenuItem[];
}

const props = defineProps<Props>();
defineEmits<{
  toggle: [];
}>();

// Status styling based on passed aggregate status
const {
  sectionBorderClass,
  statusIcon,
  statusIconClass,
  statusBadgeColor,
  statusLabel,
} = useReviewSectionStatus(computed(() => props.aggregateStatus));
</script>
