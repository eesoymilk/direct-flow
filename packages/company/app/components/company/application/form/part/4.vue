<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-text mb-4">必要文件</h2>
    <UAccordion
      type="multiple"
      :unmount-on-hide="false"
      :items="accordionItems"
    >
      <template #company="{ item }">
        <div class="space-y-4 grid grid-cols-3 gap-4">
          <UForm
            v-for="(document, index) in applicationStore.form.documents"
            :key="index"
            :state="document"
            :schema="applicationStore.documentSchema"
            attach
          >
            <UFormField name="file">
              <UFileUpload
                v-model="document.file"
                :label="document.documentDescription"
                :interactive="!document.file"
                :dropzone="!document.file"
                description="請將檔案拖曳至此或點擊選擇檔案"
                layout="list"
                position="inside"
              >
                <template #files-top>
                  {{ document.documentDescription }}
                </template>
              </UFileUpload>
            </UFormField>
          </UForm>
        </div>
      </template>
      <!-- <template #shareholder="{ item }">
        <UFormField label="股東存摺正面">
          <UFileUpload label="股東存摺正面" />
        </UFormField>
      </template>
      <template #director="{ item }">
        <UFormField label="董監事存摺正面">
          <UFileUpload label="董監事存摺正面" />
        </UFormField>
      </template> -->
    </UAccordion>
    <!-- <UCollapsible :unmount-on-hide="false" class="w-full flex flex-col gap-2">
      <UButton
        label="公司相關文件"
        variant="subtle"
        trailing-icon="i-lucide-chevron-down"
        block
      />

      <template #content>
        <UFormField label="公司存摺正面">
          <UFileUpload label="公司存摺正面" />
        </UFormField>
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
    </UCollapsible> -->
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";

const applicationStore = useCompanyApplicationStore();

const accordionItems = ref<AccordionItem[]>([
  {
    slot: "company",
    label: "公司相關文件",
    content: "公司相關文件",
  },
  {
    slot: "shareholder",
    label: "股東相關文件",
    content: "股東相關文件",
  },
  {
    slot: "director",
    label: "董監事相關文件",
    content: "董監事相關文件",
  },
  {
    label: "其他文件",
    content: "其他文件",
  },
]);
</script>
