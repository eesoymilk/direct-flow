export const ORGANIZATION_TYPE = [
  "company_limited",
  "closely_held_company_limited",
  "limited_company",
  "sole_proprietorship",
  "partnership",
] as const;

export const COMPANY_APPLICATION_STATUS = [
  "submitted",
  "staff_review",
  "pending_client_update",
  "filing",
  "filed",
  "approved",
  "rejected",
] as const;

export const REVIEW_ROUND_STATUS = [
  "reviewing",
  "resolved",
  "completed",
] as const;

export const REVIEW_ISSUE_TYPE = [
  "missing",
  "invalid",
  "clarification",
  "modification",
] as const;

export const REVIEW_ISSUE_SEVERITY = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const FIELD_CLASSIFICATION = [
  "staff_provided", // chosenName, businessItems - provided by staff in first review
  "client_document", // requiredDocuments - uploaded by client after first review
  "reviewable_field", // all other application fields - reviewed normally
] as const;

export type OrganizationType = (typeof ORGANIZATION_TYPE)[number];
export type ApplicationStatus = (typeof COMPANY_APPLICATION_STATUS)[number];
export type ReviewRoundStatus = (typeof REVIEW_ROUND_STATUS)[number];
export type ReviewIssueType = (typeof REVIEW_ISSUE_TYPE)[number];
export type ReviewIssueSeverity = (typeof REVIEW_ISSUE_SEVERITY)[number];
export type FieldClassification = (typeof FIELD_CLASSIFICATION)[number];
