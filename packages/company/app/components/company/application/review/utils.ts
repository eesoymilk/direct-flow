import type { FieldStatus } from "./types";

export const generateFieldStatus = (
  issue?: ReviewIssueSchema,
  verification?: ReviewVerificationSchema
): FieldStatus => {
  const hasIssue = !!issue;
  const isVerified = !!verification;

  if (!hasIssue && !isVerified) {
    return {
      hasIssue: false,
      issue: undefined,
      isVerified: false,
      verification: undefined,
    };
  }

  if (hasIssue && !isVerified) {
    return {
      hasIssue: true,
      issue,
      isVerified: false,
      verification: undefined,
    };
  }

  if (!hasIssue && isVerified) {
    return {
      hasIssue: false,
      issue: undefined,
      isVerified: true,
      verification,
    };
  }

  throw new Error(
    `Invalid field status: hasIssue=${hasIssue}, isVerified=${isVerified}`
  );
};
