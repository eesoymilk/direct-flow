<template>
  <UContainer>
    <CompanyApplicationStaffView />
    <!-- TODO: Add Client View -->
  </UContainer>
</template>

<script setup lang="ts">
import type { FieldPath } from "~/composables/stores/reviewEntry";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();

const reviewStore = useCompanyApplicationReviewStore();

await useLazyFetch(`/api/applications/${route.params.id as ":id"}`, {
  transform: (data) => {
    console.log(data.reviewRounds);

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
          if (
            entry &&
            data[personType]?.[field] !== undefined &&
            data[personType][field] !== null
          ) {
            personData[field] = {
              ...entry,
              value: data[personType][field],
            };
          }
        });
      }
    );

    // Initialize and populate shareholders
    if (data.shareholders && Array.isArray(data.shareholders)) {
      // Initialize shareholder entries based on the number of shareholders
      reviewStore.initializeShareholderEntries(data.shareholders);

      // Populate shareholder data
      data.shareholders.forEach((shareholder: any, index: number) => {
        if (
          shareholder.person &&
          reviewStore.reviewEntries.shareholders[index]
        ) {
          const shareholderPersonData =
            reviewStore.reviewEntries.shareholders[index];

          personFields.forEach((field) => {
            const entry = shareholderPersonData[field];
            if (
              entry &&
              shareholder.person[field] !== undefined &&
              shareholder.person[field] !== null
            ) {
              shareholderPersonData[field] = {
                ...entry,
                value: shareholder.person[field],
              };
            }
          });
        }
      });
    }

    if (data.reviewRounds && Array.isArray(data.reviewRounds)) {
      const previousRound = data.reviewRounds[0];
      if (previousRound) {
        previousRound.reviewIssues.forEach(
          ({ fieldPath, issueType, severity, description, ...rest }) => {
            const entry = reviewStore.getEntry(fieldPath as FieldPath);
            if (!entry) return;
            reviewStore.setEntry(fieldPath as FieldPath, {
              ...entry,
              state: "hasIssue",
              issue: {
                issueType,
                severity,
                description: description || undefined,
              },
            });
          }
        );

        previousRound.reviewVerifications.forEach(({ fieldPath, ...rest }) => {
          const entry = reviewStore.getEntry(fieldPath as FieldPath);
          if (!entry) return;
          reviewStore.setEntry(fieldPath as FieldPath, {
            ...entry,
            state: "verified",
          });
        });
      }
    }

    return data;
  },
});
</script>
