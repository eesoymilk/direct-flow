import type { OpinionInfoForm, BasicInfoForm } from "../../../schemas/audit";
import { OpinionContextBuilder, type RenderOptions } from "./context";
import {
  generateSingleOpinionSection,
  generateSingleOpinionBasisSection,
} from "./generators/single";
import {
  generateDualOpinionSection,
  generateDualOpinionBasisSection,
} from "./generators/dual";

// Re-export utilities for backward compatibility
export { getOpinionSectionTitle } from "./titles";
export { getAccountingStandardText } from "./constants";

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
  opinionInfo: OpinionInfoForm,
  renderOptions: Partial<RenderOptions> = {}
): DocumentSection => {
  const context = OpinionContextBuilder.build(basicInfo, opinionInfo);

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
  opinionInfo: OpinionInfoForm,
  renderOptions: Partial<RenderOptions> = {}
): DocumentSection => {
  const context = OpinionContextBuilder.build(basicInfo, opinionInfo);

  if (context.mode === "single") {
    return generateSingleOpinionBasisSection(context, renderOptions);
  } else {
    return generateDualOpinionBasisSection(context, renderOptions);
  }
};
