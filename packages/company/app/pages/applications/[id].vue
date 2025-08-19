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
    // Map company fields
    const companyFields = [
      "candidateNames",
      "organizationType", 
      "businessItemsDescription",
      "address",
    ] as const;

    companyFields.forEach((field) => {
      const entry = reviewStore.reviewEntries.company[field];
      if (entry && data[field] !== undefined) {
        reviewStore.reviewEntries.company[field] = {
          ...entry,
          value: data[field],
        };
      }
    });

    // Map person objects
    const personFields = [
      "name",
      "idNumber", 
      "address",
      "telephone",
      "cellphone",
      "email",
    ] as const;

    (["responsiblePerson", "contactPerson", "representative"] as const).forEach(
      (personType) => {
        const personData = reviewStore.reviewEntries[personType];

        personFields.forEach((field) => {
          const entry = personData[field];
          if (entry && data[personType]?.[field] !== undefined && data[personType][field] !== null) {
            personData[field] = {
              ...entry,
              value: data[personType][field],
            };
          }
        });
      }
    );

    return data;
  },
});
</script>
