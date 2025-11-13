<template>
  <UCollapsible :ui="{ content: 'overflow-visible' }">
    <UButton
      class="group p-2 md:p-4 bg-primary-50 border-primary-200"
      variant="subtle"
      trailing-icon="i-lucide-chevron-down"
      :ui="{
        trailingIcon:
          'group-data-[state=open]:rotate-180 transition-transform duration-200',
      }"
      block
    >
      <template #leading>
        <div class="flex items-center gap-2 md:gap-4">
          <UIcon name="i-lucide-building-2" size="20" />
          <div class="flex flex-col items-start">
            <span>基本資料</span>
            <span class="text-xs text-gray-500">
              填寫受查者基本資料
            </span>
          </div>
        </div>
      </template>
    </UButton>
    <template #content>
      <UCard class="mt-2 md:mt-4">
        <UForm
          class="grid grid-cols-2 md:grid-cols-6 gap-4"
          :state="basicInfo"
        >
          <UFormField
            label="受查者名稱"
            name="entityName"
            class="col-span-full"
            required
          >
            <UInput
              v-model="basicInfo.entityName"
              placeholder="請輸入受查者名稱"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="適用會計架構"
            name="accountingFramework"
            class="col-span-full"
            required
          >
            <USelect
              v-model="basicInfo.accountingFramework"
              :items="frameworkItems"
              placeholder="選擇適用的會計架構"
              class="w-full"
            />
          </UFormField>

          <UFormField
            name="isComparativeReport"
            :class="
              basicInfo.accountingFramework ===
              'businessAccountingGuidelines'
                ? 'col-span-2'
                : 'col-span-4'
            "
          >
            <UCheckbox
              v-model="basicInfo.isComparativeReport"
              label="包含比較年份"
            />
          </UFormField>

          <UFormField
            name="isConsolidatedReport"
            :class="
              basicInfo.accountingFramework ===
              'businessAccountingGuidelines'
                ? 'col-span-2'
                : 'col-span-4'
            "
          >
            <UCheckbox
              v-model="basicInfo.isConsolidatedReport"
              label="合併財報"
            />
          </UFormField>

          <UFormField
            name="useEquityMethodInvestment"
            :class="
              basicInfo.accountingFramework ===
              'businessAccountingGuidelines'
                ? 'col-span-2'
                : 'col-span-4'
            "
          >
            <UCheckbox
              v-model="basicInfo.useEquityMethodInvestment"
              label="使用權益法投資"
            />
          </UFormField>

          <UFormField
            v-if="basicInfo.accountingFramework === 'IFRS'"
            name="includeEmphasisOfMatterSection"
            class="col-span-3"
          >
            <UCheckbox
              v-model="includeEmphasisOfMatterSection"
              label="包含強調事項段"
            />
          </UFormField>

          <UFormField
            label="當期年份"
            name="periodEnd"
            required
            class="col-span-full"
          >
            <div class="gap-2 md:gap-4 flex justify-between items-center">
              <span>民國</span>
              <UInputNumber
                v-model="basicInfo.currentRocYear"
                class="flex-1"
              />
              <span>年</span>
            </div>
          </UFormField>

          <UFormField
            label="會計師事務所"
            name="firmName"
            class="col-span-full"
            required
          >
            <UInput
              v-model="basicInfo.firmName"
              placeholder="請輸入會計師事務所名稱"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="會計師事務所地址"
            name="firmAddress"
            class="col-span-full"
          >
            <UInput
              v-model="basicInfo.firmAddress"
              placeholder="請輸入會計師事務所地址（選填）"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="
              basicInfo.accountingFramework === 'IFRS'
                ? '會計師姓名（一）'
                : '會計師姓名'
            "
            name="auditorNames.0"
            class="col-span-full"
            required
          >
            <UInput
              v-model="basicInfo.auditorNames![0]"
              placeholder="請輸入會計師姓名"
              class="w-full"
            />
          </UFormField>

          <UFormField
            v-if="basicInfo.accountingFramework === 'IFRS'"
            label="會計師姓名（二）"
            name="auditorNames.1"
            class="col-span-full"
            required
          >
            <UInput
              v-model="basicInfo.auditorNames![1]"
              placeholder="請輸入第二位會計師姓名"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="報告日期"
            name="reportDate"
            class="col-span-full"
            required
          >
            <DatePicker
              v-model="basicInfo.reportDate"
              placeholder="請選擇報告日期"
              class="w-full h-8"
            />
          </UFormField>
        </UForm>
      </UCard>
    </template>
  </UCollapsible>
</template>

<script setup lang="ts">
const store = useOpinionBuilderStore();
const { basicInfo, includeEmphasisOfMatterSection } = storeToRefs(store);
const { frameworkItems } = useFormConfiguration();
</script>
