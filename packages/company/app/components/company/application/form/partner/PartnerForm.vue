<template>
  <div class="space-y-4">
    <!-- Unified Partner Fields (showing/hiding based on partner type) -->
    <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
      <!-- Name Field -->
      <UFormField
        :label="isCorporateShareholder ? '法人名稱' : '姓名'"
        :name="isCorporateShareholder ? 'corporateEntity.name' : 'name'"
        class="col-span-2"
      >
        <UInput
          v-if="!isCorporateShareholder && partner.entityType === 'person'"
          v-model="partner.name"
          :readonly="partner.isReadonly"
          :disabled="partner.isReadonly"
          :placeholder="`請輸入${personTypeLabel}姓名`"
          class="w-full"
          :class="{ 'opacity-60': partner.isReadonly }"
        />
        <UInput
          v-else-if="
            isCorporateShareholder && partner.entityType === 'corporate'
          "
          v-model="partner.corporateEntity.name"
          placeholder="請輸入法人名稱"
          class="w-full"
        />
      </UFormField>

      <!-- ID Number / Unified Number Field -->
      <UFormField
        :label="isCorporateShareholder ? '統一編號' : '身分證字號'"
        :name="
          isCorporateShareholder ? 'corporateEntity.unifiedNumber' : 'idNumber'
        "
        required
        class="col-span-2"
      >
        <UInput
          v-if="!isCorporateShareholder && partner.entityType === 'person'"
          v-model="partner.idNumber"
          :readonly="partner.isReadonly"
          :disabled="partner.isReadonly"
          :placeholder="`請輸入${personTypeLabel}身分證字號`"
          class="w-full"
          :class="{ 'opacity-60': partner.isReadonly }"
        />
        <UInput
          v-else-if="
            isCorporateShareholder && partner.entityType === 'corporate'
          "
          v-model="partner.corporateEntity.unifiedNumber"
          placeholder="請輸入統一編號（8位數字）"
          maxlength="8"
          class="w-full"
        />
      </UFormField>

      <!-- Partner Type -->
      <UFormField label="職務" name="partnerType" class="col-span-2">
        <USelect
          v-model="partner.partnerType"
          :items="partnerTypeItems"
          :placeholder="`請選擇${personTypeLabel}職務`"
          class="w-full"
        />
      </UFormField>

      <!-- Corporate Representative Type (only for corporate) -->
      <UFormField
        v-if="isCorporateShareholder && partner.entityType === 'corporate'"
        label="法人代表類型"
        name="corporateEntity.representativeType"
        required
        class="col-span-full"
      >
        <URadioGroup
          v-model="partner.corporateEntity.representativeType"
          orientation="horizontal"
          variant="table"
          :items="[
            { value: 'directorRepresentative', label: '法人董事代表人' },
            {
              value: 'representativeDirector',
              label: '法人代表人董事（可多位）',
            },
          ]"
          :ui="{ item: 'w-full' }"
        />
      </UFormField>

      <!-- Representative Directors Selection (only for representativeDirector type) -->
      <UFormField
        v-if="
          isCorporateShareholder &&
          partner.entityType === 'corporate' &&
          partner.corporateEntity.representativeType ===
            'representativeDirector'
        "
        label="選擇代表人董事"
        name="corporateEntity.representativeDirectorIndices"
        required
        class="col-span-full"
      >
        <USelectMenu
          v-model="selectedRepresentativeIndices"
          :items="availablePartners"
          multiple
          placeholder="請選擇代表人董事"
          value-key="index"
          class="w-full"
        />
        <p v-if="supervisorWarning" class="mt-2 text-sm text-warning">
          ⚠️ 注意：法人代表人董事不可與監察人同時存在（除非只有一位法人股東）
        </p>
      </UFormField>

      <!-- Address Field -->
      <UFormField
        :label="isCorporateShareholder ? '公司地址' : '戶籍地址'"
        :name="isCorporateShareholder ? 'corporateEntity.address' : 'address'"
        required
        class="col-span-3"
      >
        <UInput
          v-if="!isCorporateShareholder && partner.entityType === 'person'"
          v-model="partner.address"
          :readonly="partner.isReadonly"
          :disabled="partner.isReadonly"
          :placeholder="`請輸入${personTypeLabel}戶籍地址`"
          class="w-full"
          :class="{ 'opacity-60': partner.isReadonly }"
        />
        <UInput
          v-else-if="
            isCorporateShareholder && partner.entityType === 'corporate'
          "
          v-model="partner.corporateEntity.address"
          placeholder="請輸入公司地址"
          class="w-full"
        />
      </UFormField>

      <!-- Birth Date / Establishment Date -->
      <UFormField
        :label="isCorporateShareholder ? '設立日期' : '出生日期'"
        :name="
          isCorporateShareholder
            ? 'corporateEntity.establishmentDate'
            : 'dateOfBirth'
        "
        required
        class="col-span-3"
      >
        <DatePicker
          v-if="!isCorporateShareholder && partner.entityType === 'person'"
          v-model="partner.dateOfBirth"
          date-format="yy/mm/dd"
          class="w-full h-8"
        />
        <DatePicker
          v-else-if="
            isCorporateShareholder && partner.entityType === 'corporate'
          "
          v-model="partner.corporateEntity.establishmentDate"
          date-format="yy/mm/dd"
          class="w-full h-8"
        />
      </UFormField>
    </div>

    <!-- Common Fields -->
    <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
      <UFormField
        label="出資額"
        name="capitalContribution"
        class="col-span-full"
        required
      >
        <UInputNumber
          v-model="partner.capitalContribution"
          :min="0"
          :disabled="isCorporation"
          :placeholder="
            isCorporation
              ? '自動計算（股份總額）'
              : `請輸入${personTypeLabel}出資額`
          "
          class="w-full"
          :class="{ 'opacity-60': isCorporation }"
          :format-options="{
            style: 'currency',
            currency: 'TWD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }"
        />
      </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  partner: PartnerSchema;
  partnerIndex: number;
}

const props = defineProps<Props>();

const { personTypeLabel, partnerTypeItems, defaultPartnerType } =
  usePartnerManagement();

const applicationStore = useCompanyApplicationStore();
const { formState, isCorporation, shareTypes } = storeToRefs(applicationStore);

// Computed to check if this is a corporate shareholder (for type narrowing)
const isCorporateShareholder = computed(() => {
  return (
    props.partner.partnerType === "corporateShareholder" &&
    props.partner.entityType === "corporate"
  );
});

// Available partners for representative director selection
const availablePartners = computed(() => {
  return formState.value.partners
    .map((p, index) => {
      if (index === props.partnerIndex) return null; // Can't select self
      if (p.partnerType === "corporateShareholder") return null; // Can't select corporate shareholders
      if (p.entityType !== "person") return null; // Only person partners

      return {
        index,
        label: p.name || `股東 ${index + 1}`,
        description: p.partnerType
          ? getPartnerTypeLabel(p.partnerType)
          : undefined,
        value: index,
      };
    })
    .filter(
      (
        item
      ): item is {
        index: number;
        label: string;
        description: any;
        value: number;
      } => item !== null
    );
});

// Selected representative indices (synced with corporateEntity.representativeDirectorIndices)
const selectedRepresentativeIndices = computed({
  get() {
    if (
      props.partner.partnerType === "corporateShareholder" &&
      props.partner.entityType === "corporate"
    ) {
      return props.partner.corporateEntity.representativeDirectorIndices || [];
    }
    return [];
  },
  set(value: number[]) {
    if (
      props.partner.partnerType === "corporateShareholder" &&
      props.partner.entityType === "corporate"
    ) {
      props.partner.corporateEntity.representativeDirectorIndices = value;
    }
  },
});

// Computed to show selected count
const selectedRepresentativesCount = computed(() => {
  return selectedRepresentativeIndices.value.length;
});

// Warning for supervisor conflict
const supervisorWarning = computed(() => {
  if (props.partner.partnerType !== "corporateShareholder") return false;
  if (props.partner.entityType !== "corporate") return false;
  if (
    props.partner.corporateEntity.representativeType !==
    "representativeDirector"
  )
    return false;

  const hasSupervisor = formState.value.partners.some(
    (p) => p.partnerType === "supervisor"
  );
  const corporateShareholderCount = formState.value.partners.filter(
    (p) => p.partnerType === "corporateShareholder"
  ).length;

  return hasSupervisor && corporateShareholderCount > 1;
});

// Helper function to calculate total capital from shares
// Only sum the share types that are currently active (based on shareTypes)
const calculateCapitalFromShares = (partner: PartnerSchema): number => {
  if (!partner.shares) return 0;

  let total = 0;
  // Only sum active share types
  for (const shareType of shareTypes.value) {
    const share = partner.shares[shareType];
    if (share && share.totalPrice) {
      total += Number(share.totalPrice);
    }
  }
  return total;
};

// Watch for shares changes and auto-calculate capital for corporation
watch(
  () => {
    // Watch all share properties and active share types to trigger on any change
    if (!props.partner.shares) return null;
    return {
      activeShareTypes: shareTypes.value,
      shares: shareTypes.value.map((shareType) => {
        const share = props.partner.shares![shareType];
        return {
          type: shareType,
          quantity: share?.quantity,
          pricePerShare: share?.pricePerShare,
          totalPrice: share?.totalPrice,
        };
      }),
    };
  },
  () => {
    if (isCorporation.value) {
      // For corporations (股份有限公司), capital is the sum of all shares
      const calculatedCapital = calculateCapitalFromShares(props.partner);
      props.partner.capitalContribution = calculatedCapital;
    }
  },
  { deep: true, immediate: true }
);

// Watch for partner type changes and automatically switch entity type
watch(
  () => props.partner.partnerType,
  (newType, oldType) => {
    // Auto-switch entity type based on partner type
    if (
      newType === "corporateShareholder" &&
      props.partner.entityType !== "corporate"
    ) {
      // Switching to corporate shareholder - initialize corporate entity
      const personData = props.partner as any;
      Object.assign(props.partner, {
        entityType: "corporate",
        corporateEntity: {
          name: personData.name || "",
          unifiedNumber: "",
          address: personData.address || "",
          establishmentDate: personData.dateOfBirth || new Date(),
          representativeType: "directorRepresentative",
          representativeDirectorIndices: [],
          contactPhone: undefined,
          email: personData.email,
        },
        cellphone: personData.cellphone || "",
        capitalContribution: personData.capitalContribution,
        isReadonly: personData.isReadonly,
        partnerType: "corporateShareholder",
        shares: personData.shares,
      });
    } else if (
      newType !== "corporateShareholder" &&
      props.partner.entityType !== "person"
    ) {
      // Switching to non-corporate type - initialize person fields
      const corporateData = props.partner as any;
      Object.assign(props.partner, {
        entityType: "person",
        name: corporateData.corporateEntity?.name || "",
        idNumber: "",
        address: corporateData.corporateEntity?.address || "",
        cellphone: corporateData.cellphone || "",
        dateOfBirth:
          corporateData.corporateEntity?.establishmentDate || new Date(),
        email: corporateData.corporateEntity?.email,
        capitalContribution: corporateData.capitalContribution,
        isReadonly: corporateData.isReadonly,
        partnerType: newType,
        shares: corporateData.shares,
      });
    }
  },
  { immediate: true } // Run immediately to set correct initial state
);
</script>
