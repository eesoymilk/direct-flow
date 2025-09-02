<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <UIcon :name="statusIcon" :class="statusIconClass" class="w-6 h-6" />
      <div>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ section.title }}
        </h3>
        <p class="text-sm text-gray-600">{{ section.description }}</p>
      </div>
    </div>
    <slot name="header-right" />
  </div>
</template>

<script setup lang="ts">
type Props = {
  section: ReviewSection;
  collapsibleOpen: boolean;
};

const props = defineProps<Props>();
const reviewStore = useCompanyApplicationReviewStore();

const sectionIssues = computed(() =>
  reviewStore.getSectionIssues(props.section.key)
);

const sectionVerifications = computed(() =>
  reviewStore.getSectionVerifications(props.section.key)
);

const statusIcon = computed(() => {
  if (sectionIssues.value.length > 0) return "i-lucide-alert-triangle";
  if (sectionVerifications.value.length > 0) return "i-lucide-check-circle";
  return "i-lucide-circle";
});

const statusIconClass = computed(() => {
  if (sectionIssues.value.length > 0) return "text-error-500";
  if (sectionVerifications.value.length > 0) return "text-success-500";
  return "text-neutral-400";
});
</script>
