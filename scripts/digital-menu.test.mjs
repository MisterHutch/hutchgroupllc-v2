import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('digital menu stays indexed, branded and linked to real review + Ops scenarios', () => {
  const html=readFileSync('digital-menu/index.html','utf8');
  const home=readFileSync('index.html','utf8');
  const sitemap=readFileSync('sitemap.xml','utf8');
  assert.ok(html.includes('https://hutchgroupllc.com/digital-menu/'));
  assert.ok(html.includes('<script type="application/ld+json">'));
  assert.ok(html.includes('src="/brand/hutchgroup-mark.svg"'));
  assert.ok(html.includes('src="/assets/digital-menu.js"'));
  for (const id of ['ai-demand-capture','business-agent','local-search','crm','automation','ops-intelligence']) {
    assert.ok(html.includes('data-module="'+id+'"'),id);
  }
  assert.ok(html.includes('id="stack-review"'));
  assert.ok(html.includes('demo=leasing') && html.includes('demo=hvac'));
  assert.ok(home.includes('/digital-menu/'));
  assert.ok(sitemap.includes('/digital-menu/'));
});

test('digital menu uses only allowlisted module IDs, not arbitrary HTML', () => {
  const review=readFileSync('assets/review.js','utf8');
  const menu=readFileSync('assets/digital-menu.js','utf8');
  assert.ok(review.includes('Object.hasOwn(allowedModules,id)'));
  assert.ok(menu.includes('document.createElement'));
  assert.ok(menu.includes('aria-pressed'));
});
