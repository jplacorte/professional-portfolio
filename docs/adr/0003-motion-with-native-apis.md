# 0003 — Motion with native browser APIs, no animation library

- **Status:** Accepted
- **Date:** 2026-09-30

## Context

The site should feel crafted (motion is part of the impression) without compromising performance,
accessibility or battery life.

## Decision

Build all motion on platform features:

- CSS scroll-driven animations for reveals and reading progress, with an `IntersectionObserver` fallback.
- The View Transitions API for page transitions and the theme switch (see [0004](0004-strict-csp-and-native-view-transitions.md)).
- A hand-written Canvas 2D loop for the hero, with its physics as pure functions in
  `src/scripts/hero-field/physics.ts` so it can be unit-tested.

Every effect is progressive enhancement and switches off under `prefers-reduced-motion`.

## Alternatives considered

- **GSAP / Motion / Anime.js.** Excellent libraries, but they would add more JavaScript than the whole motion
  layer currently weighs, for effects the platform now does natively.

## Consequences

- The motion layer is a few kilobytes and largely runs off the main thread.
- Browsers without scroll timelines or view transitions get a static but complete experience.
- The canvas pauses when off-screen or in a background tab and draws a single frame for reduced motion.
- Complex choreography (timelines with many dependent steps) would be harder; revisit if the design needs it.
