# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a TypeScript-first, Nuxt 4-based monorepo using PNPM workspaces with a sophisticated layer architecture designed for extensibility and code reuse.

### Monorepo Architecture

**PNPM Workspace Configuration:**

- Uses PNPM workspaces with proper dependency hoisting and shared node_modules
- Leverages workspace protocols (`workspace:*`) for internal package dependencies
- Efficient dependency management with `--filter` flag for package-specific operations

**Project Structure:**

- `packages/base/` - Core Nuxt layer providing shared functionality, components, and configurations
- `packages/company/` - Main company registration application extending base layer functionality
- Company app uses Nuxt layers to extend base package functionality through `extends: ["../base"]`
- Focus development efforts primarily on the company application

## Common Development Commands

### Package Management

```bash
# Install dependencies (from root)
pnpm install

# Run commands in specific workspace
pnpm --filter=@direct-flow/company run [script]
```

### Development

```bash
# Start development server (company app) - primary development focus
pnpm --filter=@direct-flow/company run dev

# Start base layer development (when needed)
pnpm --filter=@direct-flow/base run dev
```

### Build and Production

```bash
# Build for production
pnpm --filter=@direct-flow/company run build

# Preview production build
pnpm --filter=@direct-flow/company run preview

# Build with proper dependencies between packages
pnpm run build
```

### Database Operations

```bash
# Generate database migrations
pnpm --filter=@direct-flow/company run db:generate

# Run database migrations
pnpm --filter=@direct-flow/company run db:migrate
```

### Code Quality

```bash
# Run ESLint
pnpm --filter=@direct-flow/company run lint

# Fix ESLint issues
pnpm --filter=@direct-flow/company run lint:fix

# Format with Prettier
pnpm --filter=@direct-flow/company run format
```

## Technology Stack and Architecture

### Core Technologies

- **Frontend**: Nuxt 4 with Vue 3 Composition API and TypeScript (strict mode)
- **UI Framework**: Nuxt UI v3.3.0 and Tailwind CSS v4.1.8
- **Database**: PostgreSQL with Drizzle ORM v0.44.4
- **Authentication**: nuxt-auth-utils v0.5.20
- **State Management**: Pinia v3.0.2 with type-safe stores
- **Utilities**: VueUse v13.6.0 for common composables
- **Package Manager**: PNPM (workspaces enabled)
- **Deployment**: Vercel with Nitro preset

### Code Style and Structure

- Write concise, technical TypeScript code with accurate examples
- Use Composition API and declarative programming patterns; avoid Options API
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`)
- Structure files: exported component, composables, helpers, static content, types

### Naming Conventions

- Use lowercase with dashes for directories (e.g., `components/auth-wizard`)
- Use PascalCase for component names (e.g., `AuthWizard.vue`)
- Use camelCase for composables (e.g., `useAuthState.ts`)
- Prefix shared utilities with package name when exported across workspace

### Database Architecture

The application uses Drizzle ORM with PostgreSQL. Database schemas are located in `packages/company/server/database/schema/` and organized by domain:

- `company/` - Company entity schemas
- `person/` - Person and representative schemas
- `document/` - Document management schemas
- `companyApplication/` - Application workflow schemas
- `companyApplicationReview/` - Review process schemas

Migrations are managed with Drizzle Kit and stored in `server/database/migrations/`.

### Nuxt 4 Layer Architecture

**Layer Integration:**

- Base package configured as a Nuxt layer with proper `nuxt.config.ts`
- Company package extends base layer using `extends: ["../base"]` configuration
- Shared components, composables, and utilities through layer system
- Override base configurations in company layer when needed

**Directory Structure:**
Following Nuxt 4 conventions with `app/` directory structure:

- `app/` - Main application code (components, pages, layouts, middleware)
  - `components/` - Vue components organized by domain
  - `pages/` - File-based routing with Nuxt conventions
  - `layouts/` - Layout components
  - `middleware/` - Route middleware for authentication and authorization
- `server/` - Server-side API routes and database logic
- `shared/` - Shared types and utilities (auto-imported via `imports.dirs`)
- `composables/` - Vue composables including Pinia stores
- `utils/` - Utility functions and helpers
- `content/` - Nuxt Content for documentation

**Auto-imports and Module Resolution:**

- Auto-imports configured to work across layer boundaries
- TypeScript path resolution for cross-package imports
- Nuxt's module resolution for seamless layer integration
- Shared directory auto-imported: `imports: { dirs: ["~/shared/**"] }`

### Application Features

This is a sophisticated company registration management system featuring:

**Core Functionality:**

- Multi-step company registration forms with validation using Zod schemas
- Document upload and management with file validation (JPEG, PNG, PDF)
- Advanced application review workflow with multiple rounds and stages
- Database-driven form state management with Pinia stores
- Type-safe API routes with proper error handling

**Review System:**

- Multi-round review process with issues and verifications tracking
- Section-based review interface with real-time state management
- Staff-provided fields for first review rounds
- Review history with detailed tracking of changes
- Issue severity classification (critical, major, minor)
- Field-level verification system

### Authentication & Authorization

**Current Middleware System:**

- `auth.ts` - General authentication check using `nuxt-auth-utils`
- `guest.ts` - Public/unauthenticated routes (currently placeholder)
- `apply-confirm.ts` - Form validation middleware for confirmation step
- `apply-success.ts` - Success page access control with submission state validation

**Base Layer Auth:**

- Server middleware in `packages/base/server/middleware/auth.ts`
- Shared auth types in `packages/base/shared/auth.d.ts`
- Auth0 integration endpoint in `packages/base/server/api/auth/auth0.get.ts`

### Development Configuration

- ESLint configured with Nuxt defaults (`@nuxt/eslint`)
- Prettier with standard formatting rules
- TypeScript strict mode enabled
- Database URL defaults to `postgresql://direct:devpass@localhost:5432/df`
- Nuxt UI theme with color mode disabled (`ui: { colorMode: false }`)

## Development Guidelines

### TypeScript Best Practices

- Use TypeScript for all code; prefer `type` over `interface`
- Avoid enums; use const objects instead
- Use Vue 3 with TypeScript, leveraging `defineComponent` and `PropType`
- Define shared types in base package, import in company package
- Utilize TypeScript path mapping for clean imports between packages

### Vue 3 and Composition API

- Use `<script setup>` syntax for concise component definitions
- Leverage `ref`, `reactive`, and `computed` for reactive state management
- Use `provide`/`inject` for dependency injection when appropriate
- Implement custom composables for reusable logic across layers
- Share composables through base layer for company package consumption

### Data Fetching and State Management

- Use `useFetch` and `useAsyncData` with explicit generic types for data fetching
- Implement proper type-safe error handling with typed error responses
- Share Pinia stores between base and company layers with strict typing
- Define store state, getters, and actions with explicit return types
- Implement proper SSR/hydration patterns for monorepo structure with type safety

### Working with the Codebase

When making changes:

1. **Database Changes**: Use existing Drizzle schema patterns, organize by domain in `server/database/schema/`
2. **Layer Architecture**: Changes to shared functionality go in `packages/base/`, company-specific in `packages/company/`
3. **Shared Utilities**: Leverage auto-imported utilities from `shared/` directory with proper TypeScript types
4. **Component Structure**: Maintain domain-based organization in `app/components/`
5. **State Management**: Use Pinia stores in `composables/stores/` with type-safe patterns
6. **Schema Validation**: Use Zod schemas from `shared/utils/schemas/` for validation
7. **API Routes**: Follow server directory structure with proper error handling

### Performance and UI Guidelines

- Implement responsive design with Tailwind CSS using mobile-first approach
- Use Suspense for asynchronous components
- Implement lazy loading for routes and components
- Optimize images: use WebP format, include size data, implement lazy loading
- Leverage PNPM's efficient node_modules structure for faster builds
- Use Nuxt UI component customizations through base layer's `app/components/` directory
