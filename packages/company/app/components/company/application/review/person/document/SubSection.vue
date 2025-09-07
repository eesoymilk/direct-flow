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

    <!-- Shareholders Documents -->
    <div v-if="shareholders.length > 0" class="space-y-3">
      <h5 class="font-medium text-gray-800 flex items-center gap-2">
        <UIcon name="i-heroicons-users" class="w-4 h-4 text-orange-600" />
        股東身分證
      </h5>

      <div
        v-for="(shareholder, index) in shareholders"
        :key="shareholder.id"
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
              {{ shareholder.person.name }}
            </h6>
            <p class="text-sm text-gray-600">股東身分證件</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CompanyApplicationReviewUiFieldCard
            label="身分證正面"
            v-bind="
              getPersonFieldStatusProps(
                'shareholder',
                'idCardFront',
                shareholder.id
              )
            "
          >
            <template #custom-display>
              <CompanyApplicationReviewDocumentsDocumentPreview
                :document-status="
                  getPersonDocumentStatus(
                    'idCardFront',
                    'shareholder',
                    shareholder.id
                  )
                "
                document-type="身分證正面"
                :file-url="
                  getPersonDocuments('shareholder', shareholder.id).idCardFront
                "
              />
            </template>
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="
                  getPersonFieldStatus(
                    'shareholder',
                    'idCardFront',
                    shareholder.id
                  ).isVerified
                "
                :has-issue="
                  getPersonFieldStatus(
                    'shareholder',
                    'idCardFront',
                    shareholder.id
                  ).hasIssue
                "
                :field-path="`documents.shareholder[${shareholder.id}].idCardFront`"
                @verify="
                  () =>
                    verifyPersonField(
                      'shareholder',
                      'idCardFront',
                      shareholder.id
                    )
                "
                @add-issue="addFieldIssue"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <CompanyApplicationReviewUiFieldCard
            label="身分證背面"
            v-bind="
              getPersonFieldStatusProps(
                'shareholder',
                'idCardBack',
                shareholder.id
              )
            "
          >
            <template #custom-display>
              <CompanyApplicationReviewDocumentsDocumentPreview
                :document-status="
                  getPersonDocumentStatus(
                    'idCardBack',
                    'shareholder',
                    shareholder.id
                  )
                "
                document-type="身分證背面"
                :file-url="
                  getPersonDocuments('shareholder', shareholder.id).idCardBack
                "
              />
            </template>
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="
                  getPersonFieldStatus(
                    'shareholder',
                    'idCardBack',
                    shareholder.id
                  ).isVerified
                "
                :has-issue="
                  getPersonFieldStatus(
                    'shareholder',
                    'idCardBack',
                    shareholder.id
                  ).hasIssue
                "
                :field-path="`documents.shareholder[${shareholder.id}].idCardBack`"
                @verify="
                  () =>
                    verifyPersonField(
                      'shareholder',
                      'idCardBack',
                      shareholder.id
                    )
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

const shareholders = computed(() => application.value?.shareholders || []);

const getPersonFieldStatus = (
  personType: string,
  field: PersonDocumentField,
  shareholderId?: number
) => {
  let fieldPath = `documents.${personType}.${field}`;
  if (shareholderId) {
    fieldPath = `documents.shareholder[${shareholderId}].${field}`;
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
  shareholderId?: number
) => {
  const fieldStatus = getPersonFieldStatus(personType, field, shareholderId);
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
  shareholderId?: number
) => {
  let fieldPath = `documents.${personType}.${field}`;
  if (shareholderId) {
    fieldPath = `documents.shareholder[${shareholderId}].${field}`;
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
