<template>
  <UForm :state="reviewStore.reviewRound" @submit="handleSubmit">
    <UCard class="bg-gradient-to-br from-slate-50 to-slate-100">
      <!-- Header -->
      <template #header>
        <div class="flex items-center gap-3">
          <div
            class="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg"
          >
            <UIcon
              name="i-lucide-clipboard-check"
              :size="20"
              class="text-white"
            />
          </div>
          <div>
            <h3 class="text-xl font-semibold text-slate-800">審核決定</h3>
            <p class="text-sm text-slate-500">完成審核並做出決定</p>
          </div>
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
          <UFormField label="審核決定" name="status">
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
              v-model="selectedStatus"
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
        <div>
          <!-- Validation Warning -->
          <div
            v-if="!validation.isComplete && selectedStatus === 'approved'"
            class="mb-4"
          >
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
              :loading="submitting"
              :disabled="!selectedStatus || submitting"
              size="lg"
              :color="
                selectedStatus === 'approved'
                  ? 'success'
                  : selectedStatus === 'rejected'
                    ? 'error'
                    : 'info'
              "
              :variant="selectedStatus ? 'solid' : 'outline'"
            >
              <template #leading>
                <UIcon :name="getSubmitIcon()" class="w-4 h-4" />
              </template>
              {{ getSubmitText() }}
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </UForm>
</template>

<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";

const route = useRoute();
const reviewStore = useCompanyApplicationReviewStore();
const toast = useToast();

// State
const submitting = ref(false);
const selectedStatus = ref<"approved" | "rejected" | "filing" | null>(null);

// Computed properties
const validation = computed(() => reviewStore.validateReviewCompletion());

// Status options for the select
const statusOptions = computed(
  () =>
    [
      {
        label: "✅ 核准申請",
        value: "approved",
        disabled: !validation.value.isComplete,
      },
      {
        label: "❌ 拒絕申請",
        value: "rejected",
      },
      {
        label: "📝 要求客戶更新",
        value: "filing",
      },
    ] as SelectItem[]
);

// Status information for display
const selectedStatusInfo = computed(() => {
  if (!selectedStatus.value) return null;

  const statusInfo = {
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
      title: "要求客戶更新",
      description: "申請將退回給客戶修正，客戶將收到需要修正的項目清單。",
      icon: "i-lucide-edit",
      iconClass: "text-blue-600",
      textClass: "text-blue-800",
      bgClass: "bg-blue-50 border-blue-200",
    },
  };

  return statusInfo[selectedStatus.value];
});

// Helper methods
const getSubmitIcon = () => {
  if (!selectedStatus.value) return "i-lucide-send";

  const icons = {
    approved: "i-lucide-check",
    rejected: "i-lucide-x",
    filing: "i-lucide-edit",
  };

  return icons[selectedStatus.value];
};

const getSubmitText = () => {
  if (!selectedStatus.value) return "請先選擇審核結果";

  const texts = {
    approved: "核准申請",
    rejected: "拒絕申請",
    filing: "退回修正",
  };

  return texts[selectedStatus.value];
};

// Action handler
const handleSubmit = async () => {
  if (!selectedStatus.value) return;

  // Check validation for approval
  if (selectedStatus.value === "approved" && !validation.value.isComplete) {
    toast.add({
      title: "無法核准申請",
      description: `還有 ${validation.value.pendingCount} 個項目待審核，請完成所有項目審核後再核准申請。`,
    });
    return;
  }

  submitting.value = true;

  try {
    const applicationId = route.params.id as string;
    const result = await reviewStore.submitReviewRound(
      applicationId,
      selectedStatus.value
    );

    toast.add({
      title: "審核提交成功",
      description: `審核輪次 ${result?.reviewRound?.roundNo || "新"} 已成功提交`,
    });

    // Navigate back to applications list
    navigateTo("/applications");
  } catch (error: any) {
    console.error("Error submitting review:", error);

    toast.add({
      title: "提交失敗",
      description: error.message || "審核提交時發生錯誤，請重試",
    });
  } finally {
    submitting.value = false;
  }
};
</script>
