/**
 * Adds site-wide security headers to the Vercel Build Output config after the adapter writes it.
 *
 * Why an integration: static pages are served by Vercel's CDN, not by Astro, so middleware never
 * sees them. The Build Output API's `routes` (with `continue: true`) is the documented way to attach
 * headers to every response, static files and functions alike.
 * https://vercel.com/docs/build-output-api/configuration#routes
 */
import { readFile, writeFile } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';

interface Route {
  src?: string;
  headers?: Record<string, string>;
  continue?: boolean;
  [key: string]: unknown;
}

interface BuildOutputConfig {
  version: number;
  routes?: Route[];
  [key: string]: unknown;
}

const MATCH_ALL = '^/(.*)$';

/** Returns a copy of `config` with one catch-all header route first. Idempotent across rebuilds. */
export function withSecurityHeaders(config: BuildOutputConfig, headers: Record<string, string>): BuildOutputConfig {
  const routes = (config.routes ?? []).filter((route) => !(route.src === MATCH_ALL && route.continue && route.headers));
  return { ...config, routes: [{ src: MATCH_ALL, headers, continue: true }, ...routes] };
}

export default function securityHeaders(headers: Record<string, string>): AstroIntegration {
  return {
    name: 'security-headers',
    hooks: {
      'astro:build:done': async ({ logger }) => {
        const configUrl = new URL('../.vercel/output/config.json', import.meta.url);
        let config: BuildOutputConfig;
        try {
          config = JSON.parse(await readFile(configUrl, 'utf8')) as BuildOutputConfig;
        } catch {
          logger.warn('No .vercel/output/config.json found; security headers were not applied.');
          return;
        }
        await writeFile(configUrl, `${JSON.stringify(withSecurityHeaders(config, headers), null, 2)}\n`);
        logger.info(`Applied ${Object.keys(headers).length} security headers to all routes.`);
      },
    },
  };
}
