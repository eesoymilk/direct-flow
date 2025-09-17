import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
} from "docx";
import type { AuditReportTemplate } from "../types/audit-report";

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

function generateDocxDocument(template: AuditReportTemplate): Document {
  const children: Paragraph[] = [];

  // Add title
  children.push(createTitle(template));

  // Add entity info
  children.push(...createEntityInfo(template));

  // Add all sections
  template.sections.forEach((section) => {
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

function createSection(section: any): Paragraph[] {
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
  return [
    // Spacing before footer
    new Paragraph({
      children: [new TextRun("")],
      spacing: { before: 800 },
    }),

    // Firm name
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
    }),

    // Auditor signature line
    new Paragraph({
      children: [
        new TextRun({
          text: `會計師：${template.footer.auditorName}`,
          size: 22,
          font: "Times New Roman",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 300 },
    }),

    // Date
    new Paragraph({
      children: [
        new TextRun({
          text: template.footer.date,
          size: 22,
          font: "Times New Roman",
        }),
      ],
      alignment: AlignmentType.RIGHT,
    }),
  ];
}
