import { describe, expect, it } from 'vitest';
import { withSecurityHeaders } from './security-headers';

const headers = { 'X-Frame-Options': 'DENY' };

describe('withSecurityHeaders', () => {
  it('puts a catch-all header route before every existing route', () => {
    const result = withSecurityHeaders({ version: 3, routes: [{ handle: 'filesystem' }] }, headers);
    expect(result.routes).toEqual([{ src: '^/(.*)$', headers, continue: true }, { handle: 'filesystem' }]);
  });

  it('is idempotent when the build runs twice', () => {
    const once = withSecurityHeaders({ version: 3, routes: [] }, headers);
    expect(withSecurityHeaders(once, headers)).toEqual(once);
  });

  it('keeps other config untouched', () => {
    const result = withSecurityHeaders({ version: 3, images: { sizes: [640] } }, headers);
    expect(result).toMatchObject({ version: 3, images: { sizes: [640] } });
  });
});
