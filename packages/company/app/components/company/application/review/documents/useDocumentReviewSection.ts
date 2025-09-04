import {
  type CompanyDocumentField,
  COMPANY_DOCUMENT_FIELDS,
} from "./useDocumentReview";
import type { FieldStatus, SectionStatus } from "../types";
import { generateFieldStatus } from "../utils";

const DOCUMENT_SECTION_KEY = "documents";

export const useDocumentReviewSection = () => {
  const {
    addIssue,
    addVerification,
    clearField,
    getSectionState,
    toggleSection,
  } = useCompanyApplicationReviewStore();

  const sectionState = computed(() => getSectionState(DOCUMENT_SECTION_KEY));

  const sectionIsOpen = computed(() => sectionState.value.isOpen);

  const statusesReducer = (
    acc: Record<CompanyDocumentField, FieldStatus>,
    field: CompanyDocumentField
  ): Record<CompanyDocumentField, FieldStatus> => {
    const fieldPath = `documents.${field}`;
    const issue = sectionState.value.issues.find(
      (i) => i.fieldPath === fieldPath
    );
    const verification = sectionState.value.verifications.find(
      (v) => v.fieldPath === fieldPath
    );

    acc[field] = generateFieldStatus(issue, verification);

    return acc;
  };

  const fieldStatuses = computed(
    (): Record<CompanyDocumentField, FieldStatus> =>
      COMPANY_DOCUMENT_FIELDS.reduce(
        statusesReducer,
        {} as Record<CompanyDocumentField, FieldStatus>
      )
  );

  // Calculate section status
  const status = computed((): SectionStatus => {
    const section = fieldStatuses.value;

    const sectionIssues = COMPANY_DOCUMENT_FIELDS.filter(
      (f) => section[f].hasIssue
    );
    const sectionVerifications = COMPANY_DOCUMENT_FIELDS.filter(
      (f) => section[f].isVerified
    );
    const criticalIssues = sectionIssues.filter(
      (f) => section[f].issue?.severity === "critical"
    );

    return {
      hasIssues: sectionIssues.length > 0,
      hasCriticalIssues: criticalIssues.length > 0,
      hasVerifications: sectionVerifications.length > 0,
      issueCount: sectionIssues.length,
      criticalIssueCount: criticalIssues.length,
      verificationCount: sectionVerifications.length,
      totalFields: COMPANY_DOCUMENT_FIELDS.length,
      isComplete:
        sectionVerifications.length === COMPANY_DOCUMENT_FIELDS.length &&
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
    clearField(DOCUMENT_SECTION_KEY, issue.fieldPath);

    console.log("Adding issue for:", DOCUMENT_SECTION_KEY);
    console.log("Issue:", issue);
    addIssue(DOCUMENT_SECTION_KEY, issue);
  };

  const verifyField = (fieldKey: CompanyDocumentField, note?: string) => {
    clearField(DOCUMENT_SECTION_KEY, `documents.${fieldKey}`);

    addVerification(DOCUMENT_SECTION_KEY, {
      fieldPath: `documents.${fieldKey}`,
      note,
    });
  };

  // Bulk actions
  const verifyAllFields = () => {
    COMPANY_DOCUMENT_FIELDS.forEach((field) => verifyField(field));
  };

  const clearAllFields = () => {
    COMPANY_DOCUMENT_FIELDS.forEach((field) => {
      const fieldPath = `documents.${field}`;
      clearField(DOCUMENT_SECTION_KEY, fieldPath);
    });
  };

  // Quick action items
  const quickActionItems = computed(() => [
    {
      label: "驗證全部文件",
      icon: "i-heroicons-check-circle",
      color: "success" as const,
      disabled: status.value.hasIssues,
      action: () => verifyAllFields(),
    },
    {
      label: "清除所有標記",
      icon: "i-heroicons-x-circle",
      color: "neutral" as const,
      disabled: !status.value.hasVerifications && !status.value.hasIssues,
      action: () => clearAllFields(),
    },
    {
      label: "標記為已審核",
      icon: "i-heroicons-eye",
      color: "info" as const,
      disabled: false,
      action: () => verifyAllFields(),
    },
  ]);

  const handleToggleSection = () => toggleSection(DOCUMENT_SECTION_KEY);

  const getFieldStatusProps = (
    field: CompanyDocumentField
  ): {
    statusLabel: string;
    statusBadgeColor: "success" | "warning" | "neutral";
  } => {
    const { isVerified, hasIssue } = fieldStatuses.value[field];
    return {
      statusLabel: isVerified ? "已驗證" : hasIssue ? "有問題" : "",
      statusBadgeColor: isVerified
        ? "success"
        : hasIssue
          ? "warning"
          : "neutral",
    };
  };

  return {
    sectionIsOpen,
    fieldStatuses,
    status,
    sectionBorderClass,
    statusIcon,
    statusIconClass,
    statusBadgeColor,
    statusLabel,
    quickActionItems,
    addFieldIssue,
    verifyField,
    handleToggleSection,
    getFieldStatusProps,
  };
};
