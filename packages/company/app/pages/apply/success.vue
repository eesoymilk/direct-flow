<template>
  <!-- TODO: Make this page prettier -->
  <UContainer class="py-8">
    <div class="text-center space-y-6">
      <!-- Success Icon -->
      <div class="flex justify-center">
        <div
          class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
        >
          <UIcon
            name="i-lucide-check-circle"
            class="w-12 h-12 text-green-600"
          />
        </div>
      </div>

      <!-- Success Message -->
      <div class="space-y-4">
        <h1 class="text-3xl font-bold text-gray-900">申請提交成功</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          您的公司設立申請已成功提交。我們的專業團隊會盡快審核您的申請，並在處理完成後與您聯繫。
        </p>
      </div>

      <!-- Application Details -->
      <div class="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">申請資訊</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <p class="text-sm text-gray-500">申請編號</p>
            <p class="font-medium">{{ applicationId || "處理中..." }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">提交時間</p>
            <p class="font-medium">{{ submissionTime }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">申請狀態</p>
            <p class="font-medium text-blue-600">已提交</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">預計處理時間</p>
            <p class="font-medium">3-5 個工作天</p>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">後續步驟</h2>
        <ul class="text-left space-y-3">
          <li class="flex items-start gap-3">
            <UIcon name="i-lucide-clock" class="w-5 h-5 text-blue-600 mt-0.5" />
            <span>我們會在 1-2 個工作天內完成初步審核</span>
          </li>
          <li class="flex items-start gap-3">
            <UIcon name="i-lucide-mail" class="w-5 h-5 text-blue-600 mt-0.5" />
            <span>審核結果會透過電子郵件通知您</span>
          </li>
          <li class="flex items-start gap-3">
            <UIcon name="i-lucide-phone" class="w-5 h-5 text-blue-600 mt-0.5" />
            <span>如有任何問題，請聯繫我們的客服團隊</span>
          </li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <UButton color="primary" size="lg" @click="navigateTo('/')">
          返回首頁
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          @click="navigateTo('/apply')"
        >
          提交新申請
        </UButton>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
// Get application ID from route query if available
const route = useRoute();
const applicationId = route.query.id as string;

// Format submission time
const submissionTime = new Date().toLocaleString("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});
</script>
