<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <h2 class="text-xl font-semibold text-text mb-4 col-span-full">
      公司基本資料
    </h2>

    <UFormField
      label="公司預查名稱"
      name="candidateNames"
      class="col-span-full"
      required
    >
      <UInputTags
        v-model="formState.candidateNames"
        placeholder="請輸入公司預查名稱 (依偏好順序)"
        class="w-full"
        :max="5"
      />
    </UFormField>

    <UFormField
      label="公司組織"
      name="organizationType"
      class="col-span-full"
      required
    >
      <URadioGroup
        v-model="formState.organizationType"
        :items="organizationTypeItems"
        value-key="id"
        variant="card"
        class="w-full"
      >
        <template #description="{ item }">
          <!-- Corporation-specific options -->
          <div
            v-if="
              item.value === 'corporation' &&
              formState.organizationType === 'corporation'
            "
            class="flex justify-between items-start w-full flex-col gap-3"
          >
            <div class="text-sm text-gray-500 mt-1">{{ item.description }}</div>

            <!-- Corporation boolean fields within the radio card -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full text-sm">
              <UCheckbox
                v-model="formState.isCloselyHeld"
                label="閉鎖型股份有限公司"
                required
              />
              <UCheckbox
                v-model="formState.hasParValueFreeShares"
                label="無票面金額股份"
                required
              />
              <UCheckbox
                v-model="formState.isPublicOffering"
                label="公開發行公司"
                required
              />
              <UCheckbox
                v-model="formState.isForeignInvestment"
                label="僑外投資事業"
                required
              />
              <UCheckbox
                v-model="formState.isChineseInvestment"
                label="涉及中國大陸地區投資"
                required
              />
              <UCheckbox
                v-model="formState.hasMultipleVotingRightsPreferredShares"
                label="複數表決權特別股"
                required
              />
              <UCheckbox
                v-model="formState.hasVetoRightsPreferredShares"
                label="否決權特別股"
                required
              />
              <UCheckbox
                v-model="formState.hasPreferredSharesBoardRights"
                label="特別股董監事權利"
                required
              />
            </div>
          </div>

          <!-- Limited Company-specific options -->
          <div
            v-else-if="
              item.value === 'limited_company' &&
              formState.organizationType === 'limited_company'
            "
            class="flex justify-between items-start w-full flex-col gap-3"
          >
            <div class="text-sm text-gray-500 mt-1">{{ item.description }}</div>

            <!-- Limited company boolean fields within the radio card -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full text-sm">
              <UCheckbox
                v-model="formState.isSoleProprietorshipLLC"
                label="一人有限公司"
                required
              />
              <UCheckbox
                v-model="formState.isForeignInvestment"
                label="僑外投資事業"
                required
              />
              <UCheckbox
                v-model="formState.isChineseInvestment"
                label="涉及中國大陸地區投資"
                required
              />
            </div>
          </div>

          <!-- Other organization types -->
          <div v-else class="text-sm text-gray-500 mt-1">
            {{ item.description }}
          </div>
        </template>
      </URadioGroup>
    </UFormField>

    <!-- Capital and Shares Section -->
    <!-- Always show capital amount -->
    <UFormField
      label="資本總額"
      name="capitalAmount"
      class="col-span-full"
      required
    >
      <UInputNumber
        v-model="formState.capitalAmount"
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

    <!-- Only show total shares field for corporations -->
    <UFormField
      v-if="formState.organizationType === 'corporation'"
      label="股份總數"
      name="totalShares"
      required
    >
      <UInputNumber
        v-model="formState.totalShares"
        :min="0"
        placeholder="請輸入股份總數"
        class="w-full"
      />
    </UFormField>

    <!-- Only show par value field for corporations -->
    <UFormField
      v-if="formState.organizationType === 'corporation'"
      label="票面金額"
      name="parValue"
      required
    >
      <UInputNumber
        v-model="formState.parValue"
        :disabled="formState.hasParValueFreeShares"
        :min="0"
        :placeholder="
          formState.hasParValueFreeShares
            ? 'NT$ 10.00 (無票面金額)'
            : '請輸入每股票面金額（新台幣）'
        "
        class="w-full"
        :format-options="{
          style: 'currency',
          currency: 'TWD',
          currencyDisplay: 'code',
          currencySign: 'accounting',
        }"
      />
    </UFormField>

    <UFormField
      label="營業項目描述"
      name="businessItemsDescription"
      class="col-span-full"
      required
    >
      <UTextarea
        v-model="formState.businessItemsDescription"
        placeholder="請輸入營業項目描述"
        class="w-full"
      />
    </UFormField>

    <UFormField label="公司地址" name="address" class="col-span-full" required>
      <UInput
        v-model="formState.address"
        placeholder="請輸入公司地址"
        class="w-full"
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui";

const organizationTypeItems = [
  {
    label: "股份有限公司",
    description: "適合大型企業和需要募集資本的公司",
    value: "corporation",
    id: "corporation",
  },
  {
    label: "有限公司",
    description: "適合中小型企業，股東責任有限",
    value: "limited_company",
    id: "limited_company",
  },
  {
    label: "獨資",
    description: "個人經營的事業，無須合夥人",
    value: "sole_proprietorship",
    id: "sole_proprietorship",
  },
  {
    label: "合夥",
    description: "兩人以上合作經營的事業",
    value: "partnership",
    id: "partnership",
  },
] satisfies RadioGroupItem[];

const applicationStore = useCompanyApplicationStore();
const { formState } = storeToRefs(applicationStore);
</script>
