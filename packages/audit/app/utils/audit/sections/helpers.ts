import type { AccountingFramework } from "#shared/types/audit-report";

export const getRocYearText = (rocYear?: number): string => {
  const numberFormatter = new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec");
  const rocYearsText = rocYear
    ? `民國${numberFormatter.format(rocYear)}年`
    : "民國[[空白的年份]]年";
  return rocYearsText;
};

export const getLawDescription = (framework?: AccountingFramework): string => {
  switch (framework) {
    case "IFRS":
      return "國際財務報導準則、國際會計準則、解釋及解釋公告";
    case "businessAccountingGuidelines":
      return "商業會計法及商業會計處理準則中與財務會計相關之規定暨財團法人中華民國會計研究發展基金會所公開之各號企業會計準則公報及其解釋";
    default:
      return "[[空白的會計架構]]";
  }
};

export const getFormattedEntityName = (
  entityName?: string,
  isConsolidatedReport?: boolean
): string => {
  const baseEntityName = entityName || "[[空白的受查者名稱]]";
  if (isConsolidatedReport) {
    return `${baseEntityName}及其子公司（甲集團）`;
  }
  return baseEntityName;
};
