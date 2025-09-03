export type SectionKey =
  | "companyBasicInfo"
  | "companyBusinessItems"
  | "companyMonetaryInfo"
  | "representatives"
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
      companyMonetaryInfo: {
        issues: [],
        verifications: [],
        isOpen: false,
      },
      representatives: {
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

    // Section management
    const toggleSection = (sectionKey: SectionKey) => {
      sections.value[sectionKey].isOpen = !sections.value[sectionKey].isOpen;
    };

    const getSectionState = (sectionKey: SectionKey): SectionState => {
      return sections.value[sectionKey];
    };

    // Issue management
    const addIssue = (
      sectionKey: SectionKey,
      issue: ReviewIssueSchema
    ): void => {
      const section = sections.value[sectionKey];
      // Remove existing issue for the same field path if any
      section.issues = section.issues.filter(
        (i) => i.fieldPath !== issue.fieldPath
      );
      // Add new issue
      section.issues.push(issue);
      isDirty.value = true;
    };

    const removeIssue = (sectionKey: SectionKey, fieldPath: string): void => {
      const section = sections.value[sectionKey];
      section.issues = section.issues.filter((i) => i.fieldPath !== fieldPath);
      isDirty.value = true;
    };

    // Verification management
    const addVerification = (
      sectionKey: SectionKey,
      verification: ReviewVerificationSchema
    ): void => {
      const section = sections.value[sectionKey];
      // Remove existing verification for the same field path if any
      section.verifications = section.verifications.filter(
        (v) => v.fieldPath !== verification.fieldPath
      );
      // Add new verification
      section.verifications.push(verification);
      isDirty.value = true;
    };

    const removeVerification = (
      sectionKey: SectionKey,
      fieldPath: string
    ): void => {
      const section = sections.value[sectionKey];
      section.verifications = section.verifications.filter(
        (v) => v.fieldPath !== fieldPath
      );
      isDirty.value = true;
    };

    // Review submission
    const submitReview = async () => {
      isSubmitting.value = true;
      try {
        // TODO: Implement API call to submit review
        isDirty.value = false;
      } catch (error) {
        console.error("Failed to submit review:", error);
        throw error;
      } finally {
        isSubmitting.value = false;
      }
    };

    const resetLocalChanges = () => {
      sections.value = {
        companyBasicInfo: { issues: [], verifications: [], isOpen: false },
        companyBusinessItems: { issues: [], verifications: [], isOpen: false },
        companyMonetaryInfo: { issues: [], verifications: [], isOpen: false },
        representatives: { issues: [], verifications: [], isOpen: false },
        shareholders: { issues: [], verifications: [], isOpen: false },
        documents: { issues: [], verifications: [], isOpen: false },
      };
      isDirty.value = false;
    };

    return {
      // State
      sections: readonly(sections),
      isSubmitting: readonly(isSubmitting),
      isDirty: readonly(isDirty),

      // Section management
      toggleSection,
      getSectionState,

      // Issue/Verification management
      addIssue,
      removeIssue,
      addVerification,
      removeVerification,

      // Review management
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
