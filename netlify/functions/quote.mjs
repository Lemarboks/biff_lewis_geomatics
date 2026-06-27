const requiredFields = {
  fname: 'Full Name',
  phone: 'Phone Number',
  email: 'Email Address',
  survey_type: 'Type of Survey Required',
};

const allowedSurveyTypes = new Set([
  'Boundary / Property Survey',
  'Building Depiction',
  'Topographic Survey',
  'Construction Setting Out',
  'As-Built Survey',
  'CAD Drawing / 3D Model',
  'Land Subdivision',
  'Land Development Survey',
  'Asset / Infrastructure Mapping',
  "I'm not sure - please advise",
  "I'm not sure — please advise",
]);

const fieldLabels = {
  fname: 'Full Name',
  company: 'Company / Organisation',
  phone: 'Phone Number',
  email: 'Email Address',
  property_address: 'Property / Site Address or Location',
  survey_type: 'Type of Survey Required',
  timeline: 'Preferred Timeline',
  message: 'Project Description / Additional Details',
  how_heard: 'How did you hear about us?',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

function normalize(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validate(data) {
  const errors = [];

  for (const [field, label] of Object.entries(requiredFields)) {
    if (!normalize(data[field])) errors.push(`${label} is required.`);
  }

  const email = normalize(data.email);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email Address must be valid.');
  }

  const surveyType = normalize(data.survey_type);
  if (surveyType && !allowedSurveyTypes.has(surveyType)) {
    errors.push('Type of Survey Required is invalid.');
  }

  return errors;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function emailText(data) {
  return Object.entries(fieldLabels)
    .map(([field, label]) => `${label}: ${normalize(data[field]) || 'Not supplied'}`)
    .join('\n');
}

function emailHtml(data) {
  const rows = Object.entries(fieldLabels)
    .map(([field, label]) => {
      const value = normalize(data[field]) || 'Not supplied';
      return `<tr><th align="left" style="padding:6px 12px 6px 0;">${escapeHtml(label)}</th><td style="padding:6px 0;">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`;
    })
    .join('');

  return `<h2>New survey quote request</h2><table>${rows}</table>`;
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, message: 'Method not allowed.' });
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, message: 'Invalid request body.' });
  }

  if (normalize(data.website)) {
    return json(200, { ok: true });
  }

  const errors = validate(data);
  if (errors.length > 0) {
    return json(422, {
      ok: false,
      message: 'Please correct the highlighted fields and try again.',
      errors,
    });
  }

  const { RESEND_API_KEY, QUOTE_REQUEST_TO, QUOTE_REQUEST_FROM } = process.env;
  if (!RESEND_API_KEY || !QUOTE_REQUEST_TO || !QUOTE_REQUEST_FROM) {
    return json(500, {
      ok: false,
      message: 'Quote form email delivery is not configured.',
    });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: QUOTE_REQUEST_FROM,
      to: [QUOTE_REQUEST_TO],
      reply_to: normalize(data.email),
      subject: `Survey quote request from ${normalize(data.fname)}`,
      text: emailText(data),
      html: emailHtml(data),
    }),
  });

  if (!res.ok) {
    return json(502, {
      ok: false,
      message: 'Quote request could not be sent. Please call or WhatsApp us directly.',
    });
  }

  return json(200, { ok: true });
}
