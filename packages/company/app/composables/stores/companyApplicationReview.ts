import {
  type CompanyData,
  type PersonData,
  type FieldPath,
  type ReviewEntry,
  createCompanyData,
  createPersonData,
  filterEntriesByState,
  filterEntriesByStates,
  parseFieldPath,
} from "./reviewEntry";

type ReviewRound = {
  status: "reviewing" | "filing" | "approved" | "rejected";
  summary: string;
};

type ReviewEntriesState = {
  company: CompanyData;
  responsiblePerson: PersonData;
  contactPerson: PersonData;
  representative: PersonData;
  shareholders: PersonData[];
};

export const useCompanyApplicationReviewStore = defineStore(
  "companyApplicationReview",
  () => {
    const reviewRound = ref<ReviewRound>({
      status: "reviewing",
      summary: "",
    });

    const reviewEntries = ref<ReviewEntriesState>({
      company: createCompanyData(),
      responsiblePerson: createPersonData(),
      contactPerson: createPersonData(),
      representative: createPersonData(),
      shareholders: [],
    });

    const getAllEntries = (): ReviewEntry[] => {
      const entries: ReviewEntry[] = [];
      
      // Company entries
      entries.push(...Object.values(reviewEntries.value.company));
      
      // Person entries
      entries.push(...Object.values(reviewEntries.value.responsiblePerson));
      entries.push(...Object.values(reviewEntries.value.contactPerson));
      entries.push(...Object.values(reviewEntries.value.representative));
      
      // Shareholder entries
      reviewEntries.value.shareholders.forEach(shareholder => {
        entries.push(...Object.values(shareholder));
      });
      
      return entries;
    };

    const entriesWithIssues = computed(() => {
      return filterEntriesByStates(getAllEntries(), ["hasIssue", "issueResolved"]);
    });

    const entriesUnderReview = computed(() => {
      return filterEntriesByState(getAllEntries(), "reviewing");
    });

    const getEntry = (path: FieldPath): ReviewEntry | undefined => {
      const parsed = parseFieldPath(path);
      
      if (parsed.type === 'company') {
        return reviewEntries.value.company[parsed.field];
      }
      
      if (parsed.type === 'shareholder') {
        const shareholder = reviewEntries.value.shareholders[parsed.index];
        return shareholder?.[parsed.field];
      }
      
      return reviewEntries.value[parsed.type][parsed.field];
    };

    const setEntry = (path: FieldPath, value: ReviewEntry): void => {
      const parsed = parseFieldPath(path);
      
      if (parsed.type === 'company') {
        reviewEntries.value.company[parsed.field] = value;
        return;
      }
      
      if (parsed.type === 'shareholder') {
        const shareholder = reviewEntries.value.shareholders[parsed.index];
        if (shareholder) {
          shareholder[parsed.field] = value;
        }
        return;
      }
      
      reviewEntries.value[parsed.type][parsed.field] = value;
    };

    const editEntry = (
      fieldPath: FieldPath,
      value: string | string[]
    ) => {
      const currentEntry = getEntry(fieldPath);
      if (!currentEntry) return;

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

      getEntry,
      setEntry,
      editEntry,
    };
  }
);
