<template>
  <header class="py-5" :class="loggedIn ? 'bg-blue-300' : 'bg-surface'">
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
          <slot name="right-side" />

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
            <UButton label="登出" external @click="clear" />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import LogoSvg from "./LogoSvg.vue";

const { loggedIn, user, clear } = useUserSession();
const isMobileMenuOpen = ref(false);

const firmName = "會計師事務所";

onMounted(() => {
  document.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest(".relative")) {
      isMobileMenuOpen.value = false;
    }
  });
});
</script>
