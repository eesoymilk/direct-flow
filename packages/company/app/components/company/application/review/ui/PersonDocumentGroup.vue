<template>
  <div class="space-y-3">
    <h5 class="font-medium text-gray-800 flex items-center gap-2">
      <UIcon :name="icon" class="size-4" :class="iconClass" />
      {{ title }}
    </h5>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- ID Card Front -->
      <CompanyApplicationReviewUiFieldCard
        label="身分證正面"
        v-bind="frontCardStatusProps"
      >
        <template #custom-display>
          <CompanyApplicationReviewDocumentsDocumentPreview
            :document-status="frontCardDocumentStatus"
            document-type="身分證正面"
            :file-url="frontCardFileUrl"
          />
        </template>
        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="frontCardStatus.isVerified"
            :has-issue="frontCardStatus.hasIssue"
            :field-path="frontCardFieldPath"
            @verify="handleVerifyFront"
            @add-issue="$emit('addIssue', $event)"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>

      <!-- ID Card Back -->
      <CompanyApplicationReviewUiFieldCard
        label="身分證背面"
        v-bind="backCardStatusProps"
      >
        <template #custom-display>
          <CompanyApplicationReviewDocumentsDocumentPreview
            :document-status="backCardDocumentStatus"
            document-type="身分證背面"
            :file-url="backCardFileUrl"
          />
        </template>
        <template #actions>
          <CompanyApplicationReviewUiFieldActions
            :is-verified="backCardStatus.isVerified"
            :has-issue="backCardStatus.hasIssue"
            :field-path="backCardFieldPath"
            @verify="handleVerifyBack"
            @add-issue="$emit('addIssue', $event)"
          />
        </template>
      </CompanyApplicationReviewUiFieldCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClassValue } from "clsx";
import {
  useDocumentReview,
  type PersonDocumentField,
} from "../documents/useDocumentReview";

interface Props {
  title: string;
  icon: string;
  iconClass?: ClassValue;
  personType:
    | "responsiblePerson"
    | "representative"
    | "contactPerson"
    | "shareholder";
  shareholderId?: number;
}

interface Emits {
  verifyField: [
    personType: string,
    field: PersonDocumentField,
    shareholderId?: number,
  ];
  addIssue: [issue: any];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Import the required composables and functions from parent context
const { getPersonDocuments, getPersonDocumentStatus } = useDocumentReview();

// We need to inject the field status functions from parent
const personDocumentFunctions = inject("personDocumentFunctions", {
  getPersonFieldStatus: (
    personType: string,
    field: PersonDocumentField,
    shareholderId?: number
  ) => ({ isVerified: false, hasIssue: false }),
  getPersonFieldStatusProps: (
    personType: string,
    field: PersonDocumentField,
    shareholderId?: number
  ) => ({}),
});

const { getPersonFieldStatus, getPersonFieldStatusProps } =
  personDocumentFunctions;

// Computed properties for front card
const frontCardStatus = computed(() =>
  getPersonFieldStatus(props.personType, "idCardFront", props.shareholderId)
);

const frontCardStatusProps = computed(() =>
  getPersonFieldStatusProps(
    props.personType,
    "idCardFront",
    props.shareholderId
  )
);

const frontCardDocumentStatus = computed(() =>
  getPersonDocumentStatus("idCardFront", props.personType, props.shareholderId)
);

const frontCardFileUrl = computed(
  () => getPersonDocuments(props.personType, props.shareholderId)?.idCardFront
);

const frontCardFieldPath = computed(() => {
  if (props.shareholderId) {
    return `documents.shareholder.${props.shareholderId}.idCardFront`;
  }
  return `documents.${props.personType}.idCardFront`;
});

// Computed properties for back card
const backCardStatus = computed(() =>
  getPersonFieldStatus(props.personType, "idCardBack", props.shareholderId)
);

const backCardStatusProps = computed(() =>
  getPersonFieldStatusProps(props.personType, "idCardBack", props.shareholderId)
);

const backCardDocumentStatus = computed(() =>
  getPersonDocumentStatus("idCardBack", props.personType, props.shareholderId)
);

const backCardFileUrl = computed(
  () => getPersonDocuments(props.personType, props.shareholderId)?.idCardBack
);

const backCardFieldPath = computed(() => {
  if (props.shareholderId) {
    return `documents.shareholder.${props.shareholderId}.idCardBack`;
  }
  return `documents.${props.personType}.idCardBack`;
});

// Event handlers
const handleVerifyFront = () => {
  emit("verifyField", props.personType, "idCardFront", props.shareholderId);
};

const handleVerifyBack = () => {
  emit("verifyField", props.personType, "idCardBack", props.shareholderId);
};
</script>
