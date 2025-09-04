<template>
  <div class="space-y-4">
    <div v-if="totalIssues === 0" class="text-center py-8 text-gray-500">
      <UIcon
        name="i-heroicons-check-circle"
        class="size-12 mx-auto mb-2 text-green-500"
      />
      <p>目前沒有發現任何問題</p>
    </div>

    <div class="space-y-4" v-else>
      <div
        v-for="(sectionIssues, sectionKey) in issuesBySection"
        :key="sectionKey"
        class="space-y-2"
      >
        <h4 class="font-medium text-gray-900 flex items-center gap-2">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="size-4 text-red-500"
          />
          {{ getSectionName(sectionKey) }}
          <UBadge
            :label="String(sectionIssues.length)"
            color="error"
            variant="subtle"
          />
        </h4>
        <div class="space-y-2">
          <div
            v-for="issue in sectionIssues"
            :key="issue.fieldPath"
            class="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="font-medium text-red-900">
                  {{ getFieldDisplayName(issue.fieldPath) }}
                </p>
                <p class="text-sm text-red-700 mt-1">
                  {{ getIssueTypeLabel(issue.issueType) }}
                </p>
                <p v-if="issue.description" class="text-sm text-red-600 mt-1">
                  {{ issue.description }}
                </p>
              </div>
              <UBadge
                :label="getSeverityLabel(issue.severity)"
                :color="getSeverityColor(issue.severity)"
                variant="subtle"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getSectionName,
  getFieldDisplayName,
  getIssueTypeLabel,
  getSeverityLabel,
  getSeverityColor,
} from "~/components/company/application/helpers";
import { useCompanyApplicationReviewStore } from "../useCompanyApplicationReviewStore";

const reviewStore = useCompanyApplicationReviewStore();
const { totalIssues, issuesBySection } = storeToRefs(reviewStore);
</script>
