// Strictly per-device Real Player & Device Registry for Bus Fever Party.
// 1 physical device = 1 single entry (keyed by hardware device key: IP + OS Family + Screen Signature).
// Changing your name multiple times on the same device (via Download Portal or in-game Profile)
// ALWAYS overwrites that device's single entry with the LATEST new name (never duplicates old names!).

const deviceStore = global._bfpDeviceRegistryStoreV82 || (global._bfpDeviceRegistryStoreV82 = new Map());

function detectOsFamily(ua) {
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Mac';
  return 'Device';
}

function detectDeviceLabel(ua) {
  if (/Android/i.test(ua)) {
    const modelMatch = ua.match(/Android\s+[^;]+;\s*([^)]+)\)/i);
    let model = modelMatch ? modelMatch[1].replace(/Build\/.*$/i, '').replace(/;\s*wv$/i, '').trim() : '';
    if (model && model !== 'K' && model.length >= 2) {
      return `📱 Android (${model.slice(0, 18)})`;
    }
    return '📱 Android Device';
  }
  if (/iPhone|iPad|iPod/i.test(ua)) return '📱 iPhone / iOS';
  if (/Windows/i.test(ua)) return '💻 Windows PC';
  if (/Macintosh|Mac OS X/i.test(ua)) return '💻 Mac';
  return '📱 Mobile / Web';
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

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ua = req.headers['user-agent'] || '';
  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  const primaryKey = getHardwareDeviceKey(req, body);
  const fallbackKey = getHardwareFallbackKey(req);

  // Find existing entry for this physical device (migrate fallbackKey -> primaryKey if needed so 1 device = strictly 1 record)
  let existing = deviceStore.get(primaryKey) || deviceStore.get(fallbackKey) || null;
  if (existing && primaryKey !== fallbackKey && deviceStore.has(fallbackKey)) {
    deviceStore.delete(fallbackKey);
    deviceStore.set(primaryKey, existing);
  }

  if (req.method === 'POST') {
    const rawName = body && body.name ? String(body.name).trim().slice(0, 16) : '';
    const isPlaceholder = !rawName || rawName === 'player_60913' || rawName === 'Player';
    const incomingTs = Number(body.nameUpdatedAt) || Date.now();
    const incomingLvl = Math.max(1, Number(body.lvl) || (existing ? existing.lvl : 1) || 1);
    const incomingPass = Math.max(2800, Number(body.pass) || (existing ? existing.pass : 2800) || 2800);
    const detectedLabel = detectDeviceLabel(ua);
    const incomingLabel =
      detectedLabel.indexOf('(') !== -1
        ? detectedLabel
        : (body.deviceLabel ? String(body.deviceLabel).slice(0, 28) : detectedLabel);

    if (!existing) {
      existing = {
        deviceKey: primaryKey,
        name: isPlaceholder ? 'player_60913' : rawName,
        nameUpdatedAt: isPlaceholder ? 0 : incomingTs,
        lvl: incomingLvl,
        pass: incomingPass,
        deviceLabel: incomingLabel,
        updatedAt: Date.now()
      };
      deviceStore.set(primaryKey, existing);
    } else {
      existing.deviceKey = primaryKey;
      // Always overwrite with the user's latest non-placeholder name on this device!
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
        existing.lvl = Math.max(1, Number(body.lvl) || existing.lvl || 1);
        existing.pass = Math.max(2800, Number(body.pass) || existing.pass || 2800);
      }
      if (incomingLabel.indexOf('(') !== -1 || !existing.deviceLabel) {
        existing.deviceLabel = incomingLabel;
      }
      existing.updatedAt = Date.now();
      deviceStore.set(primaryKey, existing);
    }

    const devices = Array.from(deviceStore.values()).map((d) => ({
      deviceKey: d.deviceKey,
      name: d.name || 'Player',
      nameUpdatedAt: d.nameUpdatedAt || 0,
      lvl: d.lvl || 1,
      pass: d.pass || 2800,
      deviceLabel: d.deviceLabel || '📱 Device',
      isMyDevice: d.deviceKey === existing.deviceKey
    }));

    return res.status(200).json({
      ok: true,
      name: existing.name,
      myDevice: existing,
      devices
    });
  }

  // GET request: return current device's latest record + all registered real devices
  const devices = Array.from(deviceStore.values()).map((d) => ({
    deviceKey: d.deviceKey,
    name: d.name || 'Player',
    nameUpdatedAt: d.nameUpdatedAt || 0,
    lvl: d.lvl || 1,
    pass: d.pass || 2800,
    deviceLabel: d.deviceLabel || '📱 Device',
    isMyDevice: existing ? d.deviceKey === existing.deviceKey : false
  }));

  return res.status(200).json({
    ok: true,
    name: existing ? existing.name : '',
    myDevice: existing || null,
    devices
  });
};
