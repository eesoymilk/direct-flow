<template>
  <div class="space-y-6 py-6">
    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <CompanyApplicationDetails />
      </div>

      <!-- Review Summary Sidebar -->
      <div class="space-y-6">
        <CompanyApplicationReviewSummary />
      </div>
    </div>

    <!-- Review Actions Section -->
    <CompanyApplicationReviewActions />
  </div>
</template>
