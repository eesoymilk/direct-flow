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
          <span class="font-medium text-red-600"> 9 </span>
          嚴重問題 •
          <span class="font-medium text-yellow-600"> 9 </span>
          總共問題
        </div>
        <div class="flex gap-2">
          <UButton
            label="重置更改"
            color="neutral"
            variant="outline"
            @click="resetLocalChanges"
          />
          <UButton
            label="提交審查"
            color="success"
            @click="handleSubmitReview"
          />
        </div>
      </div>
    </div>

    <!-- Review Sections -->
    <div class="space-y-4">
      <CompanyApplicationReviewCompanyBasicInfoSection />
      <CompanyApplicationReviewCompanyBusinessItemsSection />
      <CompanyApplicationReviewCompanyMonetaryInfoSection />

      <CompanyApplicationReviewPersonSection person-type="responsiblePerson" />
      <CompanyApplicationReviewPersonSection person-type="representative" />
      <CompanyApplicationReviewPersonSection person-type="contactPerson" />

      <CompanyApplicationReviewShareholdersSection />
    </div>
  </div>
</template>

<script setup lang="ts">
const detailsStore = useCompanyApplicationDetailsStore();
const { resetLocalChanges } = useCompanyApplicationReviewStore();

const headerDescription = computed(() =>
  detailsStore.application?.reviewRounds?.length
    ? `審查第 ${detailsStore.application.reviewRounds.length} 輪`
    : "初始審查"
);

const handleSubmitReview = async () => {
  try {
    // TODO: Submit review
  } catch (error) {
    // TODO: Show error message
    console.error("Failed to submit review:", error);
  }
};
</script>
