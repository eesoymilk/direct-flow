export const useShareholderReview = () => {
  const detailsStore = useCompanyApplicationDetailsStore();

  const shareholders = computed(() => {
    if (!detailsStore.application) {
      throw new Error("Application not found");
    }
    return detailsStore.application.shareholders;
  });

  return {
    shareholders,
  };
};
