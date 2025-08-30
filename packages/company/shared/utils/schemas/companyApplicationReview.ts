import * as z from "zod";
import type { ReviewIssueType, ReviewIssueSeverity, ReviewRoundStatus } from "../../types/database";

// Review issue type validation (matching database enum)
export const reviewIssueTypeSchema = z.enum(
  ["missing", "invalid", "clarification", "modification"] as const,
  {
    message: "請選擇問題類型",
  }
) satisfies z.ZodType<ReviewIssueType>;

// Review issue severity validation (matching database enum)
export const reviewIssueSeveritySchema = z.enum(
  ["low", "medium", "high", "critical"] as const,
  {
    message: "請選擇問題嚴重性",
  }
) satisfies z.ZodType<ReviewIssueSeverity>;

// Review round status validation (matching database enum)
export const reviewRoundStatusSchema = z.enum([
  "reviewing",
  "resolved",
  "completed",
] as const) satisfies z.ZodType<ReviewRoundStatus>;

// Review issue schema for form validation
export const reviewIssueFormSchema = z.object({
  fieldPath: z.string().min(1, "欄位路徑為必填"),
  issueType: reviewIssueTypeSchema,
  severity: reviewIssueSeveritySchema,
  description: z.string().optional(),
});

// Review round creation schema
export const reviewRoundCreateSchema = z.object({
  applicationId: z.string().uuid("無效的申請ID"),
  summary: z.string().optional(),
  reviewIssues: z.array(reviewIssueFormSchema).optional(),
});

// Legacy exports for backward compatibility
export const reviewIssueSchema = reviewIssueFormSchema;
export const companyApplicationReviewStatusSchema = reviewRoundStatusSchema;
export const reviewRoundSchema = reviewRoundCreateSchema;

// Type exports
export type ReviewIssueForm = z.infer<typeof reviewIssueFormSchema>;
export type ReviewRoundCreate = z.infer<typeof reviewRoundCreateSchema>;
