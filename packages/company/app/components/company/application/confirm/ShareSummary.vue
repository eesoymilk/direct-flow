<template>
  <UCard
    v-if="isStockCompany"
    class="ring-1 ring-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-calculator" class="w-6 h-6 text-blue-600" />
          <div>
            <h3 class="text-xl font-bold text-gray-900">股份總計</h3>
            <p class="text-sm text-gray-500">所有股東持股統計</p>
          </div>
        </div>
        <UBadge
          :label="`${totalShares.quantity.toLocaleString()} 股`"
          variant="subtle"
          size="lg"
          color="info"
        />
      </div>
    </template>

    <div class="space-y-6">
      <!-- Share Type Summary -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Ordinary Shares Summary -->
        <UCard variant="subtle" class="bg-green-50 border-green-200">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-circle" class="w-4 h-4 text-green-600" />
              <h4 class="text-md font-medium text-green-800">普通股</h4>
            </div>
          </template>

          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">總股數：</span>
              <span class="font-medium"
                >{{ formatNumber(ordinarySharesTotal.quantity) }} 股</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">每股金額：</span>
              <span class="font-medium">{{
                formatCurrency(ordinarySharesTotal.pricePerShare)
              }}</span>
            </div>
            <USeparator />
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">股款總額：</span>
              <span class="text-lg font-bold text-green-700">{{
                formatCurrency(ordinarySharesTotal.totalPrice)
              }}</span>
            </div>
          </div>
        </UCard>

        <!-- Preferred Shares Summary -->
        <UCard variant="subtle" class="bg-blue-50 border-blue-200">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-star" class="w-4 h-4 text-blue-600" />
              <h4 class="text-md font-medium text-blue-800">特別股</h4>
            </div>
          </template>

          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">總股數：</span>
              <span class="font-medium"
                >{{ formatNumber(preferredSharesTotal.quantity) }} 股</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">每股金額：</span>
              <span class="font-medium">{{
                formatCurrency(preferredSharesTotal.pricePerShare)
              }}</span>
            </div>
            <USeparator />
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">股款總額：</span>
              <span class="text-lg font-bold text-blue-700">{{
                formatCurrency(preferredSharesTotal.totalPrice)
              }}</span>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Overall Summary -->
      <USeparator class="my-6" />

      <UCard variant="subtle" class="bg-gray-50 border-gray-200">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-gray-600" />
            <h4 class="text-md font-medium text-gray-800">總計</h4>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-sm text-gray-600 mb-1">總股數</div>
            <div class="text-xl font-bold text-gray-800">
              {{ formatNumber(totalShares.quantity) }} 股
            </div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600 mb-1">總股款</div>
            <div class="text-xl font-bold text-gray-800">
              {{ formatCurrency(totalShares.totalPrice) }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600 mb-1">股東人數</div>
            <div class="text-xl font-bold text-gray-800">
              {{ shareholders.length }} 人
            </div>
          </div>
        </div>
      </UCard>

      <!-- Individual Shareholder Summary -->
      <div class="space-y-4">
        <h4 class="text-lg font-medium text-gray-800">股東持股明細</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(shareholder, index) in shareholders"
            :key="index"
            class="border rounded-lg p-4 bg-gray-50"
          >
            <div class="flex items-center justify-between mb-3">
              <h5 class="font-medium text-gray-800">{{ shareholder.name }}</h5>
              <UBadge
                :label="String(index + 1)"
                size="sm"
                color="secondary"
                class="rounded-full"
              />
            </div>

            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">普通股：</span>
                <span class="font-medium">
                  {{
                    formatNumber(
                      getShareholderOrdinaryShares(shareholder).quantity
                    )
                  }}
                  股
                </span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">特別股：</span>
                <span class="font-medium">
                  {{
                    formatNumber(
                      getShareholderPreferredShares(shareholder).quantity
                    )
                  }}
                  股
                </span>
              </div>
              <USeparator class="my-2" />
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700"
                  >該股東總計：</span
                >
                <span class="font-bold text-gray-800">
                  {{ formatCurrency(getShareholderTotal(shareholder)) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  shareholders: ShareholderSchema[];
  isStockCompany: boolean;
}

const props = defineProps<Props>();

const applicationStore = useCompanyApplicationStore();
const { ordinarySharesTotal, preferredSharesTotal, totalShares } =
  storeToRefs(applicationStore);
</script>
