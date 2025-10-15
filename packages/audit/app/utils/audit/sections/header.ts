export const generateHeaderSection = (
  basicInfo: Partial<BasicInfoForm>
): DocumentSection => {
  const entityName = basicInfo.entityName || "[[空白的受查者名稱]]";
  const recipientName = basicInfo.isConsolidatedReport
    ? `${entityName}（或其他適當之報告受收者）公鑒：`
    : `${entityName} 公鑒：`;

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
            text: recipientName,
            bold: true,
          },
        ],
      },
    ],
  };
};
