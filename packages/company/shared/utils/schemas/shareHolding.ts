import * as z from "zod";
import { SHARE_TYPES, SHARE_TYPE_NAMES } from "../constants";

// Schema for individual share holding entry
export const shareHoldingSchema = z.object({
  shareType: z.enum(SHARE_TYPES, {
    message: "請選擇有效的股票類型",
  }),
  quantity: z
    .number()
    .int("股數必須為整數")
    .min(0, "股數不能為負數")
    .default(0),
  pricePerShare: z
    .number()
    .min(0, "每股價格不能為負數")
    .default(0),
  totalAmount: z
    .number()
    .min(0, "股款總額不能為負數")
    .default(0), // This will be calculated automatically
});

// Schema for all share holdings for one shareholder
export const shareholderHoldingsSchema = z
  .array(shareHoldingSchema)
  .refine(
    (holdings) => {
      // Check for duplicate share types
      const shareTypes = holdings.map(h => h.shareType);
      const uniqueShareTypes = new Set(shareTypes);
      return uniqueShareTypes.size === shareTypes.length;
    },
    {
      message: "同一股東不能持有重複的股票類型",
    }
  );

// Extended shareholder schema with share holdings for corporations
export const shareholderWithHoldingsSchema = z.object({
  personId: z.string().uuid().optional(), // For existing persons
  name: z.string().min(1, "股東姓名不能為空"),
  idNumber: z.string().regex(/^[A-Z][1-2][0-9]{8}$/, {
    message: "身份證字號格式錯誤",
  }),
  address: z
    .string()
    .min(1, "股東戶籍地址不能為空")
    .max(255, "股東戶籍地址最多255個字"),
  dateOfBirth: z.date({
    message: "股東出生日期不能為空",
  }),
  // No telephone, cellphone, email required for shareholders
  shareHoldings: shareholderHoldingsSchema.optional(), // Only for corporations
});

// Response schema for share holdings
export const shareHoldingResponseSchema = z.object({
  id: z.string().uuid(),
  shareType: z.enum(SHARE_TYPES),
  shareTypeName: z.string(), // Will be populated from SHARE_TYPE_NAMES
  quantity: z.number(),
  pricePerShare: z.number(),
  totalAmount: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Helper function to get share type name in Chinese
export const getShareTypeName = (shareType: z.infer<typeof shareHoldingSchema>["shareType"]) => {
  return SHARE_TYPE_NAMES[shareType];
};

// Helper function to calculate total amount
export const calculateTotalAmount = (quantity: number, pricePerShare: number) => {
  return quantity * pricePerShare;
};

// Validation helper for corporation shareholders
export const validateCorporationShareholders = (shareholders: z.infer<typeof shareholderWithHoldingsSchema>[]) => {
  // For corporations, at least one shareholder must have share holdings
  const hasShareHoldings = shareholders.some(s => 
    s.shareHoldings && s.shareHoldings.length > 0
  );
  
  if (!hasShareHoldings) {
    return "股份有限公司至少需要一位股東持有股份";
  }
  
  return null;
};

export type ShareHolding = z.infer<typeof shareHoldingSchema>;
export type ShareholderHoldings = z.infer<typeof shareholderHoldingsSchema>;
export type ShareholderWithHoldings = z.infer<typeof shareholderWithHoldingsSchema>;
export type ShareHoldingResponse = z.infer<typeof shareHoldingResponseSchema>;