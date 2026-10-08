const utf8 = new TextEncoder();
const allowedStatuses = new Set(['noua', 'in_lucru', 'ofertata', 'castigata', 'inchisa']);

function originAllowed(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean);
  return allowed.includes(origin);
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean);
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
  if (origin && allowed.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function respond(request, env, payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(request, env),
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function decodeBase64Url(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function encodeBase64Url(value) {
  const bytes = typeof value === 'string' ? utf8.encode(value) : new Uint8Array(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', utf8.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function sign(secret, value) {
  const key = await hmacKey(secret);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, value));
}

async function secureEqual(left, right) {
  const leftBytes = utf8.encode(left);
  const rightBytes = utf8.encode(right);
  if (leftBytes.length !== rightBytes.length) return false;
  let mismatch = 0;
  for (let index = 0; index < leftBytes.length; index += 1) mismatch |= leftBytes[index] ^ rightBytes[index];
  return mismatch === 0;
}

async function issueToken(secret) {
  const payload = encodeBase64Url(JSON.stringify({ sub: 'admin', exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60 }));
  const signature = encodeBase64Url(await sign(secret, utf8.encode(payload)));
  return `${payload}.${signature}`;
}

async function isAuthenticated(request, env) {
  if (!env.SESSION_SECRET) return false;
  const authorization = request.headers.get('Authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  try {
    const key = await hmacKey(env.SESSION_SECRET);
    const valid = await crypto.subtle.verify('HMAC', key, decodeBase64Url(signature), utf8.encode(payload));
    if (!valid) return false;
    const claims = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload)));
    return claims.sub === 'admin' && Number.isFinite(claims.exp) && claims.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

async function hashRateLimitKey(secret, category, ip) {
  const key = await hmacKey(secret);
  return encodeBase64Url(await crypto.subtle.sign('HMAC', key, utf8.encode(`${category}:${ip || 'unknown'}`)));
}

async function takeRateLimit(env, keyHash, maximum, windowSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const result = await env.DB.prepare(`
    INSERT INTO rate_limits (key_hash, window_start, attempts)
    VALUES (?1, ?2, 1)
    ON CONFLICT(key_hash) DO UPDATE SET
      attempts = CASE WHEN rate_limits.window_start <= ?3 THEN 1 ELSE rate_limits.attempts + 1 END,
      window_start = CASE WHEN rate_limits.window_start <= ?3 THEN excluded.window_start ELSE rate_limits.window_start END
    RETURNING attempts
  `).bind(keyHash, now, now - windowSeconds).first();
  return Number(result?.attempts ?? maximum + 1) <= maximum;
}

async function clearRateLimit(env, keyHash) {
  await env.DB.prepare('DELETE FROM rate_limits WHERE key_hash = ?1').bind(keyHash).run();
}

async function readJson(request) {
  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > 30_000) throw new HttpError(413, 'Cererea este prea mare.');
  const body = await request.text();
  if (utf8.encode(body).length > 30_000) throw new HttpError(413, 'Cererea este prea mare.');
  let value;
  try {
    value = JSON.parse(body);
  } catch {
    throw new HttpError(400, 'Datele trimise nu sunt valide.');
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError(400, 'Datele trimise nu sunt valide.');
  return value;
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function textField(input, field, maximum, required = true) {
  const raw = input[field];
  const value = typeof raw === 'string' ? raw.trim().replace(/[\u0000-\u001f\u007f]/g, '') : '';
  if ((required && value.length < 2) || value.length > maximum) throw new HttpError(422, 'Verifică datele completate și încearcă din nou.');
  return value;
}

function numberField(input, field, minimum, maximum, integer = false) {
  const value = Number(input[field]);
  if (!Number.isFinite(value) || value < minimum || value > maximum || (integer && !Number.isInteger(value))) {
    throw new HttpError(422, 'Verifică datele completate și încearcă din nou.');
  }
  return value;
}

function validateOrder(input) {
  const order = {
    companyName: textField(input, 'companyName', 160),
    contactPerson: textField(input, 'contactPerson', 160),
    email: textField(input, 'email', 254),
    phoneCountryCode: textField(input, 'phoneCountryCode', 8),
    phoneNumber: textField(input, 'phoneNumber', 32),
    country: textField(input, 'country', 100),
    destinationPort: textField(input, 'destinationPort', 160),
    transportType: textField(input, 'transportType', 32),
    incoterm: textField(input, 'incoterm', 3),
    volumeContainers: numberField(input, 'volumeContainers', 1, 10000, true),
    approxVolumeM3: numberField(input, 'approxVolumeM3', 1, 250000),
    grade: textField(input, 'grade', 32),
    thickness: numberField(input, 'thickness', 10, 300, true),
    width: numberField(input, 'width', 50, 500, true),
    length: numberField(input, 'length', 1, 20),
    moisture: textField(input, 'moisture', 20),
    specialRequirements: textField(input, 'specialRequirements', 5000, false),
    currency: textField(input, 'currency', 3),
    deliveryTimeline: textField(input, 'deliveryTimeline', 200),
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)) throw new HttpError(422, 'Adresa de email nu este validă.');
  const phone = `${order.phoneCountryCode}${order.phoneNumber}`.replace(/[\s().-]/g, '');
  if (!/^\+?\d{7,24}$/.test(phone)) throw new HttpError(422, 'Numărul de telefon nu este valid.');
  if (!['container_40hc', 'mega_truck_136'].includes(order.transportType)
    || !['FOB', 'CIF', 'CFR', 'DAP'].includes(order.incoterm)
    || !['EN1611_CLASS_A', 'EN1611_CLASS_AB', 'EN1611_CLASS_BC'].includes(order.grade)
    || !['kd_18', 'fresh_cut'].includes(order.moisture)
    || !['EUR', 'USD'].includes(order.currency)) {
    throw new HttpError(422, 'O parte din opțiunile selectate nu este validă.');
  }

  if (input.treatments !== undefined && !Array.isArray(input.treatments)) throw new HttpError(422, 'Tratamentele selectate nu sunt valide.');
  const treatments = (Array.isArray(input.treatments) ? input.treatments : []).filter((value) => typeof value === 'string');
  if (treatments.length > 20) throw new HttpError(422, 'Numărul de tratamente selectate nu este valid.');
  order.treatments = [...new Set(treatments.map((value) => value.trim().replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 120)))];
  return order;
}

function isConfigured(env) {
  return Boolean(env.ADMIN_PASSWORD?.length >= 16 && env.SESSION_SECRET?.length >= 32 && env.DB);
}

async function login(request, env) {
  if (!isConfigured(env)) return respond(request, env, { status: 'success', authenticated: false, setupRequired: true });
  const input = await readJson(request);
  const limitKey = await hashRateLimitKey(env.SESSION_SECRET, 'login', request.headers.get('CF-Connecting-IP'));
  if (!(await takeRateLimit(env, limitKey, 5, 15 * 60))) return respond(request, env, { status: 'error', message: 'Prea multe încercări. Încearcă din nou peste 15 minute.' }, 429);
  if (!(await secureEqual(String(input.password || ''), env.ADMIN_PASSWORD))) {
    return respond(request, env, { status: 'error', message: 'Parola nu este corectă.' }, 401);
  }
  await clearRateLimit(env, limitKey);
  return respond(request, env, { status: 'success', token: await issueToken(env.SESSION_SECRET) });
}

async function submitOrder(request, env) {
  if (!isConfigured(env)) return respond(request, env, { status: 'error', message: 'Formularul nu este disponibil momentan. Încearcă din nou mai târziu.' }, 503);
  const input = await readJson(request);
  if (typeof input.website_hp === 'string' && input.website_hp.trim()) {
    return respond(request, env, { status: 'error', message: 'Cererea nu a putut fi validată.' }, 400);
  }
  const ipHash = await hashRateLimitKey(env.SESSION_SECRET, 'submit', request.headers.get('CF-Connecting-IP'));
  if (!(await takeRateLimit(env, ipHash, 5, 15 * 60))) return respond(request, env, { status: 'error', message: 'Ai trimis mai multe cereri într-un timp scurt. Încearcă din nou mai târziu.' }, 429);
  const now = new Date().toISOString();
  const id = `HE-RFQ-${now.slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID().slice(0, 10).toUpperCase()}`;
  const order = {
    id,
    createdAt: now,
    updatedAt: now,
    ...validateOrder(input),
    status: 'noua',
    adminNotes: '',
  };
  await env.DB.prepare('INSERT INTO orders (id, created_at, status, payload_json) VALUES (?1, ?2, ?3, ?4)')
    .bind(order.id, order.createdAt, order.status, JSON.stringify(order)).run();
  return respond(request, env, { status: 'success', order, message: 'Solicitarea a fost înregistrată cu succes.' }, 201);
}

async function listOrders(request, env) {
  const authenticated = await isAuthenticated(request, env);
  if (!authenticated) return respond(request, env, { status: 'error', message: 'Sesiunea a expirat. Autentifică-te din nou.' }, 401);
  const { results = [] } = await env.DB.prepare('SELECT payload_json FROM orders ORDER BY created_at DESC LIMIT 500').all();
  return respond(request, env, { status: 'success', orders: results.map((row) => JSON.parse(row.payload_json)) });
}

async function updateOrder(request, env, id) {
  const authenticated = await isAuthenticated(request, env);
  if (!authenticated) return respond(request, env, { status: 'error', message: 'Sesiunea a expirat. Autentifică-te din nou.' }, 401);
  const input = await readJson(request);
  if (!allowedStatuses.has(input.status) || typeof input.adminNotes !== 'string' || input.adminNotes.length > 5000) {
    return respond(request, env, { status: 'error', message: 'Verifică statusul și notițele înainte de salvare.' }, 422);
  }
  const existing = await env.DB.prepare('SELECT payload_json FROM orders WHERE id = ?1').bind(id).first();
  if (!existing) return respond(request, env, { status: 'error', message: 'Cererea nu mai există.' }, 404);
  const order = { ...JSON.parse(existing.payload_json), status: input.status, adminNotes: input.adminNotes.trim(), updatedAt: new Date().toISOString() };
  await env.DB.prepare('UPDATE orders SET status = ?1, payload_json = ?2 WHERE id = ?3').bind(order.status, JSON.stringify(order), id).run();
  return respond(request, env, { status: 'success', order });
}

export default {
  async fetch(request, env) {
    if (!originAllowed(request, env)) return new Response('Origin not allowed', { status: 403, headers: { Vary: 'Origin' } });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    try {
      if (path === '/api/health' && request.method === 'GET') return respond(request, env, { status: 'success' });
      if (path === '/api/auth/status' && request.method === 'GET') {
        return respond(request, env, { status: 'success', setupRequired: !isConfigured(env) });
      }
      if (path === '/api/auth/login' && request.method === 'POST') return await login(request, env);
      if (path === '/api/auth/me' && request.method === 'GET') {
        const authenticated = await isAuthenticated(request, env);
        return respond(request, env, { status: 'success', authenticated }, authenticated ? 200 : 401);
      }
      if (path === '/api/orders' && request.method === 'POST') return await submitOrder(request, env);
      if (path === '/api/orders' && request.method === 'GET') return await listOrders(request, env);
      const orderMatch = path.match(/^\/api\/orders\/([^/]+)$/);
      if (orderMatch && request.method === 'PATCH') return await updateOrder(request, env, decodeURIComponent(orderMatch[1]));
      return respond(request, env, { status: 'error', message: 'Endpointul solicitat nu există.' }, 404);
    } catch (error) {
      if (error instanceof HttpError) return respond(request, env, { status: 'error', message: error.message }, error.status);
      console.error('Holz Expert API error', error instanceof Error ? error.message : 'unknown');
      return respond(request, env, { status: 'error', message: 'Solicitarea nu a putut fi finalizată. Încearcă din nou.' }, 500);
    }
  },
};
