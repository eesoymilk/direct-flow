/**
 * Composable for ROC (Republic of China) calendar date conversion and formatting
 * ROC calendar year = Gregorian year - 1911
 */

/**
 * Convert Gregorian year to ROC year
 * @param year - Gregorian year (e.g., 2024)
 * @returns ROC year (e.g., 113)
 */
export const gregorianToRocYear = (year: number): number => year - 1911;

/**
 * Convert ROC year to Gregorian year
 * @param rocYear - ROC year (e.g., 113)
 * @returns Gregorian year (e.g., 2024)
 */
export const rocToGregorianYear = (rocYear: number): number => rocYear + 1911;

/**
 * Format a Date object to ROC format string
 * @param date - Date to format
 * @returns Formatted string in "YYY/MM/DD" format (e.g., "113/05/15")
 */
export const formatToRocString = (
  date: Date | null | undefined
): string => {
  if (!date) return "";

  const rocYear = gregorianToRocYear(date.getFullYear());
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${rocYear}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
};

/**
 * Parse ROC format string to Date object
 * Supports formats: YYY/MM/DD, YYY/M/D, YYY-MM-DD, etc.
 * @param value - ROC format string (e.g., "113/05/15" or "113/5/15")
 * @returns Parsed Date object or null if invalid
 */
export const parseRocString = (value: string): Date | null => {
  if (!value) return null;

  // Support formats: YYY/MM/DD, YYY/M/D, or variations with - separator
  const match = value.match(/^(\d{2,3})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);

  if (!match || !match[1] || !match[2] || !match[3]) return null;

  const rocYear = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  // Validate ranges
  if (rocYear < 0 || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const gregorianYear = rocToGregorianYear(rocYear);
  const date = new Date(gregorianYear, month - 1, day);

  // Validate that the date is valid (handles invalid dates like Feb 31)
  if (
    date.getFullYear() !== gregorianYear ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

/**
 * Composable for ROC date operations
 * Provides reactive utilities for ROC calendar formatting
 */
export const useRocDate = () => {
  /**
   * Format date function for PrimeVue DatePicker
   * Can be passed to DatePicker's format-date prop
   */
  const formatDate = (date: Date): string => {
    return formatToRocString(date);
  };

  /**
   * Parse date function for PrimeVue DatePicker
   * Can be passed to DatePicker's parse-date prop
   */
  const parseDate = (text: string): Date | null => {
    return parseRocString(text);
  };

  return {
    gregorianToRocYear,
    rocToGregorianYear,
    formatToRocString,
    parseRocString,
    formatDate,
    parseDate,
  };
};
