import { formatRocDate } from "./date";
import { joinSentences } from "./paragraph";

interface OpinionParagraphOptions {
  entity: string;
  rocYearText: string;
  framework?: AccountingFramework;
  opinionType?: OpinionType;
}

const opinionSectionTitleMap: Record<OpinionType, string> = {
  unqualified: "查核意見",
  qualified: "保留意見",
  adverse: "否定意見",
  disclaimer: "無法表示意見",
};

export const getOpinionSectionTitle = (opinionType?: OpinionType): string =>
  opinionType ? opinionSectionTitleMap[opinionType] : "[[空白的查核意見標題]]";

export const getLawDescription = (framework?: AccountingFramework): string => {
  switch (framework) {
    case "IFRS":
      return "國際財務報導準則、國際會計準則、國際財務報導解釋及解釋公告";
    case "businessAccountingGuidelines":
      return "商業會計法及商業會計處理準則中與財務會計相關之規定暨財團法人中華民國會計研究發展基金會所公開之各號企業會計準則公報及其解釋";
    default:
      return "[[空白的會計架構]]";
  }
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

export const getRocYearsText = (
  currentRocYear?: number,
  comparativeRocYear?: number
): string => {
  const numberFormatter = new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec");
  let rocYearsText = currentRocYear
    ? `民國${numberFormatter.format(currentRocYear)}年`
    : "民國[[空白的年份]]年";
  if (comparativeRocYear) {
    rocYearsText += `及${numberFormatter.format(comparativeRocYear)}年`;
  }
  return rocYearsText;
};

const generateOpinionSectionParagraph1 = ({
  entity,
  rocYearText,
}: Pick<OpinionParagraphOptions, "entity" | "rocYearText">) =>
  joinSentences([
    [
      `${entity}${rocYearText}十二月三十一日之資產負債表`,
      `暨${rocYearText}一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表`,
      `以及財務報表附註（包括重大會計政策彙總）`,
      `業經本會計師查核竣事`,
    ],
  ]);

const generateOpinionSectionParagraph2 = ({
  entity,
  rocYearText,
  framework,
  opinionType,
}: Pick<
  OpinionParagraphOptions,
  "entity" | "rocYearText" | "framework" | "opinionType"
>) => {
  // 空白的查核意見
  if (!opinionType) {
    return "[[空白的查核意見]]";
  }

  // 無法表示意見
  if (opinionType === "disclaimer") {
    return "本會計師對上開財務報表無法表示意見。由於無法表示意見之基礎段所述事項之可能影響重大，本會計師無法取得足夠及適切之查核證據，以作為表示查核意見之基礎。";
  }

  const lawDescription = getLawDescription(framework);

  // 否定意見
  if (opinionType === "adverse") {
    return joinSentences([
      [
        "依本會計師之意見",
        "由於否定意見之基礎段所述事項之影響重大",
        `${entity}${rocYearText}之合併財務報表未依照${lawDescription}編製`,
        `致無法允當表達${entity}${rocYearText}十二月三十一日之合併財務狀況`,
        `暨${rocYearText}一月一日至十二月三十一日之合併財務績效及合併現金流量`,
      ],
    ]);
  }

  const sentences = [
    `依本會計師之意見`,
    `上開財務報表在所有重大方面係依照${lawDescription}編製`,
    `${entity}${rocYearText}之財務狀況`,
    `暨${rocYearText}一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表之財務績效及現金流量`,
    lawDescription,
  ];

  if (opinionType === "qualified") {
    sentences.splice(1, 0, "除保留意見之基礎段所述事項之影響外");
  }

  // 無保留意見、保留意見
  return joinSentences([sentences]);
};

export const generateOpinionSection = (
  basicInfo: Partial<AuditBasicInfo>,
  opinionInfo: Partial<AuditOpinionInfo>
): DocumentSection => {
  const entityLabel = basicInfo.entityName || "[[空白的受查者名稱]]";
  const rocYearsText = getRocYearsText(
    basicInfo.currentRocYear,
    basicInfo.comparativeRocYear
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
      {
        type: "text",
        text: generateOpinionSectionParagraph1({
          entity: entityLabel,
          rocYearText: rocYearsText,
        }),
      },
      {
        type: "text",
        text: generateOpinionSectionParagraph2({
          entity: entityLabel,
          rocYearText: rocYearsText,
          framework: basicInfo.accountingFramework,
          opinionType: opinionInfo.opinionType,
        }),
      },
    ],
  };
};

const generateOpinionBasisSectionParagraph = ({
  entity,
  framework,
  opinionType,
}: Pick<
  OpinionParagraphOptions,
  "entity" | "rocYearText" | "framework" | "opinionType"
>) =>
  joinSentences([
    [`本會計師係依照${getAccountingStandardText(framework)}執行查核工作`],
    ["本會計師於該等準則下之責任將於會計師查核財務報表之責任段進一步說明"],
    [
      "本會計師所隸屬事務所受獨立性規範之人員已依會計師職業道德規範",
      `與${entity}保持超然獨立`,
      "並履行該規範之其他責任",
    ],
    [
      `本會計師相信已取得足夠及適切之查核證據，以作為表示${getOpinionSectionTitle(opinionType)}之基礎`,
    ],
  ]);

export const generateOpinionBasisSection = (
  basicInfo: Partial<AuditBasicInfo>,
  opinionInfo: Partial<AuditOpinionInfo>
): DocumentSection => {
  const entityLabel = basicInfo.entityName || "[[空白的受查者名稱]]";
  const rocYearsText = getRocYearsText(
    basicInfo.currentRocYear,
    basicInfo.comparativeRocYear
  );

  const children: DocumentParagraph[] = [];

  if (opinionInfo.opinionType !== "unqualified") {
    children.push({
      type: "text",
      text: opinionInfo.reason || "[[空白的理由]]",
    });
  }

  if (opinionInfo.opinionType !== "disclaimer") {
    children.push({
      type: "text",
      text: generateOpinionBasisSectionParagraph({
        entity: entityLabel,
        rocYearText: rocYearsText,
        framework: basicInfo.accountingFramework,
        opinionType: opinionInfo.opinionType,
      }),
    });
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

const generateOtherMatterSectionParagraph = ({
  entity,
  rocYearText,
  matterType,
  previousAuditReportDate,
}: Pick<OpinionParagraphOptions, "entity" | "rocYearText"> & {
  matterType?: OtherMatterType;
  previousAuditReportDate?: Date;
}) => {
  if (!matterType) {
    return "[[空白的其他事項段]]";
  }

  if (matterType === "previousReportHandledByOtherAuditor") {
    const reportDateText = previousAuditReportDate
      ? formatRocDate(previousAuditReportDate)
      : "[[空白日期]]";
    return `${entity}${rocYearText}年度之財務報表係由其他會計師查核，並於${reportDateText}出具查核意見。`;
  }
  return `${entity}${rocYearText}年度之財務報表，並未經會計師查核，其附列之目的僅供參考。`;
};

export const generateOtherMatterSection = (
  basicInfo: Partial<AuditBasicInfo>,
  opinionInfo: Partial<AuditOpinionInfo>
): DocumentSection => ({
  id: "otherMatter",
  children: [
    {
      type: "children",
      children: [
        {
          text: "其他事項段",
          bold: true,
          underline: true,
        },
      ],
    },
    {
      type: "text",
      text: generateOtherMatterSectionParagraph({
        entity: basicInfo.entityName || "[[空白的受查者名稱]]",
        rocYearText: getRocYearsText(
          basicInfo.currentRocYear,
          basicInfo.comparativeRocYear
        ),
        matterType: opinionInfo.otherMatterOption?.type,
        previousAuditReportDate:
          opinionInfo.otherMatterOption?.previousAuditReportDate,
      }),
    },
  ],
});

const generateManagementResponsibilitySectionParagraphs = ({
  entity,
  rocYearText,
  framework,
}: Pick<
  OpinionParagraphOptions,
  "entity" | "rocYearText" | "framework"
>): DocumentParagraph[] => {
  const frameworkText = getLawDescription(framework);

  return [
    {
      type: "text",
      text: joinSentences([
        [
          `管理階層之責任係依照${frameworkText}製允當表達之財務報表`,
          "且維持與財務報表編製有關之必要內部控制",
          `以確保財務報表未存有導因於舞弊或錯誤之重大不實表達。`,
        ],
      ]),
    },
    {
      type: "text",
      text: joinSentences([
        [
          `於編製財務報表時`,
          `管理階層之責任亦包括評估${entity}${rocYearText}繼續經營之能力、相關事項之揭露`,
          `以及繼續經營會計基礎之採用`,
          `除非管理階層意圖清算${entity}${rocYearText}或停止營業`,
          `或除清算或停業外別無實際可行之其他方案。`,
        ],
      ]),
    },
    {
      type: "text",
      text: joinSentences([
        [
          `${entity}之治理單位（含審計委員會或監察人）負有監督財務報導流程之責任`,
        ],
      ]),
    },
  ];
};

export const generateManagementResponsibilitySection = (
  basicInfo: Partial<AuditBasicInfo>
): DocumentSection => ({
  id: "managementResponsibility",
  children: [
    {
      type: "children",
      children: [
        {
          text: "管理階層對財務報表之責任",
          bold: true,
          underline: true,
        },
      ],
    },
    ...generateManagementResponsibilitySectionParagraphs({
      entity: basicInfo.entityName || "[[空白的受查者名稱]]",
      rocYearText: getRocYearsText(
        basicInfo.currentRocYear,
        basicInfo.comparativeRocYear
      ),
      framework: basicInfo.accountingFramework,
    }),
  ],
});
