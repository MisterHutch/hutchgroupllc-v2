const MAX_CHALLENGE_LENGTH = 4000;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function clean(value, max = 500) {
  return String(value || '').trim().slice(0, max);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function scoreOpportunity(priority, challenge) {
  const text = `${priority} ${challenge}`.toLowerCase();
  let score = 35;
  const reasons = [];

  const signals = [
    { words: ['lead', 'follow-up', 'follow up', 'conversion', 'missed call', 'appointment'], points: 15, reason: 'Revenue or lead-conversion friction detected' },
    { words: ['manual', 'spreadsheet', 'copy', 'repetitive', 'remembering', 'double entry'], points: 15, reason: 'Manual or repetitive workflow friction detected' },
    { words: ['connect', 'integration', 'disconnected', 'system', 'data', 'crm'], points: 15, reason: 'Systems or data integration opportunity detected' },
    { words: ['website', 'seo', 'google', 'visibility', 'local search'], points: 10, reason: 'Digital visibility or website opportunity detected' },
    { words: ['automation', 'automate', 'ai', 'workflow'], points: 10, reason: 'Automation opportunity detected' }
  ];

  for (const signal of signals) {
    if (signal.words.some((word) => text.includes(word))) {
      score += signal.points;
      reasons.push(signal.reason);
    }
  }

  if (challenge.length >= 180) {
    score += 10;
    reasons.push('Submission includes actionable context');
  }

  if (priority && priority !== 'Not sure yet') {
    score += 5;
    reasons.push('Clear business priority identified');
  }

  return { score: Math.min(score, 100), reasons };
}

async function supabaseRequest(path, options = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('BACKEND_NOT_CONFIGURED');
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`SUPABASE_${response.status}:${detail}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function sendNotification({ lead, company, review }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !to || !from) return;

  const body = {
    from,
    to: [to],
    subject: `New Hutchgroup Opportunity Review: ${company.name}`,
    text: [
      `New Opportunity Review`,
      ``,
      `Name: ${lead.name}`,
      `Business: ${company.name}`,
      `Email: ${lead.email}`,
      `Website: ${company.website || 'Not provided'}`,
      `Priority: ${review.priority}`,
      `Opportunity score: ${review.opportunity_score}/100`,
      `Signals: ${(review.score_reasons || []).join('; ') || 'None yet'}`,
      ``,
      `Challenge:`,
      review.challenge
    ].join('\n')
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    console.error('Resend notification failed', response.status, await response.text());
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method not allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    // Invisible honeypot. Real users should never populate this field.
    if (clean(payload.company_url, 200)) {
      return json(res, 200, { ok: true });
    }

    const name = clean(payload.name, 120);
    const business = clean(payload.business, 180);
    const website = clean(payload.website, 500);
    const email = clean(payload.email, 254).toLowerCase();
    const priority = clean(payload.priority, 160) || 'Not sure yet';
    const challenge = clean(payload.challenge, MAX_CHALLENGE_LENGTH);

    if (!name || !business || !email || !challenge) {
      return json(res, 400, { ok: false, error: 'Please complete all required fields.' });
    }

    if (!isValidEmail(email)) {
      return json(res, 400, { ok: false, error: 'Please enter a valid email address.' });
    }

    const scored = scoreOpportunity(priority, challenge);

    const companies = await supabaseRequest('companies', {
      method: 'POST',
      body: JSON.stringify({ name: business, website: website || null })
    });
    const company = companies[0];

    const leads = await supabaseRequest('leads', {
      method: 'POST',
      body: JSON.stringify({
        company_id: company.id,
        name,
        email,
        source: 'opportunity_review',
        status: 'new'
      })
    });
    const lead = leads[0];

    const reviews = await supabaseRequest('opportunity_reviews', {
      method: 'POST',
      body: JSON.stringify({
        lead_id: lead.id,
        company_id: company.id,
        priority,
        challenge,
        opportunity_score: scored.score,
        score_reasons: scored.reasons
      })
    });
    const review = reviews[0];

    await supabaseRequest('lead_activities', {
      method: 'POST',
      body: JSON.stringify({
        lead_id: lead.id,
        activity_type: 'opportunity_review_submitted',
        description: 'Technology Opportunity Review submitted from hutchgroupllc.com',
        metadata: { review_id: review.id, opportunity_score: scored.score }
      })
    });

    sendNotification({ lead, company, review }).catch((error) => {
      console.error('Lead notification error', error);
    });

    return json(res, 201, {
      ok: true,
      reviewId: review.id,
      message: 'Thanks. Your Technology Opportunity Review request is in.'
    });
  } catch (error) {
    console.error('Opportunity Review submission failed', error);

    if (String(error.message).includes('BACKEND_NOT_CONFIGURED')) {
      return json(res, 503, {
        ok: false,
        error: 'The review system is being connected right now. Please try again shortly.'
      });
    }

    return json(res, 500, {
      ok: false,
      error: 'We could not submit your review right now. Your form entries are still here, so please try again.'
    });
  }
}
