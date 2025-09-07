import type * as z from "zod";
import { CalendarDate } from "@internationalized/date";
// import { shallowRef } from "vue"; // Removed unused import
import { createInitialForm, createEmptyShareholder } from "~/utils/formHelpers";
import {
  generateMockFormData,
  generateOrgTypeTestData,
} from "~/utils/mockData";
import { getDefaultBirthDate } from "~/utils/dateHelpers";

export const useCompanyApplicationStore = defineStore(
  "companyApplication",
  () => {
    const toast = useToast();
    const { hydrateFormDates, validateFormDates } = useFormHydration();
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
      () => form.value.organizationType === "corporation"
    );

    const addShareholder = () => {
      const newShareholder = createEmptyShareholder();
      // Ensure date is properly set on client side
      if (import.meta.client && !newShareholder.dateOfBirth) {
        newShareholder.dateOfBirth = getDefaultBirthDate();
      }
      form.value.shareholders.push(newShareholder);
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
        telephone: "", // Don't copy contact info to shareholders
        cellphone: "", // Don't copy contact info to shareholders
        email: "", // Don't copy contact info to shareholders
        dateOfBirth: sourcePerson.dateOfBirth || new CalendarDate(2000, 1, 1), // Default to reasonable date if not provided
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
        if (newVal === "corporation") {
          form.value.isCloselyHeld = false;
          form.value.hasParValueFreeShares = false;
        }
      },
      { immediate: true }
    );

    // Removed watch for ordinaryShares and preferredShares as they're now calculated from share holdings

    // Hydrate form dates on client side after store initialization
    if (import.meta.client) {
      nextTick(() => {
        hydrateFormDates(form.value);
      });
    }

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
