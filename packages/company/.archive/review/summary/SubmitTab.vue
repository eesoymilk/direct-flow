<template>
  <div class="space-y-6">
    <!-- General Info -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <UIcon
          name="i-heroicons-information-circle"
          class="size-5 text-blue-600 mt-0.5"
        />
        <div>
          <h4 class="font-medium text-blue-900">提交審查輪次</h4>
          <p class="text-sm text-blue-800 mt-1">
            {{
              isFirstReviewRound
                ? "首次審查完成後，客戶將收到通知並可根據問題進行修正，同時需要上傳必要文件。"
                : "提交後將創建新的審查輪次，客戶將收到通知並可根據問題進行修正。"
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Validation Summary -->
    <div
      v-if="!canSubmitReviewRound"
      class="bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <div class="flex items-start gap-3">
        <UIcon name="i-heroicons-x-circle" class="size-5 text-red-600 mt-0.5" />
        <div class="w-full">
          <h4 class="font-medium text-red-900">無法提交審查</h4>
          <div class="text-sm text-red-800 mt-2 space-y-2">
            <div v-if="submissionValidation.errors.length > 0">
              <p class="font-medium">必須解決的問題：</p>
              <ul class="list-disc list-inside space-y-1 mt-1">
                <li v-for="error in submissionValidation.errors" :key="error">
                  {{ error }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Warnings (non-blocking) -->
    <div
      v-if="submissionValidation.warnings.length > 0"
      class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
    >
      <div class="flex items-start gap-3">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="size-5 text-yellow-600 mt-0.5"
        />
        <div class="w-full">
          <h4 class="font-medium text-yellow-900">建議處理</h4>
          <div class="text-sm text-yellow-800 mt-2 space-y-2">
            <ul class="list-disc list-inside space-y-1">
              <li
                v-for="warning in submissionValidation.warnings"
                :key="warning"
              >
                {{ warning }}
              </li>
            </ul>
            <p class="text-xs mt-2 opacity-75">
              這些項目不會阻止提交，但建議處理以確保審查完整性
            </p>
          </div>
        </div>
      </div>
    </div>

    <UForm
      :schema="reviewRoundSchema"
      :state="reviewRoundFormState"
      @submit="onSubmitReview"
    >
      <div class="space-y-4">
        <UFormField label="審查狀態" name="applicationStatus" required>
          <USelect
            v-model="reviewRoundFormState.applicationStatus"
            :items="statusItems"
            placeholder="選擇審查狀態"
            class="w-full"
          />
        </UFormField>

        <UFormField label="審查總結" name="summary">
          <UTextarea
            v-model="reviewRoundFormState.summary"
            placeholder="輸入本輪審查的總結說明..."
            :rows="4"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <UButton color="neutral" variant="outline" @click="resetForm">
            重置
          </UButton>
          <UButton
            type="submit"
            :loading="isSubmitting"
            :disabled="!canSubmitReviewRound"
          >
            提交審查輪次
          </UButton>
        </div>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent, SelectItem } from "@nuxt/ui";
import { useCompanyApplicationReviewStore } from "../useCompanyApplicationReviewStore";

const reviewStore = useCompanyApplicationReviewStore();
const {
  isSubmitting,
  totalIssues,
  totalVerifications,
  isFirstReviewRound,
  canSubmitReviewRound,
  submissionValidation,
  reviewRoundFormState,
} = storeToRefs(reviewStore);

const statusItems: {
  label: string;
  value: ApplicationStatus;
}[] = [
  // application status of submitted is not allowed to be selected since it is the initial status when the application is submitted by a client
  { value: "staff_review" as const, label: "待審查" },
  { value: "pending_client_update" as const, label: "待更新" },
  { value: "filing" as const, label: "待核准" },
  { value: "filed" as const, label: "已核准" },
  { value: "approved" as const, label: "已核准" },
  { value: "rejected" as const, label: "已拒絕" },
] satisfies SelectItem[];

// Actions
const onSubmitReview = async (event: FormSubmitEvent<ReviewRoundSchema>) => {
  try {
    // Use store action for submission (form state is managed by store)
    await reviewStore.submitReviewRound();

    // Show success message
    const toast = useToast();
    toast.add({
      title: "審查輪次已提交",
      description: `已成功提交審查，共 ${totalIssues.value} 個問題，${totalVerifications.value} 個驗證項目`,
      color: "success",
    });
  } catch (error) {
    console.error("Failed to submit review:", error);
    const toast = useToast();
    toast.add({
      title: "提交失敗",
      description: "審查輪次提交失敗，請稍後再試",
      color: "error",
    });
  }
};

// Reset form action is now in the store
const resetForm = () => {
  reviewStore.resetSubmitForm();
};
</script>
