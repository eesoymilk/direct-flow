export default defineNuxtRouteMiddleware((to) => {
  // TODO: Implement actual auth check
  const isAuthenticated = false;

  if (isAuthenticated) {
    return navigateTo("/dashboard");
  }
});
