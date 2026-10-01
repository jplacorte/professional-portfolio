import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { cspHash } from './csp';
import { THEME_INIT_SCRIPT } from './theme';

describe('cspHash', () => {
  it('matches the known SHA-256 of the empty string', () => {
    expect(cspHash('')).toBe('sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=');
  });

  it('changes whenever the inline theme script changes', () => {
    expect(cspHash(THEME_INIT_SCRIPT)).not.toBe(cspHash(`${THEME_INIT_SCRIPT} `));
  });
});

describe('THEME_INIT_SCRIPT', () => {
  it('only ever applies a known theme value', () => {
    const run = (stored: string | null, prefersDark: boolean) => {
      const root = { dataset: {} as Record<string, string> };
      runInNewContext(THEME_INIT_SCRIPT, {
        localStorage: { getItem: () => stored },
        document: { documentElement: root },
        matchMedia: () => ({ matches: prefersDark }),
      });
      return root.dataset.theme;
    };
    expect(run('dark', false)).toBe('dark');
    expect(run('light', true)).toBe('light');
    expect(run('<img onerror=alert(1)>', true)).toBe('dark');
    expect(run(null, false)).toBe('light');
  });
});
