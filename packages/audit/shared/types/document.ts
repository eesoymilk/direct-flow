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

export interface BaseDocumentParagraph {
  heading?:
    | "heading_1"
    | "heading_2"
    | "heading_3"
    | "heading_4"
    | "heading_5"
    | "heading_6"
    | "title";
  numbering?: {
    reference: string;
    level: number;
  };
}

export type DocumentParagraph = {
  heading?:
    | "heading_1"
    | "heading_2"
    | "heading_3"
    | "heading_4"
    | "heading_5"
    | "heading_6"
    | "title";
  numbering?: {
    reference: string;
    level: number;
  };
} & (
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
