import { useUserRole } from "~/composables/useUserRole";

export default defineNuxtRouteMiddleware((to) => {
  const { isClient } = useUserRole();

  if (!isClient.value) {
    return navigateTo("/company/cpa");
  }
});
