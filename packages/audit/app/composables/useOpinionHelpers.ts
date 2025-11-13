import type { OpinionType } from "#shared/types/audit-report";

/**
 * Composable for opinion-related helper functions
 * Provides utilities for formatting and displaying opinion types
 */
export const useOpinionHelpers = () => {
  /**
   * Get the Chinese label for an opinion type
   */
  const getOpinionTypeLabel = (type: OpinionType | "qualified"): string => {
    const labels: Record<OpinionType | "qualified", string> = {
      unqualified: "無保留意見",
      qualified: "保留意見",
      qualifiedDisclaimer: "保留意見",
      qualifiedAdverse: "保留意見",
      adverse: "否定意見",
      disclaimer: "無法表示意見",
    };
    return labels[type];
  };

  /**
   * Simplify opinion types that are sub-types of qualified
   * Converts qualifiedDisclaimer and qualifiedAdverse to qualified
   */
  const getSimplifiedOpinionType = (
    type: OpinionType
  ): OpinionType | "qualified" => {
    if (type === "qualifiedDisclaimer" || type === "qualifiedAdverse") {
      return "qualified";
    }
    return type;
  };

  /**
   * Get the title for dual opinion reports
   * Combines opinion types from both years into a single title
   */
  const getDualOpinionTitle = (
    currentYearOpinionType: OpinionType,
    comparativeYearOpinionType: OpinionType
  ): string => {
    const current = getSimplifiedOpinionType(currentYearOpinionType);
    const comparative = getSimplifiedOpinionType(comparativeYearOpinionType);

    // If both opinions are the same, return single opinion title
    if (current === comparative) {
      return getOpinionTypeLabel(current);
    }

    // Otherwise, combine both opinion titles
    const sorted = [current, comparative].sort() as [
      OpinionType | "qualified",
      OpinionType | "qualified"
    ];
    return `${getOpinionTypeLabel(sorted[0])}及${getOpinionTypeLabel(sorted[1])}`;
  };

  return {
    getOpinionTypeLabel,
    getSimplifiedOpinionType,
    getDualOpinionTitle,
  };
};
