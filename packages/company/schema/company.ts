import { z } from "zod";

// Base types for common fields
const baseFields = {
  id: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
};

// Enums
export const OrganizationType = {
  COMPANY_LIMITED: "股份有限公司",
  LIMITED: "有限公司",
  SOLE_PROPRIETORSHIP: "獨資",
  PARTNERSHIP: "合夥",
} as const;

export const RoleType = {
  OFFICER: "負責人",
  REPRESENTATIVE: "代理人",
  CONTACT: "聯絡人",
} as const;

// Zod Schemas
export const CompanySchema = z.object({
  ...baseFields,
  name: z.string().min(1, "公司名稱為必填"),
  foreign_name: z.string().optional(),
  organization_type: z.enum([
    OrganizationType.COMPANY_LIMITED,
    OrganizationType.LIMITED,
    OrganizationType.SOLE_PROPRIETORSHIP,
    OrganizationType.PARTNERSHIP,
  ]),
  address: z.string().min(1, "公司地址為必填"),
  postal_code: z.string().optional(),
  tax_id: z.string().optional(),
  tax_registration_number: z.string().optional(),
  property_tax_id: z.string().optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email("請輸入有效的電子信箱").optional(),
});

export const ContactSchema = z.object({
  ...baseFields,
  name: z.string().min(1, "姓名為必填"),
  id_number: z.string().min(1, "身份證字號為必填"),
  address: z.string().min(1, "地址為必填"),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email("請輸入有效的電子信箱").optional(),
  role_type: z.enum([
    RoleType.OFFICER,
    RoleType.REPRESENTATIVE,
    RoleType.CONTACT,
  ]),
});

export const CompanyContactSchema = z.object({
  ...baseFields,
  company_id: z.number(),
  contact_id: z.number(),
  role_type: z.enum([
    RoleType.OFFICER,
    RoleType.REPRESENTATIVE,
    RoleType.CONTACT,
  ]),
  is_registered_address: z.boolean().default(false),
});

export const BusinessCertificateSchema = z.object({
  ...baseFields,
  company_id: z.number(),
  contact_id: z.number(),
  phone: z.string().optional(),
  email: z.string().email("請輸入有效的電子信箱").optional(),
});

// TypeScript Types
export type Company = z.infer<typeof CompanySchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type CompanyContact = z.infer<typeof CompanyContactSchema>;
export type BusinessCertificate = z.infer<typeof BusinessCertificateSchema>;
