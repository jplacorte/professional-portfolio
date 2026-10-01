# Security policy

## Reporting a vulnerability

Please email **jaypeelacorte28@gmail.com** with "Security" in the subject. Include steps to reproduce and the
impact you expect. I'll acknowledge within 3 working days and keep you updated until it's resolved. Please
don't open a public issue for security problems.

## What's in place

| Area             | Measure                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| Browser          | Hash-based Content Security Policy (no `'unsafe-inline'` scripts), `frame-ancestors 'none'`       |
| Transport        | HSTS, `upgrade-insecure-requests`                                                                 |
| Headers          | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP        |
| Contact endpoint | Same-origin check, size/type limits, schema validation, honeypot, Turnstile, timeouts, `no-store` |
| Secrets          | Server-only environment variables via `astro:env`; nothing secret is committed                    |
| Supply chain     | `npm audit` gated in CI, Dependabot (npm + Actions), CodeQL `security-extended` weekly and on PRs |
| Verification     | Playwright tests assert the headers and that injected inline scripts are blocked                  |

Policy definitions live in [`src/config/security.ts`](src/config/security.ts); the reasoning is in
[ADR 0004](docs/adr/0004-strict-csp-and-native-view-transitions.md).

## Known, accepted risks

- **No per-IP rate limit on `/api/contact`.** Serverless instances don't share memory, so a real limiter needs
  a shared store. Turnstile and the honeypot make automated abuse expensive; a Vercel Firewall rate-limit
  rule is the next step if abuse appears.
- **`style-src-attr 'unsafe-inline'`.** Inline style _attributes_ (animation delays, view-transition names,
  code highlighting) can't be hashed. They can't execute script, so script protection is unaffected.
