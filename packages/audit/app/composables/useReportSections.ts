import { generateEmphasisOfMatterSection } from "@/utils/audit/sections/emphasisOfMatter";
import { generateHeaderSection } from "@/utils/audit/sections/header";
import { generateKeyAuditMattersSection } from "@/utils/audit/sections/keyAuditMatters";
import {
  generateOpinionSection,
  generateOpinionBasisSection,
} from "@/utils/audit/sections/opinion";
import { generateOtherMattersSection } from "@/utils/audit/sections/otherMatters";
import {
  generateAuditorResponsibilitySection,
  generateManagementResponsibilitySection,
} from "@/utils/audit/sections/responsibilities";
import { generateFooterSection } from "@/utils/audit/sections/footer";

export const useReportSections = () => {
  const store = useOpinionBuilderStore();
  const { basicInfo, opinionInfo, highlightVariable } = storeToRefs(store);

  const headerSection = computed(() => generateHeaderSection(basicInfo.value));

  const opinionSection = computed(() =>
    generateOpinionSection(basicInfo.value, opinionInfo.value, { highlightVariable: highlightVariable.value })
  );

  const opinionBasisSection = computed(() =>
    generateOpinionBasisSection(basicInfo.value, opinionInfo.value, { highlightVariable: highlightVariable.value })
  );

  const otherMatterSection = computed(() =>
    generateOtherMattersSection(basicInfo.value, opinionInfo.value, { highlightVariable: highlightVariable.value })
  );

  const managementResponsibilitySection = computed(() =>
    generateManagementResponsibilitySection(basicInfo.value, { highlightVariable: highlightVariable.value })
  );

  const auditorResponsibilitySection = computed(() =>
    generateAuditorResponsibilitySection(basicInfo.value, { highlightVariable: highlightVariable.value })
  );

  const keyAuditMattersSection = computed(() =>
    generateKeyAuditMattersSection(opinionInfo.value, { highlightVariable: highlightVariable.value })
  );

  const emphasisOfMatterSection = computed(() =>
    generateEmphasisOfMatterSection(opinionInfo.value, { highlightVariable: highlightVariable.value })
  );

  const footerSection = computed(() => generateFooterSection(basicInfo.value));

  const sections = computed(() => {
    const baseSections = [
      headerSection.value,
      opinionSection.value,
      opinionBasisSection.value,
      otherMatterSection.value,
      managementResponsibilitySection.value,
      auditorResponsibilitySection.value,
    ];

    // Add Key Audit Matters section for IFRS framework
    if (basicInfo.value.accountingFramework === "IFRS") {
      baseSections.push(keyAuditMattersSection.value);
    }

    // Add Emphasis of Matter section if enabled
    if (
      basicInfo.value.accountingFramework === "IFRS" &&
      opinionInfo.value.emphasisOfMatterOption
    ) {
      baseSections.push(emphasisOfMatterSection.value);
    }

    // Add footer section
    baseSections.push(footerSection.value);

    return baseSections;
  });

  return {
    sections,
  };
};
