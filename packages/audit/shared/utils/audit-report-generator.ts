import type { AuditReportData, AuditReportTemplate, AuditReportSection } from '../types/audit-report';

function formatDate(date: Date): string {
  const year = date.getFullYear() - 1911; // ROC year
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

function formatPeriod(data: AuditReportData): string {
  return `民國${formatDate(data.periodStart)}至${formatDate(data.periodEnd)}`;
}

function getModificationParagraph(data: AuditReportData): string {
  switch (data.opinionType) {
    case 'qualified':
      let qualifiedText = `惟除下述事項之影響外，${data.qualificationReason || '[保留意見原因]'}。`;
      if (data.materialAmount) {
        qualifiedText += `該事項涉及金額為新台幣${data.materialAmount.toLocaleString()}元。`;
      }
      return qualifiedText;
      
    case 'adverse':
      return `如「查核意見之基礎」段所述，${data.adverseReason || '[否定意見原因]'}，該等違反情事之影響重大且廣泛。`;
      
    case 'disclaimer':
      return `如「查核意見之基礎」段所述，${data.disclaimerReason || '[查核範圍限制原因]'}，本會計師無法取得充分適切之查核證據作為查核意見之基礎。`;
      
    default:
      return '';
  }
}

function getConcludingParagraph(data: AuditReportData): string {
  const framework = data.accountingFramework;
  
  switch (data.opinionType) {
    case 'unqualified':
      return `依本會計師之意見，上開財務報表在所有重大方面係依照${framework}編製，足以允當表達${data.entityName}之財務狀況、經營結果及現金流量。`;
      
    case 'qualified':
      return `依本會計師之意見，除前段所述事項之影響外，上開財務報表在所有重大方面係依照${framework}編製，足以允當表達${data.entityName}之財務狀況、經營結果及現金流量。`;
      
    case 'adverse':
      return `依本會計師之意見，由於前段所述事項之重大性及其廣泛性之影響，上開財務報表未依照${framework}編製，未能允當表達${data.entityName}之財務狀況、經營結果及現金流量。`;
      
    case 'disclaimer':
      return `由於前段所述事項之重大性及其廣泛性之可能影響，本會計師無法對上開財務報表表示意見。`;
      
    default:
      return '';
  }
}

function generateOpinionSection(data: AuditReportData): AuditReportSection {
  const paragraphs: string[] = [];
  
  // Base opinion paragraph
  const baseParagraph = `本會計師已查核${data.entityName}之${formatPeriod(data)}財務報表，包括資產負債表、損益表、權益變動表、現金流量表及財務報表附註。`;
  paragraphs.push(baseParagraph);
  
  // Modified opinion paragraph
  if (data.opinionType !== 'unqualified') {
    paragraphs.push(getModificationParagraph(data));
  }
  
  // Concluding paragraph
  paragraphs.push(getConcludingParagraph(data));
  
  return {
    title: '查核意見',
    paragraphs
  };
}

function generateBasisSection(): AuditReportSection {
  return {
    title: '查核意見之基礎',
    paragraphs: [
      '本會計師係依照會計師查核簽證財務報表規則及一般公認審計準則執行查核工作。本會計師於該等準則下之責任將於會計師查核財務報表之責任段進一步說明。'
    ]
  };
}

function generateManagementSection(data: AuditReportData): AuditReportSection {
  return {
    title: '管理階層對財務報表之責任',
    paragraphs: [
      `管理階層之責任係依照${data.accountingFramework}編製允當表達之財務報表，及維持與財務報表編製有關之必要內部控制。`
    ]
  };
}

function generateAuditorSection(): AuditReportSection {
  return {
    title: '會計師查核財務報表之責任',
    paragraphs: [
      '本會計師之責任係依據查核結果對財務報表表示意見。本會計師係依照會計師查核簽證財務報表規則及一般公認審計準則執行查核工作。'
    ]
  };
}

export function generateAuditReportTemplate(data: AuditReportData): AuditReportTemplate {
  return {
    header: {
      title: '會計師查核報告',
      entity: data.entityName,
      period: formatPeriod(data)
    },
    sections: [
      generateOpinionSection(data),
      generateBasisSection(),
      generateManagementSection(data),
      generateAuditorSection()
    ],
    footer: {
      firmName: data.firmName,
      auditorName: data.auditorName,
      date: `中華民國${formatDate(data.reportDate)}`
    }
  };
}