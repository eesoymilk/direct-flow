type CompanyReviewSection =
  | "companyBasicInfo"
  | "companyBusinessItems"
  | "companyMonetaryInfo";

export const COMPANY_BASIC_INFO_FIELDS = [
  "candidateNames",
  "organizationType",
  "address",
  "capitalAmount",
] as const;

export type CompanyBasicInfoField = (typeof COMPANY_BASIC_INFO_FIELDS)[number];

export const COMPANY_BUSINESS_ITEMS_FIELDS = [
  "businessItemsDescription",
] as const;

export type CompanyBusinessItemsField =
  (typeof COMPANY_BUSINESS_ITEMS_FIELDS)[number];

export const COMPANY_MONETARY_INFO_FIELDS = [
  "authorizedShares",
  "ordinaryShares",
  "preferredShares",
] as const;

export type CompanyMonetaryInfoField =
  (typeof COMPANY_MONETARY_INFO_FIELDS)[number];

type FieldStatus = {
  hasIssue: boolean;
  issue: ReviewIssueSchema | undefined;
  isVerified: boolean;
  verification: ReviewVerificationSchema | undefined;
};

export const useCompanyReview = () => {
  const detailsStore = useCompanyApplicationDetailsStore();
  const reviewStore = useCompanyApplicationReviewStore();
  const {
    addIssue,
    removeIssue,
    addVerification,
    removeVerification,
    getSectionState,
    toggleSection,
  } = reviewStore;

  const { application } = storeToRefs(detailsStore);

  const companyBasicInfo = computed(() => {
    if (!application.value) {
      throw new Error("Application not found");
    }
    return {
      candidateNames: application.value.candidateNames,
      organizationType: application.value.organizationType,
      address: application.value.address,
    };
  });

  const companyBusinessItems = computed(() => {
    if (!application.value) {
      throw new Error("Application not found");
    }
    return {
      businessItemsDescription: application.value.businessItemsDescription,
    };
  });

  const companyMonetaryInfo = computed(() => {
    if (!application.value) {
      throw new Error("Application not found");
    }
    return {
      authorizedShares: application.value.authorizedShares,
      ordinaryShares: application.value.ordinaryShares,
      preferredShares: application.value.preferredShares,
    };
  });

  const basicInfoSectionState = computed(() =>
    getSectionState("companyBasicInfo")
  );

  const businessItemsSectionState = computed(() =>
    getSectionState("companyBusinessItems")
  );

  const monetaryInfoSectionState = computed(() =>
    getSectionState("companyMonetaryInfo")
  );

  const basicInfoSectionIsOpen = computed({
    get: () => basicInfoSectionState.value.isOpen,
    set: () => toggleSection("companyBasicInfo"),
  });

  const businessItemsSectionIsOpen = computed({
    get: () => businessItemsSectionState.value.isOpen,
    set: () => toggleSection("companyBusinessItems"),
  });

  const monetaryInfoSectionIsOpen = computed({
    get: () => monetaryInfoSectionState.value.isOpen,
    set: () => toggleSection("companyMonetaryInfo"),
  });

  const statusesReducer = <T extends string>(
    acc: Record<T, FieldStatus>,
    field: T
  ) => {
    const fieldPath = `company.${field}`;
    const issue = basicInfoSectionState.value.issues.find(
      (i) => i.fieldPath === fieldPath
    );
    const verification = basicInfoSectionState.value.verifications.find(
      (v) => v.fieldPath === fieldPath
    );

    acc[field] = {
      hasIssue: !!issue,
      issue,
      isVerified: !!verification,
      verification,
    };

    return acc;
  };

  const basicInfoFieldStatuses = computed(
    (): Record<CompanyBasicInfoField, FieldStatus> =>
      COMPANY_BASIC_INFO_FIELDS.reduce(
        statusesReducer,
        {} as Record<CompanyBasicInfoField, FieldStatus>
      )
  );

  const businessItemsFieldStatuses = computed(
    (): Record<CompanyBusinessItemsField, FieldStatus> =>
      COMPANY_BUSINESS_ITEMS_FIELDS.reduce(
        statusesReducer,
        {} as Record<CompanyBusinessItemsField, FieldStatus>
      )
  );

  const monetaryInfoFieldStatuses = computed(
    (): Record<CompanyMonetaryInfoField, FieldStatus> =>
      COMPANY_MONETARY_INFO_FIELDS.reduce(
        statusesReducer,
        {} as Record<CompanyMonetaryInfoField, FieldStatus>
      )
  );

  // Field actions
  const verifyField = (
    sectionKey: CompanyReviewSection,
    fieldKey:
      | CompanyBasicInfoField
      | CompanyBusinessItemsField
      | CompanyMonetaryInfoField,
    note?: string
  ) => {
    const fieldPath = `company.${fieldKey}`;
    // Remove any existing issue first
    removeIssue(sectionKey, fieldPath);
    // Add verification
    addVerification(sectionKey, { fieldPath, note });
  };

  const reportFieldIssue = (
    sectionKey: CompanyReviewSection,
    fieldKey:
      | CompanyBasicInfoField
      | CompanyBusinessItemsField
      | CompanyMonetaryInfoField,
    issueType: ReviewIssueSchema["issueType"],
    severity: ReviewIssueSchema["severity"],
    description?: string
  ) => {
    const fieldPath = `company.${fieldKey}`;
    // Remove any existing verification first
    removeVerification(sectionKey, fieldPath);
    // Add issue
    addIssue(sectionKey, {
      fieldPath,
      issueType,
      severity,
      description,
    });
  };

  // Bulk actions
  const verifyAllFields = (sectionKey: CompanyReviewSection) => {
    let fields;
    if (sectionKey === "companyBasicInfo") {
      fields = COMPANY_BASIC_INFO_FIELDS;
    } else if (sectionKey === "companyBusinessItems") {
      fields = COMPANY_BUSINESS_ITEMS_FIELDS;
    } else if (sectionKey === "companyMonetaryInfo") {
      fields = COMPANY_MONETARY_INFO_FIELDS;
    } else {
      throw new Error("Invalid section key");
    }
    fields.forEach((field) => {
      verifyField(sectionKey, field);
    });
  };

  const clearAllMarkers = () => {
    basicInfoSectionState.value.issues = [];
    basicInfoSectionState.value.verifications = [];
    businessItemsSectionState.value.issues = [];
    businessItemsSectionState.value.verifications = [];
    monetaryInfoSectionState.value.issues = [];
    monetaryInfoSectionState.value.verifications = [];
  };

  // Status computed
  const status = computed(() => {
    const section = basicInfoSectionState.value;
    const criticalIssues = section.issues.filter(
      (i) => i.severity === "critical"
    );

    return {
      hasIssues: section.issues.length > 0,
      hasCriticalIssues: criticalIssues.length > 0,
      hasVerifications: section.verifications.length > 0,
      issueCount: section.issues.length,
      criticalIssueCount: criticalIssues.length,
      verificationCount: section.verifications.length,
      totalFields: COMPANY_BASIC_INFO_FIELDS.length,
      isComplete:
        section.verifications.length === COMPANY_BASIC_INFO_FIELDS.length &&
        section.issues.length === 0,
    };
  });

  return {
    // State
    companyBasicInfo,
    companyBusinessItems,
    companyMonetaryInfo,
    basicInfoSectionState,
    businessItemsSectionState,
    monetaryInfoSectionState,
    basicInfoFieldStatuses,
    businessItemsFieldStatuses,
    monetaryInfoFieldStatuses,
    basicInfoSectionIsOpen,
    businessItemsSectionIsOpen,
    monetaryInfoSectionIsOpen,
    status,

    // Actions
    verifyField,
    reportFieldIssue,
    verifyAllFields,
    clearAllMarkers,
    toggleSection: () => toggleSection("companyBasicInfo"),
  };
};
