import {
  getRocYearText,
  getLawDescription,
  getFormattedEntityName,
} from "./helpers";
import type { OpinionParagraphOptions } from "./types";

const opinionSectionTitleMap: Record<OpinionType | "qualified", string> = {
  unqualified: "查核意見",
  qualified: "保留意見",
  qualifiedDisclaimer: "保留意見",
  qualifiedAdverse: "保留意見",
  adverse: "否定意見",
  disclaimer: "無法表示意見",
};

export const getOpinionSectionTitle = (
  opinionType?: OpinionType | "qualified"
): string =>
  opinionType ? opinionSectionTitleMap[opinionType] : "[[空白的查核意見標題]]";

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
      text: "之合併財務報表",
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
      text: "一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表之財務績效及現金流量。",
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
  opinionInfo: Partial<OpinionInfoForm>,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const entityLabel = getFormattedEntityName(
    basicInfo.entityName,
    basicInfo.isConsolidatedReport
  );

  return {
    id: "opinion",
    children: [
      {
        type: "children",
        children: [
          {
            text: getOpinionSectionTitle(opinionInfo.opinionType),
            bold: true,
            underline: true,
          },
        ],
      },
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
        opinionType: opinionInfo.opinionType,
        highlightVariable,
      }),
    ],
  };
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
  opinionInfo: Partial<OpinionInfoForm>,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const entityLabel = getFormattedEntityName(
    basicInfo.entityName,
    basicInfo.isConsolidatedReport
  );

  const children: DocumentParagraph[] = [];

  if (opinionInfo.opinionType !== "unqualified") {
    children.push(
      highlightVariable
        ? {
            type: "children",
            children: [
              {
                text: opinionInfo.reason || "[[空白的理由]]",
                color: "blue",
              },
            ],
          }
        : {
            type: "text",
            text: opinionInfo.reason || "[[空白的理由]]",
          }
    );
  }

  if (opinionInfo.opinionType !== "disclaimer") {
    children.push(
      generateOpinionBasisSectionParagraph({
        entity: entityLabel,
        framework: basicInfo.accountingFramework,
        opinionType: opinionInfo.opinionType,
        highlightVariable,
      })
    );
  }

  return {
    id: "opinionBasis",
    children: [
      {
        type: "children",
        children: [
          {
            text: `${getOpinionSectionTitle(opinionInfo.opinionType)}之基礎`,
            bold: true,
            underline: true,
          },
        ],
      },
      ...children,
    ],
  };
};
