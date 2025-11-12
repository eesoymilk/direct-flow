import type { AccountQuery, TrialBalanceEntry } from '../../types/financial';

/**
 * Account Query Utilities
 *
 * Pure functions for matching TB account codes against queries
 * and calculating amounts based on accounting rules.
 */

/**
 * Normalize account code to first 4 digits
 *
 * @example
 * normalizeAccountCode('1112-1') // => '1112'
 * normalizeAccountCode('1112-2') // => '1112'
 * normalizeAccountCode('1112')   // => '1112'
 */
export function normalizeAccountCode(accountCode: string): string {
  return accountCode.substring(0, 4);
}

/**
 * Check if a TB account code matches any code in the query
 *
 * @param tbAccountCode - Account code from Trial Balance (e.g., '1112-1', '1112')
 * @param query - Account query with accountCodes array
 * @returns true if the TB account matches any code in the query
 *
 * @example
 * matchesAccountQuery('1112-1', {accountCodes: ['1111', '1112']}) // => true
 * matchesAccountQuery('1113', {accountCodes: ['1111', '1112']})   // => false
 */
export function matchesAccountQuery(
  tbAccountCode: string,
  query: AccountQuery
): boolean {
  const normalizedTbCode = normalizeAccountCode(tbAccountCode);

  return query.accountCodes.some(
    (queryCode) => normalizeAccountCode(queryCode) === normalizedTbCode
  );
}

/**
 * Calculate amount for a line item based on query
 *
 * @param tbMap - Map of TB entries keyed by account code
 * @param query - Account query specifying which accounts to sum
 * @param side - Accounting side (asset, liability, equity)
 * @returns Calculated amount based on accounting rules
 *
 * Accounting Rules:
 * - Assets: Use ending debit balance
 * - Liabilities/Equity: Use ending credit balance
 * - Contra accounts: Negate the amount
 *
 * @example
 * // Calculate cash balance from accounts 1111 and 1112
 * calculateLineItemAmount(
 *   tbMap,
 *   {accountCodes: ['1111', '1112']},
 *   'asset'
 * )
 */
export function calculateLineItemAmount(
  tbMap: Map<string, TrialBalanceEntry>,
  query: AccountQuery,
  side: 'asset' | 'liability' | 'equity'
): number {
  let total = 0;

  for (const [tbCode, tbEntry] of tbMap) {
    if (matchesAccountQuery(tbCode, query)) {
      let amount = 0;

      // Assets use ending debit balance
      if (side === 'asset') {
        amount = tbEntry.endingDebitBalance;
      }
      // Liabilities and Equity use ending credit balance
      else {
        amount = tbEntry.endingCreditBalance;
      }

      // Apply negative sign for contra accounts
      if (query.isContraAccount) {
        amount = -amount;
      }

      total += amount;
    }
  }

  return total;
}

/**
 * Create a Map from TB entries for fast lookups
 *
 * @param tbEntries - Array of Trial Balance entries
 * @returns Map keyed by account code for O(1) lookups
 */
export function createTBMap(
  tbEntries: TrialBalanceEntry[]
): Map<string, TrialBalanceEntry> {
  return new Map(tbEntries.map((entry) => [entry.accountCode, entry]));
}
