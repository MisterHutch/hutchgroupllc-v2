const modules = [...document.querySelectorAll('[data-module]')];
const selected = new Set();
const choices = Object.fromEntries(modules.map(button => [button.dataset.module, button]));
const money = new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0});
const total = document.querySelector('#stack-total');
const summary = document.querySelector('#selected-services');
const review = document.querySelector('#stack-review');

function updatePlan() {
  for (const button of modules) {
    const picked = selected.has(button.dataset.module);
    button.setAttribute('aria-pressed', String(picked));
    button.textContent = picked ? '✓ Added to plan' : '+ Add to my plan';
  }
  const names = [...selected].map(id => choices[id].dataset.label);
  const sum = [...selected].reduce((n,id) => n + (Number(choices[id].dataset.price) || 0), 0);
  total.textContent = money.format(sum) + (selected.has('ops-intelligence') ? ' + scoped work' : '');
  summary.replaceChildren();
  if (!names.length) {
    summary.textContent = 'No modules selected yet. Try selecting the two featured solutions.';
  } else {
    const list = document.createElement('ul');
    for (const name of names) {
      const item = document.createElement('li');
      item.className = 'selected-item';
      item.textContent = name;
      list.append(item);
    }
    summary.append(list);
  }
  const url = new URL('/opportunity-review/', location.origin);
  if (selected.size) url.searchParams.set('modules', [...selected].join(','));
  url.searchParams.set('pain', [...selected].some(id => ['ai-demand-capture','business-agent','local-search'].includes(id)) ? 'missed-leads' : 'disconnected-systems');
  url.searchParams.set('utm_source','website');
  url.searchParams.set('utm_medium','organic');
  url.searchParams.set('utm_campaign','demand-capture-launch');
  url.searchParams.set('utm_content','menu-builder');
  review.href = url.pathname + url.search;
}

for (const button of document.querySelectorAll('[data-filter]')) {
  button.addEventListener('click', () => {
    for (const other of document.querySelectorAll('[data-filter]')) other.setAttribute('aria-pressed', String(other === button));
    for (const tile of document.querySelectorAll('.tile')) tile.hidden = button.dataset.filter !== 'all' && tile.dataset.category !== button.dataset.filter;
  });
}
for (const button of modules) button.addEventListener('click', () => {
  if (selected.has(button.dataset.module)) selected.delete(button.dataset.module);
  else selected.add(button.dataset.module);
  updatePlan();
});
document.querySelector('#clear-plan').addEventListener('click', () => {selected.clear(); updatePlan();});
updatePlan();
