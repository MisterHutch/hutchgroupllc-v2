const themes = [
  ['classic', 'Classic'],
  ['industrial', 'Industrial'],
  ['cyberpunk', 'Cyberpunk'],
  ['outdoors', 'Touching Grass'],
  ['chrome-copper', 'Chrome & Copper'],
];
const storageKey = 'hutchgroup-theme';
const names = new Map(themes);

function savedTheme() {
  try {
    const value = localStorage.getItem(storageKey);
    return names.has(value) ? value : 'classic';
  } catch {
    return 'classic';
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = names.has(theme) ? theme : 'classic';
  document.querySelectorAll('[data-theme-option]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.themeOption === document.documentElement.dataset.theme));
  });
}

applyTheme(savedTheme());

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('header nav, header .nav, body > nav');
  if (!nav) return;

  const switcher = document.createElement('details');
  switcher.className = 'theme-switcher';
  switcher.innerHTML = `<summary aria-label="Website theme">Theme <span aria-hidden="true">▾</span></summary>
    <div class="theme-options" aria-label="Choose website theme">
      ${themes.map(([value, label]) => `<button type="button" data-theme-option="${value}" aria-pressed="false"><span class="theme-swatch theme-swatch-${value}" aria-hidden="true"></span>${label}</button>`).join('')}
    </div>`;
  const mobileMenu = nav.querySelector('.menu');
  const navLinks = nav.querySelector('.links, .navlinks, ul');
  nav.insertBefore(switcher, mobileMenu || navLinks || nav.lastElementChild);

  switcher.querySelectorAll('[data-theme-option]').forEach((button) => {
    button.addEventListener('click', () => {
      const theme = button.dataset.themeOption;
      applyTheme(theme);
      try { localStorage.setItem(storageKey, theme); } catch { /* The selection still works for this page. */ }
      switcher.open = false;
      switcher.querySelector('summary').focus();
    });
  });
  applyTheme(document.documentElement.dataset.theme);

  document.addEventListener('pointerdown', (event) => {
    if (!switcher.contains(event.target)) switcher.open = false;
  });
  switcher.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      switcher.open = false;
      switcher.querySelector('summary').focus();
    }
  });
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey || event.key === null) applyTheme(savedTheme());
  });
});
