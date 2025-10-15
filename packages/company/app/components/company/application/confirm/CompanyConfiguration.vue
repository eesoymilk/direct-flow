<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Corporation Configuration -->
    <template v-if="organizationType === 'corporation'">
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
        color="success"
        variant="soft"
        title="公開發行"
        description="公開發行股份有限公司"
      />

      <UAlert
        v-if="formState.isForeignInvestment"
        icon="i-lucide-globe"
        color="primary"
        variant="soft"
        title="僑外投資事業"
        description="已申報為僑外投資事業"
      />

      <UAlert
        v-if="formState.isChineseInvestment"
        icon="i-lucide-flag"
        color="warning"
        variant="soft"
        title="陸資投資"
        description="涉及大陸地區投資"
      />

      <UAlert
        v-if="formState.hasMultipleVotingRightsPreferredShares"
        icon="i-lucide-vote"
        color="primary"
        variant="soft"
        title="複數表決權特別股"
        description="具有複數表決權的特別股"
      />

      <UAlert
        v-if="formState.hasVetoRightsPreferredShares"
        icon="i-lucide-x-circle"
        color="error"
        variant="soft"
        title="否決權特別股"
        description="對特定事項具否決權的特別股"
      />

      <UAlert
        v-if="formState.hasPreferredSharesBoardRights"
        icon="i-lucide-crown"
        color="warning"
        variant="soft"
        title="董事選任權特別股"
        description="特別股股東董事、監察人選任權利"
      />
    </template>

    <!-- Limited Company Configuration -->
    <template v-if="organizationType === 'limited_company'">
      <UAlert
        v-if="formState.isSoleProprietorshipLLC"
        icon="i-lucide-user"
        color="secondary"
        variant="soft"
        title="一人有限公司"
        description="單一股東的有限公司"
      />

      <UAlert
        v-if="formState.isForeignInvestment"
        icon="i-lucide-globe"
        color="primary"
        variant="soft"
        title="僑外投資事業"
        description="已申報為僑外投資事業"
      />

      <UAlert
        v-if="formState.isChineseInvestment"
        icon="i-lucide-flag"
        color="warning"
        variant="soft"
        title="陸資投資"
        description="涉及大陸地區投資"
      />
    </template>

    <!-- Partnership Configuration -->
    <template v-if="organizationType === 'partnership'">
      <UAlert
        v-if="formState.hasForeignPartner"
        icon="i-lucide-globe"
        color="primary"
        variant="soft"
        title="有外國合夥人"
        description="包含外國籍合夥人"
      />

      <UAlert
        v-if="formState.hasChinesePartner"
        icon="i-lucide-flag"
        color="warning"
        variant="soft"
        title="有大陸地區合夥人"
        description="包含大陸地區合夥人"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  formState: CompanyApplicationFormSchema;
  organizationType: OrganizationType;
}

defineProps<Props>();
</script>
