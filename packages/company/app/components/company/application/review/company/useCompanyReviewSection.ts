import type { DropdownMenuItem } from "@nuxt/ui";
import type { CompanyBasicInfoField } from "./useCompanyReview";

type CompanyReviewSection =
  | "companyBasicInfo"
  | "companyBusinessItems"
  | "companyMonetaryInfo";

type FieldStatus = {
  hasIssue: boolean;
  issue: ReviewIssueSchema | undefined;
  isVerified: boolean;
  verification: ReviewVerificationSchema | undefined;
};

type SectionStatus = {
  hasIssues: boolean;
  hasCriticalIssues: boolean;
  hasVerifications: boolean;
  issueCount: number;
  criticalIssueCount: number;
  verificationCount: number;
  totalFields: number;
  isComplete: boolean;
};

type SectionConfig<T extends string> = {
  sectionKey: CompanyReviewSection;
  fields: readonly T[];
  sectionTitle: string;
  verifyAllLabel: string;
  clearAllLabel: string;
  markReviewedLabel: string;
};

export const useCompanyReviewSection = <T extends string>(
  config: SectionConfig<T>
) => {
  const reviewStore = useCompanyApplicationReviewStore();
  const {
    addIssue,
    removeIssue,
    addVerification,
    removeVerification,
    getSectionState,
    toggleSection,
  } = reviewStore;

  const sectionState = computed(() => getSectionState(config.sectionKey));

  const sectionIsOpen = computed({
    get: () => sectionState.value.isOpen,
    set: () => toggleSection(config.sectionKey),
  });

  const statusesReducer = (
    acc: Record<T, FieldStatus>,
    field: T
  ): Record<T, FieldStatus> => {
    const fieldPath = `company.${field}`;
    const issue = sectionState.value.issues.find(
      (i) => i.fieldPath === fieldPath
    );
    const verification = sectionState.value.verifications.find(
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

  const fieldStatuses = computed(
    (): Record<T, FieldStatus> =>
      config.fields.reduce(statusesReducer, {} as Record<T, FieldStatus>)
  );

  // Section-specific status calculation
  const status = computed((): SectionStatus => {
    const section = fieldStatuses.value;
    const sectionIssues = config.fields.filter(
      (field) => section[field].hasIssue
    );
    const sectionVerifications = config.fields.filter(
      (field) => section[field].isVerified
    );
    const criticalIssues = sectionIssues.filter(
      (field) => section[field].issue?.severity === "critical"
    );

    return {
      hasIssues: sectionIssues.length > 0,
      hasCriticalIssues: criticalIssues.length > 0,
      hasVerifications: sectionVerifications.length > 0,
      issueCount: sectionIssues.length,
      criticalIssueCount: criticalIssues.length,
      verificationCount: sectionVerifications.length,
      totalFields: config.fields.length,
      isComplete:
        sectionVerifications.length === config.fields.length &&
        sectionIssues.length === 0,
    };
  });

  const {
    sectionBorderClass,
    statusIcon,
    statusIconClass,
    statusBadgeColor,
    statusLabel,
  } = useReviewSectionStatus(status);

  // Field actions
  const addFieldIssue = (issue: ReviewIssueSchema) => {
    console.log("Adding issue for:", config.sectionKey);
    console.log("Issue:", issue);
    addIssue(config.sectionKey, issue);
  };

  const verifyField = (fieldKey: T, note?: string) => {
    addVerification(config.sectionKey, {
      fieldPath: `company.${fieldKey}`,
      note,
    });
  };

  // Bulk actions
  const verifyAllFields = () => {
    config.fields.forEach((field) => verifyField(field));
  };

  const clearAllMarkers = () => {
    config.fields.forEach((field) => {
      const fieldPath = `company.${field}`;
      removeIssue(config.sectionKey, fieldPath);
      removeVerification(config.sectionKey, fieldPath);
    });
  };

  // Quick action items
  const quickActionItems = computed((): DropdownMenuItem[] => [
    {
      label: config.verifyAllLabel,
      icon: "i-lucide-check-circle",
      color: "success",
      disabled: status.value.isComplete,
      onSelect: () => verifyAllFields(),
    },
    {
      label: config.clearAllLabel,
      icon: "i-lucide-eraser",
      color: "neutral",
      disabled: !status.value.hasIssues && !status.value.hasVerifications,
      onSelect: () => clearAllMarkers(),
    },
    {
      label: config.markReviewedLabel,
      icon: "i-lucide-eye",
      color: "primary",
      disabled: status.value.isComplete,
      onSelect: () => verifyAllFields(),
    },
  ]);

  // Helper function to get field status props
  const getFieldStatusProps = (
    fieldKey: T
  ): {
    statusLabel: string;
    statusBadgeColor: "success" | "warning" | "neutral";
  } => {
    const { isVerified, hasIssue } = fieldStatuses.value[fieldKey];
    return {
      statusLabel: isVerified ? "已驗證" : hasIssue ? "有問題" : "",
      statusBadgeColor: isVerified
        ? "success"
        : hasIssue
          ? "warning"
          : "neutral",
    };
  };

  // Toggle section handler
  const handleToggleSection = () => {
    toggleSection(config.sectionKey);
  };

  return {
    // State
    sectionState,
    sectionIsOpen,
    fieldStatuses,
    status,
    sectionBorderClass,
    statusIcon,
    statusIconClass,
    statusBadgeColor,
    statusLabel,
    quickActionItems,

    // Actions
    addFieldIssue,
    verifyField,
    verifyAllFields,
    clearAllMarkers,
    handleToggleSection,
    getFieldStatusProps,
  };
};
