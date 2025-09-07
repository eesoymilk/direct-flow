import * as z from "zod";
import { getBasePersonSchema, getShareholderPersonSchema } from "./helpers";
import { responseBaseSchema } from "./helpers/response";

export const personSchema = getBasePersonSchema("人員")

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

export const shareholderSchema = getShareholderPersonSchema("股東").extend({
  isReadonly: z.boolean().optional(), // Track if this shareholder is auto-populated
  referenceType: z
    .enum(["responsiblePerson", "representative", "contactPerson"])
    .optional(), // Reference to which person this shareholder represents
});

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
