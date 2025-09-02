<template>
  <UContainer class="py-8">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <div class="text-center space-y-4">
        <UIcon
          name="i-lucide-loader-2"
          class="w-8 h-8 animate-spin mx-auto text-primary"
        />
        <p class="text-gray-600">載入申請資料中...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center py-12">
      <UAlert
        icon="i-lucide-alert-circle"
        color="error"
        variant="soft"
        title="載入失敗"
        :description="error.message || '無法載入申請資料，請重試'"
      >
        <template #actions>
          <UButton color="error" variant="outline" size="sm" @click="refresh()">
            重新載入
          </UButton>
        </template>
      </UAlert>
    </div>

    <!-- Application Content -->
    <UContainer v-else-if="application" class="space-y-4 md:space-y-8">
      <!-- Application Header -->
      <UCard>
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ application.candidateNames[0] }}
            </h1>
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <span>申請編號：{{ application.id }}</span>
              <span>申請日期：{{ formatDate(application.createdAt) }}</span>
              <UBadge
                :label="getStatusLabel(application.status)"
                :color="getStatusColor(application.status)"
                variant="subtle"
              />
            </div>
          </div>
          <UButton
            label="返回列表"
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-left"
            @click="$router.back()"
          />
        </div>
      </UCard>

      <!-- Section-Based Review Interface -->
      <CompanyApplicationReviewSectionView />

      <!-- TODO: Add Client View based on user role -->
    </UContainer>

    <!-- Empty State (shouldn't happen with proper API, but safety) -->
    <div v-else class="flex items-center justify-center py-12">
      <div class="text-center space-y-4">
        <UIcon name="i-lucide-file-x" class="w-12 h-12 mx-auto text-gray-400" />
        <p class="text-gray-600">找不到申請資料</p>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const reviewStore = useCompanyApplicationReviewStore();
const { application } = storeToRefs(reviewStore);

const applicationId = route.params.id as string;
const { pending, error, refresh } = await useLazyAsyncData(
  `application-${applicationId}`,
  () => reviewStore.loadApplication(applicationId)
);
</script>
