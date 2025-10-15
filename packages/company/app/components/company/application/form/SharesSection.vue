<template>
  <div v-if="isCorporation && partner.shares" class="col-span-full space-y-4">
    <USeparator class="col-span-full" />
    <h4 class="text-md font-medium text-text">持股資料</h4>
    <!-- TODO: add datatable style -->
    <DataTable :value="shareEntries">
      <Column field="label" header="名稱"></Column>
      <Column field="quantity" header="股數">
        <template #body="{ data }">
          <UInputNumber
            v-model="partner.shares[data.shareType as ShareType].quantity"
            :min="0"
            placeholder="請輸入股數"
            class="w-full"
            :format-options="{
              style: 'decimal',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }"
            @update:model-value="
              updateQuantity(partnerIndex, data.shareType as ShareType, $event)
            "
          />
        </template>
      </Column>
      <Column header="每股金額">
        <template #body="{ data }">
          <UInputNumber
            v-model="partner.shares[data.shareType as ShareType].pricePerShare"
            :min="0"
            :step="0.01"
            :disabled="hasParValueFreeShares"
            placeholder="請輸入每股金額"
            class="w-full"
            :class="{
              'opacity-60': hasParValueFreeShares,
            }"
            :format-options="{
              style: 'currency',
              currency: 'TWD',
            }"
            @update:model-value="
              updatePricePerShare(
                partnerIndex,
                data.shareType as ShareType,
                $event
              )
            "
          />
        </template>
      </Column>
      <Column header="總金額">
        <template #body="{ data }">
          <UInputNumber
            v-model="partner.shares[data.shareType as ShareType].totalPrice"
            :min="0"
            :step="0.01"
            :disabled="!hasParValueFreeShares"
            :placeholder="hasParValueFreeShares ? '請輸入總金額' : '自動計算'"
            class="w-full"
            :class="{
              'opacity-60': !hasParValueFreeShares,
            }"
            :format-options="{
              style: 'currency',
              currency: 'TWD',
            }"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
interface Props {
  partner: PartnerSchema;
  partnerIndex: number;
}

const props = defineProps<Props>();

const applicationStore = useCompanyApplicationStore();
const { isCorporation, formState } = storeToRefs(applicationStore);

const { shareEntries, updateQuantity, updatePricePerShare } =
  usePartnerManagement();

const hasParValueFreeShares = computed(
  () => formState.value.hasParValueFreeShares || false
);

// Watch for hasParValueFreeShares changes to set pricePerShare to 0
watch(hasParValueFreeShares, (newValue) => {
  if (newValue && props.partner.shares) {
    // Set all pricePerShare values to 0 when hasParValueFreeShares is enabled
    Object.keys(props.partner.shares).forEach((shareType) => {
      if (props.partner.shares) {
        props.partner.shares[shareType as ShareType].pricePerShare = 0;
      }
    });
  }
});
</script>
