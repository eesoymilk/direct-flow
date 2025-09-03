export const COMPANY_BASIC_INFO_FIELDS = [
  "candidateNames",
  "organizationType",
  "address",
  "capitalAmount",
] as const;

export type CompanyBasicInfoField = (typeof COMPANY_BASIC_INFO_FIELDS)[number];

export const COMPANY_BUSINESS_ITEMS_FIELDS = [
  "businessItemsDescription",
] as const;

export type CompanyBusinessItemsField =
  (typeof COMPANY_BUSINESS_ITEMS_FIELDS)[number];

export const COMPANY_MONETARY_INFO_FIELDS = [
  "authorizedShares",
  "ordinaryShares",
  "preferredShares",
] as const;

export type CompanyMonetaryInfoField =
  (typeof COMPANY_MONETARY_INFO_FIELDS)[number];

export type CompanyField =
  | CompanyBasicInfoField
  | CompanyBusinessItemsField
  | CompanyMonetaryInfoField;

export const useCompanyReview = () => {
  const detailsStore = useCompanyApplicationDetailsStore();
  const reviewStore = useCompanyApplicationReviewStore();
  const { getSectionState, toggleSection } = reviewStore;

  const { application } = storeToRefs(detailsStore);

  const companyBasicInfo = computed(() => {
    if (!application.value) {
      throw new Error("Application not found");
    }
    return {
      candidateNames: application.value.candidateNames,
      organizationType: application.value.organizationType,
      address: application.value.address,
      capitalAmount: application.value.capitalAmount,
    };
  });

  const companyBusinessItems = computed(() => {
    if (!application.value) {
      throw new Error("Application not found");
    }
    return {
      businessItemsDescription: application.value.businessItemsDescription,
    };
  });

  const companyMonetaryInfo = computed(() => {
    if (!application.value) {
      throw new Error("Application not found");
    }
    return {
      authorizedShares: application.value.authorizedShares,
      ordinaryShares: application.value.ordinaryShares,
      preferredShares: application.value.preferredShares,
    };
  });

  const basicInfoSectionState = computed(() =>
    getSectionState("companyBasicInfo")
  );

  const businessItemsSectionState = computed(() =>
    getSectionState("companyBusinessItems")
  );

  const monetaryInfoSectionState = computed(() =>
    getSectionState("companyMonetaryInfo")
  );

  const basicInfoSectionIsOpen = computed({
    get: () => basicInfoSectionState.value.isOpen,
    set: () => toggleSection("companyBasicInfo"),
  });

  const businessItemsSectionIsOpen = computed({
    get: () => businessItemsSectionState.value.isOpen,
    set: () => toggleSection("companyBusinessItems"),
  });

  const monetaryInfoSectionIsOpen = computed({
    get: () => monetaryInfoSectionState.value.isOpen,
    set: () => toggleSection("companyMonetaryInfo"),
  });

  return {
    // State
    companyBasicInfo,
    companyBusinessItems,
    companyMonetaryInfo,
    basicInfoSectionState,
    businessItemsSectionState,
    monetaryInfoSectionState,
    basicInfoSectionIsOpen,
    businessItemsSectionIsOpen,
    monetaryInfoSectionIsOpen,
  };
};
