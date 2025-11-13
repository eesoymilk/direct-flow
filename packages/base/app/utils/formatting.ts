/**
 * Utility functions for formatting numbers and currency
 */

/**
 * Format a number with Taiwanese locale
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("zh-TW").format(num);
};

/**
 * Format currency with TWD
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    currencyDisplay: "code",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage with 2 decimal places
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("zh-TW", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

/**
 * Format an integer with Taiwanese locale (no decimal places)
 * Useful for share quantities and other counts
 */
export const formatInteger = (num: number): string => {
  return new Intl.NumberFormat("zh-TW", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format date with Taiwanese locale
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

/**
 * Convert Gregorian year to ROC (Republic of China) year
 */
const gregorianToRocYear = (year: number): number => year - 1911;

/**
 * Format date with ROC (Republic of China) year format
 * Uses Arabic numerals: 民國79年7月15日
 * @param date - The date to format
 * @returns Formatted date string in ROC format, or "[無效的日期]" if invalid
 */
export const formatRocDate = (date?: Date): string => {
  try {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("無效的日期");
    }

    const rocYear = gregorianToRocYear(date.getFullYear());

    if (rocYear < 0) {
      throw new Error("無效的民國年份");
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `民國${rocYear}年${month}月${day}日`;
  } catch (error) {
    console.error("formatRocDate error:", error);
    return "[無效的日期]";
  }
};