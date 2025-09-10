import {
  getAllDocumentFields,
  getAllFieldInfos,
  getCompanyDocumentFieldInfos,
  getInitalReviewSections,
  getPersonDocumentFieldInfos,
  getShareholderDocumentFieldInfos,
} from "./utils";
import type { ReviewSections, SectionKey, SectionState } from "./types";
// import type { ReviewRound } from "../../../../shared/types/database";
// Temporary type until proper import is fixed
type ReviewRound = {
  id: string;
  applicationId: string;
  createdAt: Date;
  status: string;
};

import { PERSON_TYPES } from "./constants";

export const useCompanyApplicationReviewStore = defineStore(
  "companyApplicationReview",
  () => {
    const detailsStore = useCompanyApplicationDetailsStore();
    const { application } = storeToRefs(detailsStore);

    const sections = ref<ReviewSections>(getInitalReviewSections());

    const isSubmitting = ref<boolean>(false);
    const isDirty = ref<boolean>(false);

    // Staff-provided fields state - integrated into sections
    const staffProvidedFields = ref<{
      chosenName?: string;
      businessItems: string[];
    }>({
      businessItems: [],
    });

    const reviewRoundFormState = ref<ReviewRoundSchema>({
      applicationStatus: application.value
        ? application.value.status
        : "submitted",
      summary: "",
      staffProvidedFields: undefined,
    });

    const allIssues = computed(() =>
      Object.values(sections.value).flatMap((section) => section.issues)
    );

    const allVerifications = computed(() =>
      Object.values(sections.value).flatMap((section) => section.verifications)
    );

    const totalIssues = computed(() => allIssues.value.length);

    const totalVerifications = computed(() => allVerifications.value.length);

    const isFirstReviewRound = computed(
      () => !application.value?.reviewRounds?.length
    );

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

    // Check if all reviewable fields have been reviewed (either issue or verification)
    const allReviewableFieldsReviewed = computed(() => {
      if (!application.value) {
        throw new Error("No application available");
      }

      const allReviewableFields = getAllFieldInfos({
        shareholderCount: application.value.shareholders.length,
      }).filter(({ fieldCategory }) => fieldCategory === "reviewableField");

      const allReviewableFieldsReviewed = allReviewableFields.every(
        ({ sectionKey, fieldPath }) => {
          const section = sections.value[sectionKey];
          const issue = section.issues.find((i) => i.fieldPath === fieldPath);
          const verification = section.verifications.find(
            (v) => v.fieldPath === fieldPath
          );
          return !!issue || !!verification;
        }
      );

      return allReviewableFieldsReviewed;
    });

    const allDocumentFieldsReviewed = computed(() => {
      if (!application.value) {
        throw new Error("No application available");
      }

      const allDocumentFields = getAllDocumentFields(
        application.value.shareholders.length
      );

      const allDocumentFieldsReviewed = allDocumentFields.every(
        ({ sectionKey, fieldPath }) => {
          const section = sections.value[sectionKey];
          const issue = section.issues.find((i) => i.fieldPath === fieldPath);
          const verification = section.verifications.find(
            (v) => v.fieldPath === fieldPath
          );

          const documentReviewed = !!issue || !!verification;

          if (!documentReviewed) {
            console.log("Document field not reviewed:", fieldPath);
          }

          return documentReviewed;
        }
      );

      return allDocumentFieldsReviewed;
    });

    const submissionValidation = computed(() => {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!allReviewableFieldsReviewed.value) {
        errors.push("所有可審查欄位必須標記問題或驗證");
      }

      if (!allDocumentFieldsReviewed.value) {
        errors.push("所有文件欄位必須標記問題或驗證");
      }

      if (reviewRoundFormState.value.applicationStatus === "submitted") {
        errors.push("請選擇審查狀態");
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    });

    const canSubmitReviewRound = computed(() => {
      return submissionValidation.value.isValid;
    });

    const toggleSection = (sectionKey: SectionKey) => {
      sections.value[sectionKey].isOpen = !sections.value[sectionKey].isOpen;
    };

    const getSectionState = (sectionKey: SectionKey): SectionState => {
      return sections.value[sectionKey];
    };

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
      if (!application.value) {
        throw new Error("No application ID available");
      }

      isSubmitting.value = true;
      try {
        const payload = {
          applicationStatus: reviewRoundFormState.value.applicationStatus,
          summary: reviewRoundFormState.value.summary,
          issues: [...allIssues.value],
          verifications: [...allVerifications.value],
          // Include staff-provided fields if this is first review round
          ...(isFirstReviewRound.value && {
            staffProvidedFields: { ...staffProvidedFields.value },
          }),
        };

        const response = await $fetch(
          `/api/applications/${application.value.id as "[id]"}/review-rounds`,
          {
            method: "POST",
            body: payload,
          }
        );

        resetLocalChanges();
        resetSubmitForm();
        resetStaffProvidedFields();

        return response;
      } catch (error) {
        console.error("Failed to submit review round:", error);
        throw error;
      } finally {
        isSubmitting.value = false;
      }
    };

    const loadReviewHistory = async () => {
      if (!application.value) {
        throw new Error("No application available");
      }

      try {
        const response = await $fetch<{ data: ReviewRound[] }>(
          `/api/applications/${application.value.id as "[id]"}/review-rounds`
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
      reviewRoundFormState.value = {
        applicationStatus: "submitted",
        summary: "",
        staffProvidedFields: undefined,
      };
    };

    const resetStaffProvidedFields = () => {
      staffProvidedFields.value = {
        chosenName: "",
        businessItems: [],
      };
    };

    const autoCreateMissingDocumentIssues = () => {
      if (!isFirstReviewRound.value) {
        throw new Error(
          "This function is only available for first review round"
        );
      }

      if (!application.value) {
        throw new Error("No application available");
      }

      const issueTemplate: Omit<ReviewIssueSchema, "fieldPath"> = {
        issueType: "missing",
        severity: "medium",
        description: "客戶需於此輪次上傳文件",
      };

      const companyDocumentFields = getCompanyDocumentFieldInfos();
      companyDocumentFields.forEach(({ fieldPath }) => {
        addIssue("documents", {
          fieldPath,
          ...issueTemplate,
        });
      });

      PERSON_TYPES.forEach((personType) => {
        const personDocumentFields = getPersonDocumentFieldInfos(personType);
        personDocumentFields.forEach(({ fieldPath }) => {
          addIssue(personType, {
            fieldPath,
            ...issueTemplate,
          });
        });
      });

      const shareholderDocumentFields = getShareholderDocumentFieldInfos(
        application.value.shareholders.length
      );
      shareholderDocumentFields.forEach(({ fieldPath }) => {
        addIssue("shareholders", {
          fieldPath,
          ...issueTemplate,
        });
      });
    };

    return {
      sections: readonly(sections),
      isSubmitting: readonly(isSubmitting),
      isDirty: readonly(isDirty),
      reviewRoundFormState,
      staffProvidedFields,
      isFirstReviewRound: readonly(isFirstReviewRound),

      allIssues: readonly(allIssues),
      allVerifications: readonly(allVerifications),
      totalIssues: readonly(totalIssues),
      totalVerifications: readonly(totalVerifications),
      issuesBySection: readonly(issuesBySection),
      verificationsBySection: readonly(verificationsBySection),
      submissionValidation: readonly(submissionValidation),
      canSubmitReviewRound: readonly(canSubmitReviewRound),

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
      resetStaffProvidedFields,
      autoCreateMissingDocumentIssues,
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCompanyApplicationReviewStore, import.meta.hot)
  );
}
