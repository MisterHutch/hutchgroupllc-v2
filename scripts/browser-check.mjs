import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const binary = process.env.AGENT_BROWSER_BIN || 'agent-browser';
const session = 'hutch-site-review';
const base = 'http://127.0.0.1:4173';
const results = [];
mkdirSync('evidence', { recursive: true });
function run(...args) {
  return execFileSync(binary, ['--session', session, ...args], { encoding: 'utf8', timeout: 35000 }).trim();
}
function check(name, fn) {
  try { const detail = fn(); results.push({ name, status: 'PASS', detail }); console.log('PASS ' + name); }
  catch (error) { results.push({ name, status: 'FAIL', detail: error.message }); console.error('FAIL ' + name); }
  finally { run('network', 'unroute', base + '/api/opportunity-review'); }
  writeFileSync('evidence/browser-results.json', JSON.stringify({ environment: 'local with synthetic providers', results }, null, 2));
}
const evaluate = code => run('eval', code);
const screenshot = name => run('screenshot', resolve(`evidence/${name}.png`));
const fill = () => { run('fill', '#name', 'Local Test'); run('fill', '#business', 'Synthetic Business'); run('fill', '#email', 'test@example.test'); };
const submit = () => { run('scrollintoview', '#submitButton'); run('click', '#submitButton'); };

for (const width of [320, 390, 768, 1440]) {
  check(`responsive ${width}px: homepage, campaign, review`, () => {
    run('set', 'viewport', String(width), '900');
    for (const path of ['/', '/lead-follow-up-automation/', '/opportunity-review/']) {
      run('open', base + path);
      evaluate('if(document.documentElement.scrollWidth>innerWidth)throw Error("horizontal overflow");if(document.querySelectorAll("h1").length!==1)throw Error("H1 count");"layout OK"');
      if (width === 390) screenshot(path === '/' ? 'home-mobile' : path.includes('lead-') ? 'campaign-mobile' : 'review-mobile');
    }
    return 'No horizontal overflow; one H1 on each page.';
  });
}
check('mobile hero CTA can be clicked', () => {
  run('set','viewport','390','844');run('open',base+'/');
  run('click','.hero .btn');run('wait','#priority');
  return evaluate('if(!location.pathname.includes("opportunity-review"))throw Error("CTA failed");"homepage CTA navigates"');
});
check('keyboard navigation and optional roster', () => {
  run('open',base+'/');run('focus','.menu');run('press','Enter');
  evaluate('if(document.querySelector(".menu").getAttribute("aria-expanded")!=="true")throw Error("menu closed")');
  run('press','Escape');
  evaluate('if(document.querySelector(".menu").getAttribute("aria-expanded")!=="false")throw Error("menu open")');
  run('scrollintoview','summary');run('focus','summary');run('press','Enter');
  const result=evaluate('if(!document.querySelector("details").open||document.querySelectorAll("details .agent-row").length!==8)throw Error("roster not expanded");"keyboard menu and disclosure work"');
  screenshot('behind-work-mobile');return result;
});
check('service routes and Ops demo destinations', () => {
  run('open',base+'/');
  return evaluate(`const cards=[...document.querySelectorAll('#solution-rail .hg-solution-tile')];if(cards.length!==4)throw Error('solution cards missing');const ops=[...document.querySelectorAll('#demo-rail .hg-demo-cta')];if(ops.length!==2||!ops.some(a=>a.href.includes('demo=hvac'))||!ops.some(a=>a.href.includes('demo=leasing')))throw Error('Ops destinations');'four solutions and two Ops demos present'`);
});
check('homepage v3 rail controls and mobile containment', () => {
  run('set','viewport','390','844');run('open',base+'/');
  const result=evaluate(`const rails=[...document.querySelectorAll('[data-rail-viewport]')];if(rails.length!==3)throw Error('missing rails');if(!document.documentElement.classList.contains('hg-rails-ready'))throw Error('rails uninitialized');for(const rail of rails){if(rail.tabIndex!==0||getComputedStyle(rail).scrollSnapType!=='x mandatory')throw Error('rail inaccessible');if(rail.scrollWidth<=rail.clientWidth)throw Error('expected scrollable rail')}if(document.documentElement.scrollWidth>innerWidth)throw Error('page overflow');'three native swipeable rails'`);
  run('scrollintoview','#solution-rail');screenshot('v3-solution-rail-mobile');
  return result;
});
check('campaign → actual handler → saved confirmation with provider fixtures', () => {
  run('open',base+'/lead-follow-up-automation/?utm_source=google&utm_medium=organic&utm_campaign=twin-cities-follow-up&utm_content=business-profile');
  run('scrollintoview','.hero .btn');run('click','.hero .btn');run('wait','#priority');
  evaluate('window.originalTestFetch=window.fetch;window.fetch=async (...args)=>{window.testPayload=JSON.parse(args[1].body);return window.originalTestFetch(...args)}');
  fill(); submit(); run('wait','.status.success');
  const detail=evaluate('if(window.testPayload.attribution.utm_source!=="google"||window.testPayload.priority!=="Faster follow-up"||!document.querySelector("#submitButton").disabled)throw Error("lost context or duplicate guard");document.querySelector("#status").textContent');
  screenshot('review-success-mobile');return detail;
});
check('server failure retains input and retry succeeds', () => {
  run('open',base+'/opportunity-review/');
  run('network','route',base+'/api/opportunity-review','--body',JSON.stringify({ok:false,error:'Synthetic storage failure'}));
  fill();submit();run('wait','.status.error');
  evaluate('if(document.querySelector("#submitButton").disabled||document.querySelector("#email").value!=="test@example.test")throw Error("retry state invalid")');
  screenshot('review-error-mobile');run('network','unroute',base+'/api/opportunity-review');
  submit();run('wait','.status.success');return 'Input retained, button re-enabled; retry saved through actual handler with synthetic providers.';
});
check('saved request with failed email does not invite resubmission', () => {
  run('open',base+'/opportunity-review/');
  run('network','route',base+'/api/opportunity-review','--body',JSON.stringify({ok:true,reviewId:'synthetic-email-failure',notifications:{customer:'failed',internal:'accepted'}}));
  fill();submit();run('wait','.status.success');
  const detail=evaluate('if(!document.querySelector("#status").textContent.includes("do not need to submit again"))throw Error("misleading confirmation");document.querySelector("#status").textContent');
  screenshot('review-email-failure');run('network','unroute',base+'/api/opportunity-review');return detail;
});
check('unknown pain defaults safely and client validation blocks empty submission', () => {
  run('open',base+'/opportunity-review/?pain=%3Cscript%3E');
  const detail=evaluate('if(document.querySelector("#priority").value!=="Not sure yet"||document.querySelector("#selectedPain").textContent!==""||document.querySelector("#reviewForm").checkValidity())throw Error("invalid entry behavior");"unknown pain ignored; required fields enforced"');return detail;
});
check('changed form priority updates submitted intent', () => {
  run('open',base+'/opportunity-review/?pain=missed-leads');
  evaluate('window.originalTestFetch=window.fetch;window.fetch=async (...args)=>{window.testPayload=JSON.parse(args[1].body);return window.originalTestFetch(...args)}');
  run('select','#priority','Reduce repetitive work');fill();submit();run('wait','.status.success');
  return evaluate('if(window.testPayload.attribution.pain!=="repetitive-admin")throw Error("stale intent");"edited intent is submitted"');
});
check('reduced motion and lazy product image load', () => {
  run('set','media','light','reduced-motion');run('open',base+'/');
  run('scrollintoview','.product-shot');run('wait','.product-shot');
  const detail=evaluate('const image=document.querySelector(".product-shot");if(!image.complete||image.naturalWidth!==1440)throw Error("product image missing");if(getComputedStyle(document.querySelector(".btn")).transitionDuration!=="0s")throw Error("motion active");"real image loaded; transitions disabled"');
  run('set','viewport','1440','1000');evaluate('window.scrollTo({top:0,behavior:"instant"});document.activeElement?.blur()');run('screenshot','--full',resolve('evidence/home-desktop.png'));return detail;
});
for (const path of ['/', '/lead-follow-up-automation/', '/opportunity-review/']) {
  check(`accessibility scan ${path}`, () => {
    run('open',base+path);
    const audit=JSON.parse(run('a11y','--json'));
    const name=path==='/'?'home':path.includes('lead-')?'campaign':'review';
    writeFileSync(`evidence/a11y-${name}.json`,JSON.stringify(audit,null,2));
    if(audit.data.counts.violations)throw Error(`${audit.data.counts.violations} axe violations`);
    return { violations:0, incomplete:audit.data.counts.incomplete, note:'Gradient contrast checks still need human review; not a WCAG certification.' };
  });
}
const errors=run('errors');
writeFileSync('evidence/browser-errors.txt',errors||'No page errors reported.\n');
console.log(`${results.filter(r=>r.status==='PASS').length}/${results.length} scenarios passed.`);
if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
