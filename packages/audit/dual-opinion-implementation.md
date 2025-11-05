# Dual Audit Opinion Implementation Plan

## Overview

This document outlines the implementation plan for handling different audit opinions across comparative years in the audit system, as specified in 審計準則公報第72號.

## Problem Statement

When comparative financial statements are presented, there can be rare cases where the audit opinions for the two years differ. For example:
- X1 year: Unqualified opinion (無保留意見)
- X2 year: Adverse opinion (否定意見)

As detailed in the examples (第19頁範例), when audit opinions differ across years, the report structure changes significantly:

### Structural Changes Required

1. **Title Changes**: Combines both opinion types (e.g., "無保留意見及保留意見")
2. **Opinion Section Splits**: Separate sub-headings for each year
   - "對民國一一○年度財務報表表示無保留意見"
   - "對民國一○九年度財務報表表示保留意見"
3. **Opinion Basis Section Splits**: When one year has "無法表示意見", each year gets its own sub-section
4. **Different Paragraph Structure**: Each year's opinion is stated separately with year-specific language

## Reference Examples

### Example 1: Unqualified + Qualified Opinion

```
無保留意見及保留意見

[Introductory paragraph about both years' financial statements]

對民國一一○年度財務報表表示無保留意見

依本會計師之意見，上開財務報表在所有重大方面係依照商業會計法及商業會計處理準則中與財務會計相關之規定暨財團法人中華民國會計研究發展基金會所公開之各號企業會計準則公報及其解釋編製，足以允當表達普賢企業有限公司民國一一○年十二月三十一日之財務狀況，暨民國一一○年一月一日至十二月三十一日之財務績效及現金流量。

對民國一○九年度財務報表表示保留意見

依本會計師之意見，除保留意見之基礎段所述事項之可能影響外，上開財務報表在所有重大方面係依照商業會計法中與財務報表編製有關之規定、商業會計處理準則暨企業會計準則公報及其解釋編製，足以允當表達普賢企業有限公司民國一○九年十二月三十一日，暨民國一○九年一月一日至十二月三十一日之財務績效及現金流量。

無保留意見及保留意見之基礎

<自行輸入保留意見理由>

[Standard basis paragraph]
```

### Example 2: Disclaimer + Unqualified Opinion (Split Basis)

```
無法表示意見及無保留查核意見

對民國一一○年度財務報表無法表示意見

本會計師受委任查核甲股份有限公司民國一一○年十二月三十一日之資產負債表，暨民國一一○年一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表，以及財務報表附註（包括重大會計政策彙總）。

本會計師對上開財務報表無法表示意見。由於無法表示意見之基礎段所述事項之可能影響重大，本會計師無法取得足夠及適切之查核證據，以作為表示查核意見之基礎。

對民國一○九年度財務報表表示無保留意見

甲股份有限公司民國一○九年十二月三十一日之資產負債表，暨民國一○九年一月一日至十二月三十一日之綜合損益表、權益變動表及現金流量表，以及財務報表附註（包括重大會計政策彙總），業經本會計師查核竣事。

依本會計師之意見，上開財務報表在所有重大方面係依照商業會計法及商業會計處理準則中與財務會計相關之規定暨財團法人中華民國會計研究發展基金會所公開之各號企業會計準則公報及其解釋編製，足以允當表達甲股份有限公司民國一○九年十二月三十一日之財務狀況，暨民國一○九年一月一日至十二月三十一日之財務績效及現金流量。

無法表示意見及無保留意見之基礎

對民國一一○年度財務報表無法表示意見之基礎

<自行輸入無法表示意見理由>

對民國一○九年度財務報表表示無保留意見之基礎

[Standard basis paragraph]
```

---

## Implementation Plan

### Phase 1: Data Model & Type System ✅

#### 1.1 Enhanced Opinion Type Structure

**File**: `packages/audit/shared/types/audit-report.ts`

```typescript
// Year-specific opinion data
export type YearOpinion = {
  year: number; // ROC year
  opinionType: OpinionType;
  reason?: string;
  materialAmount?: number;
};

// Opinion configuration supporting both single and dual opinions
export type OpinionConfiguration =
  | { mode: 'single'; opinion: YearOpinion }
  | { mode: 'dual'; currentYear: YearOpinion; comparativeYear: YearOpinion };

// Dual opinion title combinations
export type DualOpinionTitleType =
  | 'unqualified-qualified'
  | 'unqualified-adverse'
  | 'unqualified-disclaimer'
  | 'qualified-adverse'
  | 'qualified-disclaimer'
  | 'adverse-disclaimer';
```

**Rationale**:
- Discriminated union prevents invalid states (dual opinions for non-comparative reports)
- Year-specific opinion tracking with type safety
- Supports all possible dual opinion combinations from examples

#### 1.2 Validation Schema Updates

**File**: `packages/audit/app/utils/schemas/audit.ts`

```typescript
// Year opinion schema
export const yearOpinionSchema = z.object({
  year: z.number(),
  opinionType: z.enum(OPINION_TYPES),
  reason: z.string().optional(),
  materialAmount: z.number().optional(),
});

// Opinion configuration with discriminated union
export const opinionInfoSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('single'),
    opinion: yearOpinionSchema,
    // ... other options ...
  }),
  z.object({
    mode: z.literal('dual'),
    currentYear: yearOpinionSchema,
    comparativeYear: yearOpinionSchema,
    // ... other options ...
  }),
]).superRefine((data, ctx) => {
  // Validation: reasons required for non-unqualified opinions
  if (data.mode === 'single') {
    if (data.opinion.opinionType !== 'unqualified' && !data.opinion.reason) {
      ctx.addIssue({
        code: 'custom',
        message: '非無保留意見需要提供理由',
        path: ['opinion', 'reason'],
      });
    }
  } else {
    if (data.currentYear.opinionType !== 'unqualified' && !data.currentYear.reason) {
      ctx.addIssue({
        code: 'custom',
        message: '當期非無保留意見需要提供理由',
        path: ['currentYear', 'reason'],
      });
    }
    if (data.comparativeYear.opinionType !== 'unqualified' && !data.comparativeYear.reason) {
      ctx.addIssue({
        code: 'custom',
        message: '比較期非無保留意見需要提供理由',
        path: ['comparativeYear', 'reason'],
      });
    }
  }
});

// Report data schema with cross-field validation
export const auditReportDataSchema = z.object({
  basicInfo: basicInfoSchema,
  opinionInfo: opinionInfoSchema,
}).superRefine((data, ctx) => {
  // Validate dual opinions only allowed with comparative reports
  if (data.opinionInfo.mode === 'dual' && !data.basicInfo.isComparativeReport) {
    ctx.addIssue({
      code: 'custom',
      message: '雙意見模式僅適用於比較式財務報表',
      path: ['opinionInfo', 'mode'],
    });
  }

  // Validate year consistency
  if (data.opinionInfo.mode === 'dual') {
    const expectedCurrentYear = data.basicInfo.currentRocYear;
    const expectedComparativeYear = expectedCurrentYear ? expectedCurrentYear - 1 : undefined;

    if (data.opinionInfo.currentYear.year !== expectedCurrentYear) {
      ctx.addIssue({
        code: 'custom',
        message: `當期年度應為 ${expectedCurrentYear}`,
        path: ['opinionInfo', 'currentYear', 'year'],
      });
    }

    if (data.opinionInfo.comparativeYear.year !== expectedComparativeYear) {
      ctx.addIssue({
        code: 'custom',
        message: `比較期年度應為 ${expectedComparativeYear}`,
        path: ['opinionInfo', 'comparativeYear', 'year'],
      });
    }
  }
});
```

**Rationale**:
- Discriminated union ensures type safety between single/dual modes
- Cross-field validation ensures data consistency
- Year validation prevents mismatched year configurations
- Required reason fields for modified opinions

---

### Phase 2: Opinion Title & Section Generation Logic 🔧

#### 2.1 Helper Functions and Constants

**File**: `packages/audit/app/utils/audit/sections/opinion.ts`

```typescript
// Opinion type labels (qualified types map to same title)
const opinionSectionTitleMap: Record<OpinionType | 'qualified', string> = {
  unqualified: '無保留意見',
  qualified: '保留意見', // Both qualifiedDisclaimer and qualifiedAdverse map here
  qualifiedDisclaimer: '保留意見',
  qualifiedAdverse: '保留意見',
  adverse: '否定意見',
  disclaimer: '無法表示意見',
};

// Dual opinion title combinations
const dualOpinionTitleMap: Record<DualOpinionTitleType, string> = {
  'unqualified-qualified': '無保留意見及保留意見',
  'unqualified-adverse': '無保留意見及否定意見',
  'unqualified-disclaimer': '無保留意見及無法表示意見',
  'qualified-adverse': '保留意見及否定意見',
  'qualified-disclaimer': '保留意見及無法表示意見',
  'adverse-disclaimer': '否定意見及無法表示意見',
};

// Get simplified opinion type (maps qualified-* to 'qualified')
const getSimplifiedOpinionType = (opinionType: OpinionType): OpinionType | 'qualified' => {
  if (opinionType === 'qualifiedDisclaimer' || opinionType === 'qualifiedAdverse') {
    return 'qualified';
  }
  return opinionType;
};

// Get dual opinion title key
const getDualOpinionTitleKey = (
  currentOpinion: OpinionType,
  comparativeOpinion: OpinionType
): DualOpinionTitleType => {
  const current = getSimplifiedOpinionType(currentOpinion);
  const comparative = getSimplifiedOpinionType(comparativeOpinion);

  // Sort to ensure consistent key ordering
  const sorted = [current, comparative].sort();
  return `${sorted[0]}-${sorted[1]}` as DualOpinionTitleType;
};
```

**Rationale**:
- Normalizes qualified types (qualifiedDisclaimer and qualifiedAdverse both → "保留意見")
- Alphabetical sorting ensures consistent dual title generation
- Single source of truth for opinion labels

#### 2.2 Opinion Section Title Generator

```typescript
// Enhanced title generator
export const getOpinionSectionTitle = (
  opinionConfig?: OpinionConfiguration
): string => {
  if (!opinionConfig) {
    return '[[空白的查核意見標題]]';
  }

  if (opinionConfig.mode === 'single') {
    const simplified = getSimplifiedOpinionType(opinionConfig.opinion.opinionType);
    return opinionSectionTitleMap[simplified];
  }

  // Dual mode
  const titleKey = getDualOpinionTitleKey(
    opinionConfig.currentYear.opinionType,
    opinionConfig.comparativeYear.opinionType
  );
  return dualOpinionTitleMap[titleKey];
};
```

**Rationale**:
- Handles both single and dual opinion modes
- Returns correct combined title for dual opinions
- Graceful fallback for missing data

#### 2.3 Year-Specific Sub-heading Generator

```typescript
// Generate year-specific opinion sub-heading
const generateYearOpinionSubheading = (
  year: number,
  opinionType: OpinionType,
  highlightVariable: boolean
): DocumentParagraph => {
  const simplified = getSimplifiedOpinionType(opinionType);
  const opinionText = opinionSectionTitleMap[simplified];

  const parts = [
    { text: '對民國' },
    { text: getRocYearText(year), color: 'blue' },
    { text: '年度財務報表表示' },
    { text: opinionText, color: 'blue' },
  ];

  return highlightVariable
    ? { type: 'children', children: parts }
    : { type: 'text', text: parts.map(p => p.text).join('') };
};
```

**Rationale**:
- Matches exact format from examples: "對民國一一○年度財務報表表示無保留意見"
- Supports variable highlighting for UI preview
- Reuses existing helper functions for consistency

#### 2.4 Single-Year Opinion Paragraph Generator

```typescript
// Generate single-year opinion paragraph (for dual mode)
const generateSingleYearOpinionParagraph = ({
  entity,
  year,
  framework,
  opinionType,
  highlightVariable,
}: {
  entity: string;
  year: number;
  framework?: AccountingFramework;
  opinionType: OpinionType;
  highlightVariable: boolean;
}): DocumentParagraph => {
  // Special handling for disclaimer opinions
  if (opinionType === 'disclaimer') {
    return {
      type: 'text',
      text: '本會計師對上開財務報表無法表示意見。由於無法表示意見之基礎段所述事項之可能影響重大，本會計師無法取得足夠及適切之查核證據，以作為表示查核意見之基礎。',
    };
  }

  const lawDescription = getLawDescription(framework);
  const simplified = getSimplifiedOpinionType(opinionType);

  const parts = [
    { text: '依本會計師之意見，' },
    ...(simplified !== 'unqualified' ? [{
      text: simplified === 'adverse'
        ? '除否定意見之基礎段所述事項之影響外，'
        : '除保留意見之基礎段所述事項之可能影響外，',
      color: 'blue',
    }] : []),
    { text: '上開財務報表在所有重大方面係依照' },
    { text: lawDescription, color: 'blue' },
    { text: '編製，' },
    {
      text: simplified === 'adverse' ? '未能允當表達' : '足以允當表達',
      color: simplified === 'adverse' ? 'red' : undefined
    },
    { text: entity, color: 'blue' },
    { text: '民國' },
    { text: getRocYearText(year), color: 'blue' },
    { text: '年十二月三十一日之財務狀況，暨民國' },
    { text: getRocYearText(year), color: 'blue' },
    { text: '年一月一日至十二月三十一日之財務績效及現金流量。' },
  ];

  return highlightVariable
    ? { type: 'children', children: parts }
    : { type: 'text', text: parts.map(p => p.text).join('') };
};
```

**Rationale**:
- Year-specific version of opinion paragraph
- Handles disclaimer opinions with special text
- Uses simplified opinion type for text generation

#### 2.5 Enhanced Opinion Section Generator

```typescript
// Enhanced main opinion section generator
export const generateOpinionSection = (
  basicInfo: Partial<BasicInfoForm>,
  opinionInfo: OpinionConfiguration,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const entityLabel = getFormattedEntityName(
    basicInfo.entityName,
    basicInfo.isConsolidatedReport
  );

  const children: DocumentParagraph[] = [
    {
      type: 'children',
      children: [{
        text: getOpinionSectionTitle(opinionInfo),
        bold: true,
        underline: true,
      }],
    },
  ];

  if (opinionInfo.mode === 'single') {
    // Existing single opinion logic
    children.push(
      generateOpinionSectionParagraph1({
        entity: entityLabel,
        currentRocYear: basicInfo.currentRocYear,
        isComparativeReport: basicInfo.isComparativeReport,
        highlightVariable,
      }),
      generateOpinionSectionParagraph2({
        entity: entityLabel,
        currentRocYear: basicInfo.currentRocYear,
        isComparativeReport: basicInfo.isComparativeReport,
        framework: basicInfo.accountingFramework,
        opinionType: opinionInfo.opinion.opinionType,
        highlightVariable,
      })
    );
  } else {
    // Dual opinion mode
    const { currentYear, comparativeYear } = opinionInfo;

    // Introductory paragraph (only for non-disclaimer current year)
    if (currentYear.opinionType !== 'disclaimer') {
      children.push(
        generateOpinionSectionParagraph1({
          entity: entityLabel,
          currentRocYear: basicInfo.currentRocYear,
          isComparativeReport: true,
          highlightVariable,
        })
      );
    }

    // Current year sub-heading
    children.push(
      generateYearOpinionSubheading(
        currentYear.year,
        currentYear.opinionType,
        highlightVariable
      )
    );

    // Current year opinion paragraph
    if (currentYear.opinionType === 'disclaimer') {
      // Add intro paragraph for disclaimer
      children.push(
        generateOpinionSectionParagraph1({
          entity: entityLabel,
          currentRocYear: currentYear.year,
          isComparativeReport: false,
          highlightVariable,
        })
      );
    }

    children.push(
      generateSingleYearOpinionParagraph({
        entity: entityLabel,
        year: currentYear.year,
        framework: basicInfo.accountingFramework,
        opinionType: currentYear.opinionType,
        highlightVariable,
      })
    );

    // Comparative year sub-heading
    children.push(
      generateYearOpinionSubheading(
        comparativeYear.year,
        comparativeYear.opinionType,
        highlightVariable
      )
    );

    // Comparative year opinion paragraph
    if (comparativeYear.opinionType === 'disclaimer') {
      // Add intro paragraph for disclaimer
      children.push(
        generateOpinionSectionParagraph1({
          entity: entityLabel,
          currentRocYear: comparativeYear.year,
          isComparativeReport: false,
          highlightVariable,
        })
      );
    }

    children.push(
      generateSingleYearOpinionParagraph({
        entity: entityLabel,
        year: comparativeYear.year,
        framework: basicInfo.accountingFramework,
        opinionType: comparativeYear.opinionType,
        highlightVariable,
      })
    );
  }

  return {
    id: 'opinion',
    children,
  };
};
```

**Rationale**:
- Handles both single and dual opinion modes
- Follows exact structure from examples with sub-headings
- Special handling for disclaimer opinions (separate intro paragraphs per example 2)
- Maintains backward compatibility with existing single opinion reports

#### 2.6 Enhanced Opinion Basis Section

```typescript
// Generate year-specific opinion basis sub-heading
const generateYearOpinionBasisSubheading = (
  year: number,
  opinionType: OpinionType,
  highlightVariable: boolean
): DocumentParagraph => {
  const simplified = getSimplifiedOpinionType(opinionType);
  const opinionText = opinionSectionTitleMap[simplified];

  const parts = [
    { text: '對民國' },
    { text: getRocYearText(year), color: 'blue' },
    { text: `年度財務報表表示${opinionText}之基礎`, color: 'blue' },
  ];

  return highlightVariable
    ? { type: 'children', children: parts }
    : { type: 'text', text: parts.map(p => p.text).join('') };
};

// Enhanced opinion basis section generator
export const generateOpinionBasisSection = (
  basicInfo: Partial<BasicInfoForm>,
  opinionInfo: OpinionConfiguration,
  { highlightVariable = false }: { highlightVariable?: boolean } = {}
): DocumentSection => {
  const entityLabel = getFormattedEntityName(
    basicInfo.entityName,
    basicInfo.isConsolidatedReport
  );

  const children: DocumentParagraph[] = [
    {
      type: 'children',
      children: [{
        text: `${getOpinionSectionTitle(opinionInfo)}之基礎`,
        bold: true,
        underline: true,
      }],
    },
  ];

  if (opinionInfo.mode === 'single') {
    // Existing single opinion basis logic
    if (opinionInfo.opinion.opinionType !== 'unqualified') {
      children.push({
        type: highlightVariable ? 'children' : 'text',
        ...(highlightVariable
          ? { children: [{ text: opinionInfo.opinion.reason || '[[空白的理由]]', color: 'blue' }] }
          : { text: opinionInfo.opinion.reason || '[[空白的理由]]' }
        ),
      });
    }

    if (opinionInfo.opinion.opinionType !== 'disclaimer') {
      children.push(
        generateOpinionBasisSectionParagraph({
          entity: entityLabel,
          framework: basicInfo.accountingFramework,
          opinionType: opinionInfo.opinion.opinionType,
          highlightVariable,
        })
      );
    }
  } else {
    // Dual opinion mode - check if we need split sections
    const hasDisclaimer =
      opinionInfo.currentYear.opinionType === 'disclaimer' ||
      opinionInfo.comparativeYear.opinionType === 'disclaimer';

    if (hasDisclaimer) {
      // Split into separate sub-sections for each year (per example 2)

      // Current year basis
      children.push(
        generateYearOpinionBasisSubheading(
          opinionInfo.currentYear.year,
          opinionInfo.currentYear.opinionType,
          highlightVariable
        )
      );

      if (opinionInfo.currentYear.opinionType !== 'unqualified') {
        children.push({
          type: highlightVariable ? 'children' : 'text',
          ...(highlightVariable
            ? { children: [{ text: opinionInfo.currentYear.reason || '[[空白的理由]]', color: 'blue' }] }
            : { text: opinionInfo.currentYear.reason || '[[空白的理由]]' }
          ),
        });
      }

      if (opinionInfo.currentYear.opinionType !== 'disclaimer') {
        children.push(
          generateOpinionBasisSectionParagraph({
            entity: entityLabel,
            framework: basicInfo.accountingFramework,
            opinionType: opinionInfo.currentYear.opinionType,
            highlightVariable,
          })
        );
      }

      // Comparative year basis
      children.push(
        generateYearOpinionBasisSubheading(
          opinionInfo.comparativeYear.year,
          opinionInfo.comparativeYear.opinionType,
          highlightVariable
        )
      );

      if (opinionInfo.comparativeYear.opinionType !== 'unqualified') {
        children.push({
          type: highlightVariable ? 'children' : 'text',
          ...(highlightVariable
            ? { children: [{ text: opinionInfo.comparativeYear.reason || '[[空白的理由]]', color: 'blue' }] }
            : { text: opinionInfo.comparativeYear.reason || '[[空白的理由]]' }
          ),
        });
      }

      if (opinionInfo.comparativeYear.opinionType !== 'disclaimer') {
        children.push(
          generateOpinionBasisSectionParagraph({
            entity: entityLabel,
            framework: basicInfo.accountingFramework,
            opinionType: opinionInfo.comparativeYear.opinionType,
            highlightVariable,
          })
        );
      }
    } else {
      // No disclaimer - use combined format (per example 1)
      // Add reasons for both years if non-unqualified
      if (opinionInfo.currentYear.opinionType !== 'unqualified') {
        children.push({
          type: highlightVariable ? 'children' : 'text',
          ...(highlightVariable
            ? { children: [{ text: opinionInfo.currentYear.reason || '[[空白的理由]]', color: 'blue' }] }
            : { text: opinionInfo.currentYear.reason || '[[空白的理由]]' }
          ),
        });
      }

      if (opinionInfo.comparativeYear.opinionType !== 'unqualified') {
        if (opinionInfo.currentYear.opinionType !== 'unqualified') {
          // Add spacing between reasons
          children.push({ type: 'text', text: '' });
        }
        children.push({
          type: highlightVariable ? 'children' : 'text',
          ...(highlightVariable
            ? { children: [{ text: opinionInfo.comparativeYear.reason || '[[空白的理由]]', color: 'blue' }] }
            : { text: opinionInfo.comparativeYear.reason || '[[空白的理由]]' }
          ),
        });
      }

      // Add single basis paragraph
      children.push(
        generateOpinionBasisSectionParagraph({
          entity: entityLabel,
          framework: basicInfo.accountingFramework,
          opinionType: opinionInfo.currentYear.opinionType,
          highlightVariable,
        })
      );
    }
  }

  return {
    id: 'opinionBasis',
    children,
  };
};
```

**Rationale**:
- Handles disclaimer opinions with completely separate sub-sections (per example 2)
- Non-disclaimer dual opinions use combined format with listed reasons
- Maintains backward compatibility
- Follows exact structure from provided examples

---

### Phase 3: UI Components 🎨

#### 3.1 Enhanced Opinion Form Component

**File**: `packages/audit/app/components/audit/OpinionForm.vue` (new component)

```vue
<template>
  <div class="space-y-6">
    <!-- Opinion Mode Toggle (only show for comparative reports) -->
    <div v-if="basicInfo.isComparativeReport" class="border-b pb-4">
      <label class="block text-sm font-medium mb-2">查核意見模式</label>
      <URadioGroup
        v-model="opinionMode"
        :options="[
          { label: '相同意見（兩年度相同）', value: 'single' },
          { label: '不同意見（兩年度不同）', value: 'dual' },
        ]"
      />
    </div>

    <!-- Single Opinion Mode -->
    <template v-if="opinionMode === 'single'">
      <UFormGroup label="查核意見類型" required>
        <USelect
          v-model="singleOpinion.opinionType"
          :options="opinionTypeOptions"
        />
      </UFormGroup>

      <!-- Reason field (for non-unqualified) -->
      <UFormGroup
        v-if="singleOpinion.opinionType !== 'unqualified'"
        label="意見理由"
        required
      >
        <UTextarea
          v-model="singleOpinion.reason"
          placeholder="請輸入查核意見理由..."
          :rows="4"
        />
      </UFormGroup>
    </template>

    <!-- Dual Opinion Mode -->
    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Current Year Opinion -->
        <div class="border rounded-lg p-4 space-y-4">
          <h3 class="font-semibold text-lg">
            當期年度 (民國{{ basicInfo.currentRocYear }}年)
          </h3>

          <UFormGroup label="查核意見類型" required>
            <USelect
              v-model="currentYearOpinion.opinionType"
              :options="opinionTypeOptions"
            />
          </UFormGroup>

          <UFormGroup
            v-if="currentYearOpinion.opinionType !== 'unqualified'"
            label="意見理由"
            required
          >
            <UTextarea
              v-model="currentYearOpinion.reason"
              placeholder="請輸入當期查核意見理由..."
              :rows="4"
            />
          </UFormGroup>
        </div>

        <!-- Comparative Year Opinion -->
        <div class="border rounded-lg p-4 space-y-4">
          <h3 class="font-semibold text-lg">
            比較期年度 (民國{{ basicInfo.currentRocYear ? basicInfo.currentRocYear - 1 : '' }}年)
          </h3>

          <UFormGroup label="查核意見類型" required>
            <USelect
              v-model="comparativeYearOpinion.opinionType"
              :options="opinionTypeOptions"
            />
          </UFormGroup>

          <UFormGroup
            v-if="comparativeYearOpinion.opinionType !== 'unqualified'"
            label="意見理由"
            required
          >
            <UTextarea
              v-model="comparativeYearOpinion.reason"
              placeholder="請輸入比較期查核意見理由..."
              :rows="4"
            />
          </UFormGroup>
        </div>
      </div>

      <!-- Visual Indicator of Opinion Combination -->
      <UAlert
        v-if="currentYearOpinion.opinionType && comparativeYearOpinion.opinionType"
        :title="`報告標題：${getDualOpinionTitle()}`"
        icon="i-heroicons-information-circle"
        color="blue"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { OPINION_TYPES } from '#shared/utils/constants';
import type { OpinionType } from '#shared/types/audit-report';

const props = defineProps<{
  basicInfo: Partial<BasicInfoForm>;
}>();

const store = useAuditBuilderStore();

// Opinion mode
const opinionMode = ref<'single' | 'dual'>('single');

// Single opinion state
const singleOpinion = ref({
  opinionType: 'unqualified' as OpinionType,
  reason: '',
});

// Dual opinion state
const currentYearOpinion = ref({
  year: computed(() => props.basicInfo.currentRocYear || 0),
  opinionType: 'unqualified' as OpinionType,
  reason: '',
});

const comparativeYearOpinion = ref({
  year: computed(() => (props.basicInfo.currentRocYear || 1) - 1),
  opinionType: 'unqualified' as OpinionType,
  reason: '',
});

// Opinion type options
const opinionTypeOptions = OPINION_TYPES.map(type => ({
  label: getOpinionTypeLabel(type),
  value: type,
}));

// Watchers to sync with store
watch([opinionMode, singleOpinion, currentYearOpinion, comparativeYearOpinion], () => {
  if (opinionMode.value === 'single') {
    store.updateOpinionInfo({
      mode: 'single',
      opinion: {
        year: props.basicInfo.currentRocYear || 0,
        ...singleOpinion.value,
      },
    });
  } else {
    store.updateOpinionInfo({
      mode: 'dual',
      currentYear: currentYearOpinion.value,
      comparativeYear: comparativeYearOpinion.value,
    });
  }
}, { deep: true });

// Helper to get opinion type label
function getOpinionTypeLabel(type: OpinionType): string {
  const labels: Record<OpinionType, string> = {
    unqualified: '無保留意見',
    qualifiedDisclaimer: '保留意見（無法表示意見）',
    qualifiedAdverse: '保留意見（否定意見）',
    adverse: '否定意見',
    disclaimer: '無法表示意見',
  };
  return labels[type];
}

// Helper to get dual opinion title preview
function getDualOpinionTitle(): string {
  const getSimplified = (type: OpinionType) => {
    if (type === 'qualifiedDisclaimer' || type === 'qualifiedAdverse') {
      return 'qualified';
    }
    return type;
  };

  const current = getSimplified(currentYearOpinion.value.opinionType);
  const comparative = getSimplified(comparativeYearOpinion.value.opinionType);

  const titleMap: Record<string, string> = {
    unqualified: '無保留意見',
    qualified: '保留意見',
    adverse: '否定意見',
    disclaimer: '無法表示意見',
  };

  if (current === comparative) {
    return titleMap[current];
  }

  const sorted = [current, comparative].sort();
  return `${titleMap[sorted[0]]}及${titleMap[sorted[1]]}`;
}
</script>
```

**Rationale**:
- Clear separation between single and dual opinion modes
- Side-by-side year comparison in dual mode for easy data entry
- Visual feedback showing the resulting report title
- Automatic year assignment based on basicInfo
- Conditional validation and field display

---

### Phase 4: State Management 📦

#### 4.1 Store Updates

**File**: `packages/audit/app/composables/stores/auditBuilder.ts`

```typescript
export const useAuditBuilderStore = defineStore("auditBuilder", () => {
  // ... existing basicInfo state ...

  // Updated opinion info to support OpinionConfiguration
  const opinionInfo = ref<OpinionConfiguration>({
    mode: 'single',
    opinion: {
      year: 0,
      opinionType: 'unqualified',
    },
  });

  // ... other state ...

  // Updated action
  const updateOpinionInfo = (updates: Partial<OpinionConfiguration> | OpinionConfiguration) => {
    if ('mode' in updates) {
      // Full configuration update
      opinionInfo.value = updates as OpinionConfiguration;
    } else {
      // Partial update (backward compatibility)
      opinionInfo.value = { ...opinionInfo.value, ...updates };
    }
  };

  // Watcher to auto-switch to single mode when comparative report is disabled
  watch(() => basicInfo.value.isComparativeReport, (isComparative) => {
    if (!isComparative && opinionInfo.value.mode === 'dual') {
      opinionInfo.value = {
        mode: 'single',
        opinion: {
          year: basicInfo.value.currentRocYear || 0,
          opinionType: 'unqualified',
        },
      };
    }
  });

  // Watcher to auto-update years when currentRocYear changes
  watch(() => basicInfo.value.currentRocYear, (newYear) => {
    if (opinionInfo.value.mode === 'single') {
      opinionInfo.value.opinion.year = newYear || 0;
    } else {
      opinionInfo.value.currentYear.year = newYear || 0;
      opinionInfo.value.comparativeYear.year = (newYear || 1) - 1;
    }
  });

  return {
    basicInfo,
    opinionInfo,
    // ... other state and actions ...
    updateOpinionInfo,
  };
});
```

**Rationale**:
- Automatic year synchronization
- Prevents invalid dual mode when comparative reporting is disabled
- Maintains type safety with OpinionConfiguration
- Backward compatible with existing code

---

## Key Design Decisions Summary

| Aspect                 | Decision                                              | Rationale                                           |
|------------------------|-------------------------------------------------------|-----------------------------------------------------|
| Data Model             | Discriminated union (`mode: 'single' \| 'dual'`)      | Type-safe, prevents invalid states, clear intent    |
| Opinion Types          | Keep existing 5 types, normalize qualified-* for titles | Maintains existing granularity while simplifying UI |
| Section Structure      | Separate generators for single/dual, sub-headings for years | Follows examples exactly, maintainable code         |
| Validation             | Cross-field validation in schema, year auto-sync      | Prevents data inconsistencies, better UX            |
| UI                     | Toggle between single/dual modes, side-by-side year inputs | Clear mental model, easy data entry                 |
| Backward Compatibility | Single mode as default, existing code works unchanged | Safe migration path, no breaking changes            |

---

## Implementation Checklist

- [x] **Phase 1**: Data model and types (foundation) ✅
  - [x] Add `YearOpinion`, `OpinionConfiguration`, `DualOpinionTitleType` types
  - [x] Update validation schemas with discriminated unions
  - [x] Add cross-field validation

- [x] **Phase 2**: Section generation logic (core functionality) ✅
  - [x] Add helper functions and constants
  - [x] Implement dual opinion title generator
  - [x] Implement year-specific sub-heading generator
  - [x] Implement single-year opinion paragraph generator
  - [x] Enhance opinion section generator
  - [x] Enhance opinion basis section generator

- [x] **Phase 3**: UI components (user interaction) ✅
  - [x] Update `AuditOpinionOrgChart.vue` to support dual mode with `yearMode` prop
  - [x] Add opinion mode toggle in builder.vue (相同意見/不同意見)
  - [x] Add tabbed interface for year selection (避免擁擠的並排佈局)
  - [x] Add summary card showing both years' selected opinions and combined title

- [x] **Phase 4**: State management (data flow) ✅
  - [x] Update store opinion state
  - [x] Add `updateOpinionInfo` action
  - [x] Add watchers for auto-sync and validation

---

## Testing Strategy

1. **Single Opinion Mode** (Regression Testing)
   - Verify existing single opinion reports still generate correctly
   - Test all 5 opinion types individually

2. **Dual Opinion Mode** (New Functionality)
   - Test all 6 dual opinion combinations
   - Verify correct title generation
   - Verify correct sub-heading generation
   - Verify disclaimer special handling

3. **Validation**
   - Test dual mode rejection when `isComparativeReport = false`
   - Test required reason fields for non-unqualified opinions
   - Test year consistency validation

4. **Edge Cases**
   - Both years same opinion (should work in dual mode)
   - Missing years
   - Missing reasons for modified opinions

---

## Future Enhancements

1. **Opinion Basis Templates**: Pre-filled reason templates for common scenarios
2. **Opinion History**: Track opinion changes across report versions
3. **Bulk Opinion Management**: UI for managing multiple reports with similar opinions
4. **Opinion Analytics**: Dashboard showing distribution of opinion types

---

## References

- 審計準則公報第72號 (第19頁範例)
- Existing codebase: `packages/audit/app/utils/audit/sections/opinion.ts`
- Existing types: `packages/audit/shared/types/audit-report.ts`
