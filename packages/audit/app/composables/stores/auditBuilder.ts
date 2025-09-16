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

  const entityLabel = computed(
    () => basicInfo.value.entityName || "[空白的受查者名稱]"
  );

  const opinionSectionTemplate = computed((): AuditReportSection => {
    const paragraphs: string[] = [];

    const yearStr = getYearStr(
      basicInfo.value.currentYear,
      basicInfo.value.comparativeYear
    );

    const frameworkText = getAccountingFrameworkText(
      basicInfo.value.accountingFramework
    );

    paragraphs.push(
      `${entityLabel.value}${yearStr}十二月三十一日之資產負債表，暨${yearStr}一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表，以及財務報表附註(包括重大會計政策彙總)，業經本會計師查核竣事。`
    );

    switch (opinionInfo.value.opinionType) {
      case "unqualified":
        paragraphs.push(
          `依本會計師之意見，上開財務報表在所有重大方面係依照${frameworkText}編製，足以允當表達${entityLabel.value}${yearStr}之財務狀況，暨${yearStr}一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表之財務績效及現金流量。`
        );
        break;

      case "qualified":
        paragraphs.push(
          `依本會計師之意見，除前段所述事項之影響外，上開財務報表在所有重大方面係依照${frameworkText}編製，足以允當表達${entityLabel.value}${yearStr}之財務狀況，暨${yearStr}一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表之財務績效及現金流量。`
        );
        break;

      case "adverse":
        paragraphs.push(
          `依本會計師之意見，由於前段所述事項之重大性及其廣泛性之影響，上開財務報表未依照${frameworkText}編製，未能允當表達${entityLabel.value}${yearStr}之財務狀況，暨${yearStr}一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表之財務績效及現金流量。`
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

    const auditingStandardText = getAccountingStandardText(
      basicInfo.value.accountingFramework
    );

    paragraphs.push(
      `本會計師係依照${auditingStandardText}執行查核工作。本會計師於該等準則下之責任將於會計師查核財務報表之責任段進一步說明。本會計師所隸屬事務所受獨立性規範之人員已依會計師職業道德規範，與${entityLabel.value}保持超然獨立，並履行該規範之其他責任。本會計師相信已取得足夠及適切之查核證據，以作為表示查核意見之基礎。`
    );

    return {
      title: "查核意見之基礎",
      paragraphs,
    };
  });

  const managementResponsibilitySectionTemplate = computed(
    (): AuditReportSection => {
      const paragraphs: string[] = [];

      paragraphs.push(
        `本會計師所隸屬事務所受獨立性規範之人員已依會計師職業道德規範，與${entityLabel.value}保持超然獨立，並履行該規範之其他責任。`
      );

      return {
        title: "管理階層對財務報表之責任",
        paragraphs,
      };
    }
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

  return {
    // State
    basicInfo,
    opinionInfo,
    hasComparativePeriod,
    reportTemplate,

    // Actions
    generateMockData,
    reset,
  };
});
