<template>
  <footer class="bg-surface border-t border-border">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-text-secondary">
          © {{ new Date().getFullYear() }} 得睿會計師事務所. All rights
          reserved.
        </p>
        <div class="flex gap-4 mt-4 md:mt-0">
          <NuxtLink
            to="/privacy"
            class="text-sm text-text-secondary hover:text-text"
          >
            隱私權政策
          </NuxtLink>
          <NuxtLink
            to="/terms"
            class="text-sm text-text-secondary hover:text-text"
          >
            使用條款
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
