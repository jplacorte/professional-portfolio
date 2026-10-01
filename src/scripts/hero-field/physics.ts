/**
 * Pure simulation for the hero dot field: no DOM, no canvas, so it is unit-testable.
 * Each dot is pulled back to its home position, nudged by an ambient wave, pushed away from
 * the pointer and from expanding shockwave rings, and damped.
 */

export interface Dot {
  x: number;
  y: number;
  /** Home position. */
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  /** 0–1 highlight intensity; decays every frame. */
  heat: number;
}

export interface Ring {
  x: number;
  y: number;
  radius: number;
  /** 1 when spawned, removed at 0. */
  life: number;
}

export interface Pointer {
  x: number;
  y: number;
  active: boolean;
}

export const FIELD = {
  gap: 28,
  pointerRadius: 150,
  pointerForce: 7,
  ringForce: 5,
  ringBand: 30,
  ringSpeed: 9,
  ringDecay: 0.018,
  spring: 0.06,
  damping: 0.82,
  heatDecay: 0.94,
} as const;

/** Lays dots out on a grid that is centred in a `width` × `height` box. */
export function createGrid(width: number, height: number, gap: number = FIELD.gap): Dot[] {
  const cols = Math.ceil(width / gap) + 1;
  const rows = Math.ceil(height / gap) + 1;
  const offsetX = (width - (cols - 1) * gap) / 2;
  const offsetY = (height - (rows - 1) * gap) / 2;
  const dots: Dot[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = offsetX + col * gap;
      const y = offsetY + row * gap;
      dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0, heat: 0 });
    }
  }
  return dots;
}

/** Expands rings and returns only those still alive. */
export function stepRings(rings: readonly Ring[]): Ring[] {
  return rings
    .map((ring) => ({ ...ring, radius: ring.radius + FIELD.ringSpeed, life: ring.life - FIELD.ringDecay }))
    .filter((ring) => ring.life > 0);
}

/** Ambient wave value (−1…1) for a dot's home position at time `t` (seconds). */
export const waveAt = (dot: Pick<Dot, 'ox' | 'oy'>, t: number): number =>
  Math.sin(dot.ox * 0.012 + dot.oy * 0.018 - t * 1.4);

/** Advances one dot by one frame. Mutates `dot` for speed: this runs for ~1,500 dots at 60fps. */
export function stepDot(dot: Dot, t: number, pointer: Pointer, rings: readonly Ring[]): void {
  const wave = waveAt(dot, t);
  let fx = (dot.ox - dot.x) * FIELD.spring;
  let fy = (dot.oy + wave * 2.2 - dot.y) * FIELD.spring;

  if (pointer.active) {
    const dx = dot.x - pointer.x;
    const dy = dot.y - pointer.y;
    const dist = Math.hypot(dx, dy);
    if (dist < FIELD.pointerRadius && dist > 0.01) {
      const force = (1 - dist / FIELD.pointerRadius) ** 2;
      fx += (dx / dist) * force * FIELD.pointerForce;
      fy += (dy / dist) * force * FIELD.pointerForce;
      dot.heat = Math.max(dot.heat, force);
    }
  }

  for (const ring of rings) {
    const dx = dot.x - ring.x;
    const dy = dot.y - ring.y;
    const dist = Math.hypot(dx, dy);
    const band = Math.abs(dist - ring.radius);
    if (band < FIELD.ringBand && dist > 0.01) {
      const force = (1 - band / FIELD.ringBand) * ring.life;
      fx += (dx / dist) * force * FIELD.ringForce;
      fy += (dy / dist) * force * FIELD.ringForce;
      dot.heat = Math.max(dot.heat, force);
    }
  }

  dot.vx = (dot.vx + fx) * FIELD.damping;
  dot.vy = (dot.vy + fy) * FIELD.damping;
  dot.x += dot.vx;
  dot.y += dot.vy;
  dot.heat *= FIELD.heatDecay;
}
