import { describe, it, expect } from "vitest";
import { companyApplicationFormSchema } from "../../shared/utils/schemas/companyApplication";

describe("Simple Tests", () => {
  it("should pass basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should validate form schema structure", () => {
    expect(companyApplicationFormSchema).toBeDefined();
    expect(typeof companyApplicationFormSchema.safeParse).toBe("function");
  });

  it("should validate basic form data", () => {
    const validData = {
      candidateNames: ["測試公司"],
      organizationType: "corporation", // Updated to new organization type
      businessItemsDescription: "軟體開發",
      address: "台北市",
      isDirectorSameAsResponsiblePerson: false,
      isContactPersonSameAsResponsiblePerson: false,
      isContactPersonSameAsDirector: false,
    };

    const result = companyApplicationFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid form data", () => {
    const invalidData = {
      candidateNames: [], // Empty names should fail
      organizationType: "invalid_type",
      businessItemsDescription: "",
      address: "",
    };

    const result = companyApplicationFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
