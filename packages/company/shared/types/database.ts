import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  companies,
  people,
  documents,
  documentTypes,
  companyApplications,
  applicationDocuments,
  applicationShareholders,
  reviewRounds,
  reviewIssues,
  reviewVerifications,
  shareholders,
  shareholderShares,
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
export type ApplicationShareholder = InferSelectModel<
  typeof applicationShareholders
>;
export type ReviewRound = InferSelectModel<typeof reviewRounds>;
export type ReviewIssue = InferSelectModel<typeof reviewIssues>;
export type ReviewVerification = InferSelectModel<typeof reviewVerifications>;
export type Shareholder = InferSelectModel<typeof shareholders>;
export type ShareholderShare = InferSelectModel<typeof shareholderShares>;
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
export type ApplicationShareholderInsert = InferInsertModel<
  typeof applicationShareholders
>;
export type ReviewRoundInsert = InferInsertModel<typeof reviewRounds>;
export type ReviewIssueInsert = InferInsertModel<typeof reviewIssues>;
export type ReviewVerificationInsert = InferInsertModel<
  typeof reviewVerifications
>;
export type ShareholderInsert = InferInsertModel<typeof shareholders>;
export type ShareholderShareInsert = InferInsertModel<typeof shareholderShares>;
export type CompanyDocumentInsert = InferInsertModel<typeof companyDocuments>;
export type PersonDocumentInsert = InferInsertModel<typeof personDocuments>;

// Composite types for shareholders with shares
export type ShareholderWithDetails = Shareholder & {
  person: Person;
  shareholderShares: ShareholderShare[];
};

export type CompanyWithShareholders = Company & {
  shareholders: ShareholderWithDetails[];
};

// User role types (since clients don't need to login)
export type UserRole = "client" | "staff";

// Form-specific types that match Zod schemas
export type PersonForm = {
  name: string;
  idNumber: string;
  address: string;
  telephone: string;
  cellphone: string;
  email: string;
};

export type CompanyApplicationForm = {
  candidateNames: string[];
  organizationType: OrganizationType;
  isCloselyHeld?: boolean;
  businessItemsDescription: string;
  address: string;
  capitalAmount?: number;
  authorizedShares?: number;
  ordinaryShares?: number;
  preferredShares?: number;
  hasParValueFreeShares?: boolean;
  isDirectorSameAsResponsiblePerson: boolean;
  isContactPersonSameAsResponsiblePerson: boolean;
  isContactPersonSameAsDirector: boolean;
};
