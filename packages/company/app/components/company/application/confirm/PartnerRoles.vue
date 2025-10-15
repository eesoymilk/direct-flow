<template>
  <div v-if="partner.partnerType" class="space-y-2">
    <InfoDisplay
      :label="roleLabel"
      icon="i-lucide-user-cog"
      :value="getPartnerTypeLabel(partner.partnerType)"
      variant="highlighted"
      class="border border-primary/20 bg-primary/5"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  partner: PartnerSchema;
  organizationType: OrganizationType;
}

const props = defineProps<Props>();

const roleLabel = computed(() => {
  switch (props.organizationType) {
    case "corporation":
      return "董監事職位";
    case "limited_company":
      return "職位";
    case "partnership":
      return "職位";
    default:
      return "職位";
  }
});
</script>
