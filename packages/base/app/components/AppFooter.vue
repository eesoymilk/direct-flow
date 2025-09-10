<template>
  <footer class="relative">
    <!-- Modern Separator -->
    <div
      class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
    />

    <UContainer class="py-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <!-- Brand -->
        <div class="flex items-center gap-3">
          <Icon name="i-lucide-laptop" class="size-5 text-primary-300" />
          <div class="flex flex-col">
            <span class="text-gray-900 font-thin text-sm"
              >欣大資訊股份有限公司</span
            >
          </div>
        </div>

        <!-- Links -->
        <div class="flex items-center gap-6">
          <NuxtLink
            to="/"
            class="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-300"
          >
            聯絡我們
          </NuxtLink>
          <NuxtLink
            to="/"
            class="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-300"
          >
            隱私權政策
          </NuxtLink>
          <NuxtLink
            to="/"
            class="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-300"
          >
            使用條款
          </NuxtLink>
        </div>

        <!-- Copyright -->
        <p class="text-gray-500 font-thin text-sm">
          © {{ new Date().getFullYear() }} 得睿會計師事務所
        </p>
      </div>
    </UContainer>
  </footer>
</template>
