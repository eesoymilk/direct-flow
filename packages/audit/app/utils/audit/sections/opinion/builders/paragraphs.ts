import type { OpinionType } from "#shared/types/audit-report";
import type { RenderOptions } from "../context";
import { getRocYearText } from "../../helpers";
import { DISCLAIMER_OPINION_TEXT } from "../constants";
import { opinionSectionTitleMap } from "../titles";

/**
 * Helper to convert text parts to DocumentParagraph
 */
const partsToDocument = (
  parts: Array<{ text: string; color?: string; bold?: boolean }>,
  renderOptions: Partial<RenderOptions> = {}
): DocumentParagraph => {
  return renderOptions.highlightVariable
    ? { type: "children", children: parts }
    : { type: "text", text: parts.map((p) => p.text).join("") };
};

/**
 * Builds introduction paragraph ("已查核竣事")
 */
export const buildIntroductionParagraph = (
  entityName: string,
  currentYear: number,
  comparativeYear: number | undefined,
  isComparativeReport: boolean,
  isConsolidatedReport: boolean,
  renderOptions: Partial<RenderOptions> = {}
): DocumentParagraph => {
  const parts = [
    { text: entityName, color: "blue" },
    { text: getRocYearText(currentYear), color: "blue" },
    ...(isComparativeReport && comparativeYear
      ? [
          { text: "十二月三十一日及" },
          { text: getRocYearText(comparativeYear), color: "blue" },
        ]
      : []),
    { text: "十二月三十一日之" },
    ...(isConsolidatedReport ? [{ text: "合併", color: "blue" }] : []),
    { text: "資產負債表，暨" },
    { text: getRocYearText(currentYear), color: "blue" },
    ...(isComparativeReport && comparativeYear
      ? [
          { text: "一月一日至十二月三十一日及" },
          { text: getRocYearText(comparativeYear), color: "blue" },
        ]
      : []),
    { text: "一月一日至十二月三十一日之" },
    ...(isConsolidatedReport ? [{ text: "合併", color: "blue" }] : []),
    { text: "綜合損益表、" },
    ...(isConsolidatedReport ? [{ text: "合併", color: "blue" }] : []),
    { text: "權益變動表及" },
    ...(isConsolidatedReport ? [{ text: "合併", color: "blue" }] : []),
    { text: "現金流量表，以及" },
    ...(isConsolidatedReport ? [{ text: "合併", color: "blue" }] : []),
    { text: "財務報表附註（包括重大會計政策彙總），業經本會計師查核竣事。" },
  ];

  return partsToDocument(parts, renderOptions);
};

/**
 * Builds year-specific opinion subheading for dual mode
 */
export const buildYearOpinionSubheading = (
  year: number,
  opinionType: OpinionType | "qualified",
    renderOptions: Partial<RenderOptions> = {}
): DocumentParagraph => {
  const opinionText = opinionSectionTitleMap[opinionType];

  const parts = [
    { text: "對民國" },
    { text: getRocYearText(year), color: "blue" },
    { text: "年度財務報表表示" },
    { text: opinionText, color: "blue" },
  ];

  return partsToDocument(parts, renderOptions);
};

/**
 * Builds opinion statement for single year (used in dual mode)
 */
export const buildSingleYearOpinionParagraph = (
  entityName: string,
  year: number,
  lawDescription: string,
  opinionType: OpinionType,
  simplifiedType: OpinionType | "qualified",
  isConsolidatedReport: boolean,
  renderOptions: Partial<RenderOptions> = {}
): DocumentParagraph => {
  // Special handling for disclaimer opinions
  if (opinionType === "disclaimer") {
    return { type: "text", text: DISCLAIMER_OPINION_TEXT };
  }

  const parts = [
    { text: "依本會計師之意見，" },
    ...(simplifiedType !== "unqualified"
      ? [
          {
            text:
              simplifiedType === "adverse"
                ? "除否定意見之基礎段所述事項之影響外，"
                : "除保留意見之基礎段所述事項之可能影響外，",
            color: "blue",
          },
        ]
      : []),
    { text: "上開財務報表在所有重大方面係依照" },
    { text: lawDescription, color: "blue" },
    { text: "編製，" },
    {
      text: simplifiedType === "adverse" ? "未能允當表達" : "足以允當表達",
      color: simplifiedType === "adverse" ? "red" : undefined,
    },
    { text: entityName, color: "blue" },
    { text: "民國" },
    { text: getRocYearText(year), color: "blue" },
    { text: "年十二月三十一日之" },
    ...(isConsolidatedReport ? [{ text: "合併", color: "blue" }] : []),
    { text: "財務狀況，暨民國" },
    { text: getRocYearText(year), color: "blue" },
    { text: "年一月一日至十二月三十一日之" },
    ...(isConsolidatedReport ? [{ text: "合併", color: "blue" }] : []),
    { text: "財務績效及" },
    ...(isConsolidatedReport ? [{ text: "合併", color: "blue" }] : []),
    { text: "現金流量。" },
  ];

  return partsToDocument(parts, renderOptions);
};

/**
 * Builds main opinion statement paragraph (for single mode or comparative report)
 */
export const buildOpinionStatementParagraph = (
  entityName: string,
  currentYear: number,
  comparativeYear: number | undefined,
  isComparativeReport: boolean,
  isConsolidatedReport: boolean,
  lawDescription: string,
  opinionType: OpinionType,
  simplifiedType: OpinionType | "qualified",
  renderOptions: Partial<RenderOptions> = {}
): DocumentParagraph => {
  if (opinionType === "disclaimer") {
    return renderOptions.highlightVariable
      ? {
          type: "children",
          children: [{ text: DISCLAIMER_OPINION_TEXT, color: "blue" }],
        }
      : { type: "text", text: DISCLAIMER_OPINION_TEXT };
  }

  const parts = [
    { text: "依本會計師之意見，" },
    ...(opinionType !== "unqualified"
      ? [
          {
            text:
              opinionType === "adverse"
                ? "由於否定意見之基礎段所述事項之影響重大，"
                : opinionType === "qualifiedDisclaimer"
                  ? "保留意見之基礎段所述事項之影響外，"
                  : "保留意見之基礎段所述事項之可能影響外，",
            color: "blue",
          },
        ]
      : []),
    { text: entityName, color: "blue" },
    { text: getRocYearText(currentYear), color: "blue" },
    ...(isComparativeReport && comparativeYear
      ? [
          { text: "及" },
          { text: getRocYearText(comparativeYear), color: "blue" },
        ]
      : []),
    { text: "之財務報表" },
    {
      text: simplifiedType === "adverse" ? "未" : "係",
      color: "red",
    },
    { text: "依照" },
    { text: lawDescription, color: "blue" },
    { text: "編製，" },
    {
      text: simplifiedType === "adverse" ? "致無法允當表達" : "足以允當表達",
      color: "red",
    },
    { text: entityName, color: "blue" },
    { text: getRocYearText(currentYear), color: "blue" },
    ...(isComparativeReport && comparativeYear
      ? [
          { text: "十二月三十一日及" },
          { text: getRocYearText(comparativeYear), color: "blue" },
        ]
      : []),
    { text: "十二月三十一日之" },
    ...(isConsolidatedReport ? [{ text: "合併", color: "blue" }] : []),
    { text: "財務狀況，暨" },
    { text: getRocYearText(currentYear), color: "blue" },
    ...(isComparativeReport && comparativeYear
      ? [
          { text: "一月一日至十二月三十一日及" },
          { text: getRocYearText(comparativeYear), color: "blue" },
        ]
      : []),
    { text: "一月一日至十二月三十一日之" },
    ...(isConsolidatedReport ? [{ text: "合併", color: "blue" }] : []),
    { text: "財務績效及" },
    ...(isConsolidatedReport ? [{ text: "合併", color: "blue" }] : []),
    { text: "現金流量。" },
  ];

  return partsToDocument(parts, renderOptions);
};

/**
 * Builds opinion basis paragraph
 */
export const buildOpinionBasisParagraph = (
  entityName: string,
  opinionTitle: string,
  accountingStandard: string,
  isConsolidatedReport: boolean,
  renderOptions: Partial<RenderOptions> = {}
): DocumentParagraph => {
  const parts = [
    { text: "本會計師係依照" },
    { text: accountingStandard, color: "blue" },
    { text: "執行查核工作。本會計師於該等準則下之責任將於會計師查核" },
    ...(isConsolidatedReport ? [{ text: "合併", color: "blue" }] : []),
    { text: "財務報表之責任段進一步說明。本會計師所隸屬事務所受獨立性規範之人員已依會計師職業道德規範，與" },
    { text: entityName, color: "blue" },
    {
      text: "保持超然獨立，並履行該規範之其他責任。本會計師相信已取得足夠及適切之查核證據，以作為表示",
    },
    { text: opinionTitle, color: "blue" },
    { text: "之基礎。" },
  ];

  return partsToDocument(parts, renderOptions);
};

/**
 * Builds year-specific opinion basis subheading for dual mode
 */
export const buildYearOpinionBasisSubheading = (
  year: number,
  opinionType: OpinionType | "qualified",
  renderOptions: Partial<RenderOptions> = {}
): DocumentParagraph => {
  const opinionText = opinionSectionTitleMap[opinionType];

  const parts = [
    { text: "對民國" },
    { text: getRocYearText(year), color: "blue" },
    { text: `年度財務報表表示${opinionText}之基礎`, color: "blue" },
  ];

  return partsToDocument(parts, renderOptions);
};

/**
 * Builds reason paragraph (for non-unqualified opinions)
 */
export const buildReasonParagraph = (
  reason: string | undefined,
  renderOptions: Partial<RenderOptions> = {}
): DocumentParagraph => {
  const text = reason || "[[空白的理由]]";

  return renderOptions.highlightVariable
    ? { type: "children", children: [{ text, color: "blue" }] }
    : { type: "text", text };
};

/**
 * Builds section title paragraph
 */
export const buildSectionTitle = (title: string): DocumentParagraph => {
  return {
    type: "children",
    children: [{ text: title, bold: true, underline: true }],
  };
};
