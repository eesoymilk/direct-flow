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

      <!-- Foreign Name -->
      <InfoDisplay
        v-if="formState.foreignName"
        label="外文名稱"
        icon="i-lucide-globe"
        :value="formState.foreignName"
        variant="highlighted"
        class="border-2 border-blue-200 bg-blue-50"
        full-width
      />

      <!-- Chosen Name -->
      <InfoDisplay
        v-if="formState.chosenName"
        label="選定公司名稱"
        icon="i-lucide-check-circle"
        :value="formState.chosenName"
        variant="highlighted"
        class="border-2 border-green-200 bg-green-50"
        full-width
      />

      <!-- Organization Type -->
      <InfoDisplay
        label="組織類型"
        icon="i-lucide-building"
        :value="getOrganizationTypeLabel(formState.organizationType)"
        variant="highlighted"
        class="col-span-full"
      />

      <!-- Organization-specific Configuration -->
      <CompanyApplicationConfirmCompanyConfiguration
        :form-state="formState"
        :organization-type="formState.organizationType"
      />

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
          v-if="formState.totalShares && isCorporation"
          label="股份總數"
          icon="i-lucide-hash"
          variant="highlighted"
          :value="formState.totalShares"
          :formatter="(val) => `${val?.toLocaleString()} 股`"
        />

        <!-- Par Value (for stock companies) -->
        <InfoDisplay
          v-if="formState.parValue && isCorporation"
          label="票面金額"
          icon="i-lucide-coins"
          variant="highlighted"
          :value="formState.parValue"
          :formatter="(val) => `NT$ ${val?.toLocaleString()}`"
        />

        <!-- Paid-in Capital (for stock companies) -->
        <InfoDisplay
          v-if="formState.paidInCapital && isCorporation"
          label="實收資本額"
          icon="i-lucide-wallet"
          :value="formState.paidInCapital"
          variant="highlighted"
          :formatter="(val) => `NT$ ${val?.toLocaleString()}`"
        />

        <!-- Ordinary Shares Amount -->
        <InfoDisplay
          v-if="formState.ordinarySharesAmount && isCorporation"
          label="普通股股款總額"
          icon="i-lucide-circle-dollar-sign"
          :value="formState.ordinarySharesAmount"
          variant="highlighted"
          :formatter="(val) => `NT$ ${val?.toLocaleString()}`"
        />

        <!-- Preferred Shares Amount -->
        <InfoDisplay
          v-if="formState.preferredSharesAmount && isCorporation"
          label="特別股股款總額"
          icon="i-lucide-star"
          :value="formState.preferredSharesAmount"
          variant="highlighted"
          :formatter="(val) => `NT$ ${val?.toLocaleString()}`"
        />
      </div>

      <!-- Share information for stock companies -->
      <CompanyApplicationConfirmShareStructureInfo
        v-if="isCorporation"
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
interface Props {
  formState: CompanyApplicationFormSchema & {
    readonly chosenName?: string;
    readonly ordinarySharesAmount?: number | null;
    readonly preferredSharesAmount?: number | null;
    readonly responsiblePerson: PersonSchema;
    readonly contactPerson: PersonSchema;
    readonly partners: readonly PartnerSchema[];
  };
  readonly isCorporation: boolean;
}

const props = defineProps<Props>();

const isCorporation = computed(
  () => props.formState.organizationType === "corporation"
);
const isLimitedCompany = computed(
  () => props.formState.organizationType === "limited_company"
);
</script>
