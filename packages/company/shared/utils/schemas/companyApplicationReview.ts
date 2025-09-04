import * as z from "zod";
import { responseBaseSchema } from "./helpers";

export const reviewIssueTypeSchema = z.enum(REVIEW_ISSUE_TYPE, {
  message: "請選擇問題類型",
});

export const reviewIssueSeveritySchema = z.enum(REVIEW_ISSUE_SEVERITY, {
  message: "請選擇問題嚴重性",
});

export const reviewRoundStatusSchema = z.enum(REVIEW_ROUND_STATUS, {
  message: "請選擇狀態",
});

export const reviewIssueSchema = z.object({
  fieldPath: z.string().min(1, "欄位路徑為必填"),
  issueType: reviewIssueTypeSchema,
  severity: reviewIssueSeveritySchema,
  description: z.string().optional(),
});

export const reviewVerificationSchema = z.object({
  fieldPath: z.string().min(1, "欄位路徑為必填"),
  note: z.string().optional(),
});

export const reviewRoundSchema = z.object({
  summary: z.string().optional(),
  status: reviewRoundStatusSchema,
});

export const reviewIssueResponseSchema = z.object({
  ...reviewIssueSchema.shape,
  ...responseBaseSchema.omit({ updatedAt: true }).shape,
  roundId: z.string().uuid(),
  resolvedAt: z.coerce.date().optional(),
});

export const reviewVerificationResponseSchema = z.object({
  ...reviewVerificationSchema.shape,
  ...responseBaseSchema.omit({ updatedAt: true }).shape,
  roundId: z.string().uuid(),
  verifiedAt: z.coerce.date(),
});

export const reviewRoundResponseSchema = z.object({
  ...reviewRoundSchema.shape,
  ...responseBaseSchema.shape,
  applicationId: z.string().uuid(),
  reviewIssues: reviewIssueResponseSchema.array(),
  reviewVerifications: reviewVerificationResponseSchema.array(),
  roundNo: z.number().int(),
  createdBySub: z.string(),
});

export type ReviewIssueSchema = z.infer<typeof reviewIssueSchema>;
export type ReviewVerificationSchema = z.infer<typeof reviewVerificationSchema>;
export type ReviewRoundSchema = z.infer<typeof reviewRoundSchema>;

export type ReviewIssueResponse = z.infer<typeof reviewIssueResponseSchema>;
export type ReviewVerificationResponse = z.infer<
  typeof reviewVerificationResponseSchema
>;
export type ReviewRoundResponse = z.infer<typeof reviewRoundResponseSchema>;
