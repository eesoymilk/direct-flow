import {
  getFormattedEntityName,
  getLawDescription,
  getRocYearText,
} from "./helpers";

const getManagementResponsibilityParagraph1Parts = (
  frameworkText: string,
  isConsolidated: boolean
) => {
  return [
    {
      text: "管理階層之責任係依照",
    },
    {
      text: frameworkText,
      color: "blue",
    },
    {
      text: `編製允當表達之${isConsolidated ? "合併" : ""}財務報表，且維持與${isConsolidated ? "合併" : ""}財務報表編製有關之必要內部控制，以確保${isConsolidated ? "合併" : ""}財務報表未存有導因於舞弊或錯誤之重大不實表達。`,
    },
  ];
};

const getManagementResponsibilityParagraph2Parts = (
  entity: string,
  isConsolidated: boolean
) => {
  return [
    {
      text: `於編製${isConsolidated ? "合併" : ""}財務報表時，管理階層之責任亦包括評估`,
    },
    {
      text: entity,
      color: "blue",
    },
    {
      text: "繼續經營之能力、相關事項之揭露，以及繼續經營會計基礎之採用，除非管理階層意圖清算",
    },
    {
      text: entity,
      color: "blue",
    },
    {
      text: "或停止營業，或除清算或停業外別無實際可行之其他方案。",
    },
  ];
};

const getManagementResponsibilityParagraph3Parts = (entity: string) => [
  {
    text: entity,
    color: "blue",
  },
  {
    text: "之治理單位（含審計委員會或監察人）負有監督財務報導流程之責任。",
  },
];

const getAuditorResponsibilityParagraph2Parts = (entity: string) => [
  {
    text: "對與查核攸關之內部控制取得必要之瞭解，以設計當時情況下適當之查核程序，惟其目的非對",
  },
  {
    text: entity,
    color: "blue",
  },
  {
    text: "內部控制之有效性表示意見。",
  },
];

const getAuditorResponsibilityParagraph4Parts = (entity: string) => [
  {
    text: "依據所取得之查核證據，對管理階層採用繼續經營會計基礎之適當性，以及使",
  },
  {
    text: entity,
    color: "blue",
  },
  {
    text: "繼續經營之能力可能產生重大疑慮之事件或情況是否存在重大不確定性，作出結論。本會計師若認為該等事件或情況存在重大不確定性，則須於查核報告中提醒財務報表使用者注意財務報表之相關揭露，或於該等揭露係屬不適當時修正查核意見。本會計師之結論係以截至查核報告日所取得之查核證據為基礎。惟未來事件或情況可能導致",
  },
  {
    text: entity,
    color: "blue",
  },
  {
    text: "不再具有繼續經營之能力。",
  },
];

const getAuditorResponsibilityParagraph6Parts = (entity: string) => [
  {
    text: "對於採用權益法之被投資公司之財務資訊取得足夠及適切之查核證據，以對財務報表表示意見。本會計師負責查核案件之指導、監督及執行，並負責形成",
    color: "blue",
  },
  {
    text: entity,
    color: "dark-blue",
  },
  {
    text: "之查核意見。",
    color: "blue",
  },
];

const generateManagementResponsibilitySectionParagraphs = ({
  entity,
  isConsolidated,
  framework,
  highlightVariable,
}: {
  entity: string;
  isConsolidated: boolean;
  framework: AccountingFramework | undefined;
  highlightVariable: boolean;
}): DocumentParagraph[] => {
  const frameworkText = getLawDescription(framework);
  const isListed = framework === "IFRS"; // 上市櫃公司

  const paragraph1Parts = getManagementResponsibilityParagraph1Parts(
    frameworkText,
    isConsolidated
  );
  const paragraph2Parts = getManagementResponsibilityParagraph2Parts(
    entity,
    isConsolidated
  );

  const baseParagraphs: DocumentParagraph[] = highlightVariable
    ? [
        {
          type: "children",
          children: paragraph1Parts,
        },
        {
          type: "children",
          children: paragraph2Parts,
        },
      ]
    : [
        {
          type: "text",
          text: paragraph1Parts.map((part) => part.text).join(""),
        },
        {
          type: "text",
          text: paragraph2Parts.map((part) => part.text).join(""),
        },
      ];

  // Only add paragraph 3 for listed companies (IFRS)
  if (isListed) {
    const paragraph3Parts = getManagementResponsibilityParagraph3Parts(entity);
    baseParagraphs.push(
      highlightVariable
        ? {
            type: "children",
            children: paragraph3Parts,
          }
        : {
            type: "text",
            text: paragraph3Parts.map((part) => part.text).join(""),
          }
    );
  }

  return baseParagraphs;
};

export const generateManagementResponsibilitySection = (
  basicInfo: Partial<BasicInfoForm>,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const isListed = basicInfo.accountingFramework === "IFRS"; // 上市櫃公司
  const isConsolidated = basicInfo.isConsolidatedReport || false;
  const reportType = isConsolidated ? "合併財務報表" : "財務報表";

  // 情況一: 上市櫃公司 - "管理階層與治理單位對財務報表之責任"
  // 情況二: 上市櫃公司 合併 - "管理階層與治理單位對合併財務報表之責任"
  // 情況三: 非上市櫃公司 - "管理階層對財務報表之責任"
  const title = isListed
    ? `管理階層與治理單位對${reportType}之責任`
    : `管理階層對${reportType}之責任`;

  return {
    id: "managementResponsibility",
    children: [
      {
        type: "children",
        children: [
          {
            text: title,
            bold: true,
            underline: true,
          },
        ],
      },
      ...generateManagementResponsibilitySectionParagraphs({
        entity: getFormattedEntityName(
          basicInfo.entityName,
          basicInfo.isConsolidatedReport
        ),
        isConsolidated,
        framework: basicInfo.accountingFramework,
        highlightVariable,
      }),
    ],
  };
};

export const generateAuditorResponsibilitySection = (
  basicInfo: Partial<BasicInfoForm>,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const entity = getFormattedEntityName(
    basicInfo.entityName,
    basicInfo.isConsolidatedReport
  );
  const rocYearText = getRocYearText(basicInfo.currentRocYear);

  return {
    id: "auditorResponsibility",
    children: [
      {
        type: "children",
        children: [
          { text: "會計師查核財務報表之責任", bold: true, underline: true },
        ],
      },
      {
        type: "text",
        text: "本會計師查核財務報表之目的，係對財務報表整體是否存有導因於舞弊或錯誤之重大不實表達取得合理確信，並出具查核報告。合理確信係高度確信，惟依照審計準則執行之查核工作無法保證必能偵出財務報表存有之重大不實表達。不實表達可能導因於舞弊或錯誤。如不實表達之個別金額或彙總數可合理預期將影響財務報表使用者所作之經濟決策，則被認為具有重大性。",
      },
      {
        type: "text",
        text: "本會計師依照審計準則查核時，運用專業判斷及專業懷疑。本會計師亦執行下列工作：",
      },
      {
        type: "text",
        text: "辨認並評估財務報表導因於舞弊或錯誤之重大不實表達風險；對所評估之風險設計及執行適當之因應對策；並取得足夠及適切之查核證據以作為查核意見之基礎。因舞弊可能涉及共謀、偽造、故意遺漏、不實聲明或踰越內部控制，故未偵出導因於舞弊之重大不實表達之風險高於導因於錯誤者。",
        numbering: {
          reference: "ol",
          level: 0,
        },
      },
      highlightVariable
        ? {
            type: "children" as const,
            children: getAuditorResponsibilityParagraph2Parts(entity),
            numbering: {
              reference: "ol",
              level: 0,
            },
          }
        : {
            type: "text" as const,
            text: getAuditorResponsibilityParagraph2Parts(entity)
              .map((part) => part.text)
              .join(""),
            numbering: {
              reference: "ol",
              level: 0,
            },
          },
      {
        type: "text",
        text: "評估管理階層所採用會計政策之適當性，及其所作會計估計與相關揭露之合理性。",
        numbering: {
          reference: "ol",
          level: 0,
        },
      },
      highlightVariable
        ? {
            type: "children" as const,
            children: getAuditorResponsibilityParagraph4Parts(entity),
            numbering: {
              reference: "ol",
              level: 0,
            },
          }
        : {
            type: "text" as const,
            text: getAuditorResponsibilityParagraph4Parts(entity)
              .map((part) => part.text)
              .join(""),
            numbering: {
              reference: "ol",
              level: 0,
            },
          },
      {
        type: "text",
        text: "評估財務報表（包括相關附註）之整體表達、結構及內容，以及財務報表是否允當表達相關交易及事件。",
        numbering: {
          reference: "ol",
          level: 0,
        },
      },
      ...(basicInfo.useEquityMethodInvestment
        ? [
            highlightVariable
              ? {
                  type: "children" as const,
                  children: getAuditorResponsibilityParagraph6Parts(entity),
                  numbering: {
                    reference: "ol",
                    level: 0,
                  },
                }
              : {
                  type: "text" as const,
                  text: getAuditorResponsibilityParagraph6Parts(entity)
                    .map((part) => part.text)
                    .join(""),
                  numbering: {
                    reference: "ol",
                    level: 0,
                  },
                },
          ]
        : []),
      ...(basicInfo.isConsolidatedReport
        ? [
            {
              type: "text" as const,
              text: "對於集團內組成個體之財務資訊取得足夠及適切之查核證據，以對合併財務報表表示意見。本會計師負責集團查核案件之指導、監督及執行，並負責形成集團查核意見。",
              numbering: {
                reference: "ol",
                level: 0,
              },
            },
          ]
        : []),
      {
        type: "text",
        text: "本會計師與治理單位溝通之事項，包括所規劃之查核範圍及時間，以及重大查核發現（包括於查核過程中所辨認之內部控制顯著缺失）。",
      },
      ...(basicInfo.accountingFramework === "IFRS"
        ? [
            {
              type: "text" as const,
              text: "本會計師亦向治理單位提供本會計師所隸屬事務所受獨立性規範之人員已遵循會計師職業道德規範中有關獨立性之聲明，並與治理單位溝通所有可能被認為會影響會計師獨立性之關係及其他事項（包括相關防護措施）。",
            },
            {
              type: "text" as const,
              text: `本會計師從與治理單位溝通之事項中，決定對${entity}${rocYearText}財務報表查核之關鍵查核事項。本會計師於查核報告中敘明該等事項，除非法令不允許公開揭露特定事項，或在極罕見情況下，本會計師決定不於查核報告中溝通特定事項，因可合理預期此溝通所產生之負面影響大於所增進之公眾利益。`,
            },
          ]
        : []),
    ],
  };
};
