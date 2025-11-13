import type {
  OpinionType,
  AccountingFramework,
} from "#shared/types/audit-report";
import type { BasicInfoForm, OpinionInfoForm } from "../../../schemas/audit";
import {
  getOpinionSectionTitle,
  getSimplifiedOpinionType,
} from "./titles";
import { getLawDescription, getFormattedEntityName } from "../helpers";

/**
 * Pre-computed context for rendering a single opinion
 */
export interface SingleOpinionContext {
  year: number;
  type: OpinionType;
  simplifiedType: OpinionType | "qualified";
  title: string;
  reason?: string;
  materialAmount?: number;
  requiresBasisReason: boolean; // type !== "unqualified"
  requiresBasisParagraph: boolean; // type !== "disclaimer"
}

/**
 * Pre-computed context for rendering dual opinions
 */
export interface DualOpinionContext {
  current: {
    year: number;
    type: OpinionType;
    simplifiedType: OpinionType | "qualified";
    reason?: string;
    materialAmount?: number;
  };
  comparative: {
    year: number;
    type: OpinionType;
    simplifiedType: OpinionType | "qualified";
    reason?: string;
    materialAmount?: number;
  };
  combinedTitle: string;
  isSameOpinion: boolean;
  hasDisclaimer: boolean;
  useSplitBasisSections: boolean; // Split when disclaimer present
}

/**
 * Complete rendering context with all pre-computed values
 */
export interface OpinionRenderContext {
  // Entity info
  entityName: string;
  formattedEntityName: string;
  isConsolidatedReport: boolean;

  // Year info
  currentYear: number;
  comparativeYear?: number;
  isComparativeReport: boolean;

  // Framework
  accountingFramework?: AccountingFramework;
  lawDescription: string;

  // Opinion mode
  mode: "single" | "dual";

  // Single mode context
  singleOpinion?: SingleOpinionContext;

  // Dual mode context
  dualOpinions?: DualOpinionContext;
}

/**
 * Rendering options for controlling output format
 */
export interface RenderOptions {
  highlightVariable: boolean;
}

/**
 * Builder for creating pre-computed opinion render context
 */
export class OpinionContextBuilder {
  static build(
    basicInfo: Partial<BasicInfoForm>,
    opinionInfo: OpinionInfoForm
  ): OpinionRenderContext {
    const formattedEntityName = getFormattedEntityName(
      basicInfo.entityName,
      basicInfo.isConsolidatedReport
    );

    const lawDescription = getLawDescription(basicInfo.accountingFramework);

    const baseContext = {
      entityName: basicInfo.entityName || "",
      formattedEntityName,
      isConsolidatedReport: basicInfo.isConsolidatedReport || false,
      currentYear: basicInfo.currentRocYear || 0,
      comparativeYear: basicInfo.isComparativeReport
        ? (basicInfo.currentRocYear || 0) - 1
        : undefined,
      isComparativeReport: basicInfo.isComparativeReport || false,
      accountingFramework: basicInfo.accountingFramework,
      lawDescription,
      mode: opinionInfo.mode,
    } as const;

    if (opinionInfo.mode === "single") {
      const { opinion } = opinionInfo;
      const simplifiedType = getSimplifiedOpinionType(opinion.opinionType);
      const title = getOpinionSectionTitle(simplifiedType);

      return {
        ...baseContext,
        singleOpinion: {
          year: opinion.year,
          type: opinion.opinionType,
          simplifiedType,
          title,
          reason: opinion.reason,
          materialAmount: opinion.materialAmount,
          requiresBasisReason: opinion.opinionType !== "unqualified",
          requiresBasisParagraph: opinion.opinionType !== "disclaimer",
        },
      };
    }

    // Dual mode
    const { currentYearOpinion, comparativeYearOpinion } = opinionInfo;

    const currentSimplified = getSimplifiedOpinionType(
      currentYearOpinion.opinionType
    );
    const comparativeSimplified = getSimplifiedOpinionType(
      comparativeYearOpinion.opinionType
    );

    const isSameOpinion = currentSimplified === comparativeSimplified;
    const hasDisclaimer =
      currentYearOpinion.opinionType === "disclaimer" ||
      comparativeYearOpinion.opinionType === "disclaimer";

    return {
      ...baseContext,
      dualOpinions: {
        current: {
          year: currentYearOpinion.year,
          type: currentYearOpinion.opinionType,
          simplifiedType: currentSimplified,
          reason: currentYearOpinion.reason,
          materialAmount: currentYearOpinion.materialAmount,
        },
        comparative: {
          year: comparativeYearOpinion.year,
          type: comparativeYearOpinion.opinionType,
          simplifiedType: comparativeSimplified,
          reason: comparativeYearOpinion.reason,
          materialAmount: comparativeYearOpinion.materialAmount,
        },
        combinedTitle: isSameOpinion
          ? getOpinionSectionTitle(currentSimplified)
          : getOpinionSectionTitle(opinionInfo),
        isSameOpinion,
        hasDisclaimer,
        useSplitBasisSections: hasDisclaimer,
      },
    };
  }
}
