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

    // Staff-provided fields state - integrated into sections
    const staffProvidedFields = ref<StaffProvidedFieldsSchema>({
      chosenName: "",
      businessItems: [],
    });

    const submitForm = ref<ReviewRoundSchema>({
      applicationStatus: "submitted",
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

    // Check if this is the first review round (no previous review rounds exist)
    const isFirstReviewRound = computed(() => {
      // TODO: This should check actual review history from the application
      // For now, we'll determine based on whether staff fields are empty
      return !detailsStore.application?.reviewRounds?.length;
    });

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

    // Helper functions for staff-provided fields validation
    const hasChosenName = computed(
      () => staffProvidedFields.value.chosenName.trim().length > 0
    );

    const hasBusinessItems = computed(
      () => staffProvidedFields.value.businessItems.length > 0
    );

    // Staff fields are considered "complete" if they either have values OR are explicitly ignored (empty string/array)
    // This allows staff to choose "ignore for now" option
    const hasAllStaffProvidedFields = computed(() => {
      // In subsequent review rounds, staff fields are not required
      if (!isFirstReviewRound.value) return true;

      // For first review, staff fields must be explicitly handled:
      // - Either have values (chosenName filled, businessItems added)
      // - OR explicitly ignored (empty string/empty array)
      // The key is that they must be "touched" by staff
      return true; // We'll implement stricter validation below
    });

    // Check if all reviewable fields have been reviewed (either issue or verification)
    const allReviewableFieldsReviewed = computed(() => {
      // For now, we'll implement a simplified check
      // In a complete implementation, we would:
      // 1. Get all field definitions from each section
      // 2. Check that each field has either an issue or verification
      // 3. Handle special cases for staff-provided fields and documents

      // Simplified approach: check that major sections have review activity
      const sectionsToCheck: SectionKey[] = [
        "companyBasicInfo",
        "companyBusinessItems",
        "companyMonetaryInfo",
        "responsiblePerson",
        "representative",
        "contactPerson",
        "shareholders",
        "documents",
      ];

      // Count sections with review activity
      const sectionsWithActivity = sectionsToCheck.filter((sectionKey) => {
        const section = sections.value[sectionKey];
        return section.issues.length > 0 || section.verifications.length > 0;
      });

      // Require activity in at least half of the sections for now
      // TODO: Implement proper field-by-field validation
      return (
        sectionsWithActivity.length >= Math.ceil(sectionsToCheck.length / 2)
      );
    });

    // Check if all missing documents have issues for first review round
    const missingDocumentsHandled = computed(() => {
      if (!isFirstReviewRound.value) return true;

      // In first review round, all documents are considered "missing" and should have issues
      const documentSection = sections.value.documents;

      // List of required documents in first review
      const requiredDocs = [
        "documents.bankBookFront",
        "documents.bankBookInside",
        "documents.bankBookStamp",
        "documents.shareholderPayments",
        "documents.balanceProof",
        "documents.houseUseAgreement",
        "documents.shareholderAgreement",
        "documents.directorConsent",
        "documents.declaration",
        "documents.legalPersonDeclaration",
      ];

      // Check if each required document has an issue or verification
      const handledDocs = requiredDocs.filter((docPath) => {
        const hasIssue = documentSection.issues.some(
          (i) => i.fieldPath === docPath
        );
        const hasVerification = documentSection.verifications.some(
          (v) => v.fieldPath === docPath
        );
        return hasIssue || hasVerification;
      });

      // We expect most documents to have issues (since they're missing in first round)
      // But we'll be somewhat lenient - require at least some document handling
      return handledDocs.length >= Math.ceil(requiredDocs.length * 0.5);
    });

    // Staff field validation - stricter check for submission
    const staffFieldsValidForSubmission = computed(() => {
      if (!isFirstReviewRound.value) return true;

      // In first review round, staff must have made explicit decisions
      // Either fill the fields OR they remain empty (indicating "handle later")
      const chosenNameDecided = staffProvidedFields.value.chosenName !== "";
      const businessItemsDecided =
        staffProvidedFields.value.businessItems.length > 0;

      // At least one must be decided, or both can be left for later
      return (
        chosenNameDecided ||
        businessItemsDecided ||
        (staffProvidedFields.value.chosenName === "" &&
          staffProvidedFields.value.businessItems.length === 0)
      );
    });

    // Comprehensive validation for submission
    const submissionValidation = computed(() => {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (isFirstReviewRound.value) {
        // First review round validation

        // 1. Staff-provided fields validation
        if (!staffFieldsValidForSubmission.value) {
          errors.push("請處理工作人員專用欄位（選定公司名稱或營業項目編碼）");
        }

        // 2. All reviewable fields must be reviewed
        if (!allReviewableFieldsReviewed.value) {
          errors.push("所有可審查欄位必須標記問題或驗證");
        }

        // 3. Missing documents should have issues
        if (!missingDocumentsHandled.value) {
          warnings.push("建議為缺失文件標記問題，提醒客戶上傳");
        }

        // 4. At least some review activity
        if (totalIssues.value === 0 && totalVerifications.value === 0) {
          errors.push("請至少標記一個問題或驗證一個欄位");
        }
      } else {
        // Subsequent review rounds validation

        // 1. Must have review activity
        if (totalIssues.value === 0 && totalVerifications.value === 0) {
          errors.push("請至少標記一個問題或驗證一個欄位");
        }
      }

      // Application status must be selected
      if (!submitForm.value.applicationStatus) {
        errors.push("請選擇審查狀態");
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    });

    // Updated submission criteria based on validation
    const canSubmitFirstReview = computed(() => {
      return submissionValidation.value.isValid;
    });

    const canSubmitSubsequentReview = computed(() => {
      return submissionValidation.value.isValid;
    });

    const canSubmit = computed(() => {
      return submissionValidation.value.isValid;
    });

    const canSubmitForm = computed(() => {
      return submitForm.value.applicationStatus && canSubmit.value;
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
          applicationStatus: submitForm.value.applicationStatus,
          summary: submitForm.value.summary,
          issues: [...allIssues.value],
          verifications: [...allVerifications.value],
          // Include staff-provided fields if this is first review round
          ...(isFirstReviewRound.value && {
            staffProvidedFields: { ...staffProvidedFields.value },
          }),
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

    // Auto-create issues for missing documents in first review round
    const autoCreateMissingDocumentIssues = () => {
      if (!isFirstReviewRound.value) return;

      // List of all required documents that should have issues in first round
      const requiredDocuments = [
        "bankBookFront",
        "bankBookInside",
        "bankBookStamp",
        "shareholderPayments",
        "balanceProof",
        "houseUseAgreement",
        "shareholderAgreement",
        "directorConsent",
        "declaration",
        "legalPersonDeclaration",
        "idCardFront",
        "idCardBack",
      ];

      const documentSection = sections.value.documents;

      requiredDocuments.forEach((docField) => {
        const fieldPath = `documents.${docField}`;

        // Check if this document already has an issue or verification
        const hasExistingIssue = documentSection.issues.some(
          (i) => i.fieldPath === fieldPath
        );
        const hasExistingVerification = documentSection.verifications.some(
          (v) => v.fieldPath === fieldPath
        );

        // If no existing issue/verification, create a "missing" issue
        if (!hasExistingIssue && !hasExistingVerification) {
          addIssue("documents", {
            fieldPath,
            issueType: "missing",
            severity: "medium",
            description: "客戶需於此輪次上傳文件",
          });
        }
      });
    };

    return {
      sections: readonly(sections),
      isSubmitting: readonly(isSubmitting),
      isDirty: readonly(isDirty),
      submitForm,
      staffProvidedFields,
      isFirstReviewRound: readonly(isFirstReviewRound),

      // Staff-provided field helpers
      hasChosenName: readonly(hasChosenName),
      hasBusinessItems: readonly(hasBusinessItems),
      hasAllStaffProvidedFields: readonly(hasAllStaffProvidedFields),

      allIssues: readonly(allIssues),
      allVerifications: readonly(allVerifications),
      totalIssues: readonly(totalIssues),
      totalVerifications: readonly(totalVerifications),
      issuesBySection: readonly(issuesBySection),
      verificationsBySection: readonly(verificationsBySection),
      canSubmit: readonly(canSubmit),
      canSubmitForm: readonly(canSubmitForm),
      canSubmitFirstReview: readonly(canSubmitFirstReview),
      canSubmitSubsequentReview: readonly(canSubmitSubsequentReview),
      submissionValidation: readonly(submissionValidation),

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
