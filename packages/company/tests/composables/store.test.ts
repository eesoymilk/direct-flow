import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCompanyApplicationStore } from "../../app/composables/stores/companyApplication";

describe("Company Application Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should create store instance", () => {
    const store = useCompanyApplicationStore();

    expect(store).toBeDefined();
    expect(store.form).toBeDefined();
    expect(store.submissionState).toBeDefined();
  });

  it("should have correct initial form structure", () => {
    const store = useCompanyApplicationStore();

    expect(store.form.candidateNames).toEqual([]);
    expect(store.form.organizationType).toBe("corporation"); // Updated to new organization type
    expect(store.form.businessItemsDescription).toBe("");
    expect(store.form.address).toBe("");
  });

  it("should compute isStockCompany correctly", () => {
    const store = useCompanyApplicationStore();

    expect(store.isStockCompany).toBe(true); // Default is corporation

    store.form.organizationType = "limited_company";
    expect(store.isStockCompany).toBe(false);
  });

  it("should add shareholder", () => {
    const store = useCompanyApplicationStore();

    const initialLength = store.form.shareholders.length;
    store.addShareholder();

    expect(store.form.shareholders.length).toBe(initialLength + 1);
  });

  it("should reset form", () => {
    const store = useCompanyApplicationStore();

    // Modify form
    store.form.candidateNames = ["測試公司"];
    store.form.organizationType = "limited_company";

    // Reset
    store.resetForm();

    expect(store.form.candidateNames).toEqual([]);
    expect(store.form.organizationType).toBe("corporation"); // Updated default value
  });
});
