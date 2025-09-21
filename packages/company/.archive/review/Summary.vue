<template>
  <UCard>
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">審查總結</h3>
          <p class="text-sm text-gray-600 mt-1">當前審查輪次的問題與驗證統計</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ totalIssues }}</div>
            <div class="text-xs text-gray-500">問題</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ totalVerifications }}
            </div>
            <div class="text-xs text-gray-500">已驗證</div>
          </div>
        </div>
      </div>
    </template>

    <!-- Content Tabs -->
    <UTabs :items="tabItems">
      <template #issues>
        <CompanyApplicationReviewSummaryIssuesTab />
      </template>

      <template #verifications>
        <CompanyApplicationReviewSummaryVerificationsTab />
      </template>

      <template #submit>
        <CompanyApplicationReviewSummarySubmitTab />
      </template>
    </UTabs>
  </UCard>
</template>

<script setup lang="ts">
import { useCompanyApplicationReviewStore } from "./useCompanyApplicationReviewStore";

const reviewStore = useCompanyApplicationReviewStore();
const { totalIssues, totalVerifications } = storeToRefs(reviewStore);

const tabItems = computed(() => [
  {
    key: "issues",
    label: "問題",
    slot: "issues",
    badge: totalIssues.value > 0 ? String(totalIssues.value) : undefined,
  },
  {
    key: "verifications",
    label: "已驗證",
    slot: "verifications",
    badge:
      totalVerifications.value > 0
        ? String(totalVerifications.value)
        : undefined,
  },
  {
    key: "submit",
    label: "提交審查",
    slot: "submit",
  },
]);
</script>
