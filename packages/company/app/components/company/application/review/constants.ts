import type { CompanyDocumentField, PersonDocumentField } from "./types";

export const SECTION_KEYS = [
  "companyBasicInfo",
  "companyBusinessItems",
  "companyMonetaryInfo",
  "responsiblePerson",
  "representative",
  "contactPerson",
  "shareholders",
  "documents",
] as const;

export const FIELD_CLASSIFICATION = [
  "staffProvided", // chosenName, businessItems - provided by staff in first review
  "clientDocument", // requiredDocuments - uploaded by client after first review
  "reviewableField", // all other application fields - reviewed normally
] as const;

export const COMPANY_BASIC_INFO_FIELDS = [
  "candidateNames",
  "organizationType",
  "address",
  "capitalAmount",
] as const;

export const COMPANY_BUSINESS_ITEMS_FIELDS = [
  "businessItemsDescription",
] as const;

export const COMPANY_MONETARY_INFO_FIELDS = [
  "authorizedShares",
  "ordinaryShares",
  "preferredShares",
] as const;

export const PERSON_TYPES = [
  "responsiblePerson",
  "representative",
  "contactPerson",
] as const;

export const PERSON_FIELDS = [
  "name",
  "idNumber",
  "address",
  "telephone",
  "cellphone",
  "email",
  "dateOfBirth",
] as const;

export const SHAREHOLDER_FIELDS = [...PERSON_FIELDS, "shares"] as const;

export const COMPANY_DOCUMENT_FIELDS = [
  "bankBookFront",
  "bankBookInside",
  "bankBookStamp",
  "shareholderPayments",
  "balanceProof",
  "houseUseAgreement",
  "shareholderAgreement",
  "directorConsent",
  "declaration",
  "legalPersonDeclaration",
] as const;

export const PERSON_DOCUMENT_FIELDS = ["idCardFront", "idCardBack"] as const;

export const DOCUMENT_LABELS: Record<CompanyDocumentField, string> = {
  bankBookFront: "公司存摺正面",
  bankBookInside: "公司存摺內頁",
  bankBookStamp: "公司存摺戳章頁",
  shareholderPayments: "股東匯款條或存摺資料",
  balanceProof: "餘額證明或次日的存入100元證明",
  houseUseAgreement: "房屋使用同意書",
  shareholderAgreement: "股東同意書",
  directorConsent: "董監事願任同意書",
  declaration: "聲明書",
  legalPersonDeclaration: "法人聲明書",
};

export const PERSON_DOCUMENT_LABELS: Record<PersonDocumentField, string> = {
  idCardFront: "身分證正面",
  idCardBack: "身分證背面",
};

export const DOCUMENT_CATEGORIES = {
  bankDocuments: {
    title: "銀行相關文件",
    fields: [
      "bankBookFront",
      "bankBookInside",
      "bankBookStamp",
      "balanceProof",
    ] as CompanyDocumentField[],
  },
  shareholderDocuments: {
    title: "股東相關文件",
    fields: [
      "shareholderPayments",
      "shareholderAgreement",
    ] as CompanyDocumentField[],
  },
  legalDocuments: {
    title: "法律文件",
    fields: [
      "houseUseAgreement",
      "directorConsent",
      "declaration",
      "legalPersonDeclaration",
    ] as CompanyDocumentField[],
  },
} as const;
