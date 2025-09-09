import { pgTable, uuid, text, timestamp, jsonb, boolean, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    action: text("action").notNull(), // CREATE, UPDATE, DELETE
    userId: text("user_id"),
    userEmail: text("user_email"),
    oldData: jsonb("old_data"),
    newData: jsonb("new_data"),
    changes: jsonb("changes"), // Specific fields that changed
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
    metadata: jsonb("metadata"), // Additional context data
    isSystemGenerated: boolean("is_system_generated").default(false),
  },
  (table) => ({
    entityTypeIdx: index("idx_audit_logs_entity_type").on(table.entityType),
    entityIdIdx: index("idx_audit_logs_entity_id").on(table.entityId),
    timestampIdx: index("idx_audit_logs_timestamp").on(table.timestamp),
    userIdIdx: index("idx_audit_logs_user_id").on(table.userId),
  })
);

export const auditSessions = pgTable(
  "audit_sessions",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: text("user_id").notNull(),
    userEmail: text("user_email").notNull(),
    sessionStart: timestamp("session_start", { withTimezone: true }).notNull().defaultNow(),
    sessionEnd: timestamp("session_end", { withTimezone: true }),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    actionsCount: text("actions_count").default("0"),
    metadata: jsonb("metadata"),
  },
  (table) => ({
    userIdIdx: index("idx_audit_sessions_user_id").on(table.userId),
    sessionStartIdx: index("idx_audit_sessions_session_start").on(table.sessionStart),
  })
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type AuditSession = typeof auditSessions.$inferSelect;
export type NewAuditSession = typeof auditSessions.$inferInsert;