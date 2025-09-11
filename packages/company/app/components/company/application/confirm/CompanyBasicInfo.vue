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

      <!-- Organization Type and Basic Configuration -->
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoDisplay
            label="組織類型"
            icon="i-lucide-building"
            :value="getOrganizationTypeLabel(formState.organizationType)"
            variant="highlighted"
            class="md:col-span-3"
          />
        </div>

        <!-- Corporation Basic Configuration -->
        <template v-if="formState.organizationType === 'corporation'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UAlert
              v-if="formState.isCloselyHeld"
              icon="i-lucide-shield"
              color="secondary"
              variant="soft"
              title="閉鎖型股份有限公司"
              description="股東人數限制的股份有限公司"
            />

            <UAlert
              v-if="formState.hasParValueFreeShares"
              icon="i-lucide-info"
              color="primary"
              variant="soft"
              title="無票面金額股份"
              description="採用無票面金額股份制度"
            />

            <UAlert
              v-if="formState.isPublicOffering"
              icon="i-lucide-trending-up"
              color="green"
              variant="soft"
              title="公開發行"
              description="公開發行股份有限公司"
            />
          </div>

          <!-- Corporation Additional Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoDisplay
              v-if="formState.closelyHeldShareholderCount"
              label="閉鎖型股東人數"
              icon="i-lucide-users"
              :value="formState.closelyHeldShareholderCount"
              :formatter="(val) => `${val} 人`"
            />
          </div>

          <!-- Corporation Investment Flags -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UAlert
              v-if="formState.isForeignInvestment"
              icon="i-lucide-globe"
              color="purple"
              variant="soft"
              title="僑外投資事業"
              description="已申報為僑外投資事業"
            />

            <UAlert
              v-if="formState.isChineseInvestment"
              icon="i-lucide-flag"
              color="orange"
              variant="soft"
              title="陸資投資"
              description="涉及大陸地區投資"
            />
          </div>

          <!-- Corporation Preferred Shares Features -->
          <div 
            v-if="formState.hasMultipleVotingRightsPreferredShares || formState.hasVetoRightsPreferredShares || formState.hasPreferredSharesBoardRights"
            class="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <UAlert
              v-if="formState.hasMultipleVotingRightsPreferredShares"
              icon="i-lucide-vote"
              color="blue"
              variant="soft"
              title="複數表決權特別股"
              description="具有複數表決權的特別股"
            />

            <UAlert
              v-if="formState.hasVetoRightsPreferredShares"
              icon="i-lucide-x-circle"
              color="red"
              variant="soft"
              title="否決權特別股"
              description="對特定事項具否決權的特別股"
            />

            <UAlert
              v-if="formState.hasPreferredSharesBoardRights"
              icon="i-lucide-crown"
              color="yellow"
              variant="soft"
              title="董事選任權特別股"
              description="特別股股東董事、監察人選任權利"
            />
          </div>
        </template>

        <!-- Limited Company Configuration -->
        <template v-if="formState.organizationType === 'limited_company'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UAlert
              v-if="formState.isSoleProprietorshipLLC"
              icon="i-lucide-user"
              color="indigo"
              variant="soft"
              title="一人有限公司"
              description="單一股東的有限公司"
            />

            <UAlert
              v-if="formState.isForeignInvestment"
              icon="i-lucide-globe"
              color="purple"
              variant="soft"
              title="僑外投資事業"
              description="已申報為僑外投資事業"
            />

            <UAlert
              v-if="formState.isChineseInvestment"
              icon="i-lucide-flag"
              color="orange"
              variant="soft"
              title="陸資投資"
              description="涉及大陸地區投資"
            />
          </div>
        </template>
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

        <!-- Ordinary Shares Amount -->
        <InfoDisplay
          v-if="formState.ordinarySharesAmount && isStockCompany"
          label="普通股股款總額"
          icon="i-lucide-circle-dollar-sign"
          :value="formState.ordinarySharesAmount"
          variant="highlighted"
          :formatter="(val) => `NT$ ${val?.toLocaleString()}`"
        />

        <!-- Preferred Shares Amount -->
        <InfoDisplay
          v-if="formState.preferredSharesAmount && isStockCompany"
          label="特別股股款總額"
          icon="i-lucide-star"
          :value="formState.preferredSharesAmount"
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
    readonly chosenName?: string;
    readonly ordinarySharesAmount?: number | null;
    readonly preferredSharesAmount?: number | null;
    readonly responsiblePerson: PersonSchema;
    readonly representative: PersonSchema;
    readonly contactPerson: PersonSchema;
    readonly shareholders: readonly ShareholderSchema[];
  };
  readonly isStockCompany: boolean;
}

defineProps<Props>();
</script>
