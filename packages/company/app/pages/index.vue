<template>
  <UContainer>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <h1
            class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight"
          >
            專業的公司登記管理解決方案
          </h1>
          <p
            class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            簡化公司設立流程，提供完整的文件管理系統，讓您的公司登記過程更加順暢
          </p>
          <div
            class="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <UButton
              size="xl"
              color="primary"
              to="/apply"
              class="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              開始使用
            </UButton>
            <UButton
              size="xl"
              color="neutral"
              variant="outline"
              to="/"
              class="px-8 py-4 text-lg font-semibold border-2 hover:bg-white/50 transition-all duration-300"
            >
              聯絡我們
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2
            class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6"
          >
            主要功能
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            我們提供全方位的公司登記服務，讓您的創業之路更加順暢
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <UCard
            class="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
          >
            <template #header>
              <div class="flex items-center gap-3">
                <div
                  class="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300"
                >
                  <UIcon
                    name="i-heroicons-document-text"
                    class="text-white text-xl"
                  />
                </div>
                <h3 class="text-xl font-semibold text-gray-900">文件管理</h3>
              </div>
            </template>
            <p class="text-gray-600 leading-relaxed">
              完整的文件上傳與管理系統，支援多種文件格式，確保資料安全
            </p>
          </UCard>

          <UCard
            class="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
          >
            <template #header>
              <div class="flex items-center gap-3">
                <div
                  class="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300"
                >
                  <UIcon
                    name="i-heroicons-chart-bar"
                    class="text-white text-xl"
                  />
                </div>
                <h3 class="text-xl font-semibold text-gray-900">進度追蹤</h3>
              </div>
            </template>
            <p class="text-gray-600 leading-relaxed">
              即時追蹤申請進度，掌握每個階段的處理狀態
            </p>
          </UCard>

          <UCard
            class="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
          >
            <template #header>
              <div class="flex items-center gap-3">
                <div
                  class="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300"
                >
                  <UIcon
                    name="i-heroicons-shield-check"
                    class="text-white text-xl"
                  />
                </div>
                <h3 class="text-xl font-semibold text-gray-900">安全可靠</h3>
              </div>
            </template>
            <p class="text-gray-600 leading-relaxed">
              採用先進的加密技術，確保您的資料安全無虞
            </p>
          </UCard>
        </div>
      </div>
    </section>
  </UContainer>
</template>
