export default defineNuxtRouteMiddleware(() => {
  const applicationStore = useCompanyApplicationStore();
  const toast = useToast();

  console.log("[Middleware] Checking form state:", {
    candidateNames: applicationStore.formState.candidateNames,
    organizationType: applicationStore.formState.organizationType,
    businessItemsDescription:
      applicationStore.formState.businessItemsDescription,
    address: applicationStore.formState.address,
    responsiblePerson: applicationStore.formState.responsiblePerson?.name,
    contactPerson: applicationStore.formState.contactPerson?.name,
    partners: applicationStore.formState.partners?.length,
  });

  // Check basic required fields first
  if (!applicationStore.formState.candidateNames?.length) {
    toast.add({
      title: "表單資料不完整",
      description: "請填寫候選公司名稱",
      color: "warning",
      icon: "i-lucide-alert-triangle",
    });
    return navigateTo("/apply");
  }

  if (!applicationStore.formState.organizationType) {
    toast.add({
      title: "表單資料不完整",
      description: "請選擇組織類型",
      color: "warning",
      icon: "i-lucide-alert-triangle",
    });
    return navigateTo("/apply");
  }

  if (!applicationStore.formState.businessItemsDescription) {
    toast.add({
      title: "表單資料不完整",
      description: "請填寫營業項目描述",
      color: "warning",
      icon: "i-lucide-alert-triangle",
    });
    return navigateTo("/apply");
  }

  if (!applicationStore.formState.address) {
    toast.add({
      title: "表單資料不完整",
      description: "請填寫公司地址",
      color: "warning",
      icon: "i-lucide-alert-triangle",
    });
    return navigateTo("/apply");
  }

  // Check person data
  if (!applicationStore.formState.responsiblePerson?.name) {
    toast.add({
      title: "表單資料不完整",
      description: "請填寫負責人資料",
      color: "warning",
      icon: "i-lucide-alert-triangle",
    });
    return navigateTo("/apply");
  }

  if (!applicationStore.formState.contactPerson?.name) {
    toast.add({
      title: "表單資料不完整",
      description: "請填寫聯絡人資料",
      color: "warning",
      icon: "i-lucide-alert-triangle",
    });
    return navigateTo("/apply");
  }

  // Check managerial officer for sole proprietorship if enabled
  if (
    applicationStore.formState.organizationType === "sole_proprietorship" &&
    applicationStore.formState.hasManagerialOfficer &&
    !applicationStore.formState.isManagerialOfficerSameAsResponsiblePerson &&
    !applicationStore.formState.managerialOfficer?.name
  ) {
    toast.add({
      title: "表單資料不完整",
      description: "請填寫經理人資料",
      color: "warning",
      icon: "i-lucide-alert-triangle",
    });
    return navigateTo("/apply");
  }

  // Check organization-specific required fields
  if (applicationStore.formState.organizationType === "corporation") {
    if (
      !applicationStore.formState.hasParValueFreeShares &&
      !applicationStore.formState.parValue
    ) {
      toast.add({
        title: "表單資料不完整",
        description: "請填寫票面金額或選擇無票面金額股份",
        color: "warning",
        icon: "i-lucide-alert-triangle",
      });
      return navigateTo("/apply");
    }
  }

  // Check partners for corporations and limited companies
  if (
    (applicationStore.formState.organizationType === "corporation" ||
      applicationStore.formState.organizationType === "limited_company") &&
    !applicationStore.formState.partners?.length
  ) {
    toast.add({
      title: "表單資料不完整",
      description: "請添加至少一名股東",
      color: "warning",
      icon: "i-lucide-alert-triangle",
    });
    return navigateTo("/apply");
  }

  console.log("[Middleware] All checks passed!");
});
