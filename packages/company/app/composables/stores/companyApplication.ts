import * as z from "zod";
import { createInitialForm, createEmptyShareholder } from "~/utils/formHelpers";
import {
  generateMockFormData,
  generateOrgTypeTestData,
} from "~/utils/mockData";

export const useCompanyApplicationStore = defineStore(
  "companyApplication",
  () => {
    const toast = useToast();
    const form = ref<
      Partial<z.output<typeof companyApplicationFormSchema>> & {
        responsiblePerson: z.output<typeof responsiblePersonSchema>;
        director: z.output<typeof directorSchema>;
        contactPerson: z.output<typeof contactPersonSchema>;
        shareholders: z.output<typeof shareholderSchema>[];
      }
    >(createInitialForm());

    const submissionState = ref<{
      justSubmitted: boolean;
      applicationId?: string;
      submissionTime?: string;
    }>({
      justSubmitted: false,
    });

    const isStockCompany = computed(
      () => form.value.organizationType === "company_limited"
    );

    const addShareholder = () => {
      form.value.shareholders.push(createEmptyShareholder());
    };

    const addPersonAsShareholder = (
      personType: "responsiblePerson" | "director" | "contactPerson"
    ) => {
      let sourcePerson: PersonSchema;
      if (personType === "responsiblePerson") {
        sourcePerson = form.value.responsiblePerson;
      } else if (personType === "director") {
        sourcePerson = form.value.director;
      } else {
        sourcePerson = form.value.contactPerson;
      }

      const existingShareholder = form.value.shareholders.find(
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
        name: sourcePerson.name,
        idNumber: sourcePerson.idNumber,
        address: sourcePerson.address,
        telephone: sourcePerson.telephone,
        cellphone: sourcePerson.cellphone,
        email: sourcePerson.email,
        shares: isStockCompany.value ? 0 : undefined,
        isReadonly: true,
        referenceType: personType,
      };

      form.value.shareholders.push(newShareholder);

      // Show success notification
      const personTypeLabels = {
        responsiblePerson: "負責人",
        contactPerson: "聯絡人",
        director: "董事",
      };

      toast.add({
        title: "股東已加入",
        description: `已將${personTypeLabels[personType]} ${sourcePerson.name} 加入為股東（僅可編輯持股數）`,
        color: "success",
        icon: "i-lucide-user-check",
      });
    };

    const removeShareholder = (index: number) => {
      form.value.shareholders.splice(index, 1);
    };

    const resetForm = () => {
      form.value = createInitialForm();
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
      Object.assign(form.value, mockData);
    };

    const populateWithOrgTypeTestData = () => {
      const mockData = generateOrgTypeTestData();
      Object.assign(form.value, mockData);
    };

    watch(
      () => form.value.organizationType,
      (newVal) => {
        if (newVal === "company_limited") {
          form.value.isCloselyHeld = false;
          form.value.hasParValueFreeShares = false;
        }
      },
      { immediate: true }
    );

    watch(
      [() => form.value.ordinaryShares, () => form.value.preferredShares],
      ([ordinaryShares, preferredShares]) => {
        form.value.authorizedShares =
          (ordinaryShares || 0) + (preferredShares || 0);
      },
      { immediate: true }
    );

    return {
      form,
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
