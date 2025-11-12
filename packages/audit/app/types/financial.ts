/**
 * Financial Statement Transformation Types
 *
 * These types support the transformation of Excel TB/BS/IS sheets
 * into formatted financial statements.
 */

/**
 * Trial Balance Entry (TB Sheet Row)
 * Represents a single account in the trial balance
 */
export interface TrialBalanceEntry {
  accountCode: string;           // 會計項目 (e.g., "1111", "5100")
  accountName: string;            // 科項名稱 (e.g., "現金", "營業收入")
  beginningDebit: number;         // 期初借方
  beginningCredit: number;        // 期初貸方
  periodDebit: number;            // 本期借方
  periodCredit: number;           // 本期貸方
  periodDebitBalance: number;     // 本期借餘
  periodCreditBalance: number;    // 本期貸餘
  endingDebitBalance: number;     // 期末借餘
  endingCreditBalance: number;    // 期末貸餘
}

/**
 * Account Mapping (BS/IS Sheet Structure)
 * Maps TB accounts to financial statement line items
 */
export interface AccountMapping {
  sequenceOrder: number;
  statementLineCode: string;
  statementLineName: string;
  tbAccountCodes: string[];
  isSubtotal: boolean;
  isContraAccount: boolean;
  indentLevel: number;
  side?: 'asset' | 'liability' | 'equity';  // For Balance Sheet
  section?: 'revenue' | 'cogs' | 'opex' | 'non-op';  // For Income Statement
}

/**
 * Statement Line Item (Output)
 * Represents a single line in a financial statement
 */
export interface StatementLineItem {
  lineCode: string;
  lineName: string;
  amount: number;
  percentage?: number;
  indentLevel: number;
  isSubtotal: boolean;
  children?: StatementLineItem[];
}

/**
 * Complete Financial Statement Set
 * Contains all 4 generated financial statements
 */
export interface FinancialStatementSet {
  balanceSheet: StatementLineItem[];
  incomeStatement: StatementLineItem[];
  equityChanges: StatementLineItem[];
  cashFlow: StatementLineItem[];
  metadata: {
    companyName: string;
    periodYear: number;
    generatedAt: Date;
  };
}

/**
 * Parse result types
 */
export interface ParseResult<T> {
  data: T;
  error?: string;
}

export interface TBParseResult extends ParseResult<TrialBalanceEntry[]> {
  data: TrialBalanceEntry[];
}

export interface MappingParseResult extends ParseResult<AccountMapping[]> {
  data: AccountMapping[];
}

/**
 * ============================================================
 * Balance Sheet Hierarchical Configuration Types
 * ============================================================
 */

/**
 * Account Query
 * Specifies which TB account codes to sum for a line item
 */
export interface AccountQuery {
  accountCodes: string[];      // Array of account codes to sum (e.g., ['1111', '1112'])
  isContraAccount?: boolean;   // Whether to negate the amount
}

/**
 * Display options for balance sheet nodes
 */
export interface BSDisplayOptions {
  showPercentage?: boolean;
  numberFormat?: string;
}

/**
 * Base properties shared by all Balance Sheet nodes
 */
interface BSNodeBase {
  code: string;                // Node code (e.g., "ASSETS", "A-CURRENT", "1100")
  name: string;                // Display name (e.g., "資產", "流動資產", "現金及約當現金")
  displayOptions?: BSDisplayOptions;
}

/**
 * Balance Sheet Parent Node
 * A node that has children but no account query (e.g., divisions, categories, subcategories)
 */
export interface BSParentNode extends BSNodeBase {
  type: 'parent';
  children: BSNode[];          // Child nodes (can be parents or leaves)
  showSubtotal?: boolean;      // Whether to show a subtotal after children
  subtotalLabel?: string;      // Custom subtotal label (e.g., "流動資產合計")
  side?: 'asset' | 'liability' | 'equity';  // Accounting side (typically set at root level)
}

/**
 * Balance Sheet Leaf Node
 * A terminal node with an account query (maps to TB accounts)
 */
export interface BSLeafNode extends BSNodeBase {
  type: 'leaf';
  query: AccountQuery;         // Which TB accounts to sum for this line item
}

/**
 * Balance Sheet Node (Discriminated Union)
 * Can be either a parent (with children) or a leaf (with query)
 */
export type BSNode = BSParentNode | BSLeafNode;

/**
 * Complete Balance Sheet Configuration
 */
export interface BalanceSheetConfig {
  nodes: BSNode[];             // Root-level nodes (typically divisions)
  metadata: {
    version: string;
    framework: 'IFRS' | 'GAAP' | 'Taiwan-GAAP';
    lastUpdated: string;
  };
}

/**
 * Type guard to check if a node is a parent node
 */
export function isParentNode(node: BSNode): node is BSParentNode {
  return node.type === 'parent';
}

/**
 * Type guard to check if a node is a leaf node
 */
export function isLeafNode(node: BSNode): node is BSLeafNode {
  return node.type === 'leaf';
}

/**
 * Legacy type aliases for backward compatibility
 * @deprecated Use BSNode with discriminated union instead
 */
export type BSLineItem = BSLeafNode;
export type BSCategory = BSParentNode & { children: Array<BSLeafNode | BSParentNode> };
export type BSDivision = BSParentNode & { side: 'asset' | 'liability' | 'equity' };

/**
 * Generated Balance Sheet Line Item (Output)
 * Flattened representation for display
 */
export interface GeneratedBSLineItem {
  code: string;                // Line code
  name: string;                // Display name
  amount: number;              // Calculated amount
  indentLevel: number;         // 0=Division, 1=Category, 2=LineItem
  isSubtotal: boolean;         // True for category subtotals
  isTotal: boolean;            // True for division totals
}

/**
 * Generated Balance Sheet (Output)
 */
export interface GeneratedBalanceSheet {
  lineItems: GeneratedBSLineItem[];
  metadata: {
    companyName: string;
    periodYear: number;
    generatedAt: Date;
  };
}
