export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.statusCode = 405;
    return res.end(JSON.stringify({ ok: false, error: 'Method not allowed.' }));
  }

  const siteKey = process.env.TURNSTILE_SITE_KEY || '';
  if (!siteKey || !process.env.TURNSTILE_SECRET_KEY) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ ok: false, error: 'Review requests are temporarily unavailable. Please email hutch@hutchgroupllc.com.' }));
  }

  res.statusCode = 200;
  return res.end(JSON.stringify({ ok: true, siteKey }));
}
