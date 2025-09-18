import * as z from "zod";
import { getBasePersonSchema, getShareSchema, idNumberSchema } from "./helpers";
import { responseBaseSchema } from "./helpers/response";
import { PARTNER_TYPES } from "../constants";

export const personSchema = getBasePersonSchema("人員");

export const responsiblePersonSchema = getBasePersonSchema("負責人");

export const contactPersonSchema = getBasePersonSchema("聯絡人");

export const partnerSchema = z.object(
  {
    name: z.string().min(1, { message: "股東姓名不能為空" }),
    idNumber: idNumberSchema,
    partnerType: z.enum(PARTNER_TYPES).optional(),
    address: z
      .string()
      .min(1, { message: "股東戶籍地址不能為空" })
      .max(255, { message: "股東戶籍地址最多255個字" }),
    cellphone: z
      .string()
      .min(1, { message: "股東手機號碼不能為空" })
      .regex(/^09\d{8}$/, { message: "請輸入有效的手機號碼格式 (09XXXXXXXX)" }),
    email: z.string().email({ message: "請輸入有效的電子郵件" }).optional(),
    // TODO: Add dateOfBirth validation
    dateOfBirth: z.date(),
    capitalContribution: z
      .number()
      .min(0, { message: "出資額不能為負數" })
      .nullish(),
    isReadonly: z.boolean().optional(),
    referenceType: z.enum(PERSON_TYPES).optional(),
    // While shares are optional, they are required to be present to make the form validation simpler
    shares: z.object({
      ordinary: getShareSchema("普通股"),
      preferred_a: getShareSchema("甲種特別股"),
      preferred_b: getShareSchema("乙種特別股"),
      preferred_c: getShareSchema("丙種特別股"),
      preferred_d: getShareSchema("丁種特別股"),
      preferred_e: getShareSchema("戊種特別股"),
    }),
  },
  {
    message: "股東資料不能為空",
  }
);

export const partnerArraySchema = z
  .array(partnerSchema)
  .refine(
    (partners) => {
      if (partners.length <= 1) return true;

      const idNumbers = partners
        .map((s) => s.idNumber)
        .filter((id) => id && id.trim() !== "");

      const uniqueIdNumbers = new Set(idNumbers);
      return uniqueIdNumbers.size === idNumbers.length;
    },
    {
      message: "人員身分證字號不能重複",
    }
  )
  .refine(
    (partners) => {
      if (partners.length <= 1) return true;

      const names = partners
        .map((s) => s.name?.trim().toLowerCase())
        .filter((name) => name && name !== "");

      const uniqueNames = new Set(names);
      return uniqueNames.size === names.length;
    },
    {
      message: "人員姓名不能重複",
    }
  );

export const personResponseSchema = z.object({
  ...personSchema.shape,
  ...responseBaseSchema.shape,
});

export const partnerResponseSchema = responseBaseSchema
  .omit({ id: true })
  .extend({
    id: z.string().uuid(), // Changed to UUID to match new schema
    applicationId: z.string().uuid(),
    capitalContribution: z.number().min(0).nullable(),
    person: personResponseSchema,
    // Share holdings are now in separate shareHoldings relationship
  });

// Note that this is general type for all 3 person schemas
export type PersonSchema = z.infer<typeof personSchema>;
export type PartnerSchema = z.infer<typeof partnerSchema>;
export type PartnerArraySchema = z.infer<typeof partnerArraySchema>;

export type PersonResponse = z.infer<typeof personResponseSchema>;
export type PartnerResponse = z.infer<typeof partnerResponseSchema>;
