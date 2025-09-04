<template>
  <div class="space-y-4 border-t border-gray-200 pt-6 mt-6">
    <!-- Section Header -->
    <div class="border-b border-gray-200 pb-2">
      <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <UIcon name="i-heroicons-identification" class="w-5 h-5 text-indigo-600" />
        人員身分證件
      </h4>
      <p class="text-sm text-gray-600 mt-1">所有人員的身分證正面與背面文件</p>
    </div>

    <!-- Responsible Person Documents -->
    <div class="space-y-3">
      <h5 class="font-medium text-gray-800 flex items-center gap-2">
        <UIcon name="i-heroicons-user-circle" class="w-4 h-4 text-blue-600" />
        負責人身分證
      </h5>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CompanyApplicationReviewUiFieldCard
          label="身分證正面"
          v-bind="getPersonFieldStatusProps('responsiblePerson', 'idCardFront')"
        >
          <DocumentPreview
            :document-status="getPersonDocumentStatus('idCardFront', 'responsiblePerson')"
            document-type="身分證正面"
            :file-url="getPersonDocuments('responsiblePerson').idCardFront"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="getPersonFieldStatus('responsiblePerson', 'idCardFront').isVerified"
              :has-issue="getPersonFieldStatus('responsiblePerson', 'idCardFront').hasIssue"
              field-path="documents.responsiblePerson.idCardFront"
              @verify="() => verifyPersonField('responsiblePerson', 'idCardFront')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>

        <CompanyApplicationReviewUiFieldCard
          label="身分證背面"
          v-bind="getPersonFieldStatusProps('responsiblePerson', 'idCardBack')"
        >
          <DocumentPreview
            :document-status="getPersonDocumentStatus('idCardBack', 'responsiblePerson')"
            document-type="身分證背面"
            :file-url="getPersonDocuments('responsiblePerson').idCardBack"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="getPersonFieldStatus('responsiblePerson', 'idCardBack').isVerified"
              :has-issue="getPersonFieldStatus('responsiblePerson', 'idCardBack').hasIssue"
              field-path="documents.responsiblePerson.idCardBack"
              @verify="() => verifyPersonField('responsiblePerson', 'idCardBack')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>
      </div>
    </div>

    <!-- Representative Documents -->
    <div class="space-y-3">
      <h5 class="font-medium text-gray-800 flex items-center gap-2">
        <UIcon name="i-heroicons-user-circle" class="w-4 h-4 text-green-600" />
        代表人身分證
      </h5>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CompanyApplicationReviewUiFieldCard
          label="身分證正面"
          v-bind="getPersonFieldStatusProps('representative', 'idCardFront')"
        >
          <DocumentPreview
            :document-status="getPersonDocumentStatus('idCardFront', 'representative')"
            document-type="身分證正面"
            :file-url="getPersonDocuments('representative').idCardFront"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="getPersonFieldStatus('representative', 'idCardFront').isVerified"
              :has-issue="getPersonFieldStatus('representative', 'idCardFront').hasIssue"
              field-path="documents.representative.idCardFront"
              @verify="() => verifyPersonField('representative', 'idCardFront')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>

        <CompanyApplicationReviewUiFieldCard
          label="身分證背面"
          v-bind="getPersonFieldStatusProps('representative', 'idCardBack')"
        >
          <DocumentPreview
            :document-status="getPersonDocumentStatus('idCardBack', 'representative')"
            document-type="身分證背面"
            :file-url="getPersonDocuments('representative').idCardBack"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="getPersonFieldStatus('representative', 'idCardBack').isVerified"
              :has-issue="getPersonFieldStatus('representative', 'idCardBack').hasIssue"
              field-path="documents.representative.idCardBack"
              @verify="() => verifyPersonField('representative', 'idCardBack')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>
      </div>
    </div>

    <!-- Contact Person Documents -->
    <div class="space-y-3">
      <h5 class="font-medium text-gray-800 flex items-center gap-2">
        <UIcon name="i-heroicons-user-circle" class="w-4 h-4 text-purple-600" />
        聯絡人身分證
      </h5>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CompanyApplicationReviewUiFieldCard
          label="身分證正面"
          v-bind="getPersonFieldStatusProps('contactPerson', 'idCardFront')"
        >
          <DocumentPreview
            :document-status="getPersonDocumentStatus('idCardFront', 'contactPerson')"
            document-type="身分證正面"
            :file-url="getPersonDocuments('contactPerson').idCardFront"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="getPersonFieldStatus('contactPerson', 'idCardFront').isVerified"
              :has-issue="getPersonFieldStatus('contactPerson', 'idCardFront').hasIssue"
              field-path="documents.contactPerson.idCardFront"
              @verify="() => verifyPersonField('contactPerson', 'idCardFront')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>

        <CompanyApplicationReviewUiFieldCard
          label="身分證背面"
          v-bind="getPersonFieldStatusProps('contactPerson', 'idCardBack')"
        >
          <DocumentPreview
            :document-status="getPersonDocumentStatus('idCardBack', 'contactPerson')"
            document-type="身分證背面"
            :file-url="getPersonDocuments('contactPerson').idCardBack"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="getPersonFieldStatus('contactPerson', 'idCardBack').isVerified"
              :has-issue="getPersonFieldStatus('contactPerson', 'idCardBack').hasIssue"
              field-path="documents.contactPerson.idCardBack"
              @verify="() => verifyPersonField('contactPerson', 'idCardBack')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>
      </div>
    </div>

    <!-- Shareholders Documents -->
    <div class="space-y-3" v-if="shareholders.length > 0">
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
          <div class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
            {{ index + 1 }}
          </div>
          <div>
            <h6 class="font-medium text-gray-900">{{ shareholder.person.name }}</h6>
            <p class="text-sm text-gray-600">股東身分證件</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CompanyApplicationReviewUiFieldCard
            label="身分證正面"
            v-bind="getPersonFieldStatusProps('shareholder', 'idCardFront', shareholder.id)"
          >
            <DocumentPreview
              :document-status="getPersonDocumentStatus('idCardFront', 'shareholder', shareholder.id)"
              document-type="身分證正面"
              :file-url="getPersonDocuments('shareholder', shareholder.id).idCardFront"
            />
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="getPersonFieldStatus('shareholder', 'idCardFront', shareholder.id).isVerified"
                :has-issue="getPersonFieldStatus('shareholder', 'idCardFront', shareholder.id).hasIssue"
                :field-path="`documents.shareholder.${shareholder.id}.idCardFront`"
                @verify="() => verifyPersonField('shareholder', 'idCardFront', shareholder.id)"
                @add-issue="addFieldIssue"
              />
            </template>
          </CompanyApplicationReviewUiFieldCard>

          <CompanyApplicationReviewUiFieldCard
            label="身分證背面"
            v-bind="getPersonFieldStatusProps('shareholder', 'idCardBack', shareholder.id)"
          >
            <DocumentPreview
              :document-status="getPersonDocumentStatus('idCardBack', 'shareholder', shareholder.id)"
              document-type="身分證背面"
              :file-url="getPersonDocuments('shareholder', shareholder.id).idCardBack"
            />
            <template #actions>
              <CompanyApplicationReviewUiFieldActions
                :is-verified="getPersonFieldStatus('shareholder', 'idCardBack', shareholder.id).isVerified"
                :has-issue="getPersonFieldStatus('shareholder', 'idCardBack', shareholder.id).hasIssue"
                :field-path="`documents.shareholder.${shareholder.id}.idCardBack`"
                @verify="() => verifyPersonField('shareholder', 'idCardBack', shareholder.id)"
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
import { useDocumentReview, type PersonDocumentField } from "./useDocumentReview";

const { getPersonDocuments, getPersonDocumentStatus } = useDocumentReview();
const { getFieldStatus, addIssue, verifyField } = useCompanyApplicationReviewStore();

// Get application data for shareholders
const detailsStore = useCompanyApplicationDetailsStore();
const { application } = storeToRefs(detailsStore);

const shareholders = computed(() => application.value?.shareholders || []);

const getPersonFieldStatus = (personType: string, field: PersonDocumentField, shareholderId?: number) => {
  let fieldPath = `documents.${personType}.${field}`;
  if (shareholderId) {
    fieldPath = `documents.shareholder.${shareholderId}.${field}`;
  }
  return getFieldStatus(fieldPath);
};

const getPersonFieldStatusProps = (personType: string, field: PersonDocumentField, shareholderId?: number) => {
  const fieldStatus = getPersonFieldStatus(personType, field, shareholderId);
  return {
    isVerified: fieldStatus.isVerified,
    hasIssue: fieldStatus.hasIssue,
    issue: fieldStatus.issue,
    verification: fieldStatus.verification,
  };
};

const verifyPersonField = (personType: string, field: PersonDocumentField, shareholderId?: number) => {
  let fieldPath = `documents.${personType}.${field}`;
  if (shareholderId) {
    fieldPath = `documents.shareholder.${shareholderId}.${field}`;
  }
  verifyField(fieldPath);
};

const addFieldIssue = (fieldPath: string) => {
  addIssue(fieldPath);
};
</script>