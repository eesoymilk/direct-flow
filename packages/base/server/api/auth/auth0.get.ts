export default defineOAuthAuth0EventHandler({
  config: {
    scope: ["openid", "profile", "email"],
  },
  async onSuccess(event, { user }) {
    await setUserSession(event, { user });
    return sendRedirect(event, "/");
  },
});
