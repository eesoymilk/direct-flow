import { useStorage } from "@vueuse/core";

export type UserRole = "staff" | "client";

export type DebugMode = {
  role: UserRole;
};

export const useUserRole = () => {
  const debugMode = useStorage<DebugMode>("debug-mode", {
    role: "staff",
  });

  const currentRole = computed(() => debugMode.value.role);
  const isStaff = computed(() => currentRole.value === "staff");
  const isClient = computed(() => !isStaff.value);

  const switchToStaff = () => (debugMode.value.role = "staff");
  const switchToClient = () => (debugMode.value.role = "client");

  const toggleRole = (role?: UserRole) =>
    role
      ? (debugMode.value.role = role)
      : debugMode.value.role === "staff"
        ? switchToClient()
        : switchToStaff();

  return {
    debugMode: readonly(debugMode),
    currentRole,
    isStaff,
    isClient,

    switchToStaff,
    switchToClient,
    toggleRole,
  };
};
