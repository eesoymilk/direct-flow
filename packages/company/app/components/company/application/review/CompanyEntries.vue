<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">公司基本資料</h3>
        <div class="flex items-center gap-2">
          <UBadge 
            v-if="sectionStatus.hasIssues" 
            :label="`${sectionStatus.issueCount} 個問題`"
            color="red" 
            variant="subtle" 
          />
          <UBadge 
            v-else-if="sectionStatus.isComplete"
            label="已完成"
            color="green"
            variant="subtle"
          />
          <UButton
            v-if="loggedIn && !sectionStatus.hasIssues"
            size="sm"
            color="green"
            variant="outline"
            icon="i-lucide-check"
            @click="verifySection"
          >
            驗證此部分
          </UButton>
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Company Names -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">候選公司名稱</label>
        <div class="flex flex-wrap gap-2">
          <UBadge 
            v-for="(name, index) in application.candidateNames" 
            :key="index"
            :label="name"
            :variant="index === 0 ? 'solid' : 'soft'"
            color="primary"
          />
        </div>
        <CompanyApplicationReviewFieldStatus field-path="company.candidateNames" :application="application" />
      </div>

      <!-- Organization Type -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">組織類型</label>
        <p class="text-gray-900">{{ getOrganizationTypeLabel(application.organizationType) }}</p>
        <CompanyApplicationReviewFieldStatus field-path="company.organizationType" :application="application" />
      </div>

      <!-- Business Description -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">營業項目描述</label>
        <p class="text-gray-900">{{ application.businessItemsDescription }}</p>
        <CompanyApplicationReviewFieldStatus field-path="company.businessItemsDescription" :application="application" />
      </div>

      <!-- Address -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">公司地址</label>
        <p class="text-gray-900">{{ application.address }}</p>
        <CompanyApplicationReviewFieldStatus field-path="company.address" :application="application" />
      </div>

      <!-- Capital Information (if available) -->
      <div v-if="application.capitalAmount || application.authorizedShares" class="space-y-4">
        <div v-if="application.capitalAmount" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">資本額</label>
          <p class="text-gray-900">NT$ {{ application.capitalAmount?.toLocaleString() }}</p>
        </div>
        
        <div v-if="application.authorizedShares" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">股份資訊</label>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div v-if="application.ordinaryShares">
              <span class="text-gray-600">普通股：</span>
              <span class="font-medium">{{ application.ordinaryShares.toLocaleString() }}</span>
            </div>
            <div v-if="application.preferredShares">
              <span class="text-gray-600">特別股：</span>
              <span class="font-medium">{{ application.preferredShares.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { getOrganizationTypeLabel } from "~/utils/labels";

interface Props {
  application: any; // TODO: Add proper typing
}

const props = defineProps<Props>();
const { loggedIn } = useUserSession();

// Use the new review overlay system
const { getSectionStatus } = useReviewOverlay(props.application);
const sectionStatus = computed(() => getSectionStatus('company'));

const verifySection = () => {
  // TODO: Implement section verification
  console.log('Verifying company section');
};
</script>
