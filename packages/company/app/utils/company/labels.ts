const organizationTypeLabelMap: Record<OrganizationType, string> = {
  corporation: "股份有限公司", // Updated to match new organization type
  limited_company: "有限公司",
  sole_proprietorship: "獨資企業",
  partnership: "合夥企業",
};

const personLabelMap: Record<PersonType, string> = {
  responsiblePerson: "負責人",
  contactPerson: "聯絡人",
};

const shareTypeLabelMap: Record<ShareType, string> = {
  ordinary: "普通股",
  preferred_a: "甲種特別股",
  preferred_b: "乙種特別股",
  preferred_c: "丙種特別股",
  preferred_d: "丁種特別股",
  preferred_e: "戊種特別股",
};

export const getOrganizationTypeLabel = (organizationType?: string) =>
  organizationType
    ? organizationTypeLabelMap[organizationType as OrganizationType]
    : "未選擇";

export const getPersonLabel = (personType?: PersonType) =>
  personType ? personLabelMap[personType] : "未選擇";

export const getShareTypeLabel = (shareType?: ShareType) =>
  shareType ? shareTypeLabelMap[shareType] : "未選擇";
