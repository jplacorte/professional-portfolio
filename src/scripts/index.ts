/**
 * Entry point for site-wide client behaviour. BaseLayout calls `initPage` on every
 * `astro:page-load`, so each module re-binds after a view-transition navigation.
 * Every effect is progressive enhancement: the page works without any of them.
 */
import { initMagnetic } from './magnetic';
import { initReadingProgress } from './reading-progress';
import { initReveals } from './reveal';
import { initRowPreview } from './row-preview';
import { initTocSpy } from './toc-spy';

export function initPage(): void {
  initReveals();
  initMagnetic();
  initRowPreview();
  initReadingProgress();
  initTocSpy();
}
