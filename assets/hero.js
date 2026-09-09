(() => {
  const hero = document.querySelector('.hero');
  if (!hero || !('IntersectionObserver' in window)) return;
  const layers = hero.querySelectorAll('[data-depth]');
  const motion = matchMedia('(prefers-reduced-motion: no-preference) and (min-width: 901px)');
  let visible = false;
  let frame = 0;
  const update = () => {
    frame = 0;
    const offset = motion.matches && visible ? Math.max(0, -hero.getBoundingClientRect().top) : 0;
    layers.forEach((layer) => {
      layer.style.setProperty('--drift', `${Math.min(36, offset * Number(layer.dataset.depth))}px`);
    });
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }).observe(hero);
  window.addEventListener(
    'scroll',
    () => {
      if (visible && motion.matches) schedule();
    },
    { passive: true },
  );
  motion.addEventListener('change', schedule);
})();
