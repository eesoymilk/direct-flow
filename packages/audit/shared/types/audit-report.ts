export type OpinionType = 'unqualified' | 'qualified' | 'adverse' | 'disclaimer';

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
  
  // Additional Sections
  keyAuditMatters?: KeyAuditMatter[];
  otherInformation?: string;
  goingConcern?: string;
}

export interface KeyAuditMatter {
  title: string;
  description: string;
  auditResponse: string;
}

export interface AuditReportSection {
  title: string;
  paragraphs: string[];
}

export interface AuditReportTemplate {
  header: {
    title: string;
    entity: string;
    period: string;
  };
  sections: AuditReportSection[];
  footer: {
    firmName: string;
    auditorName: string;
    date: string;
    location?: string;
  };
}