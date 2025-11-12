import type { DocumentSection, DocumentParagraph } from '#shared/types/document';
import type { FinancialTable } from '../../../composables/stores/opinionBuilder';

export interface GenerateFinancialTablesSectionOptions {
  highlightVariable?: boolean;
}

/**
 * Generate financial tables section for the audit report
 */
export function generateFinancialTablesSection(
  tables: FinancialTable[],
  options: GenerateFinancialTablesSectionOptions = {}
): DocumentSection | null {
  if (tables.length === 0) {
    return null;
  }

  const children: DocumentParagraph[] = [];

  // Add intro paragraph
  children.push({
    type: 'children',
    children: [
      {
        text: `以下包含 ${tables.length} 個財務報表`,
        bold: true,
      },
    ],
  });

  // Add each table as paragraphs
  // For now, we'll represent tables as formatted text until we implement proper table rendering
  tables.forEach((table, index) => {
    // Table title
    children.push({
      type: 'children',
      alignment: 'center',
      children: [
        {
          text: table.title,
          bold: true,
        },
      ],
    });

    // Table metadata (for reference in actual document generation)
    children.push({
      type: 'children',
      children: [
        {
          text: `[表格 ${index + 1}: ${table.data.length} 列 × ${table.headers.length} 欄]`,
          italic: true,
        },
      ],
    });

    // Add spacing
    children.push({
      type: 'children',
      children: [{ text: '' }],
    });
  });

  return {
    id: 'financial-tables',
    children,
  };
}
