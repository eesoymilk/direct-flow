<template>
  <div class="space-y-4">
    <!-- Section Header -->
    <div class="border-b border-gray-200 pb-2">
      <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <UIcon
          name="i-heroicons-identification"
          class="w-5 h-5 text-indigo-600"
        />
        人員身分證件
      </h4>
      <p class="text-sm text-gray-600 mt-1">所有人員的身分證正面與背面文件</p>
    </div>

    <!-- Responsible Person Documents -->
    <CompanyApplicationReviewPersonDocumentGroup
      title="負責人身分證"
      icon="i-heroicons-user-circle"
      icon-class="text-blue-600"
      person-type="responsiblePerson"
      @verify-field="verifyPersonField"
      @add-issue="addFieldIssue"
    />

    <!-- Representative Documents -->
    <CompanyApplicationReviewPersonDocumentGroup
      title="代表人身分證"
      icon="i-heroicons-user-circle"
      icon-class="text-green-600"
      person-type="representative"
      @verify-field="verifyPersonField"
      @add-issue="addFieldIssue"
    />

    <!-- Contact Person Documents -->
    <CompanyApplicationReviewPersonDocumentGroup
      title="聯絡人身分證"
      icon="i-heroicons-user-circle"
      icon-class="text-purple-600"
      person-type="contactPerson"
      @verify-field="verifyPersonField"
      @add-issue="addFieldIssue"
    />

    <!-- Partners Documents -->
    <div v-if="partners.length > 0" class="space-y-3">
      <h5 class="font-medium text-gray-800 flex items-center gap-2">
        <UIcon name="i-heroicons-users" class="w-4 h-4 text-orange-600" />
        股東身分證
      </h5>

      <div
        v-for="(partner, index) in partners"
        :key="partner.id"
        class="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium"
          >
            {{ index + 1 }}
          </div>
          <div>
            <h6 class="font-medium text-gray-900">
              {{ partner.person.name }}
            </h6>
            <p class="text-sm text-gray-600">股東身分證件</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CompanyApplicationReviewUiFieldCard
            label="身分證正面"
            v-bind="
              getPersonFieldStatusProps('partner', 'idCardFront', partner.id)
            "
          >
            <template #custom-display>
              <CompanyApplicationReviewDocumentsDocumentPreview
                :document-status="
                  getPersonDocumentStatus('idCardFront', 'partner', partner.id)
                "
                document-type="身分證正面"
                :file-url="
                  getPersonDocuments('partner', partner.id).idCardFront
                "
              />
            </template>
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="
                  getPersonFieldStatus('partner', 'idCardFront', partner.id)
                    .isVerified
                "
                :has-issue="
                  getPersonFieldStatus('partner', 'idCardFront', partner.id)
                    .hasIssue
                "
                :field-path="`documents.partner[${partner.id}].idCardFront`"
                @verify="
                  () => verifyPersonField('partner', 'idCardFront', partner.id)
                "
                @add-issue="addFieldIssue"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <CompanyApplicationReviewUiFieldCard
            label="身分證背面"
            v-bind="
              getPersonFieldStatusProps('partner', 'idCardBack', partner.id)
            "
          >
            <template #custom-display>
              <CompanyApplicationReviewDocumentsDocumentPreview
                :document-status="
                  getPersonDocumentStatus('idCardBack', 'partner', partner.id)
                "
                document-type="身分證背面"
                :file-url="getPersonDocuments('partner', partner.id).idCardBack"
              />
            </template>
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="
                  getPersonFieldStatus('partner', 'idCardBack', partner.id)
                    .isVerified
                "
                :has-issue="
                  getPersonFieldStatus('partner', 'idCardBack', partner.id)
                    .hasIssue
                "
                :field-path="`documents.partner[${partner.id}].idCardBack`"
                @verify="
                  () => verifyPersonField('partner', 'idCardBack', partner.id)
                "
                @add-issue="addFieldIssue"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocumentReview } from "../../documents/useDocumentReview";
import type { PersonDocumentField } from "../../types";
import { useCompanyApplicationReviewStore } from "../../useCompanyApplicationReviewStore";

const { getPersonDocuments, getPersonDocumentStatus } = useDocumentReview();
const { addIssue, addVerification, getSectionState } =
  useCompanyApplicationReviewStore();

const detailsStore = useCompanyApplicationDetailsStore();
const { application } = storeToRefs(detailsStore);

const partners = computed(() => application.value?.partners || []);

const getPersonFieldStatus = (
  personType: string,
  field: PersonDocumentField,
  partnerId?: number
) => {
  let fieldPath = `documents.${personType}.${field}`;
  if (partnerId) {
    fieldPath = `documents.partner[${partnerId}].${field}`;
  }

  const documentsSection = getSectionState("documents");
  const issue = documentsSection.issues.find((i) => i.fieldPath === fieldPath);
  const verification = documentsSection.verifications.find(
    (v) => v.fieldPath === fieldPath
  );

  return {
    isVerified: !!verification,
    hasIssue: !!issue,
    issue: issue,
    verification: verification,
  };
};

const getPersonFieldStatusProps = (
  personType: string,
  field: PersonDocumentField,
  partnerId?: number
) => {
  const fieldStatus = getPersonFieldStatus(personType, field, partnerId);
  return {
    isVerified: fieldStatus.isVerified,
    hasIssue: fieldStatus.hasIssue,
    issue: fieldStatus.issue,
    verification: fieldStatus.verification,
  };
};

const verifyPersonField = (
  personType: string,
  field: PersonDocumentField,
  partnerId?: number
) => {
  let fieldPath = `documents.${personType}.${field}`;
  if (partnerId) {
    fieldPath = `documents.partner[${partnerId}].${field}`;
  }
  addVerification("documents", {
    fieldPath,
    note: "Verified by reviewer", // Optional note
  });
};

const addFieldIssue = (issue: {
  fieldPath: string;
  issueType: "missing" | "invalid" | "clarification" | "modification";
  severity: "critical" | "high" | "low" | "medium";
  description?: string;
}) => {
  addIssue("documents", issue);
};

// Provide functions to child components
provide("personDocumentFunctions", {
  getPersonFieldStatus,
  getPersonFieldStatusProps,
});
</script>
