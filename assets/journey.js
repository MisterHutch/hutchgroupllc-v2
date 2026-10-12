// Shared by the browser and server. Never retain arbitrary URL or form values as attribution.
export const painPriorities = Object.freeze({
  'missed-leads': 'Faster follow-up',
  'repetitive-admin': 'Reduce repetitive work',
  'disconnected-systems': 'Connect systems / data',
});

export const attributionValues = Object.freeze({
  utm_source: ['google', 'linkedin', 'local-partner'],
  utm_medium: ['organic', 'social', 'referral'],
  utm_campaign: ['twin-cities-follow-up'],
  utm_content: ['business-profile', 'workflow-story', 'partner-introduction'],
  entry_path: ['/', '/lead-follow-up-automation/', '/opportunity-review/'],
  pain: Object.keys(painPriorities),
});

export function sanitizeAttribution(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
  return Object.fromEntries(Object.entries(attributionValues)
    .filter(([key, values]) => values.includes(input[key]))
    .map(([key]) => [key, input[key]]));
}

export function visitAttribution(search, pathname, previous = {}) {
  const params = new URLSearchParams(search);
  const current = sanitizeAttribution(Object.fromEntries(params));
  // A new tagged source starts a new touch; do not combine it with an older campaign.
  const base = current.utm_source ? {} : sanitizeAttribution(previous);
  return sanitizeAttribution({ ...base, ...current, entry_path: base.entry_path || pathname });
}
