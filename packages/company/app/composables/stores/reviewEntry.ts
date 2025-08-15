import type { ReviewIssue } from "../../../shared/utils/schemas/companyApplicationReview";

type ReviewEntryBase<T> = {
  label: string;
  value: T;
};

export type ReviewEntryState =
  | "reviewing"
  | "hasIssue"
  | "issueResolved"
  | "verified"
  | "ignored"; // Ignored entries will not be sent to the review round in the database

export type ReviewEntry<T> =
  | ({
      state: "reviewing" | "verified" | "ignored";
    } & ReviewEntryBase<T>)
  | ({
      state: "hasIssue" | "issueResolved";
      issue: ReviewIssue;
    } & ReviewEntryBase<T>);

// Single source of truth - the object structure
export type CompanyEntries = {
  candidateNames: ReviewEntry<string[]>;
  chosenName: ReviewEntry<string>;
  organizationType: ReviewEntry<
    | "limited_company"
    | "company_limited"
    | "sole_proprietorship"
    | "partnership"
  >;
  businessItemsDescription: ReviewEntry<string>;
  businessItems: ReviewEntry<string[]>;
  address: ReviewEntry<string>;
};

export type PersonType =
  | "responsiblePerson"
  | "contactPerson"
  | "representative";

export type PersonEntries = {
  name: ReviewEntry<string>;
  idNumber: ReviewEntry<string>;
  address: ReviewEntry<string>;
  telephone: ReviewEntry<string>;
  cellphone: ReviewEntry<string>;
  email: ReviewEntry<string>;
};

export type PersonPath<T extends PersonType = PersonType> =
  `${T}.${keyof PersonEntries}`;

export type ReviewEntryPath =
  | `company.${keyof CompanyEntries}`
  | PersonPath<PersonType>
  | `shareholders.${number}.${keyof PersonEntries}`;

export type ReviewEntryValue<T extends ReviewEntryPath> =
  T extends `company.${infer K}`
    ? K extends keyof CompanyEntries
      ? CompanyEntries[K]
      : never
    : T extends
          | `responsiblePerson.${infer K}`
          | `contactPerson.${infer K}`
          | `representative.${infer K}`
      ? K extends keyof PersonEntries
        ? PersonEntries[K]
        : never
      : T extends `shareholders.${number}.${infer K}`
        ? K extends keyof PersonEntries
          ? PersonEntries[K]
          : never
        : never;

// Type guards for better type safety
export const isCompanyPath = (
  path: ReviewEntryPath
): path is `company.${keyof CompanyEntries}` => {
  return path.startsWith("company.");
};

export const isPersonPath = (path: ReviewEntryPath): path is PersonPath => {
  return (
    path.startsWith("responsiblePerson.") ||
    path.startsWith("contactPerson.") ||
    path.startsWith("representative.")
  );
};

export const isShareholderPath = (
  path: ReviewEntryPath
): path is `shareholders.${number}.${keyof PersonEntries}` => {
  return /^shareholders\.\d+\..+$/.test(path);
};

export const isResponsiblePersonPath = (
  path: PersonPath
): path is PersonPath<"responsiblePerson"> => {
  return path.startsWith("responsiblePerson.");
};

export const isContactPersonPath = (
  path: PersonPath
): path is PersonPath<"contactPerson"> => {
  return path.startsWith("contactPerson.");
};

export const isRepresentativePath = (
  path: PersonPath
): path is PersonPath<"representative"> => {
  return path.startsWith("representative.");
};

// Utility type for extracting person type from path
export type ExtractPersonType<T extends PersonPath> =
  T extends `${infer P extends PersonType}.${string}` ? P : never;

// Helper functions to create entry maps
export const createCompanyEntries = (): Map<
  `company.${keyof CompanyEntries}`,
  CompanyEntries[keyof CompanyEntries]
> =>
  new Map([
    [
      "company.candidateNames",
      {
        label: "公司名稱候選",
        value: [],
        state: "reviewing",
      },
    ],
    [
      "company.chosenName",
      {
        label: "公司名稱",
        value: "",
        state: "reviewing",
      },
    ],
    [
      "company.businessItems",
      {
        label: "業務項目",
        value: [],
        state: "reviewing",
      },
    ],
    [
      "company.address",
      {
        label: "地址",
        value: "",
        state: "reviewing",
      },
    ],
    [
      "company.organizationType",
      {
        label: "組織類型",
        value: "limited_company",
        state: "reviewing",
      },
    ],
    [
      "company.businessItemsDescription",
      {
        label: "業務項目描述",
        value: "",
        state: "reviewing",
      },
    ],
  ]);

export const createPersonEntries = <
  T extends "responsiblePerson" | "contactPerson" | "representative",
>(
  personType: T
): Map<`${T}.${keyof PersonEntries}`, PersonEntries[keyof PersonEntries]> => {
  const entries = [
    ["name", { label: "姓名", value: "", state: "reviewing" }],
    ["idNumber", { label: "身分證號碼", value: "", state: "reviewing" }],
    ["address", { label: "地址", value: "", state: "reviewing" }],
    ["telephone", { label: "電話", value: "", state: "reviewing" }],
    ["cellphone", { label: "手機", value: "", state: "reviewing" }],
    ["email", { label: "電子郵件", value: "", state: "reviewing" }],
  ] as const;

  return new Map(
    entries.map(([key, value]) => [`${personType}.${key}`, value])
  );
};

export const filterEntriesByState = <
  T extends
    | CompanyEntries[keyof CompanyEntries]
    | PersonEntries[keyof PersonEntries],
>(
  entries: T[],
  targetState: ReviewEntryState
): T[] => {
  return entries.filter((entry) => entry.state === targetState);
};

export const filterEntriesByStates = <
  T extends
    | CompanyEntries[keyof CompanyEntries]
    | PersonEntries[keyof PersonEntries],
>(
  entries: T[],
  targetStates: ReviewEntryState[]
): T[] => {
  return entries.filter((entry) => targetStates.includes(entry.state));
};
