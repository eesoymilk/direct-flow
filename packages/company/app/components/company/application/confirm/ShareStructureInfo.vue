<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-pie-chart" class="w-4 h-4 text-gray-500" />
      <label class="text-sm font-semibold text-gray-700 tracking-wide">
        股份結構
      </label>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ShareCard
        v-if="formState.paidInCapital && formState.paidInCapital > 0"
        label="實收資本總額"
        icon="i-lucide-calculator"
        :shares="formState.paidInCapital"
        color="blue"
        suffix="元"
      />

      <ShareCard
        v-if="formState.totalShares && formState.totalShares > 0"
        label="股份總數"
        icon="i-lucide-hash"
        :shares="formState.totalShares"
        color="green"
        suffix="股"
      />

      <ShareCard
        v-if="formState.parValue && formState.parValue > 0"
        label="票面金額"
        icon="i-lucide-coins"
        :shares="formState.parValue"
        color="purple"
        suffix="元"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  formState: CompanyApplicationFormSchema & {
    responsiblePerson: PersonSchema;
    contactPerson: PersonSchema;
    partners: readonly PartnerSchema[];
  };
}

defineProps<Props>();
</script>
