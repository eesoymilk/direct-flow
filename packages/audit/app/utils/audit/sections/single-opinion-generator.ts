import type { OpinionRenderContext, RenderOptions } from "./opinion-context";
import {
  buildIntroductionParagraph,
  buildOpinionStatementParagraph,
  buildOpinionBasisParagraph,
  buildReasonParagraph,
  buildSectionTitle,
} from "./opinion-paragraph-builders";
import { getAccountingStandardText } from "./opinion-constants";

/**
 * Generates the opinion section for single opinion mode
 */
export const generateSingleOpinionSection = (
  context: OpinionRenderContext,
  options: RenderOptions
): DocumentSection => {
  if (!context.singleOpinion) {
    throw new Error("Single opinion context required for single mode");
  }

  const { singleOpinion } = context;

  const children: DocumentParagraph[] = [
    buildSectionTitle(singleOpinion.title),
    buildIntroductionParagraph(
      context.formattedEntityName,
      context.currentYear,
      context.comparativeYear,
      context.isComparativeReport,
      context.isConsolidatedReport,
      options
    ),
    buildOpinionStatementParagraph(
      context.formattedEntityName,
      context.currentYear,
      context.comparativeYear,
      context.isComparativeReport,
      context.isConsolidatedReport,
      context.lawDescription,
      singleOpinion.type,
      singleOpinion.simplifiedType,
      options
    ),
  ];

  return {
    id: "opinion",
    children,
  };
};

/**
 * Generates the opinion basis section for single opinion mode
 */
export const generateSingleOpinionBasisSection = (
  context: OpinionRenderContext,
  options: RenderOptions
): DocumentSection => {
  if (!context.singleOpinion) {
    throw new Error("Single opinion context required for single mode");
  }

  const { singleOpinion } = context;

  const children: DocumentParagraph[] = [
    buildSectionTitle(`${singleOpinion.title}之基礎`),
  ];

  // Add reason paragraph if non-unqualified
  if (singleOpinion.requiresBasisReason) {
    children.push(buildReasonParagraph(singleOpinion.reason, options));
  }

  // Add basis paragraph if not disclaimer
  if (singleOpinion.requiresBasisParagraph) {
    const accountingStandard = getAccountingStandardText(
      context.accountingFramework
    );

    children.push(
      buildOpinionBasisParagraph(
        context.formattedEntityName,
        singleOpinion.title,
        accountingStandard,
        context.isConsolidatedReport,
        options
      )
    );
  }

  return {
    id: "opinionBasis",
    children,
  };
};
