import {
  pgTable,
  serial,
  varchar,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { people } from "../person/schema";
import { documents } from "../document/schema";

// Organization type enum
export const organizationTypeEnum = pgEnum("organization_type", [
  "limited_company",
  "company_limited",
  "sole_proprietorship",
  "partnership",
]);

// Companies table
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(), // 公司名稱
  foreignName: varchar("foreign_name"), // 外文名稱
  organizationType: organizationTypeEnum("organization_type").notNull(),
  businessItemsDescription: varchar("business_items_description"), // 營業項目描述
  businessItems: varchar("business_items").array().notNull(), // 營業項目
  businessIdNumber: varchar("business_id_number"), // 統一編號
  taxSerialNumber: varchar("tax_serial_number"), // 稅籍編號
  address: varchar("address").notNull(), // 公司地址
  telephone: varchar("telephone"), // 電話
  fax: varchar("fax"), // 傳真
  email: varchar("email"), // 電子郵件
  responsiblePersonId: uuid("responsible_person_id")
    .notNull()
    .references(() => people.id, { onDelete: "restrict" }), // 負責人ID
  contactPersonId: uuid("contact_person_id")
    .notNull()
    .references(() => people.id, { onDelete: "restrict" }), // 聯絡人ID
  representativeId: uuid("representative_id")
    .notNull()
    .references(() => people.id, { onDelete: "restrict" }), // 代表人ID
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Company Documents junction table
export const companyDocuments = pgTable("company_documents", {
  id: serial("id").primaryKey(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Shareholders junction table
export const shareholders = pgTable("shareholders", {
  id: serial("id").primaryKey(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  personId: uuid("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const companiesRelations = relations(companies, ({ one, many }) => ({
  responsiblePerson: one(people, {
    fields: [companies.responsiblePersonId],
    references: [people.id],
    relationName: "responsiblePerson",
  }),
  contactPerson: one(people, {
    fields: [companies.contactPersonId],
    references: [people.id],
    relationName: "contactPerson",
  }),
  representative: one(people, {
    fields: [companies.representativeId],
    references: [people.id],
    relationName: "representative",
  }),
  companyDocuments: many(companyDocuments),
  shareholders: many(shareholders),
}));

export const companyDocumentsRelations = relations(
  companyDocuments,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyDocuments.companyId],
      references: [companies.id],
    }),
    document: one(documents, {
      fields: [companyDocuments.documentId],
      references: [documents.id],
    }),
  })
);

export const shareholdersRelations = relations(shareholders, ({ one }) => ({
  company: one(companies, {
    fields: [shareholders.companyId],
    references: [companies.id],
  }),
  person: one(people, {
    fields: [shareholders.personId],
    references: [people.id],
  }),
}));
