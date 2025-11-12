import type { BalanceSheetConfig } from "../types/financial";

const assetsCurrentLineItems = [
  {
    type: "leaf" as const,
    code: "1100",
    name: "現金及約當現金",
    query: {
      accountCodes: ["1111", "1112"],
    },
  },
  {
    type: "leaf" as const,
    code: "1121",
    name: "應收票據",
    query: {
      accountCodes: ["1121"],
    },
  },
  {
    type: "leaf" as const,
    code: "1123",
    name: "應收帳款",
    query: {
      accountCodes: ["1123"],
    },
  },
  {
    type: "leaf" as const,
    code: "1129",
    name: "其他應收帳款",
    query: {
      accountCodes: ["1129"],
    },
  },
  {
    type: "leaf" as const,
    code: "1130",
    name: "存貨",
    query: {
      accountCodes: ["1130"],
    },
  },
  {
    type: "leaf" as const,
    code: "1140",
    name: "預付款項",
    query: {
      accountCodes: ["1140"],
    },
  },
  {
    type: "leaf" as const,
    code: "1190",
    name: "其他流動資產",
    query: {
      accountCodes: ["1190"],
    },
  },
];

/**
 * Balance Sheet Hierarchical Configuration
 *
 * Recursive N-Level Structure:
 * - Uses discriminated union (BSParentNode | BSLeafNode)
 * - Parent nodes have children and optional subtotals
 * - Leaf nodes have account queries
 * - Supports arbitrary nesting depth (3+ levels)
 *
 * Current structure (3 levels):
 * - Division (Level 1): Major sections (資產, 負債, 權益)
 * - Category (Level 2): Subsections (流動資產, 非流動資產)
 * - LineItem (Level 3): Actual line items with TB account queries
 *
 * Based on Taiwan GAAP format
 */
export const balanceSheetConfig: BalanceSheetConfig = {
  nodes: [
    {
      type: "parent",
      code: "ASSETS",
      name: "資產",
      side: "asset",
      showSubtotal: true,
      subtotalLabel: "資產總計",
      children: [
        {
          type: "parent",
          code: "A-CURRENT",
          name: "流動資產",
          showSubtotal: true,
          subtotalLabel: "流動資產合計",
          children: assetsCurrentLineItems,
        },
        {
          type: "parent",
          code: "A-NONCURRENT",
          name: "非流動資產",
          showSubtotal: true,
          subtotalLabel: "非流動資產合計",
          children: [
            {
              type: "leaf",
              code: "1400",
              name: "不動產、廠房及設備",
              query: {
                accountCodes: ["1400"],
              },
            },
            {
              type: "leaf",
              code: "1510",
              name: "無形資產",
              query: {
                accountCodes: ["1510", "1511"],
              },
            },
            {
              type: "leaf",
              code: "1901",
              name: "存出保證金",
              query: {
                accountCodes: ["1901"],
              },
            },
            {
              type: "leaf",
              code: "1903",
              name: "預付設備款",
              query: {
                accountCodes: ["1903"],
              },
            },
            {
              type: "leaf",
              code: "1904",
              name: "遞延所得稅資產",
              query: {
                accountCodes: ["1904"],
              },
            },
          ],
        },
      ],
    },
    {
      type: "parent",
      code: "LIABILITIES",
      name: "負債",
      side: "liability",
      showSubtotal: true,
      subtotalLabel: "負債總計",
      children: [
        // --- Current Liabilities Category ---
        {
          type: "parent",
          code: "L-CURRENT",
          name: "流動負債",
          showSubtotal: true,
          subtotalLabel: "流動負債合計",
          children: [
            {
              type: "leaf",
              code: "2120",
              name: "應付票據",
              query: {
                accountCodes: ["2120"],
              },
            },
            {
              type: "leaf",
              code: "2121",
              name: "應付帳款",
              query: {
                accountCodes: ["2121"],
              },
            },
            {
              type: "leaf",
              code: "2130",
              name: "其他應付款",
              query: {
                accountCodes: ["2130"],
              },
            },
            {
              type: "leaf",
              code: "2137",
              name: "預收貨款",
              query: {
                accountCodes: ["2137"],
              },
            },
            {
              type: "leaf",
              code: "2112",
              name: "一年內到期長期借款",
              query: {
                accountCodes: ["2112"],
              },
            },
          ],
        },
        {
          type: "parent",
          code: "L-NONCURRENT",
          name: "非流動負債",
          showSubtotal: true,
          subtotalLabel: "非流動負債合計",
          children: [
            {
              type: "leaf",
              code: "2220",
              name: "長期借款",
              query: {
                accountCodes: ["2220"],
              },
            },
          ],
        },
      ],
    },
    {
      type: "parent",
      code: "EQUITY",
      name: "權益",
      side: "equity",
      showSubtotal: true,
      subtotalLabel: "權益總計",
      children: [
        {
          type: "parent",
          code: "E-MAIN",
          name: "股東權益",
          showSubtotal: false, // No subtotal for single category
          children: [
            {
              type: "leaf",
              code: "3110",
              name: "股本",
              query: {
                accountCodes: ["3110"],
              },
            },
            {
              type: "leaf",
              code: "3300",
              name: "資本公積",
              query: {
                accountCodes: ["3300"],
              },
            },
            {
              type: "leaf",
              code: "3432",
              name: "保留盈餘",
              query: {
                accountCodes: ["3432"],
              },
            },
            {
              type: "leaf",
              code: "3440",
              name: "本期損益",
              query: {
                accountCodes: ["3440"],
              },
            },
            {
              type: "leaf",
              code: "3999",
              name: "待彌補虧損",
              query: {
                accountCodes: ["3999"],
                isContraAccount: true, // Negated amount
              },
            },
          ],
        },
      ],
    },
  ],

  metadata: {
    version: "1.0.0",
    framework: "Taiwan-GAAP",
    lastUpdated: "2025-01-15",
  },
};
