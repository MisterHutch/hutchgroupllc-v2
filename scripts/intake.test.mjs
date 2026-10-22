import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/opportunity-review.js';
import configHandler from '../api/opportunity-review-config.js';
import { createProviderFixture } from './fixtures.mjs';
import { sanitizeAttribution, visitAttribution, painPriorities } from '../assets/journey.js';

const valid = { name: 'Local Test', business: 'Synthetic Business', email: 'test@example.test', turnstileToken: 'synthetic-token' };

async function submit(t, payload = valid, fixtureOptions = {}, method = 'POST') {
  t.mock.method(globalThis, 'fetch', createProviderFixture().fetch);
  const fixture = createProviderFixture(fixtureOptions);
  t.mock.method(globalThis, 'fetch', fixture.fetch);
  const originalEnv = { ...process.env };
  Object.assign(process.env, { SUPABASE_URL: 'https://local-fixture.invalid', SUPABASE_SERVICE_ROLE_KEY: 'synthetic', RESEND_API_KEY: 'synthetic', TURNSTILE_SITE_KEY: 'synthetic-public', TURNSTILE_SECRET_KEY: 'synthetic-secret' });
  t.after(() => { process.env = originalEnv; });
  const res = { headers: {}, setHeader(key, value) { this.headers[key] = value; }, end(body) { this.body = JSON.parse(body); } };
  await handler({ method, body: payload }, res);
  return { res, calls: fixture.calls };
}

test('three required fields save a review and send both notifications', async t => {
  const { res, calls } = await submit(t);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.ok, true);
  assert.deepEqual(res.body.notifications, { internal: 'accepted', customer: 'accepted' });
  assert.ok(calls.find(c => c.url.endsWith('/opportunity_reviews')).body.challenge.includes('No additional context'));
  assert.equal(calls.filter(c => c.url === 'https://api.resend.com/emails').length, 2);
  const emails = calls.filter(c => c.url === 'https://api.resend.com/emails').map(c => c.body);
  assert.ok(emails.every(mail => mail.from === 'Hutchgroup <hutch@hutchgroupllc.com>'));
  assert.deepEqual(emails[0].to, ['hutch@hutchgroupllc.com']);
  assert.equal(emails[1].reply_to, 'hutch@hutchgroupllc.com');
});
test('missing Turnstile token is rejected before provider calls', async t => {
  const { res, calls } = await submit(t, { ...valid, turnstileToken: '' });
  assert.equal(res.statusCode, 400);
  assert.equal(calls.length, 0);
});
test('failed or unavailable Turnstile never writes or sends email', async t => {
  const { res, calls } = await submit(t, valid, { turnstileFailure: true });
  assert.equal(res.statusCode, 403);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
});
test('Turnstile token from another hostname or action cannot write', async t => {
  const { res, calls } = await submit(t, valid, { turnstileHostname: 'other.example' });
  assert.equal(res.statusCode, 403);
  assert.equal(calls.length, 1);
});
test('public Turnstile config exposes only the site key', t => {
  const originalEnv = { ...process.env };
  Object.assign(process.env, { TURNSTILE_SITE_KEY: 'synthetic-public', TURNSTILE_SECRET_KEY: 'synthetic-secret' });
  t.after(() => { process.env = originalEnv; });
  const res = { headers: {}, setHeader(key, value) { this.headers[key] = value; }, end(body) { this.body = JSON.parse(body); } };
  configHandler({ method: 'GET' }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true, siteKey: 'synthetic-public' });
});
test('Turnstile provider outage fails closed', async t => {
  const { res, calls } = await submit(t, valid, { turnstileOutage: true });
  assert.equal(res.statusCode, 503);
  assert.equal(calls.length, 1);
});
test('missing required fields fail before persistence', async t => {
  const { res, calls } = await submit(t, { ...valid, business: '  ' });
  assert.equal(res.statusCode, 400); assert.equal(calls.length, 0);
});
test('invalid email fails before persistence', async t => {
  const { res, calls } = await submit(t, { ...valid, email: 'invalid' });
  assert.equal(res.statusCode, 400); assert.equal(calls.length, 0);
});
test('unsafe website scheme fails before persistence', async t => {
  const { res, calls } = await submit(t, { ...valid, website: 'javascript:alert(1)' });
  assert.equal(res.statusCode, 400); assert.equal(calls.length, 0);
});
test('storage outage never reports success', async t => {
  const { res, calls } = await submit(t, valid, { fail: 'opportunity_reviews' });
  assert.equal(res.statusCode, 500); assert.equal(res.body.ok, false);
  assert.equal(calls.filter(c => c.url === 'https://api.resend.com/emails').length, 0);
});
test('email outage preserves saved confirmation and reports failure', async t => {
  const { res } = await submit(t, valid, { emailFailure: true });
  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body.notifications, { internal: 'failed', customer: 'failed' });
});
test('auxiliary write outage does not falsely invite duplicate review submission', async t => {
  const { res } = await submit(t, valid, { fail: 'service_interests' });
  assert.equal(res.statusCode, 201); assert.ok(res.body.reviewId);
});
test('saved source uses existing activity metadata and never records arbitrary query fields', async t => {
  const { res, calls } = await submit(t, { ...valid, priority: painPriorities['missed-leads'], attribution: { utm_source: 'google', utm_medium: 'organic', utm_campaign: 'twin-cities-follow-up', pain: 'missed-leads', email: 'private@example.test', url: 'https://x.test/?token=secret' } });
  assert.equal(res.statusCode, 201);
  const activity = calls.find(c => c.body?.activity_type === 'opportunity_review_submitted');
  assert.deepEqual(activity.body.metadata.attribution, { utm_source: 'google', utm_medium: 'organic', utm_campaign: 'twin-cities-follow-up', pain: 'missed-leads' });
});
test('notification content escapes customer input', async t => {
  const { calls } = await submit(t, { ...valid, name: '<script>alert(1)</script>' });
  const mail = calls.find(c => c.url === 'https://api.resend.com/emails');
  assert.ok(mail.body.html.includes('&lt;script&gt;'));
  assert.ok(!mail.body.html.includes('<script>'));
});
test('method is rejected without calling providers', async t => {
  const { res, calls } = await submit(t, valid, {}, 'GET');
  assert.equal(res.statusCode, 405); assert.equal(calls.length, 0);
});
test('unknown priority safely falls back', async t => {
  const { calls } = await submit(t, { ...valid, priority: '<script>' });
  assert.equal(calls.find(c => c.url.endsWith('/opportunity_reviews')).body.priority, 'Not sure yet');
});
test('malformed attribution is ignored', () => {
  for (const input of [null, false, 42, 'string', [], { utm_source: 'private@example.test' }]) assert.deepEqual(sanitizeAttribution(input), {});
});
test('campaign survives navigation without retaining arbitrary query strings', () => {
  const landing = visitAttribution('?utm_source=google&utm_medium=organic&utm_campaign=twin-cities-follow-up&email=secret', '/lead-follow-up-automation/');
  const form = visitAttribution('?pain=missed-leads', '/opportunity-review/', landing);
  assert.equal(form.utm_source, 'google'); assert.equal(form.pain, 'missed-leads');
  assert.equal(form.entry_path, '/lead-follow-up-automation/'); assert.equal(form.email, undefined);
});
test('new explicit source clears old campaign rather than creating a mixed touch', () => {
  const result = visitAttribution('?utm_source=linkedin', '/', { utm_source: 'google', utm_medium: 'organic', utm_content: 'business-profile' });
  assert.deepEqual(result, { utm_source: 'linkedin', entry_path: '/' });
});
