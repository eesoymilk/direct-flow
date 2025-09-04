<template>
  <div class="space-y-4">
    <div v-if="totalVerifications === 0" class="text-center py-8 text-gray-500">
      <UIcon
        name="i-heroicons-question-mark-circle"
        class="size-12 mx-auto mb-2 text-gray-400"
      />
      <p>尚未驗證任何項目</p>
    </div>

    <div v-else>
      <div
        v-for="(sectionVerifications, sectionKey) in verificationsBySection"
        :key="sectionKey"
        class="space-y-2"
      >
        <h4 class="font-medium text-gray-900 flex items-center gap-2">
          <UIcon
            name="i-heroicons-check-circle"
            class="size-4 text-green-500"
          />
          {{ getSectionName(sectionKey) }}
          <UBadge
            :label="String(sectionVerifications.length)"
            color="success"
            variant="subtle"
          />
        </h4>
        <div class="space-y-2 ml-6">
          <div
            v-for="verification in sectionVerifications"
            :key="verification.fieldPath"
            class="p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="font-medium text-green-900">
                  {{ getFieldDisplayName(verification.fieldPath) }}
                </p>
                <p v-if="verification.note" class="text-sm text-green-600 mt-1">
                  {{ verification.note }}
                </p>
              </div>
              <UIcon
                name="i-heroicons-check-badge"
                class="size-5 text-green-500"
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
} from "~/components/company/application/helpers";

const reviewStore = useCompanyApplicationReviewStore();
const { totalVerifications, verificationsBySection } = storeToRefs(reviewStore);
</script>
