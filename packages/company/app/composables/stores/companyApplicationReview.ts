import { acceptHMRUpdate, defineStore } from "pinia";

type ApplicationReviewState = {
  applicationId: string | null;
  application: CompanyApplicationResponse | null;
  currentReviewRound: ReviewRoundResponse | null;
  localIssues: ReviewIssueSchema[];
  localVerifications: ReviewVerificationSchema[];
  isSubmitting: boolean;
  isDirty: boolean;
};

export const useCompanyApplicationReviewStore = defineStore(
  "companyApplicationReview",
  () => {
    // State
    const state = reactive<ApplicationReviewState>({
      applicationId: null,
      application: null,
      currentReviewRound: null,
      localIssues: [],
      localVerifications: [],
      isSubmitting: false,
      isDirty: false,
    });

    // Getters
    const isInitialReview = computed(() => {
      return (
        !state.application?.reviewRounds ||
        state.application.reviewRounds.length === 0
      );
    });

    const latestRoundNo = computed(() => {
      if (!state.application?.reviewRounds?.length) return 1;
      return Math.max(...state.application.reviewRounds.map((r) => r.roundNo));
    });

    const allIssues = computed(() => {
      const existingIssues =
        state.application?.reviewRounds?.[0]?.reviewIssues || [];
      return [...existingIssues, ...state.localIssues];
    });

    const allVerifications = computed(() => {
      const existingVerifications =
        state.application?.reviewRounds?.[0]?.reviewVerifications || [];
      return [...existingVerifications, ...state.localVerifications];
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
        state.isDirty &&
        (state.localIssues.length > 0 || state.localVerifications.length > 0)
      );
    });

    const loadApplication = async (applicationId: string) => {
      state.applicationId = applicationId;
      const rawData = await $fetch(
        `/api/applications/${applicationId as "[id]"}`
      );

      const { success, data, error } =
        companyApplicationResponseSchema.safeParse(rawData);

      if (!success) {
        console.error("Failed to load application:", error);
        throw error;
      }

      state.application = data;
      state.localIssues = [];
      state.localVerifications = [];
      state.isDirty = false;
    };

    const addIssue = (issue: ReviewIssueSchema): void => {
      // Remove existing issue for this field path if any
      const existingIndex = state.localIssues.findIndex(
        (i) => i.fieldPath === issue.fieldPath
      );
      if (existingIndex !== -1) {
        state.localIssues.splice(existingIndex, 1);
      }

      // Remove any verification for this field path
      const verificationIndex = state.localVerifications.findIndex(
        (v) => v.fieldPath === issue.fieldPath
      );
      if (verificationIndex !== -1) {
        state.localVerifications.splice(verificationIndex, 1);
      }

      state.localIssues.push(issue);
      state.isDirty = true;
    };

    const removeIssue = (fieldPath: string): void => {
      const index = state.localIssues.findIndex(
        (i) => i.fieldPath === fieldPath
      );
      if (index !== -1) {
        state.localIssues.splice(index, 1);
        state.isDirty = true;
      }
    };

    const addVerification = (verification: ReviewVerificationSchema): void => {
      // Remove existing verification for this field path if any
      const existingIndex = state.localVerifications.findIndex(
        (v) => v.fieldPath === verification.fieldPath
      );
      if (existingIndex !== -1) {
        state.localVerifications.splice(existingIndex, 1);
      }

      // Remove any issue for this field path
      const issueIndex = state.localIssues.findIndex(
        (i) => i.fieldPath === verification.fieldPath
      );
      if (issueIndex !== -1) {
        state.localIssues.splice(issueIndex, 1);
      }

      state.localVerifications.push(verification);
      state.isDirty = true;
    };

    const removeVerification = (fieldPath: string): void => {
      const index = state.localVerifications.findIndex(
        (v) => v.fieldPath === fieldPath
      );
      if (index !== -1) {
        state.localVerifications.splice(index, 1);
        state.isDirty = true;
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

    const submitReview = async (): Promise<void> => {
      if (!state.applicationId || !canSubmitReview.value) return;

      state.isSubmitting = true;
      try {
        const reviewData = {
          issues: state.localIssues,
          verifications: state.localVerifications,
          summary: "", // TODO: Add summary input
        };

        await $fetch(`/api/applications/${state.applicationId}/review-rounds`, {
          method: "POST",
          body: reviewData,
        });

        // Reload application to get updated review rounds
        await loadApplication(state.applicationId);

        // Clear local changes
        state.localIssues = [];
        state.localVerifications = [];
        state.isDirty = false;
      } catch (error) {
        console.error("Failed to submit review:", error);
        throw error;
      } finally {
        state.isSubmitting = false;
      }
    };

    const resetLocalChanges = (): void => {
      state.localIssues = [];
      state.localVerifications = [];
      state.isDirty = false;
    };

    return {
      ...toRefs(state),

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
