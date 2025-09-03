export type PersonType =
  | "responsiblePerson"
  | "contactPerson"
  | "representative";

export type PersonFieldPath = `${PersonType}.${string}`;

type CompanyBasicInfoField =
  | {
      fieldPath: "candidateNames";
      value: string[];
    }
  | {
      fieldPath: "organizationType";
      value: OrganizationType;
    }
  | {
      fieldPath: "hasParValueFreeShares";
      value: boolean;
    }
  | {
      fieldPath: "businessItemsDescription" | "address";
      value: string;
    }
  | {
      fieldPath:
        | "capitalAmount"
        | "authorizedShares"
        | "ordinaryShares"
        | "preferredShares";
      value: number;
    };

export type CompanyApplicationReviewSection = {
  id: "companyBasicInfo";
  title: string;
  description: string;
  fields: CompanyBasicInfoField[];
};
