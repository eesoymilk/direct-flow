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
          <!-- Corporation-specific options -->
          <div
            v-if="
              item.value === 'corporation' &&
              formState.organizationType === 'corporation'
            "
            class="flex justify-between items-start w-full flex-col"
          >
            <div class="text-sm text-gray-500 mt-1">{{ item.description }}</div>

            <!-- Corporation boolean fields within the radio card -->
            <div class="pt-3 space-y-3 w-full">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <UCheckbox
                  v-model="formState.isCloselyHeld"
                  label="閉鎖型股份有限公司"
                  class="text-sm"
                />
                <UCheckbox
                  v-model="formState.hasParValueFreeShares"
                  label="無票面金額股份"
                  class="text-sm"
                />
                <UCheckbox
                  v-model="formState.isPublicOffering"
                  label="公開發行公司"
                  class="text-sm"
                />
                <UCheckbox
                  v-model="formState.isForeignInvestment"
                  label="僑外投資事業"
                  class="text-sm"
                />
                <UCheckbox
                  v-model="formState.isChineseInvestment"
                  label="涉及中國大陸地區投資"
                  class="text-sm"
                />
                <UCheckbox
                  v-model="formState.hasMultipleVotingRightsPreferredShares"
                  label="複數表決權特別股"
                  class="text-sm"
                />
                <UCheckbox
                  v-model="formState.hasVetoRightsPreferredShares"
                  label="否決權特別股"
                  class="text-sm"
                />
                <UCheckbox
                  v-model="formState.hasPreferredSharesBoardRights"
                  label="特別股董監事權利"
                  class="text-sm"
                />
              </div>

              <!-- Closely held shareholder count -->
              <div v-if="formState.isCloselyHeld" class="pt-2">
                <UFormField
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
            </div>
          </div>

          <!-- Limited Company-specific options -->
          <div
            v-else-if="
              item.value === 'limited_company' &&
              formState.organizationType === 'limited_company'
            "
            class="flex justify-between items-start w-full flex-col"
          >
            <div class="text-sm text-gray-500 mt-1">{{ item.description }}</div>

            <!-- Limited company boolean fields within the radio card -->
            <div class="pt-3 space-y-3 w-full">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <UCheckbox
                  v-model="formState.isSoleProprietorshipLLC"
                  label="一人有限公司"
                  class="text-sm"
                />
                <UCheckbox
                  v-model="formState.isForeignInvestment"
                  label="僑外投資事業"
                  class="text-sm"
                />
                <UCheckbox
                  v-model="formState.isChineseInvestment"
                  label="涉及中國大陸地區投資"
                  class="text-sm"
                />
              </div>
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
