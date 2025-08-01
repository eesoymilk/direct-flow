import { defineStore } from "pinia";

interface UserRoleState {
  isClient: boolean;
  isDebugMode: boolean;
}

export const useUserRoleStore = defineStore("userRole", {
  state: (): UserRoleState => ({
    isClient: true,
    isDebugMode: false,
  }),
  getters: {
    isCPA: (state) => !state.isClient,
  },
  actions: {
    toggleRole() {
      this.isClient = !this.isClient;
    },
    toggleDebugMode() {
      this.isDebugMode = !this.isDebugMode;
    },
  },
});
