export default defineOAuthAuth0EventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, { user });
    return sendRedirect(event, "/");
  },
});
