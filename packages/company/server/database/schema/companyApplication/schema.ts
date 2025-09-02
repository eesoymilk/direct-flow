import {
  pgTable,
  serial,
  varchar,
  timestamp,
  uuid,
  pgEnum,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { people } from "../person/schema";
import { documents } from "../document/schema";
import { organizationTypeEnum } from "../company/schema";
import { reviewRounds } from "../companyApplicationReview/schema";

// Application status enum
export const applicationStatusEnum = pgEnum("application_status", [
  "submitted",
  "staff_review",
  "pending_client_update",
  "filing",
  "filed",
  "approved",
  "rejected",
]);

// Company applications table
export const companyApplications = pgTable("company_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateNames: varchar("candidate_names").array().notNull(), // 候選名稱
  chosenName: varchar("chosen_name"), // 選定名稱
  organizationType: organizationTypeEnum("organization_type").notNull(), // 組織類型
  isCloselyHeld: boolean("is_closely_held"), // 閉鎖型股份有限公司
  businessItemsDescription: varchar("business_items_description").notNull(), // 營業項目描述
  address: varchar("address").notNull(), // 地址
  capitalAmount: integer("capital_amount"), // 資本額
  authorizedShares: integer("authorized_shares"), // 實收資本額股數
  ordinaryShares: integer("ordinary_shares"), // 普通股
  preferredShares: integer("preferred_shares"), // 特別股
  hasParValueFreeShares: boolean("has_par_value_free_shares"), // 無票面金額股份
  responsiblePersonId: uuid("responsible_person_id").references(
    () => people.id,
    { onDelete: "cascade" }
  ), // 負責人ID
  contactPersonId: uuid("contact_person_id").references(() => people.id, {
    onDelete: "set null",
  }), // 聯絡人ID
  representativeId: uuid("representative_id").references(() => people.id, {
    onDelete: "set null",
  }), // 代表人ID
  status: applicationStatusEnum("status").notNull().default("submitted"), // 狀態
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Company applications documents table
export const applicationDocuments = pgTable("application_documents", {
  id: serial("id").primaryKey(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => companyApplications.id, { onDelete: "cascade" }),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Shareholders junction table
export const applicationShareholders = pgTable("application_shareholders", {
  id: serial("id").primaryKey(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => companyApplications.id, { onDelete: "cascade" }),
  personId: uuid("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  shares: integer("shares"), // 持股數
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const companyApplicationsRelations = relations(
  companyApplications,
  ({ one, many }) => ({
    responsiblePerson: one(people, {
      fields: [companyApplications.responsiblePersonId],
      references: [people.id],
      relationName: "responsiblePerson",
    }),
    contactPerson: one(people, {
      fields: [companyApplications.contactPersonId],
      references: [people.id],
      relationName: "contactPerson",
    }),
    representative: one(people, {
      fields: [companyApplications.representativeId],
      references: [people.id],
      relationName: "representative",
    }),
    companyDocuments: many(applicationDocuments),
    shareholders: many(applicationShareholders),
    reviewRounds: many(reviewRounds),
  })
);

export const applicationDocumentsRelations = relations(
  applicationDocuments,
  ({ one }) => ({
    application: one(companyApplications, {
      fields: [applicationDocuments.applicationId],
      references: [companyApplications.id],
    }),
    document: one(documents, {
      fields: [applicationDocuments.documentId],
      references: [documents.id],
    }),
  })
);

export const applicationShareholdersRelations = relations(
  applicationShareholders,
  ({ one }) => ({
    application: one(companyApplications, {
      fields: [applicationShareholders.applicationId],
      references: [companyApplications.id],
    }),
    person: one(people, {
      fields: [applicationShareholders.personId],
      references: [people.id],
    }),
  })
);
