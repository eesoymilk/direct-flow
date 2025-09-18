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
    :use-grid="false"
    @toggle="handleToggleSection"
  >
    <!-- Bank Documents Category -->
    <CompanyApplicationReviewUiDocumentCategorySection
      title="銀行相關文件"
      description="公司存摺及餘額證明相關文件"
      icon="i-heroicons-building-library"
      icon-class="text-blue-600"
    >
      <CompanyApplicationReviewUiDocumentFieldGroup>
        <CompanyApplicationReviewUiDocumentField
          label="公司存摺正面"
          :document-status="getDocumentStatus('bankBookFront')"
          document-type="公司存摺正面"
          :file-url="companyDocuments.bankBookFront"
          field-path="documents.bankBookFront"
          :is-verified="fieldStatuses.bankBookFront.isVerified"
          :has-issue="fieldStatuses.bankBookFront.hasIssue"
          :field-status-props="getFieldStatusProps('bankBookFront')"
          @verify="() => verifyField('bankBookFront')"
          @add-issue="addFieldIssue"
        />

        <CompanyApplicationReviewUiDocumentField
          label="公司存摺內頁"
          :document-status="getDocumentStatus('bankBookInside')"
          document-type="公司存摺內頁"
          :file-url="companyDocuments.bankBookInside"
          field-path="documents.bankBookInside"
          :is-verified="fieldStatuses.bankBookInside.isVerified"
          :has-issue="fieldStatuses.bankBookInside.hasIssue"
          :field-status-props="getFieldStatusProps('bankBookInside')"
          @verify="() => verifyField('bankBookInside')"
          @add-issue="addFieldIssue"
        />

        <CompanyApplicationReviewUiDocumentField
          label="公司存摺戳章頁"
          :document-status="getDocumentStatus('bankBookStamp')"
          document-type="公司存摺戳章頁"
          :file-url="companyDocuments.bankBookStamp"
          field-path="documents.bankBookStamp"
          :is-verified="fieldStatuses.bankBookStamp.isVerified"
          :has-issue="fieldStatuses.bankBookStamp.hasIssue"
          :field-status-props="getFieldStatusProps('bankBookStamp')"
          @verify="() => verifyField('bankBookStamp')"
          @add-issue="addFieldIssue"
        />

        <CompanyApplicationReviewUiDocumentField
          label="餘額證明或次日的存入100元證明"
          :document-status="getDocumentStatus('balanceProof')"
          document-type="餘額證明"
          :file-url="companyDocuments.balanceProof"
          field-path="documents.balanceProof"
          :is-verified="fieldStatuses.balanceProof.isVerified"
          :has-issue="fieldStatuses.balanceProof.hasIssue"
          :field-status-props="getFieldStatusProps('balanceProof')"
          @verify="() => verifyField('balanceProof')"
          @add-issue="addFieldIssue"
        />
      </CompanyApplicationReviewUiDocumentFieldGroup>
    </CompanyApplicationReviewUiDocumentCategorySection>

    <!-- Partner Documents Category -->
    <CompanyApplicationReviewUiDocumentCategorySection
      title="股東相關文件"
      description="股東匯款及同意書相關文件"
      icon="i-heroicons-users"
      icon-class="text-green-600"
    >
      <CompanyApplicationReviewUiDocumentFieldGroup>
        <CompanyApplicationReviewUiFieldCard
          label="股東匯款條或存摺資料"
          v-bind="getFieldStatusProps('partnerPayments')"
        >
          <CompanyApplicationReviewDocumentsPartnerPaymentDocuments
            :documents="companyDocuments.partnerPayments"
            :document-status="getDocumentStatus('partnerPayments')"
          />
          <template #actions>
            <CompanyApplicationReviewUiFieldActions
              :is-verified="fieldStatuses.partnerPayments.isVerified"
              :has-issue="fieldStatuses.partnerPayments.hasIssue"
              field-path="documents.partnerPayments"
              @verify="() => verifyField('partnerPayments')"
              @add-issue="addFieldIssue"
            />
          </template>
        </CompanyApplicationReviewUiFieldCard>

        <CompanyApplicationReviewUiDocumentField
          label="股東同意書"
          :document-status="getDocumentStatus('partnerAgreement')"
          document-type="股東同意書"
          :file-url="companyDocuments.partnerAgreement"
          field-path="documents.partnerAgreement"
          :is-verified="fieldStatuses.partnerAgreement.isVerified"
          :has-issue="fieldStatuses.partnerAgreement.hasIssue"
          :field-status-props="getFieldStatusProps('partnerAgreement')"
          @verify="() => verifyField('partnerAgreement')"
          @add-issue="addFieldIssue"
        />
      </CompanyApplicationReviewUiDocumentFieldGroup>
    </CompanyApplicationReviewUiDocumentCategorySection>

    <!-- Legal Documents Category -->
    <CompanyApplicationReviewUiDocumentCategorySection
      title="法律文件"
      description="法律相關同意書及聲明文件"
      icon="i-heroicons-document-text"
      icon-class="text-purple-600"
      class="mt-8"
    >
      <CompanyApplicationReviewUiDocumentFieldGroup>
        <CompanyApplicationReviewUiDocumentField
          label="房屋使用同意書"
          :document-status="getDocumentStatus('houseUseAgreement')"
          document-type="房屋使用同意書"
          :file-url="companyDocuments.houseUseAgreement"
          field-path="documents.houseUseAgreement"
          :is-verified="fieldStatuses.houseUseAgreement.isVerified"
          :has-issue="fieldStatuses.houseUseAgreement.hasIssue"
          :field-status-props="getFieldStatusProps('houseUseAgreement')"
          @verify="() => verifyField('houseUseAgreement')"
          @add-issue="addFieldIssue"
        />

        <CompanyApplicationReviewUiDocumentField
          label="董監事願任同意書"
          :document-status="getDocumentStatus('directorConsent')"
          document-type="董監事願任同意書"
          :file-url="companyDocuments.directorConsent"
          field-path="documents.directorConsent"
          :is-verified="fieldStatuses.directorConsent.isVerified"
          :has-issue="fieldStatuses.directorConsent.hasIssue"
          :field-status-props="getFieldStatusProps('directorConsent')"
          @verify="() => verifyField('directorConsent')"
          @add-issue="addFieldIssue"
        />

        <CompanyApplicationReviewUiDocumentField
          label="聲明書"
          :document-status="getDocumentStatus('declaration')"
          document-type="聲明書"
          :file-url="companyDocuments.declaration"
          field-path="documents.declaration"
          :is-verified="fieldStatuses.declaration.isVerified"
          :has-issue="fieldStatuses.declaration.hasIssue"
          :field-status-props="getFieldStatusProps('declaration')"
          @verify="() => verifyField('declaration')"
          @add-issue="addFieldIssue"
        />

        <CompanyApplicationReviewUiDocumentField
          label="法人聲明書"
          :value="
            companyDocuments.legalPersonDeclaration ? '已上傳' : '選填文件'
          "
          :document-status="getDocumentStatus('legalPersonDeclaration')"
          document-type="法人聲明書"
          :file-url="companyDocuments.legalPersonDeclaration"
          field-path="documents.legalPersonDeclaration"
          :is-verified="fieldStatuses.legalPersonDeclaration.isVerified"
          :has-issue="fieldStatuses.legalPersonDeclaration.hasIssue"
          :is-optional="true"
          :field-status-props="getFieldStatusProps('legalPersonDeclaration')"
          @verify="() => verifyField('legalPersonDeclaration')"
          @add-issue="addFieldIssue"
        />
      </CompanyApplicationReviewUiDocumentFieldGroup>
    </CompanyApplicationReviewUiDocumentCategorySection>

    <!-- Person Documents Section -->
    <CompanyApplicationReviewPersonDocumentSubSection />
  </CompanyApplicationReviewUiSectionBase>
</template>

<script setup lang="ts">
import { useDocumentReview } from "./useDocumentReview";
import { useDocumentReviewSection } from "./useDocumentReviewSection";

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
