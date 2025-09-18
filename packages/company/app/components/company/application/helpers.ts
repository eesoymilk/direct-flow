// Review section name mappings
export const getSectionName = (sectionKey: string): string => {
  const sectionNames: Record<string, string> = {
    companyBasicInfo: "公司基本資料",
    companyBusinessItems: "營業項目",
    companyMonetaryInfo: "資本額資料",
    responsiblePerson: "負責人",
    contactPerson: "聯絡人",
    shareholders: "股東",
    documents: "必要文件",
  };
  return sectionNames[sectionKey] || sectionKey;
};

// Field display name mappings
export const getFieldDisplayName = (fieldPath: string): string => {
  // First try to match the full path
  const fullPathNames: Record<string, string> = {
    // Company nested fields
    "company.candidateNames": "公司候選名稱",
    "company.name": "公司名稱",
    "company.organizationType": "組織型態",
    "company.businessItemsDescription": "營業項目描述",
    "company.address": "公司地址",
    "company.capitalAmount": "資本額",
    "company.ordinaryShares": "普通股數",
    "company.preferredShares": "特別股數",
    "company.parValue": "每股面額",

    // Responsible person nested fields
    "responsiblePerson.name": "負責人姓名",
    "responsiblePerson.idNumber": "負責人身分證字號",
    "responsiblePerson.birthDate": "負責人出生日期",
    "responsiblePerson.phone": "負責人電話",
    "responsiblePerson.email": "負責人電子郵件",
    "responsiblePerson.idCardFront": "負責人身分證正面",
    "responsiblePerson.idCardBack": "負責人身分證背面",

    // Contact person nested fields
    "contactPerson.name": "聯絡人姓名",
    "contactPerson.idNumber": "聯絡人身分證字號",
    "contactPerson.birthDate": "聯絡人出生日期",
    "contactPerson.phone": "聯絡人電話",
    "contactPerson.email": "聯絡人電子郵件",
    "contactPerson.idCardFront": "聯絡人身分證正面",
    "contactPerson.idCardBack": "聯絡人身分證背面",

    // Shareholder nested fields (with index)
    // These will be handled by pattern matching below

    // Document nested fields
    "documents.bankBookFront": "公司存摺正面",
    "documents.bankBookInside": "公司存摺內頁",
    "documents.bankBookStamp": "公司存摺戳章頁",
    "documents.balanceProof": "餘額證明",
    "documents.shareholderPayments": "股東匯款資料",
    "documents.shareholderAgreement": "股東同意書",
    "documents.houseUseAgreement": "房屋使用同意書",
    "documents.directorConsent": "董監事願任同意書",
    "documents.declaration": "聲明書",
    "documents.legalPersonDeclaration": "法人聲明書",
  };

  // Check for exact full path match first
  if (fullPathNames[fieldPath]) {
    return fullPathNames[fieldPath];
  }

  // Handle shareholder array patterns like "shareholders.0.name" or "shareholders.0.idCardFront"
  const shareholderMatch = fieldPath.match(/^shareholders(\[\d+\])\.(.+)$/);
  if (shareholderMatch && shareholderMatch[1] && shareholderMatch[2]) {
    const shareholderIndex = parseInt(
      shareholderMatch[1].replace("[", "").replace("]", "")
    );
    const field = shareholderMatch[2];
    const shareholderNumber = shareholderIndex + 1; // Convert to 1-based for display

    const shareholderFieldNames: Record<string, string> = {
      name: "姓名",
      idNumber: "身分證字號",
      birthDate: "出生日期",
      phone: "電話",
      email: "電子郵件",
      shareholdingRatio: "持股比例",
      investmentAmount: "投資金額",
      idCardFront: "身分證正面",
      idCardBack: "身分證背面",
    };

    const fieldLabel = shareholderFieldNames[field] || field;
    return `股東 ${shareholderNumber} ${fieldLabel}`;
  }

  // Handle other array patterns like "businessItems.0"
  const arrayMatch = fieldPath.match(/^(\w+)(\[\d+\])(?:\.(.+))?$/);
  if (arrayMatch && arrayMatch[1] && arrayMatch[2] !== undefined) {
    const arrayName = arrayMatch[1];
    const index = parseInt(arrayMatch[2].replace("[", "").replace("]", ""));
    const subField = arrayMatch[3];

    const arrayDisplayNames: Record<string, string> = {
      businessItems: "營業項目",
      candidateNames: "候選名稱",
    };

    const arrayLabel = arrayDisplayNames[arrayName] || arrayName;
    const itemNumber = index + 1;

    if (subField) {
      // If there's a sub-field, get its display name
      const parts = fieldPath.split(".");
      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        const subFieldLabel = getLastPartFieldName(lastPart);
        return `${arrayLabel} ${itemNumber} ${subFieldLabel}`;
      }
    }
    return `${arrayLabel} ${itemNumber}`;
  }

  // Fallback to last part matching
  const parts = fieldPath.split(".");
  const lastPart = parts[parts.length - 1];

  if (!lastPart) {
    return fieldPath;
  }

  return getLastPartFieldName(lastPart);
};

// Helper function for last part field name mapping
const getLastPartFieldName = (fieldName: string): string => {
  const fieldNames: Record<string, string> = {
    // Document fields
    idCardFront: "身分證正面",
    idCardBack: "身分證背面",
    bankBookFront: "公司存摺正面",
    bankBookInside: "公司存摺內頁",
    bankBookStamp: "公司存摺戳章頁",
    balanceProof: "餘額證明",
    shareholderPayments: "股東匯款資料",
    shareholderAgreement: "股東同意書",
    houseUseAgreement: "房屋使用同意書",
    directorConsent: "董監事願任同意書",
    declaration: "聲明書",
    legalPersonDeclaration: "法人聲明書",

    // Company basic info fields
    companyName: "公司名稱",
    candidateNames: "候選名稱",
    organizationType: "組織型態",
    businessItemsDescription: "營業項目描述",
    address: "公司地址",

    // Person fields
    name: "姓名",
    idNumber: "身分證字號",
    birthDate: "出生日期",
    phone: "電話號碼",
    email: "電子郵件",

    // Monetary fields
    capital: "資本額",
    ordinaryShares: "普通股數",
    preferredShares: "特別股數",
    parValue: "每股面額",

    // Shareholder fields
    shareholdingRatio: "持股比例",
    investmentAmount: "投資金額",

    // Business fields
    businessItems: "營業項目",
  };

  return fieldNames[fieldName] ?? fieldName;
};

// Issue type label mappings
export const getIssueTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    missing: "缺少文件",
    invalid: "資料無效",
    clarification: "需要澄清",
    modification: "需要修改",
  };
  return labels[type] || type;
};

// Severity label mappings
export const getSeverityLabel = (severity: string): string => {
  const labels: Record<string, string> = {
    critical: "嚴重",
    high: "高",
    medium: "中",
    low: "低",
  };
  return labels[severity] || severity;
};

// Severity color mappings
export const getSeverityColor = (severity: string) => {
  const colors: Record<string, "error" | "warning" | "info" | "neutral"> = {
    critical: "error",
    high: "warning",
    medium: "info",
    low: "neutral",
  };
  return colors[severity] ?? "neutral";
};

// Review round status mappings
export const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    reviewing: "審查中",
    resolved: "已通過",
    completed: "已完成",
  };
  return labels[status] || status;
};

export const getStatusColor = (status: string) => {
  const colors: Record<string, "warning" | "success" | "neutral"> = {
    reviewing: "warning",
    resolved: "success",
    completed: "neutral",
  };
  return colors[status] || "neutral";
};
