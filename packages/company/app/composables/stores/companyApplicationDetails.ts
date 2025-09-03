export const useCompanyApplicationDetailsStore = defineStore(
  "companyApplicationDetails",
  () => {
    const applicationId = ref<string | null>(null);
    const application = ref<CompanyApplicationResponse | null>(null);

    const loadApplication = async (id: string) => {
      applicationId.value = id;
      const rawData = await $fetch(`/api/applications/${id as "[id]"}`);

      console.log("rawData", rawData);

      const { success, data, error } =
        companyApplicationResponseSchema.safeParse(rawData);

      if (!success) {
        console.error("Failed to load application:", error);
        throw error;
      }

      application.value = data;
    };

    return {
      applicationId: readonly(applicationId),
      application: readonly(application),

      loadApplication,
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCompanyApplicationDetailsStore, import.meta.hot)
  );
}
