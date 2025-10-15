<template>
  <div class="space-y-4 grid grid-cols-1 md:grid-cols-6 gap-4">
    <UFormField label="姓名" name="name" class="col-span-2">
      <UInput
        v-model="partner.name"
        :readonly="partner.isReadonly"
        :disabled="partner.isReadonly"
        :placeholder="`請輸入${personTypeLabel}姓名`"
        class="w-full"
        :class="{
          'opacity-60': partner.isReadonly,
        }"
      />
    </UFormField>

    <UFormField label="身分證字號" name="idNumber" required class="col-span-2">
      <UInput
        v-model="partner.idNumber"
        :readonly="partner.isReadonly"
        :disabled="partner.isReadonly"
        :placeholder="`請輸入${personTypeLabel}身分證字號`"
        class="w-full"
        :class="{ 'opacity-60': partner.isReadonly }"
      />
    </UFormField>

    <UFormField label="職務" name="partnerType" class="col-span-2">
      <USelect
        v-model="partner.partnerType"
        :items="partnerTypeItems"
        :placeholder="`請選擇${personTypeLabel}職務`"
        :default-value="defaultPartnerType"
        class="w-full"
      />
    </UFormField>

    <UFormField label="戶籍地址" name="address" required class="col-span-3">
      <UInput
        v-model="partner.address"
        :readonly="partner.isReadonly"
        :disabled="partner.isReadonly"
        :placeholder="`請輸入${personTypeLabel}戶籍地址`"
        class="w-full"
        :class="{ 'opacity-60': partner.isReadonly }"
      />
    </UFormField>

    <UFormField label="出生日期" name="dateOfBirth" required class="col-span-3">
      <DatePicker
        v-model="partner.dateOfBirth"
        date-format="yy/mm/dd"
        class="w-full h-8"
      />
    </UFormField>

    <!-- Corporate partner fields (法人相關欄位) -->
    <template v-if="isCorporatePartner">
      <UFormField
        label="統一編號"
        name="corporateUnifiedNumber"
        required
        class="col-span-3"
      >
        <UInput
          v-model="partner.corporateUnifiedNumber"
          placeholder="請輸入法人統一編號（8位數字）"
          maxlength="8"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="法人所在地"
        name="corporateAddress"
        required
        class="col-span-3"
      >
        <UInput
          v-model="partner.corporateAddress"
          placeholder="請輸入法人所在地"
          class="w-full"
        />
      </UFormField>
    </template>

    <UFormField
      label="出資額"
      name="capitalContribution"
      class="col-span-full"
      required
    >
      <UInputNumber
        v-model="partner.capitalContribution"
        :min="0"
        :placeholder="`請輸入${personTypeLabel}出資額`"
        class="w-full"
        :format-options="{
          style: 'currency',
          currency: 'TWD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }"
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
interface Props {
  partner: PartnerSchema;
}

const props = defineProps<Props>();

const { personTypeLabel, partnerTypeItems, defaultPartnerType } =
  usePartnerManagement();

const isCorporatePartner = computed(() => {
  return (
    props.partner.partnerType === "corporateShareholder" ||
    props.partner.partnerType === "corporateDirectorRepresentative" ||
    props.partner.partnerType === "corporateRepresentativeDirector"
  );
});
</script>
