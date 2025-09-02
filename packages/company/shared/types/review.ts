import type { ReviewIssue, ReviewVerification } from "./database";

// UI-specific types for the review interface
export interface ReviewOverlay {
  issues: ReviewIssue[];
  verifications: ReviewVerification[];
}

export interface ReviewSectionStatus {
  hasIssues: boolean;
  issueCount: number;
  verificationCount: number;
  isComplete: boolean;
  highPriorityIssues: number;
}

export interface ReviewSection {
  key: string;
  title: string;
  description: string;
  fields: string[];
  status: ReviewSectionStatus;
  priority: "low" | "medium" | "high";
}

export interface ReviewProgress {
  totalIssues: number;
  totalVerifications: number;
  criticalIssues: number;
  hasBlockingIssues: boolean;
}
