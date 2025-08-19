<template>
  <div v-if="reviewEntry" class="text-sm space-y-2 sm:space-y-3">
    <div class="font-medium text-neutral-500 flex gap-1 items-center">
      <span>{{ reviewEntry.label }}</span>
      <UButtonGroup class="ml-auto">
        <!-- TODO: Consider the case when the entry is being edited -->
        <CompanyApplicationReviewIssueModal
          v-if="
            reviewEntry.state === 'reviewing' ||
            reviewEntry.state === 'hasIssue'
          "
          :review-path="props.entryPath"
          @submit="handleSubmitIssue"
          @delete="handleDeleteIssue"
        >
          <UButton
            variant="subtle"
            size="sm"
            :label="issueModalButtonProps.label"
            :icon="issueModalButtonProps.icon"
            :color="issueModalButtonProps.color"
          />
        </CompanyApplicationReviewIssueModal>

        <UButton
          v-if="props.ignorable"
          icon="i-lucide-eye-off"
          variant="subtle"
          :label="reviewEntry.state === 'ignored' ? '已忽略' : '忽略'"
          :color="reviewEntry.state === 'ignored' ? 'neutral' : 'secondary'"
          size="sm"
          @click="handleIgnore"
        />

        <UButton
          v-if="
            reviewEntry.state !== 'hasIssue' && reviewEntry.state !== 'ignored'
          "
          icon="i-lucide-check"
          :label="reviewEntry.state === 'verified' ? '已驗證' : '驗證'"
          :variant="reviewEntry.state === 'verified' ? 'subtle' : 'solid'"
          size="sm"
          color="success"
          @click="handleVerify"
        />
      </UButtonGroup>
    </div>
    <slot />
    <UCard
      v-if="reviewEntry.state === 'hasIssue'"
      class="text-red-600 text-xs bg-red-50"
      :ui="{ body: 'sm:p-4 p-2' }"
    >
      <div class="flex items-center gap-2 md:gap-3">
        <UIcon name="i-lucide-alert-triangle" :size="24" />
        <span v-if="reviewEntry.issue?.description">
          {{ reviewEntry.issue.description }}
        </span>
      </div>
    </UCard>
    <USeparator class="sm:-mt-1" />
  </div>
</template>

<script setup lang="ts">
import type { FieldPath, ReviewEntry } from "~/composables/stores/reviewEntry";

const props = withDefaults(
  defineProps<{
    ignorable?: boolean;
    entryPath: FieldPath;
  }>(),
  {
    ignorable: false,
  }
);

const reviewStore = useCompanyApplicationReviewStore();

const reviewEntry = computed(() => reviewStore.getEntry(props.entryPath));

const issueModalButtonProps = computed<{
  label: string;
  icon: string;
  color: "warning" | "error";
}>(() => {
  if (reviewEntry.value?.state === "hasIssue") {
    return {
      label: "編輯問題",
      icon: "i-lucide-alert-triangle",
      color: "error",
    };
  }
  return {
    label: "新增問題",
    icon: "pajamas-issue-new",
    color: "warning",
  };
});

const handleSubmitIssue = (issue: ReviewIssue) => {
  if (!reviewEntry.value) return;
  console.log("handleSubmitIssue", issue);
  reviewStore.setEntry(props.entryPath, {
    ...reviewEntry.value,
    state: "hasIssue",
    issue,
  });
};

const handleDeleteIssue = () => {
  if (!reviewEntry.value) return;

  reviewStore.setEntry(props.entryPath, {
    ...reviewEntry.value,
    state: "reviewing",
  });
};

const handleIgnore = () => {
  if (!reviewEntry.value) return;

  reviewStore.setEntry(props.entryPath, {
    ...reviewEntry.value,
    state: reviewEntry.value.state === "ignored" ? "reviewing" : "ignored",
  });
};

const handleVerify = () => {
  if (!reviewEntry.value) return;

  reviewStore.setEntry(props.entryPath, {
    ...reviewEntry.value,
    state: reviewEntry.value.state === "verified" ? "reviewing" : "verified",
  });
};
</script>
