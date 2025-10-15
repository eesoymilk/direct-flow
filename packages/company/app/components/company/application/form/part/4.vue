<template>
  <div class="space-y-6">
    <!-- Share Summary Component - Reusing the same component from confirm page -->
    <CompanyApplicationConfirmShareSummary
      :partners="formState.partners"
      :organization-type="formState.organizationType"
    />
  </div>
</template>

<script setup lang="ts">
const applicationStore = useCompanyApplicationStore();
const { formState } = storeToRefs(applicationStore);
</script>
