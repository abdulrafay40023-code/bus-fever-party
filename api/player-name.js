// Vercel Serverless Function to sync Player Name from Chrome Download Page -> Installed Android APK App (by client IP)
const nameStore = global._bfpNameStore || (global._bfpNameStore = new Map());

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const forwarded = req.headers['x-forwarded-for'] || '';
  const clientIp = (typeof forwarded === 'string' ? forwarded.split(',')[0] : '').trim() || req.socket?.remoteAddress || 'default';

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    const name = body && body.name ? String(body.name).trim().slice(0, 18) : '';
    if (name) {
      nameStore.set(clientIp, { name, ts: Date.now() });
      nameStore.set('latest', { name, ts: Date.now() });
    }
    return res.status(200).json({ ok: true, name });
  }

  const entry = nameStore.get(clientIp) || nameStore.get('latest') || null;
  return res.status(200).json({
    ok: true,
    name: entry ? entry.name : ''
  });
};
