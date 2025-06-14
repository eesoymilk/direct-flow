<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-primary mb-6">減資登記</h1>

      <div class="bg-warning-50 border border-warning-200 rounded-lg p-6 mb-8">
        <div class="flex items-start gap-3">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="text-warning-500 mt-1"
          />
          <div>
            <h2 class="text-lg font-semibold text-warning-700 mb-2">
              重要提醒
            </h2>
            <p class="text-warning-600">
              減資可能影響公司信用及營運，請謹慎評估減資的必要性及影響。
            </p>
          </div>
        </div>
      </div>

      <div class="bg-surface rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">減資流程</h2>
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
                召開股東會並通過減資決議，記錄減資金額、方式及股東減資比例。
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
              <h3 class="font-medium">債權人通知</h3>
              <p class="text-text-secondary mt-1">
                通知債權人並公告減資事宜，給予債權人提出異議的機會。
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
              <h3 class="font-medium">修改公司章程</h3>
              <p class="text-text-secondary mt-1">
                修改公司章程中關於資本額的條款。
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
              <h3 class="font-medium">辦理減資登記</h3>
              <p class="text-text-secondary mt-1">
                向主管機關申請辦理減資變更登記。
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
            <span>債權人通知證明</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-document-text" class="text-primary mt-1" />
            <span>減資後資產負債表</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-document-text" class="text-primary mt-1" />
            <span>公司變更登記申請書</span>
          </li>
        </ul>
      </div>

      <div class="text-center">
        <UButton color="primary" size="lg" to="/company/modification">
          開始減資流程
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
