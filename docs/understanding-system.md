# Understanding the System - Pneumademy

> Comprehensive documentation of architecture, authentication flow, and codebase structure

---

## Table of Contents

1. [Architecture Decisions](#architecture-decisions)
2. [Project Stack](#project-stack)
3. [Codebase Structure](#codebase-structure)
4. [Database Schema](#database-schema)
5. [Authentication System](#authentication-system)
6. [Route Protection](#route-protection)
7. [Role-Based Access Control](#role-based-access-control)
8. [Environment Configuration](#environment-configuration)

---

## Architecture Decisions

All architectural decisions are documented using Lightweight Architecture Decision Records (LADR). These provide context and rationale for key technical choices.

### Current ADRs

- [ADR-001: Use LADR](./adr/ADR-001-use-ladr.md) - Decision to use Lightweight Architecture Decision Records
- [ADR-002: Use Next.js with Bun](./adr/ADR-002-use-nextjs-with-bun.md) - Framework and runtime choice
- [ADR-003: Use shadcn/ui](./adr/ADR-003-use-shadcn-ui.md) - UI component library and theming
- [ADR-004: Use Drizzle ORM with PostgreSQL](./adr/ADR-004-use-drizzle-orm-postgresql.md) - Database and ORM choice
- [ADR-005: Use Better Auth](./adr/ADR-005-use-better-auth.md) - Authentication library choice

### Why These Choices?

Each technology was chosen to provide:

- **Type Safety**: Full TypeScript support across the stack
- **Modern Patterns**: Latest React and Next.js features
- **Performance**: Fast builds, runtime efficiency, serverless-ready
- **Developer Experience**: Great DX, good documentation, active communities
- **Flexibility**: Control over implementation without vendor lock-in

---

## Project Stack

### Core Technologies

- **Framework**: Next.js 15 with App Router
- **Runtime**: Bun (package manager and JavaScript runtime)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL via Neon (serverless)
- **ORM**: Drizzle ORM
- **Auth**: Better Auth
- **UI Library**: shadcn/ui (Radix Mira theme, Mauve base color)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Version Control**: Git

### Development Tools

- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier
- **Database Migrations**: Drizzle Kit
- **Environment**: dotenv for local development

---

## Codebase Structure

```
pneumademy/
├── docs/                          # Documentation
│   ├── adr/                       # Architecture Decision Records
│   │   ├── ADR-001-use-ladr.md
│   │   ├── ADR-002-use-nextjs-with-bun.md
│   │   ├── ADR-003-use-shadcn-ui.md
│   │   ├── ADR-004-use-drizzle-orm-postgresql.md
│   │   └── ADR-005-use-better-auth.md
│   └── understanding-system.md    # This file
│
├── src/
│   ├── actions/                   # Server Actions
│   │   └── users.ts               # Auth-related actions (signUp, signIn, signOut)
│   │
│   ├── app/                       # Next.js App Router
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...all]/
│   │   │           └── route.ts   # Better Auth API handler
│   │   ├── dashboard/
│   │   │   ├── layout.tsx         # Dashboard layout wrapper
│   │   │   └── page.tsx           # Dashboard home
│   │   ├── login/
│   │   │   └── page.tsx           # Login form
│   │   ├── signup/
│   │   │   └── page.tsx           # Registration form
│   │   ├── globals.css            # Global styles & Tailwind
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Home page
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   └── theme-provider.tsx     # Dark mode provider
│   │
│   ├── constants/
│   │   └── db.tableNames.ts       # Database table name constants
│   │
│   ├── db/
│   │   ├── schema/
│   │   │   ├── auth/
│   │   │   │   └── schema.ts      # Auth tables (user, session, account, verification)
│   │   │   └── index.ts           # Schema exports
│   │   └── index.ts               # Database client instance
│   │
│   ├── hooks/                     # Custom React hooks
│   │
│   ├── lib/
│   │   ├── auth.ts                # Better Auth configuration
│   │   └── utils.ts               # Utility functions (cn, etc.)
│   │
│   └── proxy.ts                   # Route protection (auth middleware)
│
├── public/                        # Static assets
│
├── drizzle/                       # Generated migrations
│
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Environment template
├── components.json                # shadcn/ui configuration
├── drizzle.config.ts              # Drizzle Kit configuration
├── next.config.mjs                # Next.js configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
└── tailwind.config.ts             # Tailwind CSS configuration
```

### Key Directories Explained

#### `src/actions/`

Server Actions for backend logic. Currently contains:

- User authentication actions (signUp, signIn, signOut, getSession)
- All return consistent `{ success, data?, error? }` shape

#### `src/app/`

Next.js App Router pages and API routes:

- **`api/auth/[...all]/`**: Better Auth API endpoint
- **`login/`** & **`signup/`**: Public authentication pages
- **`dashboard/`**: Protected area (requires authentication)

#### `src/components/ui/`

shadcn/ui components copied into codebase:

- Installed via: `bunx shadcn@latest add [component]`
- Fully customizable, no external package dependency
- Built on Radix UI primitives (accessible by default)

#### `src/db/schema/`

Drizzle ORM schema definitions:

- **`auth/schema.ts`**: All Better Auth tables
- **`index.ts`**: Central schema export
- Type-safe database schema with relations

#### `src/lib/`

Shared utilities and configuration:

- **`auth.ts`**: Better Auth setup with plugins and custom fields
- **`utils.ts`**: Helper functions (cn for className merging)

#### `src/proxy.ts`

Route protection using Better Auth's recommended pattern:

- Checks authentication before page loads
- Redirects unauthenticated users from protected routes
- Redirects authenticated users away from login/signup

---

## Database Schema

### Technology

- **Database**: PostgreSQL 15+
- **Hosting**: Neon (serverless PostgreSQL)
- **ORM**: Drizzle ORM
- **Driver**: `@neondatabase/serverless`

### Tables

#### User Table (`user`)

Located in: `src/db/schema/auth/schema.ts`

**Core Authentication Fields:**

```typescript
{
  id: text (PK),
  name: text (required),
  email: text (unique, required),
  emailVerified: boolean (default: false),
  image: text (optional),
  createdAt: timestamp (auto),
  updatedAt: timestamp (auto)
}
```

**Custom Role & Status Fields:**

```typescript
{
  role: text (default: "learner"),      // RBAC field
  banned: boolean (default: false),
  banReason: text (optional),
  banExpires: timestamp (optional),
  isActive: boolean (default: true)
}
```

**Profile Fields:**

```typescript
{
  bio: text (optional),
  avatar_url: text (optional)
}
```

#### Session Table (`session`)

Stores active user sessions:

```typescript
{
  id: text (PK),
  userId: text (FK → user.id),
  token: text (unique),
  expiresAt: timestamp,
  ipAddress: text (optional),
  userAgent: text (optional),
  impersonatedBy: text (optional),     // For admin support
  createdAt: timestamp,
  updatedAt: timestamp
}
```

- Indexed on `userId` for fast lookups
- Supports admin impersonation
- Tracks IP and user agent for security

#### Account Table (`account`)

OAuth provider connections:

```typescript
{
  id: text (PK),
  userId: text (FK → user.id),
  providerId: text (e.g., "google"),
  accountId: text (provider's user ID),
  accessToken: text (optional),
  refreshToken: text (optional),
  idToken: text (optional),
  accessTokenExpiresAt: timestamp (optional),
  refreshTokenExpiresAt: timestamp (optional),
  scope: text (optional),
  password: text (optional, for email/password),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

- Indexed on `userId`
- Supports multiple providers per user

#### Verification Table (`verification`)

Email verification and password reset tokens:

```typescript
{
  id: text (PK),
  identifier: text (email),
  value: text (token),
  expiresAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

- Indexed on `identifier`

### Migrations

```bash
# Generate migration from schema changes
bun x drizzle-kit generate

# Apply migrations to database
bun x drizzle-kit migrate

# Open Drizzle Studio (database GUI)
bun x drizzle-kit studio
```

---

## Authentication System

### Better Auth Configuration

**File**: `src/lib/auth.ts`

```typescript
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "pg" }),

  // Authentication methods
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  },

  // Plugins
  plugins: [
    admin(),        // User management, impersonation
    nextCookies()   // Next.js cookie handling
  ],

  // Custom user fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "learner",
        input: false,              // Users can't set this
      },
      bio: {
        type: "string",
        required: false,
      },
      avatarUrl: {
        type: "string",
        required: false,
        fieldName: "avatar_url",   // Maps to DB column
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
        input: false,
      },
    },
  },
});
```

### Authentication Flow

#### New User Registration

```
1. User visits /signup
2. Fills form (name, email, password, confirm password)
3. Client validation (password length, match)
4. Calls signUp() server action
5. Better Auth creates user record
   - role: "learner" (auto-assigned)
   - isActive: true (auto-set)
   - emailVerified: false (default)
6. Session created
7. Redirect to /dashboard
```

#### Existing User Login

```
1. User visits /login
2. Fills form (email, password)
3. Calls signIn() server action
4. Better Auth validates credentials
5. Session created with:
   - IP address tracking
   - User agent logging
6. Redirect to /dashboard
```

#### Session Management

```
1. Browser stores session cookie
2. Every request includes cookie
3. proxy.ts checks session via auth.api.getSession()
4. If valid: allow access
5. If invalid/expired: redirect to /login
```

#### Logout

```
1. User clicks logout button
2. Calls signOut() server action
3. Better Auth destroys session
4. Cookie cleared
5. Redirect to /login
```

### API Endpoint

**File**: `src/app/api/auth/[...all]/route.ts`

```typescript
export const { GET, POST } = toNextJsHandler(auth);
```

Handles all Better Auth operations:

- `/api/auth/sign-up` - User registration
- `/api/auth/sign-in/email` - Email/password login
- `/api/auth/sign-out` - Logout
- `/api/auth/session` - Get current session
- `/api/auth/callback/google` - OAuth callback
- And more...

### Server Actions

**File**: `src/actions/users.ts`

All actions are marked `"use server"` and return consistent shape:

```typescript
{ success: boolean, data?: any, error?: string }
```

#### `signUp(email, password, name)`

Creates new user account:

- Validates input
- Calls Better Auth API
- Handles errors gracefully
- Returns user data on success

#### `signIn(email, password)`

Authenticates user:

- Validates credentials
- Creates session
- Returns session data

#### `signOut()`

Ends current session:

- Destroys session token
- Clears cookies
- No return data needed

#### `getSession()`

Gets current user session:

- Returns full user object
- Includes custom fields (role, bio, etc.)
- Returns null if not authenticated

### UI Components

#### Login Page

**File**: `src/app/login/page.tsx`

Features:

- Email/password inputs
- Loading state with spinner
- Error display
- "Forgot password" link
- Link to signup page
- Form validation
- Disabled inputs during submission

#### Signup Page

**File**: `src/app/signup/page.tsx`

Features:

- Name, email, password, confirm password inputs
- Password strength indicator
- Password match validation
- Loading state with spinner
- Error display
- Link to login page
- Form validation

Both pages use shadcn/ui components:

- `Card` for layout
- `Input` for form fields
- `Label` for accessibility
- `Button` for submission

---

## Route Protection

### Proxy Pattern

**File**: `src/proxy.ts`

Better Auth's recommended approach for route protection.

```typescript
export default async function authProxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect authenticated users from auth pages
  if (
    session &&
    (request.nextUrl.pathname === "/login" ||
     request.nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
```

### How It Works

1. **Runs before page loads**: Executes on every matched route
2. **Checks session**: Calls Better Auth API to validate
3. **Protects routes**: Redirects if unauthorized
4. **Prevents double login**: Redirects authenticated users away from auth pages
5. **No deprecation warnings**: Uses Next.js 15+ proxy pattern

### Protected Routes

Currently protected:

- `/dashboard/*` - Requires authentication

Can be extended for role-based protection:

```typescript
if (request.nextUrl.pathname.startsWith("/admin")) {
  if (!session || session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
}
```

---

## Role-Based Access Control

### Current Implementation

#### Role Field

- **Type**: String
- **Default**: "learner"
- **Location**: `user.role` in database
- **Set During**: User registration (automatic)
- **Editable By User**: No

#### Available Roles

Based on the schema design:

1. **learner** (default) - Standard user
2. **instructor** - Content creator/teacher
3. **admin** - Full system access

#### Admin Plugin

Better Auth's admin plugin provides:

- User management capabilities
- Impersonation for support scenarios
- Ban/unban functionality

### RBAC Extension Points

#### ✅ Completed

1. Database field exists (`role` column in `user` table)
2. Better Auth configured with role field
3. Admin plugin enabled for privileged operations
4. Role automatically assigned on signup

#### ⏳ Pending Implementation

1. **Permission checking logic**
   - Create utility functions to check roles
   - Example: `requireRole(session, "admin")`

2. **Role assignment UI**
   - Admin interface to change user roles
   - Self-service role selection (if applicable)

3. **Protected routes per role**
   - Extend proxy.ts with role checks
   - Create role-specific dashboard sections

4. **Role-based component rendering**
   - Show/hide UI based on user role
   - Example: "Create Course" button only for instructors

### Next Steps for RBAC

To implement full RBAC, provide:

1. **Project Purpose**
   - What is Pneumademy? Educational platform?
   - What type of content is managed?

2. **Role Definitions**
   - **Learner**: What can they access? (view courses, submit assignments?)
   - **Instructor**: What can they create? (courses, assignments, grade submissions?)
   - **Admin**: What can they manage? (users, system settings?)

3. **Protected Resources**
   - What needs role restrictions?
   - Course creation? User management? Analytics?

4. **Role Assignment**
   - Who can assign roles?
   - Is there a request/approval flow?
   - Self-service or admin-only?

---

## Environment Configuration

### Required Variables

#### `.env`

```env
# Database Connection
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Better Auth
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Setup Instructions

1. **Copy environment template:**

   ```bash
   cp .env.example .env
   ```

2. **Database (Neon):**
   - Create account at [neon.tech](https://neon.tech)
   - Create new project
   - Copy connection string to `DATABASE_URL`

3. **Better Auth:**
   - Set `BETTER_AUTH_URL` to your deployed URL
   - For local development: `http://localhost:3000`

4. **Google OAuth (Optional):**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Secret

### Security Notes

- Never commit `.env` to version control
- Use different credentials for production
- Rotate secrets regularly
- Keep `BETTER_AUTH_URL` updated for each environment

---

## Summary

Pneumademy is built with modern, type-safe technologies:

- **Next.js 15** for the framework
- **Bun** for fast development
- **PostgreSQL + Drizzle** for reliable data
- **Better Auth** for flexible authentication
- **shadcn/ui** for beautiful, accessible components

The authentication system is complete and ready for extension with role-based access control. All architectural decisions are documented in ADRs for future reference.

For questions or contributions, refer to the ADRs in `docs/adr/` for context on why specific technologies were chosen.
