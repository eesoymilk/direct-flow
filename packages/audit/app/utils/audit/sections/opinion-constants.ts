import type { AccountingFramework } from "#shared/types/audit-report";

/**
 * Gets the accounting standard text based on framework
 */
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

/**
 * Standard disclaimer text for disclaimer opinions
 */
export const DISCLAIMER_OPINION_TEXT =
  "本會計師對上開財務報表無法表示意見。由於無法表示意見之基礎段所述事項之可能影響重大，本會計師無法取得足夠及適切之查核證據，以作為表示查核意見之基礎。";
