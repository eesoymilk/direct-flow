<template>
  <div v-if="loggedIn" class="flex justify-end col-span-full">
    <UButton
      icon="i-lucide-check"
      :label="`驗證所有${personLabel}資料`"
      color="success"
      variant="outline"
      size="sm"
      @click="verifyAllPersonEntries"
    />
  </div>
  <CompanyApplicationReviewEntry
    v-for="entry in personEntries"
    :key="entry.entryPath"
    :entry-path="entry.entryPath"
  >
    <FormedInput
      :disabled="!loggedIn && !entry.issue"
      :initial-value="entry.initialValue"
      :placeholder="entry.placeholder"
      @submit="
        (value) => reviewStore.editEntry(entry.entryPath, value, !loggedIn)
      "
    />
  </CompanyApplicationReviewEntry>
</template>

<script setup lang="ts">
import type { PersonType, FieldPath } from "~/composables/stores/reviewEntry";

const props = defineProps<{
  personType: PersonType;
}>();

const { loggedIn } = useUserSession();

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

const personEntryLabels = {
  name: "姓名",
  idNumber: "身分證號碼",
  address: "地址",
  telephone: "電話",
  cellphone: "手機",
  email: "電子郵件",
};

// TODO: add individual schema for each person entry
const personEntries = computed<
  {
    entryPath: FieldPath;
    initialValue: string;
    placeholder: string;
    issue?: ReviewIssue;
  }[]
>(() => {
  const entryPaths = [
    `${props.personType}.name`,
    `${props.personType}.idNumber`,
    `${props.personType}.address`,
    `${props.personType}.telephone`,
    `${props.personType}.cellphone`,
    `${props.personType}.email`,
  ] as const;

  return entryPaths.map((entryPath) => {
    const label =
      personEntryLabels[
        entryPath.split(".").pop() as keyof typeof personEntryLabels
      ];
    const entry = reviewStore.getEntry(entryPath);

    if (!entry) {
      throw new Error(`Entry ${entryPath} not found`);
    }

    if (entry.state === "hasIssue" && entry.issue) {
      return {
        entryPath,
        initialValue: entry.value as string,
        placeholder: `請輸入${personLabel.value}${label}`,
        issue: entry.issue,
      };
    }
    return {
      entryPath,
      initialValue: entry.value as string,
      placeholder: `請輸入${personLabel.value}${label}`,
    };
  });
});

const verifyAllPersonEntries = () => {
  personEntries.value.forEach((entry) => {
    const currentEntry = reviewStore.getEntry(entry.entryPath);
    if (currentEntry && currentEntry.state === "reviewing") {
      reviewStore.setEntry(entry.entryPath, {
        ...currentEntry,
        state: "verified",
      });
    }
  });
};
</script>
