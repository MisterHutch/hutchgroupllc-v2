const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
};

const clean = (value, max = 5000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const serviceKeyForPriority = (priority) => {
  const map = {
    'More leads / better conversion': 'digital_growth',
    'Faster follow-up': 'workflow_automation',
    'Reduce repetitive work': 'workflow_automation',
    'Connect systems / data': 'systems_integration',
    'Improve website / local visibility': 'web_seo',
    'Technology direction / planning': 'fractional_technology_advisory',
    'Not sure yet': 'technology_opportunity_audit',
  };
  return map[priority] || 'technology_opportunity_audit';
};

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

async function findCompany(supabaseUrl, serviceRoleKey, business, website) {
  if (website) {
    const rows = await supabaseRequest(
      supabaseUrl,
      serviceRoleKey,
      `companies?select=id,name,website&website=eq.${encodeURIComponent(website)}&limit=1`,
      { method: 'GET' },
    );
    if (rows?.[0]) return rows[0];
  }

  const rows = await supabaseRequest(
    supabaseUrl,
    serviceRoleKey,
    `companies?select=id,name,website&name=eq.${encodeURIComponent(business)}&limit=1`,
    { method: 'GET' },
  );
  return rows?.[0] || null;
}

async function findLead(supabaseUrl, serviceRoleKey, email) {
  const rows = await supabaseRequest(
    supabaseUrl,
    serviceRoleKey,
    `leads?select=id,company_id,name,email,status,source&email=eq.${encodeURIComponent(email)}&limit=1`,
    { method: 'GET' },
  );
  return rows?.[0] || null;
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
    let company = await findCompany(supabaseUrl, serviceRoleKey, business, website);
    if (!company) {
      const companies = await supabaseRequest(supabaseUrl, serviceRoleKey, 'companies', {
        method: 'POST',
        body: JSON.stringify({ name: business, website }),
      });
      company = companies?.[0];
    }
    if (!company?.id) throw new Error('Company lookup/insert did not return an id.');

    let lead = await findLead(supabaseUrl, serviceRoleKey, email);
    if (!lead) {
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
      lead = leads?.[0];
    }
    if (!lead?.id) throw new Error('Lead lookup/insert did not return an id.');

    const companyId = lead.company_id || company.id;

    const reviews = await supabaseRequest(supabaseUrl, serviceRoleKey, 'opportunity_reviews', {
      method: 'POST',
      body: JSON.stringify({
        lead_id: lead.id,
        company_id: companyId,
        priority,
        challenge,
      }),
    });
    const review = reviews?.[0];
    if (!review?.id) throw new Error('Opportunity review insert did not return an id.');

    const serviceKey = serviceKeyForPriority(priority);

    await supabaseRequest(supabaseUrl, serviceRoleKey, 'service_interests', {
      method: 'POST',
      body: JSON.stringify({
        lead_id: lead.id,
        opportunity_review_id: review.id,
        service_key: serviceKey,
      }),
    });

    await supabaseRequest(supabaseUrl, serviceRoleKey, 'lead_activities', {
      method: 'POST',
      body: JSON.stringify({
        lead_id: lead.id,
        activity_type: 'opportunity_review_submitted',
        description: `Technology Opportunity Review submitted with priority: ${priority}`,
        metadata: {
          opportunity_review_id: review.id,
          service_key: serviceKey,
          source: 'website_opportunity_review',
        },
      }),
    });

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
