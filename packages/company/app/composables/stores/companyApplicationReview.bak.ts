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
export type CompanyApplicationReviewEntryValues = {
  candidateNames: string[];
  chosenName: string;
  organizationType:
    | "limited_company"
    | "company_limited"
    | "sole_proprietorship"
    | "partnership";
  businessItemsDescription: string;
  businessItems: string[];
  address: string;
  responsiblePerson: {
    name: string;
    idNumber: string;
    address: string;
    telephone: string;
    cellphone: string;
    email: string;
  };
  contactPerson: {
    name: string;
    idNumber: string;
    address: string;
    telephone: string;
    cellphone: string;
    email: string;
  };
  representative: {
    name: string;
    idNumber: string;
    address: string;
    telephone: string;
    cellphone: string;
    email: string;
  };
  shareholders: Array<{
    name: string;
    idNumber: string;
    address: string;
    telephone: string;
    cellphone: string;
    email: string;
  }>;
};

// Define the paths that can be accessed via dot notation
export type CompanyApplicationReviewEntryPath =
  | "candidateNames"
  | "chosenName"
  | "organizationType"
  | "businessItemsDescription"
  | "businessItems"
  | "address"
  | "responsiblePerson.name"
  | "responsiblePerson.idNumber"
  | "responsiblePerson.address"
  | "responsiblePerson.telephone"
  | "responsiblePerson.cellphone"
  | "responsiblePerson.email"
  | "contactPerson.name"
  | "contactPerson.idNumber"
  | "contactPerson.address"
  | "contactPerson.telephone"
  | "contactPerson.cellphone"
  | "contactPerson.email"
  | "representative.name"
  | "representative.idNumber"
  | "representative.address"
  | "representative.telephone"
  | "representative.cellphone"
  | "representative.email"
  | `shareholders.${number}.name`
  | `shareholders.${number}.idNumber`
  | `shareholders.${number}.address`
  | `shareholders.${number}.telephone`
  | `shareholders.${number}.cellphone`
  | `shareholders.${number}.email`;

// Generic path-to-value mapping for any nested structure
type PathToValue<T extends CompanyApplicationReviewEntryPath> =
  T extends keyof CompanyApplicationReviewEntryValues
    ? CompanyApplicationReviewEntryValues[T]
    : T extends `${infer Obj}.${infer Prop}`
      ? Obj extends keyof CompanyApplicationReviewEntryValues
        ? CompanyApplicationReviewEntryValues[Obj] extends object
          ? Prop extends keyof CompanyApplicationReviewEntryValues[Obj]
            ? CompanyApplicationReviewEntryValues[Obj][Prop]
            : never
          : never
        : never
      : T extends `shareholders.${number}.${infer Prop}`
        ? Prop extends keyof CompanyApplicationReviewEntryValues["shareholders"][number]
          ? CompanyApplicationReviewEntryValues["shareholders"][number][Prop]
          : never
        : never;

export const useCompanyApplicationReviewStore = defineStore(
  "companyApplicationReview",
  () => {
    const reviewRound = ref<ReviewRound>({
      status: "reviewing",
      summary: "",
    });

    const companyEntries = ref<
      Map<CompanyApplicationReviewEntryPath, ReviewEntry<any>>
    >(new Map());

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
          "chosenName",
          {
            label: "公司選定名稱",
            value: "",
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
        [
          "responsiblePerson.name",
          {
            label: "負責人姓名",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "responsiblePerson.idNumber",
          {
            label: "負責人身分證號碼",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "responsiblePerson.address",
          {
            label: "負責人戶籍地址",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "responsiblePerson.telephone",
          {
            label: "負責人電話",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "responsiblePerson.cellphone",
          {
            label: "負責人手機",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "responsiblePerson.email",
          {
            label: "負責人電子郵件",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "contactPerson.name",
          {
            label: "聯絡人姓名",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "contactPerson.idNumber",
          {
            label: "聯絡人身分證號碼",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "contactPerson.address",
          {
            label: "聯絡人戶籍地址",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "contactPerson.telephone",
          {
            label: "聯絡人電話",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "contactPerson.cellphone",
          {
            label: "聯絡人手機",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "contactPerson.email",
          {
            label: "聯絡人電子郵件",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "representative.name",
          {
            label: "代表人姓名",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "representative.idNumber",
          {
            label: "代表人身分證號碼",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "representative.address",
          {
            label: "代表人戶籍地址",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "representative.telephone",
          {
            label: "代表人電話",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "representative.cellphone",
          {
            label: "代表人手機",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "representative.email",
          {
            label: "代表人電子郵件",
            value: "",
            state: "reviewing",
          },
        ],
        [
          "shareholders",
          {
            label: "股東資料",
            value: [],
            state: "reviewing",
          },
        ],
      ])
    );

    const getEntryByFieldPath = <T extends CompanyApplicationReviewEntryPath>(
      fieldPath: T
    ): ReviewEntry<PathToValue<T>> | undefined =>
      reviewEntries.value.get(fieldPath);

    const getEntryValue = <T extends CompanyApplicationReviewEntryPath>(
      fieldPath: T
    ): PathToValue<T> | undefined => reviewEntries.value.get(fieldPath)?.value;

    const setEntryValue = <T extends CompanyApplicationReviewEntryPath>(
      fieldPath: T,
      value: PathToValue<T>
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

      if (
        state === "reviewing" ||
        state === "verified" ||
        state === "ignored"
      ) {
        // Remove issue if state is reviewing / verified / ignored
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

    // Helper functions for working with individual shareholders
    const getShareholderEntry = (
      index: number,
      property:
        | "name"
        | "idNumber"
        | "address"
        | "telephone"
        | "cellphone"
        | "email"
    ) => {
      const fieldPath = `shareholders.${index}.${property}` as const;
      return reviewEntries.value.get(fieldPath);
    };

    const getShareholderValue = (
      index: number,
      property:
        | "name"
        | "idNumber"
        | "address"
        | "telephone"
        | "cellphone"
        | "email"
    ) => {
      const fieldPath = `shareholders.${index}.${property}` as const;
      return reviewEntries.value.get(fieldPath)?.value;
    };

    const setShareholderValue = (
      index: number,
      property:
        | "name"
        | "idNumber"
        | "address"
        | "telephone"
        | "cellphone"
        | "email",
      value: string
    ) => {
      const fieldPath =
        `shareholders.${index}.${property}` as CompanyApplicationReviewEntryPath;
      setEntryValue(fieldPath as any, value as any);
    };

    const setShareholderState = (
      index: number,
      property:
        | "name"
        | "idNumber"
        | "address"
        | "telephone"
        | "cellphone"
        | "email",
      state: ReviewEntryState,
      issue?: ReviewIssue
    ) => {
      const fieldPath =
        `shareholders.${index}.${property}` as CompanyApplicationReviewEntryPath;
      setEntryState(fieldPath, state, issue);
    };

    const addShareholderEntry = (index: number) => {
      const properties: Array<
        "name" | "idNumber" | "address" | "telephone" | "cellphone" | "email"
      > = ["name", "idNumber", "address", "telephone", "cellphone", "email"];
      const labels = [
        "股東姓名",
        "股東身分證號碼",
        "股東戶籍地址",
        "股東電話",
        "股東手機",
        "股東電子郵件",
      ];

      properties.forEach((property, propIndex) => {
        const fieldPath = `shareholders.${index}.${property}` as const;
        reviewEntries.value.set(fieldPath, {
          label: labels[propIndex],
          value: "",
          state: "reviewing",
        });
      });
    };

    const removeShareholderEntry = (index: number) => {
      const properties: Array<
        "name" | "idNumber" | "address" | "telephone" | "cellphone" | "email"
      > = ["name", "idNumber", "address", "telephone", "cellphone", "email"];

      properties.forEach((property) => {
        const fieldPath = `shareholders.${index}.${property}` as const;
        reviewEntries.value.delete(fieldPath);
      });
    };

    return {
      reviewRound,
      reviewEntries,

      getEntryByFieldPath,
      getEntryValue,
      setEntryValue,
      setEntryState,

      entriesWithIssues,
      entriesUnderReview,

      // Shareholder helper functions
      getShareholderEntry,
      getShareholderValue,
      setShareholderValue,
      setShareholderState,
      addShareholderEntry,
      removeShareholderEntry,
    };
  }
);
