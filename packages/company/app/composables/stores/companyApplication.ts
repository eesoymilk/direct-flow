import * as z from "zod";
import { createInitialForm, createEmptyPerson } from "~/utils/formHelpers";
import { generateMockFormData } from "~/utils/mockData";

export const useCompanyApplicationStore = defineStore(
  "companyApplication",
  () => {
    const form = ref<
      Partial<z.output<typeof formSchema>> & {
        responsiblePerson: z.output<typeof personSchema>;
        director: z.output<typeof personSchema>;
        contactPerson: z.output<typeof personSchema>;
        shareholders: z.output<typeof personSchema>[];
        // documents: z.output<typeof documentSchema>[];
      }
    >(createInitialForm());

    function addShareholder() {
      form.value.shareholders.push(createEmptyPerson());
    }

    function removeShareholder(index: number) {
      form.value.shareholders.splice(index, 1);
    }

    function resetForm() {
      form.value = createInitialForm();
    }

    // Populate form with mock data for testing
    function populateWithMockData() {
      const mockData = generateMockFormData();
      Object.assign(form.value, mockData);
    }

    return {
      formSchema,
      documentSchema,
      personSchema,
      form,

      addShareholder,
      removeShareholder,
      resetForm,
      populateWithMockData,
    };
  }
);
