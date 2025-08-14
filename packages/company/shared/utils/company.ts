export const getOrganizationTypeLabel = (type: string | null) => {
  if (!type) return "未選擇";

  const labels = {
    limited_company: "有限公司",
    company_limited: "股份有限公司",
    sole_proprietorship: "獨資企業",
    partnership: "合夥企業",
  };
  return labels[type as keyof typeof labels] || type;
};

export const textVar2 = "test2";
