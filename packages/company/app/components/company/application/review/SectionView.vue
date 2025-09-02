<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Review Header -->
    <UCard>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">審查進度</h2>
          <p class="text-sm text-gray-600 mt-1">
            {{ headerDescription }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-sm text-gray-600">
            <span class="font-medium text-red-600">
              {{ reviewStore.reviewProgress.criticalIssues }}
            </span>
            嚴重問題 •
            <span class="font-medium text-yellow-600">
              {{ reviewStore.reviewProgress.totalIssues }}
            </span>
            總共問題
          </div>
          <div class="flex gap-2">
            <UButton
              v-if="reviewStore.isDirty"
              label="重置更改"
              color="neutral"
              variant="outline"
              @click="reviewStore.resetLocalChanges"
            />
            <UButton
              v-if="reviewStore.canSubmitReview"
              label="提交審查"
              color="success"
              :loading="reviewStore.isSubmitting"
              @click="handleSubmitReview"
            />
          </div>
        </div>
      </div>
    </UCard>

    <!-- Review Sections -->
    <div class="space-y-4">
      <CompanyApplicationReviewSection
        v-for="section in reviewSections"
        :key="section.key"
        :section="section"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const reviewStore = useCompanyApplicationReviewStore();

const headerDescription = computed(() =>
  reviewStore.isInitialReview
    ? "初始審查"
    : `審查第 ${reviewStore.latestRoundNo} 輪`
);

// Define review sections
const reviewSections = computed((): ReviewSection[] => {
  return [
    {
      key: "company",
      title: "公司基本資料",
      description: "公司名稱、組織類型、閉鎖型股份有限公司",
      fields: [
        "candidateNames",
        "chosenName",
        "organizationType",
        "isCloselyHeld",
      ],
      status: reviewStore.getSectionStatus("company"),
      priority: "high",
    },
    {
      key: "business",
      title: "營業項目",
      description: "營業項目、註冊地址",
      fields: ["businessItemsDescription", "address"],
      status: reviewStore.getSectionStatus("business"),
      priority: "high",
    },
    {
      key: "capital",
      title: "資本結構",
      description: "資本額、股份資訊、票面價值",
      fields: [
        "capitalAmount",
        "authorizedShares",
        "ordinaryShares",
        "preferredShares",
        "hasParValueFreeShares",
      ],
      status: reviewStore.getSectionStatus("capital"),
      priority: "medium",
    },
    {
      key: "people",
      title: "人員資料",
      description: "負責人、聯絡人、代表人",
      fields: ["responsiblePerson", "contactPerson", "representative"],
      status: reviewStore.getSectionStatus("people"),
      priority: "high",
    },
    {
      key: "shareholders",
      title: "股東資料",
      description: "股東資料、所有權結構",
      fields: ["shareholders"],
      status: reviewStore.getSectionStatus("shareholders"),
      priority: "medium",
    },
    {
      key: "documents",
      title: "文件資料",
      description: "所需文件、附件",
      fields: ["documents"],
      status: reviewStore.getSectionStatus("documents"),
      priority: "medium",
    },
  ];
});

// Event handlers
const handleSubmitReview = async (): Promise<void> => {
  try {
    await reviewStore.submitReview();
    // TODO: Show success message or redirect
  } catch (error) {
    // TODO: Show error message
    console.error("Failed to submit review:", error);
  }
};
</script>
