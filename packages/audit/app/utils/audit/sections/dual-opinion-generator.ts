import type { OpinionRenderContext, RenderOptions } from "./opinion-context";
import {
  buildIntroductionParagraph,
  buildYearOpinionSubheading,
  buildSingleYearOpinionParagraph,
  buildOpinionBasisParagraph,
  buildYearOpinionBasisSubheading,
  buildReasonParagraph,
  buildSectionTitle,
} from "./opinion-paragraph-builders";
import { getAccountingStandardText } from "./opinion-constants";

/**
 * Generates the opinion section for dual opinion mode
 */
export const generateDualOpinionSection = (
  context: OpinionRenderContext,
  options: RenderOptions
): DocumentSection => {
  if (!context.dualOpinions) {
    throw new Error("Dual opinion context required for dual mode");
  }

  const { dualOpinions } = context;

  const children: DocumentParagraph[] = [
    buildSectionTitle(dualOpinions.combinedTitle),
  ];

  // Current year section
  children.push(
    buildYearOpinionSubheading(
      dualOpinions.current.year,
      dualOpinions.current.simplifiedType,
      options
    ),
    buildIntroductionParagraph(
      context.formattedEntityName,
      dualOpinions.current.year,
      undefined, // Single year, no comparative
      false,
      context.isConsolidatedReport,
      options
    ),
    buildSingleYearOpinionParagraph(
      context.formattedEntityName,
      dualOpinions.current.year,
      context.lawDescription,
      dualOpinions.current.type,
      dualOpinions.current.simplifiedType,
      context.isConsolidatedReport,
      options
    )
  );

  // Comparative year section
  children.push(
    buildYearOpinionSubheading(
      dualOpinions.comparative.year,
      dualOpinions.comparative.simplifiedType,
      options
    ),
    buildIntroductionParagraph(
      context.formattedEntityName,
      dualOpinions.comparative.year,
      undefined, // Single year, no comparative
      false,
      context.isConsolidatedReport,
      options
    ),
    buildSingleYearOpinionParagraph(
      context.formattedEntityName,
      dualOpinions.comparative.year,
      context.lawDescription,
      dualOpinions.comparative.type,
      dualOpinions.comparative.simplifiedType,
      context.isConsolidatedReport,
      options
    )
  );

  return {
    id: "opinion",
    children,
  };
};

/**
 * Generates the opinion basis section for dual opinion mode
 * Handles both split (when disclaimer present) and combined formats
 */
export const generateDualOpinionBasisSection = (
  context: OpinionRenderContext,
  options: RenderOptions
): DocumentSection => {
  if (!context.dualOpinions) {
    throw new Error("Dual opinion context required for dual mode");
  }

  const { dualOpinions } = context;
  const accountingStandard = getAccountingStandardText(
    context.accountingFramework
  );

  const children: DocumentParagraph[] = [
    buildSectionTitle(`${dualOpinions.combinedTitle}之基礎`),
  ];

  if (dualOpinions.useSplitBasisSections) {
    // Split format (when disclaimer present) - separate sections per year

    // Current year basis
    children.push(
      buildYearOpinionBasisSubheading(
        dualOpinions.current.year,
        dualOpinions.current.simplifiedType,
        options
      )
    );

    if (dualOpinions.current.type !== "unqualified") {
      children.push(buildReasonParagraph(dualOpinions.current.reason, options));
    }

    if (dualOpinions.current.type !== "disclaimer") {
      children.push(
        buildOpinionBasisParagraph(
          context.formattedEntityName,
          dualOpinions.combinedTitle,
          accountingStandard,
          context.isConsolidatedReport,
          options
        )
      );
    }

    // Comparative year basis
    children.push(
      buildYearOpinionBasisSubheading(
        dualOpinions.comparative.year,
        dualOpinions.comparative.simplifiedType,
        options
      )
    );

    if (dualOpinions.comparative.type !== "unqualified") {
      children.push(
        buildReasonParagraph(dualOpinions.comparative.reason, options)
      );
    }

    if (dualOpinions.comparative.type !== "disclaimer") {
      children.push(
        buildOpinionBasisParagraph(
          context.formattedEntityName,
          dualOpinions.combinedTitle,
          accountingStandard,
          context.isConsolidatedReport,
          options
        )
      );
    }
  } else {
    // Combined format (no disclaimer) - reasons listed, single basis paragraph

    // Current year reason
    if (dualOpinions.current.type !== "unqualified") {
      children.push(buildReasonParagraph(dualOpinions.current.reason, options));
    }

    // Comparative year reason (with spacing if both have reasons)
    if (dualOpinions.comparative.type !== "unqualified") {
      if (dualOpinions.current.type !== "unqualified") {
        children.push({ type: "text", text: "" }); // Empty line between reasons
      }
      children.push(
        buildReasonParagraph(dualOpinions.comparative.reason, options)
      );
    }

    // Single basis paragraph
    children.push(
      buildOpinionBasisParagraph(
        context.formattedEntityName,
        dualOpinions.combinedTitle,
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
