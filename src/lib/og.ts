/**
 * Renders 1200×630 Open Graph images at build time (satori → SVG → resvg → PNG).
 * Used by pages/og/[...slug].png.ts; nothing here ships to the browser.
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { woffToSfnt } from './woff';
import { SITE } from '@/config/site';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Mirrors the light theme in styles/tokens.css.
const COLORS = {
  paper: '#f7f6f2',
  ink: '#141413',
  inkSoft: '#3d3d3a',
  muted: '#6e6d68',
  line: '#e3e1da',
  accent: '#cc3a20',
  grid: 'rgba(20, 20, 19, 0.06)',
};

export interface OgImageContent {
  /** Small uppercase label above the title, e.g. "Case study · 2025". */
  eyebrow: string;
  title: string;
  description?: string;
  /** Short tags along the bottom (e.g. the tech stack); as many as fit are shown. */
  tags?: readonly string[];
}

type Font = { name: string; data: Buffer; weight: 400 | 500 | 600 | 700; style: 'normal' };

const require = createRequire(import.meta.url);
let fontsPromise: Promise<Font[]> | undefined;

/** Fontsource ships WOFF; it is unpacked to TrueType (see woff.ts) and loaded once per build. */
function loadFonts(): Promise<Font[]> {
  const load = async (name: string, pkg: string, weight: Font['weight']): Promise<Font> => ({
    name,
    weight,
    style: 'normal',
    data: woffToSfnt(await readFile(require.resolve(pkg))),
  });
  fontsPromise ??= Promise.all([
    load('Inter', '@fontsource/inter/files/inter-latin-400-normal.woff', 400),
    load('Inter', '@fontsource/inter/files/inter-latin-700-normal.woff', 700),
    load('JetBrains Mono', '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff', 500),
  ]);
  return fontsPromise;
}

/** The plain-object element tree satori accepts (the same shape JSX compiles to), so no React is needed. */
interface SatoriElement {
  type: string;
  props: { style: Record<string, unknown>; children?: unknown };
}

/** Minimal element helper so the template reads like markup without needing JSX. */
const el = (type: string, style: Record<string, unknown>, children?: unknown): SatoriElement => ({
  type,
  props: { style: { display: 'flex', ...style }, children },
});

/** Long titles step down in size so they never overflow two lines. */
const titleSize = (title: string) => (title.length > 40 ? 60 : title.length > 24 ? 72 : 88);

/** Keeps descriptions to about two lines at 28px; satori has no reliable line clamping. */
const MAX_DESCRIPTION = 120;
export const truncate = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, text.lastIndexOf(' ', max)).replace(/[\s,.;:—–-]+$/, '')}…`;

/** Tags are kept while they fit this many monospace characters, so the row never reaches the role label. */
const TAG_CHAR_BUDGET = 38;
export const fitTags = (tags: readonly string[]) => {
  const kept: string[] = [];
  let used = 0;
  for (const tag of tags) {
    used += tag.length + 3; // padding and gap cost roughly three characters
    if (used > TAG_CHAR_BUDGET) break;
    kept.push(tag);
  }
  return kept;
};

function template({ eyebrow, title, description, tags = [] }: OgImageContent) {
  return el(
    'div',
    {
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px',
      backgroundColor: COLORS.paper,
      backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
      backgroundSize: '48px 48px',
      fontFamily: 'Inter',
      color: COLORS.ink,
    },
    [
      // Header: monogram + name
      el('div', { alignItems: 'center', gap: 18 }, [
        el(
          'div',
          {
            width: 56,
            height: 56,
            borderRadius: 12,
            backgroundColor: COLORS.ink,
            color: COLORS.paper,
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'JetBrains Mono',
            fontSize: 22,
          },
          'JL',
        ),
        el('div', { fontSize: 28 }, SITE.name),
      ]),
      // Body: eyebrow, title, description
      el('div', { flexDirection: 'column', gap: 22 }, [
        el(
          'div',
          {
            fontFamily: 'JetBrains Mono',
            fontSize: 22,
            color: COLORS.accent,
            letterSpacing: 2,
            textTransform: 'uppercase',
          },
          eyebrow,
        ),
        el(
          'div',
          { fontSize: titleSize(title), fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.02, maxWidth: 1000 },
          title,
        ),
        description
          ? el(
              'div',
              { fontSize: 28, lineHeight: 1.4, color: COLORS.inkSoft, maxWidth: 960 },
              truncate(description, MAX_DESCRIPTION),
            )
          : null,
      ]),
      // Footer: tags + role
      el(
        'div',
        {
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `2px solid ${COLORS.line}`,
          paddingTop: 26,
        },
        [
          el(
            'div',
            { gap: 10 },
            fitTags(tags).map((tag) =>
              el(
                'div',
                {
                  fontFamily: 'JetBrains Mono',
                  fontSize: 20,
                  color: COLORS.inkSoft,
                  border: `2px solid ${COLORS.line}`,
                  borderRadius: 8,
                  padding: '6px 12px',
                },
                tag,
              ),
            ),
          ),
          el(
            'div',
            { fontFamily: 'JetBrains Mono', fontSize: 20, color: COLORS.muted, flexShrink: 0, whiteSpace: 'nowrap' },
            SITE.role,
          ),
        ],
      ),
    ],
  );
}

export async function renderOgImage(content: OgImageContent): Promise<Buffer> {
  const svg = await satori(template(content), {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: await loadFonts(),
  });
  return new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
}
