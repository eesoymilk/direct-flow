export const useCompanyReview = () => {
  const detailsStore = useCompanyApplicationDetailsStore();

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
      ordinarySharesAmount: application.value.ordinarySharesAmount,
      preferredSharesAmount: application.value.preferredSharesAmount,
    };
  });

  return {
    companyBasicInfo,
    companyBusinessItems,
    companyMonetaryInfo,
  };
};
