/** A heading counts as "current" once it has scrolled above this fraction of the viewport. */
const ACTIVE_LINE = 0.35;

/** Marks the table-of-contents link for the section in view with `aria-current`. */
export function initTocSpy(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-toc] a')];
  if (!links.length) return;

  const sections = links
    .map((link) => ({ link, heading: document.getElementById(decodeURIComponent(link.hash.slice(1))) }))
    .filter((s): s is { link: HTMLAnchorElement; heading: HTMLElement } => s.heading !== null);

  let queued = false;
  const update = () => {
    queued = false;
    let current = sections[0]?.link;
    for (const { heading, link } of sections) {
      if (heading.getBoundingClientRect().top < window.innerHeight * ACTIVE_LINE) current = link;
    }
    for (const link of links) {
      if (link === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
}
