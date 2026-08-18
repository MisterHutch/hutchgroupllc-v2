const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
};

const clean = (value, max = 5000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

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

async function resendEmail(apiKey, payload, idempotencyKey) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const error = new Error(`Resend request failed (${response.status})`);
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

async function sendOpportunityNotifications({
  resendApiKey,
  fromEmail,
  alertEmail,
  replyTo,
  reviewId,
  name,
  business,
  website,
  email,
  priority,
  challenge,
  serviceKey,
}) {
  if (!resendApiKey) {
    console.warn('Opportunity Review: RESEND_API_KEY is not configured; skipping notifications.');
    return;
  }

  const safeName = escapeHtml(name);
  const safeBusiness = escapeHtml(business);
  const safeWebsite = escapeHtml(website || 'Not provided');
  const safeEmail = escapeHtml(email);
  const safePriority = escapeHtml(priority);
  const safeChallenge = escapeHtml(challenge).replaceAll('\n', '<br>');
  const safeServiceKey = escapeHtml(serviceKey);

  const internalPayload = {
    from: fromEmail,
    to: [alertEmail],
    reply_to: email,
    subject: `New Hutchgroup opportunity: ${business}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#172033;line-height:1.6">
        <h1 style="font-size:24px;margin-bottom:8px">New Technology Opportunity Review</h1>
        <p style="color:#667085;margin-top:0">A new opportunity just landed from hutchgroupllc.com.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <tr><td style="padding:8px 0;font-weight:700">Contact</td><td>${safeName}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700">Company</td><td>${safeBusiness}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700">Email</td><td>${safeEmail}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700">Website</td><td>${safeWebsite}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700">Priority</td><td>${safePriority}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700">Service fit</td><td>${safeServiceKey}</td></tr>
        </table>
        <h2 style="font-size:18px">Challenge</h2>
        <p style="background:#f5f7fa;padding:16px;border-radius:10px">${safeChallenge}</p>
        <p style="font-size:12px;color:#98a2b3">Review ID: ${escapeHtml(reviewId)}</p>
      </div>`,
  };

  const customerPayload = {
    from: fromEmail,
    to: [email],
    reply_to: replyTo,
    subject: 'We received your Hutchgroup Technology Opportunity Review',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#172033;line-height:1.7">
        <h1 style="font-size:26px">Thanks, ${safeName}.</h1>
        <p>We received your Technology Opportunity Review for <strong>${safeBusiness}</strong>.</p>
        <p>We’ll review the problem you described, look for the highest-value place to start, and follow up with a practical next step rather than a pile of technology for technology’s sake.</p>
        <div style="background:#f5f7fa;padding:18px;border-radius:12px;margin:24px 0">
          <strong>Your priority:</strong> ${safePriority}<br>
          <strong>Your challenge:</strong><br>${safeChallenge}
        </div>
        <p>If you think of anything else, just reply to this email.</p>
        <p style="margin-top:28px"><strong>Shannon<br>Hutchgroup</strong><br><span style="color:#667085">Start with the problem. Use technology where it earns its place.</span></p>
      </div>`,
  };

  const results = await Promise.allSettled([
    resendEmail(resendApiKey, internalPayload, `opportunity-${reviewId}-internal`),
    resendEmail(resendApiKey, customerPayload, `opportunity-${reviewId}-customer`),
  ]);

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const label = index === 0 ? 'internal alert' : 'customer confirmation';
      console.error(`Opportunity Review ${label} failed:`, result.reason?.details || result.reason);
    }
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
  const resendApiKey = process.env.RESEND_API_KEY || '';
  const fromEmail = process.env.HUTCHGROUP_FROM_EMAIL || 'Hutchgroup <hello@hutchgroupllc.com>';
  const alertEmail = process.env.HUTCHGROUP_ALERT_EMAIL || 'shannon@hutchgroupllc.com';
  const replyTo = process.env.HUTCHGROUP_REPLY_TO || 'shannon@hutchgroupllc.com';

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

    await sendOpportunityNotifications({
      resendApiKey,
      fromEmail,
      alertEmail,
      replyTo,
      reviewId: review.id,
      name,
      business,
      website,
      email,
      priority,
      challenge,
      serviceKey,
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
