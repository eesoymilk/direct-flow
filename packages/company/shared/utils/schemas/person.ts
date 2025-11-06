import * as z from "zod";
import {
  getBasePersonSchema,
  getShareSchema,
  idNumberSchema,
  unifiedBusinessNumberSchema,
} from "./helpers";
import { responseBaseSchema } from "./helpers/response";
import { PARTNER_TYPES } from "../constants";
import { corporateEntitySchema } from "./corporateEntity";

export const personSchema = getBasePersonSchema("人員");

export const responsiblePersonSchema = getBasePersonSchema("負責人");

export const contactPersonSchema = getBasePersonSchema("聯絡人");

export const managerialOfficerSchema = getBasePersonSchema("經理人");

// Base partner data (common to both person and corporate partners)
const basePartnerSchema = z.object({
  partnerType: z.enum(PARTNER_TYPES).optional(),
  capitalContribution: z
    .number()
    .min(0, { message: "出資額不能為負數" })
    .nullish(),
  isReadonly: z.boolean().optional(),
  referenceType: z.enum(PERSON_TYPES).optional(),
  // While shares are optional, they are required to be present to make the form validation simpler
  shares: z.object({
    ordinary: getShareSchema("普通股"),
    preferred: getShareSchema("特別股"),
    preferred_a: getShareSchema("甲種特別股"),
    preferred_b: getShareSchema("乙種特別股"),
    preferred_c: getShareSchema("丙種特別股"),
    preferred_d: getShareSchema("丁種特別股"),
    preferred_e: getShareSchema("戊種特別股"),
  }),
});

// Person partner schema
const personPartnerDataSchema = z.object({
  entityType: z.literal("person"),
  name: z.string().min(1, { message: "姓名不能為空" }),
  idNumber: idNumberSchema,
  address: z
    .string()
    .min(1, { message: "戶籍地址不能為空" })
    .max(255, { message: "戶籍地址最多255個字" }),
  cellphone: z
    .string()
    .min(1, { message: "手機號碼不能為空" })
    .regex(/^09\d{8}$/, {
      message: "請輸入有效的手機號碼格式 (09XXXXXXXX)",
    }),
  email: z.email({ message: "請輸入有效的電子郵件" }).optional(),
  dateOfBirth: z.date({ message: "出生日期為必填" }),
});

// Corporate partner schema
const corporatePartnerDataSchema = z.object({
  entityType: z.literal("corporate"),
  corporateEntity: corporateEntitySchema,
  // Representative person info (for contact purposes)
  cellphone: z
    .string()
    .min(1, { message: "聯絡手機號碼不能為空" })
    .regex(/^09\d{8}$/, {
      message: "請輸入有效的手機號碼格式 (09XXXXXXXX)",
    }),
});

// Discriminated union for partner schema
export const partnerSchema = z.intersection(
  basePartnerSchema,
  z.discriminatedUnion("entityType", [
    personPartnerDataSchema,
    corporatePartnerDataSchema,
  ])
);

export const partnerArraySchema = z
  .array(partnerSchema)
  .refine(
    (partners) => {
      if (partners.length <= 1) return true;

      // Only check person partners for duplicate ID numbers
      const personIdNumbers = partners
        .filter((p) => p.entityType === "person")
        .map((p) => (p.entityType === "person" ? p.idNumber : ""))
        .filter((id) => id && id.trim() !== "");

      const uniqueIdNumbers = new Set(personIdNumbers);
      return uniqueIdNumbers.size === personIdNumbers.length;
    },
    {
      message: "人員身分證字號不能重複",
    }
  )
  .refine(
    (partners) => {
      if (partners.length <= 1) return true;

      const names = partners
        .map((p) => {
          if (p.entityType === "person") {
            return p.name?.trim().toLowerCase();
          } else {
            return p.corporateEntity.name?.trim().toLowerCase();
          }
        })
        .filter((name) => name && name !== "");

      const uniqueNames = new Set(names);
      return uniqueNames.size === names.length;
    },
    {
      message: "名稱不能重複",
    }
  )
  .refine(
    (partners) => {
      // Validation: If there are representativeDirector type corporate shareholders,
      // supervisors are not allowed UNLESS there is only one corporateShareholder
      const hasCorporateRepDirector = partners.some(
        (p) =>
          p.entityType === "corporate" &&
          p.partnerType === "corporateShareholder" &&
          p.corporateEntity.representativeType === "representativeDirector"
      );
      const hasSupervisor = partners.some(
        (p) => p.partnerType === "supervisor"
      );
      const corporateShareholderCount = partners.filter(
        (p) =>
          p.entityType === "corporate" &&
          p.partnerType === "corporateShareholder"
      ).length;

      // If there are corporate representative directors and supervisors
      if (hasCorporateRepDirector && hasSupervisor) {
        // Only allow if there's exactly one corporate shareholder
        return corporateShareholderCount === 1;
      }

      return true;
    },
    {
      message: "法人代表人董事不可與監察人同時存在（除非只有一位法人股東）",
    }
  )
  .refine(
    (partners) => {
      // Check that all representative director indices are valid
      for (const partner of partners) {
        if (
          partner.entityType === "corporate" &&
          partner.corporateEntity.representativeType ===
            "representativeDirector"
        ) {
          const indices =
            partner.corporateEntity.representativeDirectorIndices || [];
          if (indices.length === 0) {
            return false; // Must select at least one representative director
          }
          // Check all indices are valid
          for (const idx of indices) {
            if (idx < 0 || idx >= partners.length) {
              return false;
            }
            const selectedPartner = partners[idx];
            if (
              !selectedPartner ||
              selectedPartner.entityType === "corporate"
            ) {
              return false; // Can't select corporate entities as representatives
            }
          }
        }
      }
      return true;
    },
    {
      message: "法人代表人董事必須選擇至少一位代表人",
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
