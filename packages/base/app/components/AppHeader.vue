<template>
  <header class="border-b border-border bg-surface">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Left side - Logo and Brand -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <LogoSvg />
          <div class="flex flex-col">
            <span class="font-bold text-xl text-text">DIRECT FLOW</span>
            <span class="text-sm text-text-secondary"
              >{{ firmName }}數位平台</span
            >
          </div>
        </NuxtLink>

        <!-- Right side - Navigation and Auth -->
        <div class="flex items-center gap-4">
          <div class="hidden lg:flex lg:gap-x-12">
            <UNavigationMenu :items="navigation" />
          </div>

          <!-- Auth Buttons -->
          <UButton
            v-if="!loggedIn"
            to="/api/auth/auth0"
            label="登入"
            icon="i-heroicons-user"
            external
          />
          <div v-if="loggedIn">
            {{ user?.name }}
            <UButton to="/api/auth/logout" label="登出" external />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";
import LogoSvg from "./LogoSvg.vue";

const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();
const isMobileMenuOpen = ref(false);

const firmName = "會計師事務所";

const navigation = computed<NavigationMenuItem[]>(() => [
  {
    label: "儀表板",
    icon: "i-heroicons-home",
    to: "/dashboard",
  },
  {
    label: "案件總覽",
    icon: "i-heroicons-folder",
    to: "/cases",
  },
  {
    label: "個人資料",
    icon: "i-heroicons-user",
    to: "/profile",
  },
]);

const userMenuItems = computed<DropdownMenuItem[]>(() => [
  {
    label: "個人資料",
    icon: "i-heroicons-user",
    to: "/profile",
  },
]);

onMounted(() => {
  document.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest(".relative")) {
      isMobileMenuOpen.value = false;
    }
  });
});
</script>
