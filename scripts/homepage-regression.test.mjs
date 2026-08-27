import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const homepage = readFileSync('index.html', 'utf8');
const mobileStyles = homepage.match(
  /@media\(max-width:900px\)\{([\s\S]*?)\}@media\(max-width:560px\)/,
)?.[1];

function homepageAnchors() {
  return [...homepage.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => ({
    attributes: match[1],
    href: match[1].match(/\bhref="([^"]+)"/i)?.[1],
    text: match[2].replace(/<[^>]+>/g, '').trim(),
  }));
}

test('homepage retains the approved mobile menu and toggle script', () => {
  assert.match(
    homepage,
    /<button class="menu"[^>]*aria-controls="site-navigation"[^>]*aria-expanded="false"[^>]*>☰<\/button>/,
  );
  assert.match(homepage, /document\.querySelector\('\.menu'\)/);
  assert.match(homepage, /classList\.toggle\('open'\)/);
  assert.match(homepage, /setAttribute\('aria-expanded',o\)/);
});

test('mobile menu controls provide full-width 44px targets and visible focus', () => {
  assert.ok(mobileStyles, 'missing mobile navigation media query');
  assert.match(homepage, /\.menu\{display:none;[^}]*\}/);
  assert.match(homepage, /\.links\{display:flex;[^}]*\}/);
  assert.match(
    mobileStyles,
    /\.menu\{display:block;min-width:44px;min-height:44px/,
  );
  assert.match(mobileStyles, /\.links li\{width:100%\}/);
  assert.match(
    mobileStyles,
    /\.links a\{display:flex;align-items:center;width:100%;min-height:44px;padding:/,
  );
  assert.match(
    mobileStyles,
    /\.menu:focus-visible,\.links a:focus-visible\{outline:3px solid var\(--mint\);outline-offset:3px\}/,
  );
});

test('homepage retains the Hutchgroup mark and full main navigation', () => {
  assert.match(homepage, /<img class="brand-mark" src="\/brand\/hutchgroup-mark\.svg"[^>]*> <span class="brand-name">Hutchgroup<\/span>/);
  assert.match(homepage, /<ul class="links" id="site-navigation">/);
  assert.match(homepage, /href="#services">Solutions<\/a>/);
  assert.match(homepage, /href="#approach">Approach<\/a>/);
  assert.match(homepage, /href="#work">Built by Hutchgroup<\/a>/);
  assert.match(homepage, /href="#about">About<\/a>/);
  assert.match(homepage, /class="nav-cta" href="\/opportunity-review\/">Opportunity Review<\/a>/);
});

test('homepage preserves liquid-glass styling and reduced-motion support', () => {
  assert.match(homepage, /backdrop-filter:blur\(22px\) saturate\(145%\)/);
  assert.match(homepage, /@media\(prefers-reduced-motion:reduce\)\{html\{scroll-behavior:auto\}\*\{transition:none!important\}\}/);
});

test('homepage uses Steve’s approved hero package with the final phrase kept together', () => {
  assert.match(homepage, /<span class="eyebrow">Twin Cities small-business modernization<\/span>/);
  assert.match(homepage, /<h1>Your business has expensive problems <span>hiding in plain&nbsp;sight\.<\/span><\/h1>/);
  assert.match(
    homepage,
    /<p class="lede">We uncover the workflows, systems, and digital gaps quietly costing you time, customers, and money\. Then we fix the constraint that matters most, combining business analysis with hands-on building\.<\/p>/,
  );
  assert.match(
    homepage,
    /<p class="hero-philosophy">Find the friction\. Fix the constraint\. Make the business easier to find, choose, and run\.<\/p>/,
  );
  assert.match(
    homepage,
    /<div class="hero-proof"><div><strong>18\+ years of business analysis experience<\/strong><\/div><div><strong>Founder-led from diagnosis through delivery<\/strong><\/div><div><strong>Prep is our product proof<\/strong><\/div><\/div>/,
  );
});

test('homepage About section uses the approved 18+ experience language consistently', () => {
  assert.doesNotMatch(homepage, /15\+\s+years/i);
  assert.match(
    homepage,
    /Hutchgroup was founded by Shannon Hutcheson, a senior business analyst and hands-on technologist with 18\+ years of business analysis experience connecting business needs to working systems\./,
  );
});

test('homepage hero CTAs use the approved labels and exact destinations', () => {
  assert.match(
    homepage,
    /<div class="actions"><a class="btn primary" href="\/opportunity-review\/">Find my biggest opportunity<\/a><a class="btn secondary" href="https:\/\/prep\.hutchgroupllc\.com\/sign-in">See Prep in action<\/a><\/div>/,
  );

  const anchors = homepageAnchors();
  const approvedCtas = new Map([
    ['Find my biggest opportunity', '/opportunity-review/'],
    ['See Prep in action', 'https://prep.hutchgroupllc.com/sign-in'],
  ]);

  for (const [label, href] of approvedCtas) {
    const matches = anchors.filter(({ text }) => text === label);
    assert.equal(matches.length, 1, `expected exactly one hero CTA labeled: ${label}`);
    assert.equal(matches[0].href, href, `${label} must route to ${href}`);
  }
});

test('homepage retains the Prep product proof section and link', () => {
  assert.match(homepage, /<section class="proof-product" id="work">/);
  assert.match(homepage, /Prep is an interview command center/);
  assert.match(homepage, /Product proof · AI workflow design/);

  const prepLink = homepageAnchors().find(({ text }) => text === 'See Prep in action');
  assert.ok(prepLink, 'missing link to the Prep product proof');
  assert.equal(prepLink.href, 'https://prep.hutchgroupllc.com/sign-in');
});

test('primary Opportunity Review CTAs route to the live intake', () => {
  const anchors = homepageAnchors();
  const reviewLinks = anchors.filter(({ href }) => href === '/opportunity-review/');
  assert.ok(reviewLinks.length >= 4, `expected at least 4 Opportunity Review links, found ${reviewLinks.length}`);

  for (const label of [
    'Opportunity Review',
    'Find my biggest opportunity',
    'Start with an audit →',
    'Request my review →',
  ]) {
    const cta = anchors.find(({ text }) => text === label);
    assert.ok(cta, `missing primary Opportunity Review CTA: ${label}`);
    assert.equal(cta.href, '/opportunity-review/', `${label} must not be mailto-only`);
  }
});
