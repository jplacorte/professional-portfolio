/**
 * `<local-time data-tz="Asia/Manila" data-label="PHT">` — a live clock, refreshed every 30s.
 * Server-rendered as "—" so the page never shows a wrong, build-time value.
 */
class LocalTimeElement extends HTMLElement {
  #timer: ReturnType<typeof setInterval> | undefined;

  connectedCallback(): void {
    const format = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: this.dataset.tz ?? 'UTC',
    });
    const tick = () => {
      this.textContent = `${format.format(new Date())} ${this.dataset.label ?? ''}`.trim();
    };
    tick();
    this.#timer = setInterval(tick, 30_000);
  }

  disconnectedCallback(): void {
    clearInterval(this.#timer);
  }
}

export function defineLocalTime(): void {
  if (!customElements.get('local-time')) customElements.define('local-time', LocalTimeElement);
}
