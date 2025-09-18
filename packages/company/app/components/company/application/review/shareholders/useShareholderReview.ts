export const usePartnerReview = () => {
  const detailsStore = useCompanyApplicationDetailsStore();

  const partners = computed(() => {
    if (!detailsStore.application) {
      throw new Error("Application not found");
    }
    return detailsStore.application.partners;
  });

  return {
    partners,
  };
};
