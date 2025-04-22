<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-primary mb-6">同縣市地址變更</h1>

      <div class="bg-surface rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">變更流程</h2>
        <div class="space-y-6">
          <div class="flex items-start gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold"
            >
              1
            </div>
            <div>
              <h3 class="font-medium">股東會決議</h3>
              <p class="text-text-secondary mt-1">
                召開股東會並通過地址變更決議。
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold"
            >
              2
            </div>
            <div>
              <h3 class="font-medium">修改公司章程</h3>
              <p class="text-text-secondary mt-1">
                修改公司章程中關於公司地址的條款。
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold"
            >
              3
            </div>
            <div>
              <h3 class="font-medium">辦理變更登記</h3>
              <p class="text-text-secondary mt-1">
                向主管機關申請辦理地址變更登記。
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold"
            >
              4
            </div>
            <div>
              <h3 class="font-medium">更新相關證照</h3>
              <p class="text-text-secondary mt-1">
                更新營業登記證、統一發票購買證等相關證照。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-surface rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">所需文件</h2>
        <ul class="space-y-3">
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-document-text" class="text-primary mt-1" />
            <span>股東會決議錄</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-document-text" class="text-primary mt-1" />
            <span>公司章程修正案</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-document-text" class="text-primary mt-1" />
            <span>新址房屋使用同意書</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-document-text" class="text-primary mt-1" />
            <span>新址建物所有權狀影本</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-document-text" class="text-primary mt-1" />
            <span>公司變更登記申請書</span>
          </li>
        </ul>
      </div>

      <div class="text-center">
        <UButton color="primary" size="lg" to="/company/modification">
          開始地址變更流程
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
