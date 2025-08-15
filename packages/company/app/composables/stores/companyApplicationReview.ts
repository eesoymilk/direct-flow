import {
  type CompanyEntries,
  type PersonEntries,
  type PersonPath,
  type PersonType,
  type ReviewEntryPath,
  type ReviewEntryValue,
  createCompanyEntries,
  createPersonEntries,
  filterEntriesByState,
  filterEntriesByStates,
  isCompanyPath,
  isPersonPath,
  isShareholderPath,
  isResponsiblePersonPath,
  isContactPersonPath,
  isRepresentativePath,
} from "./reviewEntry";

export const useCompanyApplicationReviewStore = defineStore(
  "companyApplicationReview",
  () => {
    const reviewRound = ref<ReviewRound>({
      status: "reviewing",
      summary: "",
    });

    const reviewEntries = ref<{
      company: Map<
        `company.${keyof CompanyEntries}`,
        CompanyEntries[keyof CompanyEntries]
      >;
      responsiblePerson: Map<
        `responsiblePerson.${keyof PersonEntries}`,
        PersonEntries[keyof PersonEntries]
      >;
      contactPerson: Map<
        `contactPerson.${keyof PersonEntries}`,
        PersonEntries[keyof PersonEntries]
      >;
      representative: Map<
        `representative.${keyof PersonEntries}`,
        PersonEntries[keyof PersonEntries]
      >;
      shareholders: Map<
        `shareholders.${number}.${keyof PersonEntries}`,
        PersonEntries[keyof PersonEntries]
      >[];
    }>({
      company: createCompanyEntries(),
      responsiblePerson: createPersonEntries("responsiblePerson"),
      contactPerson: createPersonEntries("contactPerson"),
      representative: createPersonEntries("representative"),
      shareholders: [],
    });

    // Helper function to get all person entries
    const peopleEntries = computed(() => [
      ...reviewEntries.value.responsiblePerson.values(),
      ...reviewEntries.value.contactPerson.values(),
      ...reviewEntries.value.representative.values(),
      ...reviewEntries.value.shareholders.flatMap((shareholder) =>
        Array.from(shareholder.values())
      ),
    ]);

    const entriesWithIssues = computed(() => {
      const companyIssues = filterEntriesByStates(
        Array.from(reviewEntries.value.company.values()),
        ["hasIssue", "issueResolved"]
      );

      const personIssues = filterEntriesByStates(peopleEntries.value, [
        "hasIssue",
        "issueResolved",
      ]);

      return [...companyIssues, ...personIssues];
    });

    const entriesUnderReview = computed(() => {
      const companyReviewing = filterEntriesByState(
        Array.from(reviewEntries.value.company.values()),
        "reviewing"
      );

      const personReviewing = filterEntriesByState(
        peopleEntries.value,
        "reviewing"
      );

      return [...companyReviewing, ...personReviewing];
    });

    const getCompanyEntryByPath = (
      entryPath: `company.${keyof CompanyEntries}`
    ): CompanyEntries[keyof CompanyEntries] | undefined => {
      return reviewEntries.value.company.get(entryPath);
    };

    const getPersonEntryByPath = (
      entryPath: PersonPath
    ): PersonEntries[keyof PersonEntries] | undefined => {
      if (isResponsiblePersonPath(entryPath)) {
        return reviewEntries.value.responsiblePerson.get(entryPath);
      } else if (isContactPersonPath(entryPath)) {
        return reviewEntries.value.contactPerson.get(entryPath);
      } else if (isRepresentativePath(entryPath)) {
        return reviewEntries.value.representative.get(entryPath);
      }
      return undefined;
    };

    const getShareholderEntryByPath = (
      entryPath: `shareholders.${number}.${keyof PersonEntries}`
    ): PersonEntries[keyof PersonEntries] | undefined => {
      const match = entryPath.match(/^shareholders\.(\d+)\.(.+)$/);
      if (!match || !match[1] || !match[2]) {
        return undefined;
      }

      const index = parseInt(match[1], 10);
      const shareholderMap = reviewEntries.value.shareholders[index];
      if (!shareholderMap) {
        return undefined;
      }

      return shareholderMap.get(entryPath);
    };

    // Function overloads for type-safe getEntryByPath
    function getEntryByPath(
      entryPath: `company.${keyof CompanyEntries}`
    ): CompanyEntries[keyof CompanyEntries] | undefined;
    function getEntryByPath(
      entryPath: PersonPath
    ): PersonEntries[keyof PersonEntries] | undefined;
    function getEntryByPath(
      entryPath: `shareholders.${number}.${keyof PersonEntries}`
    ): PersonEntries[keyof PersonEntries] | undefined;
    function getEntryByPath(
      entryPath: ReviewEntryPath
    ): ReviewEntryValue<typeof entryPath> | undefined;
    function getEntryByPath(
      entryPath: ReviewEntryPath
    ): ReviewEntryValue<typeof entryPath> | undefined {
      if (isCompanyPath(entryPath)) {
        return getCompanyEntryByPath(entryPath);
      } else if (isPersonPath(entryPath)) {
        return getPersonEntryByPath(entryPath);
      } else if (isShareholderPath(entryPath)) {
        return getShareholderEntryByPath(entryPath);
      }
      return undefined;
    }

    const setCompanyEntry = (
      entryPath: `company.${keyof CompanyEntries}`,
      value: CompanyEntries[keyof CompanyEntries]
    ): void => {
      reviewEntries.value.company.set(entryPath, value);
    };

    const setPersonEntry = (
      entryPath: PersonPath,
      value: PersonEntries[keyof PersonEntries]
    ): void => {
      if (isResponsiblePersonPath(entryPath)) {
        reviewEntries.value.responsiblePerson.set(entryPath, value);
      } else if (isContactPersonPath(entryPath)) {
        reviewEntries.value.contactPerson.set(entryPath, value);
      } else if (isRepresentativePath(entryPath)) {
        reviewEntries.value.representative.set(entryPath, value);
      }
    };

    const setShareholderEntry = (
      entryPath: `shareholders.${number}.${keyof PersonEntries}`,
      value: PersonEntries[keyof PersonEntries]
    ): void => {
      const match = entryPath.match(/^shareholders\.(\d+)\.(.+)$/);
      if (!match || !match[1] || !match[2]) {
        return;
      }

      const index = parseInt(match[1], 10);
      const shareholderMap = reviewEntries.value.shareholders[index];
      if (shareholderMap) {
        shareholderMap.set(entryPath, value);
      }
    };

    // Function overloads for type-safe setEntry
    function setEntry(
      entryPath: `company.${keyof CompanyEntries}`,
      value: CompanyEntries[keyof CompanyEntries]
    ): void;
    function setEntry(
      entryPath: PersonPath,
      value: PersonEntries[keyof PersonEntries]
    ): void;
    function setEntry(
      entryPath: `shareholders.${number}.${keyof PersonEntries}`,
      value: PersonEntries[keyof PersonEntries]
    ): void;
    function setEntry(
      entryPath: ReviewEntryPath,
      value: ReviewEntryValue<typeof entryPath>
    ): void;
    function setEntry(
      entryPath: ReviewEntryPath,
      value: ReviewEntryValue<typeof entryPath>
    ): void {
      if (isCompanyPath(entryPath)) {
        setCompanyEntry(
          entryPath,
          value as CompanyEntries[keyof CompanyEntries]
        );
      } else if (isPersonPath(entryPath)) {
        setPersonEntry(entryPath, value as PersonEntries[keyof PersonEntries]);
      } else if (isShareholderPath(entryPath)) {
        setShareholderEntry(
          entryPath,
          value as PersonEntries[keyof PersonEntries]
        );
      }
    }

    const editEntry = (
      fieldPath: ReviewEntryPath,
      value: string | string[]
    ) => {
      const currentEntry = getEntryByPath(fieldPath);
      if (!currentEntry) return;

      // Add a modification issue as to the entry
      setEntry(fieldPath, {
        ...currentEntry,
        value,
        state: "hasIssue",
        issue: {
          issueType: "modification",
          severity: "medium",
          description: "本資料已被審查人員修改，請確認後再送出",
        },
      });
    };

    return {
      reviewRound,
      reviewEntries,
      entriesWithIssues,
      entriesUnderReview,

      getEntryByPath,
      setEntry,
      editEntry,
    };
  }
);
