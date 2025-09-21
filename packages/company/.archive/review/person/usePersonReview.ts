export const usePersonReview = () => {
  const detailsStore = useCompanyApplicationDetailsStore();

  const { application } = storeToRefs(detailsStore);

  const responsiblePerson = computed(() => {
    if (!application.value?.responsiblePerson) {
      throw new Error("Responsible person not found");
    }
    return {
      name: application.value.responsiblePerson.name,
      idNumber: application.value.responsiblePerson.idNumber,
      address: application.value.responsiblePerson.address,
      cellphone: application.value.responsiblePerson.cellphone,
      email: application.value.responsiblePerson.email,
    };
  });

  const representative = computed(() => {
    if (!application.value?.representative) {
      throw new Error("Representative not found");
    }
    return {
      name: application.value.representative.name,
      idNumber: application.value.representative.idNumber,
      address: application.value.representative.address,
      cellphone: application.value.representative.cellphone,
      email: application.value.representative.email,
    };
  });

  const contactPerson = computed(() => {
    if (!application.value?.contactPerson) {
      throw new Error("Contact person not found");
    }
    return {
      name: application.value.contactPerson.name,
      idNumber: application.value.contactPerson.idNumber,
      address: application.value.contactPerson.address,
      cellphone: application.value.contactPerson.cellphone,
      email: application.value.contactPerson.email,
    };
  });

  return {
    // State
    responsiblePerson,
    representative,
    contactPerson,
  };
};
