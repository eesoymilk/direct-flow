<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
    <!-- Main Content Area -->
    <div class="lg:col-span-2 space-y-6">
      <CompanyApplicationDetails />
    </div>

    <UCard class="col-span-3">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-check-circle" class="w-5 h-5" />
          <h3 class="text-lg font-semibold">審核操作</h3>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Review Notes -->
        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 block">
            審核備註
          </label>
          <UTextarea
            v-model="reviewStore.reviewRound.summary"
            placeholder="添加審核備註、發現的問題或建議..."
            class="w-full"
            :rows="4"
            autoresize
          />
        </div>

        <!-- Action Buttons -->
      </div>
    </UCard>
  </div>

  <div class="flex flex-wrap gap-3">
    <!-- TODO: Add save button -->
    <div class="flex-1"></div>
    <UButton color="error" icon="i-lucide-x"> 拒絕申請 </UButton>
    <UButton color="warning" icon="i-lucide-edit"> 要求客戶更新 </UButton>
    <UButton color="success" icon="i-lucide-check"> 核准申請 </UButton>
  </div>
</template>

<script setup lang="ts">
const reviewStore = useCompanyApplicationReviewStore();
</script>
