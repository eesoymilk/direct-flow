import { faker } from "@faker-js/faker";
import type { SelectItem } from "@nuxt/ui";
import * as z from "zod";

// Define the schema for global info validation
export const globalInfoSchema = z.object({
  entityName: z.string().min(1, "受查者名稱為必填"),
  periodStart: z.date({ required_error: "期初日期為必填" }),
  periodEnd: z.date({ required_error: "期末日期為必填" }),
  firmName: z.string().min(1, "會計師事務所為必填"),
  auditorName: z.string().min(1, "會計師姓名為必填"),
  accountingFramework: z.enum(["businessAccountingGuidelines", "IFRS"], {
    required_error: "請選擇會計架構",
  }),
  comparativePeriodStart: z.date().optional(),
  comparativePeriodEnd: z.date().optional(),
});

export const useAuditBuilderStore = defineStore("auditBuilder", () => {
  // State
  const globalInfo = ref<Partial<GlobalAuditInfo>>({
    entityName: "",
    firmName: "",
    auditorName: "",
    reportDate: new Date(),
    accountingFramework: "businessAccountingGuidelines",
  });

  const opinionSpecificData = ref<Partial<OpinionSpecificData>>({});

  const selectedOpinion = ref<OpinionType | null>(null);
  const hasComparativePeriod = ref(false);

  // Options
  const frameworkItems = ref<SelectItem[]>([
    {
      label: "商業會計處理準則",
      value: "businessAccountingGuidelines",
    },
    { label: "國際財務報導準則 (IFRS)", value: "IFRS" },
  ]);

  const opinionTypes = ref<
    Array<{
      type: OpinionType;
      title: string;
      description: string;
      tags: string[];
    }>
  >([
    {
      type: "unqualified" as OpinionType,
      title: "無保留意見",
      description: "財務報表在所有重大方面均依照適用之財務報導架構編製",
      tags: ["標準意見", "無修正"],
    },
    {
      type: "qualified" as OpinionType,
      title: "保留意見",
      description: "除特定事項外，財務報表在所有重大方面均適當表達",
      tags: ["修正意見", "部分限制"],
    },
    {
      type: "adverse" as OpinionType,
      title: "否定意見",
      description: "財務報表整體而言並未適當表達",
      tags: ["修正意見", "重大違反"],
    },
    {
      type: "disclaimer" as OpinionType,
      title: "無法表示意見",
      description: "無法取得充分適切之查核證據作為查核意見之基礎",
      tags: ["修正意見", "查核範圍限制"],
    },
  ]);

  // Computed getters
  const isGlobalInfoComplete = computed(
    () =>
      !!(
        globalInfo.value.entityName &&
        globalInfo.value.periodStart &&
        globalInfo.value.periodEnd &&
        globalInfo.value.firmName &&
        globalInfo.value.auditorName &&
        globalInfo.value.accountingFramework
      )
  );

  const selectedOpinionData = computed(() => {
    return opinionTypes.value.find((op) => op.type === selectedOpinion.value);
  });

  const combinedOpinionData = computed((): AuditOpinionFormData => {
    return {
      ...globalInfo.value,
      ...opinionSpecificData.value,
      comparativePeriodStart: hasComparativePeriod.value
        ? globalInfo.value.comparativePeriodStart
        : undefined,
      comparativePeriodEnd: hasComparativePeriod.value
        ? globalInfo.value.comparativePeriodEnd
        : undefined,
      independenceCompliance: true,
      ethicalRequirementsCompliance: true,
    } as AuditOpinionFormData;
  });

  // Actions
  const selectOpinion = (opinionType: OpinionType) => {
    if (!isGlobalInfoComplete.value) return;

    selectedOpinion.value = opinionType;
    // Reset opinion-specific data when switching opinion types
    opinionSpecificData.value = { opinionType };
  };

  const updateGlobalInfo = (updates: Partial<typeof globalInfo.value>) => {
    globalInfo.value = { ...globalInfo.value, ...updates };
  };

  const updateOpinionSpecificData = (updates: Partial<OpinionSpecificData>) => {
    opinionSpecificData.value = { ...opinionSpecificData.value, ...updates };
  };

  const setComparativePeriod = (hasComparative: boolean) => {
    hasComparativePeriod.value = hasComparative;
    if (!hasComparative) {
      globalInfo.value.comparativePeriodStart = undefined;
      globalInfo.value.comparativePeriodEnd = undefined;
    }
  };

  const generateMockData = () => {
    const currentYear = new Date().getFullYear();

    const periodEnd = faker.date.between({
      from: new Date(currentYear - 1, 0, 1),
      to: new Date(currentYear, 11, 31),
    });

    const periodStart = new Date(periodEnd);
    periodStart.setFullYear(periodEnd.getFullYear() - 1);
    periodStart.setDate(periodStart.getDate() + 1);

    globalInfo.value = {
      entityName: faker.company.name() + "股份有限公司",
      periodStart: periodStart,
      periodEnd: periodEnd,
      firmName: faker.helpers.arrayElement([
        "勤業眾信聯合會計師事務所",
        "安侯建業聯合會計師事務所",
        "資誠聯合會計師事務所",
        "安永聯合會計師事務所",
      ]),
      auditorName: faker.person.lastName() + faker.person.firstName(),
      reportDate: faker.date.between({
        from: periodEnd,
        to: new Date(periodEnd.getFullYear(), periodEnd.getMonth() + 6),
      }),
      accountingFramework: faker.helpers.arrayElement([
        "businessAccountingGuidelines",
        "IFRS",
      ]),
    };

    // Optionally set comparative period
    if (faker.datatype.boolean()) {
      hasComparativePeriod.value = true;
      const comparativePeriodEnd = new Date(periodStart);
      comparativePeriodEnd.setDate(comparativePeriodEnd.getDate() - 1);
      const comparativePeriodStart = new Date(comparativePeriodEnd);
      comparativePeriodStart.setFullYear(
        comparativePeriodEnd.getFullYear() - 1
      );
      comparativePeriodStart.setDate(comparativePeriodStart.getDate() + 1);

      globalInfo.value.comparativePeriodStart = comparativePeriodStart;
      globalInfo.value.comparativePeriodEnd = comparativePeriodEnd;
    }
  };

  const reset = () => {
    globalInfo.value = {
      entityName: "",
      periodStart: undefined,
      periodEnd: undefined,
      firmName: "",
      auditorName: "",
      reportDate: new Date(),
      accountingFramework: "businessAccountingGuidelines",
    };
    opinionSpecificData.value = {};
    selectedOpinion.value = null;
    hasComparativePeriod.value = false;
  };

  return {
    // State
    globalInfo,
    opinionSpecificData,
    selectedOpinion,
    hasComparativePeriod,
    frameworkItems,
    opinionTypes,

    // Computed
    isGlobalInfoComplete,
    selectedOpinionData,
    combinedOpinionData,

    // Actions
    selectOpinion,
    updateGlobalInfo,
    updateOpinionSpecificData,
    setComparativePeriod,
    generateMockData,
    reset,
  };
});
