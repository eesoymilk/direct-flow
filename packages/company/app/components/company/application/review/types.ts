import {
  COMPANY_BASIC_INFO_FIELDS,
  COMPANY_BUSINESS_ITEMS_FIELDS,
  COMPANY_DOCUMENT_FIELDS,
  COMPANY_MONETARY_INFO_FIELDS,
  PERSON_DOCUMENT_FIELDS,
  PERSON_FIELDS,
  FIELD_CLASSIFICATION,
  SECTION_KEYS,
  SHAREHOLDER_FIELDS,
} from "./constants";

export type SectionKey = (typeof SECTION_KEYS)[number];

export interface SectionState {
  issues: ReviewIssueSchema[];
  verifications: ReviewVerificationSchema[];
  isOpen: boolean;
}

export type ReviewSections = Record<SectionKey, SectionState>;

export type FieldClassification = (typeof FIELD_CLASSIFICATION)[number];

export type FieldStatus =
  | {
      hasIssue: true;
      issue: ReviewIssueSchema;
      isVerified: false;
      verification: undefined;
    }
  | {
      hasIssue: false;
      issue: undefined;
      isVerified: true;
      verification: ReviewVerificationSchema;
    }
  | {
      hasIssue: false;
      issue: undefined;
      isVerified: false;
      verification: undefined;
    };

export type SectionStatus = {
  hasIssues: boolean;
  hasCriticalIssues: boolean;
  hasVerifications: boolean;
  issueCount: number;
  criticalIssueCount: number;
  verificationCount: number;
  totalFields: number;
  isComplete: boolean;
};

export type SectionConfig = {
  sectionTitle: string;
  verifyAllLabel: string;
  clearAllLabel: string;
  markReviewedLabel: string;
};

export type CompanyBasicInfoField = (typeof COMPANY_BASIC_INFO_FIELDS)[number];

export type CompanyBusinessItemsField =
  (typeof COMPANY_BUSINESS_ITEMS_FIELDS)[number];

export type CompanyMonetaryInfoField =
  (typeof COMPANY_MONETARY_INFO_FIELDS)[number];

export type CompanyField =
  | CompanyBasicInfoField
  | CompanyBusinessItemsField
  | CompanyMonetaryInfoField;

export type PersonField = (typeof PERSON_FIELDS)[number];

export type ShareholderField = (typeof SHAREHOLDER_FIELDS)[number];

export type CompanyDocumentField = (typeof COMPANY_DOCUMENT_FIELDS)[number];

export type PersonDocumentField = (typeof PERSON_DOCUMENT_FIELDS)[number];
