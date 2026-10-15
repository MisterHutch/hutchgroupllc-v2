import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
const routes=['','opportunity-review','lead-follow-up-automation','web-design','local-seo','digital-business-systems','technology-opportunity-audit','fractional-technology-partner','resources','work','industries/roofing','industries/hvac','lead-flow-starter'];
test('public pages retain canonical brand, real intake destinations, and local assets',()=>{
  for(const route of routes){
    const html=readFileSync((route?route+'/':'')+'index.html','utf8');
    assert.ok(html.includes('/brand/hutchgroup-mark.svg'),route);
    assert.ok(html.includes('class="brand-name">Hutchgroup'),route);
    assert.ok(html.includes('<header')&&html.includes('<footer'),route);
    for(const [,src] of html.matchAll(/(?:src|href)="(\/[^"?#]+)(?:[?#][^"]*)?"/g)){
      if(src.startsWith('/api/'))continue;
      assert.ok(existsSync('.'+src),route+': missing '+src);
    }
  }
});
test('stale restaurant route still redirects to the review',()=>{
  const config=JSON.parse(readFileSync('vercel.json','utf8'));
  assert.ok(config.redirects.some(r=>r.source==='/blog/ai-agent-for-restaurants/:rest*'&&r.destination==='/opportunity-review/'&&r.permanent));
});
