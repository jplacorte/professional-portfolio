// @ts-check
/**
 * Serves the production build the way Vercel does for this site: static files with clean URLs,
 * plus the response headers declared in .vercel/output/config.json (CSP and security headers).
 * Used by `npm run preview` and by Playwright, so E2E tests exercise the real security policy.
 * Not used in production.
 *
 *   node tools/preview-server.mjs [port]
 */
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../.vercel/output/', import.meta.url));
const staticDir = join(root, 'static');
const port = Number(process.argv[2] ?? 4321);

/** @type {{ routes?: Array<{ src?: string, headers?: Record<string, string>, status?: number, handle?: string }> }} */
const config = JSON.parse(await readFile(join(root, 'config.json'), 'utf8'));
const headerRoutes = (config.routes ?? [])
  .filter((r) => r.src && r.headers && !r.status)
  .map((r) => ({ pattern: new RegExp(r.src?.startsWith('^') ? r.src : `^${r.src}$`), headers: r.headers ?? {} }));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

/** @param {string} path */
async function resolveFile(path) {
  const safe = normalize(decodeURIComponent(path)).replace(/^(\.\.[/\\])+/, '');
  for (const candidate of [safe, `${safe}.html`, join(safe, 'index.html')]) {
    const file = join(staticDir, candidate);
    if (!file.startsWith(staticDir)) return null;
    try {
      if ((await stat(file)).isFile()) return file;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  for (const route of headerRoutes) {
    if (route.pattern.test(pathname)) for (const [k, v] of Object.entries(route.headers)) res.setHeader(k, v);
  }
  const file = await resolveFile(pathname === '/' ? '/index.html' : pathname);
  if (!file) {
    res.statusCode = 404;
    const notFound = join(staticDir, '404.html');
    res.setHeader('Content-Type', TYPES['.html']);
    createReadStream(notFound).pipe(res);
    return;
  }
  res.setHeader('Content-Type', TYPES[/** @type {keyof typeof TYPES} */ (extname(file))] ?? 'application/octet-stream');
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving build on http://localhost:${port}`));
