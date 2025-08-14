<template>
  <UContainer>
    <CompanyApplicationStaffView />
    <!-- TODO: Add Client View -->
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute();

const reviewStore = useCompanyApplicationReviewStore();

await useLazyFetch(`/api/applications/${route.params.id as ":id"}`, {
  transform: (data) => {
    reviewStore.setEntryValue("candidateNames", data.candidateNames);
    reviewStore.setEntryValue("organizationType", data.organizationType);
    reviewStore.setEntryValue(
      "businessItemsDescription",
      data.businessItemsDescription
    );
    reviewStore.setEntryValue("address", data.address);
    return data;
  },
});
</script>
