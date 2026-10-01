/** Media-query helpers shared by the client-side scripts. */

export const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = (): boolean => window.matchMedia('(pointer: fine)').matches;
