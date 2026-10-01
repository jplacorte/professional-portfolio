/**
 * Reading progress bar on case studies. Browsers with scroll timelines animate it
 * in CSS (styles/motion.css); this sets `--progress` for the rest.
 */
export function initReadingProgress(): void {
  const bar = document.querySelector<HTMLElement>('.reading-progress');
  if (!bar || CSS.supports('animation-timeline: scroll()')) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--progress', String(max > 0 ? window.scrollY / max : 0));
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}
