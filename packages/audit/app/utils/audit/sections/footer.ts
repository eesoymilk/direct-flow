import type { BasicInfoForm } from "../../schemas/audit";
import type { DocumentSection } from "#shared/types/document";
import { formatRocDate } from "../../date";

export const generateFooterSection = (
  basicInfo: Partial<BasicInfoForm>
): DocumentSection => {
  const children: DocumentSection["children"] = [];

  // Firm name with 會計師事務所 suffix
  children.push({
    type: "children",
    alignment: "right",
    children: [
      {
        text: `${basicInfo.firmName || "[[空白的會計師事務所]]"}會計師事務所`,
      },
    ],
  });

  // First auditor (always show)
  if (basicInfo.auditorNames && basicInfo.auditorNames.length > 0) {
    children.push({
      type: "children",
      alignment: "right",
      children: [
        {
          text: `會計師：${basicInfo.auditorNames[0]}`,
        },
      ],
    });
  }

  // Second auditor (only for IFRS framework)
  if (
    basicInfo.accountingFramework === "IFRS" &&
    basicInfo.auditorNames &&
    basicInfo.auditorNames.length > 1
  ) {
    children.push({
      type: "children",
      alignment: "right",
      children: [
        {
          text: `會計師：${basicInfo.auditorNames[1]}`,
        },
      ],
    });
  }

  // Firm address (only show if provided)
  if (basicInfo.firmAddress) {
    // Firm address label
    children.push({
      type: "children",
      alignment: "right",
      children: [
        {
          text: `${basicInfo.firmName || "[[空白的會計師事務所]]"}會計師事務所地址：`,
        },
      ],
    });

    // Firm address
    children.push({
      type: "children",
      alignment: "right",
      children: [
        {
          text: basicInfo.firmAddress,
        },
      ],
    });
  }

  // ROC report date
  const rocDate = basicInfo.reportDate
    ? formatRocDate(basicInfo.reportDate)
    : "[[空白的報告日期]]";

  children.push({
    type: "children",
    alignment: "right",
    children: [
      {
        text: rocDate,
      },
    ],
  });

  return {
    id: "footer",
    children,
  };
};
