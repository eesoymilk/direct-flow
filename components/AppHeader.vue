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
          <div class="flex items-center gap-4">
            <template v-if="!isLoggedIn">
              <NuxtLink
                to="/login"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-button-primary hover:bg-button-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                登入
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-text bg-button-secondary hover:bg-button-secondary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                註冊
              </NuxtLink>
            </template>
            <template v-else>
              <UDropdownMenu
                :items="userMenuItems"
                :popper="{ placement: 'bottom-end' }"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  class="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span class="hidden md:inline">個人中心</span>
                </UButton>
              </UDropdownMenu>
            </template>
          </div>

          <!-- Role Indicator -->
          <div
            class="hidden md:flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            :class="
              isClient
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            "
          >
            <UIcon
              :name="isClient ? 'i-heroicons-user' : 'i-heroicons-briefcase'"
              class="h-3 w-3"
            />
            <span>{{ isClient ? "Client" : "CPA" }}</span>
          </div>

          <!-- Debug Dropdown -->
          <DebugDropdown />

          <!-- Mobile menu button -->
          <button
            class="md:hidden p-2 rounded-md text-text-secondary hover:text-text hover:bg-button-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <span class="sr-only">開啟選單</span>
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="lg:hidden">
      <div class="fixed inset-0 z-50">
        <div
          class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-surface px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border"
        >
          <div class="flex items-center justify-between">
            <NuxtLink to="/" class="-m-1.5 p-1.5">
              <span class="sr-only">{{ firmName }}</span>
              <!-- Logo SVG -->
            </NuxtLink>
            <button
              type="button"
              class="-m-2.5 rounded-md p-2.5 text-primary"
              @click="isMobileMenuOpen = false"
            >
              <span class="sr-only">關閉選單</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-border">
              <div class="space-y-2 py-6">
                <UNavigationMenu :items="navigation" orientation="vertical" />
              </div>
              <div class="py-6">
                <template v-if="!isLoggedIn">
                  <UButton
                    color="primary"
                    variant="solid"
                    class="w-full"
                    to="/login"
                  >
                    登入
                  </UButton>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    class="mt-2 w-full"
                    to="/register"
                  >
                    註冊
                  </UButton>
                </template>
                <template v-else>
                  <UDropdownMenu
                    :items="userMenuItems"
                    :popper="{ placement: 'bottom-end' }"
                    class="w-full"
                  >
                    <UButton color="neutral" variant="ghost" class="w-full">
                      <div class="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>個人中心</span>
                      </div>
                    </UButton>
                  </UDropdownMenu>
                </template>
              </div>
            </div>
          </div>

          <!-- Debug Controls in Mobile Menu -->
          <DebugMobileControls />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";
import LogoSvg from "./LogoSvg.vue";
import { useUserRole } from "~/composables/useUserRole";

const isLoggedIn = ref(false);
const isMobileMenuOpen = ref(false);

const firmName = "某某會計師事務所";

const { isClient } = useUserRole();

const navigation = computed<NavigationMenuItem[]>(() => [
  {
    label: "儀表板",
    icon: "i-heroicons-home",
    to: isClient.value ? "/client" : "/cpa",
  },
  isClient.value
    ? {
        label: "案件總覽",
        icon: "i-heroicons-folder",
        to: "/client/cases",
      }
    : {
        label: "公司管理",
        icon: "i-heroicons-building-office",
        to: "/cpa/company",
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
