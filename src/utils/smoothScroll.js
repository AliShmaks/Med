export const easeInOutQuart = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

export let scrollRaf = 0;

export function smoothScrollTo(id) {
  const el = id === 'top' ? null : document.getElementById(id);
  if (id !== 'top' && !el) return;

  const headerH = window.innerWidth <= 650 ? 64 : 76;
  const extra = el ? Number(el.dataset.scrollOffset || 0) : 0;

  const getTarget = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = el
      ? el.getBoundingClientRect().top + window.scrollY - headerH + extra
      : 0;
    return Math.min(Math.max(0, t), max);
  };

  const start = window.scrollY;
  const dist = getTarget() - start;
  cancelAnimationFrame(scrollRaf);
  if (Math.abs(dist) < 2) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, getTarget());
    return;
  }

  const duration = Math.min(2600, Math.max(1200, Math.abs(dist) * 0.95));
  const t0 = performance.now();
  const stop = () => cancelAnimationFrame(scrollRaf);
  window.addEventListener('wheel', stop, { once: true, passive: true });
  window.addEventListener('touchstart', stop, { once: true, passive: true });

  const step = (now) => {
    const p = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, start + (getTarget() - start) * easeInOutQuart(p));
    if (p < 1) scrollRaf = requestAnimationFrame(step);
  };

  scrollRaf = requestAnimationFrame(step);
}

export function cancelScroll() {
  cancelAnimationFrame(scrollRaf);
}