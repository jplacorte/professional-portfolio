/**
 * Entry point for all browser behaviour, loaded once per page by BaseLayout.
 * Every module is progressive enhancement: it no-ops when its element is absent, and
 * motion effects no-op under `prefers-reduced-motion`. The page works without any of them.
 */
import { initContactForm } from './contact-form';
import { initHeader } from './header';
import { initHeroField } from './hero-field';
import { defineLocalTime } from './local-time';
import { initMagnetic } from './magnetic';
import { initReadingProgress } from './reading-progress';
import { initReveals } from './reveal';
import { initRowPreview } from './row-preview';
import { initThemeToggle } from './theme-toggle';
import { initTocSpy } from './toc-spy';

defineLocalTime();
initHeader();
initThemeToggle();
initHeroField();
initReveals();
initMagnetic();
initRowPreview();
initReadingProgress();
initTocSpy();
initContactForm();
