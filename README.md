# John Phillip Lacorte — Portfolio

[![CI](https://github.com/jplacorte/professional-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/jplacorte/professional-portfolio/actions/workflows/ci.yml)
[![CodeQL](https://github.com/jplacorte/professional-portfolio/actions/workflows/codeql.yml/badge.svg)](https://github.com/jplacorte/professional-portfolio/actions/workflows/codeql.yml)

**Live:** [john-phillip-lacorte.vercel.app](https://john-phillip-lacorte.vercel.app)

Portfolio and case studies. A static-first [Astro](https://astro.build) site with typed MDX content,
native-API motion, a strict hash-based Content Security Policy and one serverless function. It's tested end to
end in real browsers and scores 95+ in every Lighthouse category.

## Highlights

- **Static-first:** every page is pre-rendered; `/api/contact` is the only server code ([ADR 0001](docs/adr/0001-astro-static-first.md)).
- **Secure by default:** hash-based CSP with no `'unsafe-inline'` scripts, HSTS and hardening headers on every
  response, a hardened contact endpoint, a clean `npm audit`, CodeQL and Dependabot ([SECURITY.md](SECURITY.md), [ADR 0004](docs/adr/0004-strict-csp-and-native-view-transitions.md)).
- **Tested where it matters:** unit tests for logic, and Playwright + axe end-to-end tests on desktop and mobile
  against the production build with its real security headers ([ADR 0007](docs/adr/0007-testing-strategy.md)).
- **Accessible:** WCAG 2.1 AA verified on every page in light and dark mode; every animation respects
  `prefers-reduced-motion`.
- **Decisions on record:** architecture decision records in [`docs/adr`](docs/adr).

## Tech stack

| Area      | Choice                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------- |
| Framework | Astro 7 (static output, one on-demand route) on Vercel                                                  |
| Language  | TypeScript (`strictest`, `exactOptionalPropertyTypes`)                                                  |
| Content   | MDX in Astro content collections, validated with Zod                                                    |
| Styling   | Tailwind CSS v4 (CSS-first config), design tokens for light and dark themes                             |
| Motion    | Cross-document View Transitions, CSS scroll-driven animations, Canvas 2D — no libraries                 |
| Contact   | Cloudflare Turnstile + Resend over `fetch`                                                              |
| Quality   | ESLint (`strictTypeChecked`, Astro, jsx-a11y), Prettier, Vitest, Playwright, axe, Lighthouse CI, lychee |

## Getting started

Requires Node 22.12+ (`nvm use` reads `.nvmrc`).

```bash
npm install
npm run dev                        # http://localhost:4321 — drafts are visible here
npx playwright install chromium    # once, for end-to-end tests
```

Copy `.env.example` to `.env` to try the contact form locally. Without keys it answers "not configured".
Cloudflare's [test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) work on `localhost`.

## Scripts

| Command                           | What it does                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`                     | Dev server with hot reload (CSP is a build-time feature, so it's off here)   |
| `npm run build`                   | Production build to `.vercel/output` (drafts excluded)                       |
| `npm run preview`                 | Serve the build locally with the same CSP and headers Vercel sends           |
| `npm run check`                   | Type-check `.astro`, `.ts` and content schemas                               |
| `npm run lint` / `lint:fix`       | ESLint                                                                       |
| `npm run format` / `format:check` | Prettier (Astro + Tailwind class sorting)                                    |
| `npm test` / `test:watch`         | Vitest unit tests                                                            |
| `npm run test:e2e`                | Build, then Playwright end-to-end, accessibility and security tests          |
| `npm run ci`                      | The local equivalent of CI's first job: lint → format → types → unit → build |

A pre-commit hook (Husky + lint-staged) lints and formats staged files.

## Project structure

```text
├── docs/adr/              Architecture decision records
├── integrations/          Astro integrations (security headers → Vercel build output)
├── tests/e2e/             Playwright suites: pages, navigation, theme, contact, a11y, security, motion
├── tools/                 Local tooling (header-aware preview server)
└── src/
    ├── components/
    │   ├── contact/       ContactForm
    │   ├── diagrams/      SVG diagrams embedded in case studies
    │   ├── home/          Home-page sections (Hero, StackMarquee, Principles, …)
    │   ├── layout/        Header, Footer, ThemeToggle
    │   ├── motion/        HeroField (canvas host), SplitHeadline
    │   ├── projects/      ProjectList, ProjectHeader, TableOfContents, …
    │   └── ui/            Primitives (Button, TextField, TextArea, SectionHeader, …)
    ├── config/            site.ts (personal details, URL) · security.ts (CSP and headers)
    ├── content/projects/  One MDX file per case study
    ├── content.config.ts  Zod schema for case-study frontmatter
    ├── data/              Structured copy: experience (mirrors the CV), principles
    ├── layouts/           BaseLayout (head, SEO, theme), CaseStudyLayout
    ├── lib/               Build-time and server logic, unit-tested
    │   ├── contact/       Handler, schema, email, Turnstile, Resend
    │   ├── og.ts, woff.ts Social preview images (build time)
    │   ├── projects.ts    Querying, sorting, filtering
    │   ├── seo.ts         JSON-LD builders
    │   └── theme.ts, csp.ts  Theme bootstrap script and its CSP hash
    ├── pages/             File-based routes; api/contact.ts is the only server route
    ├── scripts/           Browser behaviour, one module per feature, loaded once per page
    ├── styles/            tokens → base → prose → motion
    └── types/             Ambient types for third-party browser APIs
```

### Conventions

- **Pages compose, components render, `lib` decides.** Components are markup only. Logic that doesn't need a
  browser lives in `src/lib` with a colocated `*.test.ts`. Browser behaviour lives in `src/scripts`.
- **No inline scripts.** All client code is bundled from `src/scripts`, so the CSP can hash it. The single
  exception, the pre-paint theme script, is hashed from the constant it's rendered from.
- **No type assertions in production code.** Narrow with checks, or model the types properly.
- **Content is data.** Personal details come from `config/site.ts` and `data/*`. `data/experience.ts` mirrors the
  CV in `public/resume.pdf`; update both in the same commit.
- **Imports use the `@/` alias** for anything outside the current folder.
- **Design tokens** (`--ink`, `--accent`, …) through Tailwind utilities keep light and dark themes in sync.
- **Conventional Commits** (`feat:`, `fix:`, `chore:` …).

## Adding a project

Create `src/content/projects/my-project.mdx`. The build fails if the frontmatter doesn't match the schema.

```mdx
---
title: My Project
summary: One sentence, outcome first. (≤180 chars)
role: Solo — design, backend, infra
stack: [Next.js, Hono, Postgres]
status: live # live | complete | in-progress | archived
year: '2026'
links: { live: https://…, repo: https://… }
featured: true # show on the home page
order: 2 # lower sorts first
draft: false # true = visible in dev only
---

## Overview

## Architecture

## Key decisions

## What I’d do differently
```

`<Todo>…</Todo>` from `@/components/ui/Todo.astro` leaves an authoring note that shows only in `npm run dev`.

## Architecture

- **Static by default.** Every page is pre-rendered. Only `/api/contact` runs as a Vercel function.
- **Security.** See [SECURITY.md](SECURITY.md). The CSP is generated by Astro and sent as a header;
  `integrations/security-headers.ts` adds the remaining headers to Vercel's build output.
- **Contact flow.** Origin check → size/type limits → Zod validation → honeypot → Turnstile → Resend. The route
  is a thin adapter over a dependency-injected handler. Works with and without JavaScript.
- **SEO and sharing.** Per-page titles, descriptions, canonical URLs, JSON-LD, sitemap, `robots.txt`, and
  build-time Open Graph images: one default card plus one per case study.

## Motion

All motion is progressive enhancement and switches off under `prefers-reduced-motion`.

| Effect                                                  | Implementation                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------------- |
| Interactive dot-field hero                              | Canvas 2D renderer + pure, unit-tested physics; pauses when off-screen |
| Headline word stagger                                   | CSS keyframes per word (`SplitHeadline`)                               |
| Page transitions and title morph into case-study header | Native cross-document View Transitions + `view-transition-name`        |
| Scroll reveals                                          | CSS `animation-timeline: view()`, `IntersectionObserver` fallback      |
| Reading progress bar                                    | CSS `animation-timeline: scroll()`, JS fallback                        |
| Circular theme-switch reveal                            | `document.startViewTransition` + `clip-path`                           |
| Cursor-following project preview, magnetic buttons      | `requestAnimationFrame` easing, fine pointers only                     |

## CI

Every push and pull request runs `.github/workflows/ci.yml`:

1. **Verify:** dependency audit, lint, format, type check, unit tests, build.
2. **End to end** (Playwright, desktop + mobile): pages, navigation, theme, contact form, CSP and headers, axe
   WCAG 2.1 AA in both themes.
3. **Lighthouse CI:** every category ≥ 95 (`lighthouserc.json`).
4. **Links:** offline check of the generated HTML.

CodeQL (`security-extended`) runs on pull requests and weekly; Dependabot opens grouped update PRs weekly.

## Deploying

1. Import the repository in Vercel (framework preset: Astro).
2. Add the environment variables from `.env.example`.
3. Set `SITE.url` in `src/config/site.ts` to the live domain. Canonical URLs, the sitemap and social previews
   are built from it.
4. Submit `https://<domain>/sitemap-index.xml` in Google Search Console.
