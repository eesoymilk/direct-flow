const organizationTypeLabelMap: Record<OrganizationType, string> = {
  company_limited: "股份有限公司",
  closely_held_company_limited: "閉鎖型股份有限公司",
  limited_company: "有限公司",
  sole_proprietorship: "獨資企業",
  partnership: "合夥企業",
};

export const getOrganizationTypeLabel = (organizationType?: string) =>
  organizationType
    ? organizationTypeLabelMap[organizationType as OrganizationType]
    : "未選擇";
