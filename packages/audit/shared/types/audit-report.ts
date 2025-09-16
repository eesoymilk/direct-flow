import type {
  AUDITING_FRAMEWORKS,
  OPINION_TYPES,
  OTHER_MATTER_OPTIONS,
} from "../utils/constants";

export type OpinionType = (typeof OPINION_TYPES)[number];

export type AccountingFramework = (typeof AUDITING_FRAMEWORKS)[number];

export type OtherMatterOption = (typeof OTHER_MATTER_OPTIONS)[number];

export interface AuditBasicInfo {
  entityName: string;
  currentYear: number;
  comparativeYear?: number;
  firmName: string;
  auditorName: string;
  accountingFramework: AccountingFramework;
  reportDate: Date;
}

export interface AuditOpinionInfo {
  opinionType: OpinionType;
  reason?: string;
  materialAmount?: number;
  otherMatterOption?: OtherMatterOption;
}

export interface AuditReportData {
  // Basic Info
  basicInfo: AuditBasicInfo;

  // Opinion Details
  opinionInfo: AuditOpinionInfo;
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
  };
  sections: AuditReportSection[];
  footer: {
    firmName: string;
    auditorName: string;
    date: string;
    location?: string;
  };
}
