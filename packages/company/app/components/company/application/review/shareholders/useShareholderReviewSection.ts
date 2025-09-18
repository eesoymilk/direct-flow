import type { DropdownMenuItem } from "@nuxt/ui";
import type { SectionStatus } from "~/composables/useReviewSectionStatus";
import { usePartnerReview } from "./usePartnerReview";
import type { FieldStatus, SectionConfig, PartnerField } from "../types";
import { generateFieldStatus } from "../utils";
import { useCompanyApplicationReviewStore } from "../useCompanyApplicationReviewStore";
import { SHAREHOLDER_FIELDS } from "../constants";

export const SHAREHOLDER_SECTION_KEY = "partners";

export const usePartnerReviewSection = (config: SectionConfig) => {
  const { partners } = usePartnerReview();

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

  // Aggregate field statuses per partner (similar to person sections)
  const fieldStatuses = computed(() => {
    const partnerStatuses: Record<
      number,
      Record<PartnerField, FieldStatus>
    > = {};

    partners.value.forEach((_, index) => {
      const statusesReducer = (
        acc: Record<PartnerField, FieldStatus>,
        field: PartnerField
      ): Record<PartnerField, FieldStatus> => {
        const fieldPath = `partners[${index}].${field}`;
        const issue = sectionState.value.issues.find(
          (i) => i.fieldPath === fieldPath
        );
        const verification = sectionState.value.verifications.find(
          (v) => v.fieldPath === fieldPath
        );

        acc[field] = generateFieldStatus(issue, verification);

        return acc;
      };

      partnerStatuses[index] = SHAREHOLDER_FIELDS.reduce(
        statusesReducer,
        {} as Record<PartnerField, FieldStatus>
      );
    });

    return partnerStatuses;
  });

  // Flat statuses for aggregate calculations (keeping for compatibility)
  const allFieldStatuses = computed(() => {
    const statuses: Record<string, FieldStatus> = {};

    Object.entries(fieldStatuses.value).forEach(
      ([partnerIndex, partnerFields]) => {
        Object.entries(partnerFields).forEach(([field, status]) => {
          const fieldPath = `partners[${partnerIndex}].${field}`;
          statuses[fieldPath] = status;
        });
      }
    );

    return statuses;
  });

  // Aggregate status across all partners and fields
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

  // Helper functions for individual partner fields (optimized)
  const getPartnerFieldStatus = (
    field: PartnerField,
    partnerIndex: number
  ): FieldStatus => {
    return (
      fieldStatuses.value[partnerIndex]?.[field] || {
        hasIssue: false,
        isVerified: false,
        issue: undefined,
        verification: undefined,
      }
    );
  };

  const getPartnerFieldStatusProps = (
    field: PartnerField,
    partnerIndex: number
  ): {
    statusLabel: string;
    statusBadgeColor: "success" | "warning" | "neutral";
  } => {
    const fieldStatus = fieldStatuses.value[partnerIndex]?.[field];
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

  const getPartnerStatuses = (partnerIndex: number) =>
    SHAREHOLDER_FIELDS.reduce(
      (acc, field) => {
        acc[field] = getPartnerFieldStatus(field, partnerIndex);
        return acc;
      },
      {} as Record<PartnerField, FieldStatus>
    );

  const getPartnerOverallStatus = (partnerIndex: number) => {
    const partnerFields = getPartnerStatuses(partnerIndex);
    return {
      hasVerified: Object.values(partnerFields).every(
        (field) => field.isVerified
      ),
      hasIssues: Object.values(partnerFields).some((field) => field.hasIssue),
    };
  };

  const getPartnerStatusesProps = (partnerIndex: number) =>
    SHAREHOLDER_FIELDS.reduce(
      (acc, field) => {
        acc[field] = getPartnerFieldStatusProps(field, partnerIndex);
        return acc;
      },
      {} as Record<
        PartnerField,
        {
          statusLabel: string;
          statusBadgeColor: "success" | "warning" | "neutral";
        }
      >
    );

  // Field actions
  const addFieldIssue = (issue: ReviewIssueSchema) => {
    clearField(SHAREHOLDER_SECTION_KEY, issue.fieldPath);
    console.log("Adding issue for partners:", issue);
    addIssue(SHAREHOLDER_SECTION_KEY, issue);
  };

  const verifyPartnerField = (
    field: PartnerField,
    partnerIndex: number,
    note?: string
  ) => {
    const fieldPath = `partners[${partnerIndex}].${field}`;
    clearField(SHAREHOLDER_SECTION_KEY, fieldPath);
    addVerification(SHAREHOLDER_SECTION_KEY, { fieldPath, note });
  };

  // Bulk actions
  const verifyAllFields = () => {
    partners.value.forEach((_, index) => {
      SHAREHOLDER_FIELDS.forEach((field) => {
        verifyPartnerField(field, index, "批量標記為已驗證");
      });
    });
  };

  const clearAllMarkers = () => {
    partners.value.forEach((_, index) => {
      SHAREHOLDER_FIELDS.forEach((field) => {
        const fieldPath = `partners[${index}].${field}`;
        clearField(SHAREHOLDER_SECTION_KEY, fieldPath);
      });
    });
  };

  const markAllReviewed = () => {
    // Get current field statuses to avoid marking fields that have issues
    const currentStatuses: Record<string, boolean> = {};
    partners.value.forEach((_, index) => {
      SHAREHOLDER_FIELDS.forEach((field) => {
        const fieldPath = `partners[${index}].${field}`;
        const hasIssue = sectionState.value.issues.some(
          (i) => i.fieldPath === fieldPath
        );
        currentStatuses[fieldPath] = hasIssue;
      });
    });

    partners.value.forEach((_, index) => {
      SHAREHOLDER_FIELDS.forEach((field) => {
        const fieldPath = `partners[${index}].${field}`;
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
    partners,
    sectionState,
    sectionIsOpen,
    fieldStatuses, // Aggregated statuses by partner index and field
    status,
    sectionBorderClass,
    statusIcon,
    statusIconClass,
    statusBadgeColor,
    statusLabel,
    quickActionItems,

    // Field helpers (optimized)
    getPartnerFieldStatus,
    getPartnerFieldStatusProps,
    getPartnerStatuses,
    getPartnerOverallStatus,
    getPartnerStatusesProps,

    // Actions
    addFieldIssue,
    verifyPartnerField,
    verifyAllFields,
    clearAllMarkers,
    markAllReviewed,
    handleToggleSection,
  };
};
