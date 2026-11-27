// High-Concurrency, Secure Device & Account Database for Bus Rush Party (Guest, Google & Facebook Users).
// Strictly 1 entry per physical device (keyed by hardware device key: IP + OS Family + Screen Signature, or client deviceId).
// Changing player name or switching between Guest / Google / Facebook ALWAYS overwrites that device's single record with the LATEST name, avatar, rank, level, and passengers!

const deviceStore = global._bfpDeviceRegistryStoreV87 || (global._bfpDeviceRegistryStoreV87 = new Map());
// Migrate any existing entries from V82 store if present in warm container
if (global._bfpDeviceRegistryStoreV82 && deviceStore.size === 0) {
  for (const [k, v] of global._bfpDeviceRegistryStoreV82.entries()) {
    deviceStore.set(k, v);
  }
}

let cachedSortedList = null;
let cachedSortedAt = 0;

function sanitizeText(raw, maxLen = 16) {
  if (!raw) return '';
  return String(raw)
    .replace(/[<>"'`\\]/g, '')
    .trim()
    .slice(0, maxLen);
}

function detectOsFamily(ua) {
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Mac';
  return 'Device';
}

function getHardwareDeviceKey(req, body) {
  const forwarded = req.headers['x-forwarded-for'] || '';
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : '').trim() || req.socket?.remoteAddress || 'local';
  const ua = req.headers['user-agent'] || '';
  const osFamily = detectOsFamily(ua);
  const screenSig = body && body.screenSig ? String(body.screenSig).replace(/[^0-9x]/g, '').slice(0, 16) : '';
  return screenSig ? `${ip}__${osFamily}__${screenSig}` : `${ip}__${osFamily}`;
}

function getHardwareFallbackKey(req) {
  const forwarded = req.headers['x-forwarded-for'] || '';
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : '').trim() || req.socket?.remoteAddress || 'local';
  const ua = req.headers['user-agent'] || '';
  const osFamily = detectOsFamily(ua);
  return `${ip}__${osFamily}`;
}

function getSortedDevicesSnapshot() {
  const now = Date.now();
  if (cachedSortedList && now - cachedSortedAt < 400) {
    return cachedSortedList;
  }
  const all = Array.from(deviceStore.values());
  all.sort((a, b) => ((b.lvl || 1) !== (a.lvl || 1) ? (b.lvl || 1) - (a.lvl || 1) : (b.pass || 0) - (a.pass || 0)));
  // Cap response snapshot to Top 200 active players so payload stays ultra-fast even with millions of users
  cachedSortedList = all.slice(0, 200);
  cachedSortedAt = now;
  return cachedSortedList;
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  const primaryKey = getHardwareDeviceKey(req, body);
  const fallbackKey = getHardwareFallbackKey(req);

  // Locate existing record for this physical device (1 physical device = strictly 1 record)
  let existing = deviceStore.get(primaryKey) || deviceStore.get(fallbackKey) || null;
  if (existing && primaryKey !== fallbackKey && deviceStore.has(fallbackKey)) {
    deviceStore.delete(fallbackKey);
    deviceStore.set(primaryKey, existing);
  }

  if (req.method === 'POST') {
    const rawName = sanitizeText(body.name, 16);
    const isPlaceholder = !rawName || rawName === 'player_60913' || rawName === 'Player';
    const incomingTs = Number(body.nameUpdatedAt) || Date.now();
    const incomingLvl = Math.max(1, Math.min(5000, Number(body.lvl) || (existing ? existing.lvl : 1) || 1));
    const incomingPass = Math.max(2800, Number(body.pass) || (existing ? existing.pass : 2800) || 2800);
    const incomingCoins = Math.max(0, Number(body.coins) || (existing ? existing.coins : 250) || 250);
    const incomingAvatarId = sanitizeText(body.avatarId, 32) || (existing && existing.avatarId) || 'aviator_girl';
    const incomingProvider = ['guest', 'google', 'facebook'].includes(body.authProvider)
      ? body.authProvider
      : ((existing && existing.authProvider) || 'guest');
    const incomingEmail = sanitizeText(body.authEmail, 64) || (existing && existing.authEmail) || '';

    if (!existing) {
      // Prevent unbounded memory growth under extreme load (evict oldest entry if > 50,000 in-memory keys)
      if (deviceStore.size > 50000) {
        const oldestKey = deviceStore.keys().next().value;
        if (oldestKey) deviceStore.delete(oldestKey);
      }
      existing = {
        deviceKey: primaryKey,
        name: isPlaceholder ? 'player_60913' : rawName,
        nameUpdatedAt: isPlaceholder ? 0 : incomingTs,
        authProvider: incomingProvider,
        authEmail: incomingEmail,
        avatarId: incomingAvatarId,
        lvl: incomingLvl,
        pass: incomingPass,
        coins: incomingCoins,
        updatedAt: Date.now()
      };
      deviceStore.set(primaryKey, existing);
    } else {
      existing.deviceKey = primaryKey;
      if (!isPlaceholder) {
        if (
          body.fromPortal === true ||
          body.forceNameUpdate === true ||
          !existing.name ||
          existing.name === 'player_60913' ||
          incomingTs >= (existing.nameUpdatedAt || 0)
        ) {
          existing.name = rawName;
          existing.nameUpdatedAt = Math.max(incomingTs, Date.now());
        }
      }
      if (!body.fromPortal) {
        existing.lvl = Math.max(1, Math.min(5000, Number(body.lvl) || existing.lvl || 1));
        existing.pass = Math.max(2800, Number(body.pass) || existing.pass || 2800);
        existing.coins = Math.max(0, Number(body.coins) || existing.coins || 250);
      }
      if (incomingAvatarId) existing.avatarId = incomingAvatarId;
      if (incomingProvider) existing.authProvider = incomingProvider;
      if (incomingEmail) existing.authEmail = incomingEmail;
      existing.updatedAt = Date.now();
      deviceStore.set(primaryKey, existing);
    }
    cachedSortedList = null; // Invalidate sorted snapshot cache

    const topList = getSortedDevicesSnapshot();
    const devices = topList.map((d) => ({
      deviceKey: d.deviceKey,
      name: d.name || 'Player',
      nameUpdatedAt: d.nameUpdatedAt || 0,
      authProvider: d.authProvider || 'guest',
      avatarId: d.avatarId || 'aviator_girl',
      lvl: d.lvl || 1,
      pass: d.pass || 2800,
      isMyDevice: d.deviceKey === existing.deviceKey
    }));

    return res.status(200).json({
      ok: true,
      totalRegisteredDevices: deviceStore.size,
      name: existing.name,
      myDevice: existing,
      devices
    });
  }

  const topList = getSortedDevicesSnapshot();
  const devices = topList.map((d) => ({
    deviceKey: d.deviceKey,
    name: d.name || 'Player',
    nameUpdatedAt: d.nameUpdatedAt || 0,
    authProvider: d.authProvider || 'guest',
    avatarId: d.avatarId || 'aviator_girl',
    lvl: d.lvl || 1,
    pass: d.pass || 2800,
    isMyDevice: existing ? d.deviceKey === existing.deviceKey : false
  }));

  return res.status(200).json({
    ok: true,
    totalRegisteredDevices: deviceStore.size,
    name: existing ? existing.name : '',
    myDevice: existing || null,
    devices
  });
};
