# ADR-005: Use Better Auth for Authentication

## Status

Accepted

## Context

Pneumademy requires a robust authentication system that:

- Supports multiple authentication methods (email/password, OAuth)
- Provides session management
- Integrates seamlessly with Next.js
- Offers role-based access control (RBAC)
- Is type-safe and modern
- Allows customization for educational platform needs

Authentication options considered:

- **NextAuth.js**: Popular but complex configuration, heavy abstraction
- **Clerk**: Managed service, but costly and less control
- **Auth0**: Enterprise-grade but overkill and expensive
- **Supabase Auth**: Good but ties us to Supabase ecosystem
- **Better Auth**: Modern, TypeScript-first, flexible

## Decision

We will use **Better Auth** for authentication and authorization.

### Why Better Auth

- Modern TypeScript framework built for Next.js
- Supports App Router patterns natively
- Flexible plugin system
- Direct database integration (works with our Drizzle setup)
- No external auth service dependency
- Built-in RBAC support
- Active development and responsive maintainers

### Configuration

```typescript
betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: { clientId, clientSecret }
  },
  plugins: [admin(), nextCookies()]
})
```

### Features Enabled

1. **Email & Password Authentication**
2. **Google OAuth**
3. **Admin Plugin** - User management and impersonation
4. **Next.js Cookies Plugin** - Proper cookie handling
5. **Custom User Fields** - Role, bio, avatarUrl, isActive

### Custom Schema Extensions

```typescript
user: {
  additionalFields: {
    role: { type: "string", defaultValue: "learner" },
    bio: { type: "string", required: false },
    avatarUrl: { type: "string", required: false },
    isActive: { type: "boolean", defaultValue: true }
  }
}
```

## Consequences

### Positive

- **Full Control**: Own the authentication logic, no external service dependency
- **Cost Effective**: No per-user pricing, self-hosted
- **TypeScript**: End-to-end type safety
- **Flexible**: Easy to add custom fields and behaviors
- **RBAC Ready**: Built-in support for role-based permissions
- **Modern Patterns**: Works with Server Components and Server Actions
- **Database Integration**: Uses our existing Drizzle schema
- **Session Management**: Built-in with IP tracking and user agent logging

### Negative

- **Newer Library**: Smaller community compared to NextAuth
- **Self-Managed**: Responsible for security updates and maintenance
- **Documentation**: Still evolving, fewer examples available
- **Setup Complexity**: More manual configuration than managed services

### Neutral

- API routes: `/api/auth/*` (handled by `toNextJsHandler`)
- Session checking via: `auth.api.getSession()`
- Proxy-based route protection (Better Auth recommended pattern)
- Requires environment variables:
  - `BETTER_AUTH_URL`
  - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (optional)
- Server actions in: `src/actions/users.ts`
- Database tables: `user`, `session`, `account`, `verification`

### Security Considerations

- Sessions stored in database (not JWT-only)
- IP address and user agent tracking
- Admin impersonation for support scenarios
- Email verification flow
- Password hashing handled by Better Auth
- CSRF protection via Next.js integration
