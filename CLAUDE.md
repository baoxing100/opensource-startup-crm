# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AWCRM is a SaaS CRM platform built with SvelteKit, designed for startups and enterprises with role-based access control (RBAC). The application features multi-tenancy through organizations, with strict data isolation enforced at the database level.

## Technology Stack

- **Frontend**: SvelteKit 2.x with Svelte 5.x
- **Styling**: TailwindCSS 4.x
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide Svelte
- **Validation**: Zod
- **Package Manager**: pnpm
- **Type Checking**: JSDoc style type annotations (no TypeScript)

## Development Commands

```bash
# Development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Type checking
pnpm run check

# Type checking with watch mode
pnpm run check:watch

# Linting and formatting (both required to pass)
pnpm run lint

# Format code
pnpm run format

# Database operations
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

## Architecture Overview

### Multi-Tenant Structure
- **Organizations**: Top-level tenant containers with strict data isolation
- **Users**: Can belong to multiple organizations with different roles (ADMIN/USER)
- **Super Admin**: Users with @abetworks.in email domain have platform-wide access

### Core CRM Entities
- **Leads**: Initial prospects that can be converted to Accounts/Contacts/Opportunities
- **Accounts**: Company/organization records
- **Contacts**: Individual people associated with accounts
- **Opportunities**: Sales deals with pipeline stages
- **Tasks/Events**: Activity management
- **Cases**: Customer support tickets
- **Products/Quotes**: Sales catalog and quotation system

### Authentication & Authorization
- Session-based authentication using cookies (`session`, `org`, `org_name`)
- Organization selection required after login via `/org` route
- Route protection in `src/hooks.server.js`:
  - `/app/*` routes require authentication and organization membership
  - `/admin/*` routes restricted to @abetworks.in domain users
  - `/org` route for organization selection

### Data Access Control
- All database queries must include organization filtering
- User can only access data from organizations they belong to
- Prisma schema enforces relationships with `organizationId` foreign keys

### Route Structure
- `(site)`: Public marketing pages
- `(no-layout)`: Auth pages (login, org selection)
- `(app)`: Main CRM application (requires auth + org membership)
- `(admin)`: Platform administration (requires @micropyramid.com email)

### Key Files
- `src/hooks.server.js`: Authentication, org membership validation, route protection
- `src/lib/prisma.js`: Database client configuration
- `src/lib/stores/auth.js`: Authentication state management
- `prisma/schema.prisma`: Complete database schema with RBAC models

## Form Development
- All form labels must be properly associated with form controls for accessibility
- Use Zod for form validation
- Follow existing patterns in `/contacts`, `/leads`, `/accounts` for consistency

## Coding Standards

### Type Safety
- **NO TypeScript**: This project uses JavaScript with JSDoc style type annotations only
- **JSDoc Comments**: Use JSDoc syntax for type information and documentation
- **Type Checking**: Use `pnpm run check` to validate types via JSDoc annotations
- **Function Parameters**: Document parameter types using JSDoc `@param` tags
- **Return Types**: Document return types using JSDoc `@returns` tags

### JSDoc Examples
```javascript
/**
 * Updates a contact in the database
 * @param {string} contactId - The contact identifier
 * @param {Object} updateData - The data to update
 * @param {string} updateData.name - Contact name
 * @param {string} updateData.email - Contact email
 * @param {string} organizationId - Organization ID for data isolation
 * @returns {Promise<Object>} The updated contact object
 */
async function updateContact(contactId, updateData, organizationId) {
  // Implementation
}

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {string[]} organizationIds - Array of organization IDs
 */

/** @type {User|null} */
let currentUser = null;
```

## Security Requirements
- Never expose cross-organization data
- Always filter queries by user's organization membership
- Validate user permissions before any data operations
- Use parameterized queries via Prisma to prevent SQL injection