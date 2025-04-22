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

// SQL Schema Generator
export const generateSQL = () => `
-- Companies table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    foreign_name VARCHAR(255),
    organization_type VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    postal_code VARCHAR(10),
    tax_id VARCHAR(20),
    tax_registration_number VARCHAR(50),
    property_tax_id VARCHAR(50),
    phone VARCHAR(20),
    fax VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contacts table
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    id_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    fax VARCHAR(20),
    email VARCHAR(255),
    role_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Company contacts junction table
CREATE TABLE company_contacts (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    contact_id INTEGER REFERENCES contacts(id),
    role_type VARCHAR(50) NOT NULL,
    is_registered_address BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, contact_id, role_type)
);

-- Business certificates table
CREATE TABLE business_certificates (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    contact_id INTEGER REFERENCES contacts(id),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_companies_tax_id ON companies(tax_id);
CREATE INDEX idx_contacts_id_number ON contacts(id_number);
CREATE INDEX idx_company_contacts_company_id ON company_contacts(company_id);
CREATE INDEX idx_company_contacts_contact_id ON company_contacts(contact_id);
CREATE INDEX idx_business_certificates_company_id ON business_certificates(company_id);
CREATE INDEX idx_business_certificates_contact_id ON business_certificates(contact_id);
`;
