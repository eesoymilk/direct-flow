import { getRocYearText, getFormattedEntityName } from "./helpers";
import { getOpinionSectionTitle } from "./opinion";
import type { OpinionParagraphOptions } from "./types";

const generateOtherMattersSectionParts = ({
  entity,
  matterType,
  previousOpinionType,
  previousAuditReportYear,
  previousAuditReportDate,
  customDescription,
}: Pick<OpinionParagraphOptions, "entity"> & {
  matterType?: OtherMatterType;
  previousOpinionType?: "qualified" | "unqualified" | "adverse" | "disclaimer";
  previousAuditReportYear?: number;
  previousAuditReportDate?: Date;
  customDescription?: string;
}) => {
  if (!matterType) {
    return [{ text: "[[空白的其他事項段]]" }];
  }

  if (matterType === "previousReportHandledByOtherAuditor") {
    const reportDateText = previousAuditReportDate
      ? formatRocDate(previousAuditReportDate)
      : "[[空白日期]]";
    return [
      {
        text: entity,
        color: "blue",
      },
      {
        text: getRocYearText(previousAuditReportYear),
        color: "blue",
      },
      {
        text: "年度之財務報表係由其他會計師查核，並於",
      },
      {
        text: reportDateText,
        color: "blue",
      },
      {
        text: "出具",
      },
      {
        text: getOpinionSectionTitle(previousOpinionType),
        color: "blue",
      },
      {
        text: "。",
      },
    ];
  }

  if (matterType === "custom") {
    return [
      {
        text: customDescription || "[[空白的其他事項段]]",
        color: "blue",
      },
    ];
  }

  if (matterType === "missingPreviousAuditReport") {
    return [
      {
        text: entity,
        color: "blue",
      },
      {
        text: getRocYearText(previousAuditReportYear),
        color: "blue",
      },
      {
        text: "年度之財務報表，並未經會計師查核，其附列之目的僅供參考。",
        color: "blue",
      },
    ];
  }

  return [{ text: "[[空白的其他事項段]]" }];
};

export const generateOtherMattersSection = (
  basicInfo: Partial<BasicInfoForm>,
  opinionInfo: Partial<OpinionInfoForm>,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const parts = generateOtherMattersSectionParts({
    entity: getFormattedEntityName(
      basicInfo.entityName,
      basicInfo.isConsolidatedReport
    ),
    // TODO: Discuss with team about how to handle the previous audit report year
    previousAuditReportYear: basicInfo.currentRocYear
      ? basicInfo.currentRocYear - 1
      : undefined,
    matterType: opinionInfo.otherMatterOption?.type,
    previousAuditReportDate:
      opinionInfo.otherMatterOption?.type ===
      "previousReportHandledByOtherAuditor"
        ? opinionInfo.otherMatterOption.previousAuditReportDate
        : undefined,
    customDescription:
      opinionInfo.otherMatterOption?.type === "custom"
        ? opinionInfo.otherMatterOption.customDescription
        : undefined,
  });

  return {
    id: "otherMatter",
    children: [
      {
        type: "children",
        children: [
          {
            text: "其他事項段",
            bold: true,
            underline: true,
          },
        ],
      },
      highlightVariable
        ? {
            type: "children",
            children: parts,
          }
        : {
            type: "text",
            text: parts.map((part) => part.text).join(""),
          },
    ],
  };
};
