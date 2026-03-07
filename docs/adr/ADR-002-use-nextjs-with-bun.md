# ADR-002: Use Next.js with Bun as Package Manager

## Status

Accepted

## Context

Pneumademy requires a modern, performant web framework that supports:

- Server-side rendering (SSR) for better SEO
- React Server Components for improved performance
- File-based routing for intuitive project structure
- API routes for backend functionality
- TypeScript support out of the box
- Fast development experience with hot module replacement

We also need a package manager that is:

- Fast for installing dependencies
- Compatible with Next.js ecosystem
- Memory efficient
- Has good TypeScript support

## Decision

We will use **Next.js 15** with the **App Router** as our web framework, and **Bun** as our package manager and runtime.

### Framework Choice: Next.js

- Latest stable version (v15)
- App Router for modern React patterns
- Built-in support for Server Components and Server Actions
- Excellent TypeScript integration
- Strong community and ecosystem

### Package Manager: Bun

- Significantly faster than npm/yarn/pnpm
- Drop-in replacement for Node.js
- Native TypeScript support
- Built-in test runner and bundler
- Compatible with npm packages

## Consequences

### Positive

- **Fast Development**: Bun's speed improves install times and development server startup
- **Modern Architecture**: App Router provides better patterns for data fetching and routing
- **Type Safety**: Full TypeScript support across the stack
- **Performance**: Server Components reduce client-side JavaScript
- **Developer Experience**: Hot reload, file-based routing, integrated API routes
- **SEO Ready**: Built-in SSR capabilities

### Negative

- **Learning Curve**: App Router is newer and requires learning new patterns
- **Bun Maturity**: Bun is relatively new (though stable)
- **Ecosystem**: Some npm packages may have edge cases with Bun
- **Deployment**: Need to ensure hosting platform supports Next.js 15 features

### Neutral

- Need to follow Next.js conventions for optimal performance
- Regular updates required to keep up with Next.js ecosystem
- Team needs to understand Server vs Client Components distinction
