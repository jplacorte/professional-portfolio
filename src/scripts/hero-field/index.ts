import { prefersReducedMotion } from '../media';
import { createGrid, stepDot, stepRings, waveAt, type Dot, type Pointer, type Ring } from './physics';

/**
 * Canvas renderer for the hero dot field (components/motion/HeroField.astro).
 * Pauses when off-screen or in a background tab; draws a single static frame under reduced motion.
 */
class DotField {
  readonly #canvas: HTMLCanvasElement;
  readonly #ctx: CanvasRenderingContext2D;
  readonly #host: HTMLElement;
  readonly #reduced = prefersReducedMotion();
  readonly #pointer: Pointer = { x: 0, y: 0, active: false };
  readonly #startedAt = performance.now();
  #dots: Dot[] = [];
  #rings: Ring[] = [];
  #size = { width: 0, height: 0 };
  #colors = { ink: '#141413', accent: '#cc3a20' };
  #frame = 0;
  #running = false;
  #visible = true;

  constructor(canvas: HTMLCanvasElement, host: HTMLElement, ctx: CanvasRenderingContext2D) {
    this.#canvas = canvas;
    this.#host = host;
    this.#ctx = ctx;
  }

  mount(): void {
    this.#readColors();
    this.#resize();

    new IntersectionObserver(([entry]) => {
      this.#visible = entry?.isIntersecting ?? false;
      if (this.#visible) this.#start();
      else this.#stop();
    }).observe(this.#host);
    new ResizeObserver(() => {
      this.#resize();
      if (this.#reduced) this.#draw(performance.now());
    }).observe(this.#host);
    // Re-read colours when the theme changes.
    new MutationObserver(() => this.#readColors()).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    this.#host.addEventListener('pointermove', (e) => this.#onPointerMove(e));
    this.#host.addEventListener('pointerleave', () => (this.#pointer.active = false));
    this.#host.addEventListener('pointerdown', (e) => this.#onPointerDown(e));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.#stop();
      else if (this.#visible) this.#start();
    });

    if (this.#reduced) this.#draw(performance.now());
    else this.#start();
  }

  #readColors(): void {
    const styles = getComputedStyle(document.documentElement);
    this.#colors = {
      ink: styles.getPropertyValue('--ink').trim() || this.#colors.ink,
      accent: styles.getPropertyValue('--accent').trim() || this.#colors.accent,
    };
  }

  #resize(): void {
    const { width, height } = this.#host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.#size = { width, height };
    this.#canvas.width = Math.round(width * dpr);
    this.#canvas.height = Math.round(height * dpr);
    this.#ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.#dots = createGrid(width, height);
  }

  #localPoint(e: PointerEvent): { x: number; y: number; inside: boolean } {
    const rect = this.#canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    return { x: e.clientX - rect.left, y, inside: y >= 0 && y <= rect.height };
  }

  #onPointerMove(e: PointerEvent): void {
    const { x, y, inside } = this.#localPoint(e);
    Object.assign(this.#pointer, { x, y, active: inside });
  }

  #onPointerDown(e: PointerEvent): void {
    // Clicks on links and buttons inside the hero shouldn't also trigger a shockwave.
    if (e.target instanceof Element && e.target.closest('a, button, input, textarea')) return;
    const { x, y, inside } = this.#localPoint(e);
    if (inside) this.#rings.push({ x, y, radius: 0, life: 1 });
  }

  #start(): void {
    if (this.#running || this.#reduced) return;
    this.#running = true;
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
  }

  #stop(): void {
    this.#running = false;
    cancelAnimationFrame(this.#frame);
  }

  #tick(now: number): void {
    this.#draw(now);
    if (this.#running) this.#frame = requestAnimationFrame((next) => this.#tick(next));
  }

  #draw(now: number): void {
    const ctx = this.#ctx;
    const t = (now - this.#startedAt) / 1000;
    ctx.clearRect(0, 0, this.#size.width, this.#size.height);
    this.#rings = stepRings(this.#rings);

    for (const dot of this.#dots) {
      stepDot(dot, t, this.#pointer, this.#rings);
      const baseAlpha = 0.16 + (waveAt(dot, t) + 1) * 0.06;
      if (dot.heat > 0.04) {
        const size = 1.4 + dot.heat * 2.2;
        ctx.globalAlpha = Math.min(1, baseAlpha + dot.heat);
        ctx.fillStyle = this.#colors.accent;
        ctx.fillRect(dot.x - size / 2, dot.y - size / 2, size, size);
      } else {
        ctx.globalAlpha = baseAlpha;
        ctx.fillStyle = this.#colors.ink;
        ctx.fillRect(dot.x - 0.7, dot.y - 0.7, 1.4, 1.4);
      }
    }

    if (this.#pointer.active) {
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = this.#colors.accent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.#pointer.x, this.#pointer.y, 14, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

export function initHeroField(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-field]');
  const host = canvas?.parentElement;
  const ctx = canvas?.getContext('2d');
  if (!canvas || !host || !ctx) return;
  new DotField(canvas, host, ctx).mount();
}
