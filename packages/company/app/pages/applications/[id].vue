<template>
  <UContainer>
    <CompanyApplicationStaffView :application="application" />
    <!-- TODO: Add Client View -->
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute();

const { data: application } = await useLazyFetch(
  `/api/applications/${route.params.id as ":id"}`
);
</script>
