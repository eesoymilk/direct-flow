import type {
  AUDITING_FRAMEWORKS,
  OPINION_TYPES,
  OTHER_MATTER_TYPES,
} from "../utils/constants";

export type OpinionType = (typeof OPINION_TYPES)[number];

export type AccountingFramework = (typeof AUDITING_FRAMEWORKS)[number];

export type OtherMatterType = (typeof OTHER_MATTER_TYPES)[number];

// Re-export OpinionInfoForm from the schema module
export type { OpinionInfoForm } from "../../app/utils/schemas/audit";

// Dual opinion title combinations (alphabetically sorted)
export type DualOpinionTitleType =
  | "adverse-disclaimer"
  | "adverse-qualified"
  | "adverse-unqualified"
  | "disclaimer-qualified"
  | "disclaimer-unqualified"
  | "qualified-unqualified";
