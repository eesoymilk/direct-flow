<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-building-2" class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-bold text-gray-900">公司基本資料</h3>
        </div>
        <UBadge color="success" variant="subtle">
          <UIcon name="i-lucide-check" class="w-3 h-3 mr-1" />
          已填寫
        </UBadge>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Company Names -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <UIcon
            name="i-lucide-text-cursor-input"
            class="w-4 h-4 text-gray-500"
          />
          <label class="text-sm font-semibold text-gray-700 tracking-wide">
            候選公司名稱
          </label>
        </div>
        <div class="flex items-center gap-3 md:gap-4">
          <UChip
            v-for="(name, index) in formState.candidateNames"
            :key="index"
            :text="index + 1"
            position="top-left"
            color="secondary"
            size="3xl"
          >
            <UBadge
              :label="name"
              color="primary"
              :variant="index === 0 ? 'solid' : 'soft'"
              size="xl"
            />
          </UChip>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoDisplay
          label="組織類型"
          icon="i-lucide-building"
          :value="getOrganizationTypeLabel(formState.organizationType)"
        />

        <UAlert
          v-if="
            formState.hasParValueFreeShares &&
            formState.organizationType === 'corporation' &&
            formState.isCloselyHeld
          "
          icon="i-lucide-info"
          color="primary"
          variant="soft"
          title="股份型態"
          description="採用無票面金額股份"
        />

        <UAlert
          v-if="formState.isCloselyHeld"
          icon="i-lucide-shield"
          color="secondary"
          variant="soft"
          title="公司類型"
          description="閉鎖型股份有限公司"
        />
      </div>

      <!-- Company Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Address -->
        <InfoDisplay
          label="公司地址"
          icon="i-lucide-map-pin"
          :value="formState.address"
          class="col-span-full"
        />

        <!-- Capital Amount -->
        <InfoDisplay
          v-if="formState.capitalAmount"
          label="資本總額"
          icon="i-lucide-banknote"
          variant="highlighted"
          :value="formState.capitalAmount"
          :formatter="(val) => `NT$ ${val?.toLocaleString()}`"
        />

        <!-- Total Shares (for stock companies) -->
        <InfoDisplay
          v-if="formState.totalShares && isStockCompany"
          label="股份總數"
          icon="i-lucide-hash"
          variant="highlighted"
          :value="formState.totalShares"
          :formatter="(val) => `${val?.toLocaleString()} 股`"
        />

        <!-- Par Value (for stock companies) -->
        <InfoDisplay
          v-if="formState.parValue && isStockCompany"
          label="票面金額"
          icon="i-lucide-coins"
          variant="highlighted"
          :value="formState.parValue"
          :formatter="(val) => `NT$ ${val?.toLocaleString()}`"
        />

        <!-- Paid-in Capital (for stock companies) -->
        <InfoDisplay
          v-if="formState.paidInCapital && isStockCompany"
          label="實收資本額"
          icon="i-lucide-wallet"
          :value="formState.paidInCapital"
          variant="highlighted"
          :formatter="(val) => `NT$ ${val?.toLocaleString()}`"
        />
      </div>

      <!-- Share information for stock companies -->
      <CompanyApplicationConfirmShareStructureInfo
        v-if="isStockCompany"
        :form-state="formState"
      />

      <!-- Business Description -->
      <InfoDisplay
        label="營業項目描述"
        icon="i-lucide-briefcase"
        :value="formState.businessItemsDescription"
        full-width
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { getOrganizationTypeLabel } from "~/utils/company/labels";

interface Props {
  formState: CompanyApplicationFormSchema & {
    responsiblePerson: PersonSchema;
    representative: PersonSchema;
    contactPerson: PersonSchema;
    shareholders: ShareholderSchema[];
  };
  isStockCompany: boolean;
}

defineProps<Props>();
</script>
