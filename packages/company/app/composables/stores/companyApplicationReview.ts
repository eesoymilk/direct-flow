export type SectionKey =
  | "companyBasicInfo"
  | "companyBusinessItems"
  | "companyMonetaryInfo"
  | "responsiblePerson"
  | "representative"
  | "contactPerson"
  | "shareholders"
  | "documents";

export interface SectionState {
  issues: ReviewIssueSchema[];
  verifications: ReviewVerificationSchema[];
  isOpen: boolean;
}

export type ReviewSections = Record<SectionKey, SectionState>;

export const useCompanyApplicationReviewStore = defineStore(
  "companyApplicationReview",
  () => {
    const detailsStore = useCompanyApplicationDetailsStore();
    const { applicationId } = storeToRefs(detailsStore);

    const sections = ref<ReviewSections>({
      companyBasicInfo: {
        issues: [],
        verifications: [],
        isOpen: false,
      },
      companyBusinessItems: {
        issues: [],
        verifications: [],
        isOpen: false,
      },
      responsiblePerson: {
        issues: [],
        verifications: [],
        isOpen: false,
      },
      representative: {
        issues: [],
        verifications: [],
        isOpen: false,
      },
      contactPerson: {
        issues: [],
        verifications: [],
        isOpen: false,
      },
      companyMonetaryInfo: {
        issues: [],
        verifications: [],
        isOpen: false,
      },
      shareholders: {
        issues: [],
        verifications: [],
        isOpen: false,
      },
      documents: {
        issues: [],
        verifications: [],
        isOpen: false,
      },
    });

    const isSubmitting = ref<boolean>(false);
    const isDirty = ref<boolean>(false);

    const submitForm = ref<ReviewRoundSchema>({
      status: "reviewing",
      summary: "",
    });

    const allIssues = computed(() =>
      Object.values(sections.value).flatMap((section) => section.issues)
    );

    const allVerifications = computed(() =>
      Object.values(sections.value).flatMap((section) => section.verifications)
    );

    const totalIssues = computed(() => allIssues.value.length);

    const totalVerifications = computed(() => allVerifications.value.length);

    const issuesBySection = computed(() => {
      // TODO: use reducer
      const grouped: Record<string, ReviewIssueSchema[]> = {};
      Object.entries(sections.value).forEach(([sectionKey, section]) => {
        if (section.issues.length > 0) {
          grouped[sectionKey] = [...section.issues];
        }
      });
      return grouped;
    });

    const verificationsBySection = computed(() => {
      // TODO: use reducer
      const grouped: Record<string, ReviewVerificationSchema[]> = {};
      Object.entries(sections.value).forEach(([sectionKey, section]) => {
        if (section.verifications.length > 0) {
          grouped[sectionKey] = [...section.verifications];
        }
      });
      return grouped;
    });

    const canSubmit = computed(() => {
      return totalIssues.value > 0 || totalVerifications.value > 0;
    });

    const canSubmitForm = computed(() => {
      return submitForm.value.status && canSubmit.value;
    });

    const toggleSection = (sectionKey: SectionKey) => {
      sections.value[sectionKey].isOpen = !sections.value[sectionKey].isOpen;
    };

    const getSectionState = (sectionKey: SectionKey): SectionState => {
      return sections.value[sectionKey];
    };

    // Issue management
    const addIssue = (sectionKey: SectionKey, issue: ReviewIssueSchema) => {
      clearField(sectionKey, issue.fieldPath);
      sections.value[sectionKey].issues.push(issue);
      isDirty.value = true;
    };

    const removeIssue = (sectionKey: SectionKey, fieldPath: string) => {
      sections.value[sectionKey].issues = sections.value[
        sectionKey
      ].issues.filter((i) => i.fieldPath !== fieldPath);
      isDirty.value = true;
    };

    // Verification management
    const addVerification = (
      sectionKey: SectionKey,
      verification: ReviewVerificationSchema
    ) => {
      clearField(sectionKey, verification.fieldPath);
      sections.value[sectionKey].verifications.push(verification);
      isDirty.value = true;
    };

    const removeVerification = (sectionKey: SectionKey, fieldPath: string) => {
      sections.value[sectionKey].verifications = sections.value[
        sectionKey
      ].verifications.filter((v) => v.fieldPath !== fieldPath);
      isDirty.value = true;
    };

    const clearField = (sectionKey: SectionKey, fieldPath: string) => {
      removeIssue(sectionKey, fieldPath);
      removeVerification(sectionKey, fieldPath);
    };

    const submitReviewRound = async () => {
      if (!applicationId.value) {
        throw new Error("No application ID available");
      }

      isSubmitting.value = true;
      try {
        const payload = {
          status: submitForm.value.status,
          summary: submitForm.value.summary,
          issues: [...allIssues.value],
          verifications: [...allVerifications.value],
        };

        console.log("payload", payload);

        const response = await $fetch(
          `/api/applications/${applicationId.value as "[id]"}/review-rounds`,
          {
            method: "POST",
            body: payload,
          }
        );

        resetLocalChanges();
        resetSubmitForm();

        return response;
      } catch (error) {
        console.error("Failed to submit review round:", error);
        throw error;
      } finally {
        isSubmitting.value = false;
      }
    };

    const loadReviewHistory = async () => {
      if (!applicationId.value) {
        throw new Error("No application ID available");
      }

      try {
        const response = await $fetch(
          `/api/applications/${applicationId.value as "[id]"}/review-rounds`
        );
        return response.data;
      } catch (error) {
        console.error("Failed to load review history:", error);
        throw error;
      }
    };

    const resetLocalChanges = () => {
      sections.value = {
        companyBasicInfo: { issues: [], verifications: [], isOpen: false },
        companyBusinessItems: { issues: [], verifications: [], isOpen: false },
        companyMonetaryInfo: { issues: [], verifications: [], isOpen: false },
        responsiblePerson: { issues: [], verifications: [], isOpen: false },
        representative: { issues: [], verifications: [], isOpen: false },
        contactPerson: { issues: [], verifications: [], isOpen: false },
        shareholders: { issues: [], verifications: [], isOpen: false },
        documents: { issues: [], verifications: [], isOpen: false },
      };
      isDirty.value = false;
    };

    const resetSubmitForm = () => {
      submitForm.value = {
        status: "reviewing",
        summary: "",
      };
    };

    return {
      sections: readonly(sections),
      isSubmitting: readonly(isSubmitting),
      isDirty: readonly(isDirty),
      submitForm,

      allIssues: readonly(allIssues),
      allVerifications: readonly(allVerifications),
      totalIssues: readonly(totalIssues),
      totalVerifications: readonly(totalVerifications),
      issuesBySection: readonly(issuesBySection),
      verificationsBySection: readonly(verificationsBySection),
      canSubmit: readonly(canSubmit),
      canSubmitForm: readonly(canSubmitForm),

      toggleSection,
      getSectionState,

      addIssue,
      removeIssue,
      addVerification,
      removeVerification,
      clearField,

      submitReviewRound,
      loadReviewHistory,
      resetLocalChanges,
      resetSubmitForm,
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCompanyApplicationReviewStore, import.meta.hot)
  );
}
