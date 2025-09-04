import { type CompanyDocumentField, COMPANY_DOCUMENT_FIELDS } from "./useDocumentReview";

export const useDocumentReviewSection = () => {
  const { getFieldStatus, addIssue, verifyField, clearField } = 
    useCompanyApplicationReviewStore();

  const sectionIsOpen = ref(false);

  // Get field statuses for all document fields
  const fieldStatuses = computed(() => {
    const statuses: Record<CompanyDocumentField, FieldStatus> = {} as any;
    
    for (const field of COMPANY_DOCUMENT_FIELDS) {
      statuses[field] = getFieldStatus(`documents.${field}`);
    }
    
    return statuses;
  });

  // Calculate section status
  const status = computed((): SectionStatus => {
    const fields = Object.values(fieldStatuses.value);
    const totalFields = fields.length;
    
    const issueCount = fields.filter(f => f.hasIssue).length;
    const criticalIssueCount = fields.filter(f => 
      f.hasIssue && f.issue?.severity === 'critical'
    ).length;
    const verificationCount = fields.filter(f => f.isVerified).length;
    
    return {
      hasIssues: issueCount > 0,
      hasCriticalIssues: criticalIssueCount > 0, 
      hasVerifications: verificationCount > 0,
      issueCount,
      criticalIssueCount,
      verificationCount,
      totalFields,
      isComplete: verificationCount === totalFields && issueCount === 0,
    };
  });

  // UI styling based on status
  const sectionBorderClass = computed(() => {
    if (status.value.hasCriticalIssues) return "border-red-300 bg-red-50";
    if (status.value.hasIssues) return "border-yellow-300 bg-yellow-50";
    if (status.value.hasVerifications) return "border-green-300 bg-green-50";
    return "border-gray-200 bg-white";
  });

  const statusIcon = computed(() => {
    if (status.value.hasCriticalIssues) return "i-heroicons-exclamation-triangle";
    if (status.value.hasIssues) return "i-heroicons-exclamation-circle";
    if (status.value.isComplete) return "i-heroicons-check-circle";
    return "i-heroicons-document-text";
  });

  const statusIconClass = computed(() => {
    if (status.value.hasCriticalIssues) return "text-red-600";
    if (status.value.hasIssues) return "text-yellow-600";
    if (status.value.isComplete) return "text-green-600";
    return "text-gray-500";
  });

  const statusBadgeColor = computed(() => {
    if (status.value.hasCriticalIssues) return "red";
    if (status.value.hasIssues) return "yellow";
    if (status.value.isComplete) return "green";
    return "gray";
  });

  const statusLabel = computed(() => {
    if (status.value.hasCriticalIssues) {
      return `${status.value.criticalIssueCount} 嚴重問題`;
    }
    if (status.value.hasIssues) {
      return `${status.value.issueCount} 個問題`;
    }
    if (status.value.isComplete) {
      return "已完成審核";
    }
    return "待審核";
  });

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
      action: () => markAsReviewed(),
    },
  ]);

  // Actions
  const verifyAllFields = () => {
    COMPANY_DOCUMENT_FIELDS.forEach(field => {
      if (!fieldStatuses.value[field].hasIssue) {
        verifyField(`documents.${field}`);
      }
    });
  };

  const clearAllFields = () => {
    COMPANY_DOCUMENT_FIELDS.forEach(field => {
      clearField(`documents.${field}`);
    });
  };

  const markAsReviewed = () => {
    // TODO: Implement mark as reviewed logic
    console.log("Mark documents section as reviewed");
  };

  const addFieldIssue = (fieldPath: string) => {
    addIssue(fieldPath);
  };

  const verifyFieldAction = (field: CompanyDocumentField) => {
    verifyField(`documents.${field}`);
  };

  const handleToggleSection = () => {
    sectionIsOpen.value = !sectionIsOpen.value;
  };

  const getFieldStatusProps = (field: CompanyDocumentField) => {
    const fieldStatus = fieldStatuses.value[field];
    return {
      isVerified: fieldStatus.isVerified,
      hasIssue: fieldStatus.hasIssue,
      issue: fieldStatus.issue,
      verification: fieldStatus.verification,
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
    verifyField: verifyFieldAction,
    handleToggleSection,
    getFieldStatusProps,
  };
};