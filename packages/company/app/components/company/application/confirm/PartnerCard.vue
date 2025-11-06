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
              {{ displayName }}
            </h4>
            <p class="text-sm text-gray-500">
              {{ displayType }}
              <span v-if="partner.isReadonly" class="text-primary ml-2">
                （{{ hasShares ? "僅可編輯持股及出資額" : "僅可編輯出資額" }}）
              </span>
            </p>
          </div>
        </div>
        <UBadge
          v-if="partner.entityType === 'corporate'"
          label="法人"
          color="info"
          variant="soft"
        />
        <UBadge
          v-else-if="partner.referenceType"
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
      <!-- Person Partner Info -->
      <div v-if="partner.entityType === 'person'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

          <!-- Corporate Partner Info -->
          <div v-if="partner.entityType === 'corporate'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoDisplay
              label="統一編號"
              icon="i-lucide-building"
              :value="partner.corporateEntity.unifiedNumber || '未填寫'"
              class="col-span-full border border-blue-200 bg-blue-50"
            />
            <InfoDisplay
              label="法人所在地"
              icon="i-lucide-map-pin"
              :value="partner.corporateEntity.address || '未填寫'"
            />
            <InfoDisplay
              label="設立日期"
              icon="i-lucide-calendar"
              :value="
                partner.corporateEntity.establishmentDate
                  ? format(partner.corporateEntity.establishmentDate, 'yyyy/MM/dd')
                  : '未填寫'
              "
            />
            <InfoDisplay
              label="法人代表類型"
              icon="i-lucide-briefcase"
              :value="getCorporateRepresentativeTypeLabel(partner.corporateEntity.representativeType)"
              class="col-span-full border border-blue-200 bg-blue-50"
            />
            <InfoDisplay
              v-if="partner.corporateEntity.representativeType === 'representativeDirector' && representativeDirectors.length > 0"
              label="代表人董事"
              icon="i-lucide-users"
              :value="representativeDirectors.join('、')"
              class="col-span-full border border-purple-200 bg-purple-50"
            />
            <InfoDisplay
              label="聯絡人手機"
              icon="i-lucide-phone"
              :value="partner.cellphone"
            />
          </div>

      <!-- Common Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

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
  allPartners?: PartnerSchema[];
}

const props = defineProps<Props>();

// Display name based on entity type
const displayName = computed(() => {
  if (props.partner.entityType === "person") {
    return props.partner.name;
  } else {
    return props.partner.corporateEntity.name;
  }
});

// Display type based on entity and partner type
const displayType = computed(() => {
  if (props.partner.entityType === "corporate") {
    return "法人股東";
  }
  
  if (props.partner.referenceType) {
    return getPersonLabel(props.partner.referenceType);
  }

  // Fallback to organization-aware label
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

// Representative directors names (for corporate partners with representativeDirector type)
const representativeDirectors = computed(() => {
  if (
    props.partner.entityType === 'corporate' &&
    props.partner.corporateEntity.representativeType === 'representativeDirector' &&
    props.allPartners
  ) {
    const indices = props.partner.corporateEntity.representativeDirectorIndices || [];
    return indices
      .map(idx => {
        const p = props.allPartners?.[idx];
        if (p && p.entityType === 'person') {
          return p.name;
        }
        return null;
      })
      .filter((name): name is string => name !== null);
  }
  return [];
});
</script>
