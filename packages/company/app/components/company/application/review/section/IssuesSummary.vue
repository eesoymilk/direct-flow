<template>
  <UAlert
    v-if="issues.length > 0"
    color="error"
    variant="soft"
    :title="`發現問題 (${issues.length})`"
    icon="i-lucide-alert-triangle"
  >
    <template #description>
      <div class="space-y-3 mt-3">
        <UCard v-for="issue in issues" :key="issue.fieldPath" class="bg-white">
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <div class="font-medium text-sm">
                {{ getFieldLabel(issue.fieldPath) }}
              </div>
              <UBadge
                :label="`${issue.issueType} - ${issue.severity}`"
                color="error"
                variant="soft"
                size="xs"
              />
              <p v-if="issue.description" class="text-sm text-gray-600">
                {{ issue.description }}
              </p>
            </div>
            <UButton
              color="error"
              variant="ghost"
              size="xs"
              icon="i-lucide-x"
              @click="reviewStore.removeIssue(issue.fieldPath)"
            />
          </div>
        </UCard>
      </div>
    </template>
  </UAlert>
</template>

<script setup lang="ts">
defineProps<{ issues: ReviewIssueSchema[] }>();
const reviewStore = useCompanyApplicationReviewStore();
</script>
