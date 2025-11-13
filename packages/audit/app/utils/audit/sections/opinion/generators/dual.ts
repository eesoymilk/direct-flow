import type { OpinionRenderContext, RenderOptions } from "../context";
import {
  buildIntroductionParagraph,
  buildYearOpinionSubheading,
  buildSingleYearOpinionParagraph,
  buildOpinionBasisParagraph,
  buildYearOpinionBasisSubheading,
  buildReasonParagraph,
  buildSectionTitle,
} from "../builders/paragraphs";
import { getAccountingStandardText } from "../constants";

/**
 * Generates the opinion section for dual opinion mode
 */
export const generateDualOpinionSection = (
  context: OpinionRenderContext,
  renderOptions: Partial<RenderOptions> = {}
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
      renderOptions
    ),
    buildIntroductionParagraph(
      context.formattedEntityName,
      dualOpinions.current.year,
      undefined, // Single year, no comparative
      false,
      context.isConsolidatedReport,
      renderOptions
    ),
    buildSingleYearOpinionParagraph(
      context.formattedEntityName,
      dualOpinions.current.year,
      context.lawDescription,
      dualOpinions.current.type,
      dualOpinions.current.simplifiedType,
      context.isConsolidatedReport,
        renderOptions
    )
  );

  // Comparative year section
  children.push(
    buildYearOpinionSubheading(
      dualOpinions.comparative.year,
      dualOpinions.comparative.simplifiedType,
      renderOptions
    ),
    buildIntroductionParagraph(
      context.formattedEntityName,
      dualOpinions.comparative.year,
      undefined, // Single year, no comparative
      false,
      context.isConsolidatedReport,
      renderOptions
    ),
    buildSingleYearOpinionParagraph(
      context.formattedEntityName,
      dualOpinions.comparative.year,
      context.lawDescription,
      dualOpinions.comparative.type,
      dualOpinions.comparative.simplifiedType,
      context.isConsolidatedReport,
      renderOptions
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
  renderOptions: Partial<RenderOptions> = {}
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
        renderOptions
      )
    );

    if (dualOpinions.current.type !== "unqualified") {
      children.push(buildReasonParagraph(dualOpinions.current.reason, renderOptions));
    }

    if (dualOpinions.current.type !== "disclaimer") {
      children.push(
        buildOpinionBasisParagraph(
          context.formattedEntityName,
          dualOpinions.combinedTitle,
          accountingStandard,
          context.isConsolidatedReport,
          renderOptions
        )
      );
    }

    // Comparative year basis
    children.push(
      buildYearOpinionBasisSubheading(
        dualOpinions.comparative.year,
        dualOpinions.comparative.simplifiedType,
        renderOptions
      )
    );

    if (dualOpinions.comparative.type !== "unqualified") {
      children.push(
          buildReasonParagraph(dualOpinions.comparative.reason, renderOptions)
      );
    }

    if (dualOpinions.comparative.type !== "disclaimer") {
      children.push(
        buildOpinionBasisParagraph(
          context.formattedEntityName,
          dualOpinions.combinedTitle,
          accountingStandard,
          context.isConsolidatedReport,
          renderOptions
        )
      );
    }
  } else {
    // Combined format (no disclaimer) - reasons listed, single basis paragraph

    // Current year reason
    if (dualOpinions.current.type !== "unqualified") {
      children.push(buildReasonParagraph(dualOpinions.current.reason, renderOptions));
    }

    // Comparative year reason (with spacing if both have reasons)
    if (dualOpinions.comparative.type !== "unqualified") {
      if (dualOpinions.current.type !== "unqualified") {
        children.push({ type: "text", text: "" }); // Empty line between reasons
      }
      children.push(
        buildReasonParagraph(dualOpinions.comparative.reason, renderOptions)
      );
    }

    // Single basis paragraph
    children.push(
      buildOpinionBasisParagraph(
        context.formattedEntityName,
        dualOpinions.combinedTitle,
        accountingStandard,
        context.isConsolidatedReport,
        renderOptions
      )
    );
  }

  return {
    id: "opinionBasis",
    children,
  };
};
