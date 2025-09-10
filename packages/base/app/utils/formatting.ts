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
 * Format date with Taiwanese locale
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};