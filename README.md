# John Phillip Lacorte — Portfolio

Personal portfolio and case studies. A static-first [Astro](https://astro.build) site with typed MDX content, native-API animations and a single serverless function for the contact form.

## Tech stack

| Area      | Choice                                                                         |
| --------- | ------------------------------------------------------------------------------ |
| Framework | Astro 7 (static output, one on-demand route)                                   |
| Language  | TypeScript (strictest config)                                                  |
| Content   | MDX in Astro content collections, validated with Zod                           |
| Styling   | Tailwind CSS v4 (CSS-first config) + `@tailwindcss/typography`                 |
| Motion    | View Transitions API, CSS scroll-driven animations, Canvas 2D — no motion libs |
| Contact   | Cloudflare Turnstile + Resend, called over plain `fetch`                       |
| Quality   | ESLint (TS, Astro, jsx-a11y), Prettier, Vitest, Lighthouse CI, lychee          |
| Hosting   | Vercel                                                                         |

## Getting started

Requires Node 22.12+ (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:4321 — drafts and TODO prompts are visible here
```

Copy `.env.example` to `.env` to try the contact form locally. Without keys the form responds with a "not configured" message.

## Scripts

| Command                           | What it does                                                          |
| --------------------------------- | --------------------------------------------------------------------- |
| `npm run dev`                     | Dev server with hot reload                                            |
| `npm run build`                   | Production build to `.vercel/output` (drafts excluded)                |
| `npm run check`                   | Type-check `.astro`, `.ts` and content schemas                        |
| `npm run lint` / `lint:fix`       | ESLint                                                                |
| `npm run format` / `format:check` | Prettier (Astro + Tailwind class sorting)                             |
| `npm test` / `test:watch`         | Vitest unit tests                                                     |
| `npm run ci`                      | What CI runs before Lighthouse: lint → format → types → tests → build |

## Project structure

```text
src/
├── components/
│   ├── contact/        ContactForm
│   ├── diagrams/       SVG diagrams embedded in case studies
│   ├── home/           Home-page sections (Hero, StackMarquee, Principles, …)
│   ├── layout/         Header, Footer, ThemeToggle
│   ├── motion/         HeroField (canvas), SplitHeadline
│   ├── projects/       ProjectList, ProjectHeader, TableOfContents, …
│   └── ui/             Small reusable primitives (Button, FormField, SectionHeader, …)
├── config/site.ts      Name, links, availability, site URL — single source of truth
├── content/projects/   One MDX file per project (case study)
├── content.config.ts   Zod schema for project frontmatter
├── data/               Structured copy: experience (mirrors the CV), principles
├── layouts/            BaseLayout (head, SEO, theme), CaseStudyLayout
├── lib/                Build-time and server logic — framework-light and unit-tested
│   ├── contact/        Validation, email building, Turnstile, Resend
│   ├── og.ts           Social preview image rendering (build time)
│   ├── projects.ts     Querying, sorting and filtering projects
│   └── seo.ts          JSON-LD builders
├── pages/              Routes (file-based); api/contact.ts is the only server route
├── scripts/            Browser-only behaviour, one module per effect
└── styles/             tokens → base → prose → motion, imported by global.css
```

### Conventions

- **Pages compose, components render, `lib` decides.** Pages stay thin; logic that can be tested without a browser lives in `src/lib` with a colocated `*.test.ts`.
- **`src/scripts` is for the browser only.** Each effect is its own module, re-initialised on `astro:page-load` so it survives view-transition navigations, and each is a no-op under `prefers-reduced-motion`.
- **Content is data.** Personal details come from `config/site.ts` and `data/*`; nothing personal is hard-coded in components.
- **`data/experience.ts` mirrors the CV** in `public/resume.pdf` — update both in the same commit.
- **Imports use the `@/` alias** for anything outside the current folder.
- **Styling uses design tokens** (`--ink`, `--accent`, …) through Tailwind utilities, so light and dark themes stay in sync.

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

`<Todo>…</Todo>` (from `@/components/ui/Todo.astro`) leaves a note that shows in `npm run dev` and never in production. `caseStudy: false` lists a project without a detail page.

## Architecture

- **Static by default.** Every page is pre-rendered. Only `/api/contact` (`prerender = false`) runs as a Vercel function.
- **Contact flow.** Zod validation → honeypot → Turnstile verification → Resend email. Works without JavaScript (303 redirect back to the form) and with it (JSON response).
- **SEO.** Per-page titles, descriptions and canonical URLs, JSON-LD (`Person` and `CreativeWork`), sitemap and `robots.txt`.
- **Social previews.** Open Graph and X/Twitter tags on every page. Preview images are generated at build time (`lib/og.ts` → `pages/og/[...slug].png.ts`, satori + resvg): one default card plus one per case study, so a shared project link shows that project.

## Motion

All motion is progressive enhancement and switches off under `prefers-reduced-motion`.

| Effect                                                  | Implementation                                                    |
| ------------------------------------------------------- | ----------------------------------------------------------------- |
| Interactive dot-field hero                              | Canvas 2D; pauses off-screen and in hidden tabs; DPR capped at 2  |
| Headline word stagger                                   | CSS keyframes per word (`SplitHeadline`)                          |
| Page transitions and title morph into case-study header | View Transitions API via Astro `ClientRouter` + `transition:name` |
| Scroll reveals                                          | CSS `animation-timeline: view()`, `IntersectionObserver` fallback |
| Reading progress bar                                    | CSS `animation-timeline: scroll()`, JS fallback                   |
| Circular theme-switch reveal                            | `document.startViewTransition` + `clip-path`                      |
| Cursor-following project preview, magnetic buttons      | `requestAnimationFrame` easing, fine pointers only                |
| Architecture diagram packet flow                        | SVG `stroke-dashoffset` animation                                 |

## CI

`.github/workflows/ci.yml` runs on every push and pull request:

1. Lint, format check, type check, unit tests and build
2. Lighthouse CI against the built site — every category must score ≥ 95 (`lighthouserc.json`)
3. Offline link check of the generated HTML

## Deploying

1. Import the repository in Vercel (framework preset: Astro).
2. Add the environment variables from `.env.example`.
3. Point your domain at the project and set `SITE.url` in `src/config/site.ts` to match.
4. Submit `https://<your-domain>/sitemap-index.xml` in Google Search Console.

## Before publishing

- [ ] `src/config/site.ts`: set `url` to the portfolio's own domain.
- [ ] Fill in any remaining `<Todo>` prompts in `src/content/projects`.
- [ ] `public/resume.pdf` includes a phone number — replace it before the first public commit if you'd rather not publish it.
- [ ] Set the contact-form environment variables on Vercel.
