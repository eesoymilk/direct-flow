import type { RenderOptions } from "../context";
import { getRocYearText } from "../../helpers";

/**
 * Text part with optional formatting
 */
export type TextPart = {
  text: string;
  color?: string;
  bold?: boolean;
};

/**
 * Helper to convert text parts to DocumentParagraph
 */
export const partsToDocument = (
  parts: TextPart[],
  options: RenderOptions
): DocumentParagraph => {
  return options.highlightVariable
    ? { type: "children", children: parts }
    : { type: "text", text: parts.map((p) => p.text).join("") };
};

/**
 * Conditionally insert text parts based on a condition
 * Replaces the repetitive `...(condition ? [...] : [])` pattern
 */
export const insertIf = (
  condition: boolean | undefined,
  parts: TextPart | TextPart[]
): TextPart[] => {
  if (!condition) return [];
  return Array.isArray(parts) ? parts : [parts];
};

/**
 * Insert year text with ROC formatting
 */
export const yearText = (year: number | undefined): TextPart | null => {
  if (!year) return null;
  return { text: getRocYearText(year), color: "blue" };
};

/**
 * Insert comparative year text with connecting phrase
 */
export const comparativeYearText = (
  comparativeYear: number | undefined,
  connector: string = "及"
): TextPart[] => {
  if (!comparativeYear) return [];
  return [
    { text: connector },
    { text: getRocYearText(comparativeYear), color: "blue" },
  ];
};

/**
 * Insert "合併" text if consolidated report
 */
export const consolidatedText = (
  isConsolidated: boolean
): TextPart[] => {
  return insertIf(isConsolidated, { text: "合併", color: "blue" });
};

/**
 * Build entity name and year range text
 */
export const entityWithYears = (
  entityName: string,
  currentYear: number,
  comparativeYear: number | undefined,
  isComparativeReport: boolean
): TextPart[] => {
  return [
    { text: entityName, color: "blue" },
    { text: getRocYearText(currentYear), color: "blue" },
    ...insertIf(
      !!(isComparativeReport && comparativeYear),
      comparativeYearText(comparativeYear)
    ),
  ];
};
