import * as z from "zod";
import { getFileField, getPersonSchema } from "./helper";

// Client-side schema for company application basic information
export const companyApplicationFormSchema = z.object({
  candidateNames: z
    .array(z.string().min(1, "公司名稱為必填"))
    .min(1, "請提供至少一個公司名稱")
    .max(5, "最多只能提供五個公司名稱")
    .refine(
      (names) => {
        const uniqueNames = new Set(
          names.map((name) => name.trim().toLowerCase())
        );
        return uniqueNames.size === names.length;
      },
      {
        message: "公司名稱不能重複",
      }
    ),
  organizationType: z.enum(
    [
      "company_limited",
      "closely_held_company_limited",
      "limited_company",
      "sole_proprietorship",
      "partnership",
    ],
    {
      message: "請選擇有效的組織類型",
    }
  ),
  isCloselyHeld: z.boolean().optional(),
  businessItemsDescription: z.string().min(1, "營業項目描述為必填"),
  address: z.string().min(1, "公司地址為必填"),
  capitalAmount: z.number().positive("資本額必須大於0").optional(),
  authorizedShares: z.number().positive("實收資本額股數必須大於0").optional(),
  ordinaryShares: z.number().min(0, "普通股數不能為負數").optional(),
  preferredShares: z.number().min(0, "特別股數不能為負數").optional(),
  hasParValueFreeShares: z.boolean().optional(),
  isDirectorSameAsResponsiblePerson: z.boolean(),
  isContactPersonSameAsResponsiblePerson: z.boolean(),
  isContactPersonSameAsDirector: z.boolean(),
});
export type CompanyApplicationFormSchema = z.infer<
  typeof companyApplicationFormSchema
>;

export const responsiblePersonSchema = getPersonSchema("負責人");
export const directorSchema = getPersonSchema("董事");
export const contactPersonSchema = getPersonSchema("聯絡人");
export type PersonSchema = z.infer<typeof responsiblePersonSchema>; // Note that this is general type for all person schemas except for shareholder schema

export const shareholderSchema = getPersonSchema("股東").extend({
  shares: z.number().min(0, "持股數不能為負數").optional(),
  isReadonly: z.boolean().optional(), // Track if this shareholder is auto-populated
  referenceType: z
    .enum(["responsiblePerson", "director", "contactPerson"])
    .optional(), // Reference to which person this shareholder represents
});
export type ShareholderSchema = z.infer<typeof shareholderSchema>;

// Shareholders array schema with uniqueness validation
export const shareholdersArraySchema = z
  .array(shareholderSchema)
  .refine(
    (shareholders) => {
      if (shareholders.length <= 1) return true;

      const idNumbers = shareholders
        .map((s) => s.idNumber)
        .filter((id) => id && id.trim() !== "");

      const uniqueIdNumbers = new Set(idNumbers);
      return uniqueIdNumbers.size === idNumbers.length;
    },
    {
      message: "股東身分證字號不能重複",
    }
  )
  .refine(
    (shareholders) => {
      if (shareholders.length <= 1) return true;

      const names = shareholders
        .map((s) => s.name?.trim().toLowerCase())
        .filter((name) => name && name !== "");

      const uniqueNames = new Set(names);
      return uniqueNames.size === names.length;
    },
    {
      message: "股東姓名不能重複",
    }
  );

export const requiredDocumentsSchema = z.object({
  // 1. 公司存摺相關資料
  bankBookFront: getFileField("公司存摺正面"),
  bankBookInside: getFileField("公司存摺內頁"),
  bankBookStamp: getFileField("公司存摺戳章頁"),

  // 2. 股東匯款資料
  shareholderPayments: z.array(getFileField("股東匯款條或存摺資料")).min(1, {
    message: "請上傳至少一份股東匯款條或存摺資料",
  }),

  // 3. 餘額證明
  balanceProof: getFileField("餘額證明或次日的存入100元證明"),

  // 5. 房屋使用同意書
  houseUseAgreement: getFileField("房屋使用同意書"),

  // 6. 股東同意書
  shareholderAgreement: getFileField("股東同意書"),

  // 7. 董監事願任同意書
  directorConsent: getFileField("董監事願任同意書"),

  // 8. 聲明書
  declaration: getFileField("聲明書"),

  // 9. 法人聲明書
  legalPersonDeclaration: getFileField("法人聲明書").optional(),
});
