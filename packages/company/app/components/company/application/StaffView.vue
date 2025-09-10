<template>
  <div class="space-y-6">
    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <CompanyApplicationDetails :application="application" />
      </div>

      <!-- Review Summary Sidebar -->
      <div class="space-y-6">
        <CompanyApplicationReviewSummary :application="application" />
      </div>
    </div>

    <!-- Review Actions Section -->
    <CompanyApplicationReviewActions
      v-if="loggedIn"
      :application="application"
    />
    <div v-else class="flex justify-end">
      <UButton
        label="提交複查"
        icon="i-lucide-send"
        color="success"
        variant="outline"
        size="xl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  application: CompanyApplicationResponse;
}

defineProps<Props>();

const { loggedIn } = useUserSession();
</script>
