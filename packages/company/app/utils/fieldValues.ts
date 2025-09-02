/**
 * Utility functions for extracting field values from application data for review purposes
 */

/**
 * Gets the value of a field from the application data using a dot-notation path
 */
export const getFieldValue = (application: any, fieldPath: string): any => {
  if (!application || !fieldPath) return undefined;

  // Handle special cases for nested objects
  const pathParts = fieldPath.split('.');
  
  // Handle section-based field paths
  if (pathParts.length >= 2) {
    const [section, field] = pathParts;
    
    switch (section) {
      case 'company':
        return getCompanyFieldValue(application, field);
      case 'business':
        return getBusinessFieldValue(application, field);
      case 'capital':
        return getCapitalFieldValue(application, field);
      case 'people':
        return getPeopleFieldValue(application, field);
      case 'shareholders':
        return getShareholdersFieldValue(application, field);
      case 'documents':
        return getDocumentsFieldValue(application, field);
      default:
        // Try direct path access for unknown sections
        return getNestedValue(application, fieldPath);
    }
  }
  
  // Direct field access
  return application[fieldPath];
};

/**
 * Formats a field value for display in the review interface
 */
export const formatFieldValue = (value: any, fieldPath: string): string => {
  if (value === null || value === undefined) return '📝 未提供';
  if (value === '') return '⚪ 空白';
  
  const pathParts = fieldPath.split('.');
  const field = pathParts[pathParts.length - 1];
  
  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return '📝 無項目';
    if (field === 'candidateNames') {
      return `📋 ${value.join('、')}`;
    }
    if (field === 'shareholders') {
      return `👥 ${value.length} 位股東`;
    }
    return `📋 ${value.length} 個項目`;
  }
  
  // Handle booleans
  if (typeof value === 'boolean') {
    return value ? '✅ 是' : '❌ 否';
  }
  
  // Handle numbers
  if (typeof value === 'number') {
    if (field.includes('Amount') || field.includes('capital')) {
      return `💰 ${value.toLocaleString('zh-TW', { style: 'currency', currency: 'TWD' })}`;
    }
    if (field.includes('Shares') || field.includes('shares')) {
      return `📈 ${value.toLocaleString()} 股`;
    }
    return `🔢 ${value.toString()}`;
  }
  
  // Handle objects (people, documents)
  if (typeof value === 'object') {
    if (value.name) return `👤 ${value.name}`;
    if (value.originalName) return `👤 ${value.originalName}`;
    if (value.title) return `📄 ${value.title}`;
    if (value.email) return `📧 ${value.email}`;
    if (value.phone) return `📞 ${value.phone}`;
    return '📋 複雜資料結構';
  }
  
  // Handle strings
  if (typeof value === 'string') {
    if (value.length > 100) {
      return `📝 ${value.substring(0, 100)}...`;
    }
    return `📝 ${value}`;
  }
  
  return String(value);
};

// Helper functions for specific sections
function getCompanyFieldValue(application: any, field: string): any {
  switch (field) {
    case 'candidateNames':
      return application.candidateNames;
    case 'organizationType':
      return application.organizationType;
    case 'isCloselyHeld':
      return application.isCloselyHeld;
    default:
      return application[field];
  }
}

function getBusinessFieldValue(application: any, field: string): any {
  switch (field) {
    case 'businessItemsDescription':
      return application.businessItemsDescription;
    case 'address':
      return application.address;
    default:
      return application[field];
  }
}

function getCapitalFieldValue(application: any, field: string): any {
  switch (field) {
    case 'capitalAmount':
      return application.capitalAmount;
    case 'authorizedShares':
      return application.authorizedShares;
    case 'ordinaryShares':
      return application.ordinaryShares;
    case 'preferredShares':
      return application.preferredShares;
    case 'hasParValueFreeShares':
      return application.hasParValueFreeShares;
    default:
      return application[field];
  }
}

function getPeopleFieldValue(application: any, field: string): any {
  switch (field) {
    case 'responsiblePerson':
      return application.responsiblePerson;
    case 'contactPerson':
      return application.contactPerson;
    case 'representative':
      return application.representative;
    default:
      return application[field];
  }
}

function getShareholdersFieldValue(application: any, field: string): any {
  switch (field) {
    case 'shareholders':
      return application.shareholders;
    default:
      return application[field];
  }
}

function getDocumentsFieldValue(application: any, field: string): any {
  // Documents are typically handled separately, but we can provide basic info
  return `Document field: ${field}`;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}