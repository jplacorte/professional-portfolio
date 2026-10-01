import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { woffToSfnt } from './woff';

const require = createRequire(import.meta.url);
const interWoff = () => readFile(require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff'));

describe('woffToSfnt', () => {
  it('produces a TrueType font with the same tables', async () => {
    const woff = await interWoff();
    const sfnt = woffToSfnt(woff);
    expect(sfnt.readUInt32BE(0)).toBe(woff.readUInt32BE(4)); // flavor carried over (TrueType 0x00010000)
    expect(sfnt.readUInt16BE(4)).toBe(woff.readUInt16BE(12)); // same table count
    expect(sfnt.length).toBeGreaterThanOrEqual(woff.readUInt32BE(16)); // ≥ declared uncompressed size
  });

  it('rejects files that are not WOFF', () => {
    expect(() => woffToSfnt(new Uint8Array([0, 1, 0, 0]))).toThrow('Not a WOFF 1.0 font.');
  });
});
