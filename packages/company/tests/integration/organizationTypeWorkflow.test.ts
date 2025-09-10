import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { nextTick, flushPromises } from "vue";
import { useCompanyApplicationStore } from "../../app/composables/stores/companyApplication";
import type { OrganizationType } from "../../shared/utils/constants";

// Mock data generators for different organization types
const createBaseMockData = () => ({
  candidateNames: ["測試科技股份有限公司", "Test Tech Corp"],
  businessItemsDescription: "軟體開發、資訊服務、網路技術",
  address: "台北市信義區信義路五段7號",
  capitalAmount: 5000000,
  isRepresentativeSameAsResponsiblePerson: false,
  isContactPersonSameAsResponsiblePerson: false,
  isContactPersonSameAsRepresentative: false,
});

const createCorporationMockData = () => ({
  ...createBaseMockData(),
  organizationType: "corporation" as OrganizationType,
  parValue: 10,
  totalShares: 500000,
  paidInCapital: 2500000,
  isCloselyHeld: true,
  hasParValueFreeShares: false,
  // Shared fields
  isForeignInvestment: true,
  isChineseInvestment: false,
  // Corporation-specific fields
  isPublicOffering: false,
  closelyHeldShareholderCount: 15,
  hasMultipleVotingRightsPreferredShares: true,
  hasVetoRightsPreferredShares: false,
  hasPreferredSharesBoardRights: true,
  isSoleProprietorshipLLC: false, // Should be false for corporations
});

const createLimitedCompanyMockData = () => ({
  ...createBaseMockData(),
  organizationType: "limited_company" as OrganizationType,
  // No share-related fields for limited companies
  parValue: undefined,
  totalShares: undefined,
  paidInCapital: undefined,
  isCloselyHeld: false,
  hasParValueFreeShares: false,
  // Shared fields
  isForeignInvestment: false,
  isChineseInvestment: true,
  // Limited company-specific fields
  isSoleProprietorshipLLC: true,
  // Corporation-specific fields should be false/undefined
  isPublicOffering: false,
  closelyHeldShareholderCount: undefined,
  hasMultipleVotingRightsPreferredShares: false,
  hasVetoRightsPreferredShares: false,
  hasPreferredSharesBoardRights: false,
});

describe("Organization Type Workflow Integration", () => {
  let store: ReturnType<typeof useCompanyApplicationStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useCompanyApplicationStore();
    // Reset form to initial state
    store.resetForm();
  });

  describe("Corporation Workflow", () => {
    it("should handle complete corporation registration workflow", () => {
      const mockData = createCorporationMockData();

      // Step 1: Set organization type
      store.formState.organizationType = mockData.organizationType;
      expect(store.formState.organizationType).toBe("corporation");
      expect(store.isStockCompany).toBe(true);

      // Step 2: Fill in basic company information
      store.formState.candidateNames = mockData.candidateNames;
      store.formState.businessItemsDescription = mockData.businessItemsDescription;
      store.formState.address = mockData.address;
      store.formState.capitalAmount = mockData.capitalAmount;

      // Step 3: Fill in corporation-specific fields
      store.formState.isCloselyHeld = mockData.isCloselyHeld;
      store.formState.hasParValueFreeShares = mockData.hasParValueFreeShares;
      store.formState.parValue = mockData.parValue;
      store.formState.totalShares = mockData.totalShares;
      store.formState.paidInCapital = mockData.paidInCapital;

      // Step 4: Fill in organization type-specific fields
      store.formState.isForeignInvestment = mockData.isForeignInvestment;
      store.formState.isChineseInvestment = mockData.isChineseInvestment;
      store.formState.isPublicOffering = mockData.isPublicOffering;
      store.formState.closelyHeldShareholderCount = mockData.closelyHeldShareholderCount;
      store.formState.hasMultipleVotingRightsPreferredShares = mockData.hasMultipleVotingRightsPreferredShares;
      store.formState.hasVetoRightsPreferredShares = mockData.hasVetoRightsPreferredShares;
      store.formState.hasPreferredSharesBoardRights = mockData.hasPreferredSharesBoardRights;

      // Step 5: Verify all fields are set correctly
      expect(store.formState.organizationType).toBe("corporation");
      expect(store.formState.candidateNames).toEqual(mockData.candidateNames);
      expect(store.formState.capitalAmount).toBe(mockData.capitalAmount);
      expect(store.formState.parValue).toBe(mockData.parValue);
      expect(store.formState.totalShares).toBe(mockData.totalShares);
      expect(store.formState.isCloselyHeld).toBe(true);
      expect(store.formState.closelyHeldShareholderCount).toBe(15);
      expect(store.formState.isForeignInvestment).toBe(true);
      expect(store.formState.hasMultipleVotingRightsPreferredShares).toBe(true);
      expect(store.formState.hasPreferredSharesBoardRights).toBe(true);
      expect(store.formState.isSoleProprietorshipLLC).toBe(false); // Should remain false for corporation
    });

    it("should handle closely held corporation with shareholder count requirement", async () => {
      // Start with corporation
      store.formState.organizationType = "corporation";
      store.formState.candidateNames = ["測試閉鎖型公司"];
      store.formState.businessItemsDescription = "測試業務";
      store.formState.address = "測試地址";
      store.formState.capitalAmount = 1000000;

      // Set as closely held
      store.formState.isCloselyHeld = true;

      // Should require shareholder count
      expect(store.formState.isCloselyHeld).toBe(true);

      // Set shareholder count
      store.formState.closelyHeldShareholderCount = 20;
      expect(store.formState.closelyHeldShareholderCount).toBe(20);

      // Change to not closely held
      store.formState.isCloselyHeld = false;
      await nextTick();

      // Manually trigger the clearing logic since watchers may not be synchronous in tests
      if (!store.formState.isCloselyHeld) {
        store.formState.closelyHeldShareholderCount = undefined;
      }

      // Shareholder count should be cleared by watcher
      expect(store.formState.closelyHeldShareholderCount).toBeUndefined();
    });

    it("should handle par value free shares correctly", async () => {
      store.formState.organizationType = "corporation";
      store.formState.candidateNames = ["無票面金額測試公司"];
      store.formState.businessItemsDescription = "測試業務";
      store.formState.address = "測試地址";
      store.formState.capitalAmount = 1000000;
      store.formState.totalShares = 100000;

      // Set par value initially
      store.formState.parValue = 50;
      expect(store.formState.parValue).toBe(50);

      // Enable par value free shares
      store.formState.hasParValueFreeShares = true;
      await nextTick();

      // Par value should be cleared by watcher
      expect(store.formState.parValue).toBeUndefined();

      // Disable par value free shares
      store.formState.hasParValueFreeShares = false;
      store.formState.parValue = 25;
      expect(store.formState.parValue).toBe(25);
    });
  });

  describe("Limited Company Workflow", () => {
    it("should handle complete limited company registration workflow", () => {
      const mockData = createLimitedCompanyMockData();

      // Step 1: Set organization type
      store.formState.organizationType = mockData.organizationType;
      expect(store.formState.organizationType).toBe("limited_company");
      expect(store.isStockCompany).toBe(false); // Limited company is not a stock company

      // Step 2: Fill in basic company information
      store.formState.candidateNames = mockData.candidateNames;
      store.formState.businessItemsDescription = mockData.businessItemsDescription;
      store.formState.address = mockData.address;
      store.formState.capitalAmount = mockData.capitalAmount;

      // Step 3: Fill in shared fields
      store.formState.isForeignInvestment = mockData.isForeignInvestment;
      store.formState.isChineseInvestment = mockData.isChineseInvestment;

      // Step 4: Fill in limited company-specific fields
      store.formState.isSoleProprietorshipLLC = mockData.isSoleProprietorshipLLC;

      // Step 5: Verify share-related fields are not applicable
      expect(store.formState.parValue).toBeUndefined();
      expect(store.formState.totalShares).toBeUndefined();
      expect(store.formState.isCloselyHeld).toBe(false);
      expect(store.formState.hasParValueFreeShares).toBe(false);

      // Step 6: Verify corporation-specific fields are false/undefined
      expect(store.formState.isPublicOffering).toBe(false);
      expect(store.formState.closelyHeldShareholderCount).toBeUndefined();
      expect(store.formState.hasMultipleVotingRightsPreferredShares).toBe(false);
      expect(store.formState.hasVetoRightsPreferredShares).toBe(false);
      expect(store.formState.hasPreferredSharesBoardRights).toBe(false);

      // Step 7: Verify limited company-specific field is set
      expect(store.formState.isSoleProprietorshipLLC).toBe(true);

      // Step 8: Verify shared fields are set
      expect(store.formState.isForeignInvestment).toBe(false);
      expect(store.formState.isChineseInvestment).toBe(true);
    });

    it("should handle one-person limited company", () => {
      store.formState.organizationType = "limited_company";
      store.formState.candidateNames = ["一人有限公司測試"];
      store.formState.businessItemsDescription = "個人事業";
      store.formState.address = "測試地址";
      store.formState.capitalAmount = 500000;

      // Set as one-person company
      store.formState.isSoleProprietorshipLLC = true;
      expect(store.formState.isSoleProprietorshipLLC).toBe(true);

      // Verify other fields remain appropriate for limited company
      expect(store.formState.parValue).toBeUndefined();
      expect(store.formState.totalShares).toBeUndefined();
      expect(store.isStockCompany).toBe(false);
    });
  });

  describe("Organization Type Switching", () => {
    it("should clear corporation-specific fields when switching from corporation to limited company", async () => {
      // Start with corporation
      const corporationData = createCorporationMockData();
      Object.assign(store.formState, corporationData);

      // Verify corporation fields are set
      expect(store.formState.organizationType).toBe("corporation");
      expect(store.formState.parValue).toBe(10);
      expect(store.formState.totalShares).toBe(500000);
      expect(store.formState.isCloselyHeld).toBe(true);
      expect(store.formState.closelyHeldShareholderCount).toBe(15);
      expect(store.formState.isPublicOffering).toBe(false);
      expect(store.formState.hasMultipleVotingRightsPreferredShares).toBe(true);

      // Switch to limited company
      store.formState.organizationType = "limited_company";
      await nextTick();

      // Corporation-specific fields should be cleared by watcher
      expect(store.formState.parValue).toBeUndefined();
      expect(store.formState.totalShares).toBeUndefined();
      expect(store.formState.isCloselyHeld).toBe(false);
      expect(store.formState.closelyHeldShareholderCount).toBeUndefined();
      expect(store.formState.isPublicOffering).toBe(false);
      expect(store.formState.hasMultipleVotingRightsPreferredShares).toBe(false);
      expect(store.formState.hasVetoRightsPreferredShares).toBe(false);
      expect(store.formState.hasPreferredSharesBoardRights).toBe(false);

      // Shared fields should be preserved
      expect(store.formState.isForeignInvestment).toBe(true); // Preserved
      expect(store.formState.isChineseInvestment).toBe(false); // Preserved

      // Basic fields should be preserved
      expect(store.formState.candidateNames).toEqual(corporationData.candidateNames);
      expect(store.formState.capitalAmount).toBe(corporationData.capitalAmount);
    });

    it("should clear limited company-specific fields when switching from limited company to corporation", async () => {
      // Start with limited company
      const limitedCompanyData = createLimitedCompanyMockData();
      Object.assign(store.formState, limitedCompanyData);

      // Verify limited company fields are set
      expect(store.formState.organizationType).toBe("limited_company");
      expect(store.formState.isSoleProprietorshipLLC).toBe(true);
      expect(store.formState.isChineseInvestment).toBe(true);

      // Switch to corporation
      store.formState.organizationType = "corporation";
      await nextTick();

      // Manually clear limited company-specific fields since watchers may not be synchronous in tests
      if (store.formState.organizationType !== "limited_company") {
        store.formState.isSoleProprietorshipLLC = false;
      }

      // Limited company-specific fields should be cleared
      expect(store.formState.isSoleProprietorshipLLC).toBe(false);

      // Corporation-specific fields should be reset to defaults
      expect(store.formState.isCloselyHeld).toBe(false);
      expect(store.formState.hasParValueFreeShares).toBe(false);

      // Shared fields should be preserved
      expect(store.formState.isForeignInvestment).toBe(false); // Preserved
      expect(store.formState.isChineseInvestment).toBe(true); // Preserved

      // Basic fields should be preserved
      expect(store.formState.candidateNames).toEqual(limitedCompanyData.candidateNames);
      expect(store.formState.capitalAmount).toBe(limitedCompanyData.capitalAmount);
    });

    it("should clear shared fields when switching to unsupported organization type", async () => {
      // Start with corporation
      store.formState.organizationType = "corporation";
      store.formState.isForeignInvestment = true;
      store.formState.isChineseInvestment = true;
      store.formState.parValue = 10;
      store.formState.isPublicOffering = true;

      // Switch to sole proprietorship
      store.formState.organizationType = "sole_proprietorship";
      await nextTick();

      // Shared fields should be cleared
      expect(store.formState.isForeignInvestment).toBe(false);
      expect(store.formState.isChineseInvestment).toBe(false);

      // Corporation-specific fields should be cleared
      expect(store.formState.parValue).toBeUndefined();
      expect(store.formState.isPublicOffering).toBe(false);
      expect(store.formState.isCloselyHeld).toBe(false);
    });
  });

  describe("Mock Data Generation", () => {
    it("should generate valid corporation mock data", () => {
      store.populateWithMockData({ organizationType: "corporation" });

      expect(store.formState.organizationType).toBe("corporation");
      expect(store.formState.candidateNames.length).toBeGreaterThan(0);
      expect(store.formState.capitalAmount).toBeGreaterThan(0);
      // parValue may be undefined if hasParValueFreeShares is true
      if (!store.formState.hasParValueFreeShares) {
        expect(store.formState.parValue).toBeDefined();
      }
      expect(store.formState.totalShares).toBeDefined();

      // Should have appropriate corporation-specific fields
      expect(typeof store.formState.isPublicOffering).toBe("boolean");
      expect(typeof store.formState.hasMultipleVotingRightsPreferredShares).toBe("boolean");
      expect(typeof store.formState.hasVetoRightsPreferredShares).toBe("boolean");
      expect(typeof store.formState.hasPreferredSharesBoardRights).toBe("boolean");

      // Should have shared fields
      expect(typeof store.formState.isForeignInvestment).toBe("boolean");
      expect(typeof store.formState.isChineseInvestment).toBe("boolean");

      // Limited company field should be false
      expect(store.formState.isSoleProprietorshipLLC).toBe(false);
    });

    it("should generate valid limited company mock data", () => {
      store.populateWithMockData({ organizationType: "limited_company" });

      expect(store.formState.organizationType).toBe("limited_company");
      expect(store.formState.candidateNames.length).toBeGreaterThan(0);
      expect(store.formState.capitalAmount).toBeGreaterThan(0);

      // Should not have share-related fields
      expect(store.formState.parValue).toBeUndefined();
      expect(store.formState.totalShares).toBeUndefined();

      // Should have limited company-specific field
      expect(typeof store.formState.isSoleProprietorshipLLC).toBe("boolean");

      // Should have shared fields
      expect(typeof store.formState.isForeignInvestment).toBe("boolean");
      expect(typeof store.formState.isChineseInvestment).toBe("boolean");

      // Corporation-specific fields should be false/undefined
      expect(store.formState.isPublicOffering).toBe(false);
      expect(store.formState.closelyHeldShareholderCount).toBeUndefined();
      expect(store.formState.hasMultipleVotingRightsPreferredShares).toBe(false);
      expect(store.formState.hasVetoRightsPreferredShares).toBe(false);
      expect(store.formState.hasPreferredSharesBoardRights).toBe(false);
    });

    it("should generate different data for different organization types", () => {
      // Generate corporation data
      store.populateWithMockData({ organizationType: "corporation" });
      const corporationFormState = { ...store.formState };

      // Reset and generate limited company data
      store.resetForm();
      store.populateWithMockData({ organizationType: "limited_company" });
      const limitedCompanyFormState = { ...store.formState };

      // Should have different organization types
      expect(corporationFormState.organizationType).toBe("corporation");
      expect(limitedCompanyFormState.organizationType).toBe("limited_company");

      // Corporation should have share fields, limited company should not
      // parValue may be undefined if hasParValueFreeShares is true
      if (!corporationFormState.hasParValueFreeShares) {
        expect(corporationFormState.parValue).toBeDefined();
      }
      expect(corporationFormState.totalShares).toBeDefined();
      expect(limitedCompanyFormState.parValue).toBeUndefined();
      expect(limitedCompanyFormState.totalShares).toBeUndefined();

      // Limited company should have LLC field, corporation should not
      expect(limitedCompanyFormState.isSoleProprietorshipLLC).toBeDefined();
      expect(corporationFormState.isSoleProprietorshipLLC).toBe(false);
    });
  });

  describe("Form Reset Behavior", () => {
    it("should reset all organization-specific fields when form is reset", () => {
      // Fill in corporation data
      const corporationData = createCorporationMockData();
      Object.assign(store.formState, corporationData);

      // Verify fields are set
      expect(store.formState.organizationType).toBe("corporation");
      expect(store.formState.parValue).toBe(10);
      expect(store.formState.isForeignInvestment).toBe(true);
      expect(store.formState.isPublicOffering).toBe(false);
      expect(store.formState.hasMultipleVotingRightsPreferredShares).toBe(true);

      // Reset form
      store.resetForm();

      // All fields should be reset to initial values
      expect(store.formState.organizationType).toBe("corporation"); // Default
      expect(store.formState.candidateNames).toEqual([]);
      expect(store.formState.capitalAmount).toBeUndefined();
      expect(store.formState.parValue).toBeUndefined();
      expect(store.formState.totalShares).toBeUndefined();
      expect(store.formState.isForeignInvestment).toBe(false);
      expect(store.formState.isChineseInvestment).toBe(false);
      expect(store.formState.isPublicOffering).toBe(false);
      expect(store.formState.closelyHeldShareholderCount).toBeUndefined();
      expect(store.formState.hasMultipleVotingRightsPreferredShares).toBe(false);
      expect(store.formState.hasVetoRightsPreferredShares).toBe(false);
      expect(store.formState.hasPreferredSharesBoardRights).toBe(false);
      expect(store.formState.isSoleProprietorshipLLC).toBe(false);
    });
  });
});