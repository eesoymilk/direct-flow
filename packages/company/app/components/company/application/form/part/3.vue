<template>
  <div class="space-y-4">
    <div class="flex items-center gap-4 mb-6">
      <h2 class="text-xl font-semibold text-text">股東資料</h2>
      <UButton
        icon="i-lucide-plus"
        label="新增股東"
        variant="soft"
        class="rounded-full"
        @click="addShareholder"
      />
      <UButton
        v-if="canAddShareType"
        icon="i-lucide-plus"
        label="新增特別股"
        variant="soft"
        class="rounded-full"
        @click="addShareType"
      />
      <UButton
        v-if="canRemoveShareType"
        icon="i-lucide-minus"
        label="刪除特別股"
        variant="outline"
        color="error"
        class="rounded-full"
        @click="removeShareType"
      />
      <UDropdownMenu
        :items="exsitingPeopleMenuItems"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          icon="i-lucide-user-plus"
          label="加入現有人員"
          variant="outline"
          class="rounded-full"
        />
      </UDropdownMenu>
    </div>

    <!-- Shareholders array validation wrapper -->
    <UForm
      :state="{ shareholders: formState.shareholders }"
      :schema="z.object({ shareholders: shareholderArraySchema })"
      attach
    >
      <UFormField name="shareholders">
        <div class="space-y-6">
          <UForm
            v-for="(shareholder, index) in formState.shareholders"
            :key="index"
            :state="shareholder"
            :schema="shareholderSchema"
            attach
            class="space-y-4"
          >
            <UCard
              variant="subtle"
              class="relative overflow-visible"
              :class="{
                'border-primary/20 bg-primary/5': shareholder.isReadonly,
              }"
            >
              <div
                v-if="shareholder.isReadonly && shareholder.referenceType"
                class="absolute top-2 right-2 flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"
              >
                <UIcon name="i-lucide-link" class="w-3 h-3" />
                {{ getPersonLabel(shareholder.referenceType) }}（僅可編輯持股）
              </div>
              <div class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField label="姓名" name="name" class="w-full">
                  <UInput
                    v-model="shareholder.name"
                    :readonly="shareholder.isReadonly"
                    :disabled="shareholder.isReadonly"
                    placeholder="請輸入股東姓名"
                    class="w-full"
                    :class="{ 'opacity-60': shareholder.isReadonly }"
                  />
                </UFormField>

                <UFormField label="身分證字號" name="idNumber" required>
                  <UInput
                    v-model="shareholder.idNumber"
                    :readonly="shareholder.isReadonly"
                    :disabled="shareholder.isReadonly"
                    placeholder="請輸入股東身分證字號"
                    class="w-full"
                    :class="{ 'opacity-60': shareholder.isReadonly }"
                  />
                </UFormField>

                <UFormField label="戶籍地址" name="address" required>
                  <UInput
                    v-model="shareholder.address"
                    :readonly="shareholder.isReadonly"
                    :disabled="shareholder.isReadonly"
                    placeholder="請輸入股東戶籍地址"
                    class="w-full"
                    :class="{ 'opacity-60': shareholder.isReadonly }"
                  />
                </UFormField>

                <UFormField label="出生日期" name="dateOfBirth" required>
                  <DatePicker
                    :value="shareholder.dateOfBirth"
                    @select-date="(date) => (shareholder.dateOfBirth = date)"
                  />
                </UFormField>

                <UFormField
                  label="出資額"
                  name="capitalContribution"
                  class="col-span-full"
                  required
                >
                  <UInputNumber
                    v-model="shareholder.capitalContribution"
                    :min="0"
                    placeholder="請輸入出資額"
                    class="w-full"
                    :format-options="{
                      style: 'currency',
                      currency: 'TWD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }"
                  />
                </UFormField>

                <USeparator
                  v-if="isStockCompany && shareholder.shares"
                  class="col-span-full"
                />

                <!-- Stock company shares -->
                <div class="col-span-full space-y-4">
                  <h4 class="text-md font-medium text-text">持股資料</h4>
                  <template v-if="isStockCompany && shareholder.shares">
                    <UForm
                      v-for="[shareType, share] in Object.entries(
                        shareholder.shares
                      ).slice(0, shareCount)"
                      :key="shareType"
                      :state="share"
                      :schema="getShareSchema(shareType as ShareType)"
                    >
                      <UCard
                        class="bg-primary/5 rounded-lg border border-primary/20"
                      >
                        <template #header>
                          <h5 class="text-sm font-medium text-primary">
                            {{ getShareTypeLabel(shareType as ShareType) }}
                          </h5>
                        </template>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <UFormField label="股數">
                            <UInputNumber
                              v-model="share.quantity"
                              :min="0"
                              placeholder="請輸入股數"
                              class="w-full"
                              :format-options="{
                                style: 'decimal',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }"
                              @update:model-value="
                                updateQuantity(
                                  shareholder,
                                  shareType as ShareType,
                                  $event
                                )
                              "
                            />
                          </UFormField>

                          <UFormField label="每股金額">
                            <UInputNumber
                              v-model="share.pricePerShare"
                              :min="0"
                              :step="0.01"
                              :disabled="formState.hasParValueFreeShares"
                              :placeholder="
                                formState.hasParValueFreeShares
                                  ? 'NT$ 10.00 (無票面金額)'
                                  : '請輸入每股金額'
                              "
                              class="w-full"
                              :class="{
                                'opacity-60': formState.hasParValueFreeShares,
                              }"
                              :format-options="{
                                style: 'currency',
                                currency: 'TWD',
                                currencyDisplay: 'code',
                                currencySign: 'accounting',
                              }"
                              @update:model-value="
                                updatePricePerShare(
                                  shareholder,
                                  shareType as ShareType,
                                  $event
                                )
                              "
                            />
                          </UFormField>

                          <UFormField label="總金額">
                            <UInputNumber
                              v-model="share.totalPrice"
                              :min="0"
                              :step="0.01"
                              disabled
                              placeholder="自動計算"
                              class="w-full opacity-60"
                              :format-options="{
                                style: 'currency',
                                currency: 'TWD',
                                currencyDisplay: 'code',
                                currencySign: 'accounting',
                              }"
                            />
                          </UFormField>
                        </div>
                      </UCard>
                    </UForm>
                  </template>
                </div>
              </div>

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
                :disabled="formState.shareholders.length === 1"
                @click="removeShareholder(index)"
              />
            </UCard>

            <USeparator
              v-if="index !== formState.shareholders.length - 1"
              class="my-6"
            />
          </UForm>
        </div>
      </UFormField>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import * as z from "zod";

const applicationStore = useCompanyApplicationStore();
const { formState, shareTypes, isStockCompany, shareCount } =
  storeToRefs(applicationStore);
const {
  addShareholder,
  addShareType,
  removeShareType,
  removeShareholder,
  addPersonAsShareholder,
} = applicationStore;

const canAddShareType = computed(
  () => shareTypes.value.length < SHARE_TYPES.length
);

const canRemoveShareType = computed(() => shareTypes.value.length > 1);

// Function to update total price (computed property for each shareholder share type)
const updateQuantity = (
  shareholder: ShareholderSchema,
  shareType: ShareType,
  quantity: number
) => {
  if (shareholder.shares && shareholder.shares[shareType]) {
    shareholder.shares[shareType].totalPrice =
      quantity * shareholder.shares[shareType].pricePerShare;
  }
};

const updatePricePerShare = (
  shareholder: ShareholderSchema,
  shareType: ShareType,
  pricePerShare: number
) => {
  if (shareholder.shares && shareholder.shares[shareType]) {
    shareholder.shares[shareType].totalPrice =
      shareholder.shares[shareType].quantity * pricePerShare;
  }
};

// Watch for hasParValueFreeShares changes and set pricePerShare to 10 when true
watch(
  () => formState.value.hasParValueFreeShares,
  (hasParValueFreeShares) => {
    if (hasParValueFreeShares) {
      // Set all shareholders' shares pricePerShare to 10
      formState.value.shareholders.forEach((shareholder) => {
        if (shareholder.shares) {
          Object.keys(shareholder.shares).forEach((shareType) => {
            const shareTypeKey = shareType as ShareType;
            if (shareholder.shares?.[shareTypeKey]) {
              shareholder.shares[shareTypeKey].pricePerShare = 10;
              // Recalculate total price
              shareholder.shares[shareTypeKey].totalPrice =
                shareholder.shares[shareTypeKey].quantity * 10;
            }
          });
        }
      });
    }
  },
  { immediate: true }
);

// Generate dropdown menu items for adding persons
const exsitingPeopleMenuItems = computed(() => {
  const items: DropdownMenuItem[] = [];

  items.push({
    label: `加入負責人 (${formState.value.responsiblePerson.name})`,
    icon: "i-lucide-user",
    onSelect: () => addPersonAsShareholder("responsiblePerson"),
  });

  if (!formState.value.isRepresentativeSameAsResponsiblePerson) {
    items.push({
      label: `加入代表人 (${formState.value.representative.name})`,
      icon: "i-lucide-briefcase",
      onSelect: () => addPersonAsShareholder("representative"),
    });
  }

  if (
    !formState.value.isContactPersonSameAsResponsiblePerson &&
    !formState.value.isContactPersonSameAsRepresentative
  ) {
    items.push({
      label: `加入聯絡人 (${formState.value.contactPerson.name})`,
      icon: "i-lucide-phone",
      onSelect: () => addPersonAsShareholder("contactPerson"),
    });
  }

  return items;
});
</script>
