import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  PageNumber,
  Header,
  Footer,
} from "docx";

// Temporary types until server implementation is complete
interface AuditReportTemplate {
  header: {
    title: string;
    entity: string;
  };
  sections: AuditReportSection[];
  footer: {
    firmName: string;
    auditorNames: string[];
    date: string;
  };
}

interface AuditReportSection {
  title: string;
  paragraphs: string[];
}

export function createAuditDocument(
  auditReportTemplate: AuditReportTemplate
): Document {
  return generateDocxDocument(auditReportTemplate);
}

export async function generateAuditDocxBuffer(
  auditReportTemplate: AuditReportTemplate
): Promise<Buffer> {
  const doc = createAuditDocument(auditReportTemplate);
  return await Packer.toBuffer(doc);
}

export async function generateAuditDocxBlob(
  auditReportTemplate: AuditReportTemplate
): Promise<Blob> {
  const doc = createAuditDocument(auditReportTemplate);
  return await Packer.toBlob(doc);
}

/**
 * Estimates the number of pages in the audit report based on content analysis
 * This is an approximation since actual page count requires document rendering
 */
export function estimatePageCount(template: AuditReportTemplate): number {
  let totalWords = 0;

  // Count words in title and entity info
  totalWords += countWords(template.header.title);
  totalWords += countWords(template.header.entity);

  // Count words in all sections
  template.sections.forEach((section: AuditReportSection) => {
    totalWords += countWords(section.title);
    section.paragraphs.forEach((paragraph: string) => {
      totalWords += countWords(paragraph);
    });
  });

  // Count words in footer
  totalWords += countWords(template.footer.firmName);
  template.footer.auditorNames.forEach((name: string) => {
    totalWords += countWords(name);
  });
  totalWords += countWords(template.footer.date);

  // Estimate pages (assuming ~300 words per page for Chinese text with spacing)
  const wordsPerPage = 300;
  const estimatedPages = Math.max(1, Math.ceil(totalWords / wordsPerPage));

  return estimatedPages;
}

/**
 * Helper function to count words in a string
 */
function countWords(text: string): number {
  if (!text || typeof text !== "string") return 0;

  // For Chinese text, count characters instead of words
  // For mixed text, use a hybrid approach
  const chineseChars = text.match(/[\u4e00-\u9fff]/g)?.length || 0;
  const englishWords = text.match(/[a-zA-Z]+/g)?.length || 0;

  // Approximate: 1 Chinese character ≈ 0.5 English words
  return Math.ceil(chineseChars * 0.5 + englishWords);
}

function generateDocxDocument(template: AuditReportTemplate): Document {
  const children: Paragraph[] = [];

  // Add title
  children.push(createTitle(template));

  // Add entity info
  children.push(...createEntityInfo(template));

  // Add all sections
  template.sections.forEach((section: AuditReportSection) => {
    children.push(...createSection(section));
  });

  // Add footer
  children.push(...createFooter(template));

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: template.header.entity,
                    size: 20,
                    font: "Times New Roman",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "第 ",
                    size: 20,
                    font: "Times New Roman",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                  }),
                  new TextRun({
                    text: " 頁，共 ",
                    size: 20,
                    font: "Times New Roman",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                  }),
                  new TextRun({
                    text: " 頁",
                    size: 20,
                    font: "Times New Roman",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
}

function createTitle(template: AuditReportTemplate): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: template.header.title,
        bold: true,
        size: 32, // 16pt
        font: "Times New Roman",
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
  });
}

function createEntityInfo(template: AuditReportTemplate): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: template.header.entity,
          size: 24, // 12pt
          font: "Times New Roman",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
  ];
}

function createSection(section: AuditReportSection): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Section title
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: section.title,
          bold: true,
          size: 24, // 12pt
          font: "Times New Roman",
        }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: {
          color: "000000",
          space: 1,
          style: "single",
          size: 6,
        },
      },
    })
  );

  // Section paragraphs
  section.paragraphs.forEach((text: string) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            size: 22, // 11pt
            font: "Times New Roman",
          }),
        ],
        spacing: { after: 200 },
        indent: { firstLine: 480 }, // 0.5 inch indent for first line
        alignment: AlignmentType.JUSTIFIED,
      })
    );
  });

  return paragraphs;
}

function createFooter(template: AuditReportTemplate): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Spacing before footer
  paragraphs.push(
    new Paragraph({
      children: [new TextRun("")],
      spacing: { before: 800 },
    })
  );

  // Firm name
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: template.footer.firmName,
          size: 22,
          font: "Times New Roman",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 300 },
    })
  );

  // Auditor signature lines (iterate over all auditors)
  template.footer.auditorNames.forEach((auditorName: string, index: number) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `會計師：${auditorName}`,
            size: 22,
            font: "Times New Roman",
          }),
        ],
        alignment: AlignmentType.RIGHT,
        spacing: {
          after: index === template.footer.auditorNames.length - 1 ? 300 : 100,
        },
      })
    );
  });

  // Date
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: template.footer.date,
          size: 22,
          font: "Times New Roman",
        }),
      ],
      alignment: AlignmentType.RIGHT,
    })
  );

  return paragraphs;
}
