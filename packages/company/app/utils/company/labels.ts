const organizationTypeLabelMap: Record<OrganizationType, string> = {
  corporation: "股份有限公司", // Updated to match new organization type
  limited_company: "有限公司",
  sole_proprietorship: "獨資",
  partnership: "合夥企業",
};

const personLabelMap: Record<PersonType, string> = {
  responsiblePerson: "負責人",
  contactPerson: "聯絡人",
  managerialOfficer: "經理人",
};

const partnerTypeLabelMap: Record<PartnerType, string> = {
  chairman: "董事長",
  viceChairman: "副董事長",
  executiveDirector: "常務董事",
  director: "董事",
  supervisor: "監察人",
  shareholder: "股東",
  partner: "合夥人",
  manager: "經理人",
  legalRepresentative: "法定代理人",
  corporateShareholder: "法人股東",
};

const corporateRepresentativeTypeLabelMap: Record<CorporateRepresentativeType, string> = {
  directorRepresentative: "法人董事代表人",
  representativeDirector: "法人代表人董事",
};

const shareTypeLabelMap: Record<ShareType, string> = {
  ordinary: "普通股",
  preferred: "特別股",
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

export const getPartnerTypeLabel = (partnerType?: PartnerType) =>
  partnerType ? partnerTypeLabelMap[partnerType] : "未選擇";

export const getShareTypeLabel = (
  shareType?: ShareType,
  shareCount?: number
) => {
  if (shareType === "preferred_a" && shareCount === 2) {
    return "特別股";
  }
  return shareType ? shareTypeLabelMap[shareType] : "未選擇";
};

export const getCorporateRepresentativeTypeLabel = (
  corporateRepresentativeType?: CorporateRepresentativeType
) =>
  corporateRepresentativeType
    ? corporateRepresentativeTypeLabelMap[corporateRepresentativeType]
    : "未選擇";
