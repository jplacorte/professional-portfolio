/** Media-query helpers shared by the client-side scripts. */

export const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = (): boolean => window.matchMedia('(pointer: fine)').matches;

/** Removes a window listener when Astro swaps to the next page (view transitions). */
export function removeOnSwap<K extends keyof WindowEventMap>(type: K, listener: (e: WindowEventMap[K]) => void): void {
  document.addEventListener('astro:before-swap', () => window.removeEventListener(type, listener), { once: true });
}
