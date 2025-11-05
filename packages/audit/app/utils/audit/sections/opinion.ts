import {
  getRocYearText,
  getLawDescription,
  getFormattedEntityName,
} from "./helpers";
import type { OpinionParagraphOptions } from "./types";
import type {
  DualOpinionTitleType,
  OpinionInfoForm,
} from "#shared/types/audit-report";

// Legacy opinion format for backward compatibility
type LegacyOpinionInfo = {
  opinionType?: OpinionType;
  reason?: string;
};

const opinionSectionTitleMap: Record<OpinionType | "qualified", string> = {
  unqualified: "無保留意見",
  qualified: "保留意見",
  qualifiedDisclaimer: "保留意見",
  qualifiedAdverse: "保留意見",
  adverse: "否定意見",
  disclaimer: "無法表示意見",
};

// Dual opinion title combinations (keys in alphabetical order to match sorting)
const dualOpinionTitleMap: Record<DualOpinionTitleType, string> = {
  "adverse-disclaimer": "否定意見及無法表示意見",
  "adverse-qualified": "保留意見及否定意見",
  "adverse-unqualified": "無保留意見及否定意見",
  "disclaimer-qualified": "保留意見及無法表示意見",
  "disclaimer-unqualified": "無保留意見及無法表示意見",
  "qualified-unqualified": "無保留意見及保留意見",
};

// Get simplified opinion type (maps qualified-* to 'qualified')
const getSimplifiedOpinionType = (
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

// Get dual opinion title key
const getDualOpinionTitleKey = (
  currentOpinion: OpinionType,
  comparativeOpinion: OpinionType
): DualOpinionTitleType => {
  const current = getSimplifiedOpinionType(currentOpinion);
  const comparative = getSimplifiedOpinionType(comparativeOpinion);

  // Sort to ensure consistent key ordering
  const sorted = [current, comparative].sort();
  return `${sorted[0]}-${sorted[1]}` as DualOpinionTitleType;
};

// Enhanced title generator supporting both single and dual opinions
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
  return dualOpinionTitleMap[titleKey as DualOpinionTitleType];
};

export const getAccountingStandardText = (
  framework?: AccountingFramework
): string => {
  switch (framework) {
    case "IFRS":
      return "審計準則規定";
    case "businessAccountingGuidelines":
      return "會計師查核簽證財務報表規則及審計準則";
    default:
      return "[[空白的會計標準]]";
  }
};

// Generate year-specific opinion sub-heading for dual opinion mode
const generateYearOpinionSubheading = (
  year: number,
  opinionType: OpinionType,
  highlightVariable: boolean
): DocumentParagraph => {
  const simplified = getSimplifiedOpinionType(opinionType);
  const opinionText = opinionSectionTitleMap[simplified];

  const parts = [
    { text: "對民國" },
    { text: getRocYearText(year), color: "blue" },
    { text: "年度財務報表表示" },
    { text: opinionText, color: "blue" },
  ];

  return highlightVariable
    ? { type: "children", children: parts }
    : { type: "text", text: parts.map((p) => p.text).join("") };
};

// Generate single-year opinion paragraph (for dual mode)
const generateSingleYearOpinionParagraph = ({
  entity,
  year,
  framework,
  opinionType,
  highlightVariable,
}: {
  entity: string;
  year: number;
  framework?: AccountingFramework;
  opinionType: OpinionType;
  highlightVariable: boolean;
}): DocumentParagraph => {
  // Special handling for disclaimer opinions
  if (opinionType === "disclaimer") {
    return {
      type: "text",
      text: "本會計師對上開財務報表無法表示意見。由於無法表示意見之基礎段所述事項之可能影響重大，本會計師無法取得足夠及適切之查核證據，以作為表示查核意見之基礎。",
    };
  }

  const lawDescription = getLawDescription(framework);
  const simplified = getSimplifiedOpinionType(opinionType);

  const parts = [
    { text: "依本會計師之意見，" },
    ...(simplified !== "unqualified"
      ? [
          {
            text:
              simplified === "adverse"
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
      text: simplified === "adverse" ? "未能允當表達" : "足以允當表達",
      color: simplified === "adverse" ? "red" : undefined,
    },
    { text: entity, color: "blue" },
    { text: "民國" },
    { text: getRocYearText(year), color: "blue" },
    { text: "年十二月三十一日之財務狀況，暨民國" },
    { text: getRocYearText(year), color: "blue" },
    { text: "年一月一日至十二月三十一日之財務績效及現金流量。" },
  ];

  return highlightVariable
    ? { type: "children", children: parts }
    : { type: "text", text: parts.map((p) => p.text).join("") };
};

const generateOpinionSectionParagraph1 = ({
  entity,
  currentRocYear,
  isComparativeReport,
  highlightVariable,
}: Pick<
  OpinionParagraphOptions,
  "entity" | "currentRocYear" | "isComparativeReport" | "highlightVariable"
>): DocumentParagraph => {
  const parts = [
    {
      text: entity,
      color: "blue",
    },
    {
      text: getRocYearText(currentRocYear),
      color: "blue",
    },
    ...(isComparativeReport
      ? [
          {
            text: "十二月三十一日及",
          },
          {
            text: getRocYearText(
              currentRocYear ? currentRocYear - 1 : undefined
            ),
            color: "blue",
          },
        ]
      : []),
    {
      text: "十二月三十一日之資產負債表，暨",
    },
    {
      text: getRocYearText(currentRocYear),
      color: "blue",
    },
    ...(isComparativeReport
      ? [
          {
            text: "一月一日至十二月三十一日及",
          },
          {
            text: getRocYearText(
              currentRocYear ? currentRocYear - 1 : undefined
            ),
            color: "blue",
          },
        ]
      : []),
    {
      text: "一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表，以及財務報表附註（包括重大會計政策彙總），業經本會計師查核竣事。",
    },
  ];

  return highlightVariable
    ? {
        type: "children",
        children: parts,
      }
    : {
        type: "text",
        text: parts.map((part) => part.text).join(""),
      };
};

const getOpinionSectionParagraph2Parts = ({
  entity,
  currentRocYear,
  isComparativeReport,
  framework,
  opinionType,
}: Pick<
  OpinionParagraphOptions,
  | "entity"
  | "currentRocYear"
  | "isComparativeReport"
  | "framework"
  | "opinionType"
>) => {
  if (!opinionType) {
    return [
      {
        text: "[[空白的查核意見]]",
        color: "gray",
      },
    ];
  }

  if (opinionType === "disclaimer") {
    return [
      {
        text: "本會計師對上開財務報表無法表示意見。由於無法表示意見之基礎段所述事項之可能影響重大，本會計師無法取得足夠及適切之查核證據，以作為表示查核意見之基礎。",
        color: "blue",
      },
    ];
  }

  const lawDescription = getLawDescription(framework);

  return [
    {
      text: "依本會計師之意見，",
    },
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
    {
      text: entity,
      color: "blue",
    },
    {
      text: getRocYearText(currentRocYear),
      color: "blue",
    },
    ...(isComparativeReport
      ? [
          {
            text: "及",
          },
          {
            text: getRocYearText(
              currentRocYear ? currentRocYear - 1 : undefined
            ),
            color: "blue",
          },
        ]
      : []),
    {
      text: "之財務報表",
    },
    {
      text: opinionType === "adverse" ? "未" : "係",
      color: "red",
    },
    {
      text: "依照",
    },
    {
      text: lawDescription,
      color: "blue",
    },
    {
      text: "編製，",
    },
    {
      text: opinionType === "adverse" ? "致無法允當表達" : "足以允當表達",
      color: "red",
    },
    {
      text: entity,
      color: "blue",
    },
    {
      text: getRocYearText(currentRocYear),
      color: "blue",
    },
    ...(isComparativeReport
      ? [
          {
            text: "十二月三十一日及",
          },
          {
            text: getRocYearText(
              currentRocYear ? currentRocYear - 1 : undefined
            ),
            color: "blue",
          },
        ]
      : []),
    {
      text: "十二月三十一日之合併財務狀況，暨",
    },
    {
      text: getRocYearText(currentRocYear),
      color: "blue",
    },
    ...(isComparativeReport
      ? [
          {
            text: "一月一日至十二月三十一日及",
          },
          {
            text: getRocYearText(
              currentRocYear ? currentRocYear - 1 : undefined
            ),
            color: "blue",
          },
        ]
      : []),
    {
      text: "一月一日至十二月三十一日之財務績效及現金流量。",
    },
  ];
};

const generateOpinionSectionParagraph2 = ({
  entity,
  currentRocYear,
  isComparativeReport,
  framework,
  opinionType,
  highlightVariable,
}: Pick<
  OpinionParagraphOptions,
  | "entity"
  | "currentRocYear"
  | "isComparativeReport"
  | "framework"
  | "opinionType"
  | "highlightVariable"
>): DocumentParagraph => {
  const parts = getOpinionSectionParagraph2Parts({
    entity,
    currentRocYear,
    isComparativeReport,
    framework,
    opinionType,
  });

  return highlightVariable
    ? {
        type: "children",
        children: parts,
      }
    : {
        type: "text",
        text: parts.map((part) => part.text).join(""),
      };
};

export const generateOpinionSection = (
  basicInfo: Partial<BasicInfoForm>,
  opinionInfo: OpinionInfoForm | LegacyOpinionInfo,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const entityLabel = getFormattedEntityName(
    basicInfo.entityName,
    basicInfo.isConsolidatedReport
  );

  const children: DocumentParagraph[] = [
    {
      type: "children",
      children: [
        {
          text:
            "mode" in opinionInfo
              ? getOpinionSectionTitle(opinionInfo as OpinionInfoForm)
              : getOpinionSectionTitle(
                  (opinionInfo as LegacyOpinionInfo).opinionType
                ),
          bold: true,
          underline: true,
        },
      ],
    },
  ];

  // Check if using OpinionInfoForm format
  if ("mode" in opinionInfo && opinionInfo.mode) {
    if (opinionInfo.mode === "single") {
      // Single opinion mode
      children.push(
        generateOpinionSectionParagraph1({
          entity: entityLabel,
          currentRocYear: basicInfo.currentRocYear,
          isComparativeReport: basicInfo.isComparativeReport,
          highlightVariable,
        }),
        generateOpinionSectionParagraph2({
          entity: entityLabel,
          currentRocYear: basicInfo.currentRocYear,
          isComparativeReport: basicInfo.isComparativeReport,
          framework: basicInfo.accountingFramework,
          opinionType: opinionInfo.opinion.opinionType,
          highlightVariable,
        })
      );
    } else if (opinionInfo.mode === "dual") {
      // Dual opinion mode - explicitly type narrow
      const dualOpinion = opinionInfo as Extract<
        OpinionInfoForm,
        { mode: "dual" }
      >;
      const { currentYearOpinion, comparativeYearOpinion } = dualOpinion;

      // Current year sub-heading
      children.push(
        generateYearOpinionSubheading(
          currentYearOpinion.year,
          currentYearOpinion.opinionType,
          highlightVariable
        )
      );

      // Current year intro paragraph (year-specific)
      children.push(
        generateOpinionSectionParagraph1({
          entity: entityLabel,
          currentRocYear: currentYearOpinion.year,
          isComparativeReport: false,
          highlightVariable,
        })
      );

      // Current year opinion paragraph
      children.push(
        generateSingleYearOpinionParagraph({
          entity: entityLabel,
          year: currentYearOpinion.year,
          framework: basicInfo.accountingFramework,
          opinionType: currentYearOpinion.opinionType,
          highlightVariable,
        })
      );

      // Comparative year sub-heading
      children.push(
        generateYearOpinionSubheading(
          comparativeYearOpinion.year,
          comparativeYearOpinion.opinionType,
          highlightVariable
        )
      );

      // Comparative year intro paragraph (year-specific)
      children.push(
        generateOpinionSectionParagraph1({
          entity: entityLabel,
          currentRocYear: comparativeYearOpinion.year,
          isComparativeReport: false,
          highlightVariable,
        })
      );

      // Comparative year opinion paragraph
      children.push(
        generateSingleYearOpinionParagraph({
          entity: entityLabel,
          year: comparativeYearOpinion.year,
          framework: basicInfo.accountingFramework,
          opinionType: comparativeYearOpinion.opinionType,
          highlightVariable,
        })
      );
    }
  } else {
    // Legacy format (backward compatibility)
    const legacyOpinionInfo = opinionInfo as LegacyOpinionInfo;
    children.push(
      generateOpinionSectionParagraph1({
        entity: entityLabel,
        currentRocYear: basicInfo.currentRocYear,
        isComparativeReport: basicInfo.isComparativeReport,
        highlightVariable,
      }),
      generateOpinionSectionParagraph2({
        entity: entityLabel,
        currentRocYear: basicInfo.currentRocYear,
        isComparativeReport: basicInfo.isComparativeReport,
        framework: basicInfo.accountingFramework,
        opinionType: legacyOpinionInfo.opinionType,
        highlightVariable,
      })
    );
  }

  return {
    id: "opinion",
    children,
  };
};

// Generate year-specific opinion basis sub-heading for dual opinion mode
const generateYearOpinionBasisSubheading = (
  year: number,
  opinionType: OpinionType,
  highlightVariable: boolean
): DocumentParagraph => {
  const simplified = getSimplifiedOpinionType(opinionType);
  const opinionText = opinionSectionTitleMap[simplified];

  const parts = [
    { text: "對民國" },
    { text: getRocYearText(year), color: "blue" },
    { text: `年度財務報表表示${opinionText}之基礎`, color: "blue" },
  ];

  return highlightVariable
    ? { type: "children", children: parts }
    : { type: "text", text: parts.map((p) => p.text).join("") };
};

const generateOpinionBasisSectionParagraph = ({
  entity,
  framework,
  opinionType,
  highlightVariable,
}: Pick<
  OpinionParagraphOptions,
  "entity" | "framework" | "opinionType" | "highlightVariable"
>): DocumentParagraph => {
  const parts = [
    {
      text: "本會計師係依照",
    },
    {
      text: getAccountingStandardText(framework),
      color: "blue",
    },
    {
      text: "執行查核工作。本會計師於該等準則下之責任將於會計師查核財務報表之責任段進一步說明。本會計師所隸屬事務所受獨立性規範之人員已依會計師職業道德規範，與",
    },
    {
      text: entity,
      color: "blue",
    },
    {
      text: "保持超然獨立，並履行該規範之其他責任。本會計師相信已取得足夠及適切之查核證據，以作為表示",
    },
    {
      text: getOpinionSectionTitle(opinionType),
      color: "blue",
    },
    {
      text: "之基礎。",
    },
  ];

  return highlightVariable
    ? {
        type: "children",
        children: parts,
      }
    : {
        type: "text",
        text: parts.map((part) => part.text).join(""),
      };
};

export const generateOpinionBasisSection = (
  basicInfo: Partial<BasicInfoForm>,
  opinionInfo: OpinionInfoForm | LegacyOpinionInfo,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const entityLabel = getFormattedEntityName(
    basicInfo.entityName,
    basicInfo.isConsolidatedReport
  );

  const children: DocumentParagraph[] = [
    {
      type: "children",
      children: [
        {
          text: `${"mode" in opinionInfo ? getOpinionSectionTitle(opinionInfo as OpinionInfoForm) : getOpinionSectionTitle((opinionInfo as LegacyOpinionInfo).opinionType)}之基礎`,
          bold: true,
          underline: true,
        },
      ],
    },
  ];

  // Check if using OpinionInfoForm format
  if ("mode" in opinionInfo && opinionInfo.mode) {
    if (opinionInfo.mode === "single") {
      // Single opinion mode
      const singleOpinion = opinionInfo as Extract<
        OpinionInfoForm,
        { mode: "single" }
      >;
      if (singleOpinion.opinion.opinionType !== "unqualified") {
        children.push(
          highlightVariable
            ? {
                type: "children",
                children: [
                  {
                    text: singleOpinion.opinion.reason || "[[空白的理由]]",
                    color: "blue",
                  },
                ],
              }
            : {
                type: "text",
                text: singleOpinion.opinion.reason || "[[空白的理由]]",
              }
        );
      }

      if (singleOpinion.opinion.opinionType !== "disclaimer") {
        children.push(
          generateOpinionBasisSectionParagraph({
            entity: entityLabel,
            framework: basicInfo.accountingFramework,
            opinionType: singleOpinion.opinion.opinionType,
            highlightVariable,
          })
        );
      }
    } else if (opinionInfo.mode === "dual") {
      // Dual opinion mode - explicitly type the configuration
      const dualConfig = opinionInfo as Extract<
        OpinionInfoForm,
        { mode: "dual" }
      >;

      // Check if we need split sections
      const hasDisclaimer =
        dualConfig.currentYearOpinion.opinionType === "disclaimer" ||
        dualConfig.comparativeYearOpinion.opinionType === "disclaimer";

      if (hasDisclaimer) {
        // Split into separate sub-sections for each year (per example 2)

        // Current year basis
        children.push(
          generateYearOpinionBasisSubheading(
            dualConfig.currentYearOpinion.year,
            dualConfig.currentYearOpinion.opinionType,
            highlightVariable
          )
        );

        if (dualConfig.currentYearOpinion.opinionType !== "unqualified") {
          children.push(
            highlightVariable
              ? {
                  type: "children",
                  children: [
                    {
                      text:
                        dualConfig.currentYearOpinion.reason ||
                        "[[空白的理由]]",
                      color: "blue",
                    },
                  ],
                }
              : {
                  type: "text",
                  text:
                    dualConfig.currentYearOpinion.reason || "[[空白的理由]]",
                }
          );
        }

        if (dualConfig.currentYearOpinion.opinionType !== "disclaimer") {
          children.push(
            generateOpinionBasisSectionParagraph({
              entity: entityLabel,
              framework: basicInfo.accountingFramework,
              opinionType: dualConfig.currentYearOpinion.opinionType,
              highlightVariable,
            })
          );
        }

        // Comparative year basis
        children.push(
          generateYearOpinionBasisSubheading(
            dualConfig.comparativeYearOpinion.year,
            dualConfig.comparativeYearOpinion.opinionType,
            highlightVariable
          )
        );

        if (dualConfig.comparativeYearOpinion.opinionType !== "unqualified") {
          children.push(
            highlightVariable
              ? {
                  type: "children",
                  children: [
                    {
                      text:
                        dualConfig.comparativeYearOpinion.reason ||
                        "[[空白的理由]]",
                      color: "blue",
                    },
                  ],
                }
              : {
                  type: "text",
                  text:
                    dualConfig.comparativeYearOpinion.reason ||
                    "[[空白的理由]]",
                }
          );
        }

        if (dualConfig.comparativeYearOpinion.opinionType !== "disclaimer") {
          children.push(
            generateOpinionBasisSectionParagraph({
              entity: entityLabel,
              framework: basicInfo.accountingFramework,
              opinionType: dualConfig.comparativeYearOpinion.opinionType,
              highlightVariable,
            })
          );
        }
      } else {
        // No disclaimer - use combined format (per example 1)
        // Add reasons for both years if non-unqualified
        if (dualConfig.currentYearOpinion.opinionType !== "unqualified") {
          children.push(
            highlightVariable
              ? {
                  type: "children",
                  children: [
                    {
                      text:
                        dualConfig.currentYearOpinion.reason ||
                        "[[空白的理由]]",
                      color: "blue",
                    },
                  ],
                }
              : {
                  type: "text",
                  text:
                    dualConfig.currentYearOpinion.reason || "[[空白的理由]]",
                }
          );
        }

        if (dualConfig.comparativeYearOpinion.opinionType !== "unqualified") {
          if (dualConfig.currentYearOpinion.opinionType !== "unqualified") {
            // Add spacing between reasons
            children.push({ type: "text", text: "" });
          }
          children.push(
            highlightVariable
              ? {
                  type: "children",
                  children: [
                    {
                      text:
                        dualConfig.comparativeYearOpinion.reason ||
                        "[[空白的理由]]",
                      color: "blue",
                    },
                  ],
                }
              : {
                  type: "text",
                  text:
                    dualConfig.comparativeYearOpinion.reason ||
                    "[[空白的理由]]",
                }
          );
        }

        // Add single basis paragraph
        children.push(
          generateOpinionBasisSectionParagraph({
            entity: entityLabel,
            framework: basicInfo.accountingFramework,
            opinionType: dualConfig.currentYearOpinion.opinionType,
            highlightVariable,
          })
        );
      }
    }
  } else {
    // Legacy format (backward compatibility)
    const legacyOpinionInfo = opinionInfo as LegacyOpinionInfo;

    if (legacyOpinionInfo.opinionType !== "unqualified") {
      children.push(
        highlightVariable
          ? {
              type: "children",
              children: [
                {
                  text: legacyOpinionInfo.reason || "[[空白的理由]]",
                  color: "blue",
                },
              ],
            }
          : {
              type: "text",
              text: legacyOpinionInfo.reason || "[[空白的理由]]",
            }
      );
    }

    if (legacyOpinionInfo.opinionType !== "disclaimer") {
      children.push(
        generateOpinionBasisSectionParagraph({
          entity: entityLabel,
          framework: basicInfo.accountingFramework,
          opinionType: legacyOpinionInfo.opinionType,
          highlightVariable,
        })
      );
    }
  }

  return {
    id: "opinionBasis",
    children,
  };
};
