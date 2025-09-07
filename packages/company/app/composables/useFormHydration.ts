/**
 * Composable to handle form hydration for SSR-safe form data
 * Ensures CalendarDate objects are properly initialized on the client side
 */

import { CalendarDate } from "@internationalized/date";
import { getDefaultBirthDate } from "~/utils/dateHelpers";

export const useFormHydration = () => {
  // Initialize default dates for shareholder forms
  const initializeShareholderDates = (shareholders: any[]) => {
    if (!import.meta.client) return;

    shareholders.forEach(shareholder => {
      if (!shareholder.dateOfBirth && shareholder.name) {
        // Set default date for existing shareholders without dates
        shareholder.dateOfBirth = getDefaultBirthDate();
      }
    });
  };

  // Initialize all form dates after hydration
  const hydrateFormDates = (form: any) => {
    if (!import.meta.client) return;

    // Initialize shareholder dates
    if (form.shareholders && Array.isArray(form.shareholders)) {
      initializeShareholderDates(form.shareholders);
    }

    // Initialize person dates if needed (usually not required for person forms)
    const personFields = ['responsiblePerson', 'director', 'contactPerson'];
    personFields.forEach(field => {
      if (form[field] && !form[field].dateOfBirth && form[field].name) {
        form[field].dateOfBirth = getDefaultBirthDate();
      }
    });
  };

  // Validate that CalendarDate objects are properly set
  const validateFormDates = (form: any) => {
    const errors: string[] = [];

    if (form.shareholders && Array.isArray(form.shareholders)) {
      form.shareholders.forEach((shareholder: any, index: number) => {
        if (shareholder.name && !shareholder.dateOfBirth) {
          errors.push(`股東 ${index + 1} 需要設定出生日期`);
        } else if (shareholder.dateOfBirth && !(shareholder.dateOfBirth instanceof CalendarDate)) {
          errors.push(`股東 ${index + 1} 的出生日期格式錯誤`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  return {
    initializeShareholderDates,
    hydrateFormDates,
    validateFormDates,
  };
};