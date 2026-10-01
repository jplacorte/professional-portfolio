# 0007 — Testing strategy

- **Status:** Accepted
- **Date:** 2026-10-01

## Context

The site has three kinds of risk: logic (validation, sorting, email building, physics), integration in a real
browser (CSP, navigation, client scripts, accessibility), and quality budgets (performance, broken links).

## Decision

| Layer           | Tool                                                              | Covers                                                                              |
| --------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Static analysis | TypeScript (strictest), ESLint with `strictTypeChecked`, Prettier | Types, unsafe `any`, floating promises, a11y lint in `.astro`                       |
| Unit            | Vitest                                                            | `src/lib/**`, script physics, the security-headers integration                      |
| End to end      | Playwright (desktop + mobile)                                     | Every page, navigation, theme, contact form (API stubbed), CSP and security headers |
| Accessibility   | axe-core in Playwright                                            | WCAG 2.1 A/AA on every page, light and dark                                         |
| Budgets         | Lighthouse CI, lychee                                             | ≥ 95 in all categories; no broken internal links                                    |

E2E tests run against the production build, served by `tools/preview-server.mjs` with the same CSP and headers
Vercel sends, and every E2E test fails on any console error or CSP violation.

## Consequences

- Logic is tested fast and in isolation; browsers are only used for what needs a browser.
- The contact API's network calls are stubbed in E2E; its logic is covered by handler unit tests.
- Visual regressions are checked manually with screenshot diffs during larger refactors. Automating them
  (Playwright `toHaveScreenshot`) is the next step if the design starts changing often.
