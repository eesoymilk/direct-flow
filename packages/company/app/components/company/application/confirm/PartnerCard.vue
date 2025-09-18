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
                  : "股東"
              }}
              <span v-if="partner.isReadonly" class="text-primary ml-2">
                （僅可編輯持股）
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
          label="出生日期"
          icon="i-lucide-calendar"
          :value="
            partner.dateOfBirth
              ? format(partner.dateOfBirth, 'yyyy/MM/dd')
              : '未填寫'
          "
        />
        <InfoDisplay
          label="出資額"
          icon="i-lucide-dollar-sign"
          :value="
            partner.capitalContribution !== undefined &&
            partner.capitalContribution !== null
              ? `NT$ ${partner.capitalContribution.toLocaleString()}`
              : '未填寫'
          "
        />
      </div>

      <!-- Share Holdings (for stock companies) -->
      <CompanyApplicationConfirmShareHoldings
        v-if="isCorporation && partner.shares"
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
  isCorporation: boolean;
}

defineProps<Props>();
</script>
