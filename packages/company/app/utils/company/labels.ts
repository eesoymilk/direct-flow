const organizationTypeLabelMap: Record<OrganizationType, string> = {
  corporation: "股份有限公司", // Updated to match new organization type
  limited_company: "有限公司",
  sole_proprietorship: "獨資企業",
  partnership: "合夥企業",
};

type PersonType = "responsiblePerson" | "representative" | "contactPerson";

const personLabelMap: Record<PersonType, string> = {
  responsiblePerson: "負責人",
  representative: "代表人",
  contactPerson: "聯絡人",
};

export const getOrganizationTypeLabel = (organizationType?: string) =>
  organizationType
    ? organizationTypeLabelMap[organizationType as OrganizationType]
    : "未選擇";

export const getPersonLabel = (personType?: PersonType) =>
  personType ? personLabelMap[personType] : "未選擇";
