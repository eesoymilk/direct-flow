/**
 * Available organization types for company registration
 * @description Legal entity types that can be registered
 * - Corporation (股份有限公司)
 * - Limited Company (有限公司)
 * - Sole Proprietorship (獨資企業)
 * - Partnership (合夥企業)
 */
export const ORGANIZATION_TYPES = [
  "corporation", // 股份有限公司
  "limited_company", // 有限公司
  "sole_proprietorship", // 獨資企業
  "partnership", // 合夥企業
] as const;

/**
 * Types of persons involved in company applications
 * @description Defines the roles of individuals in the application process
 * - Responsible Person (負責人)
 * - Contact Person (聯絡人)
 * - Managerial Officer (經理人)
 */
export const PERSON_TYPES = [
  "responsiblePerson",
  "contactPerson",
  "managerialOfficer",
] as const; // 負責人, 聯絡人, 經理人

/**
 * Status values for company application workflow
 * @description Tracks the progress of company registration applications through various stages
 * - Submitted (已提交)
 * - Staff Review (內部審核)
 * - Pending Client Update (待客戶更新)
 * - Filing (送件中)
 * - Filed (已送件)
 * - Approved (已核准)
 * - Rejected (已駁回)
 */
export const COMPANY_APPLICATION_STATUS = [
  "submitted", // 已提交
  "staff_review", // 內部審核
  "pending_client_update", // 待客戶更新
  "filing", // 送件中
  "filed", // 已送件
  "approved", // 已核准
  "rejected", // 已駁回
] as const;

/**
 * Status values for review rounds in the application process
 * @description Tracks the state of individual review cycles during application processing
 * - Reviewing (審核中)
 * - Resolved (已解決)
 * - Completed (已完成)
 */
export const REVIEW_ROUND_STATUS = [
  "reviewing", // 審核中
  "resolved", // 已解決
  "completed", // 已完成
] as const;

/**
 * Types of issues that can be identified during application review
 * @description Categorizes different types of problems found during the review process
 * - Missing (缺失)
 * - Invalid (無效)
 * - Clarification (需澄清)
 * - Modification (需修改)
 */
export const REVIEW_ISSUE_TYPE = [
  "missing", // 缺失
  "invalid", // 無效
  "clarification", // 需澄清
  "modification", // 需修改
] as const;

/**
 * Severity levels for review issues
 * @description Indicates the importance and urgency of issues found during application review
 * - Low (低)
 * - Medium (中)
 * - High (高)
 * - Critical (緊急)
 */
export const REVIEW_ISSUE_SEVERITY = [
  "low", // 低
  "medium", // 中
  "high", // 高
  "critical", // 緊急
] as const;

/**
 * Types of partners and stakeholders in company applications
 * @description Legal roles and positions that individuals can hold within a company
 * - Chairman (董事長)
 * - Vice Chairman (副董事長)
 * - Executive Director (常務董事)
 * - Director (董事)
 * - Supervisor (監察人)
 * - Shareholder (股東)
 * - Partner (合夥人)
 * - Manager (經理人)
 * - Legal Representative (法定代理人)
 * - Corporate Shareholder (法人股東)
 */
export const PARTNER_TYPES = [
  "chairman", // 董事長
  "viceChairman", // 副董事長
  "executiveDirector", // 常務董事
  "director", // 董事
  "supervisor", // 監察人
  "shareholder", // 股東
  "partner", // 合夥人
  "manager", // 經理人
  "legalRepresentative", // 法定代理人
  "corporateShareholder", // 法人股東
] as const;

/**
 * Types of shares that can be issued by companies
 * @description Legal classifications of stock shares including ordinary and various preferred share types
 * - Ordinary (普通股)
 * - Preferred (特別股)
 * - Preferred A (甲種特別股)
 * - Preferred B (乙種特別股)
 * - Preferred C (丙種特別股)
 * - Preferred D (丁種特別股)
 * - Preferred E (戊種特別股)
 */
export const SHARE_TYPES = [
  "ordinary", // 普通股
  "preferred", // 特別股
  "preferred_a", // 甲種特別股
  "preferred_b", // 乙種特別股
  "preferred_c", // 丙種特別股
  "preferred_d", // 丁種特別股
  "preferred_e", // 戊種特別股
] as const;

/**
 * Type representing valid organization types for company registration
 * @description Union type of all possible organization types
 * - Corporation (股份有限公司)
 * - Limited Company (有限公司)
 * - Sole Proprietorship (獨資企業)
 * - Partnership (合夥企業)
 */
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

/**
 * Type representing valid person types in company applications
 * @description Union type of person roles in the application process
 * - Responsible Person (負責人)
 * - Contact Person (聯絡人)
 * - Managerial Officer (經理人)
 */
export type PersonType = (typeof PERSON_TYPES)[number];

/**
 * Type representing valid partner/stakeholder types in company applications
 * @description Union type of legal roles and positions within a company
 * - Chairman (董事長)
 * - Vice Chairman (副董事長)
 * - Executive Director (常務董事)
 * - Director (董事)
 * - Supervisor (監察人)
 * - Shareholder (股東)
 * - Partner (合夥人)
 * - Manager (經理人)
 * - Legal Representative (法定代理人)
 * - Corporate Shareholder (法人股東)
 */
export type PartnerType = (typeof PARTNER_TYPES)[number];

/**
 * Types of corporate representative roles
 * @description Specifies how a corporate shareholder is represented
 * - Director Representative (法人董事代表人)
 * - Representative Director (法人代表人董事)
 */
export const CORPORATE_REPRESENTATIVE_TYPES = [
  "directorRepresentative", // 法人董事代表人
  "representativeDirector", // 法人代表人董事
] as const;

export type CorporateRepresentativeType = (typeof CORPORATE_REPRESENTATIVE_TYPES)[number];

/**
 * Type representing valid company application status values
 * @description Union type of application workflow statuses
 * - Submitted (已提交)
 * - Staff Review (內部審核)
 * - Pending Client Update (待客戶更新)
 * - Filing (送件中)
 * - Filed (已送件)
 * - Approved (已核准)
 * - Rejected (已駁回)
 */
export type ApplicationStatus = (typeof COMPANY_APPLICATION_STATUS)[number];

/**
 * Type representing valid review round status values
 * @description Union type of review cycle statuses
 * - Reviewing (審核中)
 * - Resolved (已解決)
 * - Completed (已完成)
 */
export type ReviewRoundStatus = (typeof REVIEW_ROUND_STATUS)[number];

/**
 * Type representing valid review issue types
 * @description Union type of issue categories found during review
 * - Missing (缺失)
 * - Invalid (無效)
 * - Clarification (需澄清)
 * - Modification (需修改)
 */
export type ReviewIssueType = (typeof REVIEW_ISSUE_TYPE)[number];

/**
 * Type representing valid review issue severity levels
 * @description Union type of issue severity classifications
 * - Low (低)
 * - Medium (中)
 * - High (高)
 * - Critical (緊急)
 */
export type ReviewIssueSeverity = (typeof REVIEW_ISSUE_SEVERITY)[number];

/**
 * Type representing valid share types that can be issued by companies
 * @description Union type of stock share classifications
 * - Ordinary (普通股)
 * - Preferred (特別股)
 * - Preferred A (甲種特別股)
 * - Preferred B (乙種特別股)
 * - Preferred C (丙種特別股)
 * - Preferred D (丁種特別股)
 * - Preferred E (戊種特別股)
 */
export type ShareType = (typeof SHARE_TYPES)[number];
