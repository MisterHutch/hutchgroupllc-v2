// Native, progressive homepage rails. No autoplay, mousewheel hijacking,
// or external dependencies. Swipe and trackpad work without JavaScript.
export function nearestIndex(distances) {
  if (!Array.isArray(distances) || !distances.length) return 0;
  let result = 0;
  for (let index = 1; index < distances.length; index += 1) {
    if (Math.abs(distances[index]) < Math.abs(distances[result])) result = index;
  }
  return result;
}

export function counterText(index, total) {
  const width = Math.max(2, String(total).length);
  return String(index + 1).padStart(width, '0') + ' / ' +
    String(total).padStart(width, '0');
}

function activateRail(viewport) {
  const name = viewport.dataset.railViewport;
  const controls = document.querySelector('[data-rail-controls="' + name + '"]');
  if (!controls) return;
  const prev = controls.querySelector('[data-rail-prev]');
  const next = controls.querySelector('[data-rail-next]');
  const counter = controls.querySelector('[data-rail-count]');
  const cards = [...viewport.children].filter(node => node.nodeType === 1);
  if (!cards.length || !prev || !next || !counter) return;

  function currentIndex() {
    const left = viewport.getBoundingClientRect().left;
    return nearestIndex(cards.map(card => card.getBoundingClientRect().left - left));
  }

  function refresh() {
    const index = currentIndex();
    const canScroll = viewport.scrollWidth > viewport.clientWidth + 5;
    counter.textContent = counterText(index, cards.length);
    prev.disabled = !canScroll || index === 0;
    next.disabled = !canScroll || index === cards.length - 1;
  }

  function goTo(index) {
    const target = cards[Math.min(Math.max(0, index), cards.length - 1)];
    if (!target) return;
    const delta = target.getBoundingClientRect().left - viewport.getBoundingClientRect().left;
    const reduced = typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    viewport.scrollTo({left: viewport.scrollLeft + delta, behavior: reduced ? 'instant' : 'smooth'});
  }

  prev.addEventListener('click', () => goTo(currentIndex() - 1));
  next.addEventListener('click', () => goTo(currentIndex() + 1));

  // Only intercept arrows while the scroll region itself is focused.
  // Nested links and buttons preserve their native keyboard behavior.
  viewport.addEventListener('keydown', event => {
    if (event.target !== viewport) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(currentIndex() + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  let pending = false;
  viewport.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; refresh(); });
  }, {passive:true});
  window.addEventListener('resize', refresh, {passive:true});
  refresh();
}

if (typeof document !== 'undefined') {
  const rails = [...document.querySelectorAll('[data-rail-viewport]')];
  if (rails.length) {
    document.documentElement.classList.add('hg-rails-ready');
    rails.forEach(activateRail);
  }
}
