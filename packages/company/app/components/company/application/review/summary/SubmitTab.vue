<template>
  <div class="space-y-6">
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <UIcon
          name="i-heroicons-information-circle"
          class="size-5 text-blue-600 mt-0.5"
        />
        <div>
          <h4 class="font-medium text-blue-900">提交審查輪次</h4>
          <p class="text-sm text-blue-800 mt-1">
            提交後將創建新的審查輪次，客戶將收到通知並可根據問題進行修正。
          </p>
        </div>
      </div>
    </div>

    <UForm
      :schema="reviewRoundSchema"
      :state="submitForm"
      @submit="onSubmitReview"
    >
      <div class="space-y-4">
        <UFormField label="審查狀態" name="applicationStatus" required>
          <USelect
            v-model="submitForm.applicationStatus"
            :items="statusItems"
            placeholder="選擇審查狀態"
          />
        </UFormField>

        <UFormField label="審查總結" name="summary">
          <UTextarea
            v-model="submitForm.summary"
            placeholder="輸入本輪審查的總結說明..."
            :rows="4"
          />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <UButton color="neutral" variant="outline" @click="resetForm">
            重置
          </UButton>
          <UButton
            type="submit"
            :loading="isSubmitting"
            :disabled="!canSubmitForm"
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

const reviewStore = useCompanyApplicationReviewStore();
const {
  isSubmitting,
  totalIssues,
  totalVerifications,
  submitForm,
  canSubmitForm,
} = storeToRefs(reviewStore);

const statusItems: {
  label: string;
  value: ApplicationStatus;
}[] = [
  { value: "submitted" as const, label: "已提交" },
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
