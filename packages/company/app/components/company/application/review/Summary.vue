<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-clipboard-check" class="w-5 h-5" />
        <h3 class="text-lg font-semibold">審核摘要</h3>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Review Status Overview -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-3 bg-green-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600">
            {{ verifiedCount }}
          </div>
          <div class="text-sm text-gray-600">已驗證</div>
        </div>

        <div class="text-center p-3 bg-red-50 rounded-lg">
          <div class="text-2xl font-bold text-red-600">{{ issuesCount }}</div>
          <div class="text-sm text-gray-600">發現問題</div>
        </div>

        <div class="text-center p-3 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">
            {{ resolvedCount }}
          </div>
          <div class="text-sm text-gray-600">已解決</div>
        </div>

        <div v-if="loggedIn" class="text-center p-3 bg-orange-50 rounded-lg">
          <div class="text-2xl font-bold text-orange-600">
            {{ reviewingCount }}
          </div>
          <div class="text-sm text-gray-600">待審核</div>
        </div>

        <div v-if="loggedIn" class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-gray-600">
            {{ ignoredCount }}
          </div>
          <div class="text-sm text-gray-600">已忽略</div>
        </div>
      </div>

      <!-- Completion Status -->
      <div
        class="flex items-center gap-3 p-3 rounded-lg"
        :class="completionStatusClass"
      >
        <UIcon :name="completionStatusIcon" class="w-5 h-5" />
        <div>
          <div class="font-medium">{{ completionStatusText }}</div>
          <div class="text-sm opacity-80">{{ completionStatusSubtext }}</div>
        </div>
      </div>

      <!-- Issues List (if any) -->
      <div v-if="issuesCount > 0" class="space-y-2">
        <h4 class="font-medium text-gray-900">發現的問題</h4>
        <div class="space-y-2 max-h-32 overflow-y-auto">
          <div
            v-for="entry in reviewStore.entriesWithIssues"
            :key="entry.label"
            class="flex items-center gap-2 text-sm p-2 bg-red-50 rounded"
          >
            <UIcon
              name="i-lucide-alert-triangle"
              class="w-4 h-4 text-red-600"
            />
            <span class="font-medium">{{ entry.label }}:</span>
            <span class="text-red-600">{{
              getSeverityText(entry.issue?.severity)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Pending Review List (if any) -->
      <div v-if="reviewingCount > 0" class="space-y-2">
        <h4 class="font-medium text-gray-900">待審核項目</h4>
        <div class="space-y-1 max-h-32 overflow-y-auto">
          <div
            v-for="entry in reviewStore.entriesUnderReview"
            :key="entry.label"
            class="flex items-center gap-2 text-sm p-2 bg-orange-50 rounded"
          >
            <UIcon name="i-lucide-clock" class="w-4 h-4 text-orange-600" />
            <span>{{ entry.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const reviewStore = useCompanyApplicationReviewStore();

const { user, loggedIn } = useUserSession();

// Computed properties for counts
const totalEntries = computed(() => {
  const allEntries = [
    ...Object.values(reviewStore.reviewEntries.company),
    ...Object.values(reviewStore.reviewEntries.responsiblePerson),
    ...Object.values(reviewStore.reviewEntries.contactPerson),
    ...Object.values(reviewStore.reviewEntries.representative),
    ...reviewStore.reviewEntries.shareholders.flatMap((shareholder) =>
      Object.values(shareholder)
    ),
  ];
  return allEntries.length;
});

const verifiedCount = computed(() => {
  return reviewStore.allEntries.filter((entry) => entry.state === "verified")
    .length;
});

const issuesCount = computed(() => {
  return reviewStore.entriesWithIssues.filter(
    (entry) => entry.state === "hasIssue"
  ).length;
});

const resolvedCount = computed(() => {
  return reviewStore.allEntries.filter(
    (entry) => entry.state === "issueResolved"
  ).length;
});

const reviewingCount = computed(() => {
  return reviewStore.entriesUnderReview.length;
});

const ignoredCount = computed(() => {
  return reviewStore.allEntries.filter((entry) => entry.state === "ignored")
    .length;
});

const validation = computed(() => reviewStore.validateReviewCompletion());

const completionStatusClass = computed(() => {
  if (validation.value.isComplete) {
    return "bg-green-50 text-green-700";
  }
  return "bg-orange-50 text-orange-700";
});

const completionStatusIcon = computed(() => {
  if (validation.value.isComplete) {
    return "i-lucide-check-circle";
  }
  return "i-lucide-clock";
});

const completionStatusText = computed(() => {
  if (validation.value.isComplete) {
    return "審核完成";
  }
  return "審核進行中";
});

const completionStatusSubtext = computed(() => {
  if (validation.value.isComplete) {
    return "所有項目已完成審核，可以提交審核結果";
  }
  return `還有 ${validation.value.pendingCount} 個項目待審核`;
});

// Helper functions
const getSeverityText = (severity?: string) => {
  switch (severity) {
    case "critical":
      return "嚴重";
    case "high":
      return "高";
    case "medium":
      return "中";
    case "low":
      return "低";
    default:
      return "未知";
  }
};
</script>
