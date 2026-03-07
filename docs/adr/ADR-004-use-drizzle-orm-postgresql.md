# ADR-004: Use Drizzle ORM with PostgreSQL

## Status

Accepted

## Context

Pneumademy needs a database solution that:

- Scales with growing user base and content
- Provides strong data consistency and relations
- Supports complex queries efficiently
- Integrates well with TypeScript
- Offers good developer experience

We also need an ORM that:

- Type-safe at compile time
- Generates SQL we can understand and optimize
- Lightweight with minimal overhead
- Supports migrations
- Works well with serverless environments

Database options considered:

- **PostgreSQL**: Robust, proven, excellent for relational data
- **MySQL**: Similar feature set, but PostgreSQL has better JSON support
- **MongoDB**: NoSQL flexibility, but educational platform needs strong relations

ORM options considered:

- **Prisma**: Popular but heavy, less control over SQL
- **TypeORM**: Mature but dated patterns
- **Drizzle**: Modern, type-safe, lightweight

## Decision

We will use **Drizzle ORM** with **PostgreSQL** (via Neon serverless).

### Database: PostgreSQL

- Hosted on **Neon** (serverless PostgreSQL)
- Connection via `@neondatabase/serverless` driver
- Enables auto-scaling and edge compatibility

### ORM: Drizzle

- Schema-first approach with TypeScript
- SQL-like query builder (familiar to SQL developers)
- Excellent TypeScript inference
- Minimal runtime overhead
- Built-in migration system via `drizzle-kit`

### Configuration

```typescript
// drizzle.config.ts
{
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
}
```

## Consequences

### Positive

- **Type Safety**: End-to-end TypeScript types from schema to queries
- **Performance**: PostgreSQL reliability with Neon's serverless scaling
- **Developer Experience**: SQL-like syntax is intuitive
- **Serverless Ready**: Works in edge environments
- **Lightweight**: Minimal bundle size impact
- **Relations**: Strong support for foreign keys and joins
- **Migrations**: Easy schema evolution with drizzle-kit
- **JSON Support**: PostgreSQL JSON/JSONB for flexible data

### Negative

- **Learning Curve**: Drizzle is newer, less Stack Overflow answers
- **Ecosystem**: Smaller community compared to Prisma
- **Neon Dependency**: Tied to Neon for hosting (can migrate if needed)
- **Schema Management**: Need discipline with migration workflow

### Neutral

- Migrations generated via: `bun x drizzle-kit generate`
- Migrations applied via: `bun x drizzle-kit migrate`
- Schema organized in: `src/db/schema/`
- Database client exported from: `src/db/index.ts`
- Requires `DATABASE_URL` environment variable
- Works with connection pooling (PgBouncer compatible)
