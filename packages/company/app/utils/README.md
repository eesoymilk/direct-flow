# Company Application Utils

This directory contains utility functions for the company application, including form helpers, schemas, and mock data generation.

## Files

### `schemas.ts`

Contains all Zod schemas for form validation:

- `documentSchema` - For document uploads
- `personSchema` - For person information
- `formSchema` - For the main application form

### `formHelpers.ts`

Contains helper functions for creating initial form data:

- `createEmptyPerson()` - Creates an empty person object
- `createInitialDocuments()` - Creates initial document structure
- `createInitialForm()` - Creates the complete initial form structure

### `mockData.ts`

Contains Faker.js-based mock data generators using Taiwanese localization for realistic data.

## Mock Data Generator

The mock data generator provides realistic Taiwanese company application data using [Faker.js Taiwanese locale](https://fakerjs.dev/guide/localization.html) (`fakerZH_TW`) for authentic data generation.

### Localization Features

- **Taiwanese Names**: Uses `faker.person.fullName()` with Taiwanese locale
- **Taiwanese Addresses**: Uses `faker.location.streetAddress()` with proper Taiwanese formatting
- **Company Names**: Combines Faker company names with Taiwanese business suffixes
- **Custom ID Numbers**: Generates proper Taiwanese ID format (letter + 9 digits)

### Basic Usage

```typescript
import { generateMockFormData } from "~/utils/mockData";

// Generate a complete mock form with Taiwanese data
const mockForm = generateMockFormData();
```

### Available Functions

#### `generateMockFormData()`

Generates a complete mock form with all fields populated using Taiwanese locale.

#### `generateMockForms(count: number)`

Generates multiple mock forms (default: 5).

#### `generateMockDataForScenario(scenario)`

Generates mock data for specific scenarios:

- `"minimal"` - Minimal form with single company name and shareholder
- `"complete"` - Complete form with maximum data
- `"multiple_shareholders"` - Form with 3-8 shareholders

#### `generateMockPerson()`

Generates a single mock person with Taiwanese name, ID, and address.

#### `generateMockCompanyNames(count?)`

Generates realistic Taiwanese company names.

### Store Integration

The company application store includes methods to populate forms with mock data:

```typescript
const store = useCompanyApplicationStore();

// Populate with random mock data
store.populateWithMockData();

// Populate with specific scenario
store.populateWithMockScenario("minimal");
```

### Example Usage

```typescript
// In a component or test
import { useCompanyApplicationStore } from "~/composables/stores/companyApplication";

const store = useCompanyApplicationStore();

// Fill form with mock data for testing
const fillFormWithMockData = () => {
  store.populateWithMockData();
};

// Fill form with minimal data
const fillFormWithMinimalData = () => {
  store.populateWithMockScenario("minimal");
};
```

### Generated Data Includes

- **Company Names**: Realistic Taiwanese company names with proper suffixes
- **Person Data**: Chinese names, Taiwanese ID numbers, Taiwanese addresses
- **Business Descriptions**: Common Taiwanese business activities
- **Organization Types**: All supported company types
- **Addresses**: Realistic Taiwanese city/district combinations using Faker's localization

### Localization Benefits

- **Authentic Data**: Uses Faker's built-in Taiwanese locale for realistic names and addresses
- **Proper Formatting**: Addresses follow Taiwanese formatting conventions
- **Fallback Support**: Gracefully handles missing data with sensible defaults
- **Performance**: Optimized for Taiwanese data generation

### Notes

- All generated data uses Faker.js Taiwanese locale (`fakerZH_TW`)
- ID numbers follow Taiwanese ID format (letter + 9 digits)
- Addresses use Faker's Taiwanese address generation
- Company names include proper Taiwanese business suffixes
- File uploads are currently mocked (undefined) until file storage is implemented
