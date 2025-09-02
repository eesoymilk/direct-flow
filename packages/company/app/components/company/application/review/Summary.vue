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
            v-for="issue in reviewOverlay.issues"
            :key="issue.fieldPath"
            class="flex items-center gap-2 text-sm p-2 bg-red-50 rounded"
          >
            <UIcon
              name="i-lucide-alert-triangle"
              class="w-4 h-4 text-red-600"
            />
            <span class="font-medium">{{ issue.fieldPath }}:</span>
            <span class="text-red-600">{{
              getSeverityLabel(issue.severity)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Review Status -->
      <div class="p-3 rounded-lg" :class="completionStatusClass">
        <div class="flex items-center gap-2">
          <UIcon :name="completionStatusIcon" class="w-5 h-5" />
          <div>
            <div class="font-medium">{{ completionStatusText }}</div>
            <div class="text-sm opacity-75">{{ completionStatusSubtext }}</div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { getSeverityLabel } from "~/utils/labels";

interface Props {
  application: any; // TODO: Add proper typing
}

const props = defineProps<Props>();
const { user, loggedIn } = useUserSession();

// Use the simplified review overlay system
const { reviewProgress, reviewOverlay } = useReviewOverlay(props.application);

// Computed properties for counts using the overlay
const verifiedCount = computed(() => {
  return reviewOverlay.value.verifications.length;
});

const issuesCount = computed(() => {
  return reviewOverlay.value.issues.length;
});

const resolvedCount = computed(() => {
  // Count issues that are not critical/high priority
  return reviewOverlay.value.issues.filter(
    issue => issue.severity === 'low' || issue.severity === 'medium'
  ).length;
});

const reviewingCount = computed(() => {
  // For now, assume items without issues or verifications are under review
  return 0; // TODO: Implement proper counting
});

const completionStatusClass = computed(() => {
  if (reviewProgress.value.hasBlockingIssues) {
    return "bg-red-50 text-red-700";
  }
  if (issuesCount.value === 0) {
    return "bg-green-50 text-green-700";
  }
  return "bg-orange-50 text-orange-700";
});

const completionStatusIcon = computed(() => {
  if (reviewProgress.value.hasBlockingIssues) {
    return "i-lucide-alert-triangle";
  }
  if (issuesCount.value === 0) {
    return "i-lucide-check-circle";
  }
  return "i-lucide-clock";
});

const completionStatusText = computed(() => {
  if (reviewProgress.value.hasBlockingIssues) {
    return "發現嚴重問題";
  }
  if (issuesCount.value === 0) {
    return "審核完成";
  }
  return "審核進行中";
});

const completionStatusSubtext = computed(() => {
  if (reviewProgress.value.hasBlockingIssues) {
    return `有 ${reviewProgress.value.criticalIssues} 個嚴重問題需要處理`;
  }
  if (issuesCount.value === 0) {
    return "所有項目已完成審核，可以提交審核結果";
  }
  return `還有 ${issuesCount.value} 個問題待處理`;
});
</script>
