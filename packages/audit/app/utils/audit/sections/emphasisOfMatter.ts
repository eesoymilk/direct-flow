export const generateEmphasisOfMatterSection = (
  opinionInfo: Partial<OpinionInfoForm>,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const description =
    opinionInfo.emphasisOfMatterOption?.description || "[[空白的強調事項段]]";
  return {
    id: "EmphasisOfMatter",
    children: [
      {
        type: "children",
        children: [
          {
            text: "強調事項段",
            bold: true,
            underline: true,
          },
        ],
      },
      highlightVariable
        ? {
            type: "children",
            children: [
              {
                text: description,
                color: "blue",
              },
            ],
          }
        : {
            type: "text",
            text: description,
          },
    ],
  };
};
