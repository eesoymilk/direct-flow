<template>
  <div class="space-y-6">
    <!-- Share Calculation Summary -->
    <UCard class="bg-primary/5 border-primary/20">
      <template #header>
        <h3 class="text-lg font-medium text-primary">股份統計</h3>
      </template>

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
            <UIcon name="i-lucide-calculator" class="w-4 h-4 text-gray-600" />
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
              {{ formState.partners.length }} 人
            </div>
          </div>
        </div>
      </UCard>
    </UCard>

    <!-- Partner Breakdown -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-medium">股東持股明細</h3>
      </template>

      <div class="space-y-4">
        <div
          v-for="(partner, index) in formState.partners"
          :key="index"
          class="border rounded-lg p-4 bg-gray-50"
        >
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-800">{{ partner.name }}</h4>
            <UButton
              :label="String(index + 1)"
              size="sm"
              color="secondary"
              class="rounded-full"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Ordinary Shares -->
            <div class="space-y-2">
              <div class="text-sm font-medium text-green-700">普通股</div>
              <div class="text-sm text-gray-600">
                股數：{{
                  formatNumber(getPartnerOrdinaryShares(partner).quantity)
                }}
                股
              </div>
              <div class="text-sm text-gray-600">
                金額：{{
                  formatCurrency(getPartnerOrdinaryShares(partner).totalPrice)
                }}
              </div>
            </div>

            <!-- Preferred Shares -->
            <div class="space-y-2">
              <div class="text-sm font-medium text-blue-700">特別股</div>
              <div class="text-sm text-gray-600">
                股數：{{
                  formatNumber(getPartnerPreferredShares(partner).quantity)
                }}
                股
              </div>
              <div class="text-sm text-gray-600">
                金額：{{
                  formatCurrency(getPartnerPreferredShares(partner).totalPrice)
                }}
              </div>
            </div>
          </div>

          <USeparator class="my-3" />

          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">該股東總計：</span>
            <span class="font-bold text-gray-800">
              {{ formatCurrency(getPartnerTotal(partner)) }}
            </span>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const applicationStore = useCompanyApplicationStore();
const { formState, ordinarySharesTotal, preferredSharesTotal, totalShares } =
  storeToRefs(applicationStore);
</script>
