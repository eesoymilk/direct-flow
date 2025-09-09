<template>
  <!-- Share Holdings - only show for stock companies -->
  <div class="col-span-full space-y-4 mt-4 pt-4 border-t border-border">
    <h4 class="text-md font-medium text-text">持股資料</h4>
    <div class="grid grid-cols-1 gap-4">
      <UForm
        v-for="shareType in shareTypes"
        :key="shareType"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20"
      >
        <div class="col-span-full">
          <h5 class="text-sm font-medium text-primary mb-2">
            {{ getShareTypeLabel(shareType) }}
          </h5>
        </div>

        <UFormField :label="`${getShareTypeLabel(shareType)} 股數`">
          <UInputNumber
            v-model="shareValue?.[shareType]?.quantity"
            :min="0"
            placeholder="請輸入股數"
            class="w-full"
            :format-options="{
              style: 'decimal',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }"
            @update:model-value="handleUpdateQuantity(shareType, $event)"
          />
        </UFormField>

        <UFormField :label="`${getShareTypeLabel(shareType)} 每股金額`">
          <UInputNumber
            v-model="shareValue?.[shareType]?.pricePerShare"
            :min="0"
            :step="0.01"
            placeholder="請輸入每股金額"
            class="w-full"
            :format-options="{
              style: 'currency',
              currency: 'TWD',
              currencyDisplay: 'code',
              currencySign: 'accounting',
            }"
            @update:model-value="handleUpdatePricePerShare(shareType, $event)"
          />
        </UFormField>

        <UFormField :label="`${getShareTypeLabel(shareType)} 總金額`">
          <UInputNumber
            v-model="shareValue?.[shareType]?.totalPrice"
            :min="0"
            :step="0.01"
            disabled
            placeholder="自動計算"
            class="w-full opacity-60"
            :format-options="{
              style: 'currency',
              currency: 'TWD',
              currencyDisplay: 'code',
              currencySign: 'accounting',
            }"
          />
        </UFormField>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  shareTypes: readonly ShareType[];
  shareValue: ShareholderSchema["shares"];
}

interface Emits {
  "update:quantity": [shareType: ShareType, quantity: number];
  "update:pricePerShare": [shareType: ShareType, pricePerShare: number];
  "update:totalPrice": [shareType: ShareType, totalPrice: number];
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const handleUpdateQuantity = (shareType: ShareType, quantity: number) => {
  const pricePerShare = props.shareValue?.[shareType]?.pricePerShare || 0;
  emits("update:quantity", shareType, quantity);
  emits("update:totalPrice", shareType, quantity * pricePerShare);
};

const handleUpdatePricePerShare = (
  shareType: ShareType,
  pricePerShare: number
) => {
  const quantity = props.shareValue?.[shareType]?.quantity || 0;
  emits("update:pricePerShare", shareType, pricePerShare);
  emits("update:totalPrice", shareType, quantity * pricePerShare);
};
</script>
