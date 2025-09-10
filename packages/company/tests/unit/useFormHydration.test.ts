import { describe, it, expect, beforeEach, vi } from "vitest";
import { CalendarDate } from "@internationalized/date";

// Mock import.meta.client
const mockImportMeta = {
  client: false,
};

vi.stubGlobal("import", {
  meta: mockImportMeta,
});

// Mock the getDefaultBirthDate function
vi.mock("~/utils/dateHelpers", () => ({
  getDefaultBirthDate: vi.fn(() => {
    if (mockImportMeta.client) {
      return new CalendarDate(2000, 1, 1);
    }
    return undefined;
  }),
}));

// Import the composable after mocking
const { useFormHydration } = await import("~/composables/useFormHydration");

describe("useFormHydration", () => {
  let formHydration: ReturnType<typeof useFormHydration>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockImportMeta.client = false;
    formHydration = useFormHydration();
  });

  describe("initializeShareholderDates", () => {
    it("should not initialize dates on server side", () => {
      mockImportMeta.client = false;

      const shareholders = [
        { name: "王小明", dateOfBirth: undefined },
        { name: "李小華", dateOfBirth: undefined },
      ];

      formHydration.initializeShareholderDates(shareholders);

      expect(shareholders[0].dateOfBirth).toBeUndefined();
      expect(shareholders[1].dateOfBirth).toBeUndefined();
    });

    it("should initialize dates on client side for shareholders with names but no dates", () => {
      mockImportMeta.client = true;

      const shareholders = [
        { name: "王小明", dateOfBirth: undefined },
        { name: "李小華", dateOfBirth: undefined },
        { name: "", dateOfBirth: undefined }, // Should be skipped - no name
      ];

      formHydration.initializeShareholderDates(shareholders);

      expect(shareholders[0].dateOfBirth).toBeInstanceOf(CalendarDate);
      expect(shareholders[1].dateOfBirth).toBeInstanceOf(CalendarDate);
      expect(shareholders[2].dateOfBirth).toBeUndefined(); // No name, should be skipped
    });

    it("should not overwrite existing dates", () => {
      mockImportMeta.client = true;

      const existingDate = new CalendarDate(1990, 5, 15);
      const shareholders = [
        { name: "王小明", dateOfBirth: existingDate },
        { name: "李小華", dateOfBirth: undefined },
      ];

      formHydration.initializeShareholderDates(shareholders);

      expect(shareholders[0].dateOfBirth).toBe(existingDate); // Should not change
      expect(shareholders[1].dateOfBirth).toBeInstanceOf(CalendarDate); // Should be initialized
    });

    it("should handle empty shareholders array", () => {
      mockImportMeta.client = true;

      const shareholders: any[] = [];

      expect(() => {
        formHydration.initializeShareholderDates(shareholders);
      }).not.toThrow();
    });
  });

  describe("hydrateFormDates", () => {
    it("should not hydrate dates on server side", () => {
      mockImportMeta.client = false;

      const form = {
        shareholders: [{ name: "王小明", dateOfBirth: undefined }],
        responsiblePerson: { name: "負責人", dateOfBirth: undefined },
        director: { name: "董事", dateOfBirth: undefined },
        contactPerson: { name: "聯絡人", dateOfBirth: undefined },
      };

      formHydration.hydrateFormDates(form);

      expect(form.shareholders[0].dateOfBirth).toBeUndefined();
      expect(form.responsiblePerson.dateOfBirth).toBeUndefined();
      expect(form.director.dateOfBirth).toBeUndefined();
      expect(form.contactPerson.dateOfBirth).toBeUndefined();
    });

    it("should hydrate all form dates on client side", () => {
      mockImportMeta.client = true;

      const form = {
        shareholders: [
          { name: "王小明", dateOfBirth: undefined },
          { name: "李小華", dateOfBirth: undefined },
        ],
        responsiblePerson: { name: "負責人", dateOfBirth: undefined },
        director: { name: "董事", dateOfBirth: undefined },
        contactPerson: { name: "聯絡人", dateOfBirth: undefined },
      };

      formHydration.hydrateFormDates(form);

      expect(form.shareholders[0].dateOfBirth).toBeInstanceOf(CalendarDate);
      expect(form.shareholders[1].dateOfBirth).toBeInstanceOf(CalendarDate);
      expect(form.responsiblePerson.dateOfBirth).toBeInstanceOf(CalendarDate);
      expect(form.director.dateOfBirth).toBeInstanceOf(CalendarDate);
      expect(form.contactPerson.dateOfBirth).toBeInstanceOf(CalendarDate);
    });

    it("should handle form without shareholders", () => {
      mockImportMeta.client = true;

      const form = {
        responsiblePerson: { name: "負責人", dateOfBirth: undefined },
        director: { name: "董事", dateOfBirth: undefined },
        contactPerson: { name: "聯絡人", dateOfBirth: undefined },
      };

      expect(() => {
        formHydration.hydrateFormDates(form);
      }).not.toThrow();

      expect(form.responsiblePerson.dateOfBirth).toBeInstanceOf(CalendarDate);
    });

    it("should handle form with null shareholders", () => {
      mockImportMeta.client = true;

      const form = {
        shareholders: null,
        responsiblePerson: { name: "負責人", dateOfBirth: undefined },
      };

      expect(() => {
        formHydration.hydrateFormDates(form);
      }).not.toThrow();

      expect(form.responsiblePerson.dateOfBirth).toBeInstanceOf(CalendarDate);
    });

    it("should handle missing person fields gracefully", () => {
      mockImportMeta.client = true;

      const form = {
        shareholders: [{ name: "王小明", dateOfBirth: undefined }],
        responsiblePerson: { name: "負責人", dateOfBirth: undefined },
        // Missing director and contactPerson
      };

      expect(() => {
        formHydration.hydrateFormDates(form);
      }).not.toThrow();

      expect(form.shareholders[0].dateOfBirth).toBeInstanceOf(CalendarDate);
      expect(form.responsiblePerson.dateOfBirth).toBeInstanceOf(CalendarDate);
    });
  });

  describe("validateFormDates", () => {
    it("should validate that shareholders with names have valid dates", () => {
      const form = {
        shareholders: [
          { name: "王小明", dateOfBirth: new CalendarDate(1990, 5, 15) },
          { name: "李小華", dateOfBirth: new CalendarDate(1985, 10, 20) },
          { name: "", dateOfBirth: undefined }, // No name, should be valid
        ],
      };

      const result = formHydration.validateFormDates(form);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing dates for shareholders with names", () => {
      const form = {
        shareholders: [
          { name: "王小明", dateOfBirth: undefined }, // Invalid - has name but no date
          { name: "李小華", dateOfBirth: new CalendarDate(1985, 10, 20) },
          { name: "", dateOfBirth: undefined }, // Valid - no name
        ],
      };

      const result = formHydration.validateFormDates(form);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("股東 1 需要設定出生日期");
    });

    it("should detect invalid date formats", () => {
      const form = {
        shareholders: [
          { name: "王小明", dateOfBirth: "invalid-date" }, // Invalid format
          { name: "李小華", dateOfBirth: new CalendarDate(1985, 10, 20) },
        ],
      };

      const result = formHydration.validateFormDates(form);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("股東 1 的出生日期格式錯誤");
    });

    it("should handle multiple validation errors", () => {
      const form = {
        shareholders: [
          { name: "王小明", dateOfBirth: undefined }, // Missing date
          { name: "李小華", dateOfBirth: "invalid" }, // Invalid format
          { name: "張小美", dateOfBirth: undefined }, // Missing date
        ],
      };

      const result = formHydration.validateFormDates(form);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors[0]).toContain("股東 1 需要設定出生日期");
      expect(result.errors[1]).toContain("股東 2 的出生日期格式錯誤");
      expect(result.errors[2]).toContain("股東 3 需要設定出生日期");
    });

    it("should handle form without shareholders", () => {
      const form = {};

      const result = formHydration.validateFormDates(form);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should handle form with empty shareholders array", () => {
      const form = {
        shareholders: [],
      };

      const result = formHydration.validateFormDates(form);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should handle form with null shareholders", () => {
      const form = {
        shareholders: null,
      };

      const result = formHydration.validateFormDates(form);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("SSR Compatibility", () => {
    it("should be safe to call on server side", () => {
      mockImportMeta.client = false;

      const form = {
        shareholders: [{ name: "王小明", dateOfBirth: undefined }],
        responsiblePerson: { name: "負責人", dateOfBirth: undefined },
      };

      // Should not throw on server side
      expect(() => {
        formHydration.hydrateFormDates(form);
        formHydration.initializeShareholderDates(form.shareholders);
        formHydration.validateFormDates(form);
      }).not.toThrow();

      // Dates should remain undefined on server side
      expect(form.shareholders[0].dateOfBirth).toBeUndefined();
      expect(form.responsiblePerson.dateOfBirth).toBeUndefined();
    });

    it("should work correctly after client hydration", () => {
      // Start on server side
      mockImportMeta.client = false;

      const form = {
        shareholders: [{ name: "王小明", dateOfBirth: undefined }],
        responsiblePerson: { name: "負責人", dateOfBirth: undefined },
      };

      // Server-side call should not initialize dates
      formHydration.hydrateFormDates(form);
      expect(form.shareholders[0].dateOfBirth).toBeUndefined();

      // Simulate client-side hydration
      mockImportMeta.client = true;
      formHydration.hydrateFormDates(form);

      expect(form.shareholders[0].dateOfBirth).toBeInstanceOf(CalendarDate);
      expect(form.responsiblePerson.dateOfBirth).toBeInstanceOf(CalendarDate);
    });
  });
});
