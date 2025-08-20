export default defineNuxtRouteMiddleware(async (to, from) => {
  const session = await getUserSession(to.path);
  if (session?.user) {
    return navigateTo(from.path);
  }
});
