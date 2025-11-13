export const generateHeaderSection = (
  basicInfo: Partial<BasicInfoForm>
): DocumentSection => {
  const entityName = basicInfo.entityName || "[[空白的受查者名稱]]";

  return {
    id: "header",
    children: [
      {
        type: "children",
        alignment: "center",
        children: [{ text: "會計師查核報告", bold: true }],
      },
      {
        type: "children",
        children: [
          {
            text: `${entityName} 公鑒：`,
            bold: true,
          },
        ],
      },
    ],
  };
};
