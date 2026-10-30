import { visitAttribution } from './journey.js';

let previous = {};
try { previous = JSON.parse(sessionStorage.getItem('hutchgroup-attribution') || '{}'); } catch { /* Storage is optional. */ }
const attribution = visitAttribution(location.search, location.pathname, previous);
try { sessionStorage.setItem('hutchgroup-attribution', JSON.stringify(attribution)); } catch { /* Links also carry tags. */ }

for (const link of document.querySelectorAll('a[href]')) {
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !['/', '/lead-follow-up-automation/', '/opportunity-review/'].includes(url.pathname)) continue;
  for (const [key, value] of Object.entries(attribution)) {
    if (key !== 'entry_path' && key !== 'pain' && !url.searchParams.has(key)) url.searchParams.set(key, value);
  }
  link.href = url.pathname + url.search + url.hash;
}

const menu = document.querySelector('.menu');
const links = document.querySelector('.links');
if (menu && links) {
  const closeMenu = () => {
    links.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open menu');
    menu.textContent = '☰';
  };
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.textContent = open ? '×' : '☰';
  });
  links.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && links.classList.contains('open')) { closeMenu(); menu.focus(); }
  });
  menu.closest('header').classList.add('nav-ready');
}
