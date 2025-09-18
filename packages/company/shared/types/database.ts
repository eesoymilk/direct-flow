import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
// import type { CalendarDate } from "@internationalized/date";
// import type { ShallowRef } from "vue";
import type {
  companies,
  people,
  documents,
  documentTypes,
  companyApplications,
  applicationDocuments,
  applicationPartners,
  reviewRounds,
  reviewIssues,
  reviewVerifications,
  partners,
  partnerShares,
  companyDocuments,
  personDocuments,
} from "../../server/database/schema";

// Database select types (what comes out of queries)
export type Company = InferSelectModel<typeof companies>;
export type Person = InferSelectModel<typeof people>;
export type Document = InferSelectModel<typeof documents>;
export type DocumentType = InferSelectModel<typeof documentTypes>;
export type CompanyApplication = InferSelectModel<typeof companyApplications>;
export type ApplicationDocument = InferSelectModel<typeof applicationDocuments>;
export type ApplicationPartner = InferSelectModel<typeof applicationPartners>;
export type ReviewRound = InferSelectModel<typeof reviewRounds>;
export type ReviewIssue = InferSelectModel<typeof reviewIssues>;
export type ReviewVerification = InferSelectModel<typeof reviewVerifications>;
export type Partner = InferSelectModel<typeof partners>;
export type PartnerShare = InferSelectModel<typeof partnerShares>;
export type CompanyDocument = InferSelectModel<typeof companyDocuments>;
export type PersonDocument = InferSelectModel<typeof personDocuments>;

// Database insert types (what goes into inserts)
export type CompanyInsert = InferInsertModel<typeof companies>;
export type PersonInsert = InferInsertModel<typeof people>;
export type DocumentInsert = InferInsertModel<typeof documents>;
export type DocumentTypeInsert = InferInsertModel<typeof documentTypes>;
export type CompanyApplicationInsert = InferInsertModel<
  typeof companyApplications
>;
export type ApplicationDocumentInsert = InferInsertModel<
  typeof applicationDocuments
>;
export type ApplicationPartnerInsert = InferInsertModel<
  typeof applicationPartners
>;
export type ReviewRoundInsert = InferInsertModel<typeof reviewRounds>;
export type ReviewIssueInsert = InferInsertModel<typeof reviewIssues>;
export type ReviewVerificationInsert = InferInsertModel<
  typeof reviewVerifications
>;
export type PartnerInsert = InferInsertModel<typeof partners>;
export type PartnerShareInsert = InferInsertModel<typeof partnerShares>;
export type CompanyDocumentInsert = InferInsertModel<typeof companyDocuments>;
export type PersonDocumentInsert = InferInsertModel<typeof personDocuments>;

// Composite types for partners with shares
export type PartnerWithDetails = Partner & {
  person: Person;
  partnerShares: PartnerShare[];
};

export type CompanyWithPartners = Company & {
  partners: PartnerWithDetails[];
};
