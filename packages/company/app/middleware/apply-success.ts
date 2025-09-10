export default defineNuxtRouteMiddleware((to) => {
  const applicationStore = useCompanyApplicationStore();
  const route = useRoute();

  // Allow access if user just submitted (from store) OR if valid query params exist
  const hasValidAccess =
    applicationStore.submissionState.justSubmitted ||
    (route.query.id && route.query.submitted);

  if (!hasValidAccess) {
    const toast = useToast();
    toast.add({
      title: "無效存取",
      description: "請先提交申請表單",
      color: "warning",
      icon: "i-lucide-alert-triangle",
    });

    return navigateTo("/apply");
  }

  // Mark as viewed so subsequent direct access won't work (only if from store)
  if (applicationStore.submissionState.justSubmitted) {
    applicationStore.markSuccessViewed();
  }
});
