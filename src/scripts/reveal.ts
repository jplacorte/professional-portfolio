import { prefersReducedMotion } from './media';

/**
 * Scroll reveals for `[data-reveal]` elements.
 * Modern browsers use a CSS scroll-driven animation (see styles/motion.css);
 * this IntersectionObserver path is the fallback for the rest.
 */
export function initReveals(): void {
  if (CSS.supports('animation-timeline: view()') || prefersReducedMotion()) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );

  document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach((el) => io.observe(el));
}
