const opinionTypeLabelMap: Record<OpinionType, string> = {
  unqualified: "無保留意見",
  qualifiedDisclaimer: "保留意見",
  qualifiedAdverse: "保留意見",
  adverse: "否定意見",
  disclaimer: "無法表示意見",
};

export const getOpinionTypeLabel = (opinionType?: OpinionType): string =>
  opinionType ? opinionTypeLabelMap[opinionType] : "[空白的查核意見]";

const opinionTypeDescriptionMap: Record<OpinionType, string> = {
  unqualified: "財報無缺失且證據充足",
  qualifiedDisclaimer: "無法取得足夠及適切的證據",
  qualifiedAdverse: "不實表達",
  adverse: "重大不實表達",
  disclaimer: "重大無法取得足夠及適切的證據",
};

export const getOpinionTypeDescription = (opinionType?: OpinionType): string =>
  opinionType ? opinionTypeDescriptionMap[opinionType] : "[空白的查核意見]";

const accountingFrameworkLabelMap: Record<AccountingFramework, string> = {
  businessAccountingGuidelines: "商業會計處理準則",
  IFRS: "國際財務報導準則 (IFRS)",
};

export const getAccountingFrameworkLabel = (
  accountingFramework?: AccountingFramework
): string =>
  accountingFramework
    ? accountingFrameworkLabelMap[accountingFramework]
    : "[空白的會計架構]";
