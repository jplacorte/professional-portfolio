import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme';
import { prefersReducedMotion } from './media';

const currentTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

function persist(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode); the theme still applies to this page.
  }
}

function syncButton(button: HTMLButtonElement): void {
  button.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
}

/** Circular reveal from the click point, using the View Transitions API where available. */
function switchTheme(event: MouseEvent, button: HTMLButtonElement): void {
  const root = document.documentElement;
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  const apply = () => {
    root.dataset.theme = next;
    persist(next);
    syncButton(button);
  };

  // Feature-detect: Firefox and older Safari don't implement view transitions yet.
  if (!('startViewTransition' in document) || prefersReducedMotion()) {
    apply();
    return;
  }

  const { clientX: x, clientY: y } = event;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.classList.add('theme-switching');
  const transition = document.startViewTransition(apply);
  void transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
    );
  });
  void transition.finished.finally(() => root.classList.remove('theme-switching'));
}

export function initThemeToggle(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button) return;
  syncButton(button);
  button.addEventListener('click', (event) => switchTheme(event, button));
}
