import {
  COMPANY_BASIC_INFO_FIELDS,
  COMPANY_BUSINESS_ITEMS_FIELDS,
  COMPANY_DOCUMENT_FIELDS,
  COMPANY_MONETARY_INFO_FIELDS,
  PERSON_DOCUMENT_FIELDS,
  PERSON_FIELDS,
  SHAREHOLDER_FIELDS,
} from "./constants";
import type { FieldClassification, FieldStatus, SectionKey } from "./types";

type FieldInfo = {
  sectionKey: SectionKey;
  fieldPath: string;
  fieldCategory: FieldClassification;
};

export const getCompanyDocumentFieldInfos = (): FieldInfo[] =>
  COMPANY_DOCUMENT_FIELDS.map((field) => ({
    sectionKey: "documents" as const,
    fieldPath: `documents.${field}`,
    fieldCategory: "clientDocument" as const,
  }));

export const getPersonDocumentFieldInfos = (
  personType: PersonType
): FieldInfo[] =>
  PERSON_DOCUMENT_FIELDS.map((field) => ({
    sectionKey: personType,
    fieldPath: `${personType}.${field}`,
    fieldCategory: "clientDocument" as const,
  }));

export const getPartnerDocumentFieldInfos = (
  partnerCount: number
): FieldInfo[] =>
  Array.from({ length: partnerCount }, (_, index) => [
    ...PERSON_DOCUMENT_FIELDS.map((field) => ({
      sectionKey: "partners" as const,
      fieldPath: `partners[${index}].${field}`,
      fieldCategory: "clientDocument" as const,
    })),
  ]).flat();

export const getAllFieldInfos = ({
  partnerCount,
}: {
  partnerCount: number;
}): {
  sectionKey: SectionKey;
  fieldPath: string;
  fieldCategory: FieldClassification;
}[] => {
  const companyFieldPaths = [
    ...COMPANY_BASIC_INFO_FIELDS,
    ...COMPANY_BUSINESS_ITEMS_FIELDS,
    ...COMPANY_MONETARY_INFO_FIELDS,
  ].map((field) => ({
    sectionKey: "companyBasicInfo" as const,
    fieldPath: `company.${field}`,
    fieldCategory: "reviewableField" as const,
  }));

  const personFieldPaths = PERSON_TYPES.flatMap((personType) => [
    ...PERSON_FIELDS.map((field) => ({
      sectionKey: personType,
      fieldPath: `${personType}.${field}`,
      fieldCategory: "reviewableField" as const,
    })),
    ...getPersonDocumentFieldInfos(personType),
  ]);

  const partnerFieldPaths = [
    ...Array.from({ length: partnerCount }, (_, index) =>
      SHAREHOLDER_FIELDS.map((field) => ({
        sectionKey: "partners" as const,
        fieldPath: `partners[${index}].${field}`,
        fieldCategory: "reviewableField" as const,
      }))
    ).flat(),
    ...getPartnerDocumentFieldInfos(partnerCount),
  ];

  return [
    ...companyFieldPaths,
    ...personFieldPaths,
    ...partnerFieldPaths,
    ...getCompanyDocumentFieldInfos(),
  ];
};

export const getAllDocumentFields = (partnerCount: number): FieldInfo[] => [
  ...getCompanyDocumentFieldInfos(),
  ...PERSON_TYPES.flatMap((personType) =>
    getPersonDocumentFieldInfos(personType)
  ),
  ...Array.from({ length: partnerCount }, (_, index) => [
    {
      sectionKey: "partners" as const,
      fieldPath: `partners[${index}].idCardFront`,
      fieldCategory: "clientDocument" as const,
    },
    {
      sectionKey: "partners" as const,
      fieldPath: `partners[${index}].idCardBack`,
      fieldCategory: "clientDocument" as const,
    },
  ]).flat(),
];

export const getInitalReviewSections = () => {
  return {
    companyBasicInfo: { issues: [], verifications: [], isOpen: false },
    companyBusinessItems: { issues: [], verifications: [], isOpen: false },
    companyMonetaryInfo: { issues: [], verifications: [], isOpen: false },
    responsiblePerson: { issues: [], verifications: [], isOpen: false },
    representative: { issues: [], verifications: [], isOpen: false },
    contactPerson: { issues: [], verifications: [], isOpen: false },
    partners: { issues: [], verifications: [], isOpen: false },
    documents: { issues: [], verifications: [], isOpen: false },
  };
};

export const generateFieldStatus = (
  issue?: ReviewIssueSchema,
  verification?: ReviewVerificationSchema
): FieldStatus => {
  const hasIssue = !!issue;
  const isVerified = !!verification;

  if (!hasIssue && !isVerified) {
    return {
      hasIssue: false,
      issue: undefined,
      isVerified: false,
      verification: undefined,
    };
  }

  if (hasIssue && !isVerified) {
    return {
      hasIssue: true,
      issue,
      isVerified: false,
      verification: undefined,
    };
  }

  if (!hasIssue && isVerified) {
    return {
      hasIssue: false,
      issue: undefined,
      isVerified: true,
      verification,
    };
  }

  throw new Error(
    `Invalid field status: hasIssue=${hasIssue}, isVerified=${isVerified}`
  );
};
