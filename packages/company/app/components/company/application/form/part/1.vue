<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-text mb-4">公司基本資料</h2>

    <UFormField label="公司預查名稱" name="candidateNames">
      <UInputTags
        v-model="formState.candidateNames"
        placeholder="請輸入公司預查名稱 (依偏好順序)"
        class="w-full"
        :max="5"
      />
    </UFormField>

    <UFormField label="公司組織" name="organizationType">
      <URadioGroup
        v-model="formState.organizationType"
        :items="organizationTypeItems"
        value-key="id"
        variant="card"
        class="w-full"
      >
        <template #description="{ item }">
          <div
            v-if="
              item.value === 'corporation' &&
              formState.organizationType === 'corporation'
            "
            class="flex justify-between items-start w-full flex-col"
          >
            <div class="text-sm text-gray-500 mt-1">{{ item.description }}</div>

            <!-- Checkboxes within the radio card -->
            <div class="pt-2 md:pt-4 space-y-2">
              <UCheckbox
                v-model="formState.isCloselyHeld"
                label="閉鎖型股份有限公司"
                class="text-sm"
              />
              <UCheckbox
                v-model="formState.hasParValueFreeShares"
                label="無票面閉鎖型股份有限公司"
                class="text-sm"
              />
            </div>
          </div>
        </template>
      </URadioGroup>
    </UFormField>

    <!-- Organization Type Specific Fields -->
    <template
      v-if="
        formState.organizationType === 'corporation' ||
        formState.organizationType === 'limited_company'
      "
    >
      <div class="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-md font-medium text-gray-800">組織類型相關資料</h3>

        <!-- Shared Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="僑外投資事業" name="isForeignInvestment">
            <UCheckbox
              v-model="formState.isForeignInvestment"
              label="是否為僑外投資事業"
              class="text-sm"
            />
          </UFormField>

          <UFormField label="陸資" name="isChineseInvestment">
            <UCheckbox
              v-model="formState.isChineseInvestment"
              label="是否涉及中國大陸地區投資"
              class="text-sm"
            />
          </UFormField>
        </div>
      </div>
    </template>

    <!-- Corporation-specific fields -->
    <template v-if="formState.organizationType === 'corporation'">
      <div class="space-y-4 p-4 bg-blue-50 rounded-lg">
        <h3 class="text-md font-medium text-blue-800">股份有限公司特有資料</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="公開發行" name="isPublicOffering">
            <UCheckbox
              v-model="formState.isPublicOffering"
              label="是否為公開發行公司"
              class="text-sm"
            />
          </UFormField>

          <UFormField
            v-if="formState.isCloselyHeld"
            label="閉鎖性股份有限公司股東人數"
            name="closelyHeldShareholderCount"
            required
          >
            <UInput
              v-model="formState.closelyHeldShareholderCount"
              type="number"
              min="1"
              placeholder="請輸入股東人數"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="space-y-3">
          <UFormField
            label="複數表決權特別股"
            name="hasMultipleVotingRightsPreferredShares"
          >
            <UCheckbox
              v-model="formState.hasMultipleVotingRightsPreferredShares"
              label="是否發行複數表決權特別股"
              class="text-sm"
            />
          </UFormField>

          <UFormField
            label="對於特定事項具否決權特別股"
            name="hasVetoRightsPreferredShares"
          >
            <UCheckbox
              v-model="formState.hasVetoRightsPreferredShares"
              label="是否發行對特定事項具否決權之特別股"
              class="text-sm"
            />
          </UFormField>

          <UFormField
            label="特別股股東董監事相關權利"
            name="hasPreferredSharesBoardRights"
          >
            <UCheckbox
              v-model="formState.hasPreferredSharesBoardRights"
              label="特別股股東被選為董事、監察人之禁止或限制或當選一定名額之權利"
              class="text-sm"
            />
          </UFormField>
        </div>
      </div>
    </template>

    <!-- Limited company-specific fields -->
    <template v-if="formState.organizationType === 'limited_company'">
      <div class="space-y-4 p-4 bg-green-50 rounded-lg">
        <h3 class="text-md font-medium text-green-800">有限公司特有資料</h3>

        <UFormField label="一人公司" name="isSoleProprietorshipLLC">
          <UCheckbox
            v-model="formState.isSoleProprietorshipLLC"
            label="是否為一人有限公司"
            class="text-sm"
          />
        </UFormField>
      </div>
    </template>

    <!-- Capital and Shares Section -->
    <div class="space-y-4">
      <!-- Always show capital amount -->
      <UFormField label="資本總額" name="capitalAmount">
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

      <!-- Only show share-related fields for corporations -->
      <template v-if="formState.organizationType === 'corporation'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="股份總數" name="totalShares">
            <UInputNumber
              v-model="formState.totalShares"
              :min="0"
              placeholder="請輸入股份總數"
              class="w-full"
            />
          </UFormField>

          <UFormField label="票面金額" name="parValue">
            <UInputNumber
              v-model="formState.parValue"
              :disabled="formState.hasParValueFreeShares"
              :min="0"
              placeholder="請輸入每股票面金額（新台幣）"
              class="w-full"
              :format-options="{
                style: 'currency',
                currency: 'TWD',
                currencyDisplay: 'code',
                currencySign: 'accounting',
              }"
            />
            <template #description>
              <div class="text-xs text-gray-500 mt-1">
                每股票面金額，選擇無票面金額時此欄位將被停用
              </div>
            </template>
          </UFormField>
        </div>
      </template>
    </div>

    <UFormField label="營業項目描述" name="businessItemsDescription">
      <UTextarea
        v-model="formState.businessItemsDescription"
        placeholder="請輸入營業項目描述"
        class="w-full"
      />
    </UFormField>

    <UFormField label="公司地址" name="address">
      <UInput
        v-model="formState.address"
        placeholder="請輸入公司地址"
        class="w-full"
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import { organizationTypeItems } from "../../helpers";

const applicationStore = useCompanyApplicationStore();
const { formState } = storeToRefs(applicationStore);
</script>
