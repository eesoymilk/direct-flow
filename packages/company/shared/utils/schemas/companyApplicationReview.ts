import * as z from "zod";

export const reviewIssueTypeSchema = z.enum(
  ["missing", "invalid", "clarification", "modification"],
  {
    message: "請選擇問題類型",
  }
);

export const reviewIssueSeveritySchema = z.enum(
  ["low", "medium", "high", "critical"],
  {
    message: "請選擇問題嚴重性",
  }
);

export const reviewIssueSchema = z.object({
  issueType: reviewIssueTypeSchema,
  severity: reviewIssueSeveritySchema,
  description: z.string().optional(),
});

export const companyApplicationReviewStatusSchema = z.enum([
  "submitted",
  "reviewing",
  "filing",
  "approved",
  "rejected",
]);

export const reviewRoundSchema = z.object({
  status: companyApplicationReviewStatusSchema,
  summary: z.string(),
});

export type ReviewIssue = z.infer<typeof reviewIssueSchema>;
export type ReviewRound = z.infer<typeof reviewRoundSchema>;
