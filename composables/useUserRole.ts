import { useUserRoleStore } from "~/stores/userRole";

export function useUserRole() {
  const store = useUserRoleStore();
  const isClient = computed(() => store.isClient);
  const isDebugMode = computed(() => store.isDebugMode);

  const toggleRole = () => {
    store.toggleRole();
  };

  const toggleDebugMode = () => {
    store.toggleDebugMode();
  };

  const getCompanyNavigation = computed(() => {
    if (isClient.value) {
      return [
        {
          label: "公司概覽",
          to: "/company/client",
          icon: "i-heroicons-building-office",
        },
        {
          label: "案件列表",
          to: "/company/client/cases",
          icon: "i-heroicons-folder",
        },
      ];
    } else {
      return [
        {
          label: "公司管理",
          to: "/company/cpa",
          icon: "i-heroicons-building-office",
        },
        {
          label: "案件管理",
          to: "/company/cpa/cases",
          icon: "i-heroicons-folder",
        },
      ];
    }
  });

  return {
    isClient,
    isDebugMode,
    toggleRole,
    toggleDebugMode,
    getCompanyNavigation,
  };
}
