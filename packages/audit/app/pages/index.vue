<template>
  <UContainer>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <h1
            class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight"
          >
            專業的審計財報管理解決方案
          </h1>
          <p
            class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            為會計師事務所量身打造的智能審計平台，提升查核效率，確保財務報表品質
          </p>
          <div
            class="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <UButton
              size="xl"
              color="primary"
              to="/builder"
              class="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              財報建構器
            </UButton>
          </div>

          <!-- Feature Badges -->
          <div class="flex flex-wrap gap-4 justify-center pt-8">
            <div
              class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
            >
              <UIcon name="i-lucide-shield-check" class="text-green-600" />
              <span class="text-sm font-medium text-gray-700"
                >符合審計準則</span
              >
            </div>
            <div
              class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
            >
              <UIcon name="i-lucide-zap" class="text-blue-600" />
              <span class="text-sm font-medium text-gray-700">AI 輔助查核</span>
            </div>
            <div
              class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
            >
              <UIcon name="i-lucide-lock" class="text-purple-600" />
              <span class="text-sm font-medium text-gray-700">資安保護</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Stats Dashboard -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2
            class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4"
          >
            系統概況
          </h2>
          <p class="text-lg text-gray-600">即時掌握審計工作進度</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <UCard
            class="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
          >
            <div class="p-6 text-center">
              <div class="mb-4">
                <UIcon
                  name="i-lucide-users"
                  class="h-12 w-12 mx-auto text-blue-600 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p class="text-sm font-medium text-gray-600 mb-2">待審客戶</p>
              <p
                class="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors"
              >
                {{ stats.pendingClients }}
              </p>
            </div>
          </UCard>

          <UCard
            class="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
          >
            <div class="p-6 text-center">
              <div class="mb-4">
                <UIcon
                  name="i-lucide-check-circle"
                  class="h-12 w-12 mx-auto text-green-600 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p class="text-sm font-medium text-gray-600 mb-2">本月完成</p>
              <p
                class="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors"
              >
                {{ stats.completedAudits }}
              </p>
            </div>
          </UCard>

          <UCard
            class="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
          >
            <div class="p-6 text-center">
              <div class="mb-4">
                <UIcon
                  name="i-lucide-alert-triangle"
                  class="h-12 w-12 mx-auto text-orange-600 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p class="text-sm font-medium text-gray-600 mb-2">風險提醒</p>
              <p
                class="text-3xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors"
              >
                {{ stats.riskAlerts }}
              </p>
            </div>
          </UCard>

          <UCard
            class="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
          >
            <div class="p-6 text-center">
              <div class="mb-4">
                <UIcon
                  name="i-lucide-trending-up"
                  class="h-12 w-12 mx-auto text-purple-600 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p class="text-sm font-medium text-gray-600 mb-2">平均效率</p>
              <p
                class="text-3xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors"
              >
                {{ stats.efficiency }}%
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Main Features Section -->
    <section class="py-24">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2
            class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6"
          >
            主要功能
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            我們提供全方位的審計財報服務，讓您的查核工作更加高效準確
          </p>
        </div>

        <div class="flex justify-center">
          <div class="max-w-md">
            <UCard
              class="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer"
              @click="$router.push('/opinion-builder')"
            >
              <template #header>
                <div class="flex items-center gap-3">
                  <div
                    class="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300"
                  >
                    <UIcon
                      name="i-lucide-file-text"
                      class="text-white text-xl"
                    />
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900">
                    查核意見段建構器
                  </h3>
                </div>
              </template>
              <p class="text-gray-600 leading-relaxed">
                模組化查核意見段建構工具，支援四種意見類型，提供即時預覽功能
              </p>
              <template #footer>
                <div
                  class="flex items-center gap-2 text-sm text-green-600 font-medium"
                >
                  <span>立即開始</span>
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="h-4 w-4 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </template>
            </UCard>
          </div>
        </div>
      </div>
    </section>
  </UContainer>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "審計財報系統 - Direct Flow",
  description:
    "為會計師事務所量身打造的智能審計平台，提升查核效率，確保財務報表品質",
});

const stats = ref({
  pendingClients: 12,
  completedAudits: 8,
  riskAlerts: 3,
  efficiency: 94,
});
</script>
