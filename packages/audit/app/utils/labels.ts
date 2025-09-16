const opinionTypeLabelMap: Record<OpinionType, string> = {
  unqualified: "無保留意見",
  qualified: "保留意見",
  adverse: "否定意見",
  disclaimer: "無法表示意見",
};

export const getOpinionTypeLabel = (opinionType?: OpinionType): string => {
  return opinionType ? opinionTypeLabelMap[opinionType] : "[空白的查核意見]";
};

const accountingFrameworkLabelMap: Record<AccountingFramework, string> = {
  businessAccountingGuidelines: "商業會計處理準則",
  IFRS: "國際財務報導準則 (IFRS)",
};

export const getAccountingFrameworkLabel = (
  accountingFramework?: AccountingFramework
): string => {
  return accountingFramework
    ? accountingFrameworkLabelMap[accountingFramework]
    : "[空白的會計架構]";
};
