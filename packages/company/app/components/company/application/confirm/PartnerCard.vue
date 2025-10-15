<template>
  <UCard variant="subtle" class="relative">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UButton
            :label="String(index + 1)"
            size="sm"
            color="secondary"
            class="rounded-full"
          />
          <div>
            <h4 class="text-lg font-semibold text-gray-900">
              {{ partner.name }}
            </h4>
            <p class="text-sm text-gray-500">
              {{
                partner.referenceType
                  ? getPersonLabel(partner.referenceType)
                  : partnerLabel
              }}
              <span v-if="partner.isReadonly" class="text-primary ml-2">
                （{{ hasShares ? "僅可編輯持股及出資額" : "僅可編輯出資額" }}）
              </span>
            </p>
          </div>
        </div>
        <UBadge
          v-if="partner.referenceType"
          :label="getPersonLabel(partner.referenceType)"
          color="primary"
          variant="soft"
        />
      </div>
    </template>

    <div class="space-y-4">
      <!-- Partner Role/Type -->
      <CompanyApplicationConfirmPartnerRoles
        :partner="partner"
        :organization-type="organizationType"
      />

      <!-- Basic Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoDisplay
          label="身分證字號"
          icon="i-lucide-id-card"
          :value="partner.idNumber"
        />
        <InfoDisplay
          label="戶籍地址"
          icon="i-lucide-map-pin"
          :value="partner.address"
        />
        <InfoDisplay
          label="手機號碼"
          icon="i-lucide-phone"
          :value="partner.cellphone"
        />
        <InfoDisplay
          label="出生日期"
          icon="i-lucide-calendar"
          :value="
            partner.dateOfBirth
              ? format(partner.dateOfBirth, 'yyyy/MM/dd')
              : '未填寫'
          "
        />

        <!-- Corporate partner fields -->
        <template v-if="isCorporatePartner">
          <InfoDisplay
            label="統一編號"
            icon="i-lucide-building"
            :value="partner.corporateUnifiedNumber || '未填寫'"
            class="col-span-full border border-blue-200 bg-blue-50"
          />
          <InfoDisplay
            label="法人所在地"
            icon="i-lucide-map-pin"
            :value="partner.corporateAddress || '未填寫'"
            class="col-span-full border border-blue-200 bg-blue-50"
          />
        </template>

        <InfoDisplay
          :label="capitalLabel"
          icon="i-lucide-dollar-sign"
          :value="
            partner.capitalContribution !== undefined &&
            partner.capitalContribution !== null
              ? `NT$ ${partner.capitalContribution.toLocaleString()}`
              : '未填寫'
          "
          variant="highlighted"
          class="col-span-full border border-green-200 bg-green-50"
        />
      </div>

      <!-- Share Holdings (for stock companies) -->
      <CompanyApplicationConfirmShareHoldings
        v-if="hasShares && partner.shares"
        :shares="partner.shares"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { format } from "date-fns";

interface Props {
  partner: PartnerSchema;
  index: number;
  organizationType: OrganizationType;
}

const props = defineProps<Props>();

// Organization-aware labels
const partnerLabel = computed(() => {
  switch (props.organizationType) {
    case "corporation":
    case "limited_company":
      return "股東";
    case "partnership":
      return "合夥人";
    case "sole_proprietorship":
      return "負責人";
    default:
      return "成員";
  }
});

const capitalLabel = computed(() => {
  switch (props.organizationType) {
    case "corporation":
    case "limited_company":
      return "出資額";
    case "partnership":
      return "合夥出資額";
    case "sole_proprietorship":
      return "資本額";
    default:
      return "出資額";
  }
});

// Only corporations and limited companies have shares
const hasShares = computed(() => {
  return (
    props.organizationType === "corporation" ||
    props.organizationType === "limited_company"
  );
});

// Check if this is a corporate partner
const isCorporatePartner = computed(() => {
  return (
    props.partner.partnerType === "corporateShareholder" ||
    props.partner.partnerType === "corporateDirectorRepresentative" ||
    props.partner.partnerType === "corporateRepresentativeDirector"
  );
});
</script>
