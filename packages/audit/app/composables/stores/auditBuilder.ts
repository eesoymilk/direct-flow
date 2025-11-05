import { generateCompleteData } from "../../utils/services/mockData";
import type { BasicInfoForm, OpinionInfoForm } from "../../utils/schemas/audit";

export const useAuditBuilderStore = defineStore("auditBuilder", () => {
  // Form state
  const basicInfo = ref<Partial<BasicInfoForm>>({
    isComparativeReport: false,
    isConsolidatedReport: false,
    useEquityMethodInvestment: false,
    auditorNames: [""],
  });

  // Opinion info using OpinionInfoForm with full validation support
  const opinionInfo = ref<OpinionInfoForm>({
    mode: "single",
    opinion: {
      year: 0,
      opinionType: "unqualified",
    },
  });

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
    opinionInfo.value = {
      mode: "single",
      opinion: {
        year: 0,
        opinionType: "unqualified",
      },
    };
    includeOtherMatterSection.value = false;
    includeEmphasisOfMatterSection.value = false;
  };

  const updateBasicInfo = (updates: Partial<BasicInfoForm>) => {
    basicInfo.value = { ...basicInfo.value, ...updates };
  };

  const updateOpinionInfo = (updates: OpinionInfoForm) => {
    // Always expect a full OpinionInfoForm object
    opinionInfo.value = updates;
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
      // Add otherMatterOption to the opinion configuration
      opinionInfo.value = {
        ...opinionInfo.value,
        otherMatterOption: {
          type: "missingPreviousAuditReport",
        },
      };
    } else if (!newVal) {
      // Remove otherMatterOption from the opinion configuration
      const { otherMatterOption, ...rest } = opinionInfo.value;
      opinionInfo.value = rest as OpinionInfoForm;
    }
  });

  watch(includeEmphasisOfMatterSection, (newVal) => {
    if (newVal && !opinionInfo.value.emphasisOfMatterOption) {
      // Add emphasisOfMatterOption to the opinion configuration
      opinionInfo.value = {
        ...opinionInfo.value,
        emphasisOfMatterOption: {
          description: "",
        },
      };
    } else if (!newVal) {
      // Remove emphasisOfMatterOption from the opinion configuration
      const { emphasisOfMatterOption, ...rest } = opinionInfo.value;
      opinionInfo.value = rest as OpinionInfoForm;
    }
  });

  // Auto-initialize Key Audit Matters for IFRS framework
  watch(
    () => basicInfo.value.accountingFramework,
    (newFramework, oldFramework) => {
      if (newFramework === "IFRS") {
        opinionInfo.value = {
          ...opinionInfo.value,
          keyAuditMatterOption: {
            description: "",
          },
          emphasisOfMatterOption: {
            description: "",
          },
        };
        // Initialize second auditor slot if not exists
        if (!basicInfo.value.auditorNames) {
          basicInfo.value.auditorNames = ["", ""];
        } else if (basicInfo.value.auditorNames.length === 1) {
          basicInfo.value.auditorNames.push("");
        }
      } else {
        const { keyAuditMatterOption, emphasisOfMatterOption, ...rest } =
          opinionInfo.value;
        opinionInfo.value = rest as OpinionInfoForm;
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

  // Watcher to auto-switch to single mode when comparative report is disabled
  watch(
    () => basicInfo.value.isComparativeReport,
    (isComparative) => {
      if (!isComparative && opinionInfo.value.mode === "dual") {
        opinionInfo.value = {
          mode: "single",
          opinion: {
            year: basicInfo.value.currentRocYear || 0,
            opinionType: "unqualified",
          },
        };
      }
    }
  );

  // Watcher to auto-update years when currentRocYear changes
  watch(
    () => basicInfo.value.currentRocYear,
    (newYear) => {
      if (opinionInfo.value.mode === "single") {
        opinionInfo.value.opinion.year = newYear || 0;
      } else {
        opinionInfo.value.currentYearOpinion.year = newYear || 0;
        opinionInfo.value.comparativeYearOpinion.year = (newYear || 1) - 1;
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
