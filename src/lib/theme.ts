/**
 * Theme constants shared by the server (pre-paint script, CSP hash) and the browser (toggle).
 * Keep this file dependency-free: astro.config.mjs imports it to hash THEME_INIT_SCRIPT.
 */

export const THEME_STORAGE_KEY = 'theme';

export type Theme = 'light' | 'dark';

/**
 * Runs in <head> before first paint so the page never flashes the wrong theme.
 * It must be inline (a module script would run too late), so the CSP allows it by hash.
 * See `security.csp.scriptDirective.hashes` in astro.config.mjs.
 */
export const THEME_INIT_SCRIPT = `(()=>{let t=null;try{t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})}catch{}document.documentElement.dataset.theme=t==="light"||t==="dark"?t:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"})();`;
