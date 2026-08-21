import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync('opportunity-review/index.html', 'utf8');
const api = readFileSync('api/opportunity-review.js', 'utf8');

test('Opportunity Review renders and submits the web form', () => {
  assert.match(page, /<form id="reviewForm">/);
  assert.match(page, /fetch\('\/api\/opportunity-review',\{method:'POST'/);
  assert.doesNotMatch(page, /window\.location\.href\s*=\s*`mailto:/);
});

test('repeat submissions create distinct opportunity reviews', () => {
  assert.match(
    api,
    /supabaseRequest\(supabaseUrl, serviceRoleKey, 'opportunity_reviews', \{\s*method: 'POST'/,
  );
  assert.doesNotMatch(api, /opportunity_reviews[^\n]*(?:on_conflict|upsert)/i);
});

test('Opportunity Review motion and reduced-motion support remain intact', () => {
  assert.match(page, /IntersectionObserver/);
  assert.match(page, /\.reveal\.visible/);
  assert.match(page, /@keyframes heroRise/);
  assert.match(page, /@media\(prefers-reduced-motion:reduce\)/);
});
