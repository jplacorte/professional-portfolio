import { hasFinePointer, prefersReducedMotion } from './media';

const DEFAULT_STRENGTH = 0.35;

/** `[data-magnetic="0.3"]` elements lean toward the cursor. Fine pointers only. */
export function initMagnetic(): void {
  if (prefersReducedMotion() || !hasFinePointer()) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || DEFAULT_STRENGTH;
    el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';

    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}
