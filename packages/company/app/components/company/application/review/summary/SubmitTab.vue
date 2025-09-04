<template>
  <div class="space-y-6">
    <!-- First Review Round Requirements -->
    <div
      v-if="isFirstReviewRound"
      class="bg-amber-50 border border-amber-200 rounded-lg p-4"
    >
      <div class="flex items-start gap-3">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="size-5 text-amber-600 mt-0.5"
        />
        <div>
          <h4 class="font-medium text-amber-900">首次審查要求</h4>
          <p class="text-sm text-amber-800 mt-1">
            這是首次審查輪次，需要完成工作人員專用欄位設定。
          </p>

          <!-- Staff Fields Validation -->
          <div class="mt-3 space-y-2">
            <div class="flex items-center gap-2">
              <UIcon
                :name="
                  hasChosenName
                    ? 'i-heroicons-check-circle'
                    : 'i-heroicons-x-circle'
                "
                :class="hasChosenName ? 'text-green-600' : 'text-red-600'"
                class="size-4"
              />
              <span
                :class="hasChosenName ? 'text-green-800' : 'text-red-800'"
                class="text-sm"
              >
                選定公司名稱
                {{ hasChosenName ? "已完成" : "(必填或選擇稍後處理)" }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon
                :name="
                  hasBusinessItems
                    ? 'i-heroicons-check-circle'
                    : 'i-heroicons-x-circle'
                "
                :class="hasBusinessItems ? 'text-green-600' : 'text-red-600'"
                class="size-4"
              />
              <span
                :class="hasBusinessItems ? 'text-green-800' : 'text-red-800'"
                class="text-sm"
              >
                營業項目編碼
                {{ hasBusinessItems ? "已完成" : "(必填或選擇稍後處理)" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

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
      v-if="!canSubmitForm"
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

    <!-- Auto-create missing document issues button -->
    <div
      v-if="isFirstReviewRound"
      class="bg-blue-50 border border-blue-200 rounded-lg p-4"
    >
      <div class="flex items-start gap-3">
        <UIcon
          name="i-heroicons-document-plus"
          class="size-5 text-blue-600 mt-0.5"
        />
        <div class="flex-1">
          <h4 class="font-medium text-blue-900">文件審查助手</h4>
          <p class="text-sm text-blue-800 mt-1">
            首次審查時，系統可自動為缺失的文件創建問題標記
          </p>
          <UButton
            size="sm"
            color="primary"
            variant="outline"
            class="mt-3"
            @click="autoCreateMissingDocumentIssues"
          >
            自動標記缺失文件
          </UButton>
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
  isFirstReviewRound,
  hasChosenName,
  hasBusinessItems,
  hasAllStaffProvidedFields,
  submissionValidation,
} = storeToRefs(reviewStore);

// Access the auto-create function from the store
const { autoCreateMissingDocumentIssues } = reviewStore;

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
