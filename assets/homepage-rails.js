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

// A partially visible last card can be reached without ever sitting at x=0.
// Treat physical end-of-scroll as the final slide so navigation cannot get stuck.
export function visibleIndex(distances, currentScroll, maxScroll) {
  if (distances.length && maxScroll > 4 && currentScroll >= maxScroll - 4)
    return distances.length - 1;
  return nearestIndex(distances);
}

// Arrow navigation needs a fallback when a target card cannot align at the edge.
export function resolveRailTarget(current, max, candidate, direction, step) {
  let target = Math.max(0, Math.min(max, candidate));
  if (direction < 0 && target >= current - 3) target = Math.max(0, current - step);
  if (direction > 0 && target <= current + 3) target = Math.min(max, current + step);
  return target;
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
    const distances = cards.map(card => card.getBoundingClientRect().left - left);
    return visibleIndex(distances, viewport.scrollLeft, viewport.scrollWidth - viewport.clientWidth);
  }

  function refresh() {
    const index = currentIndex();
    const canScroll = viewport.scrollWidth > viewport.clientWidth + 5;
    counter.textContent = counterText(index, cards.length);
    prev.disabled = !canScroll || index === 0;
    next.disabled = !canScroll || index === cards.length - 1;
  }

  function move(direction) {
    const index = currentIndex();
    const nextIndex = Math.max(0, Math.min(cards.length - 1, index + direction));
    const target = cards[nextIndex];
    if (!target || nextIndex === index) return;
    const offset = target.getBoundingClientRect().left - viewport.getBoundingClientRect().left;
    const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const cardStep = cards.length > 1 ?
      cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left :
      viewport.clientWidth * .8;
    const scrollLeft = resolveRailTarget(viewport.scrollLeft, max,
      viewport.scrollLeft + offset, direction, cardStep);
    const reduced = typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    viewport.scrollTo({left: scrollLeft, behavior: reduced ? 'instant' : 'smooth'});
  }

  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));

  // Only intercept arrows while the scroll region itself is focused.
  // Nested links and buttons preserve their native keyboard behavior.
  viewport.addEventListener('keydown', event => {
    if (event.target !== viewport) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
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
