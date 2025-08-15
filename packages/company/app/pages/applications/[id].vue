<template>
  <UContainer>
    <CompanyApplicationStaffView />
    <!-- TODO: Add Client View -->
  </UContainer>
</template>

<script setup lang="ts">
import type { PersonEntries } from "~/composables/stores/reviewEntry";

const route = useRoute();

const reviewStore = useCompanyApplicationReviewStore();

await useLazyFetch(`/api/applications/${route.params.id as ":id"}`, {
  transform: (data) => {
    // Map flat fields
    const flatFields = [
      "candidateNames",
      "organizationType",
      "businessItemsDescription",
      "address",
    ] as const;

    flatFields.forEach((field) => {
      const path = `company.${field}` as const;
      const entry = reviewStore.reviewEntries.company.get(path);

      if (!entry) {
        console.warn(`Entry not found for path: ${path}`);
        return;
      }

      reviewStore.reviewEntries.company.set(path, {
        ...entry,
        value: data[field],
      });
    });

    // Map nested person objects
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
        const entriesMap: Map<
          `${typeof personType}.${keyof PersonEntries}`,
          PersonEntries[keyof PersonEntries]
        > = reviewStore.reviewEntries[personType];

        personFields.forEach((field) => {
          const path = `${personType}.${field}` as const;
          const entry = entriesMap.get(path);
          if (!entry) {
            console.warn(`Entry not found for path: ${path}`);
            return;
          }

          entriesMap.set(path, {
            ...entry,
            value: data[personType]?.[field] ?? "",
          });
        });
      }
    );

    return data;
  },
});
</script>
