# Development Commands Reference

This document provides a comprehensive guide to all available commands for error checking, linting, and development tasks in the direct-flow monorepo.

## 🚀 Quick Start Commands

### See All Errors at Once

```bash
# Check TypeScript errors + ESLint issues for company package
pnpm check:company

# Check TypeScript errors + ESLint issues for all packages
pnpm check

# Auto-fix what can be fixed
pnpm check:fix
```

## 📦 Package-Specific Commands

### Company Package (`@direct-flow/company`)

```bash
# TypeScript checking
pnpm type-check:company          # Check TypeScript errors
pnpm --filter=@direct-flow/company type-check

# ESLint checking
pnpm lint:company                # Check linting issues
pnpm --filter=@direct-flow/company lint
pnpm --filter=@direct-flow/company lint:fix    # Auto-fix linting issues
pnpm --filter=@direct-flow/company lint:quiet  # Show only errors (no warnings)

# Combined checks
pnpm check:company               # TypeScript + ESLint
pnpm check:fix:company           # TypeScript + ESLint with auto-fix

# Development
pnpm dev:company                 # Start development server
pnpm build:company               # Build for production

# Testing
pnpm test:company                # Run tests
pnpm --filter=@direct-flow/company test:run
pnpm --filter=@direct-flow/company test:coverage
```

### Base Package (`@direct-flow/base`)

```bash
# TypeScript checking
pnpm type-check:base
pnpm --filter=@direct-flow/base type-check

# ESLint checking
pnpm lint:base
pnpm --filter=@direct-flow/base lint

# Combined checks
pnpm check:base
pnpm check:fix:base

# Development
pnpm dev:base
pnpm build:base

# Testing
pnpm test:base
```

## 🔄 Workspace-Wide Commands

### All Packages at Once

```bash
# TypeScript checking for all packages
pnpm type-check
pnpm -r type-check

# ESLint checking for all packages
pnpm lint
pnpm -r lint
pnpm -r lint:fix

# Combined checks for all packages
pnpm check
pnpm check:fix

# Build all packages
pnpm build
pnpm -r build

# Test all packages
pnpm test
pnpm -r test:run
```

## 🛠️ Individual Package Scripts

### Inside `packages/company/` directory

```bash
# TypeScript
pnpm type-check                  # Check TypeScript errors
pnpm type-check:watch           # Watch mode for TypeScript

# ESLint
pnpm lint                       # Check linting issues
pnpm lint:fix                   # Auto-fix linting issues
pnpm lint:quiet                 # Show only errors (no warnings)

# Combined
pnpm check                      # TypeScript + ESLint
pnpm check:fix                  # TypeScript + ESLint with auto-fix

# Testing
pnpm test                       # Run tests in watch mode
pnpm test:run                   # Run tests once
pnpm test:ui                    # Run tests with UI
pnpm test:coverage              # Run tests with coverage

# Development
pnpm dev                        # Start development server
pnpm build                      # Build for production
pnpm generate                   # Generate static site
pnpm preview                    # Preview production build

# Database
pnpm db:generate                # Generate database migrations
pnpm db:migrate                 # Run database migrations
```

## 🎯 Error Types and How to See Them

### 1. TypeScript Errors (Most Critical)

These prevent compilation and must be fixed:

```bash
pnpm type-check:company
```

**Example errors:**

- Type mismatches (like your `CalendarDate` issue)
- Missing imports
- Undefined variables
- Type incompatibilities

### 2. ESLint Errors and Warnings

These are code quality/style issues:

```bash
pnpm lint:company               # All issues
pnpm --filter=@direct-flow/company lint:quiet  # Only errors
```

**Example issues:**

- Unused variables
- Missing type imports
- Code style violations
- Vue template issues

### 3. Runtime Errors

These are caught by tests:

```bash
pnpm test:company
```

## 🔍 Understanding Error Output

### TypeScript Error Example

```
app/composables/stores/companyApplication.ts:44:9 - error TS2322:
Type '{ ... }' is not assignable to type '{ ... }'.
Types of property 'dateOfBirth' are incompatible.
```

- **File**: `app/composables/stores/companyApplication.ts`
- **Line**: 44, column 9
- **Error**: Type mismatch in `dateOfBirth` property

### ESLint Error Example

```
app/composables/stores/companyApplication.ts:1:1 error
All imports in the declaration are only used as types. Use `import type`
```

- **File**: `app/composables/stores/companyApplication.ts`
- **Line**: 1, column 1
- **Error**: Should use `import type` instead of `import`

## 🚨 Common Issues and Solutions

### CalendarDate Type Issues

Your current error is a type compatibility issue. The form data has a different `CalendarDate` type than what `PersonSchema` expects.

### Auto-fixable Issues

Many ESLint issues can be auto-fixed:

```bash
pnpm --filter=@direct-flow/company lint:fix
```

### Import Issues

Use `import type` for type-only imports:

```typescript
// ❌ Wrong
import { SomeType } from "./types";

// ✅ Correct
import type { SomeType } from "./types";
```

## 📋 Recommended Workflow

1. **Before coding**: Run `pnpm check:company` to see current state
2. **During development**: Use `pnpm type-check:watch` for real-time TypeScript checking
3. **Before committing**: Run `pnpm check:fix:company` to auto-fix issues
4. **For CI/CD**: Use `pnpm check` to check all packages

## 🔧 VS Code/Cursor Integration

- **Problems Panel**: `Cmd+Shift+M` (Mac) or `Ctrl+Shift+M` (Windows/Linux)
- **Command Palette**: `Cmd+Shift+P` → "Problems: Focus on Problems View"
- **Terminal**: `Cmd+Shift+`` (backtick) to open integrated terminal

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Vue Style Guide](https://vuejs.org/style-guide/)
- [pnpm Workspace Documentation](https://pnpm.io/workspaces)
