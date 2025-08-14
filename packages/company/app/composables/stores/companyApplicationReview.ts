type ReviewEntryBase<T> = {
  label: string;
  value: T;
};

export type ReviewEntryState =
  | "reviewing"
  | "hasIssue"
  | "issueResolved"
  | "verified";

export type ReviewEntry<T> =
  | ({
      state: "reviewing" | "verified";
    } & ReviewEntryBase<T>)
  | ({
      state: "hasIssue" | "issueResolved";
      issue: ReviewIssue;
    } & ReviewEntryBase<T>);

export type CompanyApplicationReviewEntryPath =
  | "candidateNames"
  | "organizationType"
  | "businessItemsDescription"
  | "businessItems"
  | "address";

export type CompanyApplicationReviewEntryValues = {
  candidateNames: string[];
  organizationType:
    | "limited_company"
    | "company_limited"
    | "sole_proprietorship"
    | "partnership";
  businessItemsDescription: string;
  businessItems: string[];
  address: string;
};

export const useCompanyApplicationReviewStore = defineStore(
  "companyApplicationReview",
  () => {
    const reviewRound = ref<ReviewRound>({
      status: "awaiting_client",
      summary: "",
    });

    const reviewEntries = ref<
      Map<CompanyApplicationReviewEntryPath, ReviewEntry<any>>
    >(
      new Map([
        [
          "candidateNames",
          {
            label: "公司預查名稱",
            value: [],
            state: "reviewing",
          },
        ],
        [
          "organizationType",
          {
            label: "公司組織",
            value: "limited_company",
            state: "reviewing",
          },
        ],
        [
          "businessItemsDescription",
          {
            label: "營業項目描述",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "businessItems",
          {
            label: "營業項目",
            value: [],
            state: "reviewing",
          },
        ],
        [
          "address",
          {
            label: "公司地址",
            value: "",
            state: "reviewing",
          },
        ],
      ])
    );

    const getEntryByFieldPath = <T extends CompanyApplicationReviewEntryPath>(
      fieldPath: T
    ): ReviewEntry<CompanyApplicationReviewEntryValues[T]> | undefined =>
      reviewEntries.value.get(fieldPath);

    const getEntryValue = <T extends CompanyApplicationReviewEntryPath>(
      fieldPath: T
    ): CompanyApplicationReviewEntryValues[T] | undefined =>
      reviewEntries.value.get(fieldPath)?.value;

    const setEntryValue = <T extends CompanyApplicationReviewEntryPath>(
      fieldPath: T,
      value: CompanyApplicationReviewEntryValues[T]
    ) => {
      const entry = reviewEntries.value.get(fieldPath);
      if (entry) {
        entry.value = value;
      }
    };

    const setEntryState = <T extends CompanyApplicationReviewEntryPath>(
      fieldPath: T,
      state: ReviewEntryState,
      issue?: ReviewIssue
    ) => {
      const entry = reviewEntries.value.get(fieldPath);

      if (!entry) {
        throw new Error(`Entry not found: ${fieldPath}`);
      }

      const { label, value } = entry;

      if (state === "reviewing" || state === "verified") {
        // Remove issue if state is reviewing or verified
        reviewEntries.value.set(fieldPath, {
          label,
          value,
          state,
        });
        return;
      }

      if (!issue) {
        throw new Error(
          `Issue is required when state is ${state}: ${fieldPath}`
        );
      }

      reviewEntries.value.set(fieldPath, { label, value, state, issue });
    };

    const entriesWithIssues = computed(() => {
      const issues: Array<{
        fieldPath: CompanyApplicationReviewEntryPath;
        entry: ReviewEntry<any>;
      }> = [];
      for (const [fieldPath, entry] of reviewEntries.value) {
        if (entry.state === "hasIssue" || entry.state === "issueResolved") {
          issues.push({ fieldPath, entry });
        }
      }
      return issues;
    });

    const entriesUnderReview = computed(() => {
      const reviewing: Array<{
        fieldPath: CompanyApplicationReviewEntryPath;
        entry: ReviewEntry<any>;
      }> = [];
      for (const [fieldPath, entry] of reviewEntries.value) {
        if (entry.state === "reviewing") {
          reviewing.push({ fieldPath, entry });
        }
      }
      return reviewing;
    });

    return {
      reviewRound,
      reviewEntries,

      getEntryByFieldPath,
      getEntryValue,
      setEntryValue,
      setEntryState,

      entriesWithIssues,
      entriesUnderReview,
    };
  }
);
