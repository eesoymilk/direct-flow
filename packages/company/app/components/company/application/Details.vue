<template>
  <div class="space-y-6">
    <UTabs :items="tabItems" :unmount-on-hide="false" variant="link">
      <template #company-details>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Candidate Names -->
          <CompanyApplicationFormFieldUnderReview
            label="候選公司名稱"
            :status="getFieldVerificationStatus('company.organizationType')"
            :error="getFieldError('company.organizationType')"
            :review-mode="reviewMode"
          >
            <div class="flex items-center gap-2 flex-wrap">
              <UChip
                v-for="(name, index) in application.candicateNames"
                :key="index"
                :show="index === 0"
                color="success"
              >
                <UButton
                  size="sm"
                  :label="name"
                  variant="soft"
                  class="select-text"
                />
              </UChip>
            </div>
          </CompanyApplicationFormFieldUnderReview>

          <!-- Organization Type -->
          <CompanyApplicationFormFieldUnderReview
            label="組織類型"
            :status="getFieldVerificationStatus('company.organizationType')"
            :error="getFieldError('company.organizationType')"
            :review-mode="reviewMode"
          >
            <UButton
              :label="getOrganizationTypeLabel(application.organizationType)"
              variant="soft"
              size="sm"
              class="select-text"
            />
          </CompanyApplicationFormFieldUnderReview>

          <!-- Company Address -->
          <CompanyApplicationFormFieldUnderReview
            label="公司地址"
            :status="getFieldVerificationStatus('company.address')"
            :error="getFieldError('company.address')"
            :review-mode="reviewMode"
          >
            <UButton
              :label="application.address"
              variant="soft"
              size="sm"
              class="select-text"
            />
          </CompanyApplicationFormFieldUnderReview>

          <!-- Business Items Description -->
          <CompanyApplicationFormFieldUnderReview
            label="營業項目描述"
            :status="
              getFieldVerificationStatus('company.businessItemsDescription')
            "
            :error="getFieldError('company.businessItemsDescription')"
            :review-mode="reviewMode"
          >
            <UButton
              :label="application.businessItemsDescription"
              variant="soft"
              size="sm"
              class="select-text"
            />
          </CompanyApplicationFormFieldUnderReview>
        </div>
      </template>
      <template #responsible-person>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompanyApplicationFormFieldUnderReview
            label="姓名"
            :status="getFieldVerificationStatus('responsiblePerson.name')"
            :error="getFieldError('responsiblePerson.name')"
            :review-mode="reviewMode"
          >
            <UButton
              :label="application.responsiblePerson.name"
              variant="soft"
              size="sm"
              class="select-text"
            />
          </CompanyApplicationFormFieldUnderReview>

          <CompanyApplicationFormFieldUnderReview
            label="身分證字號"
            :status="getFieldVerificationStatus('responsiblePerson.idNumber')"
            :error="getFieldError('responsiblePerson.idNumber')"
            :review-mode="reviewMode"
          >
            <UButton
              :label="application.responsiblePerson.idNumber"
              variant="soft"
              size="sm"
              class="select-text"
            />
          </CompanyApplicationFormFieldUnderReview>

          <CompanyApplicationFormFieldUnderReview
            label="地址"
            :status="getFieldVerificationStatus('responsiblePerson.address')"
            :error="getFieldError('responsiblePerson.address')"
            :review-mode="reviewMode"
          >
            <UButton
              :label="application.responsiblePerson.address"
              variant="soft"
              size="sm"
              class="select-text"
            />
          </CompanyApplicationFormFieldUnderReview>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

interface ReviewIssue {
  id: string;
  fieldPath?: string;
  clientMessage: string;
  isResolved: boolean;
}

interface Props {
  application: any;
  readonly?: boolean;
  reviewMode?: boolean;
  reviewIssues?: ReviewIssue[];
}

const props = withDefaults(defineProps<Props>(), {
  readonly: true,
  reviewMode: false,
  reviewIssues: () => [],
});

const emit = defineEmits<{
  fieldIssue: [fieldPath: string, issue: Partial<ReviewIssue>];
}>();

const tabItems = ref<TabsItem[]>([
  {
    label: "公司基本資料",
    icon: "i-lucide-building",
    slot: "company-details",
  },
  {
    label: "負責人資料",
    icon: "i-lucide-user",
    slot: "responsible-person",
  },
  {
    label: "聯絡人資料",
    icon: "i-lucide-user",
    slot: "contact-person",
  },
  {
    label: "董事資料",
    icon: "i-lucide-user",
    slot: "director",
  },
  {
    label: "股東資料",
    icon: "i-lucide-users",
    slot: "shareholders",
  },
]);

// Field verification status tracking
const verifiedFields = ref<Set<string>>(new Set());

// Methods
const getFieldClasses = (fieldPath: string) => {
  if (!props.reviewMode) return "bg-gray-50";

  const hasIssue = props.reviewIssues?.some(
    (issue) => issue.fieldPath === fieldPath && !issue.isResolved
  );

  if (hasIssue) {
    return "bg-red-50 border-red-200";
  }

  const isVerified = verifiedFields.value.has(fieldPath);
  if (isVerified) {
    return "bg-green-50 border-green-200";
  }

  return "bg-gray-50 border-gray-200";
};

const getFieldError = (fieldPath: string) => {
  const issue = props.reviewIssues?.find(
    (issue) => issue.fieldPath === fieldPath && !issue.isResolved
  );
  return issue?.clientMessage || "";
};

const getFieldVerificationStatus = (fieldPath: string) => {
  if (verifiedFields.value.has(fieldPath)) {
    return "success";
  }

  const hasIssue = props.reviewIssues?.some(
    (issue) => issue.fieldPath === fieldPath && !issue.isResolved
  );

  if (hasIssue) {
    return "error";
  }

  return "neutral";
};

const getFieldVerificationLabel = (fieldPath: string) => {
  if (verifiedFields.value.has(fieldPath)) {
    return "已驗證";
  }

  const hasIssue = props.reviewIssues?.some(
    (issue) => issue.fieldPath === fieldPath && !issue.isResolved
  );

  if (hasIssue) {
    return "有問題";
  }

  return "驗證";
};

const verifyField = (fieldPath: string) => {
  if (verifiedFields.value.has(fieldPath)) {
    verifiedFields.value.delete(fieldPath);
  } else {
    verifiedFields.value.add(fieldPath);
  }
};

const addIssueToField = (fieldPath: string) => {
  emit("fieldIssue", fieldPath, {
    clientMessage: "請檢查此欄位的資料是否正確",
  });
};

const getOrganizationTypeLabel = (type: string | null) => {
  if (!type) return "未選擇";

  const labels = {
    limited_company: "有限公司",
    company_limited: "股份有限公司",
    sole_proprietorship: "獨資企業",
    partnership: "合夥企業",
  };
  return labels[type as keyof typeof labels] || type;
};
</script>
