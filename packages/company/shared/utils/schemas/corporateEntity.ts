import * as z from "zod";
import { CORPORATE_REPRESENTATIVE_TYPES } from "../constants";

/**
 * Schema for corporate entity (法人)
 * Used when partner type is corporateShareholder
 */
export const corporateEntitySchema = z.object({
  name: z.string().min(1, { message: "法人名稱不能為空" }),
  unifiedNumber: z
    .string()
    .length(8, { message: "統一編號必須為8位數字" })
    .regex(/^[0-9]{8}$/, { message: "統一編號必須為8位數字" }),
  address: z
    .string()
    .min(1, { message: "法人所在地不能為空" })
    .max(255, { message: "法人所在地最多255個字" }),
  establishmentDate: z.date({ message: "設立日期為必填" }),
  representativeType: z.enum(CORPORATE_REPRESENTATIVE_TYPES, {
    message: "請選擇法人代表類型",
  }),
  // For representativeDirector type: array of partner indices that are representative directors
  representativeDirectorIndices: z.array(z.number()).optional(),
  contactPhone: z
    .string()
    .regex(/^09\d{8}$/, {
      message: "請輸入有效的手機號碼格式 (09XXXXXXXX)",
    })
    .optional(),
  email: z.email({ message: "請輸入有效的電子郵件" }).optional(),
});

export type CorporateEntitySchema = z.infer<typeof corporateEntitySchema>;

