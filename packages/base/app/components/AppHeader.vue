<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 ease-in-out"
    :class="[
      isScrolled
        ? 'py-3 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50'
        : 'bg-transparent',
      isHeaderVisible ? 'translate-y-0' : '-translate-y-full',
    ]"
  >
    <UContainer class="flex items-center justify-between h-16 w-full">
      <!-- Left side - Logo and Brand -->
      <NuxtLink to="/" class="flex items-center gap-3 group flex-shrink-0">
        <Icon
          name="i-lucide-briefcase-business"
          class="size-10 flex-shrink-0 text-primary"
        />
        <div class="flex flex-col flex-shrink-0">
          <span
            class="font-bold text-xl transition-colors duration-300 whitespace-nowrap"
            :class="isScrolled ? 'text-primary-400' : 'text-primary-800'"
          >
            DIRECT FLOW
          </span>
          <span
            class="text-xs transition-colors duration-300 whitespace-nowrap"
            :class="isScrolled ? 'text-primary-400' : 'text-primary-800'"
          >
            {{ firmName }}數位平台
          </span>
        </div>
      </NuxtLink>

      <!-- Right side - Hamburger Menu -->
      <UDropdownMenu
        arrow
        :items="menuItems"
        :content="{
          align: 'end',
        }"
      >
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-menu"
          size="lg"
          class="transition-colors cursor-pointer duration-300 text-primary-800 hover:text-primary-600focus:outline-none focus:ring-0"
        />
      </UDropdownMenu>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

// Props
interface Props {
  navigationItems?: NavigationMenuItem[];
}

const props = withDefaults(defineProps<Props>(), {
  navigationItems: () => [],
});

const { loggedIn, clear } = useUserSession();

const firmName = "會計師事務所";

// Create menu items for dropdown
const menuItems = computed(() => {
  const items: DropdownMenuItem[] = [
    // Navigation items
    ...props.navigationItems.map((item: NavigationMenuItem) => ({
      label: item.label,
      icon: item.icon,
      onSelect: () => navigateTo(item.to),
    })),
  ];

  // Add separator if there are navigation items
  if (props.navigationItems.length > 0) {
    items.push({ type: "separator" as const });
  }

  // Auth items
  if (!loggedIn.value) {
    items.push({
      label: "登入",
      icon: "i-heroicons-user",
      onSelect: () => navigateTo("/api/auth/auth0", { external: true }),
    });
  } else {
    items.push({
      label: "登出",
      icon: "i-heroicons-arrow-right-on-rectangle",
      onSelect: clear,
    });
  }

  return items satisfies DropdownMenuItem[];
});

// Scroll detection using VueUse
const { y: scrollY } = useScroll(window);
const isScrolled = computed(() => scrollY.value > 50);
const isHeaderVisible = ref(true);
const lastScrollY = ref(0);

// Header visibility logic - hide on scroll down, show on scroll up
watch(scrollY, (newY) => {
  const scrollDelta = newY - lastScrollY.value;

  if (Math.abs(scrollDelta) > 5) {
    // Only trigger if scroll is significant
    if (scrollDelta > 0 && newY > 100) {
      // Scrolling down and past hero section
      isHeaderVisible.value = false;
    } else if (scrollDelta < 0) {
      // Scrolling up
      isHeaderVisible.value = true;
    }
  }

  lastScrollY.value = newY;
});
</script>
