export interface ParagraphText {
  text: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  // TODO: implement the detailed version of underline according to the docx library
  underline?: boolean;
  // TODO: emphasis mark
  // TODO: shading
  highlight?: string;
  strike?: boolean;
  doubleStrike?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  allCaps?: boolean;
  smallCaps?: boolean;
  break?: number;
}

export type HeadingLevel =
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "heading_4"
  | "heading_5"
  | "heading_6"
  | "title";

export type AlignmentType =
  | "start"
  | "center"
  | "end"
  | "both"
  | "left"
  | "right";

export interface BaseDocumentParagraph {
  heading?: HeadingLevel;
  alignment?: AlignmentType;
  numbering?: {
    reference: string;
    level: number;
  };
}

export type DocumentParagraph = BaseDocumentParagraph &
  (
    | {
        type: "text";
        text: string;
      }
    | {
        type: "children";
        children: ParagraphText[];
      }
  );

export interface DocumentSection {
  id: string;
  properties?: {
    type?: "nextPage" | "nextColumn" | "continuous" | "oddPage" | "evenPage";
  };
  children: DocumentParagraph[];
}
