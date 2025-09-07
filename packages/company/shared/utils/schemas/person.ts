import * as z from "zod";
import { getContactPersonSchema, getShareholderPersonSchema } from "./helpers";
import { responseBaseSchema } from "./helpers/response";

export const personSchema = getContactPersonSchema("人員");

export const responsiblePersonSchema = getContactPersonSchema("負責人");

export const directorSchema = getContactPersonSchema("董事");

export const contactPersonSchema = getContactPersonSchema("聯絡人");

export const shareholderSchema = getShareholderPersonSchema("股東").extend({
  // Remove shares field - now handled by share holdings system
  isReadonly: z.boolean().optional(), // Track if this shareholder is auto-populated
  referenceType: z
    .enum(["responsiblePerson", "director", "contactPerson"])
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

// Fix for schemas with .refine() that don't have .shape property
const basePersonSchema = getContactPersonSchema("人員");
export const personResponseSchema = z.object({
  ...basePersonSchema.shape,
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
