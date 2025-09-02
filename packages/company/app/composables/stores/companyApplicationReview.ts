export const useCompanyApplicationReviewStore = defineStore(
  "companyApplicationReview",
  () => {
    const applicationId = ref<string | null>(null);
    const application = ref<CompanyApplicationResponse | null>(null);

    const localIssues = ref<ReviewIssueSchema[]>([]);
    const localVerifications = ref<ReviewVerificationSchema[]>([]);

    const isSubmitting = ref<boolean>(false);
    const isDirty = ref<boolean>(false);

    const isInitialReview = computed(
      () =>
        !application.value?.reviewRounds ||
        application.value.reviewRounds.length === 0
    );

    const latestRoundNo = computed(() => {
      if (!application.value?.reviewRounds?.length) return 1;
      return Math.max(...application.value.reviewRounds.map((r) => r.roundNo));
    });

    const allIssues = computed(() => {
      const existingIssues =
        application.value?.reviewRounds?.[0]?.reviewIssues || [];
      return [...existingIssues, ...localIssues.value];
    });

    const allVerifications = computed(() => {
      const existingVerifications =
        application.value?.reviewRounds?.[0]?.reviewVerifications || [];
      return [...existingVerifications, ...localVerifications.value];
    });

    const reviewOverlay = computed(() => ({
      issues: allIssues.value,
      verifications: allVerifications.value,
    }));

    const reviewProgress = computed(() => {
      const totalIssues = allIssues.value.length;
      const totalVerifications = allVerifications.value.length;
      const criticalIssues = allIssues.value.filter(
        (i) => i.severity === "critical"
      ).length;

      return {
        totalIssues,
        totalVerifications,
        criticalIssues,
        hasBlockingIssues: criticalIssues > 0,
      };
    });

    const canSubmitReview = computed(() => {
      return (
        isDirty.value &&
        (localIssues.value.length > 0 || localVerifications.value.length > 0)
      );
    });

    const loadApplication = async (id: string) => {
      applicationId.value = id;
      const rawData = await $fetch(`/api/applications/${id as "[id]"}`);

      const { success, data, error } =
        companyApplicationResponseSchema.safeParse(rawData);

      if (!success) {
        console.error("Failed to load application:", error);
        throw error;
      }

      application.value = data;
      localIssues.value = [];
      localVerifications.value = [];
      isDirty.value = false;
    };

    const addIssue = (issue: ReviewIssueSchema): void => {
      // Remove existing issue for this field path if any
      const existingIndex = localIssues.value.findIndex(
        (i) => i.fieldPath === issue.fieldPath
      );
      if (existingIndex !== -1) {
        localIssues.value.splice(existingIndex, 1);
      }

      // Remove any verification for this field path
      const verificationIndex = localVerifications.value.findIndex(
        (v) => v.fieldPath === issue.fieldPath
      );
      if (verificationIndex !== -1) {
        localVerifications.value.splice(verificationIndex, 1);
      }

      localIssues.value.push(issue);
      isDirty.value = true;
    };

    const removeIssue = (fieldPath: string): void => {
      const index = localIssues.value.findIndex(
        (i) => i.fieldPath === fieldPath
      );
      if (index !== -1) {
        localIssues.value.splice(index, 1);
        isDirty.value = true;
      }
    };

    const addVerification = (verification: ReviewVerificationSchema): void => {
      // Remove existing verification for this field path if any
      const existingIndex = localVerifications.value.findIndex(
        (v) => v.fieldPath === verification.fieldPath
      );
      if (existingIndex !== -1) {
        localVerifications.value.splice(existingIndex, 1);
      }

      // Remove any issue for this field path
      const issueIndex = localIssues.value.findIndex(
        (i) => i.fieldPath === verification.fieldPath
      );
      if (issueIndex !== -1) {
        localIssues.value.splice(issueIndex, 1);
      }

      localVerifications.value.push(verification);
      isDirty.value = true;
    };

    const removeVerification = (fieldPath: string): void => {
      const index = localVerifications.value.findIndex(
        (v) => v.fieldPath === fieldPath
      );
      if (index !== -1) {
        localVerifications.value.splice(index, 1);
        isDirty.value = true;
      }
    };

    const getSectionStatus = (sectionPrefix: string) => {
      const sectionIssues = allIssues.value.filter((issue) =>
        issue.fieldPath.startsWith(`${sectionPrefix}.`)
      );
      const sectionVerifications = allVerifications.value.filter(
        (verification) => verification.fieldPath.startsWith(`${sectionPrefix}.`)
      );

      return {
        hasIssues: sectionIssues.length > 0,
        issueCount: sectionIssues.length,
        verificationCount: sectionVerifications.length,
        isComplete: sectionIssues.length === 0,
        highPriorityIssues: sectionIssues.filter(
          (i) => i.severity === "high" || i.severity === "critical"
        ).length,
      };
    };

    const getSectionIssues = (sectionPrefix: string) => {
      return allIssues.value.filter((issue) =>
        issue.fieldPath.startsWith(`${sectionPrefix}.`)
      );
    };

    const getSectionVerifications = (sectionPrefix: string) => {
      return allVerifications.value.filter((verification) =>
        verification.fieldPath.startsWith(`${sectionPrefix}.`)
      );
    };

    const verifySection = (sectionKey: string, fields: string[]): void => {
      fields.forEach((field) => {
        const fieldPath = `${sectionKey}.${field}`;
        addVerification({ fieldPath, note: undefined });
      });
    };

    const submitReview = async () => {
      if (!applicationId.value || !canSubmitReview.value) return;

      isSubmitting.value = true;
      try {
        const reviewData = {
          issues: localIssues.value,
          verifications: localVerifications.value,
          summary: "", // TODO: Add summary input
        };

        await $fetch(`/api/applications/${applicationId.value}/review-rounds`, {
          method: "POST",
          body: reviewData,
        });

        // Reload application to get updated review rounds
        await loadApplication(applicationId.value);

        // Clear local changes
        localIssues.value = [];
        localVerifications.value = [];
        isDirty.value = false;
      } catch (error) {
        console.error("Failed to submit review:", error);
        throw error;
      } finally {
        isSubmitting.value = false;
      }
    };

    const resetLocalChanges = () => {
      localIssues.value = [];
      localVerifications.value = [];
      isDirty.value = false;
    };

    return {
      applicationId,
      application,
      localIssues,
      localVerifications,
      isSubmitting,
      isDirty,

      isInitialReview,
      latestRoundNo,
      allIssues,
      allVerifications,
      reviewOverlay,
      reviewProgress,
      canSubmitReview,

      loadApplication,
      addIssue,
      removeIssue,
      addVerification,
      removeVerification,
      getSectionStatus,
      getSectionIssues,
      getSectionVerifications,
      verifySection,
      submitReview,
      resetLocalChanges,
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCompanyApplicationReviewStore, import.meta.hot)
  );
}
