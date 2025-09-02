/**
 * @deprecated This composable is replaced by the useCompanyApplicationReviewStore
 * Use the store-based approach instead for better state management
 */

import type { ReviewIssue, ReviewVerification, ReviewOverlay } from '~/types/review';

export const useReviewOverlay = (application: Ref<any> | any) => {
  const appData = isRef(application) ? application : ref(application);
  
  // Extract review data from the application
  const reviewOverlay = computed((): ReviewOverlay => {
    const latestRound = appData.value?.reviewRounds?.[0];
    return {
      issues: latestRound?.reviewIssues || [],
      verifications: latestRound?.reviewVerifications || []
    };
  });

  // Helper functions to check review state for specific fields/sections
  const hasIssue = (fieldPath: string): boolean => {
    return reviewOverlay.value.issues.some(issue => issue.fieldPath === fieldPath);
  };

  const isVerified = (fieldPath: string): boolean => {
    return reviewOverlay.value.verifications.some(verification => 
      verification.fieldPath === fieldPath
    );
  };

  const getIssue = (fieldPath: string): ReviewIssue | undefined => {
    return reviewOverlay.value.issues.find(issue => issue.fieldPath === fieldPath);
  };

  // Get all issues for a section (e.g., all company.* fields)
  const getSectionIssues = (sectionPrefix: string): ReviewIssue[] => {
    return reviewOverlay.value.issues.filter(issue => 
      issue.fieldPath.startsWith(sectionPrefix)
    );
  };

  // Get all verifications for a section
  const getSectionVerifications = (sectionPrefix: string): ReviewVerification[] => {
    return reviewOverlay.value.verifications.filter(verification =>
      verification.fieldPath.startsWith(sectionPrefix) 
    );
  };

  // Check if entire section is verified (all fields verified, no issues)
  const isSectionVerified = (sectionPrefix: string): boolean => {
    const sectionIssues = getSectionIssues(sectionPrefix);
    return sectionIssues.length === 0; // No issues in this section
  };

  // Get section status summary
  const getSectionStatus = (sectionPrefix: string) => {
    const issues = getSectionIssues(sectionPrefix);
    const verifications = getSectionVerifications(sectionPrefix);
    
    return {
      hasIssues: issues.length > 0,
      issueCount: issues.length,
      verificationCount: verifications.length,
      isComplete: issues.length === 0,
      highPriorityIssues: issues.filter(i => i.severity === 'high' || i.severity === 'critical').length
    };
  };

  // Overall review progress
  const reviewProgress = computed(() => {
    const totalIssues = reviewOverlay.value.issues.length;
    const totalVerifications = reviewOverlay.value.verifications.length;
    const criticalIssues = reviewOverlay.value.issues.filter(
      i => i.severity === 'critical'
    ).length;
    
    return {
      totalIssues,
      totalVerifications,
      criticalIssues,
      hasBlockingIssues: criticalIssues > 0
    };
  });

  return {
    reviewOverlay: readonly(reviewOverlay),
    hasIssue,
    isVerified,
    getIssue,
    getSectionIssues,
    getSectionVerifications,
    isSectionVerified,
    getSectionStatus,
    reviewProgress
  };
};