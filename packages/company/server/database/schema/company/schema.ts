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
import { shareholders } from "../shareholder/schema";
import { ORGANIZATION_TYPES } from "../../../../shared/utils/constants";

// Organization type enum
export const organizationTypeEnum = pgEnum(
  "organization_type",
  ORGANIZATION_TYPES
);

// Companies table
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(), // 公司名稱
  foreignName: varchar("foreign_name"), // 外文名稱
  organizationType: organizationTypeEnum("organization_type").notNull(), // 組織類型
  businessItemsDescription: varchar("business_items_description"), // 營業項目描述
  businessItems: varchar("business_items").array().notNull(), // 營業項目
  businessIdNumber: varchar("business_id_number"), // 統一編號
  taxSerialNumber: varchar("tax_serial_number"), // 稅籍編號
  address: varchar("address").notNull(), // 公司地址
  telephone: varchar("telephone"), // 電話
  fax: varchar("fax"), // 傳真
  email: varchar("email"), // 電子郵件
  capitalAmount: integer("capital_amount"), // 資本額
  authorizedShares: integer("authorized_shares"), // 實收資本額股數
  ordinaryShares: integer("ordinary_shares"), // 普通股
  preferredShares: integer("preferred_shares"), // 特別股
  hasParValueFreeShares: boolean("has_par_value_free_shares"), // 無票面金額股份

  // Shared fields for corporation and limited company
  isForeignInvestment: boolean("is_foreign_investment").default(false), // 僑外投資事業
  isChineseInvestment: boolean("is_chinese_investment").default(false), // 陸資

  // Corporation-specific fields
  isPublicOffering: boolean("is_public_offering").default(false), // 公開發行
  closelyHeldShareholderCount: integer("closely_held_shareholder_count"), // 閉鎖性股份有限公司股東人數
  hasMultipleVotingRightsPreferredShares: boolean(
    "has_multiple_voting_rights_preferred_shares"
  ).default(false), // 複數表決權特別股
  hasVetoRightsPreferredShares: boolean(
    "has_veto_rights_preferred_shares"
  ).default(false), // 對於特定事項具否決權特別股
  hasPreferredSharesBoardRights: boolean(
    "has_preferred_shares_board_rights"
  ).default(false), // 特別股股東被選為董事、監察人之禁止或限制或當選一定名額之權利

  // Limited company-specific fields
  isSoleProprietorshipLLC: boolean("is_sole_proprietorship_llc").default(false), // 一人公司

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
  shareholders: many(shareholders, {
    relationName: "companyShareholders",
  }),
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
