import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { nearestIndex, counterText } from '../assets/homepage-rails.js';

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('assets/homepage-v3.css', 'utf8');
const js = readFileSync('assets/homepage-rails.js', 'utf8');

test('rail helper chooses nearest visible card without off-by-one at edges', () => {
  assert.equal(nearestIndex([]), 0);
  assert.equal(nearestIndex([1, 420, 860]), 0);
  assert.equal(nearestIndex([-390, -2, 408]), 1);
  assert.equal(nearestIndex([-820, -410, 3]), 2);
  assert.equal(nearestIndex([-800, -400, 0, 400]), 2);
  assert.equal(counterText(0, 4), '01 / 04');
  assert.equal(counterText(1, 2), '02 / 02');
});

test('three rails have matched controls, names, slide counts and focus access', () => {
  for (const [key, id, label, count] of [
    ['solutions','solution-rail','Hutchgroup business solutions',4],
    ['demos','demo-rail','Explore two interactive Hutchgroup Ops examples',2],
    ['resources','resource-rail','Free guides, calculator, and workflow examples',4],
  ]) {
    assert.ok(html.includes('data-rail-controls="' + key + '"'));
    assert.ok(html.includes('id="' + id + '" data-rail-viewport="' + key + '" tabindex="0"'));
    assert.ok(html.includes('aria-controls="' + id + '"'));
    assert.ok(html.includes('aria-label="' + label + '"'));
    assert.ok(html.includes('01 / ' + String(count).padStart(2,'0')));
  }
  assert.equal((html.match(/data-rail-prev/g) || []).length, 3);
  assert.equal((html.match(/data-rail-next/g) || []).length, 3);
});

test('native snap and accessible motion do not depend on animation-heavy libraries', () => {
  assert.match(css, /scroll-snap-type:x mandatory/);
  assert.match(css, /scroll-snap-align:start/);
  assert.match(css, /overscroll-behavior-inline:contain/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.match(js, /ArrowRight/);
  assert.match(js, /ArrowLeft/);
  assert.ok(!js.includes("addEventListener('wheel'"));
  assert.ok(!js.includes('setInterval'));
  assert.ok(!/\bautoplay\s*(?:=|:)/i.test(js));
});

test('browser controls appear only when working JavaScript initializes', () => {
  assert.match(css, /\.hg-rail-arrow\{display:none/);
  assert.match(css, /\.hg-rails-ready \.hg-rail-arrow\{display:inline-flex/);
  assert.match(js, /document\.documentElement\.classList\.add\('hg-rails-ready'\)/);
});
