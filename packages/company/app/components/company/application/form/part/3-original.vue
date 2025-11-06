<template>
  <div class="space-y-4">
    <div class="flex items-center gap-4 mb-6">
      <h2 class="text-xl font-semibold text-text">{{ personTypeLabel }}資料</h2>
      <UButton
        icon="i-lucide-plus"
        :label="`新增${personTypeLabel}`"
        variant="soft"
        class="rounded-full"
        @click="addPartner"
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

    <!-- Partners array validation wrapper -->
    <UForm
      v-for="(partner, index) in formState.partners"
      :key="index"
      :name="`partners.${index}`"
      :schema="partnerSchema"
      nested
    >
      <div class="space-y-6">
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
          <div v-if="partner.entityType === 'person'" class="space-y-4 grid grid-cols-1 md:grid-cols-6 gap-4">
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

            <UFormField
              label="身分證字號"
              name="idNumber"
              required
              class="col-span-2"
            >
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

            <UFormField
              label="戶籍地址"
              name="address"
              required
              class="col-span-3"
            >
              <UInput
                v-model="partner.address"
                :readonly="partner.isReadonly"
                :disabled="partner.isReadonly"
                :placeholder="`請輸入${personTypeLabel}戶籍地址`"
                class="w-full"
                :class="{ 'opacity-60': partner.isReadonly }"
              />
            </UFormField>

            <UFormField
              label="出生日期"
              name="dateOfBirth"
              required
              class="col-span-3"
            >
              <DatePicker
                v-model="partner.dateOfBirth"
                date-format="yy/mm/dd"
                class="w-full h-8"
              />
            </UFormField>

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

            <USeparator
              v-if="isCorporation && partner.shares"
              class="col-span-full"
            />

            <!-- Stock company shares -->
            <div
              v-if="isCorporation && partner.shares"
              class="col-span-full space-y-4"
            >
              <h4 class="text-md font-medium text-text">持股資料</h4>
              <!-- TODO: add datatable style -->
              <DataTable :value="shareEntries">
                <Column field="label" header="名稱"></Column>
                <Column field="quantity" header="股數">
                  <template #body="{ data }">
                    <UInputNumber
                      v-model="
                        partner.shares[data.shareType as ShareType].quantity
                      "
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
                          partner,
                          data.shareType as ShareType,
                          $event
                        )
                      "
                    />
                  </template>
                </Column>
                <Column header="每股金額">
                  <template #body="{ data }">
                    <UInputNumber
                      v-model="
                        partner.shares[data.shareType as ShareType]
                          .pricePerShare
                      "
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
                          partner,
                          data.shareType as ShareType,
                          $event
                        )
                      "
                    />
                  </template>
                </Column>
                <Column header="總金額">
                  <template #body="{ data }">
                    <UInputNumber
                      v-model="
                        partner.shares[data.shareType as ShareType].totalPrice
                      "
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
                  </template>
                </Column>
              </DataTable>
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
            :disabled="formState.partners.length === 1"
            @click="removePartner(index)"
          />
        </UCard>

        <USeparator
          v-if="index !== formState.partners.length - 1"
          class="my-6"
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const applicationStore = useCompanyApplicationStore();
const { formState, shareTypes, isCorporation, shareCount } =
  storeToRefs(applicationStore);
const {
  addPartner,
  addShareType,
  removeShareType,
  removePartner,
  addPersonAsPartner,
} = applicationStore;

const shareEntries = computed(() =>
  shareTypes.value.map((shareType) => ({
    label: getShareTypeLabel(shareType, shareCount.value),
    shareType,
  }))
);

const partnerTypeItems = computed(
  (): { label: string; value: PartnerType }[] => {
    let partnerTypes: PartnerType[] = [];
    switch (formState.value.organizationType) {
      case "limited_company":
        partnerTypes = ["director", "shareholder", "manager"];
        break;
      case "corporation":
        partnerTypes = [
          "chairman",
          "viceChairman",
          "executiveDirector",
          "director",
          "supervisor",
        ];
        break;
      case "partnership":
        partnerTypes = ["partner", "manager", "legalRepresentative"];
        break;
    }

    return partnerTypes.map((type) => ({
      label: getPartnerTypeLabel(type),
      value: type,
    }));
  }
);

const defaultPartnerType = computed((): PartnerType | undefined => {
  switch (formState.value.organizationType) {
    case "limited_company":
      return "shareholder";
    case "corporation":
      return "chairman";
    case "partnership":
      return "partner";
    default:
      return undefined;
  }
});

const personTypeLabel = computed(() =>
  formState.value.organizationType === "partnership" ? "合夥人" : "股東"
);

const canAddShareType = computed(
  () => isCorporation.value && shareTypes.value.length < SHARE_TYPES.length
);

const canRemoveShareType = computed(
  () => isCorporation.value && shareTypes.value.length > 1
);

const updateQuantity = (
  partner: PartnerSchema,
  shareType: ShareType,
  quantity: number
) => {
  if (partner.shares && partner.shares[shareType]) {
    partner.shares[shareType].totalPrice =
      quantity * partner.shares[shareType].pricePerShare;
  }
};

const updatePricePerShare = (
  partner: PartnerSchema,
  shareType: ShareType,
  pricePerShare: number
) => {
  if (partner.shares && partner.shares[shareType]) {
    partner.shares[shareType].totalPrice =
      partner.shares[shareType].quantity * pricePerShare;
  }
};

watch(
  () => formState.value.hasParValueFreeShares,
  (hasParValueFreeShares) => {
    if (hasParValueFreeShares) {
      // Set all partners' shares pricePerShare to 10
      formState.value.partners.forEach((partner) => {
        if (partner.shares) {
          Object.keys(partner.shares).forEach((shareType) => {
            const shareTypeKey = shareType as ShareType;
            if (partner.shares?.[shareTypeKey]) {
              partner.shares[shareTypeKey].pricePerShare = 10;
              // Recalculate total price
              partner.shares[shareTypeKey].totalPrice =
                partner.shares[shareTypeKey].quantity * 10;
            }
          });
        }
      });
    }
  },
  { immediate: true }
);

const exsitingPeopleMenuItems = computed(() => {
  const items: DropdownMenuItem[] = [];

  items.push({
    label: `加入負責人 (${formState.value.responsiblePerson.name})`,
    icon: "i-lucide-user",
    onSelect: () => addPersonAsPartner("responsiblePerson"),
  });

  if (!formState.value.isContactPersonSameAsResponsiblePerson) {
    items.push({
      label: `加入聯絡人 (${formState.value.contactPerson.name})`,
      icon: "i-lucide-phone",
      onSelect: () => addPersonAsPartner("contactPerson"),
    });
  }

  return items;
});
</script>
