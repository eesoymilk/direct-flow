import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { CORPORATE_REPRESENTATIVE_TYPES } from "#shared/utils/constants";

// Corporate representative type enum
export const corporateRepresentativeTypeEnum = pgEnum(
  "corporate_representative_type",
  CORPORATE_REPRESENTATIVE_TYPES
);

// Corporate entities table (法人)
export const corporateEntities = pgTable("corporate_entities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(), // 法人名稱
  unifiedNumber: varchar("unified_number", { length: 8 }).notNull().unique(), // 統一編號 (8 digits)
  address: varchar("address").notNull(), // 法人所在地
  establishmentDate: date("establishment_date").notNull(), // 設立日期
  representativeType: corporateRepresentativeTypeEnum("representative_type").notNull(), // 法人代表類型
  contactPhone: varchar("contact_phone"), // 聯絡電話
  email: varchar("email"), // 電子郵件
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations will be added when we update the partners table
export const corporateEntitiesRelations = relations(
  corporateEntities,
  ({ many }) => ({
    // partners: many(partners) - will add this after updating partners table
  })
);

