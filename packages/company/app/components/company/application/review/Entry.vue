<template>
  <div v-if="reviewEntry" class="text-sm space-y-2 sm:space-y-3">
    <div class="font-medium text-neutral-500 flex gap-1 items-center">
      <span>{{ reviewEntry.label }}</span>
      <UButtonGroup v-if="loggedIn" class="ml-auto">
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
          v-if="
            props.ignorable &&
            (reviewEntry.state === 'reviewing' ||
              reviewEntry.state === 'ignored')
          "
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
      v-if="
        reviewEntry.state === 'hasIssue' ||
        reviewEntry.state === 'issueResolved'
      "
      :class="
        reviewEntry.state === 'issueResolved'
          ? 'text-green-600 bg-green-50'
          : 'text-red-600 bg-red-50'
      "
    >
      <div class="flex items-center gap-2 md:gap-3">
        <UIcon
          :name="
            reviewEntry.state === 'issueResolved'
              ? 'i-lucide-check-circle'
              : 'i-lucide-alert-triangle'
          "
          :size="24"
        />
        <span v-if="errorMessage">
          {{ errorMessage }}
        </span>
      </div>
    </UCard>
    <USeparator class="sm:-mt-1" />
  </div>
</template>

<script setup lang="ts">
import type { FieldPath } from "~/composables/stores/reviewEntry";

const props = withDefaults(
  defineProps<{
    ignorable?: boolean;
    entryPath: FieldPath;
  }>(),
  {
    ignorable: false,
  }
);

const { user, loggedIn } = useUserSession();

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

const issueTypeLabel = {
  missing: "遺漏資料",
  invalid: "資料無效",
  clarification: "需要澄清",
  modification: "需要修改",
};

const errorMessage = computed(() => {
  if (!reviewEntry.value) {
    return null;
  }

  if (
    reviewEntry.value.state !== "hasIssue" &&
    reviewEntry.value.state !== "issueResolved"
  ) {
    return null;
  }

  if (!reviewEntry.value.issue) {
    return "請新增問題";
  }

  if (reviewEntry.value.issue.description) {
    return reviewEntry.value.issue.description;
  }

  return `${issueTypeLabel[reviewEntry.value.issue.issueType]}`;
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
