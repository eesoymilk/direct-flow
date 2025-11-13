import type {
  AUDITING_FRAMEWORKS,
  OPINION_TYPES,
  OTHER_MATTER_TYPES,
} from "../utils/constants";

export type OpinionType = (typeof OPINION_TYPES)[number];

export type AccountingFramework = (typeof AUDITING_FRAMEWORKS)[number];

export type OtherMatterType = (typeof OTHER_MATTER_TYPES)[number];

// Dual opinion title combinations (alphabetically sorted)
export type DualOpinionTitleType =
  | "adverse-disclaimer"
  | "adverse-qualified"
  | "adverse-unqualified"
  | "disclaimer-qualified"
  | "disclaimer-unqualified"
  | "qualified-unqualified";
