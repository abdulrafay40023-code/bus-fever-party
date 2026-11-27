// High-Concurrency Player & Account Database for Bus Rush Party:
// 1. GMAIL ACCOUNTS (authProvider === 'google' + authEmail):
//    - Keyed by normalized Gmail address ('gmail__' + email.toLowerCase()).
//    - Stores the player's FULL ID (name, lvl, pass, coins, boosters, avatarId, claimedRanks, claimedMilestones).
//    - Logging in with the same Gmail on ANY other device (Phone, Tablet, or PC) immediately restores the player's full ID & progress!
// 2. GUEST ACCOUNTS (authProvider === 'guest'):
//    - Keyed strictly by physical device hardware signature (IP + OS Family + Screen Signature).
//    - Progress and name stay bound strictly to that single device (changing name overwrites that device's single entry).

const deviceStore = global._bfpDeviceRegistryStoreV89 || (global._bfpDeviceRegistryStoreV89 = new Map());
const gmailStore = global._bfpGmailAccountStoreV89 || (global._bfpGmailAccountStoreV89 = new Map());

if (global._bfpDeviceRegistryStoreV87 && deviceStore.size === 0) {
  for (const [k, v] of global._bfpDeviceRegistryStoreV87.entries()) {
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

function getCombinedLeaderboardSnapshot() {
  const now = Date.now();
  if (cachedSortedList && now - cachedSortedAt < 400) {
    return cachedSortedList;
  }
  const combinedMap = new Map();
  // 1. Add all Gmail accounts (keyed by gmailKey)
  for (const [gKey, acc] of gmailStore.entries()) {
    combinedMap.set(gKey, acc);
  }
  // 2. Add all Guest devices that haven't linked a Gmail account on that device
  for (const [dKey, dev] of deviceStore.entries()) {
    if (dev.linkedGmailKey && gmailStore.has(dev.linkedGmailKey)) {
      continue;
    }
    combinedMap.set(dKey, dev);
  }
  const all = Array.from(combinedMap.values());
  all.sort((a, b) => ((b.lvl || 1) !== (a.lvl || 1) ? (b.lvl || 1) - (a.lvl || 1) : (b.pass || 0) - (a.pass || 0)));
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

  let existingDev = deviceStore.get(primaryKey) || deviceStore.get(fallbackKey) || null;
  if (existingDev && primaryKey !== fallbackKey && deviceStore.has(fallbackKey)) {
    deviceStore.delete(fallbackKey);
    deviceStore.set(primaryKey, existingDev);
  }

  if (req.method === 'POST') {
    const rawName = sanitizeText(body.name, 16);
    const isPlaceholder = !rawName || rawName === 'player_60913' || rawName === 'Player';
    const incomingTs = Number(body.nameUpdatedAt) || Date.now();
    const incomingLvl = Math.max(1, Math.min(5000, Number(body.lvl) || 1));
    const incomingPass = Math.max(2800, Number(body.pass) || 2800);
    const incomingCoins = Math.max(0, Number(body.coins) || 250);
    const incomingAvatarId = sanitizeText(body.avatarId, 32) || 'cool_hoodie';
    const incomingProvider = body.authProvider === 'google' ? 'google' : 'guest';
    const cleanEmail = sanitizeText(body.authEmail, 64).toLowerCase();
    const gmailKey = (incomingProvider === 'google' && cleanEmail && cleanEmail.includes('@'))
      ? `gmail__${cleanEmail}`
      : null;

    let activeRecord = null;
    let restoredFromGmail = false;

    if (gmailKey) {
      // --- CROSS-DEVICE GMAIL ACCOUNT SYNC ---
      let gAcc = gmailStore.get(gmailKey) || null;
      if (!gAcc) {
        if (gmailStore.size > 50000) {
          const oldest = gmailStore.keys().next().value;
          if (oldest) gmailStore.delete(oldest);
        }
        // First time this Gmail is registered: seed from current device's progress
        const seedLvl = existingDev ? Math.max(incomingLvl, existingDev.lvl || 1) : incomingLvl;
        const seedPass = existingDev ? Math.max(incomingPass, existingDev.pass || 2800) : incomingPass;
        const seedCoins = existingDev ? Math.max(incomingCoins, existingDev.coins || 250) : incomingCoins;
        gAcc = {
          deviceKey: gmailKey,
          name: isPlaceholder ? (existingDev && existingDev.name ? existingDev.name : cleanEmail.split('@')[0].slice(0, 16)) : rawName,
          nameUpdatedAt: incomingTs,
          authProvider: 'google',
          authEmail: cleanEmail,
          avatarId: incomingAvatarId,
          lvl: seedLvl,
          pass: seedPass,
          coins: seedCoins,
          boosters: (body.boosters && typeof body.boosters === 'object') ? body.boosters : { vip: 1, shuffle: 2, magnet: 2 },
          claimedRanks: (body.claimedRanks && typeof body.claimedRanks === 'object') ? body.claimedRanks : { bronze: true },
          claimedMilestones: (body.claimedMilestones && typeof body.claimedMilestones === 'object') ? body.claimedMilestones : {},
          updatedAt: Date.now()
        };
        gmailStore.set(gmailKey, gAcc);
      } else {
        // Existing Gmail account found!
        // If user just signed in with Gmail on another device (isGmailLogin === true) OR cloud Gmail account has higher level/progress,
        // return the cloud Gmail account so the device loads their full saved ID!
        if (body.isGmailLogin === true || (gAcc.lvl || 1) > incomingLvl) {
          restoredFromGmail = true;
          if (!isPlaceholder && body.forceNameUpdate === true) {
            gAcc.name = rawName;
            gAcc.nameUpdatedAt = Date.now();
          }
          // Merge highest progress so nothing is ever lost
          if (incomingLvl > (gAcc.lvl || 1)) {
            gAcc.lvl = incomingLvl;
            gAcc.pass = Math.max(gAcc.pass || 2800, incomingPass);
            gAcc.coins = Math.max(gAcc.coins || 250, incomingCoins);
          }
        } else {
          // Normal gameplay save from an already logged-in Gmail device -> update cloud Gmail account
          if (!isPlaceholder && (body.forceNameUpdate || incomingTs >= (gAcc.nameUpdatedAt || 0))) {
            gAcc.name = rawName;
            gAcc.nameUpdatedAt = Math.max(incomingTs, Date.now());
          }
          gAcc.lvl = Math.max(gAcc.lvl || 1, incomingLvl);
          gAcc.pass = Math.max(gAcc.pass || 2800, incomingPass);
          gAcc.coins = incomingCoins;
          if (incomingAvatarId) gAcc.avatarId = incomingAvatarId;
          if (body.boosters && typeof body.boosters === 'object') gAcc.boosters = body.boosters;
          if (body.claimedRanks && typeof body.claimedRanks === 'object') gAcc.claimedRanks = body.claimedRanks;
          if (body.claimedMilestones && typeof body.claimedMilestones === 'object') gAcc.claimedMilestones = body.claimedMilestones;
        }
        gAcc.updatedAt = Date.now();
        gmailStore.set(gmailKey, gAcc);
      }

      // Link this physical device to the Gmail key so it doesn't show a duplicate Guest row
      if (existingDev) {
        existingDev.linkedGmailKey = gmailKey;
        deviceStore.set(primaryKey, existingDev);
      } else {
        deviceStore.set(primaryKey, {
          deviceKey: primaryKey,
          linkedGmailKey: gmailKey,
          name: gAcc.name,
          lvl: gAcc.lvl,
          pass: gAcc.pass,
          updatedAt: Date.now()
        });
      }
      activeRecord = gAcc;
    } else {
      // --- DEVICE-ONLY GUEST ACCOUNT ---
      if (!existingDev) {
        if (deviceStore.size > 50000) {
          const oldestKey = deviceStore.keys().next().value;
          if (oldestKey) deviceStore.delete(oldestKey);
        }
        existingDev = {
          deviceKey: primaryKey,
          linkedGmailKey: null,
          name: isPlaceholder ? 'player_60913' : rawName,
          nameUpdatedAt: isPlaceholder ? 0 : incomingTs,
          authProvider: 'guest',
          authEmail: '',
          avatarId: incomingAvatarId,
          lvl: incomingLvl,
          pass: incomingPass,
          coins: incomingCoins,
          updatedAt: Date.now()
        };
        deviceStore.set(primaryKey, existingDev);
      } else {
        existingDev.deviceKey = primaryKey;
        existingDev.linkedGmailKey = null;
        existingDev.authProvider = 'guest';
        existingDev.authEmail = '';
        if (!isPlaceholder) {
          if (
            body.forceNameUpdate === true ||
            !existingDev.name ||
            existingDev.name === 'player_60913' ||
            incomingTs >= (existingDev.nameUpdatedAt || 0)
          ) {
            existingDev.name = rawName;
            existingDev.nameUpdatedAt = Math.max(incomingTs, Date.now());
          }
        }
        existingDev.lvl = incomingLvl;
        existingDev.pass = incomingPass;
        existingDev.coins = incomingCoins;
        if (incomingAvatarId) existingDev.avatarId = incomingAvatarId;
        existingDev.updatedAt = Date.now();
        deviceStore.set(primaryKey, existingDev);
      }
      activeRecord = existingDev;
    }

    cachedSortedList = null;
    const topList = getCombinedLeaderboardSnapshot();
    const devices = topList.map((d) => ({
      deviceKey: d.deviceKey,
      name: d.name || 'Player',
      nameUpdatedAt: d.nameUpdatedAt || 0,
      authProvider: d.authProvider || 'guest',
      avatarId: d.avatarId || 'cool_hoodie',
      lvl: d.lvl || 1,
      pass: d.pass || 2800,
      isMyDevice: d.deviceKey === activeRecord.deviceKey
    }));

    return res.status(200).json({
      ok: true,
      restoredFromGmail,
      name: activeRecord.name,
      myDevice: activeRecord,
      devices
    });
  }

  // GET request
  let myRec = existingDev;
  if (existingDev && existingDev.linkedGmailKey && gmailStore.has(existingDev.linkedGmailKey)) {
    myRec = gmailStore.get(existingDev.linkedGmailKey);
  }
  const topList = getCombinedLeaderboardSnapshot();
  const devices = topList.map((d) => ({
    deviceKey: d.deviceKey,
    name: d.name || 'Player',
    nameUpdatedAt: d.nameUpdatedAt || 0,
    authProvider: d.authProvider || 'guest',
    avatarId: d.avatarId || 'cool_hoodie',
    lvl: d.lvl || 1,
    pass: d.pass || 2800,
    isMyDevice: myRec ? d.deviceKey === myRec.deviceKey : false
  }));

  return res.status(200).json({
    ok: true,
    name: myRec ? myRec.name : '',
    myDevice: myRec || null,
    devices
  });
};
