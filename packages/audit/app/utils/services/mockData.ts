import { faker } from "@faker-js/faker/locale/zh_TW";
import { AUDITING_FRAMEWORKS, OPINION_TYPES } from "#shared/utils/constants";
import type { BasicInfoForm, OpinionInfoForm } from "../schemas/audit";

export const generateBasicInfo = (): Partial<BasicInfoForm> => {
  const currentRocYear = faker.number.int({ min: 110, max: 115 }); // ROC years 110-115 (2021-2026)
  const reportDate = faker.date.between({
    from: new Date(currentRocYear + 1911, 0, 1), // Convert ROC year to AD year
    to: new Date(currentRocYear + 1912, 11, 31),
  });

  const accountingFramework = faker.helpers.arrayElement(AUDITING_FRAMEWORKS);

  // Generate auditor names based on framework
  const auditorNames =
    accountingFramework === "IFRS"
      ? [
          faker.person.lastName() + faker.person.firstName(),
          faker.person.lastName() + faker.person.firstName(),
        ]
      : [faker.person.lastName() + faker.person.firstName()];

  const basicInfo: Partial<BasicInfoForm> = {
    entityName: faker.company.name() + "股份有限公司",
    currentRocYear,
    isComparativeReport: faker.datatype.boolean(),
    isConsolidatedReport: faker.datatype.boolean(),
    firmName: faker.helpers.arrayElement([
      "勤業眾信聯合會計師事務所",
      "安侯建業聯合會計師事務所",
      "資誠聯合會計師事務所",
      "安永聯合會計師事務所",
    ]),
    firmAddress: faker.datatype.boolean({ probability: 0.7 })
      ? faker.location.streetAddress({ useFullAddress: true })
      : undefined,
    auditorNames,
    reportDate,
    accountingFramework,
    useEquityMethodInvestment: faker.datatype.boolean(),
  };

  return basicInfo;
};

export const generateOpinionInfo = (
  currentRocYear?: number
): OpinionInfoForm => {
  const opinionType = faker.helpers.arrayElement(OPINION_TYPES);
  const year = currentRocYear || faker.number.int({ min: 110, max: 115 });

  const opinionInfo: OpinionInfoForm = {
    mode: "single",
    opinion: {
      year,
      opinionType,
      reason:
        opinionType !== "unqualified" ? faker.lorem.sentence() : undefined,
    },
  };

  // Add other matter option occasionally
  if (faker.datatype.boolean({ probability: 0.5 })) {
    const otherMatterOptionType = faker.helpers.arrayElement([
      "previousReportHandledByOtherAuditor",
      "missingPreviousAuditReport",
      "custom",
    ]);

    if (otherMatterOptionType === "previousReportHandledByOtherAuditor") {
      opinionInfo.otherMatterOption = {
        type: otherMatterOptionType,
        previousOpinionType: faker.helpers.arrayElement([
          "unqualified",
          "qualifiedDisclaimer",
          "qualifiedAdverse",
          "adverse",
          "disclaimer",
        ]),
      };
    } else if (otherMatterOptionType === "missingPreviousAuditReport") {
      opinionInfo.otherMatterOption = {
        type: otherMatterOptionType,
      };
    } else if (otherMatterOptionType === "custom") {
      opinionInfo.otherMatterOption = {
        type: otherMatterOptionType,
        customDescription: faker.lorem.sentence(),
      };
    }
  }

  return opinionInfo;
};

export const generateCompleteData = (): {
  basicInfo: Partial<BasicInfoForm>;
  opinionInfo: OpinionInfoForm;
} => {
  const basicInfo = generateBasicInfo();
  return {
    basicInfo,
    opinionInfo: generateOpinionInfo(basicInfo.currentRocYear),
  };
};
