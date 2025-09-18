import { faker } from "@faker-js/faker/locale/zh_TW";
import { AUDITING_FRAMEWORKS, OPINION_TYPES } from "#shared/utils/constants";

export const generateBasicInfo = (): Partial<AuditBasicInfo> => {
  const currentRocYear = faker.number.int({ min: 110, max: 115 }); // ROC years 110-115 (2021-2026)
  const reportDate = faker.date.between({
    from: new Date(currentRocYear + 1911, 0, 1), // Convert ROC year to AD year
    to: new Date(currentRocYear + 1912, 11, 31),
  });

  const basicInfo: Partial<AuditBasicInfo> = {
    entityName: faker.company.name() + "股份有限公司",
    currentRocYear,
    firmName: faker.helpers.arrayElement([
      "勤業眾信聯合會計師事務所",
      "安侯建業聯合會計師事務所",
      "資誠聯合會計師事務所",
      "安永聯合會計師事務所",
    ]),
    auditorName: faker.person.lastName() + faker.person.firstName(),
    reportDate,
    accountingFramework: faker.helpers.arrayElement(AUDITING_FRAMEWORKS),
  };

  // Optionally add comparative period
  if (faker.datatype.boolean()) {
    basicInfo.comparativeRocYear = currentRocYear - 1;
  }

  return basicInfo;
};

export const generateOpinionInfo = (): Partial<AuditOpinionInfo> => {
  const opinionType = faker.helpers.arrayElement(OPINION_TYPES);

  const opinionInfo: Partial<AuditOpinionInfo> = {
    opinionType,
  };

  // Add other matter option occasionally
  if (faker.datatype.boolean({ probability: 0.3 })) {
    opinionInfo.otherMatterOption = {
      type: faker.helpers.arrayElement([
        "previousReportHandledByOtherAuditor",
        "missingPreviousAuditReport",
      ]),
    };

    if (
      opinionInfo.otherMatterOption.type ===
      "previousReportHandledByOtherAuditor"
    ) {
      opinionInfo.otherMatterOption.previousAuditReportDate = faker.date.past();
    }
  }

  return opinionInfo;
};

export const generateCompleteData = (): {
  basicInfo: Partial<AuditBasicInfo>;
  opinionInfo: Partial<AuditOpinionInfo>;
} => {
  return {
    basicInfo: generateBasicInfo(),
    opinionInfo: generateOpinionInfo(),
  };
};
