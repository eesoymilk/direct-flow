# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a Nuxt layers architecture using pnpm workspace:

- `packages/base/` - Nuxt base layer providing reusable code and configuration for future projects
- `packages/company/` - Main company registration management application (extends the base layer)

Currently, only the company package app is present. The base layer serves as a parent layer containing shared components, middleware, and configurations that will be reused when additional projects are added to the workspace in the future.

## Common Development Commands

### Package Management

```bash
# Install dependencies (from root)
pnpm install

# Run commands in specific workspace
pnpm --filter @direct-flow/company run [script]
```

### Development

```bash
# Start development server (company app)
pnpm --filter @direct-flow/company run dev
```

### Build and Production

```bash
# Build for production
pnpm --filter @direct-flow/company run build

# Preview production build
pnpm --filter @direct-flow/company run preview
```

### Database Operations

```bash
# Generate database migrations
pnpm --filter @direct-flow/company run db:generate

# Run database migrations
pnpm --filter @direct-flow/company run db:migrate
```

### Code Quality

```bash
# Run ESLint
pnpm --filter @direct-flow/company run lint

# Fix ESLint issues
pnpm --filter @direct-flow/company run lint:fix

# Format with Prettier
pnpm --filter @direct-flow/company run format
```

## Application Architecture

### Technology Stack

- **Frontend**: Nuxt 4 with Vue 3 and TypeScript
- **UI Framework**: Nuxt UI with Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: nuxt-auth-utils
- **State Management**: Pinia
- **Package Manager**: pnpm (workspaces enabled)

### Database Architecture

The application uses Drizzle ORM with PostgreSQL. Database schemas are located in `packages/company/server/database/schema/` and organized by domain:

- `company/` - Company entity schemas
- `person/` - Person and representative schemas
- `document/` - Document management schemas
- `companyApplication/` - Application workflow schemas
- `companyApplicationReview/` - Review process schemas

Migrations are managed with Drizzle Kit and stored in `server/database/migrations/`.

### Application Structure

The company application follows Nuxt conventions:

- `app/` - Main application code (components, pages, layouts)
- `server/` - Server-side API routes and database logic
- `shared/` - Shared types and utilities (auto-imported)
- `composables/` - Vue composables including Pinia stores
- `utils/` - Utility functions and helpers
- `middleware/` - Route middleware for authentication and authorization

### Key Features

This is a company registration management system with:

- Multi-step company registration forms
- Document upload and management
- Application review workflow with multiple stages
- User role management (clients, staff, CPAs)
- Database-driven form state management

### Authentication & Authorization

Uses role-based access control with middleware:

- `auth.ts` - General authentication check
- `client-only.ts` - Client-specific routes
- `cpa-only.ts` - CPA staff-only routes
- `guest.ts` - Public/unauthenticated routes

### Development Configuration

- ESLint configured with Nuxt defaults
- Prettier with standard formatting rules
- TypeScript strict mode enabled
- Database URL defaults to `postgresql://direct:devpass@localhost:5432/df`

## Working with the Codebase

When making changes:

1. Use the existing Drizzle schema patterns for database changes
2. Follow Nuxt file-based routing conventions
3. Utilize the shared utilities and types from the `shared/` directory
4. Maintain the existing component structure in `app/components/`
5. Use Pinia stores in `composables/stores/` for state management
6. Apply proper TypeScript types from `shared/types/`

The company application extends the base layer, so changes to shared Nuxt configurations, components, or middleware should be made in `packages/base/` when they need to be available across multiple future projects.
