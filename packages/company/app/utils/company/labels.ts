const organizationTypeLabelMap: Record<OrganizationType, string> = {
  company_limited: "股份有限公司",
  closely_held_company_limited: "閉鎖型股份有限公司",
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
