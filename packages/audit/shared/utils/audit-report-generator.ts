import type {
  AuditReportData,
  AuditReportTemplate,
  AuditReportSection,
} from "../types/audit-report";
import {
  formatROCDate,
  formatBalanceSheetDate,
  formatIncomeStatementPeriod,
  formatFinancialStatementPeriod,
  formatChineseNumber,
  getAuditingStandardsText,
} from "./date-formatting";

function generateOpinionSection(data: AuditReportData): AuditReportSection {
  const paragraphs: string[] = [];

  // Base opinion paragraph - describes what was audited
  const financialStatements = formatFinancialStatementPeriod(
    data.periodEnd,
    data.comparativePeriodEnd
  );
  const baseParagraph = `${data.entityName}${financialStatements}，以及財務報表附註(包括重大會計政策彙總)，業經本會計師查核竣事。`;
  paragraphs.push(baseParagraph);

  // Concluding paragraph based on opinion type
  paragraphs.push(getConcludingParagraph(data));

  return {
    title: "查核意見",
    paragraphs,
  };
}

function getConcludingParagraph(data: AuditReportData): string {
  const framework = getAccountingFrameworkText(data.accountingFramework);
  const periodInfo = formatBalanceSheetDate(data.periodEnd);
  const performancePeriod = formatIncomeStatementPeriod(data.periodEnd);

  // Handle comparative periods
  if (data.comparativePeriodEnd) {
    const compPeriodInfo = formatBalanceSheetDate(data.comparativePeriodEnd);
    const compPerformancePeriod = formatIncomeStatementPeriod(
      data.comparativePeriodEnd
    );

    switch (data.opinionType) {
      case "unqualified":
        return `依本會計師之意見，上開財務報表在所有重大方面係依照${framework}編製，足以允當表達${data.entityName}${periodInfo}及${compPeriodInfo}之財務狀況，暨${performancePeriod}及${compPerformancePeriod}之財務績效及現金流量。`;

      case "qualified":
        return `依本會計師之意見，除前段所述事項之影響外，上開財務報表在所有重大方面係依照${framework}編製，足以允當表達${data.entityName}${periodInfo}及${compPeriodInfo}之財務狀況，暨${performancePeriod}及${compPerformancePeriod}之財務績效及現金流量。`;

      case "adverse":
        return `依本會計師之意見，由於前段所述事項之重大性及其廣泛性之影響，上開財務報表未依照${framework}編製，未能允當表達${data.entityName}${periodInfo}及${compPeriodInfo}之財務狀況，暨${performancePeriod}及${compPerformancePeriod}之財務績效及現金流量。`;

      case "disclaimer":
        return `由於前段所述事項之重大性及其廣泛性之可能影響，本會計師無法對上開財務報表表示意見。`;

      default:
        return "";
    }
  }

  // Single period
  switch (data.opinionType) {
    case "unqualified":
      return `依本會計師之意見，上開財務報表在所有重大方面係依照${framework}編製，足以允當表達${data.entityName}${periodInfo}之財務狀況，暨${performancePeriod}之財務績效及現金流量。`;

    case "qualified":
      return `依本會計師之意見，除前段所述事項之影響外，上開財務報表在所有重大方面係依照${framework}編製，足以允當表達${data.entityName}${periodInfo}之財務狀況，暨${performancePeriod}之財務績效及現金流量。`;

    case "adverse":
      return `依本會計師之意見，由於前段所述事項之重大性及其廣泛性之影響，上開財務報表未依照${framework}編製，未能允當表達${data.entityName}${periodInfo}之財務狀況，暨${performancePeriod}之財務績效及現金流量。`;

    case "disclaimer":
      return `由於前段所述事項之重大性及其廣泛性之可能影響，本會計師無法對上開財務報表表示意見。`;

    default:
      return "";
  }
}

function generateBasisSection(data: AuditReportData): AuditReportSection {
  const paragraphs: string[] = [];

  // Standard basis paragraph
  const auditingStandards = getAuditingStandardsText(data.accountingFramework);

  paragraphs.push(
    `本會計師係依照${auditingStandards}執行查核工作。本會計師於該等準則下之責任將於會計師查核財務報表之責任段進一步說明。本會計師所隸屬事務所受獨立性規範之人員已依會計師職業道德規範，與${data.entityName}保持超然獨立，並履行該規範之其他責任。本會計師相信已取得足夠及適切之查核證據，以作為表示查核意見之基礎。`
  );

  // Add modification reason if not unqualified
  if (data.opinionType !== "unqualified") {
    paragraphs.push(getModificationBasisParagraph(data));
  }

  return {
    title: "查核意見之基礎",
    paragraphs,
  };
}

function getModificationBasisParagraph(data: AuditReportData): string {
  switch (data.opinionType) {
    case "qualified": {
      let qualifiedText = `${data.qualificationReason || "[保留意見原因的詳細說明]"}`;
      if (data.materialAmount) {
        qualifiedText += `該事項涉及金額為新台幣${formatChineseNumber(data.materialAmount)}元。`;
      }
      return qualifiedText;
    }

    case "adverse":
      return `${data.adverseReason || "[否定意見原因的詳細說明，包括違反會計準則的具體情況]"}`;

    case "disclaimer":
      return `${data.disclaimerReason || "[查核範圍限制的詳細說明，包括無法執行的查核程序]"}`;

    default:
      return "";
  }
}

export function generateAuditReportTemplate(
  data: AuditReportData
): AuditReportTemplate {
  const sections: AuditReportSection[] = [];

  // Core sections - focusing on just the opinion and basis sections
  sections.push(generateOpinionSection(data));
  sections.push(generateBasisSection(data));

  return {
    header: {
      title: "會計師查核報告",
      recipient: `${data.entityName}董事會 公鑒：`,
      entity: data.entityName,
      period: formatFinancialStatementPeriod(
        data.periodEnd,
        data.comparativePeriodEnd
      ),
      comparativePeriod:
        data.comparativePeriodStart && data.comparativePeriodEnd
          ? formatBalanceSheetDate(data.comparativePeriodEnd)
          : undefined,
    },
    sections,
    footer: {
      firmName: data.firmName,
      auditorName: data.auditorName,
      date: formatROCDate(data.reportDate),
    },
  };
}
