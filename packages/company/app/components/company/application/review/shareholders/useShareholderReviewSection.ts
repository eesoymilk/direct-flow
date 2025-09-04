import type { DropdownMenuItem } from "@nuxt/ui";
import type { SectionStatus } from "~/composables/useReviewSectionStatus";
import { useShareholderReview } from "./useShareholderReview";
import type { FieldStatus, SectionConfig } from "../types";
import { generateFieldStatus } from "../utils";
import { useCompanyApplicationReviewStore } from "../useCompanyApplicationReviewStore";
import { SHAREHOLDER_FIELDS } from "../constants";
import type { ShareholderField } from "../types";

export const SHAREHOLDER_SECTION_KEY = "shareholders";

export const useShareholderReviewSection = (config: SectionConfig) => {
  const { shareholders } = useShareholderReview();

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

  const sectionState = computed(() => getSectionState(SHAREHOLDER_SECTION_KEY));

  const sectionIsOpen = computed(() => sectionState.value.isOpen);

  // Aggregate field statuses per shareholder (similar to person sections)
  const fieldStatuses = computed(() => {
    const shareholderStatuses: Record<
      number,
      Record<ShareholderField, FieldStatus>
    > = {};

    shareholders.value.forEach((_, index) => {
      const statusesReducer = (
        acc: Record<ShareholderField, FieldStatus>,
        field: ShareholderField
      ): Record<ShareholderField, FieldStatus> => {
        const fieldPath = `shareholders[${index}].${field}`;
        const issue = sectionState.value.issues.find(
          (i) => i.fieldPath === fieldPath
        );
        const verification = sectionState.value.verifications.find(
          (v) => v.fieldPath === fieldPath
        );

        acc[field] = generateFieldStatus(issue, verification);

        return acc;
      };

      shareholderStatuses[index] = SHAREHOLDER_FIELDS.reduce(
        statusesReducer,
        {} as Record<ShareholderField, FieldStatus>
      );
    });

    return shareholderStatuses;
  });

  // Flat statuses for aggregate calculations (keeping for compatibility)
  const allFieldStatuses = computed(() => {
    const statuses: Record<string, FieldStatus> = {};

    Object.entries(fieldStatuses.value).forEach(
      ([shareholderIndex, shareholderFields]) => {
        Object.entries(shareholderFields).forEach(([field, status]) => {
          const fieldPath = `shareholders[${shareholderIndex}].${field}`;
          statuses[fieldPath] = status;
        });
      }
    );

    return statuses;
  });

  // Aggregate status across all shareholders and fields
  const status = computed((): SectionStatus => {
    const allStatuses = Object.values(allFieldStatuses.value);
    const issues = allStatuses.filter((s) => s.hasIssue);
    const verifications = allStatuses.filter((s) => s.isVerified);
    const criticalIssues = issues.filter(
      (s) => s.issue?.severity === "critical"
    );

    return {
      hasIssues: issues.length > 0,
      hasCriticalIssues: criticalIssues.length > 0,
      hasVerifications: verifications.length > 0,
      issueCount: issues.length,
      criticalIssueCount: criticalIssues.length,
      verificationCount: verifications.length,
      totalFields: allStatuses.length,
      isComplete:
        verifications.length === allStatuses.length && issues.length === 0,
    };
  });

  const {
    sectionBorderClass,
    statusIcon,
    statusIconClass,
    statusBadgeColor,
    statusLabel,
  } = useReviewSectionStatus(status);

  // Helper functions for individual shareholder fields (optimized)
  const getShareholderFieldStatus = (
    field: ShareholderField,
    shareholderIndex: number
  ): FieldStatus => {
    return (
      fieldStatuses.value[shareholderIndex]?.[field] || {
        hasIssue: false,
        isVerified: false,
        issue: undefined,
        verification: undefined,
      }
    );
  };

  const getShareholderFieldStatusProps = (
    field: ShareholderField,
    shareholderIndex: number
  ): {
    statusLabel: string;
    statusBadgeColor: "success" | "warning" | "neutral";
  } => {
    const fieldStatus = fieldStatuses.value[shareholderIndex]?.[field];
    const { isVerified = false, hasIssue = false } = fieldStatus || {};

    return {
      statusLabel: isVerified ? "已驗證" : hasIssue ? "有問題" : "",
      statusBadgeColor: isVerified
        ? "success"
        : hasIssue
          ? "warning"
          : "neutral",
    };
  };

  const getShareholderStatuses = (shareholderIndex: number) =>
    SHAREHOLDER_FIELDS.reduce(
      (acc, field) => {
        acc[field] = getShareholderFieldStatus(field, shareholderIndex);
        return acc;
      },
      {} as Record<ShareholderField, FieldStatus>
    );

  const getShareholderOverallStatus = (shareholderIndex: number) => {
    const shareholderFields = getShareholderStatuses(shareholderIndex);
    return {
      hasVerified: Object.values(shareholderFields).every(
        (field) => field.isVerified
      ),
      hasIssues: Object.values(shareholderFields).some(
        (field) => field.hasIssue
      ),
    };
  };

  const getShareholderStatusesProps = (shareholderIndex: number) =>
    SHAREHOLDER_FIELDS.reduce(
      (acc, field) => {
        acc[field] = getShareholderFieldStatusProps(field, shareholderIndex);
        return acc;
      },
      {} as Record<
        ShareholderField,
        {
          statusLabel: string;
          statusBadgeColor: "success" | "warning" | "neutral";
        }
      >
    );

  // Field actions
  const addFieldIssue = (issue: ReviewIssueSchema) => {
    clearField(SHAREHOLDER_SECTION_KEY, issue.fieldPath);
    console.log("Adding issue for shareholders:", issue);
    addIssue(SHAREHOLDER_SECTION_KEY, issue);
  };

  const verifyShareholderField = (
    field: ShareholderField,
    shareholderIndex: number,
    note?: string
  ) => {
    const fieldPath = `shareholders[${shareholderIndex}].${field}`;
    clearField(SHAREHOLDER_SECTION_KEY, fieldPath);
    addVerification(SHAREHOLDER_SECTION_KEY, { fieldPath, note });
  };

  // Bulk actions
  const verifyAllFields = () => {
    shareholders.value.forEach((_, index) => {
      SHAREHOLDER_FIELDS.forEach((field) => {
        verifyShareholderField(field, index, "批量標記為已驗證");
      });
    });
  };

  const clearAllMarkers = () => {
    shareholders.value.forEach((_, index) => {
      SHAREHOLDER_FIELDS.forEach((field) => {
        const fieldPath = `shareholders[${index}].${field}`;
        clearField(SHAREHOLDER_SECTION_KEY, fieldPath);
      });
    });
  };

  const markAllReviewed = () => {
    // Get current field statuses to avoid marking fields that have issues
    const currentStatuses: Record<string, boolean> = {};
    shareholders.value.forEach((_, index) => {
      SHAREHOLDER_FIELDS.forEach((field) => {
        const fieldPath = `shareholders[${index}].${field}`;
        const hasIssue = sectionState.value.issues.some(
          (i) => i.fieldPath === fieldPath
        );
        currentStatuses[fieldPath] = hasIssue;
      });
    });

    shareholders.value.forEach((_, index) => {
      SHAREHOLDER_FIELDS.forEach((field) => {
        const fieldPath = `shareholders[${index}].${field}`;
        if (!currentStatuses[fieldPath]) {
          addVerification(SHAREHOLDER_SECTION_KEY, {
            fieldPath,
            note: "已檢視",
          });
        }
      });
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
      onSelect: () => markAllReviewed(),
    },
  ]);

  // Toggle section handler
  const handleToggleSection = () => toggleSection(SHAREHOLDER_SECTION_KEY);

  return {
    // State
    shareholders,
    sectionState,
    sectionIsOpen,
    fieldStatuses, // Aggregated statuses by shareholder index and field
    status,
    sectionBorderClass,
    statusIcon,
    statusIconClass,
    statusBadgeColor,
    statusLabel,
    quickActionItems,

    // Field helpers (optimized)
    getShareholderFieldStatus,
    getShareholderFieldStatusProps,
    getShareholderStatuses,
    getShareholderOverallStatus,
    getShareholderStatusesProps,

    // Actions
    addFieldIssue,
    verifyShareholderField,
    verifyAllFields,
    clearAllMarkers,
    markAllReviewed,
    handleToggleSection,
  };
};
