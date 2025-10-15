<template>
  <UCard
    variant="subtle"
    class="relative overflow-visible"
    :class="{
      'border-primary/20 bg-primary/5': partner.isReadonly,
    }"
  >
    <div
      v-if="partner.isReadonly && partner.referenceType"
      class="absolute top-2 right-2 flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"
    >
      <UIcon name="i-lucide-link" class="w-3 h-3" />
      {{ getPersonLabel(partner.referenceType) }}（僅可編輯出資額{{
        isCorporation ? "以及持股" : ""
      }}）
    </div>

    <CompanyApplicationFormPartnerForm :partner="partner" />

    <CompanyApplicationFormSharesSection
      :partner="partner"
      :partner-index="index"
    />

    <UButton
      :label="String(index + 1)"
      size="sm"
      color="secondary"
      class="absolute rounded-full -top-3 -left-3"
    />

    <UButton
      icon="i-lucide-x"
      size="sm"
      color="error"
      class="rounded-full absolute -top-3 -right-3 cursor-pointer"
      :disabled="isLastPartner"
      @click="removePartner"
    />
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  partner: PartnerSchema;
  index: number;
  isLastPartner: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  removePartner: [];
}>();

const applicationStore = useCompanyApplicationStore();
const { isCorporation } = storeToRefs(applicationStore);

const removePartner = () => emit("removePartner");
</script>
