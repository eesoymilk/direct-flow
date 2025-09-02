/**
 * Field label mappings for better UX in review interfaces
 */
export const fieldLabels: Record<string, string> = {
  // Company section
  'company.candidateNames': 'Candidate Company Names',
  'company.chosenName': 'Chosen Company Name',
  'company.organizationType': 'Organization Type',
  'company.isCloselyHeld': 'Closely Held Corporation',

  // Business section
  'business.businessItemsDescription': 'Business Description',
  'business.address': 'Registered Address',

  // Capital section
  'capital.capitalAmount': 'Capital Amount',
  'capital.authorizedShares': 'Authorized Shares',
  'capital.ordinaryShares': 'Ordinary Shares',
  'capital.preferredShares': 'Preferred Shares',
  'capital.hasParValueFreeShares': 'Par Value Free Shares',

  // People section
  'people.responsiblePerson': 'Responsible Person',
  'people.contactPerson': 'Contact Person',
  'people.representative': 'Representative',

  // Shareholders section
  'shareholders.shareholders': 'Shareholders List',

  // Documents section
  'documents.documents': 'Required Documents',

  // Individual field fallbacks (without section prefix)
  candidateNames: 'Candidate Names',
  chosenName: 'Chosen Name',
  organizationType: 'Organization Type',
  isCloselyHeld: 'Closely Held',
  businessItemsDescription: 'Business Description',
  address: 'Address',
  capitalAmount: 'Capital Amount',
  authorizedShares: 'Authorized Shares',
  ordinaryShares: 'Ordinary Shares',
  preferredShares: 'Preferred Shares',
  hasParValueFreeShares: 'Par Value Free Shares',
  responsiblePerson: 'Responsible Person',
  contactPerson: 'Contact Person',
  representative: 'Representative',
  shareholders: 'Shareholders',
  documents: 'Documents'
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