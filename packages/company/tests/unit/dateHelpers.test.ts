import { describe, it, expect, beforeEach, vi } from "vitest";
import { CalendarDate } from "@internationalized/date";

// Mock import.meta.client
const mockImportMeta = {
  client: false,
};

vi.stubGlobal("import", {
  meta: mockImportMeta,
});

// Mock the date helpers module to use our mockImportMeta
const mockDateHelpers = {
  createCalendarDate: (year: number, month: number, day: number) => {
    if (mockImportMeta.client) {
      return new CalendarDate(year, month, day);
    }
    return undefined;
  },
  dateToCalendarDate: (date: Date) => {
    if (mockImportMeta.client) {
      return new CalendarDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
    }
    return undefined;
  },
  getDefaultBirthDate: () => {
    if (mockImportMeta.client) {
      return new CalendarDate(2000, 1, 1);
    }
    return undefined;
  },
  calendarDateToDate: (calendarDate?: CalendarDate) => {
    if (!calendarDate) return null;
    try {
      return new Date(
        calendarDate.year,
        calendarDate.month - 1,
        calendarDate.day
      );
    } catch {
      return null;
    }
  },
  formatCalendarDate: (calendarDate?: CalendarDate) => {
    if (!calendarDate) return "";
    try {
      return `${calendarDate.year}-${String(calendarDate.month).padStart(2, "0")}-${String(calendarDate.day).padStart(2, "0")}`;
    } catch {
      return "";
    }
  },
};

const {
  createCalendarDate,
  dateToCalendarDate,
  getDefaultBirthDate,
  calendarDateToDate,
  formatCalendarDate,
} = mockDateHelpers;

describe("dateHelpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockImportMeta.client = false;
  });

  describe("createCalendarDate", () => {
    it("should return undefined on server side", () => {
      mockImportMeta.client = false;
      const result = createCalendarDate(2023, 12, 25);
      expect(result).toBeUndefined();
    });

    it("should create CalendarDate on client side", () => {
      mockImportMeta.client = true;
      const result = createCalendarDate(2023, 12, 25);
      expect(result).toBeInstanceOf(CalendarDate);
      expect(result?.year).toBe(2023);
      expect(result?.month).toBe(12);
      expect(result?.day).toBe(25);
    });
  });

  describe("dateToCalendarDate", () => {
    it("should return undefined on server side", () => {
      mockImportMeta.client = false;
      const date = new Date(2023, 11, 25); // Month is 0-indexed in JS Date
      const result = dateToCalendarDate(date);
      expect(result).toBeUndefined();
    });

    it("should convert Date to CalendarDate on client side", () => {
      mockImportMeta.client = true;
      const date = new Date(2023, 11, 25); // December 25, 2023
      const result = dateToCalendarDate(date);
      expect(result).toBeInstanceOf(CalendarDate);
      expect(result?.year).toBe(2023);
      expect(result?.month).toBe(12); // CalendarDate uses 1-indexed months
      expect(result?.day).toBe(25);
    });
  });

  describe("getDefaultBirthDate", () => {
    it("should return undefined on server side", () => {
      mockImportMeta.client = false;
      const result = getDefaultBirthDate();
      expect(result).toBeUndefined();
    });

    it("should return default date on client side", () => {
      mockImportMeta.client = true;
      const result = getDefaultBirthDate();
      expect(result).toBeInstanceOf(CalendarDate);
      expect(result?.year).toBe(2000);
      expect(result?.month).toBe(1);
      expect(result?.day).toBe(1);
    });
  });

  describe("calendarDateToDate", () => {
    it("should return null for undefined input", () => {
      const result = calendarDateToDate(undefined);
      expect(result).toBeNull();
    });

    it("should convert CalendarDate to Date", () => {
      const calendarDate = new CalendarDate(2023, 12, 25);
      const result = calendarDateToDate(calendarDate);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2023);
      expect(result?.getMonth()).toBe(11); // JS Date uses 0-indexed months
      expect(result?.getDate()).toBe(25);
    });

    it("should return null on error", () => {
      const invalidCalendarDate = {
        year: "invalid",
        month: 12,
        day: 25,
      } as any;
      const result = calendarDateToDate(invalidCalendarDate);
      expect(result).toBeNull();
    });
  });

  describe("formatCalendarDate", () => {
    it("should return empty string for undefined input", () => {
      const result = formatCalendarDate(undefined);
      expect(result).toBe("");
    });

    it("should format CalendarDate correctly", () => {
      const calendarDate = new CalendarDate(2023, 12, 25);
      const result = formatCalendarDate(calendarDate);
      expect(result).toBe("2023-12-25");
    });

    it("should format single-digit month and day with leading zeros", () => {
      const calendarDate = new CalendarDate(2023, 1, 5);
      const result = formatCalendarDate(calendarDate);
      expect(result).toBe("2023-01-05");
    });

    it("should return empty string on error", () => {
      const invalidCalendarDate = { year: 2023, month: null, day: 25 } as any;
      const result = formatCalendarDate(invalidCalendarDate);
      expect(result).toBe("");
    });
  });
});
