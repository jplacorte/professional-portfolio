import { createHash } from 'node:crypto';

/** CSP source expression for an inline script or style, e.g. `sha256-AbC…=`. Build-time only. */
export const cspHash = (content: string): `sha256-${string}` =>
  `sha256-${createHash('sha256').update(content, 'utf8').digest('base64')}`;
