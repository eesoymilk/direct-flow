import {
  pgTable,
  serial,
  uuid,
  integer,
  decimal,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { PARTNER_TYPES, SHARE_TYPES } from "#shared/utils/constants";
import { people } from "../person/schema";
import { companies } from "../company/schema";

export const partnerTypeEnum = pgEnum("partner_type", PARTNER_TYPES);
export const shareTypeEnum = pgEnum("share_type", SHARE_TYPES);

// Partners junction table
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  personId: uuid("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  partnerType: partnerTypeEnum("partner_type").notNull(),
  capitalContribution: decimal("capital_contribution", {
    precision: 12,
    scale: 2,
  }), // 出資額
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Partner shares table - tracks the number of shares each partner owns
export const partnerShares = pgTable("partner_shares", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id")
    .notNull()
    .references(() => partners.id, { onDelete: "cascade" }),
  shareType: shareTypeEnum("code").notNull().default("ordinary"), // "ordinary" or "preferred_a"
  quantity: integer("quantity").notNull().default(0), // Number of shares owned
  pricePerShare: decimal("price_per_share", { precision: 10, scale: 2 }), // 每股價格
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }), // 股款總額 (quantity × pricePerShare)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const partnersRelations = relations(partners, ({ one, many }) => ({
  company: one(companies, {
    fields: [partners.companyId],
    references: [companies.id],
    relationName: "companyPartners",
  }),
  person: one(people, {
    fields: [partners.personId],
    references: [people.id],
  }),
  partnerShares: many(partnerShares),
}));

export const partnerSharesRelations = relations(partnerShares, ({ one }) => ({
  partner: one(partners, {
    fields: [partnerShares.partnerId],
    references: [partners.id],
  }),
}));
