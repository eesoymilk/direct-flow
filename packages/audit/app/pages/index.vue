<template>
  <UContainer class="py-8 space-y-8">
    <!-- Hero Section with Animated Background -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-blue-700 px-8 py-16 text-white">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-repeat bg-[length:60px_60px]" style="background-image: url('data:image/svg+xml;utf8,<svg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><g fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;><g fill=&quot;white&quot; fill-opacity=&quot;0.5&quot;><circle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/></g></g></svg>')"></div>
      </div>
      
      <div class="relative text-center space-y-6">
        <div class="flex justify-center mb-6">
          <UIcon name="i-lucide-calculator" class="h-16 w-16 text-white animate-bounce" />
        </div>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
          審計財報系統
        </h1>
        <p class="text-xl text-primary-100 max-w-2xl mx-auto">
          為會計師事務所量身打造的智能審計平台，提升查核效率，確保財務報表品質
        </p>
        <div class="flex flex-wrap gap-4 justify-center pt-4">
          <UBadge color="white" variant="solid" class="px-4 py-2">
            <UIcon name="i-lucide-shield-check" class="mr-2" />
            符合審計準則
          </UBadge>
          <UBadge color="white" variant="solid" class="px-4 py-2">
            <UIcon name="i-lucide-zap" class="mr-2" />
            AI 輔助查核
          </UBadge>
          <UBadge color="white" variant="solid" class="px-4 py-2">
            <UIcon name="i-lucide-lock" class="mr-2" />
            資安保護
          </UBadge>
        </div>
      </div>
    </div>

    <!-- Quick Stats Dashboard -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <UCard class="p-6 hover:shadow-lg transition-all duration-300 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">待審客戶</p>
            <p class="text-3xl font-bold text-primary-600 group-hover:text-primary-700 transition-colors">{{ stats.pendingClients }}</p>
          </div>
          <UIcon name="i-lucide-users" class="h-8 w-8 text-primary-500 group-hover:scale-110 transition-transform" />
        </div>
      </UCard>
      
      <UCard class="p-6 hover:shadow-lg transition-all duration-300 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">本月完成</p>
            <p class="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors">{{ stats.completedAudits }}</p>
          </div>
          <UIcon name="i-lucide-check-circle" class="h-8 w-8 text-green-500 group-hover:scale-110 transition-transform" />
        </div>
      </UCard>

      <UCard class="p-6 hover:shadow-lg transition-all duration-300 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">風險提醒</p>
            <p class="text-3xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">{{ stats.riskAlerts }}</p>
          </div>
          <UIcon name="i-lucide-alert-triangle" class="h-8 w-8 text-orange-500 group-hover:scale-110 transition-transform" />
        </div>
      </UCard>

      <UCard class="p-6 hover:shadow-lg transition-all duration-300 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">平均效率</p>
            <p class="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">{{ stats.efficiency }}%</p>
          </div>
          <UIcon name="i-lucide-trending-up" class="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
        </div>
      </UCard>
    </div>

    <!-- Main Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Client Management -->
      <UCard class="p-8 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-full -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center mb-6">
            <div class="p-3 bg-blue-100 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors">
              <UIcon name="i-lucide-building-2" class="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">客戶管理</h3>
              <p class="text-sm text-gray-600">集中管理審計客戶資料</p>
            </div>
          </div>
          <ul class="space-y-3 mb-6">
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              客戶基本資料維護
            </li>
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              歷年審計資料查詢
            </li>
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              風險評估記錄
            </li>
          </ul>
          <UButton variant="outline" block class="group-hover:bg-blue-50 transition-colors">
            <UIcon name="i-lucide-arrow-right" class="ml-2 group-hover:translate-x-1 transition-transform" />
            進入管理
          </UButton>
        </div>
      </UCard>

      <!-- Audit Procedures -->
      <UCard class="p-8 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-full -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center mb-6">
            <div class="p-3 bg-purple-100 rounded-xl mr-4 group-hover:bg-purple-200 transition-colors">
              <UIcon name="i-lucide-clipboard-list" class="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">查核程序</h3>
              <p class="text-sm text-gray-600">標準化審計作業流程</p>
            </div>
          </div>
          <ul class="space-y-3 mb-6">
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              程序範本管理
            </li>
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              執行進度追蹤
            </li>
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              品質控管檢核
            </li>
          </ul>
          <UButton variant="outline" block class="group-hover:bg-purple-50 transition-colors">
            <UIcon name="i-lucide-arrow-right" class="ml-2 group-hover:translate-x-1 transition-transform" />
            開始執行
          </UButton>
        </div>
      </UCard>

      <!-- Working Papers -->
      <UCard class="p-8 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center mb-6">
            <div class="p-3 bg-green-100 rounded-xl mr-4 group-hover:bg-green-200 transition-colors">
              <UIcon name="i-lucide-file-text" class="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">工作底稿</h3>
              <p class="text-sm text-gray-600">電子化審計工作底稿</p>
            </div>
          </div>
          <ul class="space-y-3 mb-6">
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              底稿範本庫
            </li>
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              協同編輯功能
            </li>
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              版本控制管理
            </li>
          </ul>
          <UButton variant="outline" block class="group-hover:bg-green-50 transition-colors">
            <UIcon name="i-lucide-arrow-right" class="ml-2 group-hover:translate-x-1 transition-transform" />
            建立底稿
          </UButton>
        </div>
      </UCard>

      <!-- Data Analytics -->
      <UCard class="p-8 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-full -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center mb-6">
            <div class="p-3 bg-orange-100 rounded-xl mr-4 group-hover:bg-orange-200 transition-colors">
              <UIcon name="i-lucide-bar-chart-3" class="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">數據分析</h3>
              <p class="text-sm text-gray-600">AI 輔助財務數據分析</p>
            </div>
          </div>
          <ul class="space-y-3 mb-6">
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              異常交易偵測
            </li>
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              趨勢分析報告
            </li>
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              比較分析工具
            </li>
          </ul>
          <UButton variant="outline" block class="group-hover:bg-orange-50 transition-colors">
            <UIcon name="i-lucide-arrow-right" class="ml-2 group-hover:translate-x-1 transition-transform" />
            開始分析
          </UButton>
        </div>
      </UCard>

      <!-- Reports -->
      <UCard class="p-8 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-indigo-600/20 rounded-full -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center mb-6">
            <div class="p-3 bg-indigo-100 rounded-xl mr-4 group-hover:bg-indigo-200 transition-colors">
              <UIcon name="i-lucide-file-chart-line" class="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">報告產生</h3>
              <p class="text-sm text-gray-600">自動化審計報告製作</p>
            </div>
          </div>
          <ul class="space-y-3 mb-6">
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              報告範本管理
            </li>
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              自動化產出
            </li>
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              多格式輸出
            </li>
          </ul>
          <UButton variant="outline" block class="group-hover:bg-indigo-50 transition-colors">
            <UIcon name="i-lucide-arrow-right" class="ml-2 group-hover:translate-x-1 transition-transform" />
            產生報告
          </UButton>
        </div>
      </UCard>

      <!-- Settings -->
      <UCard class="p-8 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-500/10 to-gray-600/20 rounded-full -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative z-10">
          <div class="flex items-center mb-6">
            <div class="p-3 bg-gray-100 rounded-xl mr-4 group-hover:bg-gray-200 transition-colors">
              <UIcon name="i-lucide-settings" class="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">系統設定</h3>
              <p class="text-sm text-gray-600">個人化設定與偏好</p>
            </div>
          </div>
          <ul class="space-y-3 mb-6">
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              使用者權限管理
            </li>
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              系統偏好設定
            </li>
            <li class="flex items-center text-sm text-gray-600">
              <UIcon name="i-lucide-check" class="h-4 w-4 text-green-500 mr-2" />
              資料備份還原
            </li>
          </ul>
          <UButton variant="outline" block class="group-hover:bg-gray-50 transition-colors">
            <UIcon name="i-lucide-arrow-right" class="ml-2 group-hover:translate-x-1 transition-transform" />
            管理設定
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Recent Activity & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Activity -->
      <UCard class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-900">最近活動</h3>
          <UButton variant="ghost" size="sm" trailing-icon="i-lucide-external-link">
            查看全部
          </UButton>
        </div>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="flex-shrink-0">
              <UIcon :name="activity.icon" :class="`h-5 w-5 ${activity.iconColor}`" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-xs text-gray-500">{{ activity.description }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Quick Actions -->
      <UCard class="p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">快速操作</h3>
        <div class="grid grid-cols-2 gap-4">
          <UButton variant="outline" class="p-4 h-auto flex flex-col space-y-2">
            <UIcon name="i-lucide-plus" class="h-6 w-6" />
            <span class="text-sm">新增客戶</span>
          </UButton>
          <UButton variant="outline" class="p-4 h-auto flex flex-col space-y-2">
            <UIcon name="i-lucide-upload" class="h-6 w-6" />
            <span class="text-sm">匯入資料</span>
          </UButton>
          <UButton variant="outline" class="p-4 h-auto flex flex-col space-y-2">
            <UIcon name="i-lucide-search" class="h-6 w-6" />
            <span class="text-sm">搜尋案件</span>
          </UButton>
          <UButton variant="outline" class="p-4 h-auto flex flex-col space-y-2">
            <UIcon name="i-lucide-calendar" class="h-6 w-6" />
            <span class="text-sm">查看行事曆</span>
          </UButton>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "審計財報系統 - Direct Flow",
  description: "為會計師事務所量身打造的智能審計平台，提升查核效率，確保財務報表品質"
});

const stats = ref({
  pendingClients: 12,
  completedAudits: 8,
  riskAlerts: 3,
  efficiency: 94
});

const recentActivities = ref([
  {
    id: 1,
    icon: "i-lucide-file-check",
    iconColor: "text-green-500",
    title: "完成台積電股份有限公司審計",
    description: "已完成第三季財務報表查核",
    time: "2 小時前"
  },
  {
    id: 2,
    icon: "i-lucide-alert-circle",
    iconColor: "text-orange-500",
    title: "發現潛在風險項目",
    description: "富邦金控應收帳款異常波動",
    time: "4 小時前"
  },
  {
    id: 3,
    icon: "i-lucide-upload",
    iconColor: "text-blue-500",
    title: "匯入客戶財務資料",
    description: "成功匯入聯發科技 Q3 試算表",
    time: "6 小時前"
  },
  {
    id: 4,
    icon: "i-lucide-user-plus",
    iconColor: "text-purple-500",
    title: "新增審計客戶",
    description: "長榮海運股份有限公司",
    time: "1 天前"
  },
  {
    id: 5,
    icon: "i-lucide-check-square",
    iconColor: "text-green-500",
    title: "完成查核程序",
    description: "現金流量表分析程序執行完畢",
    time: "1 天前"
  }
]);
</script>