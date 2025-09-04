<template>
  <CompanyApplicationReviewUiSectionBase
    title="必要文件"
    description="公司登記所需之相關文件檢核"
    :is-open="sectionIsOpen"
    :section-border-class="sectionBorderClass"
    :status-icon="statusIcon"
    :status-icon-class="statusIconClass"
    :status-label="statusLabel"
    :status-badge-color="statusBadgeColor"
    :status="status"
    :field-statuses="fieldStatuses"
    :quick-action-items="quickActionItems"
    @toggle="handleToggleSection"
  >
    <template #default>
      <!-- Bank Documents Category -->
      <div class="space-y-4">
        <div class="border-b border-gray-200 pb-2">
          <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <UIcon name="i-heroicons-building-library" class="w-5 h-5 text-blue-600" />
            銀行相關文件
          </h4>
          <p class="text-sm text-gray-600 mt-1">公司存摺及餘額證明相關文件</p>
        </div>

        <!-- Bank Book Documents -->
        <CompanyApplicationReviewUiFieldCard
          label="公司存摺正面"
          v-bind="getFieldStatusProps('bankBookFront')"
        >
          <DocumentPreview
            :document-status="getDocumentStatus('bankBookFront')"
            document-type="公司存摺正面"
            :file-url="companyDocuments.bankBookFront"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="fieldStatuses.bankBookFront.isVerified"
              :has-issue="fieldStatuses.bankBookFront.hasIssue"
              field-path="documents.bankBookFront"
              @verify="() => verifyField('bankBookFront')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>

        <CompanyApplicationReviewUiFieldCard
          label="公司存摺內頁"
          v-bind="getFieldStatusProps('bankBookInside')"
        >
          <DocumentPreview
            :document-status="getDocumentStatus('bankBookInside')"
            document-type="公司存摺內頁"
            :file-url="companyDocuments.bankBookInside"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="fieldStatuses.bankBookInside.isVerified"
              :has-issue="fieldStatuses.bankBookInside.hasIssue"
              field-path="documents.bankBookInside"
              @verify="() => verifyField('bankBookInside')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>

        <CompanyApplicationReviewUiFieldCard
          label="公司存摺戳章頁"
          v-bind="getFieldStatusProps('bankBookStamp')"
        >
          <DocumentPreview
            :document-status="getDocumentStatus('bankBookStamp')"
            document-type="公司存摺戳章頁"
            :file-url="companyDocuments.bankBookStamp"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="fieldStatuses.bankBookStamp.isVerified"
              :has-issue="fieldStatuses.bankBookStamp.hasIssue"
              field-path="documents.bankBookStamp"
              @verify="() => verifyField('bankBookStamp')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>

        <CompanyApplicationReviewUiFieldCard
          label="餘額證明或次日的存入100元證明"
          v-bind="getFieldStatusProps('balanceProof')"
        >
          <DocumentPreview
            :document-status="getDocumentStatus('balanceProof')"
            document-type="餘額證明"
            :file-url="companyDocuments.balanceProof"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="fieldStatuses.balanceProof.isVerified"
              :has-issue="fieldStatuses.balanceProof.hasIssue"
              field-path="documents.balanceProof"
              @verify="() => verifyField('balanceProof')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>
      </div>

      <!-- Shareholder Documents Category -->
      <div class="space-y-4 mt-8">
        <div class="border-b border-gray-200 pb-2">
          <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <UIcon name="i-heroicons-users" class="w-5 h-5 text-green-600" />
            股東相關文件
          </h4>
          <p class="text-sm text-gray-600 mt-1">股東匯款及同意書相關文件</p>
        </div>

        <CompanyApplicationReviewUiFieldCard
          label="股東匯款條或存摺資料"
          v-bind="getFieldStatusProps('shareholderPayments')"
        >
          <ShareholderPaymentDocuments
            :documents="companyDocuments.shareholderPayments"
            :document-status="getDocumentStatus('shareholderPayments')"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="fieldStatuses.shareholderPayments.isVerified"
              :has-issue="fieldStatuses.shareholderPayments.hasIssue"
              field-path="documents.shareholderPayments"
              @verify="() => verifyField('shareholderPayments')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>

        <CompanyApplicationReviewUiFieldCard
          label="股東同意書"
          v-bind="getFieldStatusProps('shareholderAgreement')"
        >
          <DocumentPreview
            :document-status="getDocumentStatus('shareholderAgreement')"
            document-type="股東同意書"
            :file-url="companyDocuments.shareholderAgreement"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="fieldStatuses.shareholderAgreement.isVerified"
              :has-issue="fieldStatuses.shareholderAgreement.hasIssue"
              field-path="documents.shareholderAgreement"
              @verify="() => verifyField('shareholderAgreement')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>
      </div>

      <!-- Legal Documents Category -->
      <div class="space-y-4 mt-8">
        <div class="border-b border-gray-200 pb-2">
          <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-purple-600" />
            法律文件
          </h4>
          <p class="text-sm text-gray-600 mt-1">法律相關同意書及聲明文件</p>
        </div>

        <CompanyApplicationReviewUiFieldCard
          label="房屋使用同意書"
          v-bind="getFieldStatusProps('houseUseAgreement')"
        >
          <DocumentPreview
            :document-status="getDocumentStatus('houseUseAgreement')"
            document-type="房屋使用同意書"
            :file-url="companyDocuments.houseUseAgreement"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="fieldStatuses.houseUseAgreement.isVerified"
              :has-issue="fieldStatuses.houseUseAgreement.hasIssue"
              field-path="documents.houseUseAgreement"
              @verify="() => verifyField('houseUseAgreement')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>

        <CompanyApplicationReviewUiFieldCard
          label="董監事願任同意書"
          v-bind="getFieldStatusProps('directorConsent')"
        >
          <DocumentPreview
            :document-status="getDocumentStatus('directorConsent')"
            document-type="董監事願任同意書"
            :file-url="companyDocuments.directorConsent"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="fieldStatuses.directorConsent.isVerified"
              :has-issue="fieldStatuses.directorConsent.hasIssue"
              field-path="documents.directorConsent"
              @verify="() => verifyField('directorConsent')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>

        <CompanyApplicationReviewUiFieldCard
          label="聲明書"
          v-bind="getFieldStatusProps('declaration')"
        >
          <DocumentPreview
            :document-status="getDocumentStatus('declaration')"
            document-type="聲明書"
            :file-url="companyDocuments.declaration"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="fieldStatuses.declaration.isVerified"
              :has-issue="fieldStatuses.declaration.hasIssue"
              field-path="documents.declaration"
              @verify="() => verifyField('declaration')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>

        <CompanyApplicationReviewUiFieldCard
          label="法人聲明書"
          :value="companyDocuments.legalPersonDeclaration ? '已上傳' : '選填文件'"
          v-bind="getFieldStatusProps('legalPersonDeclaration')"
        >
          <DocumentPreview
            :document-status="getDocumentStatus('legalPersonDeclaration')"
            document-type="法人聲明書"
            :file-url="companyDocuments.legalPersonDeclaration"
            :is-optional="true"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="fieldStatuses.legalPersonDeclaration.isVerified"
              :has-issue="fieldStatuses.legalPersonDeclaration.hasIssue"
              field-path="documents.legalPersonDeclaration"
              @verify="() => verifyField('legalPersonDeclaration')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>
      </div>

      <!-- Person Documents Section -->
      <PersonDocumentSection />
    </template>
  </CompanyApplicationReviewUiSectionBase>
</template>

<script setup lang="ts">
import {
  useDocumentReview,
  type CompanyDocumentField,
} from "./useDocumentReview";
import { useDocumentReviewSection } from "./useDocumentReviewSection";
import PersonDocumentSection from "./PersonDocumentSection.vue";

const { companyDocuments, getDocumentStatus } = useDocumentReview();

const {
  sectionIsOpen,
  fieldStatuses,
  status,
  sectionBorderClass,
  statusIcon,
  statusIconClass,
  statusBadgeColor,
  statusLabel,
  quickActionItems,
  addFieldIssue,
  verifyField,
  handleToggleSection,
  getFieldStatusProps,
} = useDocumentReviewSection();
</script>