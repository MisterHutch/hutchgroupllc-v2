import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('index.html', 'utf8');

test('one visible H1 and fewer major homepage sections', () => {
  assert.equal((page.match(/<h1[ >]/g) || []).length, 1);
  assert.equal((page.match(/<section\b/g) || []).length, 6);
  assert.equal((page.match(/data-rail-viewport="/g) || []).length, 3);
  assert.ok(page.includes('id="services"'));
  assert.ok(page.includes('id="approach"'));
  assert.ok(page.includes('id="work"'));
  assert.ok(page.includes('id="explore"'));
  assert.ok(!page.includes('<section class="campaign-system"'));
  assert.ok(!page.includes('<section class="practical-ai"'));
  assert.ok(!page.includes('class="problem-strip"'));
  assert.ok(!page.includes('class="problem-map"'));
});

test('founder and illustrated roles remain inside optional disclosure', () => {
  const disclosure = page.match(/<details>[\s\S]*?<\/details>/)?.[0];
  assert.ok(disclosure?.includes('Hermes team / Grok team'));
  assert.equal((disclosure.match(/class="agent-row"/g) || []).length, 8);
  assert.ok(page.includes('Founder, Hutchgroup · Twin Cities'));
  assert.ok(!page.includes('setInterval'));
});

test('Ops demo proof is accurate, authentic and useful', () => {
  assert.ok(!page.includes('prep.hutchgroupllc.com'));
  assert.ok(page.includes('Get found.'));
  const proof = page.match(/<section class="proof-product hg-proof"[\s\S]*?<\/section>/)?.[0];
  assert.ok(proof);
  assert.ok(proof.includes('https://ops.hutchgroupllc.com/?demo=hvac#command'));
  assert.ok(proof.includes('https://ops.hutchgroupllc.com/?demo=leasing#command'));
  assert.ok(proof.includes('/assets/ops-command-center.png'));
  assert.ok(proof.includes('Changes reset on refresh'));
  assert.ok(proof.includes('DESIGN ILLUSTRATION · NOT A LIVE AGENT'));
  assert.ok(proof.includes('not a measured customer outcome'));
  assert.ok(page.includes('Interactive discovery demo · sample data'));
});

test('business review path and canonical brand remain intact', () => {
  assert.ok(page.includes('/brand/hutchgroup-mark.svg'));
  assert.ok(page.includes('/assets/minneapolis-skyline.svg') === false); // skyline is supplied by existing site CSS
  assert.ok(page.includes('/assets/homepage-v3.css'));
  assert.ok(page.includes('/assets/homepage-rails.js'));
  const links = [...page.matchAll(/<a[^>]+href="\/opportunity-review\/"[^>]*>([^<]+)<\/a>/g)];
  assert.ok(links.length >= 3);
  assert.ok(links.every(link => link[1] === 'Request a free 15-minute review'));
});

test('every card has a real route, next-card preview and two substantial Ops examples', () => {
  const solutions = page.match(/<div class="hg-scroll-rail hg-scroll-rail--solutions"[\s\S]*?<\/div>\s*<div class="hg-under-rail"/)?.[0];
  const demos = page.match(/<div class="hg-scroll-rail hg-scroll-rail--demos"[\s\S]*?<\/div>\s*<div class="hg-under-rail"/)?.[0];
  const resources = page.match(/<div class="hg-scroll-rail hg-scroll-rail--resources"[\s\S]*?<\/div>\s*<div class="hg-under-rail"/)?.[0];
  assert.ok(solutions);
  assert.ok(demos);
  assert.ok(resources);
  assert.equal((solutions.match(/<article class="hg-solution-tile/g) || []).length, 4);
  assert.equal((demos.match(/<article class="hg-demo-tile/g) || []).length, 2);
  assert.equal((resources.match(/<article class="hg-resource-tile/g) || []).length, 4);
  assert.ok(solutions.includes('/lead-flow-starter/'));
  assert.ok(solutions.includes('/digital-business-systems/'));
  assert.ok(resources.includes('/resources/revenue-leak-calculator/'));
  assert.ok(resources.includes('/resources/business-agent-activation/'));
});
