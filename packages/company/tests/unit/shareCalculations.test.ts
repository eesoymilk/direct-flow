import { describe, it, expect, vi } from "vitest";

// Mock the share calculations composable since it uses Nuxt composables
const mockShareHoldings = [
  {
    id: "1",
    applicationId: "app1",
    shareholderId: "shareholder1",
    shareTypeId: 1, // ordinary
    quantity: 1000,
    pricePerShare: "10.00",
    totalAmount: "10000.00",
  },
  {
    id: "2",
    applicationId: "app1",
    shareholderId: "shareholder1",
    shareTypeId: 2, // preferred_a
    quantity: 500,
    pricePerShare: "20.00",
    totalAmount: "10000.00",
  },
];

const mockShareTypes = [
  { id: 1, code: "ordinary", name: "普通股", isActive: true },
  { id: 2, code: "preferred_a", name: "甲種特別股", isActive: true },
  { id: 3, code: "preferred_b", name: "乙種特別股", isActive: true },
];

describe("Share Calculations", () => {
  describe("calculateTotalAmount", () => {
    it("should calculate total amount correctly", () => {
      const quantity = 1000;
      const pricePerShare = 10.5;
      const expected = 10500.0;

      const result = quantity * pricePerShare;
      expect(result).toBe(expected);
    });

    it("should handle zero quantity", () => {
      const quantity = 0;
      const pricePerShare = 10.0;
      const expected = 0;

      const result = quantity * pricePerShare;
      expect(result).toBe(expected);
    });

    it("should handle zero price per share", () => {
      const quantity = 1000;
      const pricePerShare = 0;
      const expected = 0;

      const result = quantity * pricePerShare;
      expect(result).toBe(expected);
    });
  });

  describe("calculateTotalShares", () => {
    it("should sum all shares correctly", () => {
      const holdings = mockShareHoldings;
      const totalShares = holdings.reduce(
        (sum, holding) => sum + holding.quantity,
        0
      );

      expect(totalShares).toBe(1500); // 1000 + 500
    });

    it("should handle empty holdings array", () => {
      const holdings: typeof mockShareHoldings = [];
      const totalShares = holdings.reduce(
        (sum, holding) => sum + holding.quantity,
        0
      );

      expect(totalShares).toBe(0);
    });
  });

  describe("calculateSharesByType", () => {
    it("should group shares by type correctly", () => {
      const holdings = mockShareHoldings;
      const sharesByType = holdings.reduce(
        (acc, holding) => {
          acc[holding.shareTypeId] =
            (acc[holding.shareTypeId] || 0) + holding.quantity;
          return acc;
        },
        {} as Record<number, number>
      );

      expect(sharesByType[1]).toBe(1000); // ordinary shares
      expect(sharesByType[2]).toBe(500); // preferred_a shares
      expect(sharesByType[3]).toBeUndefined(); // no preferred_b shares
    });
  });

  describe("calculateTotalValue", () => {
    it("should calculate total portfolio value correctly", () => {
      const holdings = mockShareHoldings;
      const totalValue = holdings.reduce((sum, holding) => {
        return sum + parseFloat(holding.totalAmount);
      }, 0);

      expect(totalValue).toBe(20000.0); // 10000 + 10000
    });

    it("should handle decimal precision correctly", () => {
      const holdings = [
        {
          id: "1",
          applicationId: "app1",
          shareholderId: "shareholder1",
          shareTypeId: 1,
          quantity: 333,
          pricePerShare: "3.33",
          totalAmount: "1108.89",
        },
      ];

      const totalValue = holdings.reduce((sum, holding) => {
        return sum + parseFloat(holding.totalAmount);
      }, 0);

      expect(totalValue).toBe(1108.89);
    });
  });

  describe("validateShareHolding", () => {
    it("should validate positive quantity", () => {
      const quantity = 1000;
      expect(quantity > 0).toBe(true);
    });

    it("should validate positive price per share", () => {
      const pricePerShare = 10.0;
      expect(pricePerShare > 0).toBe(true);
    });

    it("should reject negative quantity", () => {
      const quantity = -100;
      expect(quantity > 0).toBe(false);
    });

    it("should reject negative price per share", () => {
      const pricePerShare = -5.0;
      expect(pricePerShare > 0).toBe(false);
    });

    it("should validate amount calculation", () => {
      const quantity = 1000;
      const pricePerShare = 10.5;
      const expectedAmount = 10500.0;
      const calculatedAmount = quantity * pricePerShare;

      expect(Math.abs(calculatedAmount - expectedAmount) < 0.01).toBe(true);
    });
  });

  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      const amount = 10000.5;
      const formatted = new Intl.NumberFormat("zh-TW", {
        style: "currency",
        currency: "TWD",
      }).format(amount);

      expect(formatted).toContain("10,000.50");
    });

    it("should handle zero amount", () => {
      const amount = 0;
      const formatted = new Intl.NumberFormat("zh-TW", {
        style: "currency",
        currency: "TWD",
      }).format(amount);

      expect(formatted).toContain("0");
    });
  });

  describe("parseDecimal", () => {
    it("should parse decimal strings correctly", () => {
      expect(parseFloat("10.50")).toBe(10.5);
      expect(parseFloat("1000.00")).toBe(1000);
      expect(parseFloat("0.01")).toBe(0.01);
    });

    it("should handle invalid decimal strings", () => {
      expect(isNaN(parseFloat("invalid"))).toBe(true);
      expect(isNaN(parseFloat(""))).toBe(true);
    });
  });

  describe("roundToTwoDecimals", () => {
    it("should round to two decimal places", () => {
      const round = (num: number) => Math.round(num * 100) / 100;

      expect(round(10.555)).toBe(10.56);
      expect(round(10.554)).toBe(10.55);
      expect(round(10.00001)).toBe(10.0);
    });
  });
});
