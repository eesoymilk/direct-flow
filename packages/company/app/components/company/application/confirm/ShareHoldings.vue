<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-pie-chart" class="w-4 h-4 text-gray-500" />
      <h5 class="text-md font-medium text-gray-700">持股資料</h5>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard
        v-for="[shareType, share] in shareEntries"
        :key="shareType"
        class="bg-primary/5 border border-primary/20"
      >
        <template #header>
          <h6 class="text-sm font-medium text-primary">
            {{ getShareTypeLabel(shareType as ShareType) }}
          </h6>
        </template>

        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">股數:</span>
            <span class="font-medium">
              {{ share.quantity?.toLocaleString() }} 股
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">每股金額:</span>
            <span class="font-medium">
              NT$ {{ share.pricePerShare?.toLocaleString() }}
            </span>
          </div>
          <div class="flex justify-between text-sm font-semibold border-t pt-2">
            <span class="text-gray-700">總金額:</span>
            <span class="text-primary">
              NT$ {{ share.totalPrice?.toLocaleString() }}
            </span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  shares: {
    ordinary: { quantity: number; pricePerShare: number; totalPrice: number };
    preferred_a: {
      quantity: number;
      pricePerShare: number;
      totalPrice: number;
    };
    preferred_b: {
      quantity: number;
      pricePerShare: number;
      totalPrice: number;
    };
    preferred_c: {
      quantity: number;
      pricePerShare: number;
      totalPrice: number;
    };
    preferred_d: {
      quantity: number;
      pricePerShare: number;
      totalPrice: number;
    };
    preferred_e: {
      quantity: number;
      pricePerShare: number;
      totalPrice: number;
    };
  };
}

const props = defineProps<Props>();

const { shareCount } = storeToRefs(useCompanyApplicationStore());

const shareEntries = computed(() =>
  Object.entries(props.shares)
    .filter(([_, share]) => share.quantity > 0)
    .slice(0, shareCount.value)
);
</script>
