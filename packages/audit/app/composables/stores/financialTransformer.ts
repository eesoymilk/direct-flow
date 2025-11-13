import type {
  TrialBalanceEntry,
  GeneratedBalanceSheet,
} from "../../types/financial";
import { parseTrialBalanceSheet } from "../../utils/excel/tbParser";
import { generateBalanceSheet } from "../../utils/financial/balanceSheetGenerator";
import { balanceSheetConfig } from "../../config/balanceSheetConfig";

/**
 * Financial Transformer Store
 *
 * Handles Balance Sheet generation from TB (Trial Balance) data.
 * Focused on a single responsibility: transforming accounting data into financial statements.
 */
export const useFinancialTransformerStore = defineStore(
  "financialTransformer",
  () => {
    const tbData = ref<TrialBalanceEntry[]>([]);
    const balanceSheet = ref<GeneratedBalanceSheet | null>(null);
    const isProcessing = ref(false);
    const error = ref<string | null>(null);

    /**
     * Upload and parse Trial Balance Excel file
     *
     * @param file - Excel file containing TB sheet
     * @returns Success/error result
     */
    const uploadTBExcel = async (file: File) => {
      try {
        isProcessing.value = true;
        error.value = null;

        // Parse TB sheet
        const tbResult = await parseTrialBalanceSheet(file);
        if (tbResult.error) {
          error.value = tbResult.error;
          return { success: false, error: tbResult.error };
        }

        tbData.value = tbResult.data;
        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Unknown error during file parsing";
        error.value = errorMessage;
        return { success: false, error: errorMessage };
      } finally {
        isProcessing.value = false;
      }
    };

    /**
     * Generate Balance Sheet from uploaded TB data
     *
     * @param companyName - Company name for the report
     * @param periodYear - Accounting period year (ROC year)
     * @returns Success/error result with generated balance sheet
     */
    const generateBS = (companyName: string, periodYear: number) => {
      try {
        isProcessing.value = true;
        error.value = null;

        // Validate required data
        if (tbData.value.length === 0) {
          error.value =
            "No trial balance data available. Please upload an Excel file first.";
          return { success: false, error: error.value };
        }

        // Generate Balance Sheet using pure function
        balanceSheet.value = generateBalanceSheet(
          tbData.value,
          balanceSheetConfig,
          companyName,
          periodYear
        );

        return { success: true, data: balanceSheet.value };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Unknown error during statement generation";
        error.value = errorMessage;
        return { success: false, error: errorMessage };
      } finally {
        isProcessing.value = false;
      }
    };

    /**
     * Clear all data and reset state
     */
    const clearData = () => {
      tbData.value = [];
      balanceSheet.value = null;
      error.value = null;
    };

    return {
      // State (readonly)
      tbData: readonly(tbData),
      balanceSheet: readonly(balanceSheet),
      isProcessing: readonly(isProcessing),
      error: readonly(error),

      // Actions
      uploadTBExcel,
      generateBS,
      clearData,
    };
  }
);
