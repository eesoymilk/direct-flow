<template>
  <div class="flex items-center gap-4 mb-6">
    <h2 class="text-xl font-semibold text-text">{{ personTypeLabel }}資料</h2>
    <UButton
      icon="i-lucide-plus"
      :label="`新增${personTypeLabel}`"
      variant="soft"
      class="rounded-full"
      @click="addPartner"
    />
    <UButton
      v-if="canAddShareType"
      icon="i-lucide-plus"
      label="新增特別股"
      variant="soft"
      class="rounded-full"
      @click="addShareType"
    />
    <UButton
      v-if="canRemoveShareType"
      icon="i-lucide-minus"
      label="刪除特別股"
      variant="outline"
      color="error"
      class="rounded-full"
      @click="removeShareType"
    />
    <UDropdownMenu
      :items="existingPeopleMenuItems"
      :popper="{ placement: 'bottom-start' }"
    >
      <UButton
        icon="i-lucide-user-plus"
        label="加入現有人員"
        variant="outline"
        class="rounded-full"
      />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
const applicationStore = useCompanyApplicationStore();
const { addPartner, addShareType, removeShareType } = applicationStore;

const {
  personTypeLabel,
  canAddShareType,
  canRemoveShareType,
  existingPeopleMenuItems,
} = usePartnerManagement();
</script>
