<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-text mb-4">公司基本資料</h2>

    <UFormField label="公司預查名稱" name="candicateNames">
      <UInputTags
        v-model="applicationStore.form.candicateNames"
        placeholder="請輸入公司預查名稱 (依偏好順序)"
        class="w-full"
        :max="5"
      />
    </UFormField>

    <UFormField label="公司組織" name="organizationType">
      <URadioGroup
        v-model="applicationStore.form.organizationType"
        value-key="id"
        variant="card"
        :items="organizationTypeItems"
        class="w-full"
      />
    </UFormField>

    <UFormField label="營業項目描述" name="businessItemsDescription">
      <UTextarea
        v-model="applicationStore.form.businessItemsDescription"
        placeholder="請輸入營業項目描述"
        class="w-full"
      />
    </UFormField>

    <UFormField label="公司地址" name="address">
      <UInput
        v-model="applicationStore.form.address"
        placeholder="請輸入公司地址"
        class="w-full"
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui";

const organizationTypeItems = ref<RadioGroupItem[]>([
  {
    label: "股份有限公司",
    id: "limited_company",
  },
  {
    label: "有限公司",
    id: "company_limited",
  },
  {
    label: "獨資",
    id: "sole_proprietorship",
  },
  {
    label: "合夥",
    id: "partnership",
  },
]);

const applicationStore = useCompanyApplicationStore();
</script>
