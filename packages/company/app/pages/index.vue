<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-b from-primary-50 to-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            專業的公司登記管理解決方案
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            簡化公司設立流程，提供完整的文件管理系統，讓您的公司登記過程更加順暢
          </p>
          <div class="flex gap-4 justify-center">
            <UButton size="xl" color="primary" to="/register">
              開始使用
            </UButton>
            <UButton size="xl" color="neutral" variant="ghost" to="/contact">
              聯絡我們
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">主要功能</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-document-text"
                  class="text-primary-500"
                />
                <h3 class="text-xl font-semibold">文件管理</h3>
              </div>
            </template>
            <p class="text-gray-600">
              完整的文件上傳與管理系統，支援多種文件格式，確保資料安全
            </p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-chart-bar" class="text-primary-500" />
                <h3 class="text-xl font-semibold">進度追蹤</h3>
              </div>
            </template>
            <p class="text-gray-600">
              即時追蹤申請進度，掌握每個階段的處理狀態
            </p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-shield-check"
                  class="text-primary-500"
                />
                <h3 class="text-xl font-semibold">安全可靠</h3>
              </div>
            </template>
            <p class="text-gray-600">
              採用先進的加密技術，確保您的資料安全無虞
            </p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary-50 py-20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">準備好開始了嗎？</h2>
        <p class="text-xl text-gray-600 mb-8">
          立即註冊，體驗專業的公司登記管理系統
        </p>
        <UButton size="xl" color="primary" to="/register"> 免費註冊 </UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
