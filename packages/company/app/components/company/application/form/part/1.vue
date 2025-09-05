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
            <div class="mt-3 space-y-2" @click.stop>
              <div class="flex items-center">
                <UCheckbox
                  v-model="applicationStore.form.isCloselyHeld"
                  label="閉鎖型股份有限公司"
                  class="text-sm"
                  @change="handleCloselyHeldChange"
                  @click.stop
                />
              </div>

              <div
                v-if="applicationStore.form.isCloselyHeld"
                class="flex items-center ml-6"
              >
                <UCheckbox
                  v-model="applicationStore.form.hasParValueFreeShares"
                  label="無票面閉鎖型股份有限公司"
                  class="text-sm"
                  @click.stop
                />
              </div>
            </div>
          </div>
        </template>
      </URadioGroup>
    </UFormField>

    <!-- Capital amount fields -->
    <UFormField label="資本額" name="capitalAmount">
      <UInputNumber
        v-model="applicationStore.form.capitalAmount"
        :min="0"
        placeholder="請輸入資本額"
        class="w-full"
        :format-options="{
          style: 'currency',
          currency: 'TWD',
          currencyDisplay: 'code',
          currencySign: 'accounting',
        }"
      />
    </UFormField>

    <!-- Share fields - only show for stock company types -->
    <div
      v-if="applicationStore.form.organizationType === 'company_limited'"
      class="grid grid-cols-3 gap-4"
    >
      <UFormField label="普通股" name="ordinaryShares">
        <UInputNumber
          v-model="applicationStore.form.ordinaryShares"
          :min="0"
          placeholder="請輸入普通股數"
          class="w-full"
        />
      </UFormField>

      <UFormField label="特別股" name="preferredShares">
        <UInputNumber
          v-model="applicationStore.form.preferredShares"
          :min="0"
          placeholder="請輸入特別股數"
          class="w-full"
        />
      </UFormField>

      <UFormField label="實收資本額股數" name="authorizedShares">
        <UInputNumber
          v-model="applicationStore.form.authorizedShares"
          disabled
          placeholder="實收資本額股數"
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

// Handler for closely held checkbox change
const handleCloselyHeldChange = (payload: Event) => {
  const value = (payload.target as HTMLInputElement).checked;
  if (!value) {
    // If unchecking closely held, also uncheck par value free shares
    applicationStore.form.hasParValueFreeShares = false;
  }
};
</script>
