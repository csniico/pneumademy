# ADR-003: Use shadcn/ui with Radix Mira Theme

## Status

Accepted

## Context

Pneumademy needs a UI component library that:

- Provides accessible, production-ready components
- Is customizable and themeable
- Integrates well with Next.js and TypeScript
- Uses Tailwind CSS for styling
- Offers dark mode support
- Has good developer experience

We need to choose between fully-packaged component libraries (Material-UI, Ant Design) versus copy-paste/compose-your-own approaches.

## Decision

We will use **shadcn/ui** with the following configuration:

- **Style**: `radix-mira`
- **Base Color**: `mauve`
- **Icon Library**: `lucide-react`
- **RSC**: Enabled (React Server Components)
- **CSS Variables**: Enabled for theming

### Why shadcn/ui

- Components are copied into the codebase (full ownership)
- Built on Radix UI primitives (accessibility first)
- Styled with Tailwind CSS (consistent with our approach)
- No runtime package dependency after installation
- Easy to customize without fighting the library

### Theme Configuration

```json
{
  "style": "radix-mira",
  "rsc": true,
  "tailwind": {
    "baseColor": "mauve",
    "cssVariables": true
  },
  "iconLibrary": "lucide"
}
```

## Consequences

### Positive

- **Full Control**: Components live in our codebase - can modify freely
- **No Lock-in**: Not dependent on external package versioning
- **Performance**: Tree-shakeable, only ship what we use
- **Accessibility**: Radix UI primitives are WCAG compliant
- **Consistency**: Mira theme provides cohesive design system
- **DX**: TypeScript support, good documentation
- **Customization**: Easy to adapt components to design needs

### Negative

- **Maintenance**: We own the component code (updates require manual copying)
- **Bundle Size**: Need to be mindful of importing only needed components
- **Initial Setup**: Takes time to add components as needed
- **Documentation**: Need to document custom modifications

### Neutral

- Components added via CLI: `bunx shadcn@latest add [component]`
- Stored in `src/components/ui/`
- Aliases configured: `@/components`, `@/lib`, `@/ui`
- Can mix with custom components seamlessly
- Theme changes require updating CSS variables
