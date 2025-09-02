/**
 * Field label mappings for better UX in review interfaces
 */
export const fieldLabels: Record<string, string> = {
  // Company section
  'company.candidateNames': '候選公司名稱',
  'company.chosenName': '選定公司名稱',
  'company.organizationType': '組織型態',
  'company.isCloselyHeld': '閉鎖性公司',

  // Business section
  'business.businessItemsDescription': '營業項目描述',
  'business.address': '登記地址',

  // Capital section
  'capital.capitalAmount': '資本額',
  'capital.authorizedShares': '核准股數',
  'capital.ordinaryShares': '普通股數',
  'capital.preferredShares': '特別股數',
  'capital.hasParValueFreeShares': '無面額股',

  // People section
  'people.responsiblePerson': '負責人',
  'people.contactPerson': '聯絡人',
  'people.representative': '代表人',

  // Shareholders section
  'shareholders.shareholders': '股東名單',

  // Documents section
  'documents.documents': '必要文件',

  // Individual field fallbacks (without section prefix)
  candidateNames: '候選名稱',
  chosenName: '選定名稱',
  organizationType: '組織型態',
  isCloselyHeld: '閉鎖性公司',
  businessItemsDescription: '營業項目描述',
  address: '地址',
  capitalAmount: '資本額',
  authorizedShares: '核准股數',
  ordinaryShares: '普通股數',
  preferredShares: '特別股數',
  hasParValueFreeShares: '無面額股',
  responsiblePerson: '負責人',
  contactPerson: '聯絡人',
  representative: '代表人',
  shareholders: '股東',
  documents: '文件'
};

export const getFieldLabel = (fieldPath: string): string => {
  // First try exact match
  if (fieldLabels[fieldPath]) {
    return fieldLabels[fieldPath];
  }

  // Try without section prefix
  const fieldName = fieldPath.split('.').pop();
  if (fieldName && fieldLabels[fieldName]) {
    return fieldLabels[fieldName];
  }

  // Fallback: convert camelCase to Title Case
  if (fieldName) {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  return fieldPath;
};