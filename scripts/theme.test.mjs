import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync('assets/theme.js', 'utf8');
function initialize(storage) {
  const document = { documentElement: { dataset: {} }, querySelectorAll: () => [], addEventListener() {} };
  vm.runInNewContext(source, { document, localStorage: storage });
  return document.documentElement.dataset.theme;
}
test('theme restores an allowed preference before DOM initialization', () => {
  assert.equal(initialize({ getItem: () => 'cyberpunk' }), 'cyberpunk');
});
test('missing or invalid saved themes fall back to Classic', () => {
  for (const value of [null, '', 'unknown', '__proto__']) {
    assert.equal(initialize({ getItem: () => value }), 'classic');
  }
});
test('blocked storage does not prevent rendering the default theme', () => {
  assert.equal(initialize({ getItem() { throw new Error('Storage blocked'); } }), 'classic');
});
