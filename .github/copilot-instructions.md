# Pneumademy — GitHub Copilot Instructions

> Version: 1.1 | Last Updated: Landing page & community features complete
> Maintained as a living document. Update at each major milestone.

---

## What Is Pneumademy?

Pneumademy is a **private Christian discipleship platform** built for a church. It hosts spiritual growth courses in the form of videos and text content that can **only be accessed on the platform** (no downloads, no external sharing). It is an internal project managed by the developer and his church partner.

### The Journey

**Learners** (3-4 months):

- Sign up and automatically assigned `learner` role
- Complete foundational courses through structured video lessons and interactive content
- Self-paced learning with clear progression path
- Engage with community feed from day one

**Disciples** (lifetime access):

- Promoted after completing learner foundation courses
- Gain access to advanced, disciple-only courses that are completely hidden from learners
- Lifetime access to continuously released deep spiritual content
- Earn ranks based on spiritual maturity and community contribution
- Can be followed by other users

---

## Community Features

The platform includes a **social feed system** where:

- Users can post insights, reflections, and questions
- Learners and disciples can follow other disciples
- Disciples earn **ranks** that reflect their spiritual growth and contribution
- Active community engagement throughout the journey (not just during courses)
- Feed-based interaction encourages fellowship and shared learning

**Current stats:** 10,000+ active learners on the platform

---

## Roles & Access Model

There are **three roles** in the system:

| Role       | Description                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `admin`    | Developer + church partner. Full control — manages users, uploads courses, promotes learners to disciples                               |
| `learner`  | Default role on signup. Can access standard courses, view lessons, comment on lessons, engage in community                              |
| `disciple` | Promoted by admin only after completing foundation. Access to all learner content + disciple-only courses, earns ranks, can be followed |

**Important rules:**

- Disciple-only courses are **completely hidden** from learners (not locked, not previewed — invisible)
- Role is assigned automatically as `learner` on signup
- Only admins can promote a user to `disciple` (after they complete foundation courses)
- Users **cannot** set or change their own role
- Disciples can earn ranks through spiritual maturity and contribution
- Community features (feed, following) are available to all roles

---

## Architecture Decisions (LADR)

This project uses **Lightweight Architecture Decision Records (LADR)**. Every significant technical decision must be documented as an ADR in `docs/adr/`.

**When to write an ADR:**

- Choosing a new library or tool
- Changing a significant pattern (e.g. switching from server actions to route handlers)
- Making a database schema decision that affects multiple features
- Any decision that future-you would ask "why did I do it this way?"

**ADR format:**

```markdown
# ADR-XXX: Title

## Status

Accepted | Superseded by ADR-XXX | Deprecated

## Context

Why does this decision need to be made?

## Decision

What was decided?

## Consequences

What are the trade-offs and implications?
```

**Current ADRs:**

- ADR-001: Use LADR
- ADR-002: Use Next.js with Bun
- ADR-003: Use shadcn/ui
- ADR-004: Use Drizzle ORM with PostgreSQL
- ADR-005: Use Better Auth

Always suggest writing a new ADR when a significant architectural decision is being made.

---

## Tech Stack

| Layer                     | Technology                                                         |
| ------------------------- | ------------------------------------------------------------------ |
| Framework                 | Next.js 15 (App Router)                                            |
| Runtime / Package Manager | Bun                                                                |
| Language                  | TypeScript (strict mode)                                           |
| Database                  | PostgreSQL via Neon (serverless)                                   |
| ORM                       | Drizzle ORM                                                        |
| Auth                      | Better Auth                                                        |
| UI Components             | shadcn/ui (Custom theme: Deep Mauve/Purple, Warm Stone, Soft Gold) |
| Styling                   | Tailwind CSS with CSS variables (OKLCH color space)                |
| Icons                     | Lucide React                                                       |
| State / Data Fetching     | TanStack Query (client components only)                            |
| File Storage              | AWS S3 or Cloudflare R2 (pending)                                  |

---

## Project Structure

```
pneumademy/
├── docs/
│   ├── adr/                        # Architecture Decision Records
│   └── understanding-system.md     # Living system documentation
│
├── src/
│   ├── actions/                    # Server Actions ("use server")
│   │   └── users.ts                # Auth actions: signUp, signIn, signOut, getSession
│   │
│   ├── app/                        # Next.js App Router
│   │   ├── api/
│   │   │   └── auth/[...all]/
│   │   │       └── route.ts        # Better Auth API handler
│   │   ├── login/page.tsx          # Login page
│   │   ├── signup/page.tsx         # Sign up page
│   │   ├── page.tsx                # Landing page (public)
│   │   ├── (admin)/                # Admin-only route group [pending]
│   │   ├── (disciple)/             # Disciple-only route group [pending]
│   │   ├── (learner)/              # Learner route group [pending]
│   │   └── dashboard/              # Shared protected area
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   └── theme-provider.tsx
│   │
│   ├── constants/
│   │   └── db.tableNames.ts        # All DB table name constants live here
│   │
│   ├── db/
│   │   ├── schema/
│   │   │   ├── auth/schema.ts      # Better Auth tables (user, session, account, verification)
│   │   │   └── index.ts            # Re-exports all schemas
│   │   └── index.ts                # Drizzle + Neon client
│   │
│   ├── hooks/                      # Custom React hooks
│   ├── lib/
│   │   ├── auth.ts                 # Better Auth server config
│   │   ├── auth-client.ts          # Better Auth client (useSession, signIn etc.)
│   │   └── utils.ts                # cn() and other utilities
│   │
│   └── proxy.ts                    # Route protection middleware
│
├── drizzle/                        # Generated migrations
├── drizzle.config.ts
└── .env                            # Never committed
```

---

## Database Conventions

- All table name strings are defined as constants in `src/constants/db.tableNames.ts` — never hardcode table name strings inline
- Schema files are split by domain inside `src/db/schema/` and re-exported from `index.ts`
- Use `text` for IDs (Better Auth generates string IDs)
- Always include `createdAt` and `updatedAt` on every table
- Use `defaultNow()` AND `.$onUpdate(() => new Date())` on `updatedAt`
- Foreign keys always use `onDelete: "cascade"` unless there's a specific reason not to

**Current tables (pushed to Neon):**

- `user` — core user table with role, bio, avatar_url, isActive
- `session` — Better Auth sessions
- `account` — OAuth provider accounts
- `verification` — email verification tokens

**Pending tables (not yet created):**

- `courses` — title, description, thumbnailUrl, accessLevel (all | disciple_only), publishedAt
- `lessons` — courseId, title, order, contentType (video | text), contentUrl, body
- `enrollments` — userId ↔ courseId
- `progress` — userId, lessonId, completedAt
- `comments` — userId, lessonId, body
- `posts` — userId, content, createdAt (for community feed)
- `follows` — followerId, followingId (users following disciples)
- `ranks` — id, name, level, requirements (for disciple ranking system)

---

## Authentication System

**Better Auth** handles all auth. Do not build custom auth endpoints.

### Server config: `src/lib/auth.ts`

- Email/password enabled
- Google OAuth enabled
- `admin()` plugin enabled (user management + impersonation)
- `nextCookies()` plugin enabled
- Custom user fields: `role`, `bio`, `avatarUrl`, `isActive`

### Client config: `src/lib/auth-client.ts`

- Use `useSession()` for reading session in client components
- Use `authClient.signIn.email()`, `authClient.signOut()` etc. for auth actions

### Server Actions: `src/actions/users.ts`

- All marked `"use server"`
- All return `{ success: boolean, data?: any, error?: string }`
- Available: `signUp()`, `signIn()`, `signOut()`, `getSession()`

### Route Protection: `src/proxy.ts`

- Uses Better Auth proxy pattern (not standard Next.js middleware)
- Checks session via `auth.api.getSession({ headers: request.headers })`
- Unauthenticated users → redirect to `/login`
- Authenticated users on `/login` or `/signup` → redirect to `/dashboard`

**Extending for RBAC (pattern to follow):**

```typescript
if (request.nextUrl.pathname.startsWith("/admin")) {
  if (!session || session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
}
```

---

## Coding Conventions

- **Always use TypeScript** — no `any` unless absolutely necessary, prefer `unknown`
- **Server Components by default** — only add `"use client"` when you need interactivity, hooks, or browser APIs
- **TanStack Query for client-side data fetching** — not for server components (fetch directly there)
- **Server Actions for mutations** — form submissions, data writes go through `src/actions/`
- **shadcn/ui for all UI components** — install via `bunx shadcn@latest add [component]`, never build from scratch what shadcn provides
- **Zod for all validation** — validate at the server action boundary, not just on the client
- **No inline table name strings** — always use constants from `src/constants/db.tableNames.ts`
- **NO EMOJIS EVER** — Do not use emojis in code, UI text, comments, documentation, or commit messages. This is a church platform requiring professional, reverent tone.

---

## Design System

The platform uses a carefully curated design system documented in `docs/design-system.md`:

**Color Scheme:**

- **Primary**: Deep Mauve/Purple `#7C3AED` — Used for CTAs, active states, links, primary buttons
- **Secondary**: Warm Stone/Sandstone `#A8947A` — Used for secondary buttons, borders, subtle backgrounds
- **Accent**: Soft Gold `#D4A847` — Used for rank badges, achievements, special highlights
- **Dark Mode Background**: Deep charcoal-mauve `#1A1520`
- **Theme**: Custom Radix-based theme with CSS variables in OKLCH color space for light/dark mode
- **Semantic colors**: `background`, `foreground`, `muted`, `primary`, `secondary`, `accent`
- **Component colors**: Consistent use of `primary/10`, `primary/20` for subtle backgrounds

**Typography:**

- Headings: `text-4xl`, `text-3xl`, `text-xl` with appropriate font weights
- Body: Default `text-base`, `text-sm` for secondary
- Muted text: Always use `text-muted-foreground`

**Spacing:**

- Sections: `py-20` standard, `py-20 md:py-32` for hero sections
- Containers: `container mx-auto px-4`
- Component gaps: `gap-4`, `gap-8` depending on density

**Design Principles:**

- Spiritual & contemplative atmosphere
- Clean, spacious layouts
- No animations/transitions unless essential
- High contrast for accessibility
- Professional yet warm tone
- NO EMOJIS

See `docs/design-system.md` for complete reference.

---

## Environment Variables

```env
DATABASE_URL=              # Neon PostgreSQL connection string
BETTER_AUTH_URL=           # http://localhost:3000 (dev) or deployed URL
BETTER_AUTH_SECRET=        # Random secret string
GOOGLE_CLIENT_ID=          # Google OAuth
GOOGLE_CLIENT_SECRET=      # Google OAuth
```

---

## What Is Not Built Yet

- Role-based route groups `(admin)`, `(disciple)`, `(learner)`
- RBAC middleware extensions in `proxy.ts`
- Course, lesson, enrollment, progress, comment schemas
- Community feed schemas (posts, follows, ranks)
- Admin dashboard (user management, course uploads, role promotion)
- Learner dashboard (course browsing, lesson viewer, progress)
- Disciple dashboard (disciple-only content access)
- Community feed system (post creation, following, ranks display)
- File/video upload system (S3/R2)
- TanStack Query provider setup
- Comment system on lessons

---

## Key Business Rules to Always Enforce

1. Disciple-only courses must **never appear** in any query or UI for `learner` role users
2. Course content (videos, text) is **platform-only** — never provide download links or expose raw S3 URLs directly to the client; always use presigned URLs with short expiry
3. Role promotion is **admin-only** — no endpoint or action should allow self-promotion
4. All new users default to `learner` — never allow role to be passed as input during signup
