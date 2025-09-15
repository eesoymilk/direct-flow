import type { OPINION_TYPES } from "../utils/constants";

export type OpinionType = (typeof OPINION_TYPES)[number];

export interface AuditReportData {
  // Basic Info
  entityName: string;
  periodStart: Date;
  periodEnd: Date;
  reportDate: Date;
  firmName: string;
  auditorName: string;

  // Opinion Details
  opinionType: OpinionType;
  qualificationReason?: string;
  materialAmount?: number;
  adverseReason?: string;
  disclaimerReason?: string;

  // Framework
  accountingFramework: string;

  // Additional Sections (Enhanced)
  keyAuditMatters?: KeyAuditMatter[];
  otherInformation?: string;
  goingConcern?: GoingConcernUncertainty;
  emphasisOfMatter?: EmphasisMatter;
  otherMatter?: OtherMatter;

  // Previous auditor reference
  previousAuditor?: string;
  previousOpinion?: OpinionType;

  // Comparative figures
  comparativePeriodStart?: Date;
  comparativePeriodEnd?: Date;

  // Independence considerations
  independenceCompliance: boolean;
  ethicalRequirementsCompliance: boolean;
}

export interface KeyAuditMatter {
  title: string;
  description: string;
  auditResponse: string;
}

export interface GoingConcernUncertainty {
  hasUncertainty: boolean;
  description?: string;
  financialStatementReference?: string;
  specificAmounts?: {
    netLoss?: number;
    liabilitiesExcess?: number;
  };
}

export interface EmphasisMatter {
  hasEmphasisMatter: boolean;
  description?: string;
  financialStatementReference?: string;
  specificDetails?: string;
}

export interface OtherMatter {
  hasOtherMatter: boolean;
  description?: string;
  context?: string;
}

export interface AuditReportSection {
  title: string;
  paragraphs: string[];
  isConditional?: boolean;
  condition?: (data: AuditReportData) => boolean;
}

export interface AuditReportTemplate {
  header: {
    title: string;
    recipient: string;
    entity: string;
    period: string;
    comparativePeriod?: string;
  };
  sections: AuditReportSection[];
  footer: {
    firmName: string;
    auditorName: string;
    date: string;
    location?: string;
  };
}

export interface GlobalAuditInfo {
  // Basic company information - filled first
  entityName: string;
  periodStart: Date;
  periodEnd: Date;
  comparativePeriodStart?: Date;
  comparativePeriodEnd?: Date;

  // Auditor and firm details - filled first
  firmName: string;
  auditorName: string;
  reportDate: Date;

  // Framework - filled first
  accountingFramework: "businessAccountingGuidelines" | "IFRS";
}

export interface OpinionSpecificData {
  // Opinion type - selected after global info
  opinionType: OpinionType;

  // Opinion-specific details - filled after selecting opinion type
  qualificationReason?: string;
  materialAmount?: string;
  adverseReason?: string;
  disclaimerReason?: string;

  // Additional matters - optional, filled after opinion type
  goingConcern?: GoingConcernUncertainty;
  emphasisOfMatter?: EmphasisMatter;
  otherMatter?: OtherMatter;
  keyAuditMatters?: KeyAuditMatter[];

  // Previous auditor information - optional
  previousAuditor?: string;
  previousOpinion?: OpinionType;
}

export interface AuditOpinionFormData
  extends GlobalAuditInfo,
    OpinionSpecificData {
  // Compliance fields - can be defaulted
  independenceCompliance: boolean;
  ethicalRequirementsCompliance: boolean;
}
