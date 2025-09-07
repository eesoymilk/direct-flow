/**
 * Share-specific validation composable
 * Provides business rule validation for share holdings and applications
 */

export const useShareValidation = () => {
  // Share type validation
  const validateShareType = (shareType: string) => {
    const { shareTypes } = useShareTypes();
    const validTypes = shareTypes.value.map(t => t.code);
    return {
      isValid: validTypes.includes(shareType),
      error: validTypes.includes(shareType) ? null : '請選擇有效的股票類型',
    };
  };

  // Share quantity validation
  const validateShareQuantity = (quantity: number, shareType?: string) => {
    const errors: string[] = [];
    
    if (!Number.isInteger(quantity) || quantity <= 0) {
      errors.push('股數必須為大於0的整數');
    }
    
    if (quantity > 1000000000) { // 10億股上限
      errors.push('股數不能超過10億股');
    }

    // Business rules for different share types
    if (shareType === 'ordinary' && quantity < 1) {
      errors.push('普通股數量至少為1股');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Share price validation
  const validateSharePrice = (price: number, shareType?: string) => {
    const errors: string[] = [];
    
    if (price <= 0) {
      errors.push('股價必須大於0');
    }
    
    if (price > 100000) { // 10萬元上限
      errors.push('股價不能超過100,000元');
    }

    // Minimum price requirements
    if (price < 0.01) {
      errors.push('股價不能少於0.01元');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Individual share holding validation
  const validateShareHolding = (holding: ShareHolding) => {
    const errors: string[] = [];
    
    // Share type validation
    const shareTypeResult = validateShareType(holding.shareType);
    if (!shareTypeResult.isValid) {
      errors.push(shareTypeResult.error!);
    }

    // Quantity validation
    const quantityResult = validateShareQuantity(holding.quantity, holding.shareType);
    if (!quantityResult.isValid) {
      errors.push(...quantityResult.errors);
    }

    // Price validation
    const priceResult = validateSharePrice(holding.pricePerShare, holding.shareType);
    if (!priceResult.isValid) {
      errors.push(...priceResult.errors);
    }

    // Total amount consistency
    const expectedTotal = holding.quantity * holding.pricePerShare;
    if (Math.abs(holding.totalAmount - expectedTotal) > 0.01) {
      errors.push('股款總額計算不正確');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Multiple holdings validation (for one shareholder)
  const validateShareholderHoldings = (holdings: ShareHolding[]) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (holdings.length === 0) {
      errors.push('至少需要一筆持股記錄');
      return { isValid: false, errors, warnings };
    }

    // Check for duplicate share types
    const shareTypeCounts = new Map<string, number>();
    holdings.forEach(holding => {
      const count = shareTypeCounts.get(holding.shareType) || 0;
      shareTypeCounts.set(holding.shareType, count + 1);
    });

    for (const [shareType, count] of shareTypeCounts) {
      if (count > 1) {
        errors.push(`不能持有重複的${useShareTypes().getShareTypeName(shareType)}`);
      }
    }

    // Validate each individual holding
    holdings.forEach((holding, index) => {
      const result = validateShareHolding(holding);
      if (!result.isValid) {
        errors.push(`第${index + 1}筆持股: ${result.errors.join(', ')}`);
      }
    });

    // Business rule validations
    const totalInvestment = holdings.reduce((sum, h) => sum + h.totalAmount, 0);
    
    if (totalInvestment === 0) {
      errors.push('總投資金額不能為0');
    }

    if (totalInvestment > 1000000000) { // 10億元上限
      warnings.push('總投資金額超過10億元，請確認是否正確');
    }

    // Check if shareholder has ordinary shares
    const hasOrdinary = holdings.some(h => h.shareType === 'ordinary');
    if (!hasOrdinary) {
      warnings.push('建議至少持有一種普通股');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      totalInvestment,
    };
  };

  // Application-level validation
  const validateApplicationShares = (
    shareholders: ApplicationShareholder[],
    allHoldings: ShareHolding[]
  ) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic structure validation
    if (shareholders.length === 0) {
      errors.push('至少需要一位股東');
    }

    if (allHoldings.length === 0) {
      errors.push('至少需要一筆持股記錄');
    }

    // Check each shareholder has holdings
    const shareholdersWithoutHoldings = shareholders.filter(
      shareholder => !allHoldings.some(holding => holding.shareholderId === shareholder.id)
    );

    if (shareholdersWithoutHoldings.length > 0) {
      errors.push(`${shareholdersWithoutHoldings.length} 位股東尚未設定持股`);
    }

    // Validate holdings by shareholder
    shareholders.forEach(shareholder => {
      const shareholderHoldings = allHoldings.filter(
        holding => holding.shareholderId === shareholder.id
      );
      
      if (shareholderHoldings.length > 0) {
        const result = validateShareholderHoldings(shareholderHoldings);
        if (!result.isValid) {
          errors.push(`${shareholder.person.name}: ${result.errors.join(', ')}`);
        }
        warnings.push(...result.warnings.map(w => `${shareholder.person.name}: ${w}`));
      }
    });

    // Application-wide business rules
    const totalCapital = allHoldings.reduce((sum, h) => sum + h.totalAmount, 0);
    
    if (totalCapital < 500000) { // 50萬最低資本額
      warnings.push('總資本額低於法定最低資本額(500,000元)');
    }

    // Check ownership distribution
    const shareholderTotals = new Map<string, number>();
    allHoldings.forEach(holding => {
      const current = shareholderTotals.get(holding.shareholderId) || 0;
      shareholderTotals.set(holding.shareholderId, current + holding.totalAmount);
    });

    // Check for majority ownership
    const maxOwnership = Math.max(...shareholderTotals.values());
    const maxOwnershipPercent = totalCapital > 0 ? (maxOwnership / totalCapital) * 100 : 0;
    
    if (maxOwnershipPercent > 50) {
      warnings.push('單一股東持股超過50%，可能影響公司治理');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      totalCapital,
      shareholderCount: shareholders.length,
      maxOwnershipPercent,
    };
  };

  // Corporation type validation
  const validateCorporationType = (
    organizationType: string,
    isCloselyHeld?: boolean,
    hasParValueFreeShares?: boolean,
    holdings?: ShareHolding[]
  ) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (organizationType !== 'corporation') {
      return { isValid: true, errors, warnings }; // Only validate for corporations
    }

    // Closely held company validations
    if (isCloselyHeld) {
      if (holdings && holdings.length > 0) {
        const totalShares = holdings.reduce((sum, h) => sum + h.quantity, 0);
        if (totalShares > 500) { // Closely held limit
          errors.push('閉鎖型公司股東人數不得超過500人');
        }
      }
    }

    // Par value free shares validations
    if (hasParValueFreeShares) {
      if (holdings) {
        const hasVariablePrices = holdings.some((h1, i) => 
          holdings.some((h2, j) => 
            i !== j && 
            h1.shareType === h2.shareType && 
            h1.pricePerShare !== h2.pricePerShare
          )
        );
        
        if (!hasVariablePrices) {
          warnings.push('無票面金額股份通常具有不同的價格設定');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  };

  return {
    validateShareType,
    validateShareQuantity,
    validateSharePrice,
    validateShareHolding,
    validateShareholderHoldings,
    validateApplicationShares,
    validateCorporationType,
  };
};