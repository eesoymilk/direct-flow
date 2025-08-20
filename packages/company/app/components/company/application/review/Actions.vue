<template>
  <UForm
    :state="reviewStore.reviewRound"
    :schema="reviewStore.reviewRoundSchema"
    @submit="handleSubmit"
    @error="handleError"
  >
    <UCard class="bg-gradient-to-br from-slate-50 to-slate-100">
      <!-- Header -->
      <template #header>
        <div class="flex items-center justify-start gap-2">
          <UIcon
            name="i-lucide-clipboard-check"
            :size="20"
            class="text-white bg-blue-500 rounded-lg"
          />
          <h3 class="text-lg text-slate-800">審核決定</h3>
        </div>
      </template>
      <div class="grid gap-6 md:grid-cols-3">
        <!-- Review Summary -->
        <div class="space-y-3 md:col-span-2">
          <UFormField label="審核摘要" name="summary">
            <template #label="{ label }">
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-file-text"
                  class="w-4 h-4 text-slate-400"
                />
                <span>
                  {{ label }}
                </span>
              </div>
            </template>
            <UTextarea
              v-model="reviewStore.reviewRound.summary"
              name="summary"
              placeholder="請描述審核過程中發現的問題、建議或結論..."
              class="w-full"
              :rows="5"
              autoresize
            />
          </UFormField>
        </div>

        <!-- Review Status -->
        <div class="space-y-3 md:col-span-1">
          <UFormField label="申請進度" name="applicationStatus">
            <template #label="{ label }">
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-shield-check"
                  class="w-4 h-4 text-slate-400"
                />
                <span>
                  {{ label }}
                </span>
              </div>
            </template>
            <USelect
              v-model="reviewStore.reviewRound.applicationStatus"
              :items="statusOptions"
              placeholder="請選擇審核結果..."
              :loading="submitting"
              :disabled="submitting"
              class="w-full"
            />
          </UFormField>

          <!-- Status Description -->
          <div
            v-if="selectedStatusInfo"
            class="p-4 rounded-lg border"
            :class="selectedStatusInfo.bgClass"
          >
            <div class="flex items-start gap-3">
              <UIcon
                :name="selectedStatusInfo.icon"
                class="w-5 h-5 mt-0.5"
                :class="selectedStatusInfo.iconClass"
              />
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-medium"
                  :class="selectedStatusInfo.textClass"
                >
                  {{ selectedStatusInfo.title }}
                </p>
                <p
                  class="text-sm opacity-90 mt-1"
                  :class="selectedStatusInfo.textClass"
                >
                  {{ selectedStatusInfo.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Section -->
      <template #footer>
        <!-- Validation Warning -->
        <div v-if="!validation.isComplete">
          <div
            class="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <UIcon
              name="i-lucide-alert-triangle"
              class="w-5 h-5 text-amber-600"
            />
            <div class="flex-1">
              <p class="text-sm font-medium text-amber-800">無法核准申請</p>
              <p class="text-sm text-amber-700">
                還有
                {{ validation.pendingCount }}
                個項目待審核，請完成所有項目審核後再核准申請
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 text-sm text-slate-500">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-green-400"></div>
              <span
                >{{
                  reviewStore.allEntries.filter((e) => e.state === "verified")
                    .length
                }}
                已驗證</span
              >
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-red-400"></div>
              <span>{{ reviewStore.entriesWithIssues.length }} 有問題</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-orange-400"></div>
              <span>{{ reviewStore.entriesUnderReview.length }} 待審核</span>
            </div>
          </div>

          <UButton
            type="submit"
            icon="i-lucide-send"
            label="提交審核"
            :loading="submitting"
            :disabled="!reviewStore.reviewRound.applicationStatus || submitting"
            size="lg"
            :variant="
              reviewStore.reviewRound.applicationStatus ? 'solid' : 'outline'
            "
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>

<script setup lang="ts">
import type { FormErrorEvent, SelectItem } from "@nuxt/ui";

const route = useRoute();
const toast = useToast();
const reviewStore = useCompanyApplicationReviewStore();

const submitting = ref(false);

const validation = computed(() => reviewStore.validateReviewCompletion());

const statusOptions = computed(
  () =>
    [
      {
        label: "審核中",
        value: "staff_review",
      },
      {
        label: "待客戶更新",
        value: "pending_client_update",
      },
      {
        label: "政府部門審核中",
        value: "filing",
      },
      {
        label: "已立案",
        value: "filed",
      },
      {
        label: "拒絕申請",
        value: "rejected",
      },
      {
        label: "核准申請",
        value: "approved",
      },
    ] as SelectItem[]
);

const selectedStatusInfo = computed(() => {
  if (!reviewStore.reviewRound.applicationStatus) return null;

  const statusInfo = {
    submitted: {
      title: "已提交",
      description: "申請已提交，請等待審核。",
      icon: "i-lucide-file-text",
      iconClass: "text-slate-600",
      textClass: "text-slate-800",
      bgClass: "bg-slate-50 border-slate-200",
    },
    staff_review: {
      title: "審核中",
      description: "申請正在審核中，請等待審核結果。",
      icon: "i-lucide-clock",
      iconClass: "text-yellow-600",
      textClass: "text-yellow-800",
      bgClass: "bg-yellow-50 border-yellow-200",
    },
    pending_client_update: {
      title: "待客戶更新",
      description: "申請需要客戶更新資料，請等待客戶更新後再審核。",
      icon: "i-lucide-edit",
      iconClass: "text-blue-600",
      textClass: "text-blue-800",
      bgClass: "bg-blue-50 border-blue-200",
    },
    approved: {
      title: "核准申請",
      description: "申請將被標記為已核准，客戶將收到核准通知。",
      icon: "i-lucide-check-circle",
      iconClass: "text-green-600",
      textClass: "text-green-800",
      bgClass: "bg-green-50 border-green-200",
    },
    rejected: {
      title: "拒絕申請",
      description: "申請將被拒絕，客戶將收到拒絕通知及詳細原因。",
      icon: "i-lucide-x-circle",
      iconClass: "text-red-600",
      textClass: "text-red-800",
      bgClass: "bg-red-50 border-red-200",
    },
    filing: {
      title: "政府部門審核中",
      description: "申請已提交至政府部門審核，請等待審核結果。",
      icon: "i-lucide-edit",
      iconClass: "text-blue-600",
      textClass: "text-blue-800",
      bgClass: "bg-blue-50 border-blue-200",
    },
    filed: {
      title: "已立案",
      description: "申請已立案，請等待政府部門審核。",
      icon: "i-lucide-file-text",
      iconClass: "text-slate-600",
      textClass: "text-slate-800",
      bgClass: "bg-slate-50 border-slate-200",
    },
  };

  return statusInfo[reviewStore.reviewRound.applicationStatus];
});

const handleSubmit = async () => {
  if (!validation.value.isComplete) {
    toast.add({
      title: "無法核准申請",
      color: "error",
      description: `還有 ${validation.value.pendingCount} 個項目待審核，請完成所有項目審核後再核准申請。`,
    });
    return;
  }

  try {
    submitting.value = true;
    const applicationId = route.params.id as string;
    const result = await reviewStore.submitReviewRound(applicationId);

    toast.add({
      title: "審核提交成功",
      color: "success",
      description: `審核輪次 ${result?.reviewRound?.roundNo || "新"} 已成功提交`,
    });

    // Navigate back to applications list
    navigateTo("/applications");
  } catch (error: any) {
    console.error("Review submission error:", error);

    // Handle different types of errors
    let errorTitle = "審核提交失敗";
    let errorDescription = "發生未知錯誤，請重試";
    let errorColor: "error" | "warning" | "info" = "error";

    if (error?.data?.statusCode) {
      switch (error.data.statusCode) {
        case 400:
          errorTitle = "請求錯誤";
          errorDescription = error.data.statusMessage || "請檢查輸入資料";
          break;
        case 401:
          errorTitle = "未經授權";
          errorDescription = "請重新登入後再試";
          break;
        case 404:
          errorTitle = "申請不存在";
          errorDescription = "找不到指定的申請案件";
          break;
        case 500:
          errorTitle = "伺服器錯誤";
          errorDescription =
            error.data.statusMessage ||
            "伺服器處理時發生錯誤，請聯繫系統管理員";
          break;
        default:
          errorDescription = error.data.statusMessage || errorDescription;
      }
    } else if (error?.message) {
      errorDescription = error.message;
    }

    toast.add({
      title: errorTitle,
      description: errorDescription,
      color: errorColor,
    });
  } finally {
    submitting.value = false;
  }
};

const handleError = (payload: FormErrorEvent) => {
  console.log(payload);
  const errorMessage = payload.errors.map((error) => error.message).join("\n");
  toast.add({
    title: "提交失敗",
    description: errorMessage || "審核提交時發生錯誤，請重試",
  });
};
</script>
