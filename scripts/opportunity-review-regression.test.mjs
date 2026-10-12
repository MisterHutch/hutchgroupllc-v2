import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const page=readFileSync('opportunity-review/index.html','utf8');
const css=readFileSync('assets/review.css','utf8');
const client=readFileSync('assets/review.js','utf8');
test('review requires only name business and email; other context is optional',()=>{
  const fields=[...page.matchAll(/<(?:input|textarea)[^>]+required[^>]*>/g)].map(m=>m[0].match(/name="([^"]+)"/)[1]);
  assert.deepEqual(fields,['name','business','email']);
  assert.ok(page.includes('type="email"'));
  assert.ok(page.includes('Any paid audit or implementation is scoped and priced separately'));
});
test('review has accessible status and no-JavaScript contact alternative',()=>{
  assert.ok(page.includes('role="status" aria-live="polite" tabindex="-1"'));
  assert.ok(page.includes('<noscript>'));
  assert.ok(page.includes('mailto:hutch@hutchgroupllc.com'));
  assert.ok(css.includes('.form-card{order:-1;width:100%}'));
  assert.ok(css.includes('prefers-reduced-motion:reduce'));
});
test('submission reports saved separately from notification failure and supports retries',()=>{
  assert.ok(client.includes("fetch('/api/opportunity-review'"));
  assert.ok(client.includes('result.notifications?.customer'));
  assert.ok(client.includes('You do not need to submit again'));
  assert.ok(client.includes('button.disabled = false'));
  assert.ok(client.includes('form.reportValidity()'));
});
