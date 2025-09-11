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
              {{ shareholder.name }}
            </h4>
            <p class="text-sm text-gray-500">
              {{
                shareholder.referenceType
                  ? getPersonLabel(shareholder.referenceType)
                  : "股東"
              }}
              <span v-if="shareholder.isReadonly" class="text-primary ml-2">
                （僅可編輯持股）
              </span>
            </p>
          </div>
        </div>
        <UBadge
          v-if="shareholder.referenceType"
          :label="getPersonLabel(shareholder.referenceType)"
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
          :value="shareholder.idNumber"
        />
        <InfoDisplay
          label="戶籍地址"
          icon="i-lucide-map-pin"
          :value="shareholder.address"
        />
        <InfoDisplay
          label="出生日期"
          icon="i-lucide-calendar"
          :value="
            shareholder.dateOfBirth
              ? format(shareholder.dateOfBirth, 'yyyy/MM/dd')
              : '未填寫'
          "
        />
        <InfoDisplay
          label="出資額"
          icon="i-lucide-dollar-sign"
          :value="
            shareholder.capitalContribution !== undefined && shareholder.capitalContribution !== null
              ? `NT$ ${shareholder.capitalContribution.toLocaleString()}`
              : '未填寫'
          "
        />
      </div>

      <!-- Share Holdings (for stock companies) -->
      <CompanyApplicationConfirmShareHoldings
        v-if="isStockCompany && shareholder.shares"
        :shares="shareholder.shares"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { getPersonLabel } from "~/utils/company/labels";

interface Props {
  shareholder: ShareholderSchema;
  index: number;
  isStockCompany: boolean;
}

defineProps<Props>();

// const { shareCount } = storeToRefs(useCompanyApplicationStore());
</script>
