<template>
  <CompanyApplicationReviewEntry
    v-for="entry in personEntryPaths"
    :key="entry.entryPath"
    :entry-path="entry.entryPath"
  >
    <FormedInput
      :initial-value="
        reviewStore.getEntry(entry.entryPath)?.value as string
      "
      :placeholder="entry.placeholder"
      @submit="(value) => reviewStore.editEntry(entry.entryPath, value)"
    />
  </CompanyApplicationReviewEntry>
</template>

<script setup lang="ts">
import type {
  PersonType,
  FieldPath,
} from "~/composables/stores/reviewEntry";

const props = defineProps<{
  personType: PersonType;
}>();

const reviewStore = useCompanyApplicationReviewStore();

const personLabel = computed(() => {
  switch (props.personType) {
    case "responsiblePerson":
      return "負責人";
    case "contactPerson":
      return "聯絡人";
    case "representative":
      return "代表人";
  }
});

const personEntryPaths = computed<
  {
    entryPath: FieldPath;
    placeholder: string;
  }[]
>(() => [
  {
    entryPath: `${props.personType}.name`,
    placeholder: `請輸入${personLabel.value}姓名`,
  },
  {
    entryPath: `${props.personType}.idNumber`,
    placeholder: `請輸入${personLabel.value}身分證號碼`,
  },
  {
    entryPath: `${props.personType}.address`,
    placeholder: `請輸入${personLabel.value}地址`,
  },
  {
    entryPath: `${props.personType}.telephone`,
    placeholder: `請輸入${personLabel.value}電話`,
  },
  {
    entryPath: `${props.personType}.cellphone`,
    placeholder: `請輸入${personLabel.value}手機`,
  },
  {
    entryPath: `${props.personType}.email`,
    placeholder: `請輸入${personLabel.value}電子郵件`,
  },
]);
</script>
