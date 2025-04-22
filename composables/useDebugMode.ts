import { useUserRole } from "~/composables/useUserRole";

export const useDebugMode = () => {
  const { isClient, toggleRole } = useUserRole();

  // Debug menu items for the header
  const debugMenuItems = computed(() => [
    [
      {
        label: `Role: ${isClient.value ? "Client" : "CPA"}`,
        icon: "i-heroicons-user-circle",
        click: () => toggleRole(),
      },
    ],
  ]);

  return {
    debugMenuItems,
  };
};
