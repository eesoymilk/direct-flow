/**
 * Balance Sheet Mapping Configuration
 *
 * Defines how TB account codes map to Balance Sheet line items.
 *
 * Account Code Syntax:
 * - Single: "1121" -> account 1121
 * - Range: "1111-1112" -> accounts 1111, 1112
 * - Multiple: "1141,1142,1143" -> accounts 1141, 1142, 1143
 *
 * Note: Only first 4 digits matter (1112-1, 1112-2 -> 1112)
 */

export interface BSLineItem {
  code: string;
  name: string;
  accounts: string; // Account code(s): "1111" or "1111-1112" or "1141,1142"
  side: 'asset' | 'liability' | 'equity';
  isSubtotal?: boolean;
  indentLevel?: number;
  isContraAccount?: boolean;
}

/**
 * Balance Sheet Structure
 * Based on Taiwan GAAP format
 */
export const balanceSheetMapping: BSLineItem[] = [
  // ============ ASSETS (資產) ============
  {
    code: 'A-CURRENT',
    name: '流動資產',
    accounts: '',
    side: 'asset',
    indentLevel: 0,
    isSubtotal: true,
  },
  {
    code: '1100',
    name: '現金及約當現金',
    accounts: '1111-1112',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: '1121',
    name: '應收票據',
    accounts: '1121',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: '1122',
    name: '應收帳款',
    accounts: '1122',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: '1123',
    name: '應收帳款-關係人',
    accounts: '1123',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: '1124',
    name: '其他應收款',
    accounts: '1124',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: '1125',
    name: '存貨',
    accounts: '1125',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: '1126',
    name: '預付款項',
    accounts: '1126',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: '1127',
    name: '其他流動資產',
    accounts: '1127',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: 'A-CURRENT-TOTAL',
    name: '流動資產合計',
    accounts: '1100-1199',
    side: 'asset',
    indentLevel: 1,
    isSubtotal: true,
  },

  // Non-current Assets
  {
    code: 'A-NONCURRENT',
    name: '非流動資產',
    accounts: '',
    side: 'asset',
    indentLevel: 0,
    isSubtotal: true,
  },
  {
    code: '1510',
    name: '不動產、廠房及設備',
    accounts: '1510',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: '1550',
    name: '無形資產',
    accounts: '1550',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: '1600',
    name: '長期投資',
    accounts: '1600',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: '1650',
    name: '預付設備款',
    accounts: '1650',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: '1690',
    name: '遞延所得稅資產',
    accounts: '1690',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: '1700',
    name: '其他非流動資產',
    accounts: '1700',
    side: 'asset',
    indentLevel: 1,
  },
  {
    code: 'A-NONCURRENT-TOTAL',
    name: '非流動資產合計',
    accounts: '1500-1999',
    side: 'asset',
    indentLevel: 1,
    isSubtotal: true,
  },

  {
    code: 'A-TOTAL',
    name: '資產總計',
    accounts: '1000-1999',
    side: 'asset',
    indentLevel: 0,
    isSubtotal: true,
  },

  // ============ LIABILITIES (負債) ============
  {
    code: 'L-CURRENT',
    name: '流動負債',
    accounts: '',
    side: 'liability',
    indentLevel: 0,
    isSubtotal: true,
  },
  {
    code: '2111',
    name: '應付票據',
    accounts: '2111',
    side: 'liability',
    indentLevel: 1,
  },
  {
    code: '2112',
    name: '應付帳款',
    accounts: '2112',
    side: 'liability',
    indentLevel: 1,
  },
  {
    code: '2113',
    name: '應付帳款-關係人',
    accounts: '2113',
    side: 'liability',
    indentLevel: 1,
  },
  {
    code: '2141',
    name: '預收貨款',
    accounts: '2141',
    side: 'liability',
    indentLevel: 1,
  },
  {
    code: '2142',
    name: '其他應付款',
    accounts: '2142',
    side: 'liability',
    indentLevel: 1,
  },
  {
    code: '2143',
    name: '一年內到期長期借款',
    accounts: '2143',
    side: 'liability',
    indentLevel: 1,
  },
  {
    code: 'L-CURRENT-TOTAL',
    name: '流動負債合計',
    accounts: '2100-2199',
    side: 'liability',
    indentLevel: 1,
    isSubtotal: true,
  },

  // Non-current Liabilities
  {
    code: 'L-NONCURRENT',
    name: '非流動負債',
    accounts: '',
    side: 'liability',
    indentLevel: 0,
    isSubtotal: true,
  },
  {
    code: '2211',
    name: '長期借款',
    accounts: '2211',
    side: 'liability',
    indentLevel: 1,
  },
  {
    code: 'L-NONCURRENT-TOTAL',
    name: '非流動負債合計',
    accounts: '2200-2999',
    side: 'liability',
    indentLevel: 1,
    isSubtotal: true,
  },

  {
    code: 'L-TOTAL',
    name: '負債總計',
    accounts: '2000-2999',
    side: 'liability',
    indentLevel: 0,
    isSubtotal: true,
  },

  // ============ EQUITY (權益) ============
  {
    code: 'E-EQUITY',
    name: '權益',
    accounts: '',
    side: 'equity',
    indentLevel: 0,
    isSubtotal: true,
  },
  {
    code: '3110',
    name: '股本',
    accounts: '3110',
    side: 'equity',
    indentLevel: 1,
  },
  {
    code: '3300',
    name: '資本公積',
    accounts: '3300',
    side: 'equity',
    indentLevel: 1,
  },
  {
    code: '3432',
    name: '保留盈餘',
    accounts: '3432',
    side: 'equity',
    indentLevel: 1,
  },
  {
    code: '3440',
    name: '本期損益',
    accounts: '3440',
    side: 'equity',
    indentLevel: 1,
  },
  {
    code: '3999',
    name: '待彌補虧損',
    accounts: '3999',
    side: 'equity',
    indentLevel: 1,
    isContraAccount: true,
  },
  {
    code: 'E-TOTAL',
    name: '權益總計',
    accounts: '3000-3999',
    side: 'equity',
    indentLevel: 0,
    isSubtotal: true,
  },
];

/**
 * Parse account code specification into array of account codes
 *
 * Examples:
 * - "1111" -> ["1111"]
 * - "1111-1112" -> ["1111", "1112"]
 * - "1141,1142,1143" -> ["1141", "1142", "1143"]
 * - "1100-1105" -> ["1100", "1101", "1102", "1103", "1104", "1105"]
 */
export function parseAccountCodes(spec: string): string[] {
  if (!spec || spec.trim() === '') {
    return [];
  }

  // Handle comma-separated codes
  if (spec.includes(',')) {
    return spec.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Handle range (e.g., "1111-1112" or "1000-1999")
  if (spec.includes('-')) {
    const parts = spec.split('-').map(s => s.trim());
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return [];
    }
    const startNum = parseInt(parts[0]);
    const endNum = parseInt(parts[1]);

    const codes: string[] = [];
    for (let i = startNum; i <= endNum; i++) {
      codes.push(String(i));
    }
    return codes;
  }

  // Single code
  return [spec.trim()];
}

/**
 * Normalize account code to 4 digits
 * Examples:
 * - "1112-1" -> "1112"
 * - "1112-2" -> "1112"
 * - "1112" -> "1112"
 */
export function normalizeAccountCode(code: string): string {
  return code.substring(0, 4);
}

/**
 * Check if a TB account code matches a config account specification
 *
 * @param tbCode - Account code from Trial Balance (e.g., "1112-1", "1112")
 * @param configSpec - Account specification from config (e.g., "1111-1112")
 * @returns true if the TB account matches the config spec
 */
export function matchesAccountSpec(tbCode: string, configSpec: string): boolean {
  const normalizedTbCode = normalizeAccountCode(tbCode);
  const configCodes = parseAccountCodes(configSpec);

  return configCodes.some(configCode =>
    normalizeAccountCode(configCode) === normalizedTbCode
  );
}
