export default defineNuxtRouteMiddleware(() => {
  const applicationStore = useCompanyApplicationStore();
  
  // Validate the entire form using the schema
  const validation = companyApplicationFormSchema.safeParse(applicationStore.formState);
  
  if (!validation.success) {
    const toast = useToast();
    const errorMessages = validation.error.issues
      .slice(0, 3) // Limit to first 3 errors to avoid overwhelming the user
      .map(issue => issue.message);
    
    toast.add({
      title: "表單資料不完整",
      description: `請完成表單填寫：${errorMessages.join("、")}`,
      color: "warning", 
      icon: "i-lucide-alert-triangle",
    });
    
    return navigateTo("/apply");
  }
});