<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-text mb-4">必要文件</h2>
    <UCollapsible :unmount-on-hide="false" class="w-full flex flex-col gap-2">
      <UButton
        label="公司相關文件"
        variant="subtle"
        trailing-icon="i-lucide-chevron-down"
        block
      />

      <template #content>
        <UFileUpload label="公司存摺正面" />
        <UFileUpload label="公司存摺內頁" />
        <UFileUpload label="公司存摺戳章頁" />
        <UFileUpload label="餘額證明或次日的存入100元證明" />

        <UFileUpload label="房屋使用同意書" />
        <UFileUpload label="股東同意書" />
        <UFileUpload label="董監事願任同意書" />
        <UFileUpload label="自然人聲明書" />
        <UFileUpload label="法人聲明書" />
      </template>
    </UCollapsible>
  </div>
</template>

<script setup lang="ts">
const applicationStore = useCompanyApplicationStore();
</script>
