import type { DropdownMenuItem } from "@nuxt/ui";
import type {
  FieldStatus,
  SectionConfig as BaseSectionConfig,
  SectionStatus,
} from "../types";
import { generateFieldStatus } from "../utils";

type PersonReviewSection =
  | "responsiblePerson"
  | "representative"
  | "contactPerson";

type SectionConfig = BaseSectionConfig & {
  sectionKey: PersonReviewSection;
};

const PERSON_FIELDS = [
  "name",
  "idNumber",
  "address",
  "telephone",
  "cellphone",
  "email",
] as const;

type PersonField = (typeof PERSON_FIELDS)[number];

export const usePersonReviewSection = (config: SectionConfig) => {
  const reviewStore = useCompanyApplicationReviewStore();
  const {
    addIssue,
    removeIssue,
    addVerification,
    removeVerification,
    clearField,
    getSectionState,
    toggleSection,
  } = reviewStore;

  const sectionState = computed(() => getSectionState(config.sectionKey));

  const sectionIsOpen = computed(() => sectionState.value.isOpen);

  const statusesReducer = (
    acc: Record<PersonField, FieldStatus>,
    field: PersonField
  ): Record<PersonField, FieldStatus> => {
    const fieldPath = `${config.sectionKey}.${field}`;
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
    (): Record<PersonField, FieldStatus> =>
      PERSON_FIELDS.reduce(
        statusesReducer,
        {} as Record<PersonField, FieldStatus>
      )
  );

  // Section-specific status calculation
  const status = computed((): SectionStatus => {
    const section = fieldStatuses.value;
    const sectionIssues = PERSON_FIELDS.filter(
      (field) => section[field].hasIssue
    );
    const sectionVerifications = PERSON_FIELDS.filter(
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
      totalFields: PERSON_FIELDS.length,
      isComplete:
        sectionVerifications.length === PERSON_FIELDS.length &&
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
    clearField(config.sectionKey, issue.fieldPath);

    console.log("Adding issue for:", config.sectionKey);
    console.log("Issue:", issue);
    addIssue(config.sectionKey, issue);
  };

  const verifyField = (fieldKey: PersonField, note?: string) => {
    const fieldPath = `${config.sectionKey}.${fieldKey}`;
    clearField(config.sectionKey, fieldPath);

    addVerification(config.sectionKey, {
      fieldPath,
      note,
    });
  };

  // Bulk actions
  const verifyAllFields = () => {
    PERSON_FIELDS.forEach((field) => verifyField(field));
  };

  const clearAllMarkers = () => {
    PERSON_FIELDS.forEach((field) => {
      const fieldPath = `${config.sectionKey}.${field}`;
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
    fieldKey: PersonField
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
  const handleToggleSection = () => toggleSection(config.sectionKey);

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
