import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(path, 'utf8');
const vercelConfig = JSON.parse(read('vercel.json'));
const homepage = read('index.html');
const servicePages = [
  'web-design/index.html',
  'local-seo/index.html',
  'lead-follow-up-automation/index.html',
  'digital-business-systems/index.html',
  'technology-opportunity-audit/index.html',
  'fractional-technology-partner/index.html',
];
const brandedPages = ['index.html', 'opportunity-review/index.html', ...servicePages];
const markReference = /src="\/brand\/hutchgroup-mark\.svg"/;

function sha256(path) {
  return createHash('sha256').update(readFileSync(path, 'utf8').replace(/\r\n/g, '\n')).digest('hex');
}

test('canonical HutchGroup brand assets are present and referenced site-wide', () => {
  for (const asset of [
    'brand/hutchgroup-mark.svg',
    'brand/hutchgroup-logo-horizontal-dark.svg',
    'brand/hutchgroup-logo-horizontal-light.svg',
  ]) assert.ok(read(asset).includes('<svg'), `${asset} must be an SVG`);

  for (const page of brandedPages) {
    const html = read(page);
    assert.match(html, markReference, `${page} must reference the canonical mark`);
    assert.match(html, /class="brand-name">Hutchgroup<\/span>/, `${page} must use the styled wordmark`);
    assert.match(html, /<header[\s\S]*?<\/header>/, `${page} must retain a header`);
    assert.match(html, /<footer[\s\S]*?<\/footer>/, `${page} must retain a footer`);
  }
  assert.match(read('404.html'), markReference, '404 must use the canonical mark');
});

test('stale restaurant offer redirects to the current Opportunity Review intake', () => {
  const redirect = vercelConfig.redirects.find((item) => item.destination === '/opportunity-review/' && item.source.startsWith('/blog/ai-agent-for-restaurants/'));
  assert.deepEqual(redirect, {
    source: '/blog/ai-agent-for-restaurants/:rest*',
    destination: '/opportunity-review/',
    permanent: true,
  });
});

test('homepage preserves approved marketing scope and conversion language', () => {
  for (const phrase of [
    'Twin Cities small-business modernization',
    'find expensive operational friction',
    'combining business analysis with hands-on building',
    'Find the friction. Fix the constraint. Make the business easier to find, choose, and run.',
    'better websites',
    'local SEO',
    'lead follow-up',
    'connected systems',
    'internal tools',
    'practical AI',
    'fractional technology leadership',
    'Prep is our product proof',
  ]) assert.match(homepage, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `missing approved phrase: ${phrase}`);
  assert.match(homepage, /<meta property="og:description" content="[^"]+"/);
  assert.match(homepage, /<meta name="twitter:description" content="[^"]+"/);
  assert.ok((homepage.match(/href="\/opportunity-review\//g) ?? []).length >= 4, 'homepage needs at least four intake links');
});

test('every customer-facing service page has a real Opportunity Review entry point', () => {
  for (const page of servicePages) {
    const html = read(page);
    assert.match(html, /href="\/opportunity-review\/"/, `${page} needs an intake CTA`);
  }
});

test('opportunity review API remains unchanged and the form uses the current contact address', () => {
  assert.equal(sha256('opportunity-review/index.html'), '43dc2c45163bc7d181795df2c3de3e66b7f11742a56b23db12070aeb47df264a');
  assert.match(read('opportunity-review/index.html'), /shannon@hutchgroupllc\.com/);
  assert.equal(sha256('api/opportunity-review.js'), 'd8364131ca3db64699073ef5025090dc1be6de6ba7a3a76df55b205d62349915');
});
