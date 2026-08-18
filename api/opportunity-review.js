const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
};

const clean = (value, max = 5000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

async function supabaseRequest(url, key, path, options = {}) {
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const error = new Error(`Supabase request failed (${response.status})`);
    error.details = data;
    throw error;
  }

  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Opportunity Review: missing Supabase server environment variables.');
    return json(res, 500, { ok: false, error: 'Submission service is not configured yet.' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const name = clean(body.name, 160);
  const business = clean(body.business, 200);
  const website = clean(body.website, 500) || null;
  const email = clean(body.email, 320).toLowerCase();
  const priority = clean(body.priority, 160) || 'Not sure yet';
  const challenge = clean(body.challenge, 5000);

  if (!name || !business || !email || !challenge) {
    return json(res, 400, { ok: false, error: 'Name, business, email, and challenge are required.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(res, 400, { ok: false, error: 'Please enter a valid email address.' });
  }

  try {
    const companies = await supabaseRequest(supabaseUrl, serviceRoleKey, 'companies', {
      method: 'POST',
      body: JSON.stringify({ name: business, website }),
    });
    const company = companies?.[0];
    if (!company?.id) throw new Error('Company insert did not return an id.');

    const leads = await supabaseRequest(supabaseUrl, serviceRoleKey, 'leads', {
      method: 'POST',
      body: JSON.stringify({
        company_id: company.id,
        name,
        email,
        status: 'new',
        source: 'website_opportunity_review',
      }),
    });
    const lead = leads?.[0];
    if (!lead?.id) throw new Error('Lead insert did not return an id.');

    const reviews = await supabaseRequest(supabaseUrl, serviceRoleKey, 'opportunity_reviews', {
      method: 'POST',
      body: JSON.stringify({
        lead_id: lead.id,
        company_id: company.id,
        priority,
        challenge,
      }),
    });
    const review = reviews?.[0];
    if (!review?.id) throw new Error('Opportunity review insert did not return an id.');

    return json(res, 201, {
      ok: true,
      message: 'Your Technology Opportunity Review request has been received.',
      reviewId: review.id,
    });
  } catch (error) {
    console.error('Opportunity Review submission failed:', error?.details || error);
    return json(res, 500, {
      ok: false,
      error: 'We could not save your request. Please try again or email Hutchgroup directly.',
    });
  }
}
