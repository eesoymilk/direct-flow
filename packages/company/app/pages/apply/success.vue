<template>
  <UContainer class="py-8 space-y-8">
    <!-- Header -->
    <div class="text-center">
      <UBadge
        icon="i-lucide-check-circle-2"
        label="申請成功"
        color="success"
        variant="subtle"
        class="mb-4"
      />
      <h1 class="text-4xl font-bold text-gray-900 mb-3">申請提交成功</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        您的公司設立申請已成功提交。我們的專業團隊會盡快審核您的申請，並在處理完成後與您聯繫。
      </p>
    </div>

    <!-- Success Icon with Animation -->
    <div class="flex justify-center">
      <SuccessIconWithRingAnimation />
    </div>

    <!-- Application Details Card -->
    <UCard
      class="ring-1 ring-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon
              name="i-lucide-clipboard-list"
              class="w-6 h-6 text-blue-600"
            />
            <h3 class="text-xl font-bold text-gray-900">申請資訊</h3>
          </div>
          <UBadge
            label="處理中"
            color="primary"
            variant="soft"
            icon="i-lucide-clock"
          />
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-500 tracking-wide">
            申請編號
          </label>
          <p
            class="text-lg font-bold text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded"
          >
            {{ applicationId || "處理中..." }}
          </p>
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-500 tracking-wide">
            提交時間
          </label>
          <p class="text-lg font-bold text-gray-900">
            {{ submissionTime }}
          </p>
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-500 tracking-wide">
            申請狀態
          </label>
          <div class="flex items-center gap-2">
            <UBadge
              label="已提交"
              color="success"
              variant="soft"
              icon="i-lucide-check"
              size="lg"
            />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-500 tracking-wide">
            預計處理時間
          </label>
          <p class="text-lg font-bold text-gray-900">3-5 個工作天</p>
        </div>
      </div>
    </UCard>

    <!-- Next Steps Card -->
    <UCard
      class="ring-1 ring-blue-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-route" class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-bold text-gray-900">後續步驟</h3>
        </div>
      </template>

      <div class="space-y-4">
        <div
          class="flex items-start gap-4 p-4 bg-white/60 rounded-lg border border-blue-100"
        >
          <div class="p-2 bg-blue-100 rounded-lg">
            <UIcon name="i-lucide-clock" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-1">初步審核</h4>
            <p class="text-gray-600">我們會在 1-2 個工作天內完成初步審核</p>
          </div>
        </div>

        <div
          class="flex items-start gap-4 p-4 bg-white/60 rounded-lg border border-blue-100"
        >
          <div class="p-2 bg-green-100 rounded-lg">
            <UIcon name="i-lucide-mail" class="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-1">結果通知</h4>
            <p class="text-gray-600">審核結果會透過電子郵件通知您</p>
          </div>
        </div>

        <div
          class="flex items-start gap-4 p-4 bg-white/60 rounded-lg border border-blue-100"
        >
          <div class="p-2 bg-purple-100 rounded-lg">
            <UIcon name="i-lucide-phone" class="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-1">客服支援</h4>
            <p class="text-gray-600">如有任何問題，請聯繫我們的客服團隊</p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Important Notice -->
    <UAlert
      icon="i-lucide-info"
      color="primary"
      variant="soft"
      title="重要提醒"
      description="請保留此頁面資訊作為申請記錄。我們會透過您提供的聯絡方式與您保持溝通。"
      class="border-2 border-blue-200"
    />

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-6 justify-center pt-8">
      <UButton
        label="返回首頁"
        color="primary"
        size="xl"
        icon="i-lucide-home"
        class="min-w-[200px] shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        @click="navigateTo('/')"
      />
      <UButton
        label="提交新申請"
        color="neutral"
        variant="outline"
        size="xl"
        icon="i-lucide-plus-circle"
        class="min-w-[200px] shadow-md hover:shadow-lg transition-shadow"
        @click="navigateTo('/apply')"
      />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { format } from "date-fns";

definePageMeta({
  middleware: "apply-success",
});

const route = useRoute();
const applicationStore = useCompanyApplicationStore();

// Get application ID from query params or store
const applicationId =
  (route.query.id as string) || applicationStore.submissionState.applicationId;

// Get submission time from query params, store, or fallback to current time
const submissionTime = computed(() => {
  const submissionTimeRaw =
    (route.query.submitted as string) ||
    applicationStore.submissionState.submissionTime ||
    new Date().toISOString();

  return format(new Date(submissionTimeRaw), "yyyy/MM/dd HH:mm");
});
</script>
