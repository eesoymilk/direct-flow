export const generateKeyAuditMattersSection = (
  opinionInfo: Partial<OpinionInfoForm>,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const description =
    opinionInfo.keyAuditMatterOption?.description || "[[空白的關鍵查核項目段]]";
  return {
    id: "KeyAuditMatter",
    children: [
      {
        type: "children",
        children: [
          {
            text: "關鍵查核事項段",
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
