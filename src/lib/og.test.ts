import { describe, expect, it } from 'vitest';
import { fitTags, truncate } from './og';

describe('truncate', () => {
  it('leaves short text alone', () => {
    expect(truncate('Short and sweet.', 50)).toBe('Short and sweet.');
  });

  it('cuts at a word boundary and drops trailing punctuation', () => {
    expect(truncate('Swipe on items you want, match when interest is mutual', 26)).toBe('Swipe on items you want…');
  });
});

describe('fitTags', () => {
  it('keeps tags in order until the width budget runs out', () => {
    expect(fitTags(['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'Socket.io'])).toEqual([
      'React',
      'Redux',
      'Node.js',
      'Express',
    ]);
  });

  it('returns nothing rather than overflowing when the first tag is too long', () => {
    expect(fitTags(['An extremely long technology name that will never fit'])).toEqual([]);
  });
});
