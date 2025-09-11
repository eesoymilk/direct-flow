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
import { SHARE_TYPES } from "../../../../shared/utils/constants";
import { people } from "../person/schema";
import { companies } from "../company/schema";

// Share type enum
export const shareTypeEnum = pgEnum("share_type", SHARE_TYPES);

// Shareholders junction table
export const shareholders = pgTable("shareholders", {
  id: serial("id").primaryKey(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  personId: uuid("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  capitalContribution: decimal("capital_contribution", { precision: 12, scale: 2 }), // 出資額
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Shareholder shares table - tracks the number of shares each shareholder owns
export const shareholderShares = pgTable("shareholder_shares", {
  id: serial("id").primaryKey(),
  shareholderId: integer("shareholder_id")
    .notNull()
    .references(() => shareholders.id, { onDelete: "cascade" }),
  shareType: shareTypeEnum("code").notNull().default("ordinary"), // "ordinary" or "preferred_a"
  quantity: integer("quantity").notNull().default(0), // Number of shares owned
  pricePerShare: decimal("price_per_share", { precision: 10, scale: 2 }), // 每股價格
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }), // 股款總額 (quantity × pricePerShare)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const shareholdersRelations = relations(
  shareholders,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [shareholders.companyId],
      references: [companies.id],
      relationName: "companyShareholders",
    }),
    person: one(people, {
      fields: [shareholders.personId],
      references: [people.id],
    }),
    shareholderShares: many(shareholderShares),
  })
);

export const shareholderSharesRelations = relations(
  shareholderShares,
  ({ one }) => ({
    shareholder: one(shareholders, {
      fields: [shareholderShares.shareholderId],
      references: [shareholders.id],
    }),
  })
);
