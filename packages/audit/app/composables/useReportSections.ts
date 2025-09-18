export const useReportSections = () => {
  const store = useAuditBuilderStore();

  const { basicInfo, opinionInfo } = storeToRefs(store);

  const opinionBasisSection = computed(() =>
    generateOpinionBasisSection(basicInfo.value, opinionInfo.value)
  );

  const opinionSection = computed(() =>
    generateOpinionSection(basicInfo.value, opinionInfo.value)
  );

  const otherMatterSection = computed(() =>
    generateOtherMatterSection(basicInfo.value, opinionInfo.value)
  );

  const managementResponsibilitySection = computed(() =>
    generateManagementResponsibilitySection(basicInfo.value)
  );

  const sections = computed(() => [
    opinionSection.value,
    opinionBasisSection.value,
    otherMatterSection.value,
    managementResponsibilitySection.value,
  ]);

  return {
    sections,
  };
};
