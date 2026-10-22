// Synthetic provider boundary for local verification. Never uses a live database or email service.
export function createProviderFixture({ fail = '', emailFailure = false, turnstileFailure = false, turnstileOutage = false, turnstileHostname = 'hutchgroupllc.com', turnstileAction = 'opportunity_review' } = {}) {
  const calls = [];
  let reviewCount = 0;
  const fetch = async (input, options = {}) => {
    const url = new URL(input);
    const body = options.body ? JSON.parse(options.body) : undefined;
    const table = url.pathname.split('/').at(-1);
    calls.push({ url: url.href, method: options.method, body });
    if (url.hostname === 'challenges.cloudflare.com') {
      return Response.json({ success: !turnstileFailure, hostname: turnstileHostname, action: turnstileAction }, { status: turnstileOutage ? 503 : 200 });
    }
    if (url.hostname === 'api.resend.com') {
      return new Response(JSON.stringify(emailFailure ? { message: 'Synthetic email outage' } : { id: 'synthetic-email' }), { status: emailFailure ? 503 : 200 });
    }
    if (url.hostname !== 'local-fixture.invalid') throw new Error('Unexpected external request in local fixture');
    if (table === fail) return new Response(JSON.stringify({ message: 'Synthetic storage outage' }), { status: 503 });
    if (options.method === 'GET') return Response.json([]);
    if (table === 'opportunity_reviews') reviewCount++;
    return Response.json([{ id: table === 'opportunity_reviews' ? `synthetic-review-${reviewCount}` : `synthetic-${table}` }]);
  };
  return { fetch, calls };
}
