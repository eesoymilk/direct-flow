import type { AccountingFramework } from "../types/audit-report";
import { AcToRocYear } from "./date";

export const getAccountingFrameworkText = (
  framework?: AccountingFramework
): string => {
  switch (framework) {
    case "IFRS":
      return "國際財務報導準則、國際會計準則、國際財務報導解釋及解釋公告";
    case "businessAccountingGuidelines":
      return "商業會計法及商業會計處理準則中與財務會計相關之規定暨財團法人中華民國會計研究發展基金會所公開之各號企業會計準則公報及其解釋";
    default:
      return "[空白的會計架構]";
  }
};

export const getAccountingStandardText = (
  framework?: AccountingFramework
): string => {
  switch (framework) {
    case "IFRS":
      return "國際財務報導準則、國際會計準則";
    case "businessAccountingGuidelines":
      return "會計師查核簽證財務報表規則及一般公認審計準則";
    default:
      return "[空白的會計標準]";
  }
};

export const getYearStr = (
  currentYear?: number,
  comparativeYear?: number
): string => {
  const numberFormatter = new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec");
  let yearStr = currentYear
    ? `民國${numberFormatter.format(AcToRocYear(currentYear))}年`
    : "[空白的年份]";
  if (comparativeYear) {
    yearStr += `及${numberFormatter.format(AcToRocYear(comparativeYear))}年`;
  }
  return yearStr;
};

export const getFinancialStatementText = (yearStr: string): string => {
  return `${yearStr}十二月三十一日之資產負債表，暨${yearStr}一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表`;
};
