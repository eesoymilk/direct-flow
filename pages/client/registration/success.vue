<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto text-center">
      <div class="mb-8">
        <UIcon
          name="i-heroicons-check-circle"
          class="size-16 text-success mx-auto"
        />
      </div>

      <h1 class="text-3xl font-bold text-primary mb-4">
        公司設立登記申請已送出
      </h1>

      <p class="text-text-secondary mb-8">
        我們已收到您的公司設立登記申請。我們將在 1-2
        個工作天內審核您的資料，並透過電子郵件通知您審核結果。
      </p>

      <div class="space-y-4">
        <UButton color="primary" to="/dashboard"> 前往儀表板 </UButton>

        <UButton color="neutral" variant="ghost" to="/registration">
          返回登記服務
        </UButton>
      </div>

      <div class="mt-12 p-6 bg-surface rounded-lg">
        <h2 class="text-lg font-semibold text-text mb-4">後續步驟</h2>
        <ul class="space-y-3 text-left">
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-document-text" class="text-primary mt-1" />
            <span class="text-text-secondary">
              準備公司設立登記所需文件：
              <ul class="mt-2 ml-6 list-disc space-y-1">
                <li>公司設立登記表</li>
                <li>公司章程</li>
                <li>股東同意書</li>
                <li>公司代表人及董事身分證明文件</li>
                <li>公司所在地建物所有權狀或租賃契約</li>
              </ul>
            </span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-envelope" class="text-primary mt-1" />
            <span class="text-text-secondary">
              等待審核結果通知，我們將透過您提供的電子郵件地址通知審核結果
            </span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-phone" class="text-primary mt-1" />
            <span class="text-text-secondary">
              如有任何問題，請聯繫我們的客服專線：02-2345-6789
            </span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="i-heroicons-clock" class="text-primary mt-1" />
            <span class="text-text-secondary">
              審核通過後，我們將協助您完成公司設立登記的最後步驟
            </span>
          </li>
        </ul>
      </div>

      <div class="mt-8 text-sm text-text-secondary">
        <p>注意事項：</p>
        <ul class="mt-2 ml-6 list-disc space-y-1">
          <li>請確保您提供的所有資料均為真實且正確</li>
          <li>審核期間如有任何資料需要補充，我們將主動與您聯繫</li>
          <li>您可以在儀表板中查看申請進度</li>
        </ul>
      </div>
    </div>
  </div>
</template>
