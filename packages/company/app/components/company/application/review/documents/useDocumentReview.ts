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

export type CompanyDocumentField = (typeof COMPANY_DOCUMENT_FIELDS)[number];

export const PERSON_DOCUMENT_FIELDS = [
  "idCardFront",
  "idCardBack",
] as const;

export type PersonDocumentField = (typeof PERSON_DOCUMENT_FIELDS)[number];

export type DocumentField = CompanyDocumentField | PersonDocumentField;

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
    fields: ["bankBookFront", "bankBookInside", "bankBookStamp", "balanceProof"] as CompanyDocumentField[],
  },
  shareholderDocuments: {
    title: "股東相關文件", 
    fields: ["shareholderPayments", "shareholderAgreement"] as CompanyDocumentField[],
  },
  legalDocuments: {
    title: "法律文件",
    fields: ["houseUseAgreement", "directorConsent", "declaration", "legalPersonDeclaration"] as CompanyDocumentField[],
  },
} as const;

export const useDocumentReview = () => {
  const detailsStore = useCompanyApplicationDetailsStore();

  const { application } = storeToRefs(detailsStore);

  // Mock document data - in reality this would come from the application
  // For now, we'll assume documents are missing in first review round
  const companyDocuments = computed(() => {
    if (!application.value) {
      throw new Error("Application not found");
    }

    // Check if this is the first review round (no documents uploaded yet)
    const isFirstReview = !application.value.reviewRounds?.length;
    
    return {
      bankBookFront: isFirstReview ? null : "mock-file-url",
      bankBookInside: isFirstReview ? null : "mock-file-url",
      bankBookStamp: isFirstReview ? null : "mock-file-url", 
      shareholderPayments: isFirstReview ? [] : ["mock-file-url"],
      balanceProof: isFirstReview ? null : "mock-file-url",
      houseUseAgreement: isFirstReview ? null : "mock-file-url",
      shareholderAgreement: isFirstReview ? null : "mock-file-url",
      directorConsent: isFirstReview ? null : "mock-file-url",
      declaration: isFirstReview ? null : "mock-file-url",
      legalPersonDeclaration: isFirstReview ? null : "mock-file-url",
    };
  });

  const getPersonDocuments = (personType: 'responsiblePerson' | 'representative' | 'contactPerson' | 'shareholder', shareholderId?: number) => {
    if (!application.value) {
      throw new Error("Application not found");
    }

    const isFirstReview = !application.value.reviewRounds?.length;
    
    return {
      idCardFront: isFirstReview ? null : "mock-file-url",
      idCardBack: isFirstReview ? null : "mock-file-url",
    };
  };

  const getDocumentStatus = (field: CompanyDocumentField) => {
    const document = companyDocuments.value[field];
    
    // For shareholderPayments (array)
    if (field === 'shareholderPayments') {
      return Array.isArray(document) && document.length > 0 ? 'uploaded' : 'missing';
    }
    
    // For optional legalPersonDeclaration
    if (field === 'legalPersonDeclaration') {
      return document ? 'uploaded' : 'optional';
    }
    
    // For other required documents
    return document ? 'uploaded' : 'missing';
  };

  const getPersonDocumentStatus = (field: PersonDocumentField, personType: string, shareholderId?: number) => {
    const documents = getPersonDocuments(personType as any, shareholderId);
    return documents[field] ? 'uploaded' : 'missing';
  };

  return {
    companyDocuments,
    getPersonDocuments,
    getDocumentStatus,
    getPersonDocumentStatus,
  };
};