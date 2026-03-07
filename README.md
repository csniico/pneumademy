# Pneumademy

> A private Christian discipleship platform for spiritual growth and education

Pneumademy is a secure, platform-exclusive content management system designed for churches to host and manage discipleship courses. Content is accessed only through the platform with role-based access control to protect sensitive spiritual formation materials.

# Pneumademy

> A private Christian discipleship platform for spiritual growth and education

Pneumademy is a secure, platform-exclusive content management system designed for churches to host and manage discipleship courses. Content is accessed only through the platform with role-based access control to protect sensitive spiritual formation materials.

## Features

- **Secure Authentication** - Email/password and Google OAuth via Better Auth
- **Role-Based Access Control** - Three-tier system (Admin, Disciple, Learner)
- **Course Management** - Video and text-based spiritual growth content
- **Access Control** - Disciple-only courses completely hidden from learners
- **Interactive Learning** - Comment system on lessons (planned)
- **Progress Tracking** - Monitor learner progress through courses (planned)
- **Dark Mode Support** - Built-in theme switching

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Runtime**: [Bun](https://bun.sh/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix Mira theme)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Prerequisites

- [Bun](https://bun.sh/) installed (v1.0+)
- [PostgreSQL](https://www.postgresql.org/) database (or [Neon](https://neon.tech/) account)
- [Google OAuth](https://console.cloud.google.com/) credentials (optional, for social login)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd pneumademy
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database (Get from Neon or your PostgreSQL instance)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Better Auth
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Set up the database

Generate and run migrations:

```bash
# Generate migration files from schema
bun x drizzle-kit generate

# Apply migrations to database
bun x drizzle-kit migrate

# (Optional) Open Drizzle Studio to view database
bun x drizzle-kit studio
```

### 5. Run the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pneumademy/
├── docs/                      # Documentation
│   ├── adr/                   # Architecture Decision Records
│   └── understanding-system.md # Comprehensive system docs
├── src/
│   ├── actions/               # Server Actions
│   ├── app/                   # Next.js App Router
│   │   ├── api/auth/          # Better Auth API routes
│   │   ├── dashboard/         # Protected dashboard area
│   │   ├── login/             # Login page
│   │   └── signup/            # Registration page
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   ├── db/
│   │   └── schema/            # Drizzle ORM schemas
│   ├── lib/                   # Utilities and config
│   └── proxy.ts               # Route protection
└── drizzle/                   # Generated migrations
```

## Authentication & Authorization

### Role System

| Role         | Permissions                                                           |
| ------------ | --------------------------------------------------------------------- |
| **Admin**    | Full system access, user management, course creation, role promotion  |
| **Disciple** | Access to all standard courses + disciple-only content, can comment   |
| **Learner**  | Access to standard courses only, can comment (default role on signup) |

### Key Rules

- New users automatically assigned `learner` role
- Only admins can promote users to `disciple`
- Disciple-only content is **completely hidden** from learners (not just locked)
- Users cannot set or change their own role
- Content is platform-only (no downloads or external sharing)

## Adding UI Components

This project uses shadcn/ui components. To add new components:

```bash
bunx shadcn@latest add [component-name]
```

Example:

```bash
bunx shadcn@latest add dialog
bunx shadcn@latest add dropdown-menu
```

Components are installed in `src/components/ui/` and can be imported as:

```tsx
import { Button } from "@/components/ui/button";
```

## Available Scripts

```bash
# Development
bun dev              # Start dev server with Turbopack

# Database
bun x drizzle-kit generate  # Generate migrations
bun x drizzle-kit migrate   # Apply migrations
bun x drizzle-kit studio    # Open Drizzle Studio GUI

# Linting & Formatting
bun run lint         # Run ESLint
bun run format       # Run Prettier (if configured)

# Build
bun run build        # Build for production
bun start            # Start production server
```

## Documentation

- **[Understanding the System](docs/understanding-system.md)** - Comprehensive architecture and implementation docs
- **[Architecture Decision Records](docs/adr/)** - Why we made specific technical choices
  - [ADR-001: Use LADR](docs/adr/ADR-001-use-ladr.md)
  - [ADR-002: Use Next.js with Bun](docs/adr/ADR-002-use-nextjs-with-bun.md)
  - [ADR-003: Use shadcn/ui](docs/adr/ADR-003-use-shadcn-ui.md)
  - [ADR-004: Use Drizzle ORM with PostgreSQL](docs/adr/ADR-004-use-drizzle-orm-postgresql.md)
  - [ADR-005: Use Better Auth](docs/adr/ADR-005-use-better-auth.md)

## Security

- All authentication handled by Better Auth
- Session management with IP tracking and user agent logging
- Password hashing and secure storage
- CSRF protection via Next.js integration
- Role-based access control enforced at route and database levels
- Environment variables for sensitive credentials

## Development Status

**Complete:**

- Authentication system (email/password + Google OAuth)
- User registration and login
- Role field in database
- Route protection via proxy
- Admin plugin integration

**In Progress:**

- Course management system
- Lesson viewer
- RBAC middleware implementation
- Admin dashboard
- Comment system

**Planned:**

- Progress tracking
- Enrollment system
- Video/file upload to S3/R2
- Email verification flow
- Password reset functionality

## Contributing

This is a private church project. If you have access and want to contribute:

1. Create a new branch for your feature
2. Follow the existing code patterns
3. Add appropriate ADR if making architectural decisions
4. Update documentation as needed
5. Test thoroughly before merging

## License

See [LICENSE](LICENSE) file for details.

## Development Team

Maintained by the church development team.

---

**Note**: This platform handles sensitive religious education content. Please maintain confidentiality and respect the privacy of all users.

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Runtime**: [Bun](https://bun.sh/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix Mira theme)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Prerequisites

- [Bun](https://bun.sh/) installed (v1.0+)
- [PostgreSQL](https://www.postgresql.org/) database (or [Neon](https://neon.tech/) account)
- [Google OAuth](https://console.cloud.google.com/) credentials (optional, for social login)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd pneumademy
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database (Get from Neon or your PostgreSQL instance)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Better Auth
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Set up the database

Generate and run migrations:

```bash
# Generate migration files from schema
bun x drizzle-kit generate

# Apply migrations to database
bun x drizzle-kit migrate

# (Optional) Open Drizzle Studio to view database
bun x drizzle-kit studio
```

### 5. Run the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pneumademy/
├── docs/                      # Documentation
│   ├── adr/                   # Architecture Decision Records
│   └── understanding-system.md # Comprehensive system docs
├── src/
│   ├── actions/               # Server Actions
│   ├── app/                   # Next.js App Router
│   │   ├── api/auth/          # Better Auth API routes
│   │   ├── dashboard/         # Protected dashboard area
│   │   ├── login/             # Login page
│   │   └── signup/            # Registration page
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   ├── db/
│   │   └── schema/            # Drizzle ORM schemas
│   ├── lib/                   # Utilities and config
│   └── proxy.ts               # Route protection
└── drizzle/                   # Generated migrations
```

## Authentication & Authorization

### Role System

| Role         | Permissions                                                           |
| ------------ | --------------------------------------------------------------------- |
| **Admin**    | Full system access, user management, course creation, role promotion  |
| **Disciple** | Access to all standard courses + disciple-only content, can comment   |
| **Learner**  | Access to standard courses only, can comment (default role on signup) |

### Key Rules

- New users automatically assigned `learner` role
- Only admins can promote users to `disciple`
- Disciple-only content is **completely hidden** from learners (not just locked)
- Users cannot set or change their own role
- Content is platform-only (no downloads or external sharing)

## Adding UI Components

This project uses shadcn/ui components. To add new components:

```bash
bunx shadcn@latest add [component-name]
```

Example:

```bash
bunx shadcn@latest add dialog
bunx shadcn@latest add dropdown-menu
```

Components are installed in `src/components/ui/` and can be imported as:

```tsx
import { Button } from "@/components/ui/button";
```

## Available Scripts

```bash
# Development
bun dev              # Start dev server with Turbopack

# Database
bun x drizzle-kit generate  # Generate migrations
bun x drizzle-kit migrate   # Apply migrations
bun x drizzle-kit studio    # Open Drizzle Studio GUI

# Linting & Formatting
bun run lint         # Run ESLint
bun run format       # Run Prettier (if configured)

# Build
bun run build        # Build for production
bun start            # Start production server
```

## Documentation

- **[Understanding the System](docs/understanding-system.md)** - Comprehensive architecture and implementation docs
- **[Architecture Decision Records](docs/adr/)** - Why we made specific technical choices
  - [ADR-001: Use LADR](docs/adr/ADR-001-use-ladr.md)
  - [ADR-002: Use Next.js with Bun](docs/adr/ADR-002-use-nextjs-with-bun.md)
  - [ADR-003: Use shadcn/ui](docs/adr/ADR-003-use-shadcn-ui.md)
  - [ADR-004: Use Drizzle ORM with PostgreSQL](docs/adr/ADR-004-use-drizzle-orm-postgresql.md)
  - [ADR-005: Use Better Auth](docs/adr/ADR-005-use-better-auth.md)

## Security

- All authentication handled by Better Auth
- Session management with IP tracking and user agent logging
- Password hashing and secure storage
- CSRF protection via Next.js integration
- Role-based access control enforced at route and database levels
- Environment variables for sensitive credentials

## Development Status

**Complete:**

- ✅ Authentication system (email/password + Google OAuth)
- ✅ User registration and login
- ✅ Role field in database
- ✅ Route protection via proxy
- ✅ Admin plugin integration

**In Progress:**

- ⏳ Course management system
- ⏳ Lesson viewer
- ⏳ RBAC middleware implementation
- ⏳ Admin dashboard
- ⏳ Comment system

**Planned:**

- 📋 Progress tracking
- 📋 Enrollment system
- 📋 Video/file upload to S3/R2
- 📋 Email verification flow
- 📋 Password reset functionality

## Contributing

This is a private church project. If you have access and want to contribute:

1. Create a new branch for your feature
2. Follow the existing code patterns
3. Add appropriate ADR if making architectural decisions
4. Update documentation as needed
5. Test thoroughly before merging

## License

See [LICENSE](LICENSE) file for details.

## Development Team

Maintained by the church development team.

---

**Note**: This platform handles sensitive religious education content. Please maintain confidentiality and respect the privacy of all users.
