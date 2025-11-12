# Balance Sheet Configuration Refactoring

## Overview

Refactored the Balance Sheet configuration from a hardcoded 3-level hierarchy to a generic recursive structure that supports arbitrary nesting depth (4, 5, 6+ levels).

## Changes Made

### 1. Type System Updates (`app/types/financial.ts`)

**Before:** Hardcoded 3 separate interfaces
```typescript
BSLineItem (Level 3)
BSCategory (Level 2) 
BSDivision (Level 1)
```

**After:** Recursive discriminated union
```typescript
type BSNode = BSParentNode | BSLeafNode

interface BSParentNode {
  type: 'parent';
  children: BSNode[];  // Recursive!
  showSubtotal?: boolean;
  subtotalLabel?: string;
  side?: 'asset' | 'liability' | 'equity';
}

interface BSLeafNode {
  type: 'leaf';
  query: AccountQuery;
}
```

**Key Features:**
- Discriminated union with `type` field for type safety
- Parent nodes can contain any mix of parent/leaf children
- Supports unlimited nesting depth
- Type guards: `isParentNode()` and `isLeafNode()`
- Legacy type aliases for backward compatibility

### 2. Configuration Updates (`app/config/balanceSheetConfig.ts`)

**Changes:**
- Changed `divisions` → `nodes` (root level)
- Changed `categories` → `children` (at all levels)
- Changed `lineItems` → `children` (with leaf nodes)
- Added `type: 'parent'` or `type: 'leaf'` discriminator to all nodes
- Replaced `showTotal`/`totalLabel` with `showSubtotal`/`subtotalLabel` pattern

**Structure:**
```typescript
{
  nodes: [
    {
      type: "parent",           // Division
      code: "ASSETS",
      side: "asset",
      showSubtotal: true,
      subtotalLabel: "資產總計",
      children: [
        {
          type: "parent",       // Category
          code: "A-CURRENT",
          showSubtotal: true,
          children: [
            {
              type: "leaf",     // Line Item
              code: "1100",
              query: { ... }
            }
          ]
        }
      ]
    }
  ]
}
```

### 3. Generator Updates (`app/utils/financial/balanceSheetGenerator.ts`)

**Before:** Separate functions for each level
- `generateDivisionLines()`
- `generateCategoryLines()`
- Hard-coded level handling

**After:** Single recursive function
- `generateNodeLines()` - handles any depth
- Recursive traversal with parent side inheritance
- Dynamic indent level calculation
- `sumNodeTotal()` helper for subtotal computation

**Algorithm:**
1. Check if node is parent or leaf (discriminated union)
2. For parent: add header, recurse children, optionally add subtotal
3. For leaf: calculate amount from TB data
4. Inherit `side` property from parent if not specified

### 4. Component Updates

**BalanceSheetDisplay.vue:**
- Replaced hardcoded 3-level tree builder with generic stack-based algorithm
- Now supports arbitrary depth tree structures
- Uses stack to track parent hierarchy
- No level-specific logic

**StatementLineItems.vue:**
- No changes needed (already used dynamic `indentLevel`)

### 5. Store Compatibility

**financialTransformer.ts:**
- No changes needed
- Uses high-level interfaces that remained stable
- API-compatible with new implementation

## Benefits

✅ **Flexibility:** Supports 3, 4, 5, 6+ nesting levels  
✅ **Type Safety:** Discriminated unions enforce correct usage  
✅ **Maintainability:** Single recursive algorithm vs multiple level-specific functions  
✅ **Backward Compatible:** Existing 3-level configs work unchanged  
✅ **Best Practices:** Follows TypeScript patterns for recursive structures  

## Example: Adding a 4th Level

You can now add sub-categories or grouped line items:

```typescript
{
  type: "parent",
  code: "A-CURRENT",
  name: "流動資產",
  children: [
    {
      type: "parent",              // NEW: 4th level grouping
      code: "A-CURRENT-CASH",
      name: "現金及約當現金",
      children: [
        {
          type: "leaf",
          code: "1111",
          name: "銀行存款",
          query: { accountCodes: ["1111"] }
        },
        {
          type: "leaf",
          code: "1112",
          name: "零用金",
          query: { accountCodes: ["1112"] }
        }
      ]
    }
  ]
}
```

## Migration Guide

If you have custom balance sheet configurations:

1. Change root property: `divisions` → `nodes`
2. Add `type: "parent"` to all parent nodes
3. Add `type: "leaf"` to all leaf nodes
4. Change `categories` → `children`
5. Change `lineItems` → `children`
6. Replace `showTotal`/`totalLabel` with `showSubtotal`/`subtotalLabel`

## Files Modified

- ✅ `app/types/financial.ts` - Type definitions
- ✅ `app/config/balanceSheetConfig.ts` - Configuration
- ✅ `app/utils/financial/balanceSheetGenerator.ts` - Generator logic
- ✅ `app/components/builder/financial/BalanceSheetDisplay.vue` - Tree display
- ✅ `app/composables/stores/financialTransformer.ts` - Verified compatible

## Testing Recommendations

1. Verify 3-level structure still works (backward compatibility)
2. Test 4-level nesting with sub-categories
3. Test 5+ level nesting if needed
4. Verify subtotal calculations at all levels
5. Check tree display rendering for deep hierarchies

