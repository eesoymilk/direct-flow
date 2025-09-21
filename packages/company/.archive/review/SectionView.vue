<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Review Header -->
    <div class="flex items-center justify-between px-4 md:px-6">
      <div class="flex items-bottom gap-2">
        <h2 class="text-2xl font-semibold text-gray-900">審查進度</h2>
        <UBadge :label="headerDescription" color="info" variant="subtle" />
      </div>
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-600">
          <span class="font-medium text-red-600">{{ totalIssues }}</span>
          嚴重問題 •
          <span class="font-medium text-yellow-600">{{
            totalCriticalIssues
          }}</span>
          總共問題
        </div>
        <div class="flex gap-2">
          <UButton
            v-if="isFirstReviewRound"
            icon="i-lucide-file-plus"
            label="自動標記缺失文件"
            color="secondary"
            variant="soft"
            @click="autoCreateMissingDocumentIssues"
          />
          <UButton
            label="重置更改"
            color="neutral"
            variant="outline"
            @click="resetLocalChanges"
          />
        </div>
      </div>
    </div>

    <!-- Review Layout with Integrated Panel -->
    <CompanyApplicationReviewLayout>
      <template #content>
        <div class="space-y-4">
          <CompanyApplicationReviewCompanyBasicInfoSection />
          <CompanyApplicationReviewCompanyBusinessItemsSection />
          <CompanyApplicationReviewCompanyMonetaryInfoSection />

          <CompanyApplicationReviewPersonSection
            person-type="responsiblePerson"
          />
          <CompanyApplicationReviewPersonSection person-type="representative" />
          <CompanyApplicationReviewPersonSection person-type="contactPerson" />

          <CompanyApplicationReviewPartnersSection />

          <CompanyApplicationReviewDocumentsSection />
        </div>
      </template>
      <template #sidebar>
        <CompanyApplicationReviewSummary />
        <CompanyApplicationReviewRoundHistory />
      </template>
    </CompanyApplicationReviewLayout>
  </div>
</template>

<script setup lang="ts">
import { useCompanyApplicationReviewStore } from "./useCompanyApplicationReviewStore";

const detailsStore = useCompanyApplicationDetailsStore();
const reviewStore = useCompanyApplicationReviewStore();

const { resetLocalChanges, autoCreateMissingDocumentIssues } = reviewStore;
const { sections, isFirstReviewRound } = storeToRefs(reviewStore);

const headerDescription = computed(() =>
  detailsStore.application?.reviewRounds?.length
    ? `審查第 ${detailsStore.application.reviewRounds.length} 輪`
    : "初始審查"
);

// Calculate total issues from all sections
const totalIssues = computed(() => {
  return Object.values(sections.value).reduce((total, section) => {
    return total + section.issues.length;
  }, 0);
});

const totalCriticalIssues = computed(() => {
  return Object.values(sections.value).reduce((total, section) => {
    return (
      total +
      section.issues.filter((issue) => issue.severity === "critical").length
    );
  }, 0);
});
</script>
