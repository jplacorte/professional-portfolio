import { inflateSync } from 'node:zlib';

const WOFF_SIGNATURE = 0x774f4646; // 'wOFF'
const WOFF_HEADER_SIZE = 44;
const WOFF_TABLE_ENTRY_SIZE = 20;
const SFNT_HEADER_SIZE = 12;
const SFNT_TABLE_ENTRY_SIZE = 16;

/**
 * Converts a WOFF 1.0 font into the plain TrueType/OpenType (sfnt) bytes it wraps.
 * WOFF is sfnt with each table optionally zlib-compressed (W3C WOFF 1.0, §4–5), so this only
 * rewrites the header and table directory and inflates tables with Node's built-in zlib.
 *
 * Why: the OG image renderer accepts WOFF but decompresses it with a library whose patched
 * release mis-parses these fonts. Handing it sfnt sidesteps that path entirely.
 */
export function woffToSfnt(woff: Uint8Array): Buffer {
  const input = Buffer.from(woff.buffer, woff.byteOffset, woff.byteLength);
  if (input.readUInt32BE(0) !== WOFF_SIGNATURE) throw new Error('Not a WOFF 1.0 font.');

  const flavor = input.readUInt32BE(4);
  const numTables = input.readUInt16BE(12);

  const tables = Array.from({ length: numTables }, (_, i) => {
    const entry = WOFF_HEADER_SIZE + i * WOFF_TABLE_ENTRY_SIZE;
    const offset = input.readUInt32BE(entry + 4);
    const compLength = input.readUInt32BE(entry + 8);
    const origLength = input.readUInt32BE(entry + 12);
    const raw = input.subarray(offset, offset + compLength);
    const data = compLength < origLength ? inflateSync(raw) : raw;
    if (data.length !== origLength) throw new Error('Corrupt WOFF table.');
    return { tag: input.readUInt32BE(entry), checksum: input.readUInt32BE(entry + 16), data };
  });

  // sfnt header: binary-search helpers per the OpenType spec.
  const entrySelector = Math.floor(Math.log2(numTables));
  const searchRange = 2 ** entrySelector * 16;
  const directorySize = SFNT_HEADER_SIZE + numTables * SFNT_TABLE_ENTRY_SIZE;
  const padded = (n: number) => (n + 3) & ~3;
  const totalSize = tables.reduce((size, t) => size + padded(t.data.length), directorySize);

  const out = Buffer.alloc(totalSize);
  out.writeUInt32BE(flavor, 0);
  out.writeUInt16BE(numTables, 4);
  out.writeUInt16BE(searchRange, 6);
  out.writeUInt16BE(entrySelector, 8);
  out.writeUInt16BE(numTables * 16 - searchRange, 10);

  let offset = directorySize;
  tables.forEach((table, i) => {
    const entry = SFNT_HEADER_SIZE + i * SFNT_TABLE_ENTRY_SIZE;
    out.writeUInt32BE(table.tag, entry);
    out.writeUInt32BE(table.checksum, entry + 4);
    out.writeUInt32BE(offset, entry + 8);
    out.writeUInt32BE(table.data.length, entry + 12);
    table.data.copy(out, offset);
    offset += padded(table.data.length);
  });
  return out;
}
