// Note: format and zhTW will be used when we add more sophisticated date formatting
// import { format } from 'date-fns';
// import { zhTW } from 'date-fns/locale';

/**
 * Safely converts a date to a Date object
 */
function ensureDate(date: Date | string | undefined): Date {
  if (!date) return new Date();
  if (date instanceof Date) return date;
  return new Date(date);
}

/**
 * Converts Gregorian year to ROC (Republic of China) year
 */
export function toROCYear(date: Date | string | undefined): number {
  const validDate = ensureDate(date);
  return validDate.getFullYear() - 1911;
}

/**
 * Formats a date in ROC format: 民國一○七年三月十五日
 */
export function formatROCDate(date: Date | string | undefined): string {
  const validDate = ensureDate(date);
  const rocYear = toROCYear(validDate);
  const month = validDate.getMonth() + 1;
  const day = validDate.getDate();

  // Convert to Chinese number format for years over 100
  const yearStr = rocYear >= 100 ? `一○${rocYear - 100}` : rocYear.toString();

  return `民國${yearStr}年${month}月${day}日`;
}

/**
 * Formats a date in simple ROC year format: 民國一○七年
 */
export function formatROCYear(date: Date | string | undefined): string {
  const rocYear = toROCYear(date);
  const yearStr = rocYear >= 100 ? `一○${rocYear - 100}` : rocYear.toString();
  return `民國${yearStr}年`;
}

/**
 * Formats period for balance sheet dates: 民國一○七年十二月三十一日
 */
export function formatBalanceSheetDate(
  date: Date | string | undefined
): string {
  const rocYear = toROCYear(date);
  const yearStr = rocYear >= 100 ? `一○${rocYear - 100}` : rocYear.toString();
  return `民國${yearStr}年十二月三十一日`;
}

/**
 * Formats period range for income statements: 民國一○七年一月一日至十二月三十一日
 */
export function formatIncomeStatementPeriod(
  date: Date | string | undefined
): string {
  const rocYear = toROCYear(date);
  const yearStr = rocYear >= 100 ? `一○${rocYear - 100}` : rocYear.toString();
  return `民國${yearStr}年一月一日至十二月三十一日`;
}

/**
 * Formats comparative periods for dual-year reports
 */
export function formatComparativePeriods(
  currentYear: Date | string | undefined,
  comparativeYear: Date | string | undefined
): {
  balanceSheetPeriod: string;
  incomeStatementPeriod: string;
} {
  const currentROC = toROCYear(currentYear);
  const compareROC = toROCYear(comparativeYear);

  const currentYearStr =
    currentROC >= 100 ? `一○${currentROC - 100}` : currentROC.toString();
  const compareYearStr =
    compareROC >= 100 ? `一○${compareROC - 100}` : compareROC.toString();

  return {
    balanceSheetPeriod: `民國${currentYearStr}年及${compareYearStr}年十二月三十一日`,
    incomeStatementPeriod: `民國${currentYearStr}年及${compareYearStr}年一月一日至十二月三十一日`,
  };
}

/**
 * Formats complete financial statement period description
 */
export function formatFinancialStatementPeriod(
  currentPeriodEnd: Date | string | undefined,
  comparativePeriodEnd?: Date | string | undefined
): string {
  if (comparativePeriodEnd) {
    const { balanceSheetPeriod, incomeStatementPeriod } =
      formatComparativePeriods(currentPeriodEnd, comparativePeriodEnd);
    return `${balanceSheetPeriod}之資產負債表，暨${incomeStatementPeriod}之綜合損益表、權益變動表及現金流量表`;
  } else {
    const balanceSheetDate = formatBalanceSheetDate(currentPeriodEnd);
    const incomeStatementPeriod = formatIncomeStatementPeriod(currentPeriodEnd);
    return `${balanceSheetDate}之資產負債表，暨${incomeStatementPeriod}之綜合損益表、權益變動表及現金流量表`;
  }
}

/**
 * Format numbers with Chinese thousands separators
 */
export function formatChineseNumber(amount: number): string {
  return new Intl.NumberFormat("zh-TW").format(amount);
}

/**
 * Get auditing standards text based on accounting framework
 */
export function getAuditingStandardsText(framework: string): string {
  return framework.includes("IFRS")
    ? "審計準則規定"
    : "會計師查核簽證財務報表規則及一般公認審計準則";
}
