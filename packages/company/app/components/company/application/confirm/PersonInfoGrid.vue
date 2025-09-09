<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Responsible Person Information -->
    <PersonCard
      :person="formState.responsiblePerson as PersonSchema"
      title="負責人"
      subtitle="責任代表人"
      icon="i-lucide-user-check"
    />

    <!-- Director Information -->
    <PersonCard
      v-if="!formState.isRepresentativeSameAsResponsiblePerson"
      :person="formState.representative as PersonSchema"
      title="代表人"
      subtitle="公司代表人"
      icon="i-lucide-briefcase"
    />
    <UAlert
      v-else
      icon="i-lucide-briefcase"
      color="primary"
      variant="soft"
      title="董事"
      description="與負責人相同"
    />

    <!-- Contact Person Information -->
    <PersonCard
      v-if="
        !formState.isContactPersonSameAsResponsiblePerson &&
        !formState.isContactPersonSameAsRepresentative
      "
      :person="formState.contactPerson as PersonSchema"
      title="聯絡人"
      subtitle="主要聯絡窗口"
      icon="i-lucide-phone"
    />
    <UAlert
      v-else
      icon="i-lucide-phone"
      color="primary"
      variant="soft"
      title="聯絡人"
      description="與負責人相同"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  formState: CompanyApplicationFormSchema & {
    responsiblePerson: PersonSchema;
    representative: PersonSchema;
    contactPerson: PersonSchema;
    shareholders: ShareholderSchema[];
  };
}

defineProps<Props>();
</script>
