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
