/**
 * Date helper utilities for SSR-safe date handling
 */

import { CalendarDate } from "@internationalized/date";

// Create CalendarDate safely (only on client side)
export const createCalendarDate = (year: number, month: number, day: number): CalendarDate | undefined => {
  // Only create CalendarDate on client side to avoid SSR issues
  if (import.meta.client) {
    return new CalendarDate(year, month, day);
  }
  return undefined;
};

// Convert Date to CalendarDate safely
export const dateToCalendarDate = (date: Date): CalendarDate | undefined => {
  if (import.meta.client) {
    return new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  }
  return undefined;
};

// Get default birth date for forms
export const getDefaultBirthDate = (): CalendarDate | undefined => {
  return createCalendarDate(2000, 1, 1);
};

// Convert CalendarDate to Date (safe for both client and server)
export const calendarDateToDate = (calendarDate: CalendarDate | undefined): Date | null => {
  if (!calendarDate) return null;
  
  try {
    return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
  } catch {
    return null;
  }
};

// Format CalendarDate for display
export const formatCalendarDate = (calendarDate: CalendarDate | undefined): string => {
  if (!calendarDate) return '';
  
  try {
    return `${calendarDate.year}-${String(calendarDate.month).padStart(2, '0')}-${String(calendarDate.day).padStart(2, '0')}`;
  } catch {
    return '';
  }
};