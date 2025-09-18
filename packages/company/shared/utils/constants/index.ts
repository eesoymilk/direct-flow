export const ORGANIZATION_TYPES = [
  "corporation", // 股份有限公司
  "limited_company", // 有限公司
  "sole_proprietorship",
  "partnership",
] as const;

export const PERSON_TYPES = ["responsiblePerson", "contactPerson"] as const;

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

// 董事長、副董事長、常務董事、董事、監察人
export const PARTNER_TYPES = [
  "chairman",
  "vice_chairman",
  "executive_director",
  "director",
  "supervisor",
] as const;

export const SHARE_TYPES = [
  "ordinary", // 普通股
  "preferred_a", // 甲種特別股
  "preferred_b", // 乙種特別股
  "preferred_c", // 丙種特別股
  "preferred_d", // 丁種特別股
  "preferred_e", // 戊種特別股
] as const;

export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];
export type PersonType = (typeof PERSON_TYPES)[number];
export type PartnerType = (typeof PARTNER_TYPES)[number];
export type ApplicationStatus = (typeof COMPANY_APPLICATION_STATUS)[number];
export type ReviewRoundStatus = (typeof REVIEW_ROUND_STATUS)[number];
export type ReviewIssueType = (typeof REVIEW_ISSUE_TYPE)[number];
export type ReviewIssueSeverity = (typeof REVIEW_ISSUE_SEVERITY)[number];
export type ShareType = (typeof SHARE_TYPES)[number];
