import type {
  AUDITING_FRAMEWORKS,
  OPINION_TYPES,
  OTHER_MATTER_TYPES,
} from "../utils/constants";

export type OpinionType = (typeof OPINION_TYPES)[number];

export type AccountingFramework = (typeof AUDITING_FRAMEWORKS)[number];

export type OtherMatterType = (typeof OTHER_MATTER_TYPES)[number];

export interface AuditBasicInfo {
  entityName: string;
  currentRocYear: number;
  comparativeRocYear?: number;
  firmName: string;
  auditorName: string;
  accountingFramework: AccountingFramework;
  reportDate: Date;
}

export interface AuditOpinionInfo {
  opinionType: OpinionType;
  reason?: string;
  materialAmount?: number;
  otherMatterOption?:
    | {
        type: "missingPreviousAuditReport";
      }
    | {
        type: "previousReportHandledByOtherAuditor";
        previousAuditReportDate: Date;
      }
    | {
        type: "custom";
        customDescription: string;
      };
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
