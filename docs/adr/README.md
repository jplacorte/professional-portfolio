# Architecture decision records

Short records of the decisions that shaped this codebase: the context at the time, what was decided, the
alternatives that were rejected, and the consequences, including the bad ones. New decisions get the next number;
superseded ones stay, marked as such, so the history stays honest.

| #                                                      | Decision                                                  | Status   |
| ------------------------------------------------------ | --------------------------------------------------------- | -------- |
| [0001](0001-astro-static-first.md)                     | Astro, static-first, one serverless function              | Accepted |
| [0002](0002-content-in-git.md)                         | Content as MDX in Git, validated by Zod                   | Accepted |
| [0003](0003-motion-with-native-apis.md)                | Motion with native browser APIs, no animation library     | Accepted |
| [0004](0004-strict-csp-and-native-view-transitions.md) | Hash-based CSP; native view transitions over ClientRouter | Accepted |
| [0005](0005-contact-endpoint.md)                       | Contact form: Resend + Turnstile behind a pure handler    | Accepted |
| [0006](0006-hosting-on-vercel.md)                      | Hosting on Vercel                                         | Accepted |
| [0007](0007-testing-strategy.md)                       | Testing strategy                                          | Accepted |
