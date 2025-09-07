<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          股權結構總覽
        </h3>
        <div class="flex items-center space-x-2">
          <UButton
            icon="i-heroicons-arrow-down-tray"
            size="sm"
            color="gray"
            variant="outline"
            @click="exportData"
          >
            匯出資料
          </UButton>
          <UButton
            icon="i-heroicons-arrow-path"
            size="sm"
            color="gray"
            variant="outline"
            :loading="isLoading"
            @click="refresh"
          >
            重新整理
          </UButton>
        </div>
      </div>
    </template>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
      <span class="ml-2 text-sm text-gray-500">載入中...</span>
    </div>

    <!-- Error State -->
    <UAlert
      v-else-if="error"
      color="red"
      variant="soft"
      :title="error"
      class="mb-4"
    />

    <!-- Summary Content -->
    <div v-else class="space-y-6">
      <!-- Capital Summary Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UCard :ui="{ body: { padding: 'px-4 py-3' } }">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500">普通股股款</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ formatCurrency(totalOrdinaryAmount) }}
              </p>
            </div>
            <UIcon name="i-heroicons-chart-bar" class="w-8 h-8 text-blue-500" />
          </div>
        </UCard>

        <UCard :ui="{ body: { padding: 'px-4 py-3' } }">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500">特別股股款</p>
              <p class="text-2xl font-bold text-purple-600">
                {{ formatCurrency(totalPreferredAmount) }}
              </p>
            </div>
            <UIcon name="i-heroicons-star" class="w-8 h-8 text-purple-500" />
          </div>
        </UCard>

        <UCard :ui="{ body: { padding: 'px-4 py-3' } }">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-500">總募資金額</p>
              <p class="text-2xl font-bold text-green-600">
                {{ formatCurrency(totalCapitalRaised) }}
              </p>
            </div>
            <UIcon name="i-heroicons-currency-dollar" class="w-8 h-8 text-green-500" />
          </div>
        </UCard>
      </div>

      <!-- Share Type Breakdown -->
      <div>
        <h4 class="text-base font-medium text-gray-900 mb-3">股票類型分布</h4>
        <UTable
          :columns="shareTypeColumns"
          :rows="shareTypeBreakdown"
          :ui="{ th: { padding: 'px-3 py-2' }, td: { padding: 'px-3 py-2' } }"
        >
          <template #typeName-data="{ row }">
            <div class="flex items-center space-x-2">
              <UBadge 
                :color="row.shareType === 'ordinary' ? 'blue' : 'purple'" 
                variant="subtle"
              >
                {{ row.typeName }}
              </UBadge>
            </div>
          </template>

          <template #totalQuantity-data="{ row }">
            <span class="font-medium">
              {{ row.totalQuantity.toLocaleString() }} 股
            </span>
          </template>

          <template #totalAmount-data="{ row }">
            <span class="font-medium">
              {{ formatCurrency(row.totalAmount) }}
            </span>
          </template>

          <template #shareholderCount-data="{ row }">
            <UBadge color="gray" variant="subtle">
              {{ row.shareholderCount }} 人
            </UBadge>
          </template>
        </UTable>
      </div>

      <!-- Shareholder Summary -->
      <div>
        <h4 class="text-base font-medium text-gray-900 mb-3">股東持股概況</h4>
        <UTable
          :columns="shareholderColumns"
          :rows="shareholderSummaries"
          :ui="{ th: { padding: 'px-3 py-2' }, td: { padding: 'px-3 py-2' } }"
        >
          <template #name-data="{ row }">
            <div>
              <p class="font-medium text-gray-900">{{ row.shareholder.person.name }}</p>
              <p class="text-xs text-gray-500">{{ row.shareholder.person.idNumber }}</p>
            </div>
          </template>

          <template #holdingCount-data="{ row }">
            <UBadge color="gray" variant="subtle">
              {{ row.holdings.length }} 類股票
            </UBadge>
          </template>

          <template #totalInvestment-data="{ row }">
            <span class="font-medium">
              {{ formatCurrency(row.totalInvestment) }}
            </span>
          </template>

          <template #ownershipPercentage-data="{ row }">
            <div class="flex items-center space-x-2">
              <span class="font-medium">{{ row.ownershipPercentage.toFixed(2) }}%</span>
              <div class="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-500 h-2 rounded-full"
                  :style="{ width: `${Math.min(row.ownershipPercentage, 100)}%` }"
                />
              </div>
            </div>
          </template>

          <template #actions-data="{ row }">
            <UButton
              icon="i-heroicons-eye"
              size="xs"
              color="gray"
              variant="ghost"
              @click="viewShareholderDetails(row.shareholder)"
            >
              查看詳情
            </UButton>
          </template>
        </UTable>
      </div>

      <!-- Validation Results -->
      <UCard v-if="validationResults.errors.length > 0" color="red" variant="soft">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
            <span class="font-medium">股權設定問題</span>
          </div>
        </template>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li v-for="error in validationResults.errors" :key="error">
            {{ error }}
          </li>
        </ul>
      </UCard>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  applicationId: string;
}

const props = defineProps<Props>();

// Composables
const applicationId = computed(() => props.applicationId);
const {
  shareholders,
  allHoldings,
  isLoading,
  error,
  totalOrdinaryAmount,
  totalPreferredAmount,
  totalCapitalRaised,
  shareholderSummaries,
  shareTypeBreakdown,
  fetchApplicationShares,
  validateApplicationShares,
  exportShareData,
} = useApplicationShares(applicationId);

const toast = useToast();

// Table configurations
const shareTypeColumns = [
  { key: 'typeName', label: '股票類型' },
  { key: 'totalQuantity', label: '總股數' },
  { key: 'totalAmount', label: '總金額' },
  { key: 'shareholderCount', label: '持有人數' },
];

const shareholderColumns = [
  { key: 'name', label: '股東姓名' },
  { key: 'holdingCount', label: '持股類型' },
  { key: 'totalInvestment', label: '投資金額' },
  { key: 'ownershipPercentage', label: '持股比例' },
  { key: 'actions', label: '操作' },
];

// Computed properties
const validationResults = computed(() => validateApplicationShares());

// Methods
const formatCurrency = (amount: number) =>
  amount.toLocaleString('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  });

const refresh = async () => {
  try {
    await fetchApplicationShares();
    toast.add({
      title: '資料已更新',
      color: 'green',
    });
  } catch (error) {
    toast.add({
      title: '更新失敗',
      description: '無法重新載入股權資料',
      color: 'red',
    });
  }
};

const exportData = () => {
  try {
    const data = exportShareData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `share-structure-${props.applicationId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.add({
      title: '匯出成功',
      description: '股權資料已下載',
      color: 'green',
    });
  } catch (error) {
    toast.add({
      title: '匯出失敗',
      description: '無法匯出股權資料',
      color: 'red',
    });
  }
};

const viewShareholderDetails = (shareholder: ApplicationShareholder) => {
  // Emit event to parent or navigate to detailed view
  // This could open a modal or navigate to a dedicated page
  console.log('View shareholder details:', shareholder);
};
</script>