# Financial Statement Transformation - Frontend Implementation Roadmap

**Project**: Transform Excel TB/BS/IS sheets into 4 formatted financial statements
**Scope**: Frontend-only implementation (no backend/database)
**Location**: `/packages/audit/app`

---

## Table of Contents
1. [Excel File Analysis](#excel-file-analysis)
2. [Transformation Requirements](#transformation-requirements)
3. [Implementation Plan](#implementation-plan)
4. [Component Structure](#component-structure)
5. [Implementation Details](#implementation-details)
6. [Testing Strategy](#testing-strategy)

---

## Excel File Analysis

### File Location
`/packages/audit/examples/Financial Report.xlsx`

### Sheet Structure Overview
The Excel file contains **15 sheets total**, with **3 critical input sheets**:

1. **TB** (Trial Balance) - 386 rows × 10 columns - PRIMARY INPUT
2. **BS** (Balance Sheet) - 39 rows × 8 columns - MAPPING TEMPLATE
3. **IS** (Income Statement) - 74 rows × 5 columns - MAPPING TEMPLATE

**Output sheets** (these are what we'll generate):
- 資產負債表 (Balance Sheet)
- 損益表 (Income Statement)
- 股東變動表 (Statement of Changes in Equity)
- 現金流量表 (Cash Flow Statement)

### TB Sheet (Trial Balance) - Detailed Structure

**Purpose**: The foundational accounting data source containing all account balances

**Column Structure**:
```
A: 會計項目 (Account Code) - e.g., "1111", "1112-1", "5100"
B: 科項名稱 (Account Name) - e.g., "現金", "銀行存款-合作金庫"
C: 期初借方 (Beginning Debit)
D: 期初貸方 (Beginning Credit)
E: 本期借方 (Current Period Debit)
F: 本期貸方 (Current Period Credit)
G: 本期借餘 (Current Period Debit Balance)
H: 本期貸餘 (Current Period Credit Balance)
I: 期末借餘 (Ending Debit Balance)
J: 期末貸餘 (Ending Credit Balance)
```

**Account Code Ranges**:
- **1000 series**: Assets (資產)
  - 1100: Current Assets (流動資產)
  - 1200: Non-current Assets (非流動資產)
  - Examples: 1111 (現金), 1123 (應收帳款), 1431-1492 (固定資產)

- **2000 series**: Liabilities (負債)
  - 2100: Current Liabilities (流動負債)
  - 2200: Non-current Liabilities (非流動負債)
  - Examples: 2112-1 (一年內到期長期借款), 2121 (應付帳款)

- **3000 series**: Equity (權益)
  - 3110: Share Capital (股本)
  - 3300: Capital Surplus (資本公積)
  - 3432: Retained Earnings (累積盈虧)
  - 3440: Current Period Income (本期損益)

- **4000 series**: Operating Revenue (營業收入)
- **5000 series**: Cost of Sales (營業成本)
- **6000 series**: Operating Expenses (營業費用)
- **7000 series**: Non-Operating Income (非營業收入)
- **8000 series**: Non-Operating Expenses (非營業費用)
- **9999**: Income Tax Expense (所得稅費用)

**Sample Data**:
```json
Row 3:  ["1111", "現金", 36270, 0, 738871, 738931, 0, 60, 36210, 0]
Row 15: ["1123", "應收帳款", 7243970, 0, 56138414, 49937404, 6201010, 0, 13444980, 0]
Row 200: ["4101", "營業收入", 0, 0, 3807148, 57160151, 0, 53353003, 0, 53353003]
```

### BS Sheet (Balance Sheet Mapping) - Detailed Structure

**Purpose**: Maps TB accounts to balance sheet line items with hierarchical structure

**Column Structure**:
```
A-D: Assets Side
  A: Asset Account Code
  B: Asset Account Name
  C: Asset Subtotal Amount
  D: Asset Total Amount

E-H: Liabilities & Equity Side
  E: Liability/Equity Account Code
  F: Liability/Equity Account Name
  G: Liability/Equity Subtotal Amount
  H: Liability/Equity Total Amount
```

**Mapping Pattern**:
- **Header accounts** (合計 rows): Show category totals with amount in column D (assets) or H (liabilities/equity)
- **Detail accounts**: Show individual line items with amounts in column C (assets) or G (liabilities/equity)
- **Hierarchy**: Uses account code structure (1100 → 1111, 1112-X sub-items)

**Example**:
```json
Row 1: ["1100", "流動資產", 0, 28124966, "2100", "流動負債", 0, 22673269]
Row 2: ["1111", "現金", 36210, 0, "2110", "短期借款", 6701448, 0]
Row 3: ["1112-1", "銀行存款-合作金庫", 2053658, 0, "2112-1", "一年內到期長期借款", 6701448, 0]
```

**Key Features**:
- Parallel structure: Assets on left, Liabilities/Equity on right
- Negative amounts for contra accounts (e.g., accumulated depreciation)
- Balance verification: Total Assets = Total Liabilities + Equity

### IS Sheet (Income Statement Mapping) - Detailed Structure

**Purpose**: Maps TB revenue/expense accounts to income statement format with percentages

**Column Structure**:
```
A: 項目代號 (Item Code)
B: 項目名稱 (Item Name)
C: 小計金額 (Subtotal Amount)
D: 合計金額 (Total Amount)
E: 百分比 (Percentage)
```

**Structure Pattern**:
- **Section headers**: Have amounts in column D and percentages in column E
- **Detail line items**: Have amounts in column C
- **Calculation sections**: Show build-up of costs

**Key Sections**:
1. Revenue (rows 1-5): Operating revenue net of returns/allowances
2. Cost of Sales (rows 6-40): Manufacturing cost breakdown
3. Operating Expenses (rows 42-63): Selling, general & administrative
4. Non-Operating Items (rows 65-70): Interest income/expense
5. Pre-tax and After-tax Income (rows 71-73)

**Example**:
```json
Row 1: ["4000", "營業收入淨額", 0, 52599315, 100]
Row 6: ["5900", "營業成本", 0, 33039914, 62.81]
Row 8: ["5100", "直接原料", 9063511, 0, 17.23]
```

---

## Transformation Requirements

### Overview
Transform TB data using BS/IS mapping structures into 4 formatted financial statements.

### 1. 資產負債表 (Balance Sheet) Transformation

**Input**: TB sheet + BS sheet mapping

**Process**:
1. Read BS sheet to understand account hierarchy
2. For each account in BS sheet:
   - Look up account code in TB sheet
   - Extract ending balance (期末借餘 for assets, 期末貸餘 for liabilities)
3. Calculate subtotals for each category
4. Verify: Total Assets = Total Liabilities + Equity

**Key Calculations**:
- Assets: Use 期末借餘 (ending debit balance)
- Liabilities/Equity: Use 期末貸餘 (ending credit balance)
- Contra accounts: Apply negative sign (e.g., accumulated depreciation)

**Output Format**:
- Two-column layout (Assets | Liabilities & Equity)
- Hierarchical with indentation
- Subtotals and grand totals
- Optional: Comparative periods (113年, 112年)

### 2. 綜合損益表 (Income Statement) Transformation

**Input**: TB sheet + IS sheet mapping

**Process**:
1. Read IS sheet for account sequence
2. For each revenue/expense account:
   - Look up in TB sheet
   - Extract period amount (本期貸餘 for revenue, 本期借餘 for expenses)
3. Calculate net amounts and percentages

**Key Calculations**:
- Revenue: Use 本期貸餘 (period credit balance)
- Expenses: Use 本期借餘 (period debit balance)
- Net Revenue = Revenue - Returns/Allowances
- Gross Profit = Net Revenue - COGS
- Operating Income = Gross Profit - Operating Expenses
- Percentages = (Line Item / Net Revenue) × 100

**Output Format**:
- Single column with amounts and percentages
- Hierarchical structure
- Subtotals at each level

### 3. 權益變動表 (Statement of Changes in Equity)

**Input**: TB sheet equity accounts (3000 series) + prior period data

**Key Components**:
- Beginning balance (from TB 期初 balances)
- Capital changes (3110 changes)
- Appropriations (if any)
- Current period income (3440 or from IS calculation)
- Ending balance (from TB 期末 balances)

**Output Format**:
- Matrix: Columns (Share Capital, Capital Surplus, Retained Earnings, Total)
- Rows: Beginning → Changes → Ending

### 4. 現金流量表 (Cash Flow Statement)

**Input**: TB sheet + comparative period TB + reconciliation logic

**Sections**:
1. **Operating Activities**:
   - Start with net income
   - Add back: Depreciation, amortization
   - Adjust for working capital changes

2. **Investing Activities**:
   - PP&E purchases (1400 series changes)
   - Asset disposals

3. **Financing Activities**:
   - Borrowing changes (2112-1, 2220)
   - Capital increases (3110)

**Key Calculations**:
- Working capital Δ = Current assets Δ - Current liabilities Δ
- Depreciation = Accumulated depreciation increases
- Cash flow = Net income + Non-cash items ± Working capital

---

## Implementation Plan

### Phase 1: Parser Enhancement (Week 1)
**Goal**: Parse TB, BS, IS sheets from uploaded Excel

**Tasks**:
1. ✅ Already have: `packages/audit/app/utils/excel/parser.ts`
2. Create specialized parsers:
   - `tb-parser.ts`: Parse trial balance with all 10 columns
   - `mapping-parser.ts`: Parse BS and IS mapping structures
3. Add validation for required columns and data types

**Deliverables**:
- `parseTrialBalanceSheet(file: File): Promise<TrialBalanceEntry[]>`
- `parseBalanceSheetMapping(file: File): Promise<AccountMapping[]>`
- `parseIncomeStatementMapping(file: File): Promise<AccountMapping[]>`

### Phase 2: Transformation Engine (Week 2)
**Goal**: Client-side transformation logic

**Tasks**:
1. Create `FinancialStatementTransformer` class
2. Implement transformation methods:
   - `transformToBalanceSheet()`
   - `transformToIncomeStatement()`
   - `transformToEquityChanges()`
   - `transformToCashFlow()`
3. Handle special cases (contra accounts, subtotals, percentages)

**Deliverables**:
- `packages/audit/app/utils/services/financial-transformer.ts`
- Full type definitions in `packages/audit/app/types/financial.ts`

### Phase 3: Store Integration (Week 3)
**Goal**: Add financial transformation to audit builder store

**Tasks**:
1. Extend `auditBuilder` store with:
   - `tbData: TrialBalanceEntry[]`
   - `bsMapping: AccountMapping[]`
   - `isMapping: AccountMapping[]`
   - `generatedStatements: { bs, is, equity, cashFlow }`
2. Add actions:
   - `uploadAndParseExcel(file: File)`
   - `generateFinancialStatements()`
   - `clearFinancialData()`

**Deliverables**:
- Updated `packages/audit/app/composables/stores/auditBuilder.ts`

### Phase 4: UI Components (Week 4-5)
**Goal**: Build user interface for upload and display

**Tasks**:
1. Create upload workflow:
   - `FinancialUpload.vue`: Excel file upload component
   - Show parsing progress and validation results

2. Create statement display components:
   - `BalanceSheetDisplay.vue`: Two-column layout
   - `IncomeStatementDisplay.vue`: Hierarchical with %
   - `EquityChangesDisplay.vue`: Matrix layout
   - `CashFlowDisplay.vue`: Three-section layout
   - `StatementLineItems.vue`: Reusable line renderer

3. Add to builder page:
   - New tab: "財報轉換" (Financial Transformation)
   - Integration with existing builder tabs

**Deliverables**:
- Complete component tree in `packages/audit/app/components/financial/`
- New builder tab integrated

### Phase 5: Testing & Polish (Week 6)
**Goal**: Validate accuracy and user experience

**Tasks**:
1. Unit tests for transformation logic
2. Test with example Excel file
3. Verify calculations match expected output
4. Add error handling and user feedback
5. Performance optimization for large TB files

**Deliverables**:
- Test files in `packages/audit/tests/financial/`
- Documentation in component files

---

## Component Structure

```
packages/audit/app/
├── components/
│   ├── builder/
│   │   ├── OpinionBuilder.vue (existing)
│   │   ├── ExcelTablesBuilder.vue (existing)
│   │   └── FinancialTransformBuilder.vue (NEW - main tab)
│   │
│   └── financial/ (NEW directory)
│       ├── FinancialUpload.vue
│       ├── BalanceSheetDisplay.vue
│       ├── IncomeStatementDisplay.vue
│       ├── EquityChangesDisplay.vue
│       ├── CashFlowDisplay.vue
│       ├── StatementLineItems.vue
│       └── TransformationControls.vue
│
├── utils/
│   ├── excel/
│   │   ├── parser.ts (existing)
│   │   ├── tb-parser.ts (NEW)
│   │   └── mapping-parser.ts (NEW)
│   │
│   └── services/
│       └── financial-transformer.ts (NEW)
│
├── types/
│   └── financial.ts (NEW)
│
└── composables/
    └── stores/
        └── auditBuilder.ts (extend existing)
```

---

## Implementation Details

### Type Definitions

```typescript
// packages/audit/app/types/financial.ts

/**
 * Trial Balance Entry (TB Sheet Row)
 */
export interface TrialBalanceEntry {
  accountCode: string;           // 會計項目
  accountName: string;            // 科項名稱
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
 */
export interface AccountMapping {
  sequenceOrder: number;
  statementLineCode: string;
  statementLineName: string;
  tbAccountCodes: string[];
  isSubtotal: boolean;
  isContraAccount: boolean;
  indentLevel: number;
  side?: 'asset' | 'liability' | 'equity';  // For BS
  section?: 'revenue' | 'cogs' | 'opex' | 'non-op';  // For IS
}

/**
 * Statement Line Item (Output)
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
 * Complete Financial Statement
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
```

### TB Parser Implementation

```typescript
// packages/audit/app/utils/excel/tb-parser.ts

import * as XLSX from 'xlsx';
import type { TrialBalanceEntry } from '../../types/financial';

export async function parseTrialBalanceSheet(
  file: File
): Promise<{ entries: TrialBalanceEntry[]; error?: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Find TB sheet
    const tbSheet = workbook.Sheets['TB'];
    if (!tbSheet) {
      return { entries: [], error: 'TB sheet not found in Excel file' };
    }

    const range = XLSX.utils.decode_range(tbSheet['!ref'] || 'A1');
    const entries: TrialBalanceEntry[] = [];

    // Skip header row (row 0), start from row 1
    for (let row = 1; row <= range.e.r; row++) {
      const accountCode = getCellValue(tbSheet, row, 0);
      const accountName = getCellValue(tbSheet, row, 1);

      // Skip empty rows or summary rows without account code
      if (!accountCode || !accountName) continue;

      entries.push({
        accountCode: String(accountCode),
        accountName: String(accountName),
        beginningDebit: getNumericValue(tbSheet, row, 2) || 0,
        beginningCredit: getNumericValue(tbSheet, row, 3) || 0,
        periodDebit: getNumericValue(tbSheet, row, 4) || 0,
        periodCredit: getNumericValue(tbSheet, row, 5) || 0,
        periodDebitBalance: getNumericValue(tbSheet, row, 6) || 0,
        periodCreditBalance: getNumericValue(tbSheet, row, 7) || 0,
        endingDebitBalance: getNumericValue(tbSheet, row, 8) || 0,
        endingCreditBalance: getNumericValue(tbSheet, row, 9) || 0,
      });
    }

    return { entries };
  } catch (error) {
    return {
      entries: [],
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    };
  }
}

function getCellValue(sheet: XLSX.WorkSheet, row: number, col: number): any {
  const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  const cell = sheet[cellAddress];
  return cell ? cell.v : null;
}

function getNumericValue(sheet: XLSX.WorkSheet, row: number, col: number): number | null {
  const value = getCellValue(sheet, row, col);
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/,/g, ''));
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}
```

### BS Mapping Parser Implementation

```typescript
// packages/audit/app/utils/excel/mapping-parser.ts

import * as XLSX from 'xlsx';
import type { AccountMapping } from '../../types/financial';

export async function parseBalanceSheetMapping(
  file: File
): Promise<{ mappings: AccountMapping[]; error?: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const bsSheet = workbook.Sheets['BS'];
    if (!bsSheet) {
      return { mappings: [], error: 'BS sheet not found' };
    }

    const mappings: AccountMapping[] = [];
    const range = XLSX.utils.decode_range(bsSheet['!ref'] || 'A1');

    // Process each row
    for (let row = 1; row <= range.e.r; row++) {
      // Asset side (columns A-D)
      const assetCode = getCellValue(bsSheet, row, 0);
      const assetName = getCellValue(bsSheet, row, 1);
      const assetSubtotal = getNumericValue(bsSheet, row, 2);
      const assetTotal = getNumericValue(bsSheet, row, 3);

      if (assetCode || assetName) {
        const isSubtotal = assetTotal !== null && assetTotal !== 0;
        mappings.push({
          sequenceOrder: mappings.length,
          statementLineCode: String(assetCode || ''),
          statementLineName: String(assetName || ''),
          tbAccountCodes: assetCode ? [String(assetCode)] : [],
          isSubtotal,
          isContraAccount: (assetSubtotal || assetTotal || 0) < 0,
          indentLevel: determineIndentLevel(assetCode, assetName),
          side: 'asset',
        });
      }

      // Liability/Equity side (columns E-H)
      const liabCode = getCellValue(bsSheet, row, 4);
      const liabName = getCellValue(bsSheet, row, 5);
      const liabSubtotal = getNumericValue(bsSheet, row, 6);
      const liabTotal = getNumericValue(bsSheet, row, 7);

      if (liabCode || liabName) {
        const isSubtotal = liabTotal !== null && liabTotal !== 0;
        const side = String(liabCode).startsWith('2') ? 'liability' : 'equity';

        mappings.push({
          sequenceOrder: mappings.length,
          statementLineCode: String(liabCode || ''),
          statementLineName: String(liabName || ''),
          tbAccountCodes: liabCode ? [String(liabCode)] : [],
          isSubtotal,
          isContraAccount: false,
          indentLevel: determineIndentLevel(liabCode, liabName),
          side,
        });
      }
    }

    return { mappings };
  } catch (error) {
    return {
      mappings: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function determineIndentLevel(code?: any, name?: any): number {
  const codeStr = String(code || '');
  const nameStr = String(name || '');

  // Level 0: Major categories (ends with 000)
  if (/\d000$/.test(codeStr)) return 0;

  // Level 1: Subcategories (ends with 00)
  if (/\d00$/.test(codeStr)) return 1;

  // Level 2: Account groups (ends with 0)
  if (/\d0$/.test(codeStr) && !codeStr.includes('-')) return 2;

  // Level 3: Individual accounts
  return 3;
}

// Helper functions from tb-parser
function getCellValue(sheet: XLSX.WorkSheet, row: number, col: number): any {
  const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  const cell = sheet[cellAddress];
  return cell ? cell.v : null;
}

function getNumericValue(sheet: XLSX.WorkSheet, row: number, col: number): number | null {
  const value = getCellValue(sheet, row, col);
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/,/g, ''));
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}
```

### IS Mapping Parser Implementation

```typescript
// packages/audit/app/utils/excel/mapping-parser.ts (continued)

export async function parseIncomeStatementMapping(
  file: File
): Promise<{ mappings: AccountMapping[]; error?: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const isSheet = workbook.Sheets['IS'];
    if (!isSheet) {
      return { mappings: [], error: 'IS sheet not found' };
    }

    const mappings: AccountMapping[] = [];
    const range = XLSX.utils.decode_range(isSheet['!ref'] || 'A1');

    for (let row = 1; row <= range.e.r; row++) {
      const lineCode = getCellValue(isSheet, row, 0);
      const lineName = getCellValue(isSheet, row, 1);
      const subtotal = getNumericValue(isSheet, row, 2);
      const total = getNumericValue(isSheet, row, 3);
      const percentage = getNumericValue(isSheet, row, 4);

      if (!lineCode && !lineName) continue;

      const isSubtotal = total !== null && total !== 0;

      mappings.push({
        sequenceOrder: mappings.length,
        statementLineCode: String(lineCode || ''),
        statementLineName: String(lineName || ''),
        tbAccountCodes: lineCode ? [String(lineCode)] : [],
        isSubtotal,
        isContraAccount: false,
        indentLevel: determineISIndentLevel(lineName),
        section: determineSection(lineCode),
      });
    }

    return { mappings };
  } catch (error) {
    return {
      mappings: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function determineISIndentLevel(name?: any): number {
  const nameStr = String(name || '');

  // Count leading spaces (typically 2 spaces per level)
  const leadingSpaces = nameStr.match(/^[\s　]+/)?.[0].length || 0;
  return Math.min(Math.floor(leadingSpaces / 2), 4);
}

function determineSection(code?: any): 'revenue' | 'cogs' | 'opex' | 'non-op' {
  const codeStr = String(code || '');
  const prefix = codeStr.charAt(0);

  switch (prefix) {
    case '4': return 'revenue';
    case '5': return 'cogs';
    case '6': return 'opex';
    case '7':
    case '8': return 'non-op';
    default: return 'opex';
  }
}
```

### Transformation Engine Implementation

```typescript
// packages/audit/app/utils/services/financial-transformer.ts

import type {
  TrialBalanceEntry,
  AccountMapping,
  StatementLineItem,
  FinancialStatementSet,
} from '../../types/financial';

export class FinancialStatementTransformer {
  private tbMap: Map<string, TrialBalanceEntry>;
  private bsMapping: AccountMapping[];
  private isMapping: AccountMapping[];

  constructor(
    tbEntries: TrialBalanceEntry[],
    bsMapping: AccountMapping[],
    isMapping: AccountMapping[]
  ) {
    this.tbMap = new Map(
      tbEntries.map(entry => [entry.accountCode, entry])
    );
    this.bsMapping = bsMapping;
    this.isMapping = isMapping;
  }

  /**
   * Generate all financial statements
   */
  generateAll(companyName: string, periodYear: number): FinancialStatementSet {
    return {
      balanceSheet: this.generateBalanceSheet(),
      incomeStatement: this.generateIncomeStatement(),
      equityChanges: this.generateEquityChanges(),
      cashFlow: this.generateCashFlow(),
      metadata: {
        companyName,
        periodYear,
        generatedAt: new Date(),
      },
    };
  }

  /**
   * Generate Balance Sheet
   */
  generateBalanceSheet(): StatementLineItem[] {
    const lineItems: StatementLineItem[] = [];

    for (const mapping of this.bsMapping) {
      if (!mapping.side) continue;

      const amount = this.calculateMappingAmount(mapping, 'balance_sheet');

      lineItems.push({
        lineCode: mapping.statementLineCode,
        lineName: mapping.statementLineName,
        amount,
        indentLevel: mapping.indentLevel,
        isSubtotal: mapping.isSubtotal,
      });
    }

    return lineItems;
  }

  /**
   * Generate Income Statement
   */
  generateIncomeStatement(): StatementLineItem[] {
    const lineItems: StatementLineItem[] = [];

    // Calculate net revenue first for percentage calculations
    const netRevenue = this.calculateNetRevenue();

    for (const mapping of this.isMapping) {
      const amount = this.calculateMappingAmount(mapping, 'income_statement');
      const percentage = netRevenue !== 0 ? (amount / netRevenue) * 100 : 0;

      lineItems.push({
        lineCode: mapping.statementLineCode,
        lineName: mapping.statementLineName,
        amount,
        percentage: mapping.section !== 'revenue' || mapping.isSubtotal ? percentage : undefined,
        indentLevel: mapping.indentLevel,
        isSubtotal: mapping.isSubtotal,
      });
    }

    return lineItems;
  }

  /**
   * Generate Statement of Changes in Equity
   */
  generateEquityChanges(): StatementLineItem[] {
    const lineItems: StatementLineItem[] = [];

    // Share Capital (3110)
    const shareCapital = this.getAccountEndingBalance('3110');

    // Capital Surplus (3300)
    const capitalSurplus = this.getAccountEndingBalance('3300');

    // Retained Earnings (3432)
    const retainedEarnings = this.getAccountEndingBalance('3432');

    // Current Period Income (3440)
    const currentIncome = this.getAccountEndingBalance('3440');

    lineItems.push(
      {
        lineCode: '3110',
        lineName: '股本',
        amount: shareCapital,
        indentLevel: 0,
        isSubtotal: false,
      },
      {
        lineCode: '3300',
        lineName: '資本公積',
        amount: capitalSurplus,
        indentLevel: 0,
        isSubtotal: false,
      },
      {
        lineCode: '3432',
        lineName: '累積盈虧',
        amount: retainedEarnings,
        indentLevel: 0,
        isSubtotal: false,
      },
      {
        lineCode: '3440',
        lineName: '本期損益',
        amount: currentIncome,
        indentLevel: 0,
        isSubtotal: false,
      },
      {
        lineCode: 'EQUITY_TOTAL',
        lineName: '權益總額',
        amount: shareCapital + capitalSurplus + retainedEarnings + currentIncome,
        indentLevel: 0,
        isSubtotal: true,
      }
    );

    return lineItems;
  }

  /**
   * Generate Cash Flow Statement
   * Note: Simplified version without comparative period
   */
  generateCashFlow(): StatementLineItem[] {
    const lineItems: StatementLineItem[] = [];

    // Operating Activities (simplified)
    const netIncome = this.calculateNetIncome();

    lineItems.push(
      {
        lineCode: 'CF_OP',
        lineName: '營業活動之現金流量',
        amount: netIncome,
        indentLevel: 0,
        isSubtotal: true,
      },
      {
        lineCode: 'CF_INV',
        lineName: '投資活動之現金流量',
        amount: 0,
        indentLevel: 0,
        isSubtotal: true,
      },
      {
        lineCode: 'CF_FIN',
        lineName: '籌資活動之現金流量',
        amount: 0,
        indentLevel: 0,
        isSubtotal: true,
      }
    );

    return lineItems;
  }

  /**
   * Calculate amount for a mapping
   */
  private calculateMappingAmount(
    mapping: AccountMapping,
    statementType: 'balance_sheet' | 'income_statement'
  ): number {
    if (mapping.tbAccountCodes.length === 0) {
      return 0;
    }

    let total = 0;

    for (const accountCode of mapping.tbAccountCodes) {
      const tbEntry = this.tbMap.get(accountCode);
      if (!tbEntry) continue;

      let amount = 0;

      if (statementType === 'balance_sheet') {
        // Use ending balance
        if (mapping.side === 'asset') {
          amount = tbEntry.endingDebitBalance;
        } else {
          amount = tbEntry.endingCreditBalance;
        }

        // Apply negative sign for contra accounts
        if (mapping.isContraAccount) {
          amount = -amount;
        }
      } else if (statementType === 'income_statement') {
        // Use period balance
        if (mapping.section === 'revenue' || mapping.section === 'non-op') {
          amount = tbEntry.periodCreditBalance;
        } else {
          amount = tbEntry.periodDebitBalance;
        }
      }

      total += amount;
    }

    return total;
  }

  /**
   * Calculate net revenue for percentage base
   */
  private calculateNetRevenue(): number {
    const revenue = this.getAccountBalance('4101', 'credit', 'period');
    const returns = this.getAccountBalance('4202', 'debit', 'period');
    return revenue - returns;
  }

  /**
   * Calculate net income
   */
  private calculateNetIncome(): number {
    // Try to get from equity account first
    const incomeEntry = this.tbMap.get('3440');
    if (incomeEntry) {
      return incomeEntry.endingCreditBalance;
    }

    // Otherwise calculate from revenue - expenses
    const revenue = this.calculateNetRevenue();
    const cogs = this.getAccountBalance('5900', 'debit', 'period');
    const opex = this.getAccountBalance('6000', 'debit', 'period');
    const tax = this.getAccountBalance('9999', 'debit', 'period');

    return revenue - cogs - opex - tax;
  }

  /**
   * Get account balance
   */
  private getAccountBalance(
    accountCode: string,
    balanceType: 'debit' | 'credit',
    period: 'ending' | 'period'
  ): number {
    const entry = this.tbMap.get(accountCode);
    if (!entry) return 0;

    if (period === 'ending') {
      return balanceType === 'debit' ? entry.endingDebitBalance : entry.endingCreditBalance;
    } else {
      return balanceType === 'debit' ? entry.periodDebitBalance : entry.periodCreditBalance;
    }
  }

  /**
   * Get account ending balance (automatically determines debit/credit)
   */
  private getAccountEndingBalance(accountCode: string): number {
    const entry = this.tbMap.get(accountCode);
    if (!entry) return 0;

    // Return whichever balance is non-zero
    return entry.endingDebitBalance || entry.endingCreditBalance;
  }
}
```

### Store Integration

```typescript
// Extend packages/audit/app/composables/stores/auditBuilder.ts

// Add to imports
import type {
  TrialBalanceEntry,
  AccountMapping,
  FinancialStatementSet,
} from '../../types/financial';
import { FinancialStatementTransformer } from '../../utils/services/financial-transformer';
import {
  parseTrialBalanceSheet,
  parseBalanceSheetMapping,
  parseIncomeStatementMapping,
} from '../../utils/excel/tb-parser';

// Add state
const tbData = ref<TrialBalanceEntry[]>([]);
const bsMapping = ref<AccountMapping[]>([]);
const isMapping = ref<AccountMapping[]>([]);
const generatedStatements = ref<FinancialStatementSet | null>(null);
const isProcessing = ref(false);

// Add actions
const uploadAndParseFinancialExcel = async (file: File) => {
  isProcessing.value = true;

  try {
    // Parse TB sheet
    const { entries: tbEntries, error: tbError } = await parseTrialBalanceSheet(file);
    if (tbError) {
      throw new Error(`TB parsing error: ${tbError}`);
    }

    // Parse BS mapping
    const { mappings: bsMappings, error: bsError } = await parseBalanceSheetMapping(file);
    if (bsError) {
      throw new Error(`BS parsing error: ${bsError}`);
    }

    // Parse IS mapping
    const { mappings: isMappings, error: isError } = await parseIncomeStatementMapping(file);
    if (isError) {
      throw new Error(`IS parsing error: ${isError}`);
    }

    // Store parsed data
    tbData.value = tbEntries;
    bsMapping.value = bsMappings;
    isMapping.value = isMappings;

    return {
      success: true,
      tbCount: tbEntries.length,
      bsCount: bsMappings.length,
      isCount: isMappings.length,
    };
  } catch (error) {
    console.error('Financial Excel parsing error:', error);
    throw error;
  } finally {
    isProcessing.value = false;
  }
};

const generateFinancialStatements = (companyName: string, periodYear: number) => {
  if (tbData.value.length === 0) {
    throw new Error('No trial balance data. Please upload Excel file first.');
  }

  const transformer = new FinancialStatementTransformer(
    tbData.value,
    bsMapping.value,
    isMapping.value
  );

  generatedStatements.value = transformer.generateAll(companyName, periodYear);

  return generatedStatements.value;
};

const clearFinancialData = () => {
  tbData.value = [];
  bsMapping.value = [];
  isMapping.value = [];
  generatedStatements.value = null;
};

// Add to return statement
return {
  // ... existing exports

  // Financial transformation state
  tbData,
  bsMapping,
  isMapping,
  generatedStatements,
  isProcessing,

  // Financial transformation actions
  uploadAndParseFinancialExcel,
  generateFinancialStatements,
  clearFinancialData,
};
```

### Main Upload Component

```vue
<!-- packages/audit/app/components/financial/FinancialUpload.vue -->
<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-file-spreadsheet" size="24" />
        <div>
          <h3 class="text-lg font-semibold">上傳財務報表 Excel</h3>
          <p class="text-sm text-gray-600">
            上傳包含 TB、BS、IS 工作表的 Excel 檔案
          </p>
        </div>
      </div>
    </template>

    <!-- Upload Zone -->
    <div
      class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
      :class="{
        'border-primary-400 bg-primary-50': isDragging,
        'border-gray-300 hover:border-gray-400': !isDragging && !isProcessing,
        'border-gray-200 bg-gray-50': isProcessing,
      }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <UIcon
        v-if="!isProcessing"
        :name="isDragging ? 'i-lucide-file-down' : 'i-lucide-upload'"
        class="h-12 w-12 mx-auto mb-4"
        :class="isDragging ? 'text-primary-500' : 'text-gray-400'"
      />

      <div v-if="isProcessing" class="flex items-center justify-center gap-3 mb-4">
        <UIcon name="i-lucide-loader-circle" class="h-8 w-8 text-primary-500 animate-spin" />
        <span class="text-lg font-medium text-gray-700">正在解析 Excel 檔案...</span>
      </div>

      <p v-if="!isProcessing" class="text-lg font-medium text-gray-700 mb-2">
        {{ isDragging ? '放開以上傳檔案' : '拖曳 Excel 檔案至此' }}
      </p>

      <p v-if="!isProcessing" class="text-sm text-gray-500 mb-4">或</p>

      <UButton
        v-if="!isProcessing"
        icon="i-lucide-folder-open"
        label="選擇檔案"
        color="primary"
        size="lg"
        @click="triggerFileInput"
      />

      <input
        ref="fileInput"
        type="file"
        accept=".xlsx,.xls"
        class="hidden"
        @change="handleFileSelect"
      />

      <p v-if="!isProcessing" class="text-xs text-gray-500 mt-4">
        需包含 TB（試算表）、BS（資產負債表）、IS（損益表）工作表
      </p>
    </div>

    <!-- Status Messages -->
    <UAlert
      v-if="uploadStatus"
      :color="uploadStatus.type === 'success' ? 'success' : 'error'"
      :title="uploadStatus.message"
      :closable="true"
      class="mt-4"
      @close="uploadStatus = null"
    />

    <!-- Parsed Data Summary -->
    <div v-if="parsedData" class="mt-6 space-y-4">
      <div class="border rounded-lg p-4 bg-gray-50">
        <h4 class="font-semibold mb-3">解析結果</h4>
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div class="text-gray-600">TB 會計科目</div>
            <div class="text-2xl font-bold text-primary">{{ parsedData.tbCount }}</div>
          </div>
          <div>
            <div class="text-gray-600">BS 對應項目</div>
            <div class="text-2xl font-bold text-primary">{{ parsedData.bsCount }}</div>
          </div>
          <div>
            <div class="text-gray-600">IS 對應項目</div>
            <div class="text-2xl font-bold text-primary">{{ parsedData.isCount }}</div>
          </div>
        </div>
      </div>

      <!-- Company Info Input -->
      <UCard>
        <UForm :state="formState" class="space-y-4">
          <UFormField label="公司名稱" name="companyName" required>
            <UInput
              v-model="formState.companyName"
              placeholder="請輸入公司名稱"
            />
          </UFormField>

          <UFormField label="會計年度（民國）" name="periodYear" required>
            <UInputNumber
              v-model="formState.periodYear"
              :min="100"
              :max="150"
            />
          </UFormField>
        </UForm>
      </UCard>
    </div>

    <template v-if="parsedData" #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="清除資料"
          color="neutral"
          variant="outline"
          @click="handleClear"
        />
        <UButton
          label="產生財務報表"
          color="primary"
          icon="i-lucide-file-text"
          :disabled="!formState.companyName || !formState.periodYear"
          @click="handleGenerate"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
const store = useAuditBuilderStore();
const { uploadAndParseFinancialExcel, generateFinancialStatements, clearFinancialData } = store;
const { isProcessing } = storeToRefs(store);

const emit = defineEmits<{
  generated: [];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const uploadStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null);
const parsedData = ref<{ tbCount: number; bsCount: number; isCount: number } | null>(null);

const formState = ref({
  companyName: '',
  periodYear: new Date().getFullYear() - 1911, // Current ROC year
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    processFile(file);
  }

  // Reset input
  if (target) {
    target.value = '';
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;

  const file = event.dataTransfer?.files[0];
  if (file) {
    processFile(file);
  }
};

const processFile = async (file: File) => {
  uploadStatus.value = null;
  parsedData.value = null;

  // Validate file type
  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    uploadStatus.value = {
      type: 'error',
      message: '不支援的檔案格式，請上傳 Excel 檔案（.xlsx, .xls）',
    };
    return;
  }

  try {
    const result = await uploadAndParseFinancialExcel(file);

    parsedData.value = result;
    uploadStatus.value = {
      type: 'success',
      message: `成功解析 Excel 檔案：${result.tbCount} 筆 TB 科目，${result.bsCount} 筆 BS 項目，${result.isCount} 筆 IS 項目`,
    };
  } catch (error) {
    uploadStatus.value = {
      type: 'error',
      message: error instanceof Error ? error.message : '解析失敗',
    };
  }
};

const handleGenerate = () => {
  try {
    generateFinancialStatements(
      formState.value.companyName,
      formState.value.periodYear
    );

    uploadStatus.value = {
      type: 'success',
      message: '財務報表產生成功！',
    };

    emit('generated');
  } catch (error) {
    uploadStatus.value = {
      type: 'error',
      message: error instanceof Error ? error.message : '產生失敗',
    };
  }
};

const handleClear = () => {
  if (confirm('確定要清除已上傳的資料嗎？')) {
    clearFinancialData();
    parsedData.value = null;
    uploadStatus.value = null;
    formState.value = {
      companyName: '',
      periodYear: new Date().getFullYear() - 1911,
    };
  }
};
</script>
```

### Balance Sheet Display Component

```vue
<!-- packages/audit/app/components/financial/BalanceSheetDisplay.vue -->
<template>
  <UCard>
    <template #header>
      <div class="text-center">
        <h2 class="text-2xl font-bold">{{ companyName }}</h2>
        <h3 class="text-xl font-semibold mt-2">資產負債表</h3>
        <p class="text-sm text-gray-600 mt-1">
          民國{{ periodYear }}年12月31日
        </p>
        <p class="text-xs text-gray-500">單位：新台幣元</p>
      </div>
    </template>

    <div class="grid grid-cols-2 gap-8">
      <!-- Assets Side -->
      <div>
        <div class="border-b-2 border-gray-800 pb-2 mb-4">
          <h4 class="text-lg font-bold text-center">資產</h4>
        </div>

        <StatementLineItems
          :items="assetItems"
          :show-amount="true"
        />
      </div>

      <!-- Liabilities & Equity Side -->
      <div>
        <div class="border-b-2 border-gray-800 pb-2 mb-4">
          <h4 class="text-lg font-bold text-center">負債及股東權益</h4>
        </div>

        <StatementLineItems
          :items="liabilityEquityItems"
          :show-amount="true"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center border-t-2 pt-4">
        <div class="text-sm font-semibold">
          資產總額: {{ formatCurrency(totalAssets) }}
        </div>
        <div class="text-sm font-semibold">
          負債及權益總額: {{ formatCurrency(totalLiabilitiesEquity) }}
        </div>
      </div>

      <div
        v-if="Math.abs(totalAssets - totalLiabilitiesEquity) > 0.01"
        class="mt-2 text-center"
      >
        <UAlert
          color="warning"
          title="警告：資產負債表不平衡"
          :description="`差異金額：${formatCurrency(totalAssets - totalLiabilitiesEquity)}`"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { StatementLineItem } from '../../types/financial';

const props = defineProps<{
  lineItems: StatementLineItem[];
  companyName: string;
  periodYear: number;
}>();

const assetItems = computed(() =>
  props.lineItems.filter(item => {
    const code = item.lineCode;
    return code.startsWith('1') || code === '資產總額';
  })
);

const liabilityEquityItems = computed(() =>
  props.lineItems.filter(item => {
    const code = item.lineCode;
    return code.startsWith('2') || code.startsWith('3') || code.includes('負債') || code.includes('權益');
  })
);

const totalAssets = computed(() => {
  const totalItem = assetItems.value.find(item =>
    item.lineCode === '1000' || item.lineName.includes('資產總額')
  );
  return totalItem?.amount || 0;
});

const totalLiabilitiesEquity = computed(() => {
  const totalItem = liabilityEquityItems.value.find(item =>
    item.lineName.includes('負債及權益總額') || item.lineName.includes('負債及股東權益總額')
  );
  return totalItem?.amount || 0;
});

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
</script>
```

### Income Statement Display Component

```vue
<!-- packages/audit/app/components/financial/IncomeStatementDisplay.vue -->
<template>
  <UCard>
    <template #header>
      <div class="text-center">
        <h2 class="text-2xl font-bold">{{ companyName }}</h2>
        <h3 class="text-xl font-semibold mt-2">綜合損益表</h3>
        <p class="text-sm text-gray-600 mt-1">
          民國{{ periodYear }}年1月1日至民國{{ periodYear }}年12月31日
        </p>
        <p class="text-xs text-gray-500">單位：新台幣元</p>
      </div>
    </template>

    <div class="space-y-2">
      <div class="grid grid-cols-12 gap-2 font-semibold text-sm border-b-2 pb-2">
        <div class="col-span-7">項目</div>
        <div class="col-span-3 text-right">金額</div>
        <div class="col-span-2 text-right">百分比</div>
      </div>

      <StatementLineItems
        :items="lineItems"
        :show-amount="true"
        :show-percentage="true"
      />
    </div>

    <template #footer>
      <div class="border-t-2 pt-4">
        <div class="flex justify-between items-center font-bold">
          <span>本期稅後淨利（損）</span>
          <span>{{ formatCurrency(netIncome) }}</span>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { StatementLineItem } from '../../types/financial';

const props = defineProps<{
  lineItems: StatementLineItem[];
  companyName: string;
  periodYear: number;
}>();

const netIncome = computed(() => {
  const netIncomeItem = props.lineItems.find(item =>
    item.lineName.includes('本期稅後淨利') ||
    item.lineName.includes('本期淨利') ||
    item.lineCode === 'NET_INCOME'
  );
  return netIncomeItem?.amount || 0;
});

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
</script>
```

### Reusable Line Items Component

```vue
<!-- packages/audit/app/components/financial/StatementLineItems.vue -->
<template>
  <div class="space-y-1">
    <div
      v-for="item in items"
      :key="item.lineCode"
      class="grid grid-cols-12 gap-2 py-1"
      :class="{
        'font-bold border-t border-gray-400': item.isSubtotal,
        'text-gray-700': !item.isSubtotal,
      }"
      :style="{ paddingLeft: `${item.indentLevel * 1}rem` }"
    >
      <div class="col-span-7">
        {{ item.lineName }}
      </div>

      <div
        v-if="showAmount"
        class="col-span-3 text-right font-mono"
        :class="{ 'font-bold': item.isSubtotal }"
      >
        {{ formatAmount(item.amount) }}
      </div>

      <div
        v-if="showPercentage"
        class="col-span-2 text-right text-sm"
        :class="item.isSubtotal ? 'font-semibold' : 'text-gray-600'"
      >
        {{ item.percentage !== undefined ? formatPercentage(item.percentage) : '' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StatementLineItem } from '../../types/financial';

defineProps<{
  items: StatementLineItem[];
  showAmount?: boolean;
  showPercentage?: boolean;
}>();

function formatAmount(amount: number): string {
  if (amount === 0) return '-';

  const formatted = new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return amount < 0 ? `(${formatted})` : formatted;
}

function formatPercentage(percentage: number): string {
  return percentage.toFixed(2) + '%';
}
</script>
```

### Main Builder Tab Component

```vue
<!-- packages/audit/app/components/builder/FinancialTransformBuilder.vue -->
<template>
  <div class="space-y-6">
    <!-- Upload Section -->
    <FinancialUpload @generated="showStatements = true" />

    <!-- Generated Statements Display -->
    <div v-if="showStatements && generatedStatements" class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">產生的財務報表</h2>
        <UButton
          label="下載全部報表"
          icon="i-lucide-download"
          color="primary"
          @click="downloadAll"
        />
      </div>

      <!-- Tabs for Different Statements -->
      <UTabs v-model="selectedStatement" :items="statementTabs" />

      <!-- Balance Sheet -->
      <BalanceSheetDisplay
        v-if="selectedStatement === 'balance_sheet'"
        :line-items="generatedStatements.balanceSheet"
        :company-name="generatedStatements.metadata.companyName"
        :period-year="generatedStatements.metadata.periodYear"
      />

      <!-- Income Statement -->
      <IncomeStatementDisplay
        v-if="selectedStatement === 'income_statement'"
        :line-items="generatedStatements.incomeStatement"
        :company-name="generatedStatements.metadata.companyName"
        :period-year="generatedStatements.metadata.periodYear"
      />

      <!-- Equity Changes -->
      <UCard v-if="selectedStatement === 'equity_changes'">
        <template #header>
          <h3 class="text-xl font-semibold text-center">權益變動表</h3>
        </template>
        <StatementLineItems
          :items="generatedStatements.equityChanges"
          :show-amount="true"
        />
      </UCard>

      <!-- Cash Flow -->
      <UCard v-if="selectedStatement === 'cash_flow'">
        <template #header>
          <h3 class="text-xl font-semibold text-center">現金流量表</h3>
        </template>
        <StatementLineItems
          :items="generatedStatements.cashFlow"
          :show-amount="true"
        />
      </UCard>
    </div>

    <!-- Empty State -->
    <UCard v-else-if="!showStatements" class="border-dashed">
      <div class="text-center py-12 text-gray-500">
        <UIcon name="i-lucide-file-spreadsheet" class="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p class="text-lg font-medium mb-2">尚未產生財務報表</p>
        <p class="text-sm">請先上傳包含 TB、BS、IS 的 Excel 檔案</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const store = useAuditBuilderStore();
const { generatedStatements } = storeToRefs(store);

const showStatements = ref(false);
const selectedStatement = ref<'balance_sheet' | 'income_statement' | 'equity_changes' | 'cash_flow'>('balance_sheet');

const statementTabs = computed(() => [
  {
    label: '資產負債表',
    value: 'balance_sheet',
    icon: 'i-lucide-layout-grid',
  },
  {
    label: '綜合損益表',
    value: 'income_statement',
    icon: 'i-lucide-trending-up',
  },
  {
    label: '權益變動表',
    value: 'equity_changes',
    icon: 'i-lucide-arrow-right-left',
  },
  {
    label: '現金流量表',
    value: 'cash_flow',
    icon: 'i-lucide-dollar-sign',
  },
]);

const downloadAll = () => {
  // TODO: Implement download functionality
  console.log('Download all statements');
};
</script>
```

---

## Testing Strategy

### Unit Tests

```typescript
// packages/audit/tests/financial/tb-parser.test.ts
import { describe, it, expect } from 'vitest';
import { parseTrialBalanceSheet } from '../../app/utils/excel/tb-parser';

describe('TB Parser', () => {
  it('should parse TB sheet correctly', async () => {
    const file = new File([], 'test.xlsx');
    const result = await parseTrialBalanceSheet(file);

    expect(result.entries).toBeDefined();
    expect(result.entries.length).toBeGreaterThan(0);
  });

  it('should handle missing TB sheet', async () => {
    const file = new File([], 'no-tb.xlsx');
    const result = await parseTrialBalanceSheet(file);

    expect(result.error).toBeDefined();
    expect(result.entries.length).toBe(0);
  });
});
```

### Integration Tests

```typescript
// packages/audit/tests/financial/transformer.test.ts
import { describe, it, expect } from 'vitest';
import { FinancialStatementTransformer } from '../../app/utils/services/financial-transformer';

describe('Financial Statement Transformer', () => {
  it('should generate balance sheet', () => {
    const transformer = new FinancialStatementTransformer(
      mockTBData,
      mockBSMapping,
      mockISMapping
    );

    const bs = transformer.generateBalanceSheet();

    expect(bs).toBeDefined();
    expect(bs.length).toBeGreaterThan(0);
  });

  it('should calculate percentages in income statement', () => {
    const transformer = new FinancialStatementTransformer(
      mockTBData,
      mockBSMapping,
      mockISMapping
    );

    const is = transformer.generateIncomeStatement();

    const revenueItem = is.find(item => item.lineCode === '4000');
    expect(revenueItem?.percentage).toBe(100);
  });
});
```

### Manual Testing Checklist

- [ ] Upload example Financial Report.xlsx
- [ ] Verify TB parsing: 386 rows extracted
- [ ] Verify BS mapping: Assets and Liabilities parsed
- [ ] Verify IS mapping: Revenue and expenses parsed
- [ ] Generate balance sheet: Assets = Liabilities + Equity
- [ ] Generate income statement: Percentages sum correctly
- [ ] Display formatting: Numbers, indentation correct
- [ ] Error handling: Invalid file, missing sheets
- [ ] Performance: Large files (1000+ accounts) load quickly

---

## Next Steps

### Immediate (Week 1-2)
1. Implement TB parser with all 10 columns
2. Implement BS and IS mapping parsers
3. Create basic transformation engine
4. Test with example Excel file

### Short-term (Week 3-4)
5. Build upload UI component
6. Create statement display components
7. Integrate into builder page
8. Add error handling

### Medium-term (Week 5-6)
9. Add export functionality (PDF/Word)
10. Implement comparative period support
11. Add validation and warnings
12. Performance optimization

### Long-term (Future)
- Backend integration (save to database)
- Multi-period comparison
- Customizable account mappings
- Automated reconciliation checks
- XBRL export support

---

## Reference Files

- Example Excel: `/packages/audit/examples/Financial Report.xlsx`
- Existing parser: `/packages/audit/app/utils/excel/parser.ts`
- Store: `/packages/audit/app/composables/stores/auditBuilder.ts`
- Builder page: `/packages/audit/app/pages/builder.vue`

---

**Document Version**: 1.0
**Last Updated**: 2025-11-10
**Author**: Claude Code Implementation
