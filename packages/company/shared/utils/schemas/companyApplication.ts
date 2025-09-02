import * as z from "zod";
import { getFileField, responseBaseSchema } from "./helpers";
import { personResponseSchema, shareholderResponseSchema } from "./person";
import { reviewRoundResponseSchema } from "./companyApplicationReview";

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
  isCloselyHeld: z.boolean().nullish(),
  businessItemsDescription: z.string().min(1, "營業項目描述為必填"),
  address: z.string().min(1, "公司地址為必填"),
  capitalAmount: z.number().positive("資本額必須大於0").nullish(),
  authorizedShares: z.number().positive("實收資本額股數必須大於0").nullish(),
  ordinaryShares: z.number().min(0, "普通股數不能為負數").nullish(),
  preferredShares: z.number().min(0, "特別股數不能為負數").nullish(),
  hasParValueFreeShares: z.boolean().nullish(),
  isDirectorSameAsResponsiblePerson: z.boolean(),
  isContactPersonSameAsResponsiblePerson: z.boolean(),
  isContactPersonSameAsDirector: z.boolean(),
});

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

export const companyApplicationResponseSchema = z.object({
  ...companyApplicationFormSchema.omit({
    isCloselyHeld: true,
    isContactPersonSameAsDirector: true,
    isContactPersonSameAsResponsiblePerson: true,
    isDirectorSameAsResponsiblePerson: true,
  }).shape,
  ...responseBaseSchema.shape,
  status: z.enum(COMPANY_APPLICATION_STATUS),
  responsiblePerson: personResponseSchema,
  contactPerson: personResponseSchema,
  representative: personResponseSchema,
  shareholders: shareholderResponseSchema.array(),
  reviewRounds: reviewRoundResponseSchema.array(),
});

export type CompanyApplicationFormSchema = z.infer<
  typeof companyApplicationFormSchema
>;
export type CompanyApplicationResponse = z.infer<
  typeof companyApplicationResponseSchema
>;
