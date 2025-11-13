import type { RadioGroupItem, SelectItem } from "@nuxt/ui";

/**
 * Composable for form configuration options
 * Provides static configuration for select and radio group items
 */
export const useFormConfiguration = () => {
  /**
   * Accounting framework options for select dropdown
   */
  const frameworkItems: SelectItem[] = [
    {
      label: "商業會計處理準則",
      value: "businessAccountingGuidelines",
    },
    {
      label: "國際財務報導準則 (IFRS)",
      value: "IFRS",
    },
  ];

  /**
   * Other matter section options for radio group
   */
  const otherMatterOptions: RadioGroupItem[] = [
    {
      label: "前年度未經查核",
      value: "missingPreviousAuditReport",
    },
    {
      label: "前次查核報告由其他會計師出具",
      value: "previousReportHandledByOtherAuditor",
    },
    {
      label: "自定義其他事項",
      value: "custom",
    },
  ]

  /**
   * Previous opinion type options for select dropdown
   * Used when other matter type is "previousReportHandledByOtherAuditor"
   */
  const previousOpinionTypeItems: SelectItem[] = [
    {
      label: "無保留意見",
      value: "unqualified",
    },
    {
      label: "保留意見",
      value: "qualified",
    },
    {
      label: "否定意見",
      value: "adverse",
    },
    {
      label: "無法表示意見",
      value: "disclaimer",
    },
  ];

  return {
    frameworkItems,
    otherMatterOptions,
    previousOpinionTypeItems,
  };
};
