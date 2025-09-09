import * as z from "zod";
import { getBasePersonSchema, getShareSchema, idNumberSchema } from "./helpers";
import { responseBaseSchema } from "./helpers/response";
import { PERSON_TYPES } from "~/components/company/application/review/constants";

export const personSchema = getBasePersonSchema("人員");

export const responsiblePersonSchema = getBasePersonSchema("負責人").refine(
  ({ telephone, cellphone }) => telephone || cellphone,
  {
    message: "負責人必須提供電話或手機其中一項",
    path: ["telephone", "cellphone"],
  }
);

export const representativeSchema = getBasePersonSchema("代表人").refine(
  ({ telephone, cellphone }) => telephone || cellphone,
  {
    message: "代表人必須提供電話或手機其中一項",
    path: ["telephone", "cellphone"],
  }
);

export const contactPersonSchema = getBasePersonSchema("聯絡人").refine(
  ({ telephone, cellphone }) => telephone || cellphone,
  {
    message: "聯絡人必須提供電話或手機其中一項",
    path: ["telephone", "cellphone"],
  }
);

export const shareholderSchema = z.object(
  {
    name: z.string().min(1, { message: "股東姓名不能為空" }),
    idNumber: idNumberSchema,
    address: z
      .string()
      .min(1, { message: "股東戶籍地址不能為空" })
      .max(255, { message: "股東戶籍地址最多255個字" }),
    telephone: z.string().optional(),
    cellphone: z.string().optional(),
    email: z.string().email({ message: "請輸入有效的電子郵件" }).optional(),
    // TODO: Add dateOfBirth validation
    dateOfBirth: z.date(),
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

export const shareholderArraySchema = z
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

export const personResponseSchema = z.object({
  ...personSchema.shape,
  ...responseBaseSchema.shape,
});

export const shareholderResponseSchema = responseBaseSchema
  .omit({ id: true })
  .extend({
    id: z.string().uuid(), // Changed to UUID to match new schema
    applicationId: z.string().uuid(),
    person: personResponseSchema,
    // Share holdings are now in separate shareHoldings relationship
  });

// Note that this is general type for all 3 person schemas
export type PersonSchema = z.infer<typeof personSchema>;
export type ShareholderSchema = z.infer<typeof shareholderSchema>;
export type ShareholderArraySchema = z.infer<typeof shareholderArraySchema>;

export type PersonResponse = z.infer<typeof personResponseSchema>;
export type ShareholderResponse = z.infer<typeof shareholderResponseSchema>;
