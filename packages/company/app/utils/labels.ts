type Color =
  | "error"
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "neutral";

type PersonType =
  | "responsiblePerson"
  | "director"
  | "contactPerson"
  | "representative"
  | "shareholder";

export const getStatusLabel = (status: ApplicationStatus): string => {
  const labels: Record<ApplicationStatus, string> = {
    submitted: "已提交",
    staff_review: "審核中",
    pending_client_update: "待客戶更新",
    filing: "送件中",
    filed: "已送件",
    approved: "已核准",
    rejected: "已拒絕",
  };
  return labels[status] || status;
};

// Application Status Colors for UBadge
export const getStatusColor = (status: ApplicationStatus): Color => {
  const colors: Record<ApplicationStatus, Color> = {
    submitted: "info",
    staff_review: "warning",
    pending_client_update: "warning",
    filing: "primary",
    filed: "primary",
    approved: "success",
    rejected: "error",
  };
  return colors[status];
};

// Organization Type Labels
export const getOrganizationTypeLabel = (
  type: OrganizationType | null
): string => {
  if (!type) return "未選擇";

  const labels: Record<OrganizationType, string> = {
    company_limited: "股份有限公司",
    closely_held_company_limited: "閉鎖性股份有限公司",
    limited_company: "有限公司",
    sole_proprietorship: "獨資企業",
    partnership: "合夥企業",
  };
  return labels[type] || type;
};

// Review Issue Severity Labels
export const getSeverityLabel = (severity: ReviewIssueSeverity): string => {
  const labels: Record<ReviewIssueSeverity, string> = {
    low: "輕微",
    medium: "一般",
    high: "重要",
    critical: "嚴重",
  };
  return labels[severity] || severity;
};

// Review Issue Severity Colors
export const getSeverityColor = (severity: ReviewIssueSeverity): string => {
  const colors: Record<ReviewIssueSeverity, string> = {
    low: "blue",
    medium: "yellow",
    high: "orange",
    critical: "red",
  };
  return colors[severity] || "gray";
};

// Review Issue Type Labels
export const getIssueTypeLabel = (issueType: ReviewIssueType): string => {
  const labels: Record<ReviewIssueType, string> = {
    missing: "資料缺失",
    invalid: "資料無效",
    clarification: "需要澄清",
    modification: "需要修改",
  };
  return labels[issueType] || issueType;
};

// Person Type Labels
export const getPersonTypeLabel = (personType: PersonType): string => {
  const labels: Record<PersonType, string> = {
    responsiblePerson: "負責人",
    director: "董事",
    contactPerson: "聯絡人",
    representative: "代表人",
    shareholder: "股東",
  };
  return labels[personType] || personType;
};

// Field Path to Display Name Mapping
export const getFieldDisplayName = (fieldPath: string): string => {
  const fieldLabels: Record<string, string> = {
    // Company fields
    "company.candidateNames": "候選公司名稱",
    "company.chosenName": "選定名稱",
    "company.organizationType": "組織類型",
    "company.businessItemsDescription": "營業項目描述",
    "company.address": "公司地址",
    "company.capitalAmount": "資本額",
    "company.authorizedShares": "實收資本額股數",
    "company.ordinaryShares": "普通股",
    "company.preferredShares": "特別股",

    // Person fields (generic patterns)
    name: "姓名",
    idNumber: "身分證字號",
    address: "地址",
    telephone: "電話",
    cellphone: "手機",
    email: "電子郵件",
    shares: "持股數",
  };

  // Check for exact match first
  if (fieldLabels[fieldPath]) {
    return fieldLabels[fieldPath];
  }

  // Handle nested person fields (e.g., "responsiblePerson.name")
  if (fieldPath.includes(".")) {
    const [personType, field] = fieldPath.split(".");
    const personLabel = getPersonTypeLabel(personType);
    const fieldLabel = fieldLabels[field] || field;
    return `${personLabel} - ${fieldLabel}`;
  }

  return fieldPath;
};

// Date Formatting
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Currency Formatting
export const formatCurrency = (amount: number): string => {
  return `NT$ ${amount.toLocaleString()}`;
};

// Number Formatting
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Review Status Info (for Actions component)
export interface StatusInfo {
  title: string;
  description: string;
  icon: string;
  iconClass: string;
  textClass: string;
  bgClass: string;
}

export const getStatusInfo = (status: string): StatusInfo | null => {
  const statusInfo: Record<string, StatusInfo> = {
    submitted: {
      title: "已提交",
      description: "申請已提交，請等待審核。",
      icon: "i-lucide-file-text",
      iconClass: "text-slate-600",
      textClass: "text-slate-800",
      bgClass: "bg-slate-50 border-slate-200",
    },
    staff_review: {
      title: "審核中",
      description: "申請正在審核中，請等待審核結果。",
      icon: "i-lucide-clock",
      iconClass: "text-yellow-600",
      textClass: "text-yellow-800",
      bgClass: "bg-yellow-50 border-yellow-200",
    },
    pending_client_update: {
      title: "待客戶更新",
      description: "申請需要客戶更新資料，請等待客戶更新後再審核。",
      icon: "i-lucide-edit",
      iconClass: "text-blue-600",
      textClass: "text-blue-800",
      bgClass: "bg-blue-50 border-blue-200",
    },
    approved: {
      title: "核准申請",
      description: "申請將被標記為已核准，客戶將收到核准通知。",
      icon: "i-lucide-check-circle",
      iconClass: "text-green-600",
      textClass: "text-green-800",
      bgClass: "bg-green-50 border-green-200",
    },
    rejected: {
      title: "拒絕申請",
      description: "申請將被拒絕，客戶將收到拒絕通知及詳細原因。",
      icon: "i-lucide-x-circle",
      iconClass: "text-red-600",
      textClass: "text-red-800",
      bgClass: "bg-red-50 border-red-200",
    },
    filing: {
      title: "政府部門審核中",
      description: "申請已提交至政府部門審核，請等待審核結果。",
      icon: "i-lucide-edit",
      iconClass: "text-blue-600",
      textClass: "text-blue-800",
      bgClass: "bg-blue-50 border-blue-200",
    },
    filed: {
      title: "已立案",
      description: "申請已立案，請等待政府部門審核。",
      icon: "i-lucide-file-text",
      iconClass: "text-slate-600",
      textClass: "text-slate-800",
      bgClass: "bg-slate-50 border-slate-200",
    },
  };

  return statusInfo[status] || null;
};

// Select Options for Forms
export const statusSelectOptions = [
  { label: "審核中", value: "staff_review" },
  { label: "待客戶更新", value: "pending_client_update" },
  { label: "政府部門審核中", value: "filing" },
  { label: "已立案", value: "filed" },
  { label: "拒絕申請", value: "rejected" },
  { label: "核准申請", value: "approved" },
];

export const organizationTypeSelectOptions = [
  { label: "股份有限公司", value: "company_limited" },
  { label: "閉鎖性股份有限公司", value: "closely_held_company_limited" },
  { label: "有限公司", value: "limited_company" },
  { label: "獨資企業", value: "sole_proprietorship" },
  { label: "合夥企業", value: "partnership" },
];
