export type ReviewEntryState =
  | "reviewing"
  | "hasIssue"
  | "issueResolved"
  | "verified"
  | "ignored";

export type ReviewEntry<T = string | string[]> = {
  label: string;
  value: T;
  state: ReviewEntryState;
  issue?: ReviewIssue;
};

export type CompanyField =
  | "candidateNames"
  | "chosenName"
  | "organizationType"
  | "businessItemsDescription"
  | "businessItems"
  | "address";

export type PersonField =
  | "name"
  | "idNumber"
  | "address"
  | "telephone"
  | "cellphone"
  | "email";

export type PersonType =
  | "responsiblePerson"
  | "contactPerson"
  | "representative";

export type ShareholderField = `shareholders.${number}.${PersonField}`;

export type FieldPath =
  | `company.${CompanyField}`
  | `${PersonType}.${PersonField}`
  | ShareholderField;

export type CompanyData = Record<CompanyField, ReviewEntry>;
export type PersonData = Record<PersonField, ReviewEntry>;

export const parseFieldPath = (path: FieldPath) => {
  const parts = path.split(".");

  if (parts[0] === "company") {
    return { type: "company" as const, field: parts[1] as CompanyField };
  }

  if (parts[0] === "shareholders") {
    return {
      type: "shareholder" as const,
      index: parseInt(parts[1] || "0"),
      field: parts[2] as PersonField,
    };
  }

  return {
    type: parts[0] as PersonType,
    field: parts[1] as PersonField,
  };
};

export const createCompanyData = (): CompanyData => ({
  candidateNames: {
    label: "公司名稱候選",
    value: [],
    state: "reviewing",
  },
  chosenName: {
    label: "公司名稱",
    value: "",
    state: "reviewing",
  },
  businessItems: {
    label: "業務項目",
    value: [],
    state: "reviewing",
  },
  address: {
    label: "地址",
    value: "",
    state: "reviewing",
  },
  organizationType: {
    label: "組織類型",
    value: "limited_company",
    state: "reviewing",
  },
  businessItemsDescription: {
    label: "業務項目描述",
    value: "",
    state: "reviewing",
  },
});

export const createPersonData = (): PersonData => ({
  name: { label: "姓名", value: "", state: "reviewing" },
  idNumber: { label: "身分證號碼", value: "", state: "reviewing" },
  address: { label: "地址", value: "", state: "reviewing" },
  telephone: { label: "電話", value: "", state: "reviewing" },
  cellphone: { label: "手機", value: "", state: "reviewing" },
  email: { label: "電子郵件", value: "", state: "reviewing" },
});

export const filterEntriesByState = (
  entries: ReviewEntry[],
  targetState: ReviewEntryState
): ReviewEntry[] => {
  return entries.filter((entry) => entry.state === targetState);
};

export const filterEntriesByStates = (
  entries: ReviewEntry[],
  targetStates: ReviewEntryState[]
): ReviewEntry[] => {
  return entries.filter((entry) => targetStates.includes(entry.state));
};
