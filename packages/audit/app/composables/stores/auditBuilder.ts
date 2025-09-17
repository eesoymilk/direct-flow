import { faker } from "@faker-js/faker";
import * as z from "zod";

// Define the schema for global info validation
export const basicInfoSchema = z.object({
  entityName: z.string().min(1, "受查者名稱為必填"),
  startYear: z.number({ required_error: "開始年份為必填" }),
  endYear: z.number({ required_error: "結束年份為必填" }),
  comparativeStartYear: z.number().optional(),
  comparativeEndYear: z.number().optional(),
  firmName: z.string().min(1, "會計師事務所為必填"),
  auditorName: z.string().min(1, "會計師姓名為必填"),
  accountingFramework: z.enum(["businessAccountingGuidelines", "IFRS"], {
    required_error: "請選擇會計架構",
  }),
});

export const useAuditBuilderStore = defineStore("auditBuilder", () => {
  // State
  const basicInfo = ref<Partial<AuditBasicInfo>>({});

  const hasComparativePeriod = ref(false);

  const opinionInfo = ref<Partial<AuditOpinionInfo>>({});

  const includeOtherMatterSection = ref(false);

  const entityLabel = computed(
    () => basicInfo.value.entityName || "[空白的受查者名稱]"
  );

  const yearStr = computed(() =>
    getYearStr(basicInfo.value.currentYear, basicInfo.value.comparativeYear)
  );

  const frameworkText = computed(() =>
    getAccountingFrameworkText(basicInfo.value.accountingFramework)
  );

  const standardText = computed(() =>
    getAccountingStandardText(basicInfo.value.accountingFramework)
  );

  const opinionSectionTemplate = computed((): AuditReportSection => {
    const paragraphs: string[] = [];

    paragraphs.push(
      `${entityLabel.value}${yearStr.value}十二月三十一日之資產負債表，暨${yearStr.value}一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表，以及財務報表附註(包括重大會計政策彙總)，業經本會計師查核竣事。`
    );

    switch (opinionInfo.value.opinionType) {
      case "unqualified":
        paragraphs.push(
          `依本會計師之意見，上開財務報表在所有重大方面係依照${frameworkText.value}編製，足以允當表達${entityLabel.value}${yearStr.value}之財務狀況，暨${yearStr.value}一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表之財務績效及現金流量。`
        );
        break;

      case "qualified":
        paragraphs.push(
          `依本會計師之意見，除前段所述事項之影響外，上開財務報表在所有重大方面係依照${frameworkText.value}編製，足以允當表達${entityLabel.value}${yearStr.value}之財務狀況，暨${yearStr.value}一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表之財務績效及現金流量。`
        );
        break;

      case "adverse":
        paragraphs.push(
          `依本會計師之意見，由於前段所述事項之重大性及其廣泛性之影響，上開財務報表未依照${frameworkText.value}編製，未能允當表達${entityLabel.value}${yearStr.value}之財務狀況，暨${yearStr.value}一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表之財務績效及現金流量。`
        );
        break;

      case "disclaimer":
        paragraphs.push(
          `由於前段所述事項之重大性及其廣泛性之可能影響，本會計師無法對上開財務報表表示意見。`
        );
        break;

      default:
        break;
    }

    return {
      title: "查核意見",
      paragraphs,
    };
  });

  const opinionBasisSectionTemplate = computed((): AuditReportSection => {
    const paragraphs: string[] = [];

    paragraphs.push(
      `本會計師係依照${frameworkText.value}執行查核工作。本會計師於該等準則下之責任將於會計師查核財務報表之責任段進一步說明。本會計師所隸屬事務所受獨立性規範之人員已依會計師職業道德規範，與${entityLabel.value}保持超然獨立，並履行該規範之其他責任。本會計師相信已取得足夠及適切之查核證據，以作為表示查核意見之基礎。`
    );

    return {
      title: "查核意見之基礎",
      paragraphs,
    };
  });

  const otherMatterSectionTemplate = computed((): AuditReportSection => {
    let otherMatterText = "[空白的其他事項段]";

    if (
      opinionInfo.value.otherMatterOption?.type ===
      "previousReportHandledByOtherAuditor"
    ) {
      otherMatterText = `${entityLabel.value}公司民國${new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec").format(AcToRocYear(basicInfo.value.currentYear || 0))}年度之財務報表係由其他會計師查核，並於${formatRocDate(opinionInfo.value.otherMatterOption.previousAuditReportDate)}出具查核意見。`;
    } else if (
      opinionInfo.value.otherMatterOption?.type === "missingPreviousAuditReport"
    ) {
      otherMatterText = `${entityLabel.value}公司民國${new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec").format(AcToRocYear(basicInfo.value.currentYear || 0))}年度之財務報表，並未經會計師查核，其附列之目的僅供參考。`;
    }

    return {
      title: "其他事項段",
      paragraphs: [otherMatterText],
      isConditional: true,
      condition: (data: AuditReportData) =>
        !!data.opinionInfo.otherMatterOption,
    };
  });

  const managementResponsibilitySectionTemplate = computed(
    (): AuditReportSection => ({
      title: "管理階層對財務報表之責任",
      paragraphs: [
        `管理階層之責任係依照${frameworkText.value}製允當表達之財務報表，且維持與財務報表編製有關之必要內部控制，以確保財務報表未存有導因於舞弊或錯誤之重大不實表達。`,
        "於編製財務報表時，管理階層之責任亦包括評估甲股份有限公司繼續經營之能力、相關事項之揭露，以及繼續經營會計基礎之採用，除非管理階層意圖清算甲股份有限公司或停止營業，或除清算或停業外別無實際可行之其他方案。",
      ],
    })
  );

  const auditResponsibilitySectionTemplate = computed(
    (): AuditReportSection => ({
      title: "會計師查核財務報表之責任",
      paragraphs: [
        "本會計師查核財務報表之目的，係對財務報表整體是否存有導因於舞弊或錯誤之重大不實表達取得合理確信，並出具查核報告。合理確信係高度確信，惟依照一般公認審計準則執行之查核工作無法保證必能偵出財務報表存有之重大不實表達。不實表達可能導因於舞弊或錯誤。如不實表達之個別金額或彙總數可合理預期將影響財務報表使用者所作之經濟決策，則被認為具有重大性。",
      ],
    })
  );

  const reportTemplate = computed((): AuditReportTemplate => {
    const firmName = basicInfo.value.firmName || "[空白的會計師事務所]";
    const auditorName = basicInfo.value.auditorName || "[空白的會計師姓名]";
    const reportDate = formatRocDate(basicInfo.value.reportDate);

    return {
      header: {
        title: "會計師查核報告",
        recipient: `${entityLabel.value}董事會 公鑒：`,
        entity: entityLabel.value,
      },
      sections: [
        opinionSectionTemplate.value,
        opinionBasisSectionTemplate.value,
        otherMatterSectionTemplate.value,
        managementResponsibilitySectionTemplate.value,
        auditResponsibilitySectionTemplate.value,
      ],
      footer: {
        firmName,
        auditorName,
        date: reportDate,
      },
    };
  });

  const generateMockData = () => {
    const currentYear = faker.number.int({ min: 1911, max: 2025 });

    const reportDate = faker.date.between({
      from: new Date(currentYear - 1, 0, 1),
      to: new Date(currentYear, 11, 31),
    });

    basicInfo.value = {
      entityName: faker.company.name() + "股份有限公司",
      currentYear,
      firmName: faker.helpers.arrayElement([
        "勤業眾信聯合會計師事務所",
        "安侯建業聯合會計師事務所",
        "資誠聯合會計師事務所",
        "安永聯合會計師事務所",
      ]),
      auditorName: faker.person.lastName() + faker.person.firstName(),
      reportDate,
      accountingFramework: faker.helpers.arrayElement([
        "businessAccountingGuidelines",
        "IFRS",
      ]),
    };

    // Optionally set comparative period
    if (faker.datatype.boolean()) {
      hasComparativePeriod.value = true;
      basicInfo.value.comparativeYear = faker.number.int({
        min: 1911,
        max: 2025,
      });
    }
  };

  const reset = () => {
    basicInfo.value = {};
    opinionInfo.value = {};
    hasComparativePeriod.value = false;
  };

  watch(includeOtherMatterSection, (newVal) => {
    if (newVal) {
      opinionInfo.value.otherMatterOption = {
        type: "previousReportHandledByOtherAuditor",
      };
    }
  });

  return {
    // State
    basicInfo,
    opinionInfo,
    hasComparativePeriod,
    includeOtherMatterSection,
    reportTemplate,

    entityLabel,

    // Actions
    generateMockData,
    reset,
  };
});
