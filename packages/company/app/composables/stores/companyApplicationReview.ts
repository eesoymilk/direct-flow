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

    const allEntries = computed((): ReviewEntry[] => {
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
    });

    const entriesWithIssues = computed(() => {
      return filterEntriesByStates(allEntries.value, ["hasIssue", "issueResolved"]);
    });

    const entriesUnderReview = computed(() => {
      return filterEntriesByState(allEntries.value, "reviewing");
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

    // Validation helpers
    const validateReviewCompletion = () => {
      const reviewingEntries = allEntries.value.filter(entry => entry.state === "reviewing");
      
      return {
        isComplete: reviewingEntries.length === 0,
        pendingCount: reviewingEntries.length,
        pendingEntries: reviewingEntries,
      };
    };

    const collectReviewData = () => {
      const issues: Array<{
        fieldPath: string;
        issueType: "missing" | "invalid" | "clarification" | "modification";
        severity: "low" | "medium" | "high" | "critical";
        description?: string;
      }> = [];
      
      const verifications: Array<{
        fieldPath: string;
        note?: string;
      }> = [];

      // Collect issues and verifications from all entries
      const processEntries = (entries: Record<string, ReviewEntry>, prefix: string) => {
        Object.entries(entries).forEach(([field, entry]) => {
          const fieldPath = `${prefix}.${field}`;
          
          if (entry.state === "hasIssue" && entry.issue) {
            issues.push({
              fieldPath,
              issueType: entry.issue.issueType,
              severity: entry.issue.severity,
              description: entry.issue.description,
            });
          } else if (entry.state === "verified") {
            verifications.push({
              fieldPath,
              note: `已驗證: ${entry.label}`,
            });
          }
        });
      };

      // Process company entries
      processEntries(reviewEntries.value.company, "company");
      
      // Process person entries
      processEntries(reviewEntries.value.responsiblePerson, "responsiblePerson");
      processEntries(reviewEntries.value.contactPerson, "contactPerson");
      processEntries(reviewEntries.value.representative, "representative");
      
      // Process shareholder entries
      reviewEntries.value.shareholders.forEach((shareholder, index) => {
        processEntries(shareholder, `shareholders.${index}`);
      });

      return { issues, verifications };
    };

    // Submission methods
    const submitReviewRound = async (
      applicationId: string,
      status: "approved" | "rejected" | "filing"
    ) => {
      const validation = validateReviewCompletion();
      
      if (!validation.isComplete && status !== "filing") {
        throw new Error(`Cannot ${status} application: ${validation.pendingCount} entries still under review`);
      }

      const { issues, verifications } = collectReviewData();

      const payload = {
        status,
        summary: reviewRound.value.summary,
        issues,
        verifications,
      };

      const { data } = await $fetch(`/api/applications/${applicationId}/review-rounds`, {
        method: "POST",
        body: payload,
      });

      return data;
    };

    const resetReviewState = () => {
      reviewEntries.value = {
        company: createCompanyData(),
        responsiblePerson: createPersonData(),
        contactPerson: createPersonData(),
        representative: createPersonData(),
        shareholders: [],
      };
      
      reviewRound.value = {
        status: "reviewing",
        summary: "",
      };
    };

    // Helper function to initialize shareholder entries
    const initializeShareholderEntries = (shareholderData: any[]) => {
      reviewEntries.value.shareholders = shareholderData.map(() => createPersonData());
    };

    return {
      reviewRound,
      reviewEntries,
      allEntries,
      entriesWithIssues,
      entriesUnderReview,

      getEntry,
      setEntry,
      editEntry,
      validateReviewCompletion,
      collectReviewData,
      submitReviewRound,
      resetReviewState,
      initializeShareholderEntries,
    };
  }
);
