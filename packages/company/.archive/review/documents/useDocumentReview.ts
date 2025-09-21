import type { CompanyDocumentField, PersonDocumentField } from "../types";

export const DOCUMENT_SECTION_KEY = "documents";

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
      partnerPayments: isFirstReview ? [] : ["mock-file-url"],
      balanceProof: isFirstReview ? null : "mock-file-url",
      houseUseAgreement: isFirstReview ? null : "mock-file-url",
      partnerAgreement: isFirstReview ? null : "mock-file-url",
      directorConsent: isFirstReview ? null : "mock-file-url",
      declaration: isFirstReview ? null : "mock-file-url",
      legalPersonDeclaration: isFirstReview ? null : "mock-file-url",
    };
  });

  const getPersonDocuments = (
    personType:
      | "responsiblePerson"
      | "representative"
      | "contactPerson"
      | "partner",
    partnerId?: number
  ) => {
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

    // For partnerPayments (array)
    if (field === "partnerPayments") {
      return Array.isArray(document) && document.length > 0
        ? "uploaded"
        : "missing";
    }

    // For optional legalPersonDeclaration
    if (field === "legalPersonDeclaration") {
      return document ? "uploaded" : "optional";
    }

    // For other required documents
    return document ? "uploaded" : "missing";
  };

  const getPersonDocumentStatus = (
    field: PersonDocumentField,
    personType: string,
    partnerId?: number
  ) => {
    const documents = getPersonDocuments(personType as any, partnerId);
    return documents[field] ? "uploaded" : "missing";
  };

  return {
    companyDocuments,
    getPersonDocuments,
    getDocumentStatus,
    getPersonDocumentStatus,
  };
};
