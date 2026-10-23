import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import * as journey from '../assets/journey.js';

const source = readFileSync('assets/review.js', 'utf8').replace(/^import .*;\n/, '');

async function load(search) {
  const elements = Object.fromEntries(['reviewForm', 'status', 'submitButton', 'priority', 'selectedPain', 'challenge'].map(id => [id, { value: '', textContent: '', focus() {} }]));
  let submit, payload, verification;
  const form = elements.reviewForm;
  form.addEventListener = (event, callback) => { submit = callback; };
  form.reportValidity = () => true;
  form.reset = () => {};
  const context = {
    ...journey, URLSearchParams, AbortSignal,
    location: { search, pathname: '/opportunity-review/' },
    sessionStorage: { getItem: () => JSON.stringify({ service: 'revenue-leakage-audit' }), setItem() {} },
    document: {
      getElementById: id => elements[id], querySelector: selector => elements[selector.slice(1)],
      createElement: () => ({}), head: { append: script => script.onload() },
    },
    window: { turnstile: { render(selector, options) { verification = options; options.callback('synthetic-token'); return 1; } } },
    FormData: class {
      get(key) { return ({ name: 'Local Test', business: 'Synthetic Business', email: 'test@example.test', priority: 'Not sure yet', challenge: elements.challenge.value })[key] || ''; }
    },
    fetch: async (url, options) => {
      if (url === '/api/opportunity-review-config') return { ok: true, json: async () => ({ ok: true, siteKey: 'synthetic-public' }) };
      payload = JSON.parse(options.body);
      return { ok: true, json: async () => ({ ok: true, reviewId: 'synthetic-review' }) };
    },
  };
  runInNewContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  await submit({ preventDefault() {} });
  return { elements, payload, verification };
}

test('audit CTA prepopulates the editable form and submits an allowlisted service', async () => {
  const { elements, payload } = await load('?service=revenue-leakage-audit');
  assert.match(elements.challenge.value, /Revenue Leakage Audit/);
  assert.equal(payload.service, 'revenue-leakage-audit');
  assert.equal(payload.turnstileToken, 'synthetic-token');
});

test('late verification callbacks preserve saved confirmation and keep submission disabled', async () => {
  const { elements, verification } = await load('?service=revenue-leakage-audit');
  const savedMessage = elements.status.textContent;
  verification.callback('another-token');
  assert.equal(elements.submitButton.disabled, true);
  assert.equal(elements.status.textContent, savedMessage);
  verification['expired-callback']();
  verification['error-callback']();
  assert.equal(elements.status.textContent, savedMessage);
});

test('generic and unknown-service visits do not inherit an earlier audit selection', async () => {
  for (const search of ['', '?service=unknown']) {
    const { elements, payload } = await load(search);
    assert.equal(elements.challenge.value, '');
    assert.equal(payload.service, '');
  }
});
