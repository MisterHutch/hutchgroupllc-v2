import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { visitAttribution, sanitizeAttribution } from '../assets/journey.js';

const landing = readFileSync('lead-flow-starter/index.html', 'utf8');
const sitemap = readFileSync('sitemap.xml', 'utf8');
const copy = readFileSync('docs/campaigns/TWIN_CITIES_LEAD_FLOW_AD_COPY_2026-10.md', 'utf8');

test('Lead Flow Starter is a branded, crawlable conversion page', () => {
  assert.equal((landing.match(/<h1(?:\s|>)/gi) ?? []).length, 1);
  assert.ok(landing.includes('https://hutchgroupllc.com/lead-flow-starter/'));
  assert.ok(landing.includes('/assets/lead-flow.css'));
  assert.ok(existsSync('assets/lead-flow.css'));
  assert.ok(landing.includes('/assets/analytics.js'));
  assert.ok(landing.includes('/brand/hutchgroup-mark.svg'));
  assert.ok(landing.includes('<header') && landing.includes('<footer'));
  assert.ok(sitemap.includes('https://hutchgroupllc.com/lead-flow-starter/'));
  assert.ok(landing.includes('/opportunity-review/?pain=missed-leads'));
  assert.ok(landing.includes('https://ops.hutchgroupllc.com/?demo=hvac#command'));
});

test('campaign claims preserve synthetic-data and measured-outcome boundaries', () => {
  assert.match(landing, /synthetic customer records/);
  assert.match(landing, /not actual Hutchgroup customer outcomes/);
  assert.match(landing, /No such result can be guaranteed/);
  assert.match(landing, /starting point, not an offer for unlimited development/);
  assert.ok(!landing.includes('guaranteed new leads'));
});

test('paid and organic platform attribution survives only known identifiers', () => {
  const cases = [
    ['facebook', 'paid_social', 'fb-feed-a'],
    ['facebook', 'paid_social', 'fb-feed-b'],
    ['instagram', 'paid_social', 'ig-feed-a'],
    ['instagram', 'paid_social', 'ig-reel-a'],
    ['google', 'paid_search', 'google-search'],
    ['x', 'social', 'x-post'],
    ['linkedin', 'social', 'organic-video'],
    ['google', 'organic', 'business-profile'],
    ['local-partner', 'referral', 'local-referral'],
  ];
  for (const [source, medium, content] of cases) {
    const query = '?' + new URLSearchParams({
      utm_source: source,
      utm_medium: medium,
      utm_campaign: 'twin-cities-lead-flow',
      utm_content: content,
      customer_email: 'private@example.test',
    });
    const data = visitAttribution(query, '/lead-flow-starter/', {});
    assert.equal(data.utm_source, source);
    assert.equal(data.utm_medium, medium);
    assert.equal(data.utm_content, content);
    assert.equal(data.utm_campaign, 'twin-cities-lead-flow');
    assert.equal(data.entry_path, '/lead-flow-starter/');
    assert.ok(!JSON.stringify(data).includes('private@example.test'));
  }
  assert.deepEqual(sanitizeAttribution({ utm_source:'evil', utm_medium:'paid_social',utm_campaign:'made_up', secret:'token'}), {utm_medium:'paid_social'});
});

test('Google ad copy has 15 compliant headlines and four compliant descriptions', () => {
  const headlineSection = copy.split('### Headlines')[1]?.split('### Descriptions')[0] || '';
  const descSection = copy.split('### Descriptions')[1]?.split('**Seed exact')[0] || '';
  const headlines = [...headlineSection.matchAll(/^\d+\. (.+?) \(\d+\)$/gm)].map(x=>x[1]);
  const descriptions = [...descSection.matchAll(/^\d+\. (.+?) \(\d+\)$/gm)].map(x=>x[1]);
  assert.equal(headlines.length, 15);
  assert.equal(descriptions.length, 4);
  assert.ok(headlines.every(s=>s.length <= 30));
  assert.ok(descriptions.every(s=>s.length <= 90));
});

test('campaign documents never claim ads have launched', () => {
  const plan = readFileSync('docs/campaigns/TWIN_CITIES_LEAD_FLOW_2026-10.md','utf8');
  assert.match(plan, /No ad spend, publication, or account connection authorized/);
  assert.match(copy, /not posted, activated, charged, or approved/);
});
