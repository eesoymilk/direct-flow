<template>
  <UCard
    v-if="partners && partners.length > 0"
    class="ring-1 ring-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon :name="headerIcon" class="w-6 h-6 text-orange-600" />
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ headerTitle }}</h3>
            <p class="text-sm text-gray-500">
              共 {{ partners.length }} 位{{ partnerLabel }}
            </p>
          </div>
        </div>
        <UBadge :label="`${partners.length} 人`" variant="subtle" size="lg" />
      </div>
    </template>

    <div class="space-y-6">
      <CompanyApplicationConfirmPartnerCard
        v-for="(partner, index) in partners"
        :key="index"
        :partner="partner"
        :index="index"
        :organization-type="organizationType"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  partners: PartnerSchema[];
  organizationType: OrganizationType;
}

const props = defineProps<Props>();

// Organization-aware labels and icons
const headerTitle = computed(() => {
  switch (props.organizationType) {
    case "corporation":
    case "limited_company":
      return "股東資料";
    case "partnership":
      return "合夥人資料";
    case "sole_proprietorship":
      return "負責人資料";
    default:
      return "成員資料";
  }
});

const partnerLabel = computed(() => {
  switch (props.organizationType) {
    case "corporation":
    case "limited_company":
      return "股東";
    case "partnership":
      return "合夥人";
    case "sole_proprietorship":
      return "負責人";
    default:
      return "成員";
  }
});

const headerIcon = computed(() => {
  switch (props.organizationType) {
    case "partnership":
      return "i-lucide-handshake";
    case "sole_proprietorship":
      return "i-lucide-user";
    default:
      return "i-lucide-users";
  }
});
</script>
