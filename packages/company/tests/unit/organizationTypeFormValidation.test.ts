import { describe, it, expect, beforeEach } from "vitest";
import { companyApplicationFormSchema, companyApplicationBaseSchema } from "../../shared/utils/schemas/companyApplication";
import type { CompanyApplicationFormSchema } from "../../shared/utils/schemas/companyApplication";

describe("Organization Type Form Validation", () => {
  let baseFormData: Partial<CompanyApplicationFormSchema>;

  beforeEach(() => {
    baseFormData = {
      candidateNames: ["測試公司"],
      businessItemsDescription: "軟體開發",
      address: "台北市信義區",
      capitalAmount: 1000000,
      isRepresentativeSameAsResponsiblePerson: false,
      isContactPersonSameAsResponsiblePerson: false,
      isContactPersonSameAsRepresentative: false,
    };
  });

  describe("Corporation (股份有限公司)", () => {
    it("should validate corporation with all required fields", () => {
      const corporationData = {
        ...baseFormData,
        organizationType: "corporation" as const,
        parValue: 10,
        totalShares: 100000,
        isCloselyHeld: false,
        hasParValueFreeShares: false,
        // Shared fields
        isForeignInvestment: false,
        isChineseInvestment: true,
        // Corporation-specific fields
        isPublicOffering: true,
        hasMultipleVotingRightsPreferredShares: false,
        hasVetoRightsPreferredShares: true,
        hasPreferredSharesBoardRights: false,
      };

      const result = companyApplicationFormSchema.safeParse(corporationData);
      expect(result.success).toBe(true);
    });

    it("should require closelyHeldShareholderCount when isCloselyHeld is true", () => {
      const corporationData = {
        ...baseFormData,
        organizationType: "corporation" as const,
        parValue: 10,
        totalShares: 100000,
        isCloselyHeld: true,
        hasParValueFreeShares: false,
        // Missing closelyHeldShareholderCount
      };

      const result = companyApplicationFormSchema.safeParse(corporationData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["closelyHeldShareholderCount"],
            message: "閉鎖性股份有限公司必須填寫股東人數",
          })
        );
      }
    });

    it("should validate closelyHeldShareholderCount when isCloselyHeld is true", () => {
      const corporationData = {
        ...baseFormData,
        organizationType: "corporation" as const,
        parValue: 10,
        totalShares: 100000,
        isCloselyHeld: true,
        hasParValueFreeShares: false,
        closelyHeldShareholderCount: 25,
      };

      const result = companyApplicationFormSchema.safeParse(corporationData);
      expect(result.success).toBe(true);
    });

    it("should require parValue when hasParValueFreeShares is false", () => {
      const corporationData = {
        ...baseFormData,
        organizationType: "corporation" as const,
        totalShares: 100000,
        isCloselyHeld: false,
        hasParValueFreeShares: false,
        // Missing parValue
      };

      const result = companyApplicationFormSchema.safeParse(corporationData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["parValue"],
            message: "票面金額為必填（除非選擇無票面金額）",
          })
        );
      }
    });

    it("should not require parValue when hasParValueFreeShares is true", () => {
      const corporationData = {
        ...baseFormData,
        organizationType: "corporation" as const,
        totalShares: 100000,
        isCloselyHeld: false,
        hasParValueFreeShares: true,
        // No parValue provided
      };

      const result = companyApplicationFormSchema.safeParse(corporationData);
      expect(result.success).toBe(true);
    });

    it("should allow all corporation-specific boolean fields", () => {
      const corporationData = {
        ...baseFormData,
        organizationType: "corporation" as const,
        parValue: 10,
        totalShares: 100000,
        isCloselyHeld: false,
        hasParValueFreeShares: false,
        isForeignInvestment: true,
        isChineseInvestment: true,
        isPublicOffering: true,
        hasMultipleVotingRightsPreferredShares: true,
        hasVetoRightsPreferredShares: true,
        hasPreferredSharesBoardRights: true,
        // Limited company field should be ignored/false
        isSoleProprietorshipLLC: false,
      };

      const result = companyApplicationFormSchema.safeParse(corporationData);
      expect(result.success).toBe(true);
    });
  });

  describe("Limited Company (有限公司)", () => {
    it("should validate limited company with required fields", () => {
      const limitedCompanyData = {
        ...baseFormData,
        organizationType: "limited_company" as const,
        // Shared fields
        isForeignInvestment: true,
        isChineseInvestment: false,
        // Limited company-specific field
        isSoleProprietorshipLLC: true,
        // Corporation fields should not be present
        isCloselyHeld: false,
        hasParValueFreeShares: false,
        isPublicOffering: false,
        hasMultipleVotingRightsPreferredShares: false,
        hasVetoRightsPreferredShares: false,
        hasPreferredSharesBoardRights: false,
      };

      const result = companyApplicationFormSchema.safeParse(limitedCompanyData);
      expect(result.success).toBe(true);
    });

    it("should reject parValue and totalShares for limited company", () => {
      const limitedCompanyData = {
        ...baseFormData,
        organizationType: "limited_company" as const,
        parValue: 10, // Should not be allowed
        totalShares: 100000, // Should not be allowed
        isSoleProprietorshipLLC: false,
      };

      const result = companyApplicationFormSchema.safeParse(limitedCompanyData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["organizationType"],
            message: "有限公司不需要票面金額和股份總數",
          })
        );
      }
    });

    it("should validate limited company without share-related fields", () => {
      const limitedCompanyData = {
        ...baseFormData,
        organizationType: "limited_company" as const,
        isForeignInvestment: false,
        isChineseInvestment: true,
        isSoleProprietorshipLLC: true,
        // No parValue, totalShares, or corporation-specific fields
      };

      const result = companyApplicationFormSchema.safeParse(limitedCompanyData);
      expect(result.success).toBe(true);
    });
  });

  describe("Shared Fields Validation", () => {
    it("should allow shared fields for both corporation and limited company", () => {
      // Test corporation
      const corporationData = {
        ...baseFormData,
        organizationType: "corporation" as const,
        parValue: 10,
        totalShares: 100000,
        isCloselyHeld: false,
        hasParValueFreeShares: false,
        isForeignInvestment: true,
        isChineseInvestment: true,
      };

      const corporationResult = companyApplicationFormSchema.safeParse(corporationData);
      expect(corporationResult.success).toBe(true);

      // Test limited company
      const limitedCompanyData = {
        ...baseFormData,
        organizationType: "limited_company" as const,
        isForeignInvestment: true,
        isChineseInvestment: true,
        isSoleProprietorshipLLC: false,
      };

      const limitedResult = companyApplicationFormSchema.safeParse(limitedCompanyData);
      expect(limitedResult.success).toBe(true);
    });
  });

  describe("Other Organization Types", () => {
    it("should validate sole proprietorship", () => {
      const soleProprietorshipData = {
        ...baseFormData,
        organizationType: "sole_proprietorship" as const,
        // These fields should be optional/false for other org types
        isForeignInvestment: false,
        isChineseInvestment: false,
        isCloselyHeld: false,
        hasParValueFreeShares: false,
        isPublicOffering: false,
        hasMultipleVotingRightsPreferredShares: false,
        hasVetoRightsPreferredShares: false,
        hasPreferredSharesBoardRights: false,
        isSoleProprietorshipLLC: false,
      };

      const result = companyApplicationFormSchema.safeParse(soleProprietorshipData);
      expect(result.success).toBe(true);
    });

    it("should validate partnership", () => {
      const partnershipData = {
        ...baseFormData,
        organizationType: "partnership" as const,
        // These fields should be optional/false for other org types
        isForeignInvestment: false,
        isChineseInvestment: false,
        isCloselyHeld: false,
        hasParValueFreeShares: false,
        isPublicOffering: false,
        hasMultipleVotingRightsPreferredShares: false,
        hasVetoRightsPreferredShares: false,
        hasPreferredSharesBoardRights: false,
        isSoleProprietorshipLLC: false,
      };

      const result = companyApplicationFormSchema.safeParse(partnershipData);
      expect(result.success).toBe(true);
    });
  });

  describe("Base Schema Compatibility", () => {
    it("should parse the same data with both base and form schemas", () => {
      const testData = {
        ...baseFormData,
        organizationType: "corporation" as const,
        parValue: 10,
        totalShares: 100000,
        isCloselyHeld: false,
        hasParValueFreeShares: false,
        isForeignInvestment: true,
        isChineseInvestment: false,
        isPublicOffering: false,
        closelyHeldShareholderCount: undefined,
        hasMultipleVotingRightsPreferredShares: false,
        hasVetoRightsPreferredShares: false,
        hasPreferredSharesBoardRights: false,
        isSoleProprietorshipLLC: false,
      };

      const baseResult = companyApplicationBaseSchema.safeParse(testData);
      const formResult = companyApplicationFormSchema.safeParse(testData);

      expect(baseResult.success).toBe(true);
      expect(formResult.success).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined optional fields", () => {
      const testData = {
        ...baseFormData,
        organizationType: "corporation" as const,
        parValue: 10,
        totalShares: 100000,
        isCloselyHeld: false,
        hasParValueFreeShares: false,
        // All optional fields undefined
        isForeignInvestment: undefined,
        isChineseInvestment: undefined,
        isPublicOffering: undefined,
        closelyHeldShareholderCount: undefined,
        hasMultipleVotingRightsPreferredShares: undefined,
        hasVetoRightsPreferredShares: undefined,
        hasPreferredSharesBoardRights: undefined,
        isSoleProprietorshipLLC: undefined,
      };

      const result = companyApplicationFormSchema.safeParse(testData);
      expect(result.success).toBe(true);
    });

    it("should validate integer constraint for closelyHeldShareholderCount", () => {
      const testData = {
        ...baseFormData,
        organizationType: "corporation" as const,
        parValue: 10,
        totalShares: 100000,
        isCloselyHeld: true,
        hasParValueFreeShares: false,
        closelyHeldShareholderCount: 10.5, // Should be integer
      };

      const result = companyApplicationFormSchema.safeParse(testData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes("closelyHeldShareholderCount") && 
          issue.message.includes("integer")
        )).toBe(true);
      }
    });

    it("should validate positive constraint for closelyHeldShareholderCount", () => {
      const testData = {
        ...baseFormData,
        organizationType: "corporation" as const,
        parValue: 10,
        totalShares: 100000,
        isCloselyHeld: true,
        hasParValueFreeShares: false,
        closelyHeldShareholderCount: -1, // Should be positive
      };

      const result = companyApplicationFormSchema.safeParse(testData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes("closelyHeldShareholderCount") && 
          (issue.message.includes("positive") || issue.message.includes("greater than 0"))
        )).toBe(true);
      }
    });
  });
});