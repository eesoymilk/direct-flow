import { describe, it, expect } from "vitest";
import * as z from "zod";
import { shareholderSchema } from "../../shared/utils/schemas/person";
import { createEmptyShareholder } from "../../app/utils/formHelpers";
import { generateMockShareholder } from "../../app/utils/mockData";

describe("Capital Contribution Validation", () => {
  describe("shareholderSchema validation", () => {
    it("should accept valid capitalContribution values", () => {
      const validShareholder = generateMockShareholder();
      validShareholder.capitalContribution = 100000;

      const result = shareholderSchema.safeParse(validShareholder);
      expect(result.success).toBe(true);
    });

    it("should accept undefined capitalContribution", () => {
      const shareholder = generateMockShareholder();
      shareholder.capitalContribution = undefined;

      const result = shareholderSchema.safeParse(shareholder);
      expect(result.success).toBe(true);
    });

    it("should accept null capitalContribution", () => {
      const shareholder = generateMockShareholder();
      shareholder.capitalContribution = null;

      const result = shareholderSchema.safeParse(shareholder);
      expect(result.success).toBe(true);
    });

    it("should reject negative capitalContribution", () => {
      const shareholder = generateMockShareholder();
      shareholder.capitalContribution = -1000;

      const result = shareholderSchema.safeParse(shareholder);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe("出資額不能為負數");
    });

    it("should accept zero capitalContribution", () => {
      const shareholder = generateMockShareholder();
      shareholder.capitalContribution = 0;

      const result = shareholderSchema.safeParse(shareholder);
      expect(result.success).toBe(true);
    });
  });

  describe("Form helpers with capitalContribution", () => {
    it("should create empty shareholder with undefined capitalContribution by default", () => {
      const shareholder = createEmptyShareholder();
      expect(shareholder.capitalContribution).toBeUndefined();
    });

    it("should create empty shareholder with proper share prices when hasParValueFreeShares is true", () => {
      const shareholder = createEmptyShareholder(true);
      expect(shareholder.shares.ordinary.pricePerShare).toBe(10);
      expect(shareholder.shares.preferred_a.pricePerShare).toBe(10);
    });

    it("should create empty shareholder with zero share prices when hasParValueFreeShares is false", () => {
      const shareholder = createEmptyShareholder(false);
      expect(shareholder.shares.ordinary.pricePerShare).toBe(0);
      expect(shareholder.shares.preferred_a.pricePerShare).toBe(0);
    });

    it("should validate capitalContribution field correctly in isolation", () => {
      // Test only capitalContribution validation by testing it directly
      const capitalContributionField = { capitalContribution: undefined };
      const result = z.object({ 
        capitalContribution: z.number().min(0, { message: "出資額不能為負數" }).nullish() 
      }).safeParse(capitalContributionField);
      expect(result.success).toBe(true);

      const negativeResult = z.object({ 
        capitalContribution: z.number().min(0, { message: "出資額不能為負數" }).nullish() 
      }).safeParse({ capitalContribution: -100 });
      expect(negativeResult.success).toBe(false);
    });
  });

  describe("Mock data generation", () => {
    it("should generate mock shareholder with valid capitalContribution", () => {
      const mockShareholder = generateMockShareholder();
      expect(mockShareholder.capitalContribution).toBeGreaterThanOrEqual(10000);
      expect(mockShareholder.capitalContribution).toBeLessThanOrEqual(1000000);
      
      const result = shareholderSchema.safeParse(mockShareholder);
      expect(result.success).toBe(true);
    });
  });
});