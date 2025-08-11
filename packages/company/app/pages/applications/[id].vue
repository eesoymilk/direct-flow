<template>
  <UContainer>
    <CompanyApplicationStaffView :application="application" />
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute();

const { data: application } = await useLazyFetch(
  `/api/applications/${route.params.id as ":id"}`
);

console.log(application.value);
</script>
