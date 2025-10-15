import { generateCompleteData } from "../../utils/services/mockData";

export const useAuditBuilderStore = defineStore("auditBuilder", () => {
  // Form state
  const basicInfo = ref<Partial<BasicInfoForm>>({
    isComparativeReport: false,
    isConsolidatedReport: false,
    useEquityMethodInvestment: false,
    auditorNames: [""],
  });
  const opinionInfo = ref<Partial<OpinionInfoForm>>({});
  const includeOtherMatterSection = ref(false);
  const includeEmphasisOfMatterSection = ref(false);

  const highlightVariable = ref(false);

  // Store-specific state
  const isSaving = ref(false);
  const lastSaved = ref<Date | null>(null);

  const toggleHighlightVariable = () => {
    highlightVariable.value = !highlightVariable.value;
  };

  // Form actions
  const generateMockData = () => {
    const mockData = generateCompleteData();
    basicInfo.value = mockData.basicInfo;
    opinionInfo.value = mockData.opinionInfo;
    includeOtherMatterSection.value = !!mockData.opinionInfo.otherMatterOption;
  };

  const resetForm = () => {
    basicInfo.value = {
      isComparativeReport: false,
      isConsolidatedReport: false,
      useEquityMethodInvestment: false,
      auditorNames: [""],
    };
    opinionInfo.value = {};
    includeOtherMatterSection.value = false;
    includeEmphasisOfMatterSection.value = false;
  };

  const updateBasicInfo = (updates: Partial<BasicInfoForm>) => {
    basicInfo.value = { ...basicInfo.value, ...updates };
  };

  const updateOpinionInfo = (updates: Partial<OpinionInfoForm>) => {
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
        type: "missingPreviousAuditReport",
      };
    } else if (!newVal) {
      const { otherMatterOption, ...rest } = opinionInfo.value;
      opinionInfo.value = rest;
    }
  });

  watch(includeEmphasisOfMatterSection, (newVal) => {
    if (newVal && !opinionInfo.value.emphasisOfMatterOption) {
      opinionInfo.value.emphasisOfMatterOption = {
        description: "",
      };
    } else if (!newVal) {
      const { emphasisOfMatterOption, ...rest } = opinionInfo.value;
      opinionInfo.value = rest;
    }
  });

  // Auto-initialize Key Audit Matters for IFRS framework
  watch(
    () => basicInfo.value.accountingFramework,
    (newFramework, oldFramework) => {
      if (newFramework === "IFRS") {
        opinionInfo.value.keyAuditMatterOption = {
          description: "",
        };
        opinionInfo.value.emphasisOfMatterOption = {
          description: "",
        };
        // Initialize second auditor slot if not exists
        if (!basicInfo.value.auditorNames) {
          basicInfo.value.auditorNames = ["", ""];
        } else if (basicInfo.value.auditorNames.length === 1) {
          basicInfo.value.auditorNames.push("");
        }
      } else {
        opinionInfo.value.keyAuditMatterOption = undefined;
        opinionInfo.value.emphasisOfMatterOption = undefined;
        // Trim to single auditor when switching away from IFRS
        if (
          oldFramework === "IFRS" &&
          basicInfo.value.auditorNames &&
          basicInfo.value.auditorNames.length > 1
        ) {
          basicInfo.value.auditorNames = [
            basicInfo.value.auditorNames[0] || "",
          ];
        }
      }
    }
  );

  return {
    // Form state
    basicInfo,
    opinionInfo,
    includeOtherMatterSection,
    includeEmphasisOfMatterSection,
    highlightVariable,

    // Store-specific state
    isSaving: readonly(isSaving),
    lastSaved: readonly(lastSaved),

    // Form actions
    generateMockData,
    resetForm,
    updateBasicInfo,
    updateOpinionInfo,
    toggleHighlightVariable,

    // Store-specific actions
    saveTemplate,
    exportReport,
  };
});
