/**
 * Opinion Section Generator - Orchestrator Layer
 *
 * This module serves as the main entry point for opinion section generation.
 * It delegates to specialized generators based on opinion mode (single vs dual).
 *
 * Refactored architecture:
 * - opinion-context.ts: Schema types and context builder
 * - opinion-titles.ts: Title generation utilities
 * - opinion-constants.ts: Shared constants and text
 * - opinion-paragraph-builders.ts: Reusable paragraph builders
 * - single-opinion-generator.ts: Single opinion section logic
 * - dual-opinion-generator.ts: Dual opinion section logic
 * - opinion.ts (this file): Main orchestrator
 */

import type { OpinionInfoForm } from "#shared/types/audit-report";
import type { BasicInfoForm } from "../../schemas/audit";
import { OpinionContextBuilder, type RenderOptions } from "./opinion-context";
import {
  generateSingleOpinionSection,
  generateSingleOpinionBasisSection,
} from "./single-opinion-generator";
import {
  generateDualOpinionSection,
  generateDualOpinionBasisSection,
} from "./dual-opinion-generator";

// Re-export utilities for backward compatibility
export { getOpinionSectionTitle } from "./opinion-titles";
export { getAccountingStandardText } from "./opinion-constants";

/**
 * Legacy opinion format for backward compatibility
 * @deprecated Use OpinionInfoForm with mode: "single" instead
 */
type LegacyOpinionInfo = {
  opinionType?: OpinionType;
  reason?: string;
};

/**
 * Migrates legacy opinion format to new format
 */
const migrateLegacyOpinion = (
  legacy: LegacyOpinionInfo,
  basicInfo: Partial<BasicInfoForm>
): OpinionInfoForm => {
  return {
    mode: "single",
    opinion: {
      year: basicInfo.currentRocYear || 0,
      opinionType: legacy.opinionType || "unqualified",
      reason: legacy.reason,
    },
  };
};

/**
 * Generates the opinion section
 *
 * @param basicInfo - Basic audit report information
 * @param opinionInfo - Opinion configuration (single or dual mode)
 * @param options - Rendering options
 * @returns DocumentSection for the opinion
 */
export const generateOpinionSection = (
  basicInfo: Partial<BasicInfoForm>,
  opinionInfo: OpinionInfoForm | LegacyOpinionInfo,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const renderOptions: RenderOptions = { highlightVariable };

  // Handle legacy format
  let normalizedOpinion: OpinionInfoForm;
  if ("mode" in opinionInfo && opinionInfo.mode) {
    normalizedOpinion = opinionInfo as OpinionInfoForm;
  } else {
    normalizedOpinion = migrateLegacyOpinion(
      opinionInfo as LegacyOpinionInfo,
      basicInfo
    );
  }

  // Build pre-computed context
  const context = OpinionContextBuilder.build(basicInfo, normalizedOpinion);

  // Delegate to appropriate generator
  if (context.mode === "single") {
    return generateSingleOpinionSection(context, renderOptions);
  } else {
    return generateDualOpinionSection(context, renderOptions);
  }
};

/**
 * Generates the opinion basis section
 *
 * @param basicInfo - Basic audit report information
 * @param opinionInfo - Opinion configuration (single or dual mode)
 * @param options - Rendering options
 * @returns DocumentSection for the opinion basis
 */
export const generateOpinionBasisSection = (
  basicInfo: Partial<BasicInfoForm>,
  opinionInfo: OpinionInfoForm | LegacyOpinionInfo,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const renderOptions: RenderOptions = { highlightVariable };

  // Handle legacy format
  let normalizedOpinion: OpinionInfoForm;
  if ("mode" in opinionInfo && opinionInfo.mode) {
    normalizedOpinion = opinionInfo as OpinionInfoForm;
  } else {
    normalizedOpinion = migrateLegacyOpinion(
      opinionInfo as LegacyOpinionInfo,
      basicInfo
    );
  }

  // Build pre-computed context
  const context = OpinionContextBuilder.build(basicInfo, normalizedOpinion);

  // Delegate to appropriate generator
  if (context.mode === "single") {
    return generateSingleOpinionBasisSection(context, renderOptions);
  } else {
    return generateDualOpinionBasisSection(context, renderOptions);
  }
};
