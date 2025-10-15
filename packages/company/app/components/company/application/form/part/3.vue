<template>
  <div class="space-y-4">
    <CompanyApplicationFormPartnerActions />

    <!-- Partners array validation wrapper -->
    <UForm
      v-for="(partner, index) in formState.partners"
      :key="index"
      :name="`partners.${index}`"
      :schema="partnerSchema"
      nested
    >
      <div class="space-y-6">
        <CompanyApplicationFormPartnerCard
          :partner="partner"
          :index="index"
          :is-last-partner="formState.partners.length === 1"
          @remove-partner="removePartner(index)"
        />

        <USeparator
          v-if="index !== formState.partners.length - 1"
          class="my-6"
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
const applicationStore = useCompanyApplicationStore();
const { formState } = storeToRefs(applicationStore);
const { removePartner } = applicationStore;

watch(
  () => formState.value.hasParValueFreeShares,
  (hasParValueFreeShares) => {
    if (hasParValueFreeShares) {
      // Set all partners' shares pricePerShare to 0 for par value free shares
      // User will manually enter quantity and totalPrice
      formState.value.partners.forEach((partner) => {
        if (partner.shares) {
          Object.keys(partner.shares).forEach((shareType) => {
            const shareTypeKey = shareType as ShareType;
            if (partner.shares?.[shareTypeKey]) {
              partner.shares[shareTypeKey].pricePerShare = 0;
              // Keep existing totalPrice, don't recalculate
            }
          });
        }
      });
    }
  },
  { immediate: true }
);
</script>
