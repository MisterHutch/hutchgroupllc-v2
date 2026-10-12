import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync('assets/analytics.js', 'utf8');
function load(hostname) {
  const scripts = [], listeners = {};
  const window = {};
  const location = new URL(`https://${hostname}/opportunity-review/?email=private@example.test&utm_source=google#private`);
  const document = {
    referrer: 'https://example.test/?email=private@example.test',
    head: { appendChild: script => scripts.push(script) },
    createElement: () => ({}),
    addEventListener: (name, callback) => { listeners[name] = callback; },
    querySelector: () => ({ addEventListener() {} }),
  };
  runInNewContext(source, { window, document, location, URL, URLSearchParams });
  return { window, scripts, listeners };
}

test('production loads both analytics providers and strips private URL values', () => {
  for (const host of ['hutchgroupllc.com', 'www.hutchgroupllc.com']) {
    const { window, scripts } = load(host);
    assert.equal(scripts.length, 2);
    assert.ok(scripts.some(s => s.src === '/_vercel/insights/script.js'));
    assert.ok(scripts.some(s => s.src === 'https://www.googletagmanager.com/gtag/js?id=G-F3N1ZTF9JS' && s.async));
    const config = [...window.dataLayer[1]];
    assert.equal(config[0], 'config');
    assert.equal(config[1], 'G-F3N1ZTF9JS');
    assert.equal(config[2].page_location, `https://${host}/opportunity-review/?utm_source=google`);
    assert.equal(config[2].page_referrer, 'https://example.test/');
    window.hutchTrack('review_submitted');
    assert.equal(window.dataLayer.at(-1)[1], 'review_submitted');
    assert.equal(window.vaq.at(-1)[1].name, 'review_submitted');
    assert.equal(JSON.stringify(window.dataLayer).includes('private@'), false);
    const count = window.dataLayer.length;
    window.hutchTrack('unapproved_event');
    assert.equal(window.dataLayer.length, count);
  }
});

test('preview and localhost never load either tracker', () => {
  for (const host of ['localhost', '127.0.0.1', 'hutchgroupllc-preview.vercel.app']) {
    const { window, scripts } = load(host);
    assert.equal(scripts.length, 0);
    assert.equal(window.gtag, undefined);
    assert.equal(window.va, undefined);
  }
});

test('Ops clicks go to both providers without copying the destination query', () => {
  const { window, listeners } = load('hutchgroupllc.com');
  listeners.click({ target: { closest: () => ({ href: 'https://ops.hutchgroupllc.com/?private=sample' }) } });
  assert.equal(window.dataLayer.at(-1)[1], 'product_clicked');
  assert.equal(window.dataLayer.at(-1)[2].product, 'ops');
  assert.equal(window.vaq.at(-1)[1].data.product, 'ops');
  assert.equal(JSON.stringify(window.dataLayer).includes('private=sample'), false);
});

test('all public pages include analytics once and CSP permits Google tag', () => {
  for (const route of ['', '404.html', 'opportunity-review/', 'lead-follow-up-automation/', 'web-design/', 'local-seo/', 'digital-business-systems/', 'technology-opportunity-audit/', 'fractional-technology-partner/', 'resources/', 'work/', 'industries/roofing/', 'industries/hvac/']) {
    const page = readFileSync(route.endsWith('.html') ? route : route + 'index.html', 'utf8');
    assert.equal((page.match(/src="\/assets\/analytics.js"/g) || []).length, 1, route);
  }
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const csp = config.headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
  assert.ok(csp.split(';').find(d => d.trim().startsWith('script-src ')).includes('https://www.googletagmanager.com'));
});
