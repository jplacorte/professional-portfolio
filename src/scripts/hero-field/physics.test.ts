import { describe, expect, it } from 'vitest';
import { createGrid, FIELD, stepDot, stepRings, type Dot } from './physics';

const idle = { x: 0, y: 0, active: false };
const at = (x: number, y: number): Dot => ({ x, y, ox: x, oy: y, vx: 0, vy: 0, heat: 0 });

describe('createGrid', () => {
  it('covers the box with evenly spaced dots, centred', () => {
    const dots = createGrid(100, 50, 25);
    expect(dots).toHaveLength(5 * 3);
    expect(dots[0]).toMatchObject({ x: 0, y: 0 });
    expect(dots.at(-1)).toMatchObject({ x: 100, y: 50 });
  });
});

describe('stepDot', () => {
  it('pushes dots away from an active pointer and lights them up', () => {
    const dot = at(100, 100);
    stepDot(dot, 0, { x: 90, y: 100, active: true }, []);
    expect(dot.x).toBeGreaterThan(100);
    expect(dot.heat).toBeGreaterThan(0);
  });

  it('ignores the pointer outside its radius', () => {
    const dot = at(100, 100);
    stepDot(dot, 0, { x: 100 + FIELD.pointerRadius + 1, y: 100, active: true }, []);
    expect(dot.heat).toBe(0);
  });

  it('settles back home once disturbances stop', () => {
    const dot = { ...at(100, 100), x: 140 };
    for (let i = 0; i < 300; i++) stepDot(dot, 0, idle, []);
    expect(dot.x).toBeCloseTo(100, 1);
  });
});

describe('stepRings', () => {
  it('expands rings and drops them when they fade out', () => {
    const [ring] = stepRings([{ x: 0, y: 0, radius: 0, life: 1 }]);
    expect(ring?.radius).toBe(FIELD.ringSpeed);
    expect(stepRings([{ x: 0, y: 0, radius: 0, life: FIELD.ringDecay / 2 }])).toEqual([]);
  });
});
