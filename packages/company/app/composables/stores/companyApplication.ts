export const useCompanyApplicationStore = defineStore(
  "companyApplication",
  () => {
    const toast = useToast();
    const formState = ref<
      Partial<CompanyApplicationFormSchema> & {
        responsiblePerson: Partial<PersonSchema>;
        representative: Partial<PersonSchema>;
        contactPerson: Partial<PersonSchema>;
        shareholders: ShareholderSchema[];
      }
    >({
      responsiblePerson: {},
      representative: {},
      contactPerson: {},
      shareholders: [],
    });

    const submissionState = ref<{
      justSubmitted: boolean;
      applicationId?: string;
      submissionTime?: string;
    }>({
      justSubmitted: false,
    });

    const isStockCompany = computed(
      () => formState.value.organizationType === "corporation"
    );

    const addShareholder = () => {
      const newShareholder = createEmptyShareholder();
      formState.value.shareholders.push(newShareholder);
    };

    const addPersonAsShareholder = (
      personType: "responsiblePerson" | "representative" | "contactPerson"
    ) => {
      let sourcePerson;
      if (personType === "responsiblePerson") {
        sourcePerson = formState.value.responsiblePerson;
      } else if (personType === "representative") {
        sourcePerson = formState.value.representative;
      } else {
        sourcePerson = formState.value.contactPerson;
      }

      const existingShareholder = formState.value.shareholders.find(
        (s) => s.referenceType === personType
      );
      if (existingShareholder) {
        toast.add({
          title: "此人員已是股東",
          description: `${sourcePerson.name} 已在股東列表中`,
          color: "warning",
          icon: "i-lucide-alert-triangle",
        });
        return;
      }

      // Create readonly shareholder with reference
      const newShareholder = {
        ...sourcePerson,
        dateOfBirth: sourcePerson.dateOfBirth || new Date(),
        isReadonly: true,
        referenceType: personType,
      };

      formState.value.shareholders.push(newShareholder as ShareholderSchema);

      toast.add({
        title: "股東已加入",
        description: `已將${getPersonLabel(personType)} ${sourcePerson.name} 加入為股東（僅可編輯持股數）`,
        color: "success",
        icon: "i-lucide-user-check",
      });
    };

    const removeShareholder = (index: number) => {
      formState.value.shareholders.splice(index, 1);
    };

    const resetForm = () => {
      formState.value = createInitialForm();
      submissionState.value = { justSubmitted: false };
    };

    const markSubmissionSuccess = (
      applicationId: string,
      submissionTime: string
    ) => {
      submissionState.value = {
        justSubmitted: true,
        applicationId,
        submissionTime,
      };
    };

    const markSuccessViewed = () => {
      submissionState.value.justSubmitted = false;
    };

    const populateWithMockData = () => {
      const mockData = generateMockFormData();
      Object.assign(formState.value, mockData);
    };

    const populateWithOrgTypeTestData = () => {
      const mockData = generateOrgTypeTestData();
      Object.assign(formState   .value, mockData);
    };

    watch(
      () => formState.value.organizationType,
      (newVal) => {
        if (newVal === "corporation") {
          formState.value.isCloselyHeld = false;
          formState.value.hasParValueFreeShares = false;
        }
      },
      { immediate: true }
    );

    return {
      formState,
      submissionState: readonly(submissionState),
      isStockCompany,
      addShareholder,
      addPersonAsShareholder,
      removeShareholder,
      resetForm,
      markSubmissionSuccess,
      markSuccessViewed,
      populateWithMockData,
      populateWithOrgTypeTestData,
    };
  }
);
