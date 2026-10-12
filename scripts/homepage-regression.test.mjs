import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const page = readFileSync('index.html','utf8');
test('one visible H1 and three consolidated service offers', () => {
  assert.equal((page.match(/<h1[ >]/g)||[]).length,1);
  assert.equal((page.match(/class="offer"/g)||[]).length,3);
  assert.ok(!page.includes('id="problems"'));
  assert.ok(!page.includes('id="workflow-example"'));
  assert.ok(!page.includes('class="problem-strip"'));
  assert.ok(!page.includes('class="problem-map"'));
});
test('roster is contained inside an optional disclosure', () => {
  const disclosure = page.match(/<details>[\s\S]*?<\/details>/)?.[0];
  assert.ok(disclosure?.includes('Hermes team / Grok team'));
  assert.equal((disclosure.match(/class="agent-row"/g)||[]).length,8);
  assert.ok(!page.includes('setInterval'));
});
test('Ops replaces Prep with an accurate public demo capture', () => {
  const hero = page.match(/<section class="hero">[\s\S]*?<\/section>/)[0];
  assert.ok(!page.includes('prep.hutchgroupllc.com'));
  assert.ok(hero.includes('Get found.'));
  const proof = page.match(/<section class="proof-product"[\s\S]*?<\/section>/)[0];
  assert.ok(proof.includes('https://ops.hutchgroupllc.com/'));
  assert.ok(proof.includes('/assets/ops-command-center.png'));
  assert.ok(proof.includes('Changes reset on refresh'));
});
test('business proof is clearly a demonstration and CTA is consistent', () => {
  assert.ok(page.includes('Interactive discovery demo · sample data'));
  assert.ok(page.includes('not a measured customer outcome'));
  const links = [...page.matchAll(/<a[^>]+href="\/opportunity-review\/"[^>]*>([^<]+)<\/a>/g)];
  assert.ok(links.length>=3);
  assert.ok(links.every(link=>link[1]==='Request a free 15-minute review'));
});
