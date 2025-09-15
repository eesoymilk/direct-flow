<template>
  <UContainer>
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-900">
      審計意見類型選擇樹
    </h1>

    <UCard>
      <AuditOpinionTree v-model="selectedOpinion" />
    </UCard>
  </UContainer>
</template>

<script setup>
const selectedOpinion = ref("");

// Watch for changes
watch(selectedOpinion, (newValue) => {
  console.log("Selected opinion:", newValue);
});
</script>
