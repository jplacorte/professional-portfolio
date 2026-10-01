# 0002 — Content as MDX in Git, validated by Zod

- **Status:** Accepted
- **Date:** 2026-09-30

## Context

There is one author. Case studies mix prose, code, diagrams and occasionally components. Content changes
should be reviewable, and a mistake (a missing field or a broken link) should never reach production.

## Decision

Store each case study as an MDX file in `src/content/projects`, loaded through an Astro content collection
whose frontmatter is validated by a Zod schema (`src/content.config.ts`). Structured copy that isn't prose
(experience, principles) lives as typed data in `src/data`.

## Alternatives considered

- **Headless CMS (Payload, Sanity).** An editing UI I don't need, at the cost of another service, a bill and
  an authentication surface to secure.
- **Plain Markdown without a schema.** Simpler, but errors surface as broken pages instead of failed builds.

## Consequences

- Content is versioned, diffable and reviewed in pull requests like code.
- An invalid case study fails `astro build` with a precise error.
- `draft: true` keeps unfinished work on `main`, visible in dev and never built for production.
- Editing requires a code editor, which is acceptable for a single technical author.
