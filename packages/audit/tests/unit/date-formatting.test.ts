import { describe, it, expect } from 'vitest';
import {
  toROCYear,
  formatROCDate,
  formatROCYear,
  formatBalanceSheetDate,
  formatIncomeStatementPeriod,
  formatComparativePeriods,
  formatFinancialStatementPeriod,
  formatChineseNumber,
  getAccountingFrameworkText,
  getAuditingStandardsText
} from '../../shared/utils/date-formatting';

describe('Date Formatting Utilities', () => {
  describe('toROCYear', () => {
    it('should convert 2018 to ROC year 107', () => {
      const date = new Date('2018-12-31');
      expect(toROCYear(date)).toBe(107);
    });

    it('should convert 2023 to ROC year 112', () => {
      const date = new Date('2023-03-15');
      expect(toROCYear(date)).toBe(112);
    });

    it('should convert 1912 to ROC year 1', () => {
      const date = new Date('1912-01-01');
      expect(toROCYear(date)).toBe(1);
    });
  });

  describe('formatROCDate', () => {
    it('should format 2018-03-15 correctly', () => {
      const date = new Date('2018-03-15');
      expect(formatROCDate(date)).toBe('民國一○七年3月15日');
    });

    it('should format 2023-12-31 correctly', () => {
      const date = new Date('2023-12-31');
      expect(formatROCDate(date)).toBe('民國一○一二年12月31日');
    });

    it('should format single digit month and day correctly', () => {
      const date = new Date('2018-03-05');
      expect(formatROCDate(date)).toBe('民國一○七年3月5日');
    });
  });

  describe('formatROCYear', () => {
    it('should format 2018 as 民國一○七年', () => {
      const date = new Date('2018-12-31');
      expect(formatROCYear(date)).toBe('民國一○七年');
    });

    it('should format 2023 as 民國一○一二年', () => {
      const date = new Date('2023-12-31');
      expect(formatROCYear(date)).toBe('民國一○一二年');
    });
  });

  describe('formatBalanceSheetDate', () => {
    it('should format 2018-12-31 for balance sheet', () => {
      const date = new Date('2018-12-31');
      expect(formatBalanceSheetDate(date)).toBe('民國一○七年十二月三十一日');
    });

    it('should format 2023-12-31 for balance sheet', () => {
      const date = new Date('2023-12-31');
      expect(formatBalanceSheetDate(date)).toBe('民國一○一二年十二月三十一日');
    });
  });

  describe('formatIncomeStatementPeriod', () => {
    it('should format 2018 income statement period', () => {
      const date = new Date('2018-12-31');
      expect(formatIncomeStatementPeriod(date)).toBe('民國一○七年一月一日至十二月三十一日');
    });

    it('should format 2023 income statement period', () => {
      const date = new Date('2023-12-31');
      expect(formatIncomeStatementPeriod(date)).toBe('民國一○一二年一月一日至十二月三十一日');
    });
  });

  describe('formatComparativePeriods', () => {
    it('should format comparative periods for 2018 and 2017', () => {
      const current = new Date('2018-12-31');
      const comparative = new Date('2017-12-31');
      const result = formatComparativePeriods(current, comparative);
      
      expect(result.balanceSheetPeriod).toBe('民國一○七年及一○六年十二月三十一日');
      expect(result.incomeStatementPeriod).toBe('民國一○七年及一○六年一月一日至十二月三十一日');
    });

    it('should format comparative periods for 2023 and 2022', () => {
      const current = new Date('2023-12-31');
      const comparative = new Date('2022-12-31');
      const result = formatComparativePeriods(current, comparative);
      
      expect(result.balanceSheetPeriod).toBe('民國一○一二年及一○一一年十二月三十一日');
      expect(result.incomeStatementPeriod).toBe('民國一○一二年及一○一一年一月一日至十二月三十一日');
    });
  });

  describe('formatFinancialStatementPeriod', () => {
    it('should format single period financial statements', () => {
      const date = new Date('2018-12-31');
      const result = formatFinancialStatementPeriod(date);
      
      expect(result).toBe('民國一○七年十二月三十一日之資產負債表，暨民國一○七年一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表');
    });

    it('should format comparative period financial statements', () => {
      const current = new Date('2018-12-31');
      const comparative = new Date('2017-12-31');
      const result = formatFinancialStatementPeriod(current, comparative);
      
      expect(result).toBe('民國一○七年及一○六年十二月三十一日之資產負債表，暨民國一○七年及一○六年一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表');
    });
  });

  describe('formatChineseNumber', () => {
    it('should format numbers with Chinese locale', () => {
      expect(formatChineseNumber(1234567)).toBe('1,234,567');
    });

    it('should handle large numbers', () => {
      expect(formatChineseNumber(1234567890)).toBe('1,234,567,890');
    });

    it('should handle small numbers', () => {
      expect(formatChineseNumber(123)).toBe('123');
    });
  });

  describe('getAccountingFrameworkText', () => {
    it('should return IFRS text for IFRS framework', () => {
      const result = getAccountingFrameworkText('IFRS');
      expect(result).toBe('國際財務報導準則、國際會計準則、國際財務報導解釋及解釋公告');
    });

    it('should return IFRS text for 國際財務報導準則', () => {
      const result = getAccountingFrameworkText('國際財務報導準則');
      expect(result).toBe('國際財務報導準則、國際會計準則、國際財務報導解釋及解釋公告');
    });

    it('should return ROC GAAP text for other frameworks', () => {
      const result = getAccountingFrameworkText('商業會計法');
      expect(result).toBe('商業會計法及商業會計處理準則中與財務會計相關之規定暨財團法人中華民國會計研究發展基金會所公開之各號企業會計準則公報及其解釋');
    });
  });

  describe('getAuditingStandardsText', () => {
    it('should return ISA text for IFRS framework', () => {
      const result = getAuditingStandardsText('IFRS');
      expect(result).toBe('審計準則規定');
    });

    it('should return ROC auditing standards for other frameworks', () => {
      const result = getAuditingStandardsText('商業會計法');
      expect(result).toBe('會計師查核簽證財務報表規則及一般公認審計準則');
    });
  });

  describe('Edge cases', () => {
    it('should handle leap year dates', () => {
      const date = new Date('2020-02-29');
      expect(formatROCDate(date)).toBe('民國一○九年2月29日');
    });

    it('should handle year boundaries', () => {
      const date = new Date('2000-01-01');
      expect(toROCYear(date)).toBe(89);
      expect(formatROCYear(date)).toBe('民國89年');
    });

    it('should handle century transition', () => {
      const date = new Date('2011-01-01');
      expect(toROCYear(date)).toBe(100);
      expect(formatROCYear(date)).toBe('民國一○○年');
    });
  });
});