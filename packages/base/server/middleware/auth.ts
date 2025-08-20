export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  console.log("session", session);
  if (session?.user) {
    event.context.auth = session.user;
  }
});
