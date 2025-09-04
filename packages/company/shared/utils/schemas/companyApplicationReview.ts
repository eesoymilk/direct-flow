import * as z from "zod";
import { responseBaseSchema } from "./helpers";
import {
  FIELD_CLASSIFICATION,
  COMPANY_APPLICATION_STATUS,
  REVIEW_ROUND_STATUS,
  REVIEW_ISSUE_TYPE,
  REVIEW_ISSUE_SEVERITY,
} from "../constants";

export const reviewIssueTypeSchema = z.enum(REVIEW_ISSUE_TYPE, {
  message: "請選擇問題類型",
});

export const reviewIssueSeveritySchema = z.enum(REVIEW_ISSUE_SEVERITY, {
  message: "請選擇問題嚴重性",
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

// Staff-provided fields schema for first review round
export const staffProvidedFieldsSchema = z.object({
  chosenName: z.string().min(1, "請選擇公司名稱"),
  businessItems: z
    .array(z.string().min(1, "營業項目不能為空"))
    .min(1, "請至少提供一個營業項目"),
});

export const reviewRoundSchema = z.object({
  summary: z.string().optional(),
  applicationStatus: z.enum(COMPANY_APPLICATION_STATUS, {
    message: "請選擇申請狀態",
  }),
  // Staff-provided fields for first review round
  staffProvidedFields: staffProvidedFieldsSchema.optional(),
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
  ...reviewRoundSchema.omit({ applicationStatus: true }).shape,
  ...responseBaseSchema.shape,
  applicationId: z.string().uuid(),
  status: z.enum(REVIEW_ROUND_STATUS),
  reviewIssues: reviewIssueResponseSchema.array(),
  reviewVerifications: reviewVerificationResponseSchema.array(),
  roundNo: z.number().int(),
  createdBySub: z.string(),
});

export type StaffProvidedFieldsSchema = z.infer<
  typeof staffProvidedFieldsSchema
>;
export type ReviewIssueSchema = z.infer<typeof reviewIssueSchema>;
export type ReviewVerificationSchema = z.infer<typeof reviewVerificationSchema>;
export type ReviewRoundSchema = z.infer<typeof reviewRoundSchema>;

export type ReviewIssueResponse = z.infer<typeof reviewIssueResponseSchema>;
export type ReviewVerificationResponse = z.infer<
  typeof reviewVerificationResponseSchema
>;
export type ReviewRoundResponse = z.infer<typeof reviewRoundResponseSchema>;
