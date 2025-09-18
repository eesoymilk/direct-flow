import { generateCompleteData } from "../../utils/services/mockData";

export const useAuditBuilderStore = defineStore("auditBuilder", () => {
  // Form state
  const basicInfo = ref<Partial<AuditBasicInfo>>({});
  const opinionInfo = ref<Partial<AuditOpinionInfo>>({});
  const hasComparativePeriod = ref(false);
  const includeOtherMatterSection = ref(false);

  // Store-specific state
  const isSaving = ref(false);
  const lastSaved = ref<Date | null>(null);

  // Form actions
  const generateMockData = () => {
    const mockData = generateCompleteData();
    basicInfo.value = mockData.basicInfo;
    opinionInfo.value = mockData.opinionInfo;
    hasComparativePeriod.value = !!mockData.basicInfo.comparativeRocYear;
    includeOtherMatterSection.value = !!mockData.opinionInfo.otherMatterOption;
  };

  const resetForm = () => {
    basicInfo.value = {};
    opinionInfo.value = {};
    hasComparativePeriod.value = false;
    includeOtherMatterSection.value = false;
  };

  const updateBasicInfo = (updates: Partial<AuditBasicInfo>) => {
    basicInfo.value = { ...basicInfo.value, ...updates };
  };

  const updateOpinionInfo = (updates: Partial<AuditOpinionInfo>) => {
    opinionInfo.value = { ...opinionInfo.value, ...updates };
  };

  // Store-specific actions
  const saveTemplate = async () => {
    try {
      isSaving.value = true;
      // TODO: Implement template saving logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock save
      lastSaved.value = new Date();
    } finally {
      isSaving.value = false;
    }
  };

  const exportReport = async () => {
    try {
      // TODO:Validate form before export

      // Send to server for document generation
      const response = await $fetch("/api/audit/generate-report", {
        method: "POST",
        body: {
          /* TODO: Add form data */
        },
        responseType: "blob",
      });

      return response;
    } catch (error) {
      console.error("Export failed:", error);
      throw error;
    }
  };

  // Watchers
  watch(includeOtherMatterSection, (newVal) => {
    if (newVal && !opinionInfo.value.otherMatterOption) {
      opinionInfo.value.otherMatterOption = {
        type: "previousReportHandledByOtherAuditor",
      };
    } else if (!newVal) {
      const { otherMatterOption, ...rest } = opinionInfo.value;
      opinionInfo.value = rest;
    }
  });

  watch(hasComparativePeriod, (newVal) => {
    if (!newVal) {
      const { comparativeRocYear, ...rest } = basicInfo.value;
      basicInfo.value = rest;
    }
  });

  return {
    // Form state
    basicInfo,
    opinionInfo,
    hasComparativePeriod,
    includeOtherMatterSection,

    // Store-specific state
    isSaving: readonly(isSaving),
    lastSaved: readonly(lastSaved),

    // Form actions
    generateMockData,
    resetForm,
    updateBasicInfo,
    updateOpinionInfo,

    // Store-specific actions
    saveTemplate,
    exportReport,
  };
});
