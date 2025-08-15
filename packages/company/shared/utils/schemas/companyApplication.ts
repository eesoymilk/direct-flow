import * as z from "zod";
import {
  formatBytes,
  MAX_FILE_SIZE,
  MIN_DIMENSIONS,
  MAX_DIMENSIONS,
  ACCEPTED_FILE_TYPES,
  getFileField,
} from "./helper";

// ID Number validation
export const idNumberSchema = z.string().regex(/^[A-Z][1-2][0-9]{8}$/, {
  message: "身份證字號格式錯誤",
});

// Document schema for file uploads (client-side)
export const documentSchema = z.object({
  documentType: z.string().min(1, "文件類型為必填"),
  documentDescription: z.string(),
  file: z
    .instanceof(File, {
      message: "請選擇一個檔案",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `檔案太大。請選擇一個小於 ${formatBytes(MAX_FILE_SIZE)} 的檔案。`,
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type as any), {
      message: "請上傳有效的檔案 (JPEG, PNG, 或 PDF)。",
    })
    .refine(
      (file) => {
        // If it's a PDF, skip dimension validation
        if (file.type === "application/pdf") {
          return true;
        }

        // For images, validate dimensions
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const meetsDimensions =
                img.width >= MIN_DIMENSIONS.width &&
                img.height >= MIN_DIMENSIONS.height &&
                img.width <= MAX_DIMENSIONS.width &&
                img.height <= MAX_DIMENSIONS.height;
              resolve(meetsDimensions);
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        });
      },
      {
        message: `圖片尺寸無效。請上傳一個介於 ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} 和 ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} 像素的圖片。`,
      }
    ),
});

// Person schema (server-side compatible)
export const personSchema = z.object({
  name: z.string().min(1, "姓名為必填"),
  idNumber: idNumberSchema,
  address: z.string().min(1, "戶籍地址為必填"),
  telephone: z.string().min(1, "電話為必填"),
  cellphone: z.string().min(1, "手機為必填"),
  email: z.string().min(1, "電子郵件為必填"),
});

// Person field helper (for forms with file uploads)
const getPersonField = (name: string) =>
  z.object({
    name: z.string().min(1, { message: `${name}姓名為必填` }),
    idNumber: idNumberSchema,
    address: z
      .string()
      .min(1, { message: `${name}戶籍地址為必填` })
      .max(255, { message: `${name}戶籍地址最多255個字` }),
    idCardFront: getFileField(`${name}身份證正面照片`),
    idCardBack: getFileField(`${name}身份證背面照片`),
  });

// Form schema for company application
export const companyApplicationFormSchema = z.object({
  candicateNames: z
    .array(z.string().min(1, "公司名稱為必填"))
    .min(1, "請提供至少一個公司名稱")
    .max(5, "最多只能提供五個公司名稱"),
  organizationType: z.enum(
    [
      "limited_company",
      "company_limited",
      "sole_proprietorship",
      "partnership",
    ],
    {
      message: "請選擇有效的組織類型",
    }
  ),
  businessItemsDescription: z.string().min(1, "營業項目描述為必填"),
  address: z.string().min(1, "公司地址為必填"),
  isDirectorSameAsResponsiblePerson: z.boolean(),
  isContactPersonSameAsResponsiblePerson: z.boolean(),
  isContactPersonSameAsDirector: z.boolean(),
});

// Company application schema (server-side validation)
export const companyApplicationSchema = z.object({
  candicateNames: z
    .array(z.string().min(1, "公司名稱為必填"))
    .min(1, "請提供至少一個公司名稱"),
  organizationType: z.enum(
    [
      "limited_company",
      "company_limited",
      "sole_proprietorship",
      "partnership",
    ],
    {
      errorMap: () => ({ message: "請選擇有效的組織類型" }),
    }
  ),
  businessItemsDescription: z.string().min(1, "營業項目描述為必填"),
  address: z.string().min(1, "公司地址為必填"),
  isDirectorSameAsResponsiblePerson: z.boolean(),
  isContactPersonSameAsResponsiblePerson: z.boolean(),
  responsiblePerson: personSchema,
  director: personSchema,
  contactPerson: personSchema,
  shareholders: z.array(personSchema).optional(),
});

// Legacy schemas from shared/utils/schema.ts (for backward compatibility)
export const responsiblePersonSchema = getPersonField("負責人");
export const directorSchema = getPersonField("董事");
export const shareholderSchema = getPersonField("股東");

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

export const companyBasicInfoSchema = z.object({
  name: z
    .string()
    .min(1, { message: "公司名稱為必填" })
    .max(255, { message: "公司名稱最多255個字" }),
  businessItems: z
    .array(z.string())
    .min(1, { message: "請選擇至少一個營業項目" }),
  address: z
    .string()
    .min(1, { message: "公司地址為必填" })
    .max(255, { message: "公司地址最多255個字" }),
  houseTaxPayment: getFileField("房屋稅單"),
});

// Type exports
export type PersonSchema = z.infer<typeof personSchema>;
export type CompanyApplicationFormSchema = z.infer<
  typeof companyApplicationFormSchema
>;
export type CompanyApplicationSchema = z.infer<typeof companyApplicationSchema>;
export type DocumentSchema = z.infer<typeof documentSchema>;
