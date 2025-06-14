import { z } from "zod";

const idNumberField = z.string().regex(/^[A-Z][1-2][0-9]{8}$/, {
  message: "身份證字號格式錯誤",
});

const getFileField = (name: string) => {
  return z.custom<File | null>().refine((file) => file !== null, {
    message: `請上傳${name}`,
  });
};

const getPersonField = (name: string) =>
  z.object({
    name: z.string().min(1, { message: `${name}姓名為必填` }),
    idNumber: idNumberField,
    address: z
      .string()
      .min(1, { message: `${name}戶籍地址為必填` })
      .max(255, { message: `${name}戶籍地址最多255個字` }),
    idCardFront: getFileField(`${name}身份證正面照片`),
    idCardBack: getFileField(`${name}身份證背面照片`),
  });

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
