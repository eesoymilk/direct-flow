# Tests for Apply Pages

This directory contains comprehensive tests for the company application flow, specifically the `/apply/` pages and related functionality.

## Test Structure

```
tests/
├── setup.ts                           # Global test setup and mocks
├── components/
│   └── apply-pages.test.ts            # Component tests for apply pages
├── composables/
│   └── store.test.ts                  # Store tests using Pinia
└── unit/
    └── simple.test.ts                 # Basic unit tests for schemas
```

## Test Coverage

### Component Tests

- **apply-pages.test.ts**: Tests that apply page components can be imported and mounted

### Store Tests

- **store.test.ts**: Tests store state management, computed properties, and actions using Pinia

### Unit Tests

- **simple.test.ts**: Tests form validation schemas and basic functionality

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:ui

# Run tests once
npm run test:run
```

## Test Utilities

The `setup.ts` file provides:

- Global mocks for Nuxt composables
- Mock utilities for forms, stores, and navigation
- Common test data factories

## Key Testing Patterns

1. **Integration Testing**: Uses `@nuxt/test-utils` for proper Nuxt environment setup
2. **Unit Testing**: Tests individual functions and components in isolation
3. **Schema Testing**: Validates form data structures and validation rules
4. **Mock Strategy**: Comprehensive mocking of external dependencies

## Dependencies

- `@nuxt/test-utils`: Official Nuxt testing utilities
- `@testing-library/vue`: Vue component testing utilities
- `@testing-library/jest-dom`: Additional DOM matchers
- `vitest`: Fast test runner
- `jsdom`: DOM environment for tests

## Notes

- Tests follow Nuxt 4 official testing guidelines
- All tests are written in TypeScript
- Mock data reflects real application structure
- Tests cover both happy path and error scenarios
