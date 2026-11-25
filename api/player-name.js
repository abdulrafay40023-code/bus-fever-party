// Strictly per-device (IP + Phone Model) short-lived name handoff from Download Page -> Installed APK on the SAME phone only.
// NO global fallback ('latest' is never stored), so another person's phone NEVER gets someone else's name!
const nameStore = global._bfpDeviceNameStore || (global._bfpDeviceNameStore = new Map());

function getDeviceKey(req) {
  const forwarded = req.headers['x-forwarded-for'] || '';
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : '').trim() || req.socket?.remoteAddress || 'unknown';
  const ua = req.headers['user-agent'] || '';
  // Extract Android device model from User-Agent (e.g. "SM-S918B", "Redmi Note 12", "Pixel 7") so even two phones on same Wi-Fi stay separate!
  const modelMatch = ua.match(/Android\s+[^;]+;\s*([^)]+)\)/i);
  const deviceModel = modelMatch ? modelMatch[1].replace(/Build\/.*$/i, '').trim() : ua.slice(0, 40);
  return `${ip}__${deviceModel}`;
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const key = getDeviceKey(req);

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    const name = body && body.name ? String(body.name).trim().slice(0, 18) : '';
    if (name) {
      nameStore.set(key, { name, ts: Date.now() });
    }
    return res.status(200).json({ ok: true, name });
  }

  const entry = nameStore.get(key);
  // Expire after 10 minutes and only return for the exact same IP + Phone Model
  if (entry && Date.now() - entry.ts < 10 * 60 * 1000) {
    return res.status(200).json({ ok: true, name: entry.name });
  }
  return res.status(200).json({ ok: true, name: '' });
};
