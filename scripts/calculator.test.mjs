import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {estimateScenario} from '../assets/calculator.js';
test('missed-inquiry calculation is explicitly hypothetical',()=>{
 const r=estimateScenario({inquiries:60,unfollowedPercent:20,bookingPercent:30,averageJobValue:1500});
 assert.equal(r.unattended,12);
 assert.equal(r.modeledBookings,3.6);
 assert.equal(r.scenarioValue,5400);
 for(const bad of [{inquiries:-1,unfollowedPercent:20,bookingPercent:30,averageJobValue:1500},{inquiries:60,unfollowedPercent:120,bookingPercent:30,averageJobValue:1500}]) assert.throws(()=>estimateScenario(bad));
});
test('calculator does not transmit visitor entered financial figures',()=>{
 const script=readFileSync('assets/calculator.js','utf8');
 const html=readFileSync('resources/revenue-leak-calculator/index.html','utf8');
 assert.equal(script.includes('fetch('),false);
 assert.equal(script.includes('hutchTrack'),false);
 assert.ok(html.includes('not a forecast')||html.includes('not observed'));
 assert.ok(html.includes('name="inquiries"')&&html.includes('name="averageJobValue"'));
});
