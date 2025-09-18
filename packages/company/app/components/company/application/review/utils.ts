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

export const getShareholderDocumentFieldInfos = (
  shareholderCount: number
): FieldInfo[] =>
  Array.from({ length: shareholderCount }, (_, index) => [
    ...PERSON_DOCUMENT_FIELDS.map((field) => ({
      sectionKey: "shareholders" as const,
      fieldPath: `shareholders[${index}].${field}`,
      fieldCategory: "clientDocument" as const,
    })),
  ]).flat();

export const getAllFieldInfos = ({
  shareholderCount,
}: {
  shareholderCount: number;
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

  const shareholderFieldPaths = [
    ...Array.from({ length: shareholderCount }, (_, index) =>
      SHAREHOLDER_FIELDS.map((field) => ({
        sectionKey: "shareholders" as const,
        fieldPath: `shareholders[${index}].${field}`,
        fieldCategory: "reviewableField" as const,
      }))
    ).flat(),
    ...getShareholderDocumentFieldInfos(shareholderCount),
  ];

  return [
    ...companyFieldPaths,
    ...personFieldPaths,
    ...shareholderFieldPaths,
    ...getCompanyDocumentFieldInfos(),
  ];
};

export const getAllDocumentFields = (shareholderCount: number): FieldInfo[] => [
  ...getCompanyDocumentFieldInfos(),
  ...PERSON_TYPES.flatMap((personType) =>
    getPersonDocumentFieldInfos(personType)
  ),
  ...Array.from({ length: shareholderCount }, (_, index) => [
    {
      sectionKey: "shareholders" as const,
      fieldPath: `shareholders[${index}].idCardFront`,
      fieldCategory: "clientDocument" as const,
    },
    {
      sectionKey: "shareholders" as const,
      fieldPath: `shareholders[${index}].idCardBack`,
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
    shareholders: { issues: [], verifications: [], isOpen: false },
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
