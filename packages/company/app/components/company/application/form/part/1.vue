<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-text mb-4">公司基本資料</h2>

    <UFormField label="公司預查名稱" name="candidateNames">
      <UInputTags
        v-model="applicationStore.form.candidateNames"
        placeholder="請輸入公司預查名稱 (依偏好順序)"
        class="w-full"
        :max="5"
      />
    </UFormField>

    <UFormField label="公司組織" name="organizationType">
      <URadioGroup
        v-model="applicationStore.form.organizationType"
        :items="organizationTypeItems"
        value-key="id"
        variant="card"
        class="w-full"
      >
        <template #description="{ item }">
          <div
            v-if="
              item.value === 'company_limited' &&
              applicationStore.form.organizationType === 'company_limited'
            "
            class="flex justify-between items-start w-full flex-col"
          >
            <div class="text-sm text-gray-500 mt-1">{{ item.description }}</div>

            <!-- Checkboxes within the radio card -->
            <div class="pt-2 md:pt-4 space-y-2">
              <UCheckbox
                v-model="applicationStore.form.isCloselyHeld"
                label="閉鎖型股份有限公司"
                class="text-sm"
              />
              <UCheckbox
                v-model="applicationStore.form.hasParValueFreeShares"
                label="無票面閉鎖型股份有限公司"
                class="text-sm"
              />
            </div>
          </div>
        </template>
      </URadioGroup>
    </UFormField>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="資本總額" name="capitalAmount">
        <UInputNumber
          v-model="applicationStore.form.capitalAmount"
          :min="0"
          placeholder="請輸入資本總額"
          class="w-full"
          :format-options="{
            style: 'currency',
            currency: 'TWD',
            currencyDisplay: 'code',
            currencySign: 'accounting',
          }"
        />
      </UFormField>

      <UFormField label="股份總數" name="totalShares">
        <UInputNumber
          v-model="applicationStore.form.totalShares"
          :min="0"
          placeholder="請輸入股份總數"
          class="w-full"
        />
      </UFormField>
    </div>

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
import { organizationTypeItems } from "../../helpers";

const applicationStore = useCompanyApplicationStore();
</script>
