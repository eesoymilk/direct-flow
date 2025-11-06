import type {
  OpinionType,
  OpinionInfoForm,
  DualOpinionTitleType,
} from "#shared/types/audit-report";

/**
 * Maps opinion types to Chinese title text
 */
export const opinionSectionTitleMap: Record<
  OpinionType | "qualified",
  string
> = {
  unqualified: "無保留意見",
  qualified: "保留意見",
  qualifiedDisclaimer: "保留意見",
  qualifiedAdverse: "保留意見",
  adverse: "否定意見",
  disclaimer: "無法表示意見",
};

/**
 * Maps dual opinion combinations to Chinese title text
 * Keys are in alphabetical order to match sorting in getDualOpinionTitleKey
 */
export const dualOpinionTitleMap: Record<DualOpinionTitleType, string> = {
  "adverse-disclaimer": "否定意見及無法表示意見",
  "adverse-qualified": "保留意見及否定意見",
  "adverse-unqualified": "無保留意見及否定意見",
  "disclaimer-qualified": "保留意見及無法表示意見",
  "disclaimer-unqualified": "無保留意見及無法表示意見",
  "qualified-unqualified": "無保留意見及保留意見",
};

/**
 * Simplifies qualified opinion variants to base "qualified" type
 */
export const getSimplifiedOpinionType = (
  opinionType: OpinionType
): OpinionType | "qualified" => {
  if (
    opinionType === "qualifiedDisclaimer" ||
    opinionType === "qualifiedAdverse"
  ) {
    return "qualified";
  }
  return opinionType;
};

/**
 * Creates dual opinion title key from two opinion types
 * Ensures consistent alphabetical ordering
 */
export const getDualOpinionTitleKey = (
  currentOpinion: OpinionType,
  comparativeOpinion: OpinionType
): DualOpinionTitleType => {
  const current = getSimplifiedOpinionType(currentOpinion);
  const comparative = getSimplifiedOpinionType(comparativeOpinion);

  // Sort to ensure consistent key ordering
  const sorted = [current, comparative].sort();
  return `${sorted[0]}-${sorted[1]}` as DualOpinionTitleType;
};

/**
 * Gets the Chinese title for opinion section
 * Supports both single opinions and dual opinion configurations
 */
export const getOpinionSectionTitle = (
  opinionConfig?: OpinionInfoForm | OpinionType | "qualified"
): string => {
  if (!opinionConfig) {
    return "[[空白的查核意見標題]]";
  }

  // Handle legacy string input (backward compatibility)
  if (typeof opinionConfig === "string") {
    return opinionSectionTitleMap[opinionConfig];
  }

  // Handle OpinionInfoForm
  if (opinionConfig.mode === "single") {
    const simplified = getSimplifiedOpinionType(
      opinionConfig.opinion.opinionType
    );
    return opinionSectionTitleMap[simplified];
  }

  // Dual mode
  const current = getSimplifiedOpinionType(
    opinionConfig.currentYearOpinion.opinionType
  );
  const comparative = getSimplifiedOpinionType(
    opinionConfig.comparativeYearOpinion.opinionType
  );

  // If both are the same, just return the single opinion title
  if (current === comparative) {
    return opinionSectionTitleMap[current];
  }

  // Otherwise get the dual opinion title
  const titleKey = getDualOpinionTitleKey(
    opinionConfig.currentYearOpinion.opinionType,
    opinionConfig.comparativeYearOpinion.opinionType
  );
  return dualOpinionTitleMap[titleKey];
};
