import { hasFinePointer, prefersReducedMotion } from './media';

/** How quickly the card catches up with the cursor each frame (0–1). */
const EASING = 0.14;
/** Horizontal offset so the card sits beside the cursor rather than under it. */
const OFFSET_X = 170;

/**
 * Floating preview card that trails the cursor over `[data-preview-list]` rows.
 * Row content comes from `data-preview-*` attributes rendered by ProjectList.astro.
 */
export function initRowPreview(): void {
  if (prefersReducedMotion() || !hasFinePointer()) return;

  const list = document.querySelector<HTMLElement>('[data-preview-list]');
  const card = document.querySelector<HTMLElement>('[data-preview-card]');
  if (!list || !card) return;

  const fields = {
    title: card.querySelector<HTMLElement>('[data-preview-title]'),
    label: card.querySelector<HTMLElement>('[data-preview-label]'),
    stack: card.querySelector<HTMLElement>('[data-preview-stack]'),
  };

  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let frame = 0;
  let active = false;

  const tick = () => {
    current.x += (target.x - current.x) * EASING;
    current.y += (target.y - current.y) * EASING;
    card.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) scale(${active ? 1 : 0.6})`;
    frame = requestAnimationFrame(tick);
  };

  list.addEventListener('pointerenter', () => {
    active = true;
    card.style.opacity = '1';
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  });
  list.addEventListener('pointerleave', () => {
    active = false;
    card.style.opacity = '0';
    // Let the fade-out finish before stopping the loop.
    setTimeout(() => !active && cancelAnimationFrame(frame), 400);
  });
  list.addEventListener('pointermove', (e) => {
    target.x = e.clientX + OFFSET_X;
    target.y = e.clientY;
  });

  list.querySelectorAll<HTMLElement>('[data-preview]').forEach((row) => {
    row.addEventListener('pointerenter', () => {
      if (fields.title) fields.title.textContent = row.dataset.previewTitle ?? '';
      if (fields.label) fields.label.textContent = row.dataset.preview ?? '';
      if (fields.stack) fields.stack.textContent = row.dataset.previewStack ?? '';
      card.style.setProperty('--hue', row.dataset.previewHue ?? '12');
    });
  });
}
