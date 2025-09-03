export interface SectionStatus {
  hasIssues: boolean;
  hasCriticalIssues: boolean;
  hasVerifications: boolean;
  isComplete: boolean;
  issueCount: number;
  criticalIssueCount: number;
  verificationCount: number;
  totalFields: number;
}

/**
 * Composable for generating status display properties based on section status
 * @param status - The section status object containing counts and flags
 * @returns Object with computed properties for displaying status
 */
export function useReviewSectionStatus(
  status: ComputedRef<SectionStatus> | SectionStatus
) {
  // Ensure we have a computed ref to work with
  const sectionStatus = computed(() => {
    return typeof status === "object" && "value" in status
      ? status.value
      : status;
  });

  const sectionBorderClass = computed(() => {
    if (sectionStatus.value.hasCriticalIssues) return "border-l-error-500";
    if (sectionStatus.value.hasIssues) return "border-l-warning-500";
    if (sectionStatus.value.hasVerifications) return "border-l-success-500";
    return "border-l-neutral-300";
  });

  const statusIcon = computed(() => {
    if (sectionStatus.value.hasIssues) return "i-lucide-alert-triangle";
    if (sectionStatus.value.hasVerifications) return "i-lucide-check-circle";
    return "i-lucide-circle";
  });

  const statusIconClass = computed(() => {
    if (sectionStatus.value.hasIssues) return "text-warning-500";
    if (sectionStatus.value.hasVerifications) return "text-success-500";
    return "text-neutral-400";
  });

  const statusBadgeColor = computed(
    ():
      | "error"
      | "warning"
      | "success"
      | "neutral"
      | "primary"
      | "secondary"
      | "info" => {
      if (sectionStatus.value.hasCriticalIssues) return "error";
      if (sectionStatus.value.hasIssues) return "warning";
      if (sectionStatus.value.hasVerifications) return "success";
      return "neutral";
    }
  );

  const statusLabel = computed(() => {
    if (sectionStatus.value.hasCriticalIssues) {
      return `${sectionStatus.value.criticalIssueCount} 嚴重問題`;
    }
    if (sectionStatus.value.hasIssues) {
      return `${sectionStatus.value.issueCount} 問題`;
    }
    if (sectionStatus.value.isComplete) {
      return "完成審核";
    }
    if (sectionStatus.value.hasVerifications) {
      return `${sectionStatus.value.verificationCount}/${sectionStatus.value.totalFields} 已驗證`;
    }
    return "準備審核";
  });

  return {
    sectionBorderClass,
    statusIcon,
    statusIconClass,
    statusBadgeColor,
    statusLabel,
  };
}
