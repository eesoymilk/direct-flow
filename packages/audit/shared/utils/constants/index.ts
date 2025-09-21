export const OPINION_TYPES = [
  "unqualified", // 無保留意見
  "qualifiedDisclaimer", // 保留意見 (無法表示意見)
  "qualifiedAdverse", // 保留意見 (否定意見)
  "adverse", // 否定意見
  "disclaimer", // 無法表示意見
] as const;

export const AUDITING_FRAMEWORKS = [
  "businessAccountingGuidelines", // 商業會計法
  "IFRS", // 國際財務報導準則
] as const;

export const OTHER_MATTER_TYPES = [
  "previousReportHandledByOtherAuditor", // 前次查核報告由其他會計師出具
  "missingPreviousAuditReport", // 缺漏前次查核報告
  "custom", // 自定義
] as const;
