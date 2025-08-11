import { useUserRole } from "~/composables/userRole";

export default defineNuxtRouteMiddleware((to) => {
  const { isClient } = useUserRole();

  if (isClient.value) {
    return navigateTo("/company/client");
  }
});
