import { painPriorities, visitAttribution } from './journey.js';

const form = document.getElementById('reviewForm');
const status = document.getElementById('status');
const button = document.getElementById('submitButton');
const priority = document.getElementById('priority');
let previous = {};
try { previous = JSON.parse(sessionStorage.getItem('hutchgroup-attribution') || '{}'); } catch { /* Storage is optional. */ }
const attribution = visitAttribution(location.search, location.pathname, previous);
// Intent comes from this link, not a previous visit's selection.
const selectedPain = new URLSearchParams(location.search).get('pain');
if (Object.hasOwn(painPriorities, selectedPain)) {
  priority.value = painPriorities[selectedPain];
  attribution.pain = selectedPain;
  document.getElementById('selectedPain').textContent = 'Selected focus: ' + priority.value + '. You can change it below.';
} else {
  delete attribution.pain;
}
const allowedModules = Object.freeze({
  'ai-demand-capture': 'AI Demand Capture',
  'business-agent': 'Business Agent Activation',
  'local-search': 'Local Search Signal',
  'crm': 'CRM + Pipeline Sync',
  'automation': 'Automation Sprint',
  'ops-intelligence': 'Ops Intelligence'
});
const rawModules = new URLSearchParams(location.search).get('modules');
const selectedModules = rawModules ? [...new Set(rawModules.split(',').filter(id => Object.hasOwn(allowedModules,id)))].slice(0,6) : [];
if (selectedModules.length) {
  document.querySelector('#challenge').value = 'I would like to explore these implementation modules: ' + selectedModules.map(id=>allowedModules[id]).join(', ') + '.';
  document.getElementById('selectedPain').textContent += ' Digital menu modules added to your editable request.';
}
try { sessionStorage.setItem('hutchgroup-attribution', JSON.stringify(attribution)); } catch { /* Storage is optional. */ }

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (button.disabled || !form.reportValidity()) return;
  button.disabled = true;
  button.textContent = 'Sending request…';
  status.className = 'status';
  status.textContent = 'Sending your review request…';
  const data = new FormData(form);
  const submittedAttribution = { ...attribution };
  const chosenPain = Object.entries(painPriorities).find(([, value]) => value === data.get('priority'))?.[0];
  if (chosenPain) submittedAttribution.pain = chosenPain;
  else delete submittedAttribution.pain;
  const payload = Object.fromEntries(['name', 'business', 'website', 'email', 'priority', 'challenge'].map(key => [key, data.get(key)]));
  payload.attribution = submittedAttribution;
  try {
    const response = await fetch('/api/opportunity-review', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.error || 'We could not confirm your request.');
    window.hutchTrack?.('review_submitted');
    form.reset();
    document.getElementById('selectedPain').textContent = '';
    status.className = 'status success';
    const emailStatus = result.notifications?.customer;
    status.textContent = 'Request received. ' + (emailStatus === 'accepted'
      ? 'A confirmation email is on its way. Shannon will contact you by email to arrange the conversation.'
      : 'Your request is saved, but email notification is unconfirmed. You do not need to submit again. For a prompt response, please also email hutch@hutchgroupllc.com.');
    if (result.reviewId) status.textContent += ' Reference: ' + result.reviewId;
    button.textContent = 'Request received ✓';
    status.focus();
  } catch (error) {
    window.hutchTrack?.('review_failed');
    status.className = 'status error';
    status.textContent = error.name === 'TimeoutError'
      ? 'We could not confirm whether the request was saved. Please email Shannon before trying again so we can avoid a duplicate.'
      : (error.message || 'We could not confirm your request. Please try again or email Shannon directly.');
    button.disabled = false;
    button.textContent = 'Try again';
    status.focus();
  }
});
