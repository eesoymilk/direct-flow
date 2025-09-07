import {
  pgTable,
  serial,
  varchar,
  boolean,
  uuid,
  integer,
  decimal,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
// Note: We'll use string references for circular dependencies and let Drizzle resolve them
import { SHARE_TYPES } from "../../../../shared/utils/constants";

// Share type enum
export const shareTypeEnum = pgEnum("share_type", SHARE_TYPES);

// Share Types reference table
export const shareTypes = pgTable("share_types", {
  id: serial("id").primaryKey(),
  code: shareTypeEnum("code").notNull().unique(), // e.g., "ordinary", "preferred_a"
  name: varchar("name").notNull(), // e.g., "普通股", "甲種特別股"
  isPreferred: boolean("is_preferred").notNull().default(false), // true for all preferred shares
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Application Share Holdings - tracks individual shareholder's holdings by share type
export const applicationShareHoldings = pgTable("application_share_holdings", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").notNull(), // FK to companyApplications
  shareholderId: uuid("shareholder_id").notNull(), // FK to applicationShareholders
  shareTypeId: integer("share_type_id")
    .notNull()
    .references(() => shareTypes.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull().default(0), // 股數
  pricePerShare: decimal("price_per_share", { precision: 10, scale: 2 }), // 每股價格
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }), // 股款總額 (quantity × pricePerShare)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const shareTypesRelations = relations(shareTypes, ({ many }) => ({
  shareHoldings: many(applicationShareHoldings),
}));

export const applicationShareHoldingsRelations = relations(
  applicationShareHoldings,
  ({ one }) => ({
    // Use string references to avoid circular dependencies
    application: one("companyApplications", {
      fields: [applicationShareHoldings.applicationId],
      references: ["id"],
    }),
    shareholder: one("applicationShareholders", {
      fields: [applicationShareHoldings.shareholderId],
      references: ["id"],
    }),
    shareType: one(shareTypes, {
      fields: [applicationShareHoldings.shareTypeId],
      references: [shareTypes.id],
    }),
  })
);