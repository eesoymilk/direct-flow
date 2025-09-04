<template>
  <UCard>
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">審查歷程</h3>
          <p class="text-sm text-gray-600 mt-1">查看所有審查輪次的歷史記錄</p>
        </div>
        <UButton
          @click="refreshHistory"
          :loading="isLoading"
          size="sm"
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrow-path"
        >
          重新載入
        </UButton>
      </div>
    </template>

    <!-- Content -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <UIcon
        name="i-heroicons-arrow-path"
        class="size-6 animate-spin text-gray-400"
      />
    </div>

    <div
      v-else-if="reviewRounds.length === 0"
      class="text-center py-8 text-gray-500"
    >
      <UIcon
        name="i-heroicons-document-text"
        class="size-12 mx-auto mb-2 text-gray-400"
      />
      <p>尚無審查記錄</p>
      <p class="text-sm mt-1">完成第一次審查後，歷程將顯示在這裡</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(round, index) in reviewRounds"
        :key="round.id"
        :class="[
          'border rounded-lg p-4 transition-all duration-200',
          index === 0
            ? 'border-blue-200 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300',
        ]"
      >
        <!-- Round Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'flex items-center justify-center size-8 rounded-full text-sm font-medium',
                index === 0
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600',
              ]"
            >
              R{{ round.roundNo }}
            </div>
            <div>
              <h4 class="font-medium text-gray-900">
                第 {{ round.roundNo }} 輪審查
                <span v-if="index === 0" class="text-blue-600 text-sm ml-2"
                  >(最新)</span
                >
              </h4>
              <p class="text-sm text-gray-600">
                {{ formatDate(round.createdAt) }}
              </p>
            </div>
          </div>

          <UBadge
            :label="getStatusLabel(round.status)"
            :color="
              getStatusColor(round.status) as 'warning' | 'success' | 'neutral'
            "
            variant="subtle"
          />
        </div>

        <!-- Round Summary -->
        <div v-if="round.summary" class="mb-3 p-3 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-700">{{ round.summary }}</p>
        </div>

        <!-- Issues and Verifications -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Issues -->
          <div class="space-y-2">
            <h5
              class="text-sm font-medium text-gray-900 flex items-center gap-2"
            >
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="size-4 text-red-500"
              />
              問題 ({{ round.reviewIssues?.length || 0 }})
            </h5>
            <div v-if="round.reviewIssues?.length" class="space-y-1">
              <div
                v-for="issue in round.reviewIssues.slice(0, 3)"
                :key="issue.id"
                class="text-xs p-2 bg-red-50 border border-red-200 rounded"
              >
                <p class="font-medium text-red-900">
                  {{ getFieldDisplayName(issue.fieldPath) }}
                </p>
                <p class="text-red-700">
                  {{ getIssueTypeLabel(issue.issueType) }}
                </p>
              </div>
              <div
                v-if="round.reviewIssues.length > 3"
                class="text-xs text-gray-500 text-center py-1"
              >
                還有 {{ round.reviewIssues.length - 3 }} 個問題...
              </div>
            </div>
            <div v-else class="text-xs text-gray-500 italic">無問題</div>
          </div>

          <!-- Verifications -->
          <div class="space-y-2">
            <h5
              class="text-sm font-medium text-gray-900 flex items-center gap-2"
            >
              <UIcon
                name="i-heroicons-check-circle"
                class="size-4 text-green-500"
              />
              已驗證 ({{ round.reviewVerifications?.length || 0 }})
            </h5>
            <div v-if="round.reviewVerifications?.length" class="space-y-1">
              <div
                v-for="verification in round.reviewVerifications.slice(0, 3)"
                :key="verification.id"
                class="text-xs p-2 bg-green-50 border border-green-200 rounded"
              >
                <p class="font-medium text-green-900">
                  {{ getFieldDisplayName(verification.fieldPath) }}
                </p>
                <p v-if="verification.note" class="text-green-700">
                  {{ verification.note }}
                </p>
              </div>
              <div
                v-if="round.reviewVerifications.length > 3"
                class="text-xs text-gray-500 text-center py-1"
              >
                還有 {{ round.reviewVerifications.length - 3 }} 個驗證...
              </div>
            </div>
            <div v-else class="text-xs text-gray-500 italic">無驗證</div>
          </div>
        </div>

        <!-- Expand/Collapse Details -->
        <div class="mt-3 pt-3 border-t border-gray-200">
          <UButton
            @click="toggleDetails(round.id)"
            size="xs"
            color="neutral"
            variant="ghost"
            :icon="
              expandedRounds.has(round.id)
                ? 'i-heroicons-chevron-up'
                : 'i-heroicons-chevron-down'
            "
          >
            {{ expandedRounds.has(round.id) ? "收起詳情" : "查看詳情" }}
          </UButton>
        </div>

        <!-- Expanded Details -->
        <div
          v-if="expandedRounds.has(round.id)"
          class="mt-3 pt-3 border-t border-gray-200"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- All Issues -->
            <div v-if="round.reviewIssues?.length">
              <h6 class="font-medium text-gray-900 mb-2">所有問題</h6>
              <div class="space-y-2">
                <div
                  v-for="issue in round.reviewIssues"
                  :key="issue.id"
                  class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm"
                >
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="font-medium text-red-900">
                        {{ getFieldDisplayName(issue.fieldPath) }}
                      </p>
                      <p class="text-red-700 mt-1">
                        {{ getIssueTypeLabel(issue.issueType) }}
                      </p>
                      <p v-if="issue.description" class="text-red-600 mt-1">
                        {{ issue.description }}
                      </p>
                    </div>
                    <UBadge
                      :label="getSeverityLabel(issue.severity)"
                      :color="
                        getSeverityColor(issue.severity) as
                          | 'error'
                          | 'warning'
                          | 'info'
                          | 'neutral'
                      "
                      variant="subtle"
                      size="xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- All Verifications -->
            <div v-if="round.reviewVerifications?.length">
              <h6 class="font-medium text-gray-900 mb-2">所有驗證</h6>
              <div class="space-y-2">
                <div
                  v-for="verification in round.reviewVerifications"
                  :key="verification.id"
                  class="p-3 bg-green-50 border border-green-200 rounded-lg text-sm"
                >
                  <p class="font-medium text-green-900">
                    {{ getFieldDisplayName(verification.fieldPath) }}
                  </p>
                  <p v-if="verification.note" class="text-green-600 mt-1">
                    {{ verification.note }}
                  </p>
                  <p class="text-xs text-green-500 mt-2">
                    驗證時間: {{ formatDate(verification.verifiedAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import {
  getFieldDisplayName,
  getIssueTypeLabel,
  getSeverityLabel,
  getSeverityColor,
  getStatusLabel,
  getStatusColor,
} from "~/components/company/application/helpers";

// No longer need applicationId prop since store gets it from details store

// Get review store
const reviewStore = useCompanyApplicationReviewStore();

// State
const isLoading = ref(false);
const reviewRounds = ref<any[]>([]);
const expandedRounds = ref(new Set<string>());

// Load review rounds on mount
onMounted(() => {
  loadReviewRounds();
});

// Actions
const loadReviewRounds = async () => {
  isLoading.value = true;
  try {
    const response = await reviewStore.loadReviewHistory();
    reviewRounds.value = response.rounds || [];
  } catch (error) {
    console.error("Failed to load review rounds:", error);
    const toast = useToast();
    toast.add({
      title: "載入失敗",
      description: "無法載入審查歷程，請稍後再試",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const refreshHistory = () => {
  loadReviewRounds();
};

const toggleDetails = (roundId: string) => {
  if (expandedRounds.value.has(roundId)) {
    expandedRounds.value.delete(roundId);
  } else {
    expandedRounds.value.add(roundId);
  }
};

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// All helper functions are now imported from centralized helpers file
</script>
