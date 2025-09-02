import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { companyApplications } from "../companyApplication/schema";
import { relations } from "drizzle-orm";

// One “round” per staff pass over an application
export const reviewRoundStatusEnum = pgEnum(
  "review_round_status",
  REVIEW_ROUND_STATUS
);

export const reviewIssueTypeEnum = pgEnum(
  "review_issue_type",
  REVIEW_ISSUE_TYPE
);

export const reviewIssueSeverityEnum = pgEnum(
  "review_issue_severity",
  REVIEW_ISSUE_SEVERITY
);

export const reviewRounds = pgTable("review_rounds", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => companyApplications.id, { onDelete: "cascade" }),
  status: reviewRoundStatusEnum("status").notNull().default("reviewing"),
  summary: text("summary"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBySub: varchar("created_by_sub").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  roundNo: integer("round_no").notNull().default(1), // round number is handy for UX, computed as 1 + count(*) per app
});

export const reviewIssues = pgTable("review_issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  roundId: uuid("round_id")
    .notNull()
    .references(() => reviewRounds.id, { onDelete: "cascade" }),
  fieldPath: varchar("field_path", { length: 256 }).notNull(), // e.g. "address" or "directors[0].idNumber"
  issueType: reviewIssueTypeEnum("issue_type").notNull(),
  severity: reviewIssueSeverityEnum("severity").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(), // Actor (createdBy) is the staff who created the linked review round
  resolvedAt: timestamp("resolved_at"), // Actor (resolvedBy) is unknown since it's from client using an invitation link or one-time code in the email
});

export const reviewVerifications = pgTable("review_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  roundId: uuid("round_id")
    .notNull()
    .references(() => reviewRounds.id, { onDelete: "cascade" }),
  fieldPath: varchar("field_path", { length: 256 }).notNull(), // e.g. "address" | "directors[0].idNumber"
  verifiedBySub: varchar("verified_by_sub").notNull(),
  verifiedAt: timestamp("verified_at").notNull().defaultNow(),
  note: text("note"),
});

export const reviewRoundsRelations = relations(
  reviewRounds,
  ({ one, many }) => ({
    application: one(companyApplications, {
      fields: [reviewRounds.applicationId],
      references: [companyApplications.id],
    }),
    reviewIssues: many(reviewIssues),
    reviewVerifications: many(reviewVerifications),
  })
);

export const reviewIssuesRelations = relations(reviewIssues, ({ one }) => ({
  round: one(reviewRounds, {
    fields: [reviewIssues.roundId],
    references: [reviewRounds.id],
  }),
}));

export const reviewVerificationsRelations = relations(
  reviewVerifications,
  ({ one }) => ({
    round: one(reviewRounds, {
      fields: [reviewVerifications.roundId],
      references: [reviewRounds.id],
    }),
  })
);
