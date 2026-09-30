import { describe, expect, it } from 'vitest';
import { isPublished, pickFeatured, sortProjects } from './projects';

const project = (
  id: string,
  data: Partial<{ order: number; year: string; featured: boolean; caseStudy: boolean }>,
) => ({
  id,
  data: { order: 100, year: '2020', featured: false, caseStudy: true, ...data },
});

describe('isPublished', () => {
  it('hides drafts in production but shows them in dev', () => {
    expect(isPublished({ draft: true }, false)).toBe(false);
    expect(isPublished({ draft: true }, true)).toBe(true);
    expect(isPublished({ draft: false }, false)).toBe(true);
  });
});

describe('sortProjects', () => {
  it('sorts by order, then by most recent year', () => {
    const sorted = sortProjects([
      project('old', { order: 2, year: '2019' }),
      project('new', { order: 2, year: '2025' }),
      project('first', { order: 1, year: '2010' }),
    ]);
    expect(sorted.map((p) => p.id)).toEqual(['first', 'new', 'old']);
  });

  it('does not mutate its input', () => {
    const input = [project('b', { order: 2 }), project('a', { order: 1 })];
    sortProjects(input);
    expect(input.map((p) => p.id)).toEqual(['b', 'a']);
  });
});

describe('pickFeatured', () => {
  it('returns featured case studies only', () => {
    const picked = pickFeatured([
      project('a', { featured: true }),
      project('b', {}),
      project('c', { featured: true, caseStudy: false }),
    ]);
    expect(picked.map((p) => p.id)).toEqual(['a']);
  });

  it('falls back to the first case studies when none are featured', () => {
    const picked = pickFeatured([project('a', {}), project('b', {}), project('c', {})], 2);
    expect(picked.map((p) => p.id)).toEqual(['a', 'b']);
  });
});
