import * as XLSX from 'xlsx';
import type { TrialBalanceEntry, TBParseResult } from '../../types/financial';

/**
 * Parse Trial Balance (TB) sheet from Excel file
 *
 * Expected structure:
 * - Column A: 會計項目 (Account Code)
 * - Column B: 科項名稱 (Account Name)
 * - Column C: 期初借方 (Beginning Debit)
 * - Column D: 期初貸方 (Beginning Credit)
 * - Column E: 本期借方 (Period Debit)
 * - Column F: 本期貸方 (Period Credit)
 * - Column G: 本期借餘 (Period Debit Balance)
 * - Column H: 本期貸餘 (Period Credit Balance)
 * - Column I: 期末借餘 (Ending Debit Balance)
 * - Column J: 期末貸餘 (Ending Credit Balance)
 */
export async function parseTrialBalanceSheet(
  file: File
): Promise<TBParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });

    // Find TB sheet
    const tbSheet = workbook.Sheets['TB'];
    if (!tbSheet) {
      return {
        data: [],
        error: 'TB sheet not found in Excel file. Please ensure the workbook contains a sheet named "TB".',
      };
    }

    const range = XLSX.utils.decode_range(tbSheet['!ref'] || 'A1');
    const entries: TrialBalanceEntry[] = [];

    // Skip header row (row 0), start from row 1
    for (let row = 1; row <= range.e.r; row++) {
      const accountCode = getCellValue(tbSheet, row, 0);
      const accountName = getCellValue(tbSheet, row, 1);

      // Skip empty rows or summary rows without account code
      if (!accountCode || !accountName) continue;

      // Skip rows where account code is just whitespace or invalid
      const accountCodeStr = String(accountCode).trim();
      if (!accountCodeStr) continue;

      entries.push({
        accountCode: accountCodeStr,
        accountName: String(accountName).trim(),
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

    if (entries.length === 0) {
      return {
        data: [],
        error: 'No valid trial balance entries found in TB sheet.',
      };
    }

    return { data: entries };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error while parsing TB sheet',
    };
  }
}

/**
 * Get cell value from worksheet
 */
function getCellValue(sheet: XLSX.WorkSheet, row: number, col: number): any {
  const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  const cell = sheet[cellAddress];
  return cell ? cell.v : null;
}

/**
 * Get numeric value from cell, handling strings with commas
 */
function getNumericValue(sheet: XLSX.WorkSheet, row: number, col: number): number | null {
  const value = getCellValue(sheet, row, col);

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    // Remove commas and try to parse
    const cleaned = value.replace(/,/g, '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
}

/**
 * Validate TB entry has required fields
 */
export function validateTBEntry(entry: TrialBalanceEntry): boolean {
  return !!(entry.accountCode && entry.accountName);
}
