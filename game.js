/**
 * BUS FEVER PARTY! 3D - Complete Game Engine (v3 - Exact Video Mechanics Edition)
 * Features:
 * 1. Opening Studio Splash ("Novaria" with glowing star) + "BUS FEVER PARTY" Castle Loading Bar (0% -> 100%)
 * 2. Continuously Revolving Central Oval Passenger Ring + Dual Left/Right Feeder Tracks + "GO!" Gates
 * 3. 3D Exhaust Smoke Trails, Slot Confetti Bursts, Passenger Emoji Bubbles & "No spots available" Banner
 * 4. "Having Fun?" Rating Popup & "GREAT JOB!" Fireworks Win Screen
 * 5. 100 Distinct, Progressively Harder Solvable Levels (including Exact Video Level 3!)
 * 6. Full Mid-Level & Campaign Auto-Save System
 */

(function () {
  'use strict';

  const SAVE_KEY = 'BUS_FEVER_PARTY_SAVE_V4';
  const RING_SLOT_COUNT = 32; // 32 tightly-packed radial rows of 4 passengers revolving around the central loop
  const ROW_PASSENGERS = 4;   // 4 plump 3D pawns side-by-side per row

  const COLORS = {
    yellow: {
      id: 'yellow',
      name: 'Yellow',
      hex: 0xe59e00,
      darkHex: 0xa16207,
      css: '#e59e00',
      borderCss: '#fef08a',
      textCss: '#1c1917'
    },
    blue: {
      id: 'blue',
      name: 'Blue',
      hex: 0x1565d8,
      darkHex: 0x0f3f8c,
      css: '#1565d8',
      borderCss: '#93c5fd',
      textCss: '#ffffff'
    },
    red: {
      id: 'red',
      name: 'Red',
      hex: 0xd92323,
      darkHex: 0x881313,
      css: '#d92323',
      borderCss: '#fca5a5',
      textCss: '#ffffff'
    },
    green: {
      id: 'green',
      name: 'Green',
      hex: 0x18a82b,
      darkHex: 0x0f691b,
      css: '#18a82b',
      borderCss: '#86efac',
      textCss: '#ffffff'
    },
    purple: {
      id: 'purple',
      name: 'Purple',
      hex: 0x7e22ce,
      darkHex: 0x4c1d95,
      css: '#7e22ce',
      borderCss: '#d8b4fe',
      textCss: '#ffffff'
    },
    brown: {
      id: 'brown',
      name: 'Brown',
      hex: 0x78350f,
      darkHex: 0x451a03,
      css: '#78350f',
      borderCss: '#d6a889',
      textCss: '#ffffff'
    },
    cyan: {
      id: 'cyan',
      name: 'Cyan',
      hex: 0x0284c7,
      darkHex: 0x075985,
      css: '#0284c7',
      borderCss: '#a5f3fc',
      textCss: '#ffffff'
    },
    orange: {
      id: 'orange',
      name: 'Orange',
      hex: 0xea580c,
      darkHex: 0x9a3412,
      css: '#ea580c',
      borderCss: '#fdba74',
      textCss: '#ffffff'
    },
    pink: {
      id: 'pink',
      name: 'Pink',
      hex: 0xdb2777,
      darkHex: 0x831843,
      css: '#db2777',
      borderCss: '#fda4af',
      textCss: '#ffffff'
    }
  };
  const ALL_COLOR_KEYS = Object.keys(COLORS);

  // =========================================================================
  // 7 COMPETITIVE RANK TIERS (BRONZE -> ACE LEVEL 5000) & CUSTOM 3D EMBLEMS
  // =========================================================================
  const RANK_TIERS = [
    {
      id: 'bronze',
      name: 'Bronze',
      icon: '🥉',
      atlasIdx: 0,
      imgSrc: 'rank_bronze.png?v=67',
      minLvl: 1,
      maxLvl: 24,
      color: '#d97706',
      coinsPrize: 0,
      vipPrize: 0,
      shufflePrize: 0,
      magnetPrize: 0,
      prizeLabel: 'Starter Rank'
    },
    {
      id: 'silver',
      name: 'Silver',
      icon: '🥈',
      atlasIdx: 1,
      imgSrc: 'rank_silver.png?v=67',
      minLvl: 25,
      maxLvl: 74,
      color: '#94a3b8',
      coinsPrize: 300,
      vipPrize: 1,
      shufflePrize: 1,
      magnetPrize: 0,
      prizeLabel: '+300 $ • +1 🚁 • +1 🔀'
    },
    {
      id: 'gold',
      name: 'Gold',
      icon: '🥇',
      atlasIdx: 2,
      imgSrc: 'rank_gold.png?v=67',
      minLvl: 75,
      maxLvl: 199,
      color: '#f59e0b',
      coinsPrize: 750,
      vipPrize: 2,
      shufflePrize: 2,
      magnetPrize: 1,
      prizeLabel: '+750 $ • +2 🚁 • +2 🔀 • +1 🧲'
    },
    {
      id: 'platinum',
      name: 'Platinum',
      icon: '💠',
      atlasIdx: 3,
      imgSrc: 'rank_platinum.png?v=67',
      minLvl: 200,
      maxLvl: 499,
      color: '#06b6d4',
      coinsPrize: 1500,
      vipPrize: 3,
      shufflePrize: 3,
      magnetPrize: 3,
      prizeLabel: '+1,500 $ • +3 All Boosters'
    },
    {
      id: 'diamond',
      name: 'Diamond',
      icon: '💎',
      atlasIdx: 4,
      imgSrc: 'rank_diamond.png?v=67',
      minLvl: 500,
      maxLvl: 1499,
      color: '#3b82f6',
      coinsPrize: 3500,
      vipPrize: 5,
      shufflePrize: 5,
      magnetPrize: 5,
      prizeLabel: '+3,500 $ • +5 All Boosters'
    },
    {
      id: 'crown',
      name: 'Crown',
      icon: '👑',
      atlasIdx: 5,
      imgSrc: 'rank_crown.png?v=67',
      minLvl: 1500,
      maxLvl: 4999,
      color: '#a855f7',
      coinsPrize: 8000,
      vipPrize: 10,
      shufflePrize: 10,
      magnetPrize: 10,
      prizeLabel: '+8,000 $ • +10 All Boosters'
    },
    {
      id: 'ace',
      name: 'Ace Legend',
      icon: '🔥',
      atlasIdx: 6,
      imgSrc: 'rank_ace.png?v=67',
      minLvl: 5000,
      maxLvl: 99999,
      color: '#ef4444',
      coinsPrize: 50000,
      vipPrize: 50,
      shufflePrize: 50,
      magnetPrize: 50,
      prizeLabel: 'JACKPOT: +50,000 $ & +50 All Boosters!'
    }
  ];

  const getRankEmblemHtml = (rankOrId, sizePx = 28) => {
    const id = typeof rankOrId === 'string' ? rankOrId : ((rankOrId && rankOrId.id) || 'bronze');
    return `<span class="rank-3d-emblem rank-emblem-${id}" style="width:${sizePx}px;height:${sizePx}px;" title="${id.toUpperCase()}"></span>`;
  };

  // =========================================================================
  // 100 CUSTOM CHARACTER PROFILE PICTURES (UNLOCKING STRICTLY EVERY 50 LEVELS:
  // Lv. 50, 100, 150, 200, ..., 5000) + 2 STARTER LV.1 AVATARS!
  // =========================================================================
  const CHARACTER_100_NAMES = [
    'Cool Striker', 'Bubblegum DJ', 'Apex Racer', 'Crimson Ninja', 'Frost Queen',
    'Galaxy Pilot', 'Sakura Ronin', 'Royal Lion', 'Cyber Visor', 'Solar Phoenix',
    'White Wolf Ninja', 'Desert Aviator', 'Shogun Demon', 'Arcane Mage', 'Sunset Rider',
    'Valkyrie Empress', 'Moonlight Wolf', 'Shadow Assassin', 'Celestial Paladin', 'Inferno Dragon',
    'Neon Hacker', 'Blossom Geisha', 'Poseidon King', 'Night Phantom', 'Cosmic Explorer',
    'Spartan Commander', 'Panther Knight', 'Golden Seraph', 'LavaTitan', 'White Wyvern',
    'Steampunk Scout', 'Cyber Valkyrie', 'Forest Ranger', 'Pirate Captain', 'DJ Panda',
    'Blood Moon Ronin', 'Light Priestess', 'Armored Direwolf', 'Clockwork Genius', 'Void Warlock',
    'Ice Crown Princess', 'Grizzled Viking', 'Neon Specter', 'Oni Samurai', 'Neko Streamer',
    'Time Gentleman', 'Mecha Striker', 'Nature Druid', 'Lich Overlord', 'Golden Phoenix',
    'Silver Blade', 'Starlight Witch', 'Paladin Champion', 'White Tiger', 'Synthwave Ace',
    'Desert Mystic', 'Crimson Valkyrie', 'Rune Archmage', 'Corsair Legend', 'Thunder Dragon',
    'Starlight Fox', 'Wasteland Raider', 'Popstar Idol', 'Golden Lionheart', 'Nebula Voyager',
    'Emerald Archer', 'Glacier Queen', 'Magma Drake', 'Cherry Samurai', 'Archangel Light',
    'Sky Aviator Girl', 'Cybernetic Wolf', 'Solar Monk', 'Bamboo Panda', 'Buccaneer King',
    'Dawn Goddess', 'Blood Knight', 'Helper Bot', 'Masked Shinobi', 'Spirit Stag',
    'Frost Lich King', 'Kitsune Shrine', 'Astral Hood', 'Titanium Mecha', 'Flora Empress',
    'Roaring White Lion', 'Plague Alchemist', 'Kraken Sorcerer', 'Golem Guardian', 'Dark Angel',
    'Blood Moon Shinobi', 'Rune Shadow', 'Earth Orbit Pilot', 'Hellfire Wyrm', 'Sun Halo Goddess',
    'Moonlight Samurai', 'Void Direwolf', 'World Tree Spirit', 'Diamond Ice King', 'Supreme Dragon Lord'
  ];

  const PROFILE_AVATARS = [
    { id: 'aviator_girl', name: 'Aviator Driver', unlockLvl: 1, type: 'img', src: 'home_avatar_3d.png?v=50' },
    { id: 'girl_redcap', name: 'Party Girl', unlockLvl: 1, type: 'img', src: 'win_girl_clean_3d.png?v=63' },
    ...Array.from({ length: 100 }, (_, idx) => {
      const unlockLvl = (idx + 1) * 50; // Strictly every 50 levels: 50, 100, 150, ..., 5000
      return {
        id: `char_lv_${unlockLvl}`,
        name: CHARACTER_100_NAMES[idx] || `Hero Lv.${unlockLvl}`,
        unlockLvl,
        type: 'atlas100',
        atlasIdx: idx,
        atlasCol: idx % 10,
        atlasRow: Math.floor(idx / 10)
      };
    })
  ];

  const getAvatarVisualHtml = (avSpec) => {
    if (!avSpec) return `<img src="home_avatar_3d.png?v=50" alt="Avatar" />`;
    if (avSpec.type === 'atlas100') {
      const px = ((avSpec.atlasCol / 9) * 100).toFixed(3);
      const py = ((avSpec.atlasRow / 9) * 100).toFixed(3);
      return `<div class="char-100-sprite" style="background-position:${px}% ${py}%;"></div>`;
    }
    return `<img src="${avSpec.src}" alt="${avSpec.name}" />`;
  };

  const PADLOCK_SVG = `
    <svg class="padlock-svg" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 30V20C18 11.7157 24.268 5 32 5C39.732 5 46 11.7157 46 20V30" stroke="#F59E0B" stroke-width="8" stroke-linecap="round"/>
      <path d="M18 29V20C18 11.7157 24.268 5 32 5C39.732 5 46 11.7157 46 20V29" stroke="#FDE047" stroke-width="4" stroke-linecap="round"/>
      <rect x="8" y="26" width="48" height="40" rx="12" fill="url(#lockGrad)" stroke="#B45309" stroke-width="3"/>
      <circle cx="32" cy="43" r="5" fill="#78350F"/>
      <path d="M32 46V55" stroke="#78350F" stroke-width="5" stroke-linecap="round"/>
      <defs>
        <linearGradient id="lockGrad" x1="32" y1="26" x2="32" y2="66" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="55%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
      </defs>
    </svg>
  `;

  const BOOSTER_ICONS_SVG = {
    shuffle: `
      <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="8" width="52" height="50" rx="14" fill="#C2410C"/>
        <rect x="6" y="5" width="52" height="49" rx="14" fill="url(#shufGrad)" stroke="#FFFBEB" stroke-width="2.5"/>
        <path d="M17 22H26C31 22 33 38 39 38H47" stroke="#FFFFFF" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M42 32L49 38L42 44" stroke="#FFFFFF" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17 38H26C31 38 33 22 39 22H47" stroke="#FFFFFF" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M42 16L49 22L42 28" stroke="#FFFFFF" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
        <defs>
          <linearGradient id="shufGrad" x1="32" y1="5" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FDBA74"/>
            <stop offset="45%" stop-color="#FB923C"/>
            <stop offset="100%" stop-color="#EA580C"/>
          </linearGradient>
        </defs>
      </svg>
    `,
    vip: `
      <svg width="52" height="46" viewBox="0 0 76 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="16" cy="43" rx="12" ry="7" fill="#FDE68A" stroke="#D97706" stroke-width="2.5"/>
        <ellipse cx="16" cy="43" rx="6" ry="3.2" fill="#F59E0B"/>
        <ellipse cx="60" cy="43" rx="12" ry="7" fill="#FDE68A" stroke="#D97706" stroke-width="2.5"/>
        <ellipse cx="60" cy="43" rx="6" ry="3.2" fill="#F59E0B"/>
        <path d="M17 36C17 29 22 25 29 25H49C56 25 61 29 61 36V44C61 48 57 51 52 51H26C21 51 17 48 17 44V36Z" fill="url(#vipBody)" stroke="#9A3412" stroke-width="2.5"/>
        <path d="M24 26L28 14C29 11.5 31.5 10 34.5 10H43.5C46.5 10 49 11.5 50 14L54 26H24Z" fill="url(#vipTop)" stroke="#9A3412" stroke-width="2.2"/>
        <path d="M27.5 24L30.5 15.5H47.5L50.5 24H27.5Z" fill="#1E293B"/>
        <rect x="24" y="38" width="9" height="5" rx="2.5" fill="#FEF08A"/>
        <rect x="45" y="38" width="9" height="5" rx="2.5" fill="#FEF08A"/>
        <rect x="35" y="40" width="8" height="4" rx="2" fill="#FED7AA"/>
        <defs>
          <linearGradient id="vipBody" x1="39" y1="25" x2="39" y2="51" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FB923C"/>
            <stop offset="100%" stop-color="#EA580C"/>
          </linearGradient>
          <linearGradient id="vipTop" x1="39" y1="10" x2="39" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FDBA74"/>
            <stop offset="100%" stop-color="#F97316"/>
          </linearGradient>
        </defs>
      </svg>
    `,
    magnet: `
      <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 14V32C14 43.0457 22.0589 52 32 52C41.9411 52 50 43.0457 50 32V14H39V32C39 36.4183 35.866 40 32 40C28.134 40 25 36.4183 25 32V14H14Z" fill="url(#magRed)" stroke="#991B1B" stroke-width="2.5"/>
        <rect x="14" y="8" width="11" height="10" rx="3" fill="url(#magSilver)" stroke="#64748B" stroke-width="2"/>
        <rect x="39" y="8" width="11" height="10" rx="3" fill="url(#magSilver)" stroke="#64748B" stroke-width="2"/>
        <defs>
          <linearGradient id="magRed" x1="32" y1="14" x2="32" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#F87171"/>
            <stop offset="45%" stop-color="#EF4444"/>
            <stop offset="100%" stop-color="#B91C1C"/>
          </linearGradient>
          <linearGradient id="magSilver" x1="32" y1="8" x2="32" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#F8FAFC"/>
            <stop offset="100%" stop-color="#CBD5E1"/>
          </linearGradient>
        </defs>
      </svg>
    `
  };

  // =========================================================================
  // SYNTHESIZED SOUND & PARTY MUSIC ENGINE (LOUD, CRISP MASTER BOOST EDITION!)
  // =========================================================================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.masterOut = null;
      this.sfxEnabled = true;
      this.musicEnabled = true;
      this.musicTimer = null;
      this.comboCount = 0;
      this.lastBoardTime = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          // High-output Master Compressor + 3.2x Master Gain Boost for loud mobile speaker playback!
          const comp = this.ctx.createDynamicsCompressor();
          comp.threshold.setValueAtTime(-16, this.ctx.currentTime);
          comp.knee.setValueAtTime(12, this.ctx.currentTime);
          comp.ratio.setValueAtTime(6, this.ctx.currentTime);
          comp.attack.setValueAtTime(0.002, this.ctx.currentTime);
          comp.release.setValueAtTime(0.15, this.ctx.currentTime);

          const masterGain = this.ctx.createGain();
          masterGain.gain.setValueAtTime(3.2, this.ctx.currentTime);

          masterGain.connect(comp);
          comp.connect(this.ctx.destination);
          this.masterOut = masterGain;
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type, duration, vol = 0.65, slideTo = null) {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
      }

      // Sustain loud peak volume through 65% of note duration before smooth decay
      const boostedVol = Math.min(1.0, vol * 2.8);
      gain.gain.setValueAtTime(boostedVol, now);
      gain.gain.setValueAtTime(boostedVol * 0.88, now + duration * 0.65);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterOut || this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    }

    playButtonClick() {
      this.playTone(560, 'sine', 0.06, 0.45, 760);
    }

    playGoCheer() {
      if (!this.sfxEnabled) return;
      this.init();
      const b64 = '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';
      const dataUri = 'data:audio/mp3;base64,' + b64;

      // Play real kids shouting "YEAHHHH!" audio sample via Web Audio API (with HTMLAudio fallback)
      try {
        if (!this._kidsCheerBytes) {
          const bin = atob(b64);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          this._kidsCheerBytes = bytes.buffer;
        }
        if (this.ctx && this._kidsCheerBuffer) {
          const src = this.ctx.createBufferSource();
          src.buffer = this._kidsCheerBuffer;
          const g = this.ctx.createGain();
          g.gain.setValueAtTime(1.35, this.ctx.currentTime);
          src.connect(g);
          g.connect(this.masterOut || this.ctx.destination);
          src.start(0);
          return;
        } else if (this.ctx && this._kidsCheerBytes) {
          const copyBuf = this._kidsCheerBytes.slice(0);
          this.ctx.decodeAudioData(copyBuf, (decoded) => {
            this._kidsCheerBuffer = decoded;
            const src = this.ctx.createBufferSource();
            src.buffer = decoded;
            const g = this.ctx.createGain();
            g.gain.setValueAtTime(1.35, this.ctx.currentTime);
            src.connect(g);
            g.connect(this.masterOut || this.ctx.destination);
            src.start(0);
          }, () => {
            const a = new Audio(dataUri);
            a.volume = 1.0;
            a.play().catch(() => {});
          });
          return;
        }
      } catch (e) {}

      try {
        const audio = new Audio(dataUri);
        audio.volume = 1.0;
        audio.play().catch(() => {});
      } catch (e) {}
    }

    vibrate(ms = 12) {
      if (this.vibeEnabled === false) return;
      try {
        if (navigator.vibrate) navigator.vibrate(ms);
      } catch (e) {}
    }

    playSkyWhoosh() {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const dur = 0.58;
        const sampleRate = this.ctx.sampleRate;
        const buf = this.ctx.createBuffer(1, Math.floor(sampleRate * dur), sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.sin((i / data.length) * Math.PI);
        }
        const src = this.ctx.createBufferSource();
        src.buffer = buf;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        const now = this.ctx.currentTime;
        filter.frequency.setValueAtTime(320, now);
        filter.frequency.exponentialRampToValueAtTime(1450, now + dur * 0.45);
        filter.frequency.exponentialRampToValueAtTime(420, now + dur);
        filter.Q.setValueAtTime(1.4, now);

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.55, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + dur);

        src.connect(filter);
        filter.connect(g);
        g.connect(this.masterOut || this.ctx.destination);
        src.start(now);
      } catch (e) {}
    }

    playCarStart() {
      this.vibrate(10);
      this.playTone(210, 'triangle', 0.14, 0.58, 440);
      setTimeout(() => this.playTone(330, 'sine', 0.11, 0.48, 520), 45);
    }

    playCarBlocked() {
      this.vibrate(24);
      this.playTone(185, 'triangle', 0.11, 0.80, 78);
      setTimeout(() => this.playTone(135, 'sine', 0.14, 0.75, 64), 65);
    }

    playPassengerBoard() {
      // Crisp bubbly water-drop / marimba "bloop-pop" matching Competitor Video 00:39-01:24!
      const nowMs = performance.now();
      if (nowMs - this.lastBoardTime < 320) {
        this.comboCount = Math.min(20, this.comboCount + 1);
      } else {
        this.comboCount = 0;
      }
      this.lastBoardTime = nowMs;
      const baseFreq = 490 + (this.comboCount % 14) * 32;
      this.playTone(baseFreq, 'sine', 0.072, 0.62, baseFreq * 1.42);
    }

    playBusDepart() {
      this.vibrate(16);
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => {
        setTimeout(() => this.playTone(n, 'sine', 0.20, 0.68, n * 1.02), i * 58);
      });
    }

    playWinFanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((n, idx) => {
        setTimeout(() => this.playTone(n, 'triangle', 0.32, 0.82, n * 1.03), idx * 100);
      });
    }

    playFailAlert() {
      this.vibrate(35);
      const notes = [392, 349.2, 311.1, 261.6];
      notes.forEach((n, idx) => {
        setTimeout(() => this.playTone(n, 'triangle', 0.22, 0.72, n * 0.94), idx * 110);
      });
    }

    playBooster() {
      this.vibrate(18);
      this.playTone(440, 'sine', 0.20, 0.72, 880);
      setTimeout(() => this.playTone(659.25, 'sine', 0.24, 0.72, 1174.6), 85);
    }

    startHomeMusic() {
      if (this.musicTimer) clearInterval(this.musicTimer);
      if (!this.musicEnabled) return;
      this._musicMode = 'home';
      // Warm playful pizzicato/marimba Home Lobby groove (Video 00:18 - 00:27)
      const pattern = [261.6, 329.6, 392.0, 329.6, 293.7, 349.2, 440.0, 349.2];
      let step = 0;
      this.musicTimer = setInterval(() => {
        if (!this.musicEnabled || document.hidden) return;
        this.init();
        if (!this.ctx) return;
        const freq = pattern[step % pattern.length];
        step++;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.masterOut || this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.23);
      }, 340);
    }

    startMusic() {
      if (this.musicTimer) clearInterval(this.musicTimer);
      if (!this.musicEnabled) return;
      this._musicMode = 'game';
      // Light, cheerful acoustic pluck / marimba gameplay groove (Video 00:36 - 01:31)
      const notes = [392.0, 493.9, 587.3, 493.9, 349.2, 440.0, 523.2, 440.0, 329.6, 392.0, 523.2, 659.2];
      let step = 0;
      this.musicTimer = setInterval(() => {
        if (!this.musicEnabled || document.hidden) return;
        this.init();
        if (!this.ctx) return;
        const freq = notes[step % notes.length];
        step++;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.10, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
        osc.connect(gain);
        gain.connect(this.masterOut || this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.20);
      }, 290);
    }

    stopMusic() {
      if (this.musicTimer) {
        clearInterval(this.musicTimer);
        this.musicTimer = null;
      }
    }
  }

  const sound = new SoundEngine();

  // =========================================================================
  // 1000 DISTINCT, PROGRESSIVELY HARDER LEVELS GENERATOR (WITH DYNAMIC COLORS & TIMER)
  // =========================================================================
  class LevelGenerator {
    static createSeededRandom(seed) {
      let s = seed % 2147483647;
      if (s <= 0) s += 2147483646;
      return function () {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      };
    }

    static getLevelMeta(levelNum) {
      const titles = [
        'Warmup Cross',
        'Neon Diamond Jam',
        'Bus Fever Classic',
        '4-Color Pinwheel Lock',
        '🔥 Fortress Gate',
        'Chevron Convoy',
        '5-Color Crossroads',
        '🔥 BOSS: Twin Towers',
        'Spiral Labyrinth',
        '🔥 MEGA: Highway Gridlock',
        'Emerald Interchange',
        '🔥 BOSS: Double Gauntlet',
        'Sunset Boulevard Jam',
        'Royal Plaza Rush',
        '🔥 BOSS: Iron Citadel',
        'Cyber Loop Express',
        'Downtown Bottleneck',
        '🔥 MEGA: 7-Color Vortex',
        'Harbor Bridge Lock',
        '🔥 BOSS: Grand Terminal'
      ];
      const name = titles[(levelNum - 1) % titles.length];
      const isHard = levelNum >= 4 && (levelNum % 5 === 0 || levelNum % 4 === 0);
      return { name, isHard };
    }

    /**
     * Picks a fresh, rotating subset of colors for each level so every next level
     * looks visually distinct and introduces more colors as difficulty increases!
     */
    static getColorsForLevel(levelNum, rand) {
      if (levelNum === 1) return ['yellow', 'blue', 'red'];
      if (levelNum === 2) return ['green', 'purple', 'orange'];
      if (levelNum === 3) return ['yellow', 'blue', 'red'];

      let numColors = 5;
      if (levelNum >= 6) numColors = 6;
      if (levelNum >= 9) numColors = 7;
      if (levelNum >= 13) numColors = 8;
      if (levelNum >= 18) numColors = 9;

      // Rotate starting palette index every level so consecutive levels never feel repetitive
      const rotated = [...ALL_COLOR_KEYS];
      const offset = (levelNum * 3 + Math.floor(levelNum / 2)) % rotated.length;
      const ordered = rotated.slice(offset).concat(rotated.slice(0, offset));

      // Deterministic shuffle with level seed
      for (let i = ordered.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const tmp = ordered[i];
        ordered[i] = ordered[j];
        ordered[j] = tmp;
      }

      return ordered.slice(0, numColors);
    }

    static generateLevel(levelNum) {
      const clampedLvl = Math.max(1, Math.min(5000, levelNum));
      if (clampedLvl === 1) return this.buildLevel1();
      if (clampedLvl === 2) return this.buildLevel2();
      if (clampedLvl === 3) return this.buildExactVideoLevel3();
      return this.buildProgressiveHardLevel(clampedLvl);
    }

    static buildLevel1() {
      // Level 1: 10 Vehicles (Cross Pattern), 3 Colors (Yellow, Blue, Red)
      const vehicles = [
        { id: 'l1_1', x: -2.0, z: 1.0, dir: 'LEFT', type: 'bus', color: 'yellow', cap: 24 },
        { id: 'l1_2', x: 2.0, z: 1.0, dir: 'RIGHT', type: 'bus', color: 'blue', cap: 24 },
        { id: 'l1_3', x: -1.6, z: 3.2, dir: 'UP', type: 'car', color: 'red', cap: 16 },
        { id: 'l1_4', x: 0.0, z: 3.2, dir: 'DOWN', type: 'bus', color: 'yellow', cap: 24 },
        { id: 'l1_5', x: 1.6, z: 3.2, dir: 'UP', type: 'car', color: 'blue', cap: 16 },
        { id: 'l1_6', x: -2.8, z: 5.5, dir: 'LEFT', type: 'car', color: 'blue', cap: 16 },
        { id: 'l1_7', x: 2.8, z: 5.5, dir: 'RIGHT', type: 'car', color: 'red', cap: 16 },
        { id: 'l1_8', x: 0.0, z: 6.2, dir: 'DOWN', type: 'car', color: 'red', cap: 16 },
        { id: 'l1_9', x: -2.0, z: 8.6, dir: 'LEFT', type: 'bus', color: 'red', cap: 24 },
        { id: 'l1_10', x: 2.0, z: 8.6, dir: 'RIGHT', type: 'bus', color: 'blue', cap: 24 }
      ];
      return this.finalizeWithRevolvingFeederQueues(1, vehicles);
    }

    static buildLevel2() {
      // Level 2: 14 Vehicles (Interlocking Diamond), Fresh Colors (Green, Purple, Orange!)
      const vehicles = [
        { id: 'l2_1', x: -2.1, z: 0.7, dir: 'RIGHT', type: 'bus', color: 'green', cap: 28, tilt: -0.1 },
        { id: 'l2_2', x: 2.1, z: 0.7, dir: 'LEFT', type: 'bus', color: 'purple', cap: 28, tilt: 0.1 },

        { id: 'l2_3', x: -2.8, z: 2.8, dir: 'UP', type: 'car', color: 'orange', cap: 16 },
        { id: 'l2_4', x: -1.2, z: 2.8, dir: 'DOWN', type: 'car', color: 'purple', cap: 16 },
        { id: 'l2_5', x: 1.2, z: 2.8, dir: 'DOWN', type: 'car', color: 'green', cap: 16 },
        { id: 'l2_6', x: 2.8, z: 2.8, dir: 'UP', type: 'car', color: 'orange', cap: 16 },

        { id: 'l2_7', x: -2.4, z: 4.9, dir: 'LEFT', type: 'bus', color: 'orange', cap: 28 },
        { id: 'l2_8', x: 2.4, z: 4.9, dir: 'RIGHT', type: 'bus', color: 'purple', cap: 28 },

        { id: 'l2_9', x: -3.2, z: 7.0, dir: 'LEFT', type: 'car', color: 'green', cap: 16 },
        { id: 'l2_10', x: -1.1, z: 7.1, dir: 'DOWN', type: 'car', color: 'orange', cap: 16 },
        { id: 'l2_11', x: 1.1, z: 7.1, dir: 'DOWN', type: 'car', color: 'purple', cap: 16 },
        { id: 'l2_12', x: 3.2, z: 7.0, dir: 'RIGHT', type: 'car', color: 'green', cap: 16 },

        { id: 'l2_13', x: -2.15, z: 9.5, dir: 'LEFT', type: 'bus', color: 'purple', cap: 28 },
        { id: 'l2_14', x: 2.15, z: 9.5, dir: 'RIGHT', type: 'bus', color: 'green', cap: 28 }
      ];
      return this.finalizeWithRevolvingFeederQueues(2, vehicles);
    }

    /**
     * Exact 19-Vehicle Replica of Video Level 3 (00:28 - 01:21)!
     */
    static buildExactVideoLevel3() {
      const vehicles = [
        { id: 'v3_top_l', x: -2.05, z: 0.55, dir: 'RIGHT', type: 'bus', color: 'blue', cap: 40, tilt: -0.12 },
        { id: 'v3_top_r', x: 2.05, z: 0.55, dir: 'RIGHT', type: 'bus', color: 'yellow', cap: 32, tilt: 0.12 },

        { id: 'v3_r1_1', x: -3.0, z: 2.75, dir: 'UP', type: 'car', color: 'yellow', cap: 16 },
        { id: 'v3_r1_2', x: -1.5, z: 2.75, dir: 'UP', type: 'car', color: 'red', cap: 16 },
        { id: 'v3_r1_3', x: 0.0, z: 2.65, dir: 'DOWN', type: 'bus', color: 'blue', cap: 40 },
        { id: 'v3_r1_4', x: 1.5, z: 2.75, dir: 'UP', type: 'car', color: 'red', cap: 16 },
        { id: 'v3_r1_5', x: 3.0, z: 2.75, dir: 'UP', type: 'car', color: 'yellow', cap: 16 },

        { id: 'v3_r2_1', x: -3.15, z: 4.75, dir: 'LEFT', type: 'car', color: 'red', cap: 16 },
        { id: 'v3_r2_2', x: 0.0, z: 4.75, dir: 'LEFT', type: 'bus', color: 'red', cap: 40 },
        { id: 'v3_r2_3', x: 3.15, z: 4.75, dir: 'LEFT', type: 'car', color: 'red', cap: 16 },

        { id: 'v3_mid_1', x: 0.0, z: 6.7, dir: 'DOWN', type: 'car', color: 'red', cap: 16 },
        { id: 'v3_mid_2', x: 0.0, z: 8.8, dir: 'DOWN', type: 'car', color: 'yellow', cap: 16 },

        { id: 'v3_l_1', x: -4.2, z: 6.75, dir: 'LEFT', type: 'car', color: 'yellow', cap: 16 },
        { id: 'v3_l_2', x: -2.0, z: 6.75, dir: 'LEFT', type: 'car', color: 'blue', cap: 16 },
        { id: 'v3_l_3', x: -4.2, z: 8.15, dir: 'LEFT', type: 'car', color: 'blue', cap: 16 },
        { id: 'v3_l_4', x: -2.0, z: 8.15, dir: 'LEFT', type: 'car', color: 'blue', cap: 16 },

        { id: 'v3_rt_1', x: 2.0, z: 6.75, dir: 'RIGHT', type: 'car', color: 'blue', cap: 16 },
        { id: 'v3_rt_2', x: 4.2, z: 6.75, dir: 'RIGHT', type: 'car', color: 'yellow', cap: 16 },
        { id: 'v3_rt_3', x: 2.0, z: 8.15, dir: 'RIGHT', type: 'car', color: 'blue', cap: 16 },
        { id: 'v3_rt_4', x: 4.2, z: 8.15, dir: 'RIGHT', type: 'car', color: 'blue', cap: 16 },

        { id: 'v3_bot_l', x: -2.15, z: 10.45, dir: 'LEFT', type: 'bus', color: 'yellow', cap: 40 },
        { id: 'v3_bot_r', x: 2.15, z: 10.45, dir: 'RIGHT', type: 'bus', color: 'blue', cap: 40 }
      ];

      return this.finalizeWithRevolvingFeederQueues(3, vehicles);
    }

    /**
     * Generates distinct, progressively harder formations for Levels 4..1000!
     */
    static buildProgressiveHardLevel(levelNum) {
      const rand = this.createSeededRandom(levelNum * 12983 + 409);
      const colorPool = this.getColorsForLevel(levelNum, rand);

      const archetype = levelNum % 12;
      const slots = this.buildDistinctFormationArchetype(archetype, levelNum, rand);

      // Apply multi-axis geometric variation per 12-level cycle so levels NEVER feel like repetitive copies!
      const cycle = Math.floor(levelNum / 12);
      if (cycle > 0 && archetype !== 6) {
        const mirrorX = (cycle % 2 === 1);
        const mirrorZ = (cycle % 3 === 1);
        const tiltWave = ((cycle % 4) - 1.5) * 0.16;
        slots.forEach((s) => {
          if (mirrorX) {
            s.x = -s.x;
            if (s.dir === 'LEFT') s.dir = 'RIGHT';
            else if (s.dir === 'RIGHT') s.dir = 'LEFT';
            if (s.tilt) s.tilt = -s.tilt;
          }
          if (mirrorZ) {
            s.z = Math.max(0.45, Math.min(11.1, 11.2 - s.z));
            if (s.dir === 'UP') s.dir = 'DOWN';
            else if (s.dir === 'DOWN') s.dir = 'UP';
            if (s.tilt) s.tilt = -s.tilt;
          }
          if (!s.tilt && Math.abs(s.x) > 1.8 && (levelNum + Math.round(s.z)) % 3 === 0) {
            s.tilt = s.x < 0 ? tiltWave : -tiltWave;
          }
        });
      }

      // Progressively tighten outer puzzle knots as level increases (starts right from Level 4 and ramps up steeply across 5000 levels!)
      if (levelNum >= 4) {
        const inwardChance = Math.min(0.92, 0.56 + (levelNum - 4) * 0.038);
        const keepKeyMod = levelNum >= 12 ? 8 : levelNum >= 7 ? 6 : 5;
        slots.forEach((s, idx) => {
          if (idx % keepKeyMod === 0) return; // keep a few outer keys solvable
          if (rand() < inwardChance) {
            if (Math.abs(s.tilt || 0) > 0.25) {
              const fv = this.getVehicleForward(s);
              const toCenterDot = (0 - s.x) * fv.fx + (5.6 - s.z) * fv.fz;
              if (toCenterDot < 0) {
                s.dir = s.dir === 'UP' ? 'DOWN' : s.dir === 'DOWN' ? 'UP' : s.dir === 'LEFT' ? 'RIGHT' : 'LEFT';
              }
            } else {
              if (s.z < 2.4) s.dir = 'DOWN';
              else if (s.z > 9.2) s.dir = 'UP';
              else if (s.x < -2.4) s.dir = 'RIGHT';
              else if (s.x > 2.4) s.dir = 'LEFT';
            }
          }
        });
      }

      // Ensure base formation has crisp, open spacing before adding any extra perimeter flankers
      this.enforceCleanVehicleSpacing(slots, 0.36);

      // Add progressive extra angled perimeter & inner lock vehicles (only where full open OBB clearance exists!)
      const extraWanted = Math.min(10, Math.max(2, 2 + Math.floor((levelNum - 4) * 0.45)));
      if (extraWanted > 0) {
        const candidateFlankers = [
          { x: -1.55, z: 0.62, dir: 'DOWN', type: 'car', subType: 'van', tilt: 0.28 },
          { x: 1.55, z: 0.62, dir: 'DOWN', type: 'car', subType: 'van', tilt: -0.28 },
          { x: -4.92, z: 1.45, dir: 'DOWN', type: 'car', subType: 'van', tilt: -0.42 },
          { x: 4.92, z: 1.45, dir: 'DOWN', type: 'car', subType: 'van', tilt: 0.42 },
          { x: -4.98, z: 3.75, dir: 'RIGHT', type: 'car', subType: 'van', tilt: 0.28 },
          { x: 4.98, z: 3.75, dir: 'LEFT', type: 'car', subType: 'van', tilt: -0.28 },
          { x: -4.98, z: 6.05, dir: 'RIGHT', type: 'car', tilt: 0.24 },
          { x: 4.98, z: 6.05, dir: 'LEFT', type: 'car', tilt: -0.24 },
          { x: -4.92, z: 8.25, dir: 'RIGHT', type: 'car', subType: 'van', tilt: -0.28 },
          { x: 4.92, z: 8.25, dir: 'LEFT', type: 'car', subType: 'van', tilt: 0.28 },
          { x: -1.75, z: 8.95, dir: 'UP', type: 'car', tilt: 0.24 },
          { x: 1.75, z: 8.95, dir: 'UP', type: 'car', tilt: -0.24 },
          { x: -4.75, z: 10.15, dir: 'UP', type: 'car', subType: 'van', tilt: 0.40 },
          { x: 4.75, z: 10.15, dir: 'UP', type: 'car', subType: 'van', tilt: -0.40 }
        ];
        let added = 0;
        for (const cand of candidateFlankers) {
          if (added >= extraWanted) break;
          if (!this.hasAnyOBBOverlap(cand, slots, 0.38)) {
            slots.push({ ...cand });
            added++;
          }
        }
      }

      // Bus capacities scale with level difficulty (28 -> 32 -> 36 -> 40 -> 44)
      const busCap = levelNum < 6 ? 28 : levelNum < 10 ? 32 : levelNum < 16 ? 36 : levelNum < 25 ? 40 : 44;
      const vanCap = levelNum < 12 ? 20 : 24;

      // Anti-streak balanced color assignment so adjacent vehicles have rich, tricky color variety!
      const colorBag = [];
      while (colorBag.length < slots.length + colorPool.length) {
        const copy = [...colorPool];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(rand() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        colorBag.push(...copy);
      }

      let prevCol = null;
      const vehicles = slots.map((s, idx) => {
        let color = colorBag[idx];
        if (color === prevCol && colorPool.length > 1) {
          color = colorPool[(colorPool.indexOf(color) + 1) % colorPool.length];
        }
        prevCol = color;
        const isVan = s.type !== 'bus' && (s.subType === 'van' || idx % 3 === 1);
        const cap = s.type === 'bus' ? busCap : isVan ? vanCap : 16;
        return {
          id: `lvl${levelNum}_v${idx}`,
          x: s.x,
          z: s.z,
          dir: s.dir,
          type: s.type,
          subType: s.type === 'bus' ? 'bus' : isVan ? 'van' : 'car',
          color: color,
          cap: cap,
          tilt: s.tilt || 0
        };
      });

      this.enforceCleanVehicleSpacing(vehicles, 0.35);
      this.ensureNoCyclicDeadlock(vehicles);

      // NARROW-ENTRY PUZZLE LOCK TIGHTENER:
      // On hard levels (Level 4+), lock down excess initially-unblocked vehicles so only 2-3 key vehicles can move first!
      if (levelNum >= 4) {
        const maxInitialFree = levelNum <= 6 ? 3 : 2;
        const oppDir = (d) => (d === 'UP' ? 'DOWN' : d === 'DOWN' ? 'UP' : d === 'LEFT' ? 'RIGHT' : 'LEFT');
        const allDirs = ['DOWN', 'UP', 'LEFT', 'RIGHT'];
        const isFullyPeelable = (vList) => {
          const rem = vList.slice();
          let steps = 0;
          while (rem.length > 0 && steps < 100) {
            steps++;
            const free = rem.filter((v) => !this.findBlockingVehicle(v, rem));
            if (free.length === 0) return false;
            for (const f of free) {
              const i = rem.indexOf(f);
              if (i !== -1) rem.splice(i, 1);
            }
          }
          return rem.length === 0;
        };

        const initialFree = vehicles.filter((v) => !this.findBlockingVehicle(v, vehicles));
        let freeCount = initialFree.length;
        for (let i = 0; i < initialFree.length && freeCount > maxInitialFree; i++) {
          const candV = initialFree[i];
          const oldD = candV.dir;
          const oldTilt = candV.tilt || 0;
          // Build candidate (dir, tilt) pairs ordered by 180-flip first, then inward directions
          const candStates = [
            { dir: oppDir(oldD), tilt: oldTilt },
            { dir: oppDir(oldD), tilt: -oldTilt },
            { dir: oppDir(oldD), tilt: 0 }
          ];
          for (const d of allDirs) {
            if (d !== oldD && d !== oppDir(oldD)) {
              candStates.push({ dir: d, tilt: 0 });
              if (oldTilt !== 0) {
                candStates.push({ dir: d, tilt: oldTilt * 0.5 });
                candStates.push({ dir: d, tilt: -oldTilt * 0.5 });
              }
            }
          }
          let locked = false;
          for (const st of candStates) {
            candV.dir = st.dir;
            candV.tilt = st.tilt;
            // Strict OBB check on EVERY candidate direction/tilt so two vehicles NEVER touch or overlap!
            if (this.hasAnyOBBOverlap(candV, vehicles, 0.30)) continue;
            if (this.findBlockingVehicle(candV, vehicles) && isFullyPeelable(vehicles)) {
              freeCount--;
              locked = true;
              break;
            }
          }
          if (!locked) {
            candV.dir = oldD;
            candV.tilt = oldTilt;
          }
        }
      }

      return this.finalizeWithRevolvingFeederQueues(levelNum, vehicles);
    }

    static buildDistinctFormationArchetype(archetype, levelNum, rand) {
      const list = [];
      const flipDir = (d) => (d === 'LEFT' ? 'RIGHT' : d === 'RIGHT' ? 'LEFT' : d === 'UP' ? 'DOWN' : 'UP');
      const shouldFlip = levelNum % 2 === 1;

      if (archetype === 0) {
        // Archetype 0: PINWHEEL FORTRESS (22 vehicles)
        list.push({ x: -2.2, z: 0.45, dir: 'RIGHT', type: 'bus', tilt: -0.1 });
        list.push({ x: 2.2, z: 0.45, dir: 'LEFT', type: 'bus', tilt: 0.1 });

        [-3.6, -1.8, 0.0, 1.8, 3.6].forEach((cx, i) => {
          list.push({
            x: cx,
            z: 2.45,
            dir: i % 2 === 0 ? 'DOWN' : 'UP',
            type: i === 2 ? 'bus' : 'car'
          });
        });

        list.push({ x: -3.3, z: 4.55, dir: 'RIGHT', type: 'car' });
        list.push({ x: 0.0, z: 4.55, dir: shouldFlip ? 'RIGHT' : 'LEFT', type: 'bus' });
        list.push({ x: 3.3, z: 4.55, dir: 'RIGHT', type: 'car' });

        [-3.8, -2.2, -0.7, 0.7, 2.2, 3.8].forEach((cx, i) => {
          list.push({
            x: cx,
            z: 6.55,
            dir: i < 3 ? 'UP' : 'DOWN',
            type: 'car'
          });
        });

        list.push({ x: -3.3, z: 8.6, dir: 'LEFT', type: 'car' });
        list.push({ x: 0.0, z: 8.6, dir: 'RIGHT', type: 'bus' });
        list.push({ x: 3.3, z: 8.6, dir: 'RIGHT', type: 'car' });

        list.push({ x: -2.2, z: 10.5, dir: 'LEFT', type: 'bus' });
        list.push({ x: 0.0, z: 10.5, dir: 'DOWN', type: 'car' });
        list.push({ x: 2.2, z: 10.5, dir: 'RIGHT', type: 'bus' });
      } else if (archetype === 1) {
        // Archetype 1: TWIN TOWERS CITADEL (25 vehicles)
        list.push({ x: -3.2, z: 0.55, dir: 'LEFT', type: 'car' });
        list.push({ x: 0.0, z: 0.55, dir: 'RIGHT', type: 'bus' });
        list.push({ x: 3.2, z: 0.55, dir: 'RIGHT', type: 'car' });

        [-3.8, -2.4, 2.4, 3.8].forEach((cx) => {
          list.push({ x: cx, z: 2.6, dir: 'UP', type: 'bus' });
          list.push({ x: cx, z: 5.2, dir: 'DOWN', type: 'car' });
          list.push({ x: cx, z: 7.4, dir: 'DOWN', type: 'bus' });
        });

        list.push({ x: 0.0, z: 2.3, dir: 'LEFT', type: 'car' });
        list.push({ x: 0.0, z: 3.8, dir: 'RIGHT', type: 'car' });
        list.push({ x: 0.0, z: 5.3, dir: 'LEFT', type: 'bus' });
        list.push({ x: 0.0, z: 6.8, dir: 'RIGHT', type: 'car' });
        list.push({ x: 0.0, z: 8.3, dir: 'DOWN', type: 'car' });

        list.push({ x: -3.2, z: 10.2, dir: 'LEFT', type: 'bus' });
        list.push({ x: 0.0, z: 10.2, dir: 'DOWN', type: 'car' });
        list.push({ x: 3.2, z: 10.2, dir: 'RIGHT', type: 'bus' });
      } else if (archetype === 2) {
        // Archetype 2: DIAGONAL DIAMOND CONVOY (24 angled & straight vehicles!)
        list.push({ x: -2.2, z: 0.65, dir: 'UP', type: 'car', tilt: 0.68 });
        list.push({ x: 2.2, z: 0.65, dir: 'UP', type: 'car', tilt: -0.68 });
        list.push({ x: -3.9, z: 1.85, dir: 'UP', type: 'bus', tilt: 0.68 });
        list.push({ x: 0.0, z: 1.95, dir: 'DOWN', type: 'car', subType: 'van' });
        list.push({ x: 3.9, z: 1.85, dir: 'UP', type: 'bus', tilt: -0.68 });

        list.push({ x: -2.1, z: 3.3, dir: 'DOWN', type: 'car', subType: 'van', tilt: 0.68 });
        list.push({ x: 2.1, z: 3.3, dir: 'DOWN', type: 'car', subType: 'van', tilt: -0.68 });

        [-3.8, -1.9, 0.0, 1.9, 3.8].forEach((cx, i) => {
          list.push({
            x: cx,
            z: 5.2,
            dir: i % 2 === 0 ? 'UP' : 'DOWN',
            type: i === 2 ? 'bus' : 'car'
          });
        });

        list.push({ x: -3.8, z: 7.3, dir: 'DOWN', type: 'car', tilt: -0.68 });
        list.push({ x: -1.8, z: 7.3, dir: 'UP', type: 'car', subType: 'van', tilt: -0.68 });
        list.push({ x: 1.8, z: 7.3, dir: 'UP', type: 'car', subType: 'van', tilt: 0.68 });
        list.push({ x: 3.8, z: 7.3, dir: 'DOWN', type: 'car', tilt: 0.68 });

        list.push({ x: -2.5, z: 9.1, dir: 'DOWN', type: 'bus', tilt: -0.68 });
        list.push({ x: 0.0, z: 8.9, dir: 'DOWN', type: 'car' });
        list.push({ x: 2.5, z: 9.1, dir: 'DOWN', type: 'bus', tilt: 0.68 });

        list.push({ x: -1.6, z: 10.7, dir: 'LEFT', type: 'car', subType: 'van' });
        list.push({ x: 1.6, z: 10.7, dir: 'RIGHT', type: 'car', subType: 'van' });
      } else if (archetype === 3) {
        // Archetype 3: CROSSROADS LABYRINTH (26 vehicles)
        [-3.2, 0.0, 3.2].forEach((cx, idx) => {
          list.push({ x: cx, z: 0.6, dir: idx === 1 ? 'UP' : idx === 0 ? 'LEFT' : 'RIGHT', type: 'bus' });
        });

        [-3.9, -2.5, -1.1, 1.1, 2.5, 3.9].forEach((cx) => {
          list.push({ x: cx, z: 2.7, dir: 'UP', type: 'car' });
        });

        list.push({ x: -3.3, z: 4.7, dir: 'LEFT', type: 'bus' });
        list.push({ x: 0.0, z: 4.7, dir: 'LEFT', type: 'car' });
        list.push({ x: 3.3, z: 4.7, dir: 'RIGHT', type: 'bus' });

        [-3.9, -2.5, -1.1, 1.1, 2.5, 3.9].forEach((cx) => {
          list.push({ x: cx, z: 6.8, dir: 'DOWN', type: 'car' });
        });

        list.push({ x: -3.2, z: 8.8, dir: 'LEFT', type: 'car' });
        list.push({ x: 0.0, z: 8.8, dir: 'DOWN', type: 'bus' });
        list.push({ x: 3.2, z: 8.8, dir: 'RIGHT', type: 'car' });

        list.push({ x: -2.2, z: 10.4, dir: 'LEFT', type: 'bus' });
        list.push({ x: 2.2, z: 10.4, dir: 'RIGHT', type: 'bus' });
      } else if (archetype === 4) {
        // Archetype 4: SPIRAL VORTEX (24 vehicles)
        list.push({ x: -2.4, z: 0.55, dir: 'LEFT', type: 'bus', tilt: -0.08 });
        list.push({ x: 2.4, z: 0.55, dir: 'RIGHT', type: 'bus', tilt: 0.08 });

        [-3.8, -1.9, 0.0, 1.9, 3.8].forEach((cx, i) => {
          list.push({
            x: cx,
            z: 2.55,
            dir: i < 2 ? 'UP' : i === 2 ? 'DOWN' : 'UP',
            type: i % 2 === 1 ? 'bus' : 'car'
          });
        });

        list.push({ x: -3.5, z: 4.75, dir: 'LEFT', type: 'car' });
        list.push({ x: -1.2, z: 4.75, dir: 'LEFT', type: 'car' });
        list.push({ x: 1.2, z: 4.75, dir: 'RIGHT', type: 'car' });
        list.push({ x: 3.5, z: 4.75, dir: 'RIGHT', type: 'car' });

        [-3.8, -1.9, 0.0, 1.9, 3.8].forEach((cx, i) => {
          list.push({
            x: cx,
            z: 6.85,
            dir: i % 2 === 0 ? 'DOWN' : 'UP',
            type: i === 2 ? 'bus' : 'car'
          });
        });

        list.push({ x: -3.3, z: 8.9, dir: 'LEFT', type: 'bus' });
        list.push({ x: 0.0, z: 8.9, dir: 'DOWN', type: 'car' });
        list.push({ x: 3.3, z: 8.9, dir: 'RIGHT', type: 'bus' });

        list.push({ x: -2.2, z: 10.55, dir: 'LEFT', type: 'car' });
        list.push({ x: 0.0, z: 10.55, dir: 'DOWN', type: 'car' });
        list.push({ x: 2.2, z: 10.55, dir: 'RIGHT', type: 'car' });
      } else if (archetype === 5) {
        // Archetype 5: INTERLOCKING CHEVRON GAUNTLET (28 angled & cross-locked vehicles!)
        list.push({ x: -3.3, z: 0.65, dir: 'RIGHT', type: 'bus', tilt: -0.18 });
        list.push({ x: 0.0, z: 0.75, dir: 'DOWN', type: 'car', subType: 'van' });
        list.push({ x: 3.3, z: 0.65, dir: 'LEFT', type: 'bus', tilt: 0.18 });

        [-3.85, -2.35, -0.95, 0.95, 2.35, 3.85].forEach((cx, i) => {
          const sideTilt = cx < 0 ? 0.42 : -0.42;
          list.push({
            x: cx,
            z: 2.65,
            dir: i % 2 === 0 ? 'DOWN' : 'UP',
            type: 'car',
            subType: i % 2 === 0 ? 'van' : 'car',
            tilt: Math.abs(cx) > 2.0 ? sideTilt : 0
          });
          list.push({
            x: cx,
            z: 5.05,
            dir: i % 2 === 0 ? 'UP' : 'DOWN',
            type: 'car',
            tilt: Math.abs(cx) > 2.0 ? -sideTilt : 0
          });
        });

        list.push({ x: 0.0, z: 3.85, dir: 'DOWN', type: 'bus' });

        [-3.45, 0.0, 3.45].forEach((cx, idx) => {
          list.push({ x: cx, z: 7.25, dir: idx === 0 ? 'RIGHT' : idx === 2 ? 'LEFT' : 'LEFT', type: 'bus' });
          list.push({ x: cx, z: 8.85, dir: idx === 0 ? 'RIGHT' : idx === 2 ? 'LEFT' : 'UP', type: 'car', subType: 'van' });
        });

        list.push({ x: -2.35, z: 10.55, dir: 'RIGHT', type: 'bus', tilt: 0.16 });
        list.push({ x: 0.0, z: 10.65, dir: 'UP', type: 'car' });
        list.push({ x: 2.35, z: 10.55, dir: 'LEFT', type: 'bus', tilt: -0.16 });
      } else if (archetype === 6) {
        // Archetype 6 (Level 6!): ICONIC DIAGONAL HEART FORMATION (Exact Competitor Screenshot!)
        // Top-left & Top-right heart lobes
        list.push({ x: -3.9, z: 1.05, dir: 'UP', type: 'car', tilt: -0.65 });
        list.push({ x: -2.1, z: 0.75, dir: 'UP', type: 'car', subType: 'van', tilt: 0.72 });
        list.push({ x: 2.1, z: 0.75, dir: 'UP', type: 'car', subType: 'van', tilt: -0.72 });
        list.push({ x: 3.9, z: 1.05, dir: 'UP', type: 'bus', tilt: 0.65 });

        // Upper inner wings
        list.push({ x: -2.9, z: 2.55, dir: 'UP', type: 'car', subType: 'van', tilt: 0.68 });
        list.push({ x: -1.1, z: 2.25, dir: 'UP', type: 'car', subType: 'van', tilt: 0.68 });
        list.push({ x: 0.9, z: 2.25, dir: 'UP', type: 'car', subType: 'van', tilt: 0.68 });
        list.push({ x: 2.6, z: 2.65, dir: 'DOWN', type: 'car', subType: 'van', tilt: 0.95 });

        // Outer left & right vertical/angled flankers
        list.push({ x: -4.75, z: 3.65, dir: 'DOWN', type: 'bus', tilt: 0.12 });
        list.push({ x: -3.25, z: 4.35, dir: 'DOWN', type: 'car', tilt: -0.35 });
        list.push({ x: -1.85, z: 4.15, dir: 'DOWN', type: 'car', tilt: -0.35 });
        list.push({ x: 0.15, z: 3.65, dir: 'UP', type: 'car', tilt: -0.48 });
        list.push({ x: 2.05, z: 4.10, dir: 'DOWN', type: 'car', subType: 'van', tilt: 0.95 });
        list.push({ x: 3.75, z: 4.05, dir: 'UP', type: 'bus', tilt: -0.25 });
        list.push({ x: 4.95, z: 4.45, dir: 'RIGHT', type: 'car', subType: 'van', tilt: -0.25 });

        // Mid heart core
        list.push({ x: -4.25, z: 6.25, dir: 'DOWN', type: 'car', subType: 'van', tilt: 0.18 });
        list.push({ x: -2.75, z: 6.05, dir: 'DOWN', type: 'car', tilt: -0.30 });
        list.push({ x: -0.85, z: 4.95, dir: 'DOWN', type: 'car', tilt: 0.85 });
        list.push({ x: 0.15, z: 5.85, dir: 'DOWN', type: 'car', subType: 'van', tilt: -0.45 });
        list.push({ x: 1.85, z: 5.55, dir: 'DOWN', type: 'car', subType: 'van', tilt: 0.95 });
        list.push({ x: 3.45, z: 6.15, dir: 'UP', type: 'car', subType: 'van', tilt: -0.35 });
        list.push({ x: 4.75, z: 6.25, dir: 'UP', type: 'car', subType: 'van', tilt: -0.35 });

        // Lower converging V-tip of the Heart
        list.push({ x: -1.25, z: 6.85, dir: 'DOWN', type: 'car', subType: 'van', tilt: 0.82 });
        list.push({ x: 1.55, z: 6.95, dir: 'RIGHT', type: 'car', tilt: -0.30 });
        list.push({ x: -2.05, z: 8.15, dir: 'DOWN', type: 'car', tilt: 0.82 });
        list.push({ x: -0.25, z: 8.35, dir: 'DOWN', type: 'bus', tilt: -0.62 });
        list.push({ x: 2.35, z: 8.15, dir: 'UP', type: 'car', tilt: -0.42 });
        list.push({ x: 3.75, z: 8.15, dir: 'UP', type: 'car', subType: 'van', tilt: -0.38 });

        // Bottom heart point
        list.push({ x: -2.95, z: 9.45, dir: 'LEFT', type: 'car', subType: 'van', tilt: -0.45 });
        list.push({ x: 0.35, z: 9.65, dir: 'DOWN', type: 'bus', tilt: -0.62 });
        list.push({ x: 2.35, z: 9.85, dir: 'UP', type: 'car', subType: 'van', tilt: -0.42 });
        list.push({ x: -1.45, z: 10.75, dir: 'DOWN', type: 'car', tilt: 0.72 });
        list.push({ x: 0.45, z: 11.05, dir: 'UP', type: 'car', tilt: -0.68 });
      } else if (archetype === 7) {
        // Archetype 7: MEGA HIGHWAY GRIDLOCK (28 vehicles)
        list.push({ x: -2.3, z: 0.5, dir: 'RIGHT', type: 'bus', tilt: -0.1 });
        list.push({ x: 2.3, z: 0.5, dir: 'LEFT', type: 'bus', tilt: 0.1 });

        [-3.9, -2.6, -1.3, 0.0, 1.3, 2.6, 3.9].forEach((cx, i) => {
          list.push({
            x: cx,
            z: 2.65,
            dir: i % 2 === 0 ? 'UP' : 'DOWN',
            type: i === 3 ? 'bus' : 'car'
          });
        });

        list.push({ x: -3.4, z: 4.8, dir: 'LEFT', type: 'car' });
        list.push({ x: 0.0, z: 4.8, dir: rand() > 0.5 ? 'LEFT' : 'RIGHT', type: 'bus' });
        list.push({ x: 3.4, z: 4.8, dir: 'RIGHT', type: 'car' });

        [-4.1, -2.0, 2.0, 4.1].forEach((cx, i) => {
          list.push({ x: cx, z: 6.4, dir: i < 2 ? 'LEFT' : 'RIGHT', type: 'car' });
          list.push({ x: cx, z: 7.8, dir: i < 2 ? 'LEFT' : 'RIGHT', type: 'car' });
          list.push({ x: cx, z: 9.2, dir: i < 2 ? 'LEFT' : 'RIGHT', type: 'car' });
        });

        list.push({ x: 0.0, z: 6.9, dir: 'DOWN', type: 'bus' });
        list.push({ x: 0.0, z: 9.4, dir: 'DOWN', type: 'car' });

        list.push({ x: -2.2, z: 10.8, dir: 'LEFT', type: 'bus' });
        list.push({ x: 2.2, z: 10.8, dir: 'RIGHT', type: 'bus' });
      } else if (archetype === 8) {
        // Archetype 8: ROYAL CROWN CITADEL (27 angled spire & jewel vehicles)
        list.push({ x: -3.6, z: 0.75, dir: 'UP', type: 'bus', tilt: -0.35 });
        list.push({ x: 0.0, z: 0.55, dir: 'DOWN', type: 'bus' });
        list.push({ x: 3.6, z: 0.75, dir: 'UP', type: 'bus', tilt: 0.35 });

        [-3.9, -2.2, -0.8, 0.8, 2.2, 3.9].forEach((cx, i) => {
          list.push({
            x: cx,
            z: 2.65,
            dir: i % 2 === 0 ? 'DOWN' : 'UP',
            type: 'car',
            subType: i % 2 === 0 ? 'van' : 'car',
            tilt: cx < 0 ? 0.28 : -0.28
          });
        });

        list.push({ x: -3.3, z: 4.55, dir: 'RIGHT', type: 'bus', tilt: 0.18 });
        list.push({ x: 0.0, z: 4.55, dir: 'DOWN', type: 'car', subType: 'van' });
        list.push({ x: 3.3, z: 4.55, dir: 'LEFT', type: 'bus', tilt: -0.18 });

        [-4.1, -2.5, -1.0, 1.0, 2.5, 4.1].forEach((cx, i) => {
          list.push({
            x: cx,
            z: 6.45,
            dir: i < 3 ? 'RIGHT' : 'LEFT',
            type: 'car',
            tilt: cx < 0 ? -0.32 : 0.32
          });
        });

        [-3.4, -1.2, 1.2, 3.4].forEach((cx, i) => {
          list.push({
            x: cx,
            z: 8.55,
            dir: i % 2 === 0 ? 'UP' : 'DOWN',
            type: i === 1 || i === 2 ? 'bus' : 'car'
          });
        });

        list.push({ x: -2.4, z: 10.55, dir: 'LEFT', type: 'bus', tilt: 0.14 });
        list.push({ x: 0.0, z: 10.65, dir: 'UP', type: 'car', subType: 'van' });
        list.push({ x: 2.4, z: 10.55, dir: 'RIGHT', type: 'bus', tilt: -0.14 });
      } else if (archetype === 9) {
        // Archetype 9: DOUBLE X-WING STARFIGHTER (26 diagonal cross-wing vehicles)
        [0, 1, 2].forEach((k) => {
          const d = 1.45 + k * 1.35;
          list.push({ x: -d, z: 1.0 + k * 1.25, dir: 'UP', type: k === 1 ? 'bus' : 'car', tilt: 0.65 });
          list.push({ x: d, z: 1.0 + k * 1.25, dir: 'UP', type: k === 1 ? 'bus' : 'car', tilt: -0.65 });
          list.push({ x: -d, z: 9.8 - k * 1.25, dir: 'DOWN', type: k === 1 ? 'bus' : 'car', tilt: -0.65 });
          list.push({ x: d, z: 9.8 - k * 1.25, dir: 'DOWN', type: k === 1 ? 'bus' : 'car', tilt: 0.65 });
        });

        // Central Command Spine
        [1.1, 2.8, 4.6, 6.4, 8.2, 10.0].forEach((cz, idx) => {
          list.push({
            x: 0.0,
            z: cz,
            dir: idx % 2 === 0 ? 'DOWN' : 'UP',
            type: idx === 2 || idx === 3 ? 'bus' : 'car',
            subType: 'van'
          });
        });

        // Left & Right Equatorial Wing Locks
        list.push({ x: -4.2, z: 5.4, dir: 'RIGHT', type: 'bus' });
        list.push({ x: -2.1, z: 5.4, dir: 'LEFT', type: 'car' });
        list.push({ x: 2.1, z: 5.4, dir: 'RIGHT', type: 'car' });
        list.push({ x: 4.2, z: 5.4, dir: 'LEFT', type: 'bus' });

        list.push({ x: -2.2, z: 10.8, dir: 'LEFT', type: 'car', subType: 'van' });
        list.push({ x: 2.2, z: 10.8, dir: 'RIGHT', type: 'car', subType: 'van' });
      } else if (archetype === 10) {
        // Archetype 10: HOURGLASS VORTEX (27 pinched-waist puzzle vehicles)
        [-3.6, -1.8, 0.0, 1.8, 3.6].forEach((cx, i) => {
          list.push({
            x: cx,
            z: 0.85,
            dir: i % 2 === 0 ? 'DOWN' : 'UP',
            type: i === 0 || i === 4 ? 'bus' : 'car',
            tilt: cx * -0.08
          });
        });

        [-2.8, -1.0, 1.0, 2.8].forEach((cx, i) => {
          list.push({ x: cx, z: 2.85, dir: i < 2 ? 'RIGHT' : 'LEFT', type: 'car', subType: 'van', tilt: cx * 0.12 });
        });

        // Tight Hourglass Waist
        list.push({ x: -1.8, z: 4.65, dir: 'RIGHT', type: 'bus', tilt: 0.35 });
        list.push({ x: 0.0, z: 4.65, dir: 'DOWN', type: 'car' });
        list.push({ x: 1.8, z: 4.65, dir: 'LEFT', type: 'bus', tilt: -0.35 });

        list.push({ x: -1.8, z: 6.45, dir: 'RIGHT', type: 'bus', tilt: -0.35 });
        list.push({ x: 0.0, z: 6.45, dir: 'UP', type: 'car' });
        list.push({ x: 1.8, z: 6.45, dir: 'LEFT', type: 'bus', tilt: 0.35 });

        [-2.8, -1.0, 1.0, 2.8].forEach((cx, i) => {
          list.push({ x: cx, z: 8.35, dir: i < 2 ? 'RIGHT' : 'LEFT', type: 'car', subType: 'van', tilt: cx * -0.12 });
        });

        [-3.6, -1.8, 0.0, 1.8, 3.6].forEach((cx, i) => {
          list.push({
            x: cx,
            z: 10.35,
            dir: i % 2 === 0 ? 'UP' : 'DOWN',
            type: i === 0 || i === 4 ? 'bus' : 'car',
            tilt: cx * 0.08
          });
        });
      } else {
        // Archetype 11: COLOSSEUM AMPHITHEATER RING (20 spacious concentric arena vehicles — zero core pileup!)
        const ringCount = 12;
        for (let i = 0; i < ringCount; i++) {
          const ang = (i / ringCount) * Math.PI * 2;
          const rx = Math.sin(ang) * 4.25;
          const rz = 5.65 - Math.cos(ang) * 4.65;
          const isVertical = Math.abs(Math.cos(ang)) > 0.55;
          const dir = isVertical ? (Math.cos(ang) > 0 ? 'DOWN' : 'UP') : (Math.sin(ang) > 0 ? 'LEFT' : 'RIGHT');
          list.push({
            x: Number(rx.toFixed(2)),
            z: Number(rz.toFixed(2)),
            dir,
            type: i % 4 === 0 ? 'bus' : 'car',
            subType: 'van',
            tilt: Math.sin(ang * 2) * 0.22
          });
        }

        // Inner Arena Ring (6 well-spaced vehicles at radius 2.25)
        const innerCount = 6;
        for (let i = 0; i < innerCount; i++) {
          const ang = (i / innerCount) * Math.PI * 2 + 0.52;
          const rx = Math.sin(ang) * 2.22;
          const rz = 5.65 - Math.cos(ang) * 2.38;
          const dir = i % 2 === 0 ? 'UP' : 'DOWN';
          list.push({
            x: Number(rx.toFixed(2)),
            z: Number(rz.toFixed(2)),
            dir,
            type: 'car',
            tilt: (i % 2 === 0 ? 1 : -1) * 0.25
          });
        }

        // Spacious Gladiator Center (1 center bus with wide open clearance all around!)
        list.push({ x: 0.0, z: 5.65, dir: 'UP', type: 'bus' });
      }

      if (shouldFlip && archetype !== 6) {
        list.forEach((item) => {
          if (item.dir === 'LEFT' || item.dir === 'RIGHT') {
            item.dir = flipDir(item.dir);
          }
        });
      }

      return list;
    }

    static getVehicleRotY(v) {
      let rotY = 0;
      if (v.dir === 'UP') rotY = 0;
      else if (v.dir === 'DOWN') rotY = Math.PI;
      else if (v.dir === 'LEFT') rotY = Math.PI / 2;
      else if (v.dir === 'RIGHT') rotY = -Math.PI / 2;
      if (v.tilt) rotY += v.tilt;
      return rotY;
    }

    static getVehicleForward(v) {
      const rotY = this.getVehicleRotY(v);
      return { fx: -Math.sin(rotY), fz: -Math.cos(rotY), rx: Math.cos(rotY), rz: -Math.sin(rotY) };
    }

    /**
     * Exact 2D Separating Axis Theorem (SAT) Oriented Bounding Box (OBB) overlap check
     * between two vehicles v1 and v2, including a required open breathing gap (minGap).
     * Returns { depth, ax, az } if closer than minGap, or null if separated by >= minGap.
     */
    static getPairOBBOverlap(v1, v2, minGap = 0.34) {
      const dx = v2.x - v1.x;
      const dz = v2.z - v1.z;
      // Fast bounding-circle early-out (skips 85% of non-neighbor pairs in 2 CPU ops!)
      if (dx * dx + dz * dz > 11.5) return null;

      const vec1 = this.getVehicleForward(v1);
      const vec2 = this.getVehicleForward(v2);

      // Exact physical 3D mesh half-extents + half of required open gap
      const pad = minGap * 0.5;
      const hL1 = (v1.type === 'bus' ? 1.245 : 0.895) + pad;
      const hW1 = (v1.type === 'bus' ? 0.575 : 0.535) + pad;
      const hL2 = (v2.type === 'bus' ? 1.245 : 0.895) + pad;
      const hW2 = (v2.type === 'bus' ? 0.575 : 0.535) + pad;

      const axes = [
        { x: vec1.fx, z: vec1.fz },
        { x: vec1.rx, z: vec1.rz },
        { x: vec2.fx, z: vec2.fz },
        { x: vec2.rx, z: vec2.rz }
      ];

      let minDepth = Infinity;
      let bestAx = 0;
      let bestAz = 0;

      for (let i = 0; i < 4; i++) {
        const ax = axes[i].x;
        const az = axes[i].z;
        const proj = dx * ax + dz * az;
        const r1 = hL1 * Math.abs(vec1.fx * ax + vec1.fz * az) + hW1 * Math.abs(vec1.rx * ax + vec1.rz * az);
        const r2 = hL2 * Math.abs(vec2.fx * ax + vec2.fz * az) + hW2 * Math.abs(vec2.rx * ax + vec2.rz * az);
        const overlap = (r1 + r2) - Math.abs(proj);
        if (overlap <= 0) {
          return null; // Separated by at least minGap on this axis!
        }
        if (overlap < minDepth) {
          minDepth = overlap;
          const sign = proj >= 0 ? 1 : -1;
          bestAx = ax * sign;
          bestAz = az * sign;
        }
      }

      if (bestAx === 0 && bestAz === 0) {
        bestAx = 1;
      }
      return { depth: minDepth, ax: bestAx, az: bestAz };
    }

    static hasAnyOBBOverlap(target, vList, minGap = 0.30) {
      for (let i = 0; i < vList.length; i++) {
        const other = vList[i];
        if (!other || other === target || (target.id && other.id === target.id)) continue;
        if (this.getPairOBBOverlap(target, other, minGap) !== null) {
          return true;
        }
      }
      return false;
    }

    /**
     * Universally enforces clean, open visual breathing space between all vehicles in a level
     * so no two buses/vans/cars ever touch or overlap ("thora sa khula khula ho, chipka hua na ho").
     */
    static enforceCleanVehicleSpacing(vehicles, minGap = 0.35) {
      if (!vehicles || vehicles.length <= 1) return vehicles;

      const minX = -5.12, maxX = 5.12;
      const minZ = 0.48,  maxZ = 10.85;

      const relax = (iters, gap) => {
        for (let iter = 0; iter < iters; iter++) {
          let moved = false;
          for (let i = 0; i < vehicles.length; i++) {
            for (let j = i + 1; j < vehicles.length; j++) {
              const v1 = vehicles[i];
              const v2 = vehicles[j];
              const ov = this.getPairOBBOverlap(v1, v2, gap);
              if (ov && ov.depth > 0.002) {
                moved = true;
                const push = ov.depth * 0.52;
                v1.x = Math.max(minX, Math.min(maxX, v1.x - ov.ax * push));
                v1.z = Math.max(minZ, Math.min(maxZ, v1.z - ov.az * push));
                v2.x = Math.max(minX, Math.min(maxX, v2.x + ov.ax * push));
                v2.z = Math.max(minZ, Math.min(maxZ, v2.z + ov.az * push));
              }
            }
          }
          if (!moved) break;
        }
      };

      relax(75, minGap);

      // If any cluster is still tighter than (minGap - 0.07), prune the single most-crowded vehicle and re-relax
      const strictGap = Math.max(0.26, minGap - 0.07);
      let pruneGuard = 0;
      while (vehicles.length > 8 && pruneGuard < 14) {
        pruneGuard++;
        let worstIdx = -1;
        let worstOverlapSum = 0;

        for (let i = 0; i < vehicles.length; i++) {
          let sum = 0;
          for (let j = 0; j < vehicles.length; j++) {
            if (i === j) continue;
            const ov = this.getPairOBBOverlap(vehicles[i], vehicles[j], strictGap);
            if (ov) sum += ov.depth;
          }
          if (sum > worstOverlapSum) {
            worstOverlapSum = sum;
            worstIdx = i;
          }
        }

        if (worstIdx === -1 || worstOverlapSum <= 0.01) {
          break;
        }
        vehicles.splice(worstIdx, 1);
        relax(35, minGap);
      }

      vehicles.forEach((v) => {
        v.x = Number(v.x.toFixed(2));
        v.z = Number(v.z.toFixed(2));
      });
      return vehicles;
    }

    static findBlockingVehicle(target, allVehicles) {
      // Single remaining vehicle in the lot can NEVER be jammed!
      if (!allVehicles || allVehicles.length <= 1) return null;
      const { fx, fz, rx, rz } = this.getVehicleForward(target);
      const hL1 = (target.type === 'bus' ? 2.38 : 1.64) * 0.45;
      const hW1 = (target.type === 'bus' ? 1.10 : 1.00) * 0.43;

      let closestBlocker = null;
      let minDist = Infinity;

      for (const other of allVehicles) {
        if (other.id === target.id) continue;
        const oVec = this.getVehicleForward(other);
        const hL2 = (other.type === 'bus' ? 2.38 : 1.64) * 0.45;
        const hW2 = (other.type === 'bus' ? 1.10 : 1.00) * 0.43;

        const dx = other.x - target.x;
        const dz = other.z - target.z;
        const cF = dx * fx + dz * fz;
        const cR = dx * rx + dz * rz;

        const extR = hL2 * Math.abs(oVec.fx * rx + oVec.fz * rz) + hW2 * Math.abs(oVec.rx * rx + oVec.rz * rz);
        const extF = hL2 * Math.abs(oVec.fx * fx + oVec.fz * fz) + hW2 * Math.abs(oVec.rx * fx + oVec.rz * fz);

        const latOverlap = (hW1 + extR) - Math.abs(cR);
        if (latOverlap > 0.16 && cF > 0.25 && cF + extF > hL1 * 0.36) {
          const dist = Math.max(0, cF - extF - hL1);
          if (dist < minDist) {
            minDist = dist;
            closestBlocker = other;
          }
        }
      }

      return closestBlocker;
    }

    static ensureNoCyclicDeadlock(vehicles) {
      const remaining = vehicles.map((v) => v);
      const dirs = ['UP', 'LEFT', 'RIGHT', 'DOWN'];
      const oppositeDir = (d) => (d === 'UP' ? 'DOWN' : d === 'DOWN' ? 'UP' : d === 'LEFT' ? 'RIGHT' : 'LEFT');
      let guard = 0;

      while (remaining.length > 0 && guard < 220) {
        guard++;
        const unblocked = remaining.filter((v) => !this.findBlockingVehicle(v, remaining));
        if (unblocked.length > 0) {
          for (const u of unblocked) {
            const idx = remaining.indexOf(u);
            if (idx !== -1) remaining.splice(idx, 1);
          }
          continue;
        }

        let fixed = false;
        // First try 180-degree reversal (preserves exact angled footprint without overlapping neighbors!)
        for (const v of remaining) {
          const origDir = v.dir;
          v.dir = oppositeDir(origDir);
          if (!this.findBlockingVehicle(v, remaining) && !this.hasAnyOBBOverlap(v, vehicles, 0.26)) {
            fixed = true;
            break;
          }
          v.dir = origDir;
        }

        // Next try 90-degree turns ONLY if the turned vehicle still has 0 OBB overlap with all vehicles in the lot!
        if (!fixed) {
          for (const v of remaining) {
            if (Math.abs(v.tilt || 0) > 0.25) continue;
            const origDir = v.dir;
            for (const d of dirs) {
              v.dir = d;
              if (!this.findBlockingVehicle(v, remaining) && !this.hasAnyOBBOverlap(v, vehicles, 0.28)) {
                fixed = true;
                break;
              }
            }
            if (fixed) break;
            v.dir = origDir;
          }
        }

        // Fallback: flip the outermost remaining vehicle 180° (or point outward if collision-free)
        if (!fixed) {
          remaining.sort((a, b) => Math.hypot(b.x, b.z - 5.5) - Math.hypot(a.x, a.z - 5.5));
          const outer = remaining[0];
          const flippedD = oppositeDir(outer.dir);
          outer.dir = flippedD;
          if (this.findBlockingVehicle(outer, remaining)) {
            const oldTilt = outer.tilt || 0;
            const outD = outer.z < 5.5 ? 'UP' : 'DOWN';
            outer.tilt = 0;
            outer.dir = outD;
            if (this.hasAnyOBBOverlap(outer, vehicles, 0.26)) {
              outer.tilt = oldTilt;
              outer.dir = flippedD;
            }
            // Peel outer so the solver never loops infinitely
            remaining.shift();
          }
        }
      }
    }

    /**
     * Simulates peeling unblocked vehicles and builds the exact 4-abreast passenger rows
     * for the Central Revolving Oval Ring + Left Feeder Road + Right Feeder Road,
     * plus calculates the level's Countdown Timer!
     */
    static finalizeWithRevolvingFeederQueues(levelNum, vehicles) {
      this.enforceCleanVehicleSpacing(vehicles, 0.35);
      this.ensureNoCyclicDeadlock(vehicles);
      const simRemaining = vehicles.map((v) => ({ ...v }));
      const exitSequence = [];
      const rand = this.createSeededRandom(levelNum * 4999 + 71);

      while (simRemaining.length > 0) {
        const unblocked = simRemaining.filter((v) => !this.findBlockingVehicle(v, simRemaining));
        if (unblocked.length === 0) {
          exitSequence.push(simRemaining.shift());
        } else {
          const pick = unblocked[Math.floor(rand() * unblocked.length)];
          exitSequence.push(pick);
          const idx = simRemaining.findIndex((v) => v.id === pick.id);
          simRemaining.splice(idx, 1);
        }
      }

      // Convert exitSequence capacities into rows of 4 passengers (ROW_PASSENGERS = 4)
      // Keep waveSize = 4 (~20-26 rows < 32 ring slots!) so unblocked vehicles' matching colors
      // smoothly enter the 32-row spinning loop without unfair instant-slot-lock ambushes!
      const allRows = [];
      // Progressive multi-wave passenger mixing: larger waves on higher levels require real slot planning!
      const waveSize = levelNum <= 3
        ? 3
        : Math.min(18, 6 + Math.floor((levelNum - 4) * 0.75));

      for (let w = 0; w < exitSequence.length; w += waveSize) {
        const waveVehicles = exitSequence.slice(w, w + waveSize);
        // Aggregate rows by color within each wave first so small cars don't create 1-row rainbow stripes,
        // then emit bold 4..7 row contiguous color blocks (with occasional 1-2 row accent) like the reference video!
        const colorRowCounts = {};
        const colorOrder = [];
        for (const v of waveVehicles) {
          const rows = Math.round(v.cap / ROW_PASSENGERS);
          if (rows <= 0) continue;
          if (!colorRowCounts[v.color]) {
            colorRowCounts[v.color] = 0;
            colorOrder.push(v.color);
          }
          colorRowCounts[v.color] += rows;
        }

        const waveChunks = [];
        for (const col of colorOrder) {
          let rem = colorRowCounts[col];
          while (rem > 0) {
            let chunkLen = rem;
            if (rem >= 8) {
              chunkLen = rand() < 0.75 ? 6 : 5;
            } else if (rem >= 5) {
              chunkLen = rem;
            }
            const chunk = [];
            for (let r = 0; r < chunkLen; r++) {
              chunk.push({ color: col, count: ROW_PASSENGERS });
            }
            waveChunks.push(chunk);
            rem -= chunkLen;
          }
        }

        for (let i = waveChunks.length - 1; i > 0; i--) {
          const j = Math.floor(rand() * (i + 1));
          [waveChunks[i], waveChunks[j]] = [waveChunks[j], waveChunks[i]];
        }

        for (const ch of waveChunks) {
          allRows.push(...ch);
        }
      }

      // Ensure the #1 key exit vehicle's color block is present inside the initial 32-slot oval ring so every level is 100% solvable!
      const ringWindow = Math.min(RING_SLOT_COUNT, allRows.length);
      if (levelNum <= 3) {
        const initialUnblockedColors = new Set(
          vehicles
            .filter((v) => !this.findBlockingVehicle(v, vehicles))
            .map((v) => v.color)
        );
        initialUnblockedColors.forEach((col) => {
          const inRing = allRows.slice(0, ringWindow).some((r) => r && r.color === col);
          if (!inRing) {
            const laterIdx = allRows.findIndex((r, idx) => idx >= ringWindow && r && r.color === col);
            if (laterIdx !== -1 && ringWindow > 4) {
              const tmp = allRows[ringWindow - 1];
              allRows[ringWindow - 1] = allRows[laterIdx];
              allRows[laterIdx] = tmp;
            }
          }
        });
      } else if (exitSequence.length > 0) {
        const keyCol = exitSequence[0].color;
        const keyRowsNeeded = Math.min(5, Math.round(exitSequence[0].cap / ROW_PASSENGERS));
        let curKeyInRing = allRows.slice(0, ringWindow).filter((r) => r && r.color === keyCol).length;
        for (let fIdx = ringWindow; fIdx < allRows.length && curKeyInRing < keyRowsNeeded; fIdx++) {
          if (allRows[fIdx] && allRows[fIdx].color === keyCol) {
            const rPos = Math.min(ringWindow - 1, 6 + curKeyInRing);
            if (allRows[rPos].color !== keyCol) {
              const tmp = allRows[rPos];
              allRows[rPos] = allRows[fIdx];
              allRows[fIdx] = tmp;
              curKeyInRing++;
            }
          }
        }
      }

      // First 32 rows populate the Central Revolving Oval Ring; remaining rows split into Left & Right Feeder Roads in contiguous color blocks!
      const ovalRingSlots = new Array(RING_SLOT_COUNT).fill(null);
      const initialRingCount = Math.min(RING_SLOT_COUNT, allRows.length);
      for (let i = 0; i < initialRingCount; i++) {
        ovalRingSlots[i] = allRows[i];
      }

      const leftFeederRows = [];
      const rightFeederRows = [];
      let toLeft = true;
      let idx = initialRingCount;
      while (idx < allRows.length) {
        const blockCol = allRows[idx].color;
        let runEnd = idx + 1;
        while (runEnd < allRows.length && allRows[runEnd].color === blockCol && (runEnd - idx) < 8) {
          runEnd++;
        }
        const targetFeeder = toLeft ? leftFeederRows : rightFeederRows;
        for (let k = idx; k < runEnd; k++) {
          targetFeeder.push(allRows[k]);
        }
        // Balance left and right feeder lengths
        toLeft = leftFeederRows.length <= rightFeederRows.length;
        idx = runEnd;
      }

      // Timer strictly 90s (01:30 = 1 min 30 sec) for every level as requested!
      const timeLimitSeconds = 90;

      return {
        levelNum,
        vehicles,
        ovalRingSlots,
        leftFeederRows,
        rightFeederRows,
        timeLimitSeconds
      };
    }
  }

  // =========================================================================
  // MAIN 3D GAME CONTROLLER
  // =========================================================================
  class BusFeverGame {
    constructor() {
      this.container = document.getElementById('game-container');
      this.canvas = document.getElementById('webgl-canvas');
      this.slotBadgesLayer = document.getElementById('slot-badges-layer');
      this.fxLayer = document.getElementById('floating-fx-layer');

      // Persistent Player Profile (Always starts from Level 1 -> Level 2 -> Level 3 -> ...!)
      this.profile = {
        playerName: '',
        currentLevel: 1,
        highestLevel: 1,
        coins: 140,
        boosters: {
          shuffle: 3,
          vip: 2,
          magnet: 2
        },
        levelStars: {},
        sfx: true,
        music: true,
        freeSpins: 2,
        nextFreeSpinAt: 0,
        activeMidLevelState: null
      };

      // Live Level State
      this.levelNum = 1;
      this.lotVehicles = [];
      this.movingVehicles = [];
      this.departingVehicles = [];
      this.slots = [];

      // Revolving Loop & Dual Feeder Queues State
      this.ovalRingSlots = new Array(RING_SLOT_COUNT).fill(null);
      this.leftFeederRows = [];
      this.rightFeederRows = [];
      this.ringRotationAngle = 0;     // Continuously increases every frame so oval ring revolves!
      this.levelIntroRushProgress = 0; // 0..1 intro animation when GO! gates open

      // 3D Mesh Pools
      this.ringRowMeshes = [];        // 28 groups of 4 stickmen in the oval ring
      this.leftFeederMeshes = [];     // Stickmen rows on left feeder road
      this.rightFeederMeshes = [];    // Stickmen rows on right feeder road
      (this.jumpingPassengers || []).forEach((jp) => {
        if (jp.mesh) this.passengersGroup.remove(jp.mesh);
      });
      this.jumpingPassengers = [];    // Passengers sprinting from gate into bus
      this.smokePuffs = [];           // Fluffy white exhaust smoke puffs
      this.confettiParticles = [];    // Colorful confetti bursts when bus fills
      this.shockwaves = [];

      this.totalBusesSentThisLevel = 0;
      this.totalDepartedThisLevel = 0;
      this.totalVehiclesInLevel = 0;
      if (this._extratimeInterval) { clearInterval(this._extratimeInterval); this._extratimeInterval = null; }
      this._extratimeShown = false;
      const etModal = document.getElementById('modal-extratime');
      if (etModal) etModal.classList.remove('active');
      this.levelTimeTotal = 90;
      this.levelTimeLeft = 90;
      this._lastUrgentSecond = -1;
      this.activeBoosterMode = null;
      this.isLevelOver = false;
      this.boardingCooldown = 0;
      this.emojiCooldown = 2.5;
      this._passengersReleased = false;
      this._splashStarted = false;
      // Keep 3D WebGL loop paused while Opening Splash, Loading Screen, or Home Lobby is active!
      this._inHomeLobby = true;

      this.loadSaveData();
      this.initThreeScene();
      this.bindUIEvents();

      // Run Opening Studio Splash ("TEALS") + 60-FPS Loading Screen (0% -> 100%) immediately with ZERO startup stall!
      this.runOpeningSplashSequence();

      // Warm up 3D slots, passenger mesh pools, and cached environment texture asynchronously during the loading bar!
      setTimeout(() => {
        this.initSlots();
        this.buildPassengerMeshPools();
      }, 90);
      setTimeout(() => {
        const startLvl = Math.max(1, (this.profile && this.profile.currentLevel) || 1);
        this.buildEnvironment3D(startLvl);
        this.drawLuckySpinWheel();
      }, 240);

      this.lastFrameTime = performance.now();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    ensureHomeAssetsLoaded() {
      if (this._homeNewAssets) return this._homeNewAssets;
      const loadImg = (src) => {
        const im = new Image();
        im.decoding = 'async';
        im.src = src;
        return im;
      };
      this._homeNewAssets = {
        bgImg: loadImg('home_new_bg_hd.jpg?v=74'),
        skylineFgImg: loadImg('home_skyline_fg_hd.png?v=74'),
        spotsAtlasImg: loadImg('home_spots_atlas_hd.jpg?v=54'),
        girlImg: loadImg('home_girl_hd.png?v=54'),
        spinWheelImg: loadImg('home_spin_wheel_hd.png?v=54'),
        spinOverlayImg: loadImg('home_spin_overlay_hd.png?v=54'),
        playBtnImg: loadImg('home_play_btn_hd.png?v=54')
      };
      return this._homeNewAssets;
    }

    // -----------------------------------------------------------------------
    // OPENING SPLASH SCREEN SEQUENCE (Video 00:04 - 00:27)
    // -----------------------------------------------------------------------
    runOpeningSplashSequence() {
      if (this._splashStarted) return;
      this._splashStarted = true;
      const studioEl = document.getElementById('splash-studio');
      const loadingEl = document.getElementById('splash-loading');
      const fillEl = document.getElementById('loading-fill');
      const pctEl = document.getElementById('loading-pct-text');
      const loadAudio = document.getElementById('loading-live-audio');
      const loadCanvas = document.getElementById('loading-live-canvas');

      // Preload Home Screen images during the 3.5s loading screen so Home Lobby opens 100% instantly without any blue flash!
      const homeAssets = this.ensureHomeAssetsLoaded();

      // ---------------------------------------------------------------------
      // 60-FPS REAL-TIME 3D LOADING ANIMATION ENGINE (3.5 SEC!)
      // ---------------------------------------------------------------------
      let loadingAnimActive = true;

      // Party horn confetti & sparkles emitted from the upper-deck cheering kids & golden party horn (842, 868 in 1152x2048)
      const confettiColors = ['#f43f5e', '#facc15', '#38bdf8', '#a855f7', '#4ade80', '#fb923c', '#ffffff'];
      const confettiList = [];
      for (let i = 0; i < 28; i++) {
        confettiList.push({
          phase: i / 28,
          speed: 0.65 + (i % 5) * 0.12,
          vx: 38 + ((i * 19) % 54) - 18,
          vy: -42 + ((i * 23) % 44) - 22,
          color: confettiColors[i % confettiColors.length],
          size: 8 + (i % 4) * 2.5,
          rotSpeed: (i % 2 === 0 ? 1 : -1) * (5 + (i % 4) * 2),
          shape: i % 3
        });
      }

      const drawStarGlint = (ctx, x, y, r, rot, col = '#ffffff', alpha = 1.0) => {
        if (alpha <= 0.02 || r <= 0.5) return;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = col;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const ang = (i * Math.PI) / 4;
          const rad = i % 2 === 0 ? r : r * 0.24;
          const px = Math.cos(ang) * rad;
          const py = Math.sin(ang) * rad;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      const LW = 1152;
      const LH = 2048;
      const BUF_W = 576;
      const BUF_H = 1024;

      const renderLoadingScene = (nowMs) => {
        if (!loadingAnimActive) return;
        if (loadCanvas) {
          if (loadCanvas.width !== BUF_W || loadCanvas.height !== BUF_H) {
            loadCanvas.width = BUF_W;
            loadCanvas.height = BUF_H;
          }
          const ctx = loadCanvas.getContext('2d');
          if (ctx) {
            ctx.setTransform(BUF_W / LW, 0, 0, BUF_H / LH, 0, 0);
            const t = nowMs * 0.001;

            // #splash-loading CSS background already displays loading_bg.jpg at 0 CPU cost; only clear & draw animated overlays!
            ctx.clearRect(0, 0, LW, LH);

            // 1. ROTATING GOLDEN SUNBEAMS ON TOP-RIGHT SUN (cx=1038, cy=114)
            ctx.save();
            ctx.translate(1038, 114);
            ctx.rotate(t * 0.45);
            for (let r = 0; r < 10; r++) {
              ctx.save();
              ctx.rotate((r * Math.PI * 2) / 10);
              const rg = ctx.createLinearGradient(0, 0, 145, 0);
              rg.addColorStop(0.0, 'rgba(255, 253, 210, 0.38)');
              rg.addColorStop(1.0, 'rgba(255, 253, 210, 0.0)');
              ctx.fillStyle = rg;
              ctx.beginPath();
              ctx.moveTo(18, -4);
              ctx.lineTo(145, -14);
              ctx.lineTo(145, 14);
              ctx.lineTo(18, 4);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            }
            ctx.restore();

            // 2. DIAGONAL GLOSSY MIRROR SHEEN ACROSS "BUS FEVER PARTY" 3D LOGO (cx=576, cy=242)
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(576, 242, 292, 152, 0, 0, Math.PI * 2);
            ctx.clip();
            const sheenX = Math.sin(t * 2.2) * 380;
            ctx.translate(576 + sheenX, 242);
            ctx.transform(1, 0, -0.42, 1, 0, 0);
            const sg = ctx.createLinearGradient(-95, 0, 95, 0);
            sg.addColorStop(0.0, 'rgba(255, 255, 255, 0.0)');
            sg.addColorStop(0.5, 'rgba(255, 255, 235, 0.52)');
            sg.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
            ctx.fillStyle = sg;
            ctx.fillRect(-100, -170, 200, 340);
            ctx.restore();

            // Sparkles around the 3D Logo Badge
            drawStarGlint(ctx, 336, 148, 16 * (0.5 + 0.5 * Math.sin(t * 5.2)), t * 2.5, '#fef08a', 0.92);
            drawStarGlint(ctx, 822, 162, 15 * (0.5 + 0.5 * Math.cos(t * 4.8)), -t * 2.5, '#ffffff', 0.92);
            drawStarGlint(ctx, 764, 346, 14 * (0.5 + 0.5 * Math.sin(t * 5.8 + 1)), t * 3.0, '#7dd3fc', 0.9);

            // 3. BIG BEN CLOCK TOWER HANDS TICKING (cx=475, cy=540)
            ctx.save();
            ctx.translate(475, 540);
            ctx.strokeStyle = '#475569';
            ctx.lineCap = 'round';
            ctx.lineWidth = 3.2;
            const minA = t * 0.9 - Math.PI * 0.5;
            const hrA = t * 0.15 - Math.PI * 0.2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(minA) * 16, Math.sin(minA) * 16);
            ctx.stroke();
            ctx.lineWidth = 4.0;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(hrA) * 11, Math.sin(hrA) * 11);
            ctx.stroke();
            ctx.restore();

            // 4. GOLDEN PARTY HORN 3D SOUND-WAVE RINGS & CONFETTI STREAMERS (cx=858, cy=865)
            for (let rIdx = 0; rIdx < 3; rIdx++) {
              const p = (t * 1.8 + rIdx * 0.333) % 1.0;
              const rad = 16 + p * 64;
              const aWave = (1.0 - p) * 0.88;
              ctx.save();
              ctx.translate(858, 865);
              ctx.rotate(-0.22);
              ctx.strokeStyle = rIdx % 2 === 0
                ? `rgba(254, 240, 138, ${aWave.toFixed(2)})`
                : `rgba(255, 255, 255, ${aWave.toFixed(2)})`;
              ctx.lineWidth = 4.5 * (1.0 - p * 0.4);
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.arc(0, 0, rad, -0.6, 0.6);
              ctx.stroke();
              ctx.restore();
            }

            for (let i = 0; i < confettiList.length; i++) {
              const cf = confettiList[i];
              const life = (t * cf.speed + cf.phase) % 1.0;
              const px = 858 + cf.vx * life * 1.8 + Math.sin(t * 5 + i) * 10 * life;
              const py = 865 + cf.vy * life * 1.8 + 65 * life * life;
              const cAlpha = life < 0.15 ? life / 0.15 : (1.0 - life) / 0.85;
              if (cAlpha <= 0.02) continue;

              ctx.save();
              ctx.globalAlpha = cAlpha;
              ctx.translate(px, py);
              ctx.rotate(t * cf.rotSpeed + i);
              ctx.fillStyle = cf.color;
              ctx.fillRect(-cf.size * 0.6, -cf.size * 0.28, cf.size * 1.2, cf.size * 0.56);
              ctx.restore();
            }

            // 5. WARM PULSING HEADLIGHT BEAMS & SHIMMERING 3D GOLD BUS COINS ON THE ROAD
            const hlAlpha = 0.32 + 0.18 * Math.sin(t * 5.2);
            [{ x: 636, y: 1344, r: 74 }, { x: 992, y: 1316, r: 68 }].forEach((hl) => {
              const hg = ctx.createRadialGradient(hl.x, hl.y, 6, hl.x, hl.y, hl.r);
              hg.addColorStop(0.0, `rgba(255, 252, 200, ${hlAlpha + 0.28})`);
              hg.addColorStop(0.5, `rgba(253, 224, 71, ${hlAlpha})`);
              hg.addColorStop(1.0, 'rgba(253, 224, 71, 0)');
              ctx.fillStyle = hg;
              ctx.beginPath();
              ctx.arc(hl.x, hl.y, hl.r, 0, Math.PI * 2);
              ctx.fill();
            });

            // Twinkling Golden Sparkles on the 3D Gold Bus Coins on the highway
            drawStarGlint(ctx, 370, 1520, 18 * (0.5 + 0.5 * Math.sin(t * 5.5)), t * 3, '#fef08a', 0.95);
            drawStarGlint(ctx, 566, 1632, 22 * (0.5 + 0.5 * Math.cos(t * 5.0)), -t * 3, '#ffffff', 0.95);
            drawStarGlint(ctx, 1110, 1292, 15 * (0.5 + 0.5 * Math.sin(t * 6.0 + 1)), t * 2.5, '#fef08a', 0.92);
          }
        }
        requestAnimationFrame(renderLoadingScene);
      };
      requestAnimationFrame(renderLoadingScene);

      // Helper to start the cheerful loading stereo audio (with gesture fallback if browser requires a tap)
      let removeUnmuteHooks = null;
      const startLoadingAudio = () => {
        if (!loadAudio) return;
        const allowAudio = this.profile.sfx !== false && this.profile.music !== false;
        if (!allowAudio) return;
        try {
          loadAudio.currentTime = 0;
          loadAudio.volume = 1.0;
          loadAudio.muted = false;
        } catch (e) {}

        const attachGestureUnmute = () => {
          if (removeUnmuteHooks) return;
          const onGesture = () => {
            if (loadAudio && loadingAnimActive) {
              loadAudio.muted = false;
              loadAudio.volume = 1.0;
              loadAudio.play().catch(() => {});
            }
            if (removeUnmuteHooks) removeUnmuteHooks();
          };
          const evts = ['pointerdown', 'touchstart', 'click', 'keydown'];
          evts.forEach((ev) => window.addEventListener(ev, onGesture, { capture: true, passive: true }));
          removeUnmuteHooks = () => {
            evts.forEach((ev) => window.removeEventListener(ev, onGesture, { capture: true }));
            removeUnmuteHooks = null;
          };
        };

        const playPromise = loadAudio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            attachGestureUnmute();
          });
        }
      };

      // Step 1: Show Royal Purple TEALS splash briefly, then fade to 60-FPS Live 3D Animated Loading Screen (3.5s duration!)
      setTimeout(() => {
        if (studioEl) studioEl.classList.add('hidden');
        setTimeout(() => {
          if (studioEl) studioEl.style.display = 'none';
        }, 350);

        startLoadingAudio();

        // Step 2: Smoothly animate Loading Progress Bar 0% -> 100% over 3.5 seconds ("load jo hora ha woh 3 4 sec tk ho ok")
        const durationMs = 3500;
        const startT = performance.now();
        if (fillEl) fillEl.style.transition = 'none';

        const tickLoading = (now) => {
          const elapsed = Math.max(0, now - startT);
          const rawP = Math.min(1, elapsed / durationMs);
          const eased = rawP < 0.5
            ? 2 * rawP * rawP
            : 1 - Math.pow(-2 * rawP + 2, 2) / 2;
          const pct = Math.min(100, Math.round(eased * 100));
          if (fillEl) fillEl.style.width = `${(eased * 100).toFixed(1)}%`;
          if (pctEl) pctEl.textContent = `${pct}%`;

          const homeBgReady = !!(homeAssets && homeAssets.bgImg && homeAssets.bgImg.complete && homeAssets.bgImg.naturalWidth > 0);
          if (rawP < 1 || (!homeBgReady && elapsed < durationMs + 1200)) {
            requestAnimationFrame(tickLoading);
          } else {
            // Step 3: Keep 60-FPS loading animation running WITHOUT stopping while fading smoothly into Home Lobby!
            setTimeout(() => {
              if (removeUnmuteHooks) removeUnmuteHooks();
              if (loadAudio) {
                try {
                  loadAudio.pause();
                  loadAudio.muted = true;
                } catch (e) {}
              }
              if (loadingEl) loadingEl.classList.add('hidden');
              this.openHomeScreen();
              // Only stop the offscreen loading canvas loop AFTER the fade-out transition is 100% finished
              setTimeout(() => {
                loadingAnimActive = false;
                if (loadingEl) loadingEl.style.display = 'none';
              }, 400);
            }, 90);
          }
        };
        requestAnimationFrame(tickLoading);
      }, 450);
    }

    // -----------------------------------------------------------------------
    // SAVE & LOAD SYSTEM
    // -----------------------------------------------------------------------
    loadSaveData() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.profile = { ...this.profile, ...parsed };
          this.profile.boosters = {
            shuffle: 2,
            vip: 1,
            magnet: 2,
            ...(parsed.boosters || {})
          };
          this.profile.currentLevel = Math.max(1, this.profile.currentLevel || 1);
          this.profile.highestLevel = this.profile.currentLevel;
          const rawSpins = typeof parsed.freeSpins === 'number' ? parsed.freeSpins : 2;
          this.profile.freeSpins = Math.max(0, Math.min(2, rawSpins));
          this.profile.nextFreeSpinAt = parsed.nextFreeSpinAt || 0;
        } else {
          this.profile.coins = 215;
          this.profile.boosters = { vip: 1, shuffle: 2, magnet: 2 };
        }
        if (!this.profile.avatar) this.profile.avatar = '🧑🏼';
        if (typeof this.profile.vibe !== 'boolean') this.profile.vibe = true;
        if (!this.profile.nextSuppliesAt) this.profile.nextSuppliesAt = 0;
        if (typeof this.profile.suppliesTier !== 'number') this.profile.suppliesTier = 0;
        if (typeof this.profile.passengersHelped !== 'number') this.profile.passengersHelped = 2800;
        if (typeof this.profile.gameDays !== 'number') this.profile.gameDays = 6;
        if (typeof this.profile.spinWinsProgress !== 'number') this.profile.spinWinsProgress = 1;
        if (typeof this.profile.noAds !== 'boolean') this.profile.noAds = false;
        if (!this.profile.selectedAvatarId) this.profile.selectedAvatarId = 'aviator_girl';
        if (!this.profile.claimedRanks || typeof this.profile.claimedRanks !== 'object') {
          this.profile.claimedRanks = { bronze: true };
        }
        if (!this.profile.claimedMilestones || typeof this.profile.claimedMilestones !== 'object') {
          this.profile.claimedMilestones = {};
        }
        if (this.profile.customPhotoDataUrl) {
          this._loadCustomPhotoCanvasImg(this.profile.customPhotoDataUrl);
        }

        // Restore real earned coin balance if inflated by earlier Shop demo click or mid-level Fever streak
        if (!this.profile._shopTestResetV59) {
          this.profile._shopTestResetV59 = true;
          if ((this.profile.currentLevel || 1) < 25 && (this.profile.coins || 0) > 2000) {
            this.profile.coins = 300;
            this.profile.noAds = false;
            this.profile.boosters = { vip: 1, shuffle: 2, magnet: 2 };
          }
          try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(this.profile));
          } catch (e) {}
        }
        if (!this.profile._feverCoinsFixV64) {
          this.profile._feverCoinsFixV64 = true;
          const expectedMax = 250 + Math.max(1, (this.profile.currentLevel || 1) - 1) * 50;
          if ((this.profile.currentLevel || 1) < 25 && (this.profile.coins || 0) > expectedMax) {
            this.profile.coins = 350;
          }
          try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(this.profile));
          } catch (e) {}
        }

        const savedName = localStorage.getItem('BFP_PLAYER_NAME');
        if (savedName && !this.profile.playerName) {
          this.profile.playerName = savedName;
        }
        if (!this.profile.playerName) {
          this.profile.playerName = 'player_60913';
        }
      } catch (e) {
        console.warn('Could not read save data:', e);
      }
      this.checkFreeSpinRefill(false);
      sound.sfxEnabled = this.profile.sfx !== false;
      sound.musicEnabled = this.profile.music !== false;
      sound.vibeEnabled = this.profile.vibe !== false;
      this.syncSettingsButtons();
    }

    openModal(id) {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === 'modal-win') {
        el.style.setProperty('display', 'flex', 'important');
      } else {
        el.style.removeProperty('display');
      }
      el.classList.add('active');
    }

    closeModal(id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('active');
      el.classList.remove('peeking-map');
      if (id === 'modal-win') {
        el.style.setProperty('display', 'none', 'important');
      } else {
        el.style.removeProperty('display');
      }
      if (id === 'modal-fail' && this._oosAnimFrame) {
        cancelAnimationFrame(this._oosAnimFrame);
        this._oosAnimFrame = null;
      }
    }

    // -----------------------------------------------------------------------
    // REWARDED VIDEO AD MONETIZATION ENGINE ("Ads are not available right now" when ads are off!)
    // -----------------------------------------------------------------------
    showAdsUnavailableToast(msg = 'Ads are not available right now') {
      try { sound.playCarBlocked(); } catch (e) {}

      let toast = document.getElementById('ads-unavailable-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ads-unavailable-toast';
        toast.className = 'ads-unavailable-toast';
        const container = document.getElementById('game-container') || document.body;
        container.appendChild(toast);
      }
      toast.textContent = `⚠️ ${msg}`;
      toast.classList.add('show');

      const spinModal = document.getElementById('modal-spin');
      if (spinModal && spinModal.classList.contains('active')) {
        const resEl = document.getElementById('spin-result-text');
        if (resEl) resEl.textContent = `⚠️ ${msg}`;
      }

      if (this._adsToastTimer) clearTimeout(this._adsToastTimer);
      this._adsToastTimer = setTimeout(() => {
        if (toast) toast.classList.remove('show');
      }, 2200);
    }

    playRewardedAd(onReward, placementTitle = 'Bus Fever Party — Free Reward!') {
      // Hook into native Android / AdMob / Unity / WebView ad bridge ONLY if a real ad SDK is active
      if (window.AndroidAds && typeof window.AndroidAds.showRewardedAd === 'function') {
        try {
          window.onNativeAdRewarded = () => { if (onReward) onReward(); };
          window.AndroidAds.showRewardedAd(placementTitle);
          return;
        } catch (e) {}
      }

      // Ads are not running right now -> Do NOT grant reward for free; show clear message!
      this.showAdsUnavailableToast('Ads are not available right now');
    }

    checkFreeSpinRefill(notifyToast = false) {
      const DAILY_MAX_SPINS = 10;
      const RESET_24H_MS = 24 * 60 * 60 * 1000;
      const nowMs = Date.now();

      if (
        !this.profile._dailySpinV61Init ||
        typeof this.profile.dailySpinsLeft !== 'number' ||
        isNaN(this.profile.dailySpinsLeft)
      ) {
        this.profile._dailySpinV61Init = true;
        this.profile.dailySpinsLeft = DAILY_MAX_SPINS;
        this.profile.dailySpinsResetAt = nowMs + RESET_24H_MS;
        this.saveGameProgress(false);
        return;
      }

      if (!this.profile.dailySpinsResetAt || this.profile.dailySpinsResetAt <= 0) {
        this.profile.dailySpinsResetAt = nowMs + RESET_24H_MS;
      }

      // Strictly reset to 10 every 24 hours (NEVER stack or add to remaining spins!)
      if (nowMs >= this.profile.dailySpinsResetAt) {
        this.profile.dailySpinsLeft = DAILY_MAX_SPINS;
        const cyclesPassed = Math.max(1, Math.floor((nowMs - this.profile.dailySpinsResetAt) / RESET_24H_MS) + 1);
        this.profile.dailySpinsResetAt = this.profile.dailySpinsResetAt + cyclesPassed * RESET_24H_MS;
        if (this.profile.dailySpinsResetAt <= nowMs) {
          this.profile.dailySpinsResetAt = nowMs + RESET_24H_MS;
        }
        this.updateHUD();
        this.saveGameProgress(false);
      }

      // Hard cap at 0..10 so spins can never exceed 10
      this.profile.dailySpinsLeft = Math.max(0, Math.min(DAILY_MAX_SPINS, this.profile.dailySpinsLeft));
    }

    syncSpinModalUI() {
      this.checkFreeSpinRefill(false);

      const coinEl = document.getElementById('spin-coin-count');
      if (coinEl) coinEl.textContent = `${this.profile.coins}`;

      const left = Math.max(0, Math.min(10, this.profile.dailySpinsLeft));
      const remMs = Math.max(0, (this.profile.dailySpinsResetAt || (Date.now() + 86400000)) - Date.now());
      const hrs = Math.floor(remMs / 3600000);
      const mins = Math.floor((remMs % 3600000) / 60000);

      const infoEl = document.getElementById('spin-refill-info');
      if (infoEl) {
        if (left > 0) {
          infoEl.textContent = `Daily Free Spins (${left}/10) • Resets in ${hrs}h ${mins}m`;
        } else {
          infoEl.textContent = `Next 10 Free Spins in ${hrs}h ${mins}m`;
        }
      }

      const fillEl = document.getElementById('spin-prog-fill');
      const lblEl = document.getElementById('spin-prog-label');
      if (fillEl) fillEl.style.width = `${(left / 10) * 100}%`;
      if (lblEl) lblEl.textContent = `${left}/10`;

      const btnDoSpin = document.getElementById('btn-do-spin');
      if (btnDoSpin) {
        if (left > 0) {
          btnDoSpin.style.opacity = '1';
          btnDoSpin.innerHTML = `<div style="display:flex;align-items:center;gap:6px;"><span>Free</span><span class="ad-play-circle">▶</span></div><small style="font-size:12px;font-weight:900;color:#fef08a;">${left}/10 Spins</small>`;
        } else {
          btnDoSpin.style.opacity = '0.68';
          btnDoSpin.innerHTML = `<span>0/10</span><small style="font-size:11px;font-weight:900;color:#fef08a;">${hrs}h ${mins}m</small>`;
        }
      }
    }

    getTotalRemainingPassengers() {
      let total = 0;
      for (const r of this.ovalRingSlots) {
        if (r && r.count > 0) total += r.count;
      }
      for (const r of this.leftFeederRows) {
        if (r && r.count > 0) total += r.count;
      }
      for (const r of this.rightFeederRows) {
        if (r && r.count > 0) total += r.count;
      }
      return total;
    }

    saveGameProgress(showToast = false) {
      if (this._saveDebounceTimer) {
        clearTimeout(this._saveDebounceTimer);
        this._saveDebounceTimer = null;
      }
      const doSave = () => {
        try {
          this.profile.activeMidLevelState = null;
          localStorage.setItem(SAVE_KEY, JSON.stringify(this.profile));
        } catch (e) {}
      };
      if (showToast) {
        doSave();
        this.triggerSaveToast();
      } else {
        this._saveDebounceTimer = setTimeout(doSave, 350);
      }
    }

    triggerSaveToast() {
      const toast = document.getElementById('save-toast');
      if (!toast) return;
      toast.classList.add('visible');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => toast.classList.remove('visible'), 1300);
    }

    // -----------------------------------------------------------------------
    // HOME LOBBY SCREEN, TABS, SUPPLIES & AIRPLANE SKY TRANSITION
    // -----------------------------------------------------------------------
    openHomeScreen(animateBoardingFromPrevLevel = null) {
      this._inHomeLobby = true;
      this.isLevelOver = true;
      this._passengersReleased = false;
      this.levelNum = Math.max(1, this.profile.currentLevel || 1);

      ['modal-win', 'modal-fail', 'modal-rate', 'modal-pause', 'modal-spin', 'modal-supplies', 'modal-profile'].forEach((id) => {
        this.closeModal(id);
      });

      const vipOverlay = document.getElementById('vip-selection-overlay');
      if (vipOverlay) vipOverlay.style.display = 'none';
      this.activeBoosterMode = null;

      const hud = document.getElementById('hud-layer');
      if (hud) hud.style.display = 'none';
      if (this.slotBadgesLayer) this.slotBadgesLayer.innerHTML = '';

      const homeEl = document.getElementById('home-lobby-screen');
      if (homeEl) {
        homeEl.classList.remove('hidden', 'launching');
        homeEl.style.display = 'flex';
      }

      // Clear any previous boarded passengers on upper deck
      const seats = document.querySelectorAll('#hbus-seats-grid .hbus-seat');
      seats.forEach((s) => { s.innerHTML = ''; });

      const heroBus = document.getElementById('home-double-bus');
      const liveVid = document.getElementById('home-live-bg-video');
      if (liveVid) {
        liveVid.play().catch(() => {});
      }

      if (heroBus) {
        if (animateBoardingFromPrevLevel) {
          heroBus.classList.remove('settled');
          if (liveVid) liveVid.classList.remove('settled');
          heroBus.style.animation = 'none';
          void heroBus.offsetWidth;
          heroBus.style.animation = '';
          setTimeout(() => {
            if (heroBus) heroBus.classList.add('settled');
            if (liveVid) {
              liveVid.classList.add('settled');
              liveVid.play().catch(() => {});
            }
          }, 950);
        } else {
          heroBus.classList.add('settled');
          if (liveVid) {
            liveVid.classList.add('settled');
            liveVid.play().catch(() => {});
          }
        }
      }

      this.switchHomeTab('home');
      this.updateHUD();
      this.syncSuppliesUI();
      this.startHome3DScene(animateBoardingFromPrevLevel);

      setTimeout(() => {
        this.flushPendingRewardPopups();
      }, 480);

      // If returning from winning a level, play the exact Upper-Deck Passenger Boarding & Level-Up sequence (Video 03:27 - 03:34)!
      if (animateBoardingFromPrevLevel) {
        const busLabel = document.getElementById('home-bus-level-label');
        if (busLabel) busLabel.textContent = `LEVEL ${animateBoardingFromPrevLevel}`;

        const pawnCols = [
          { pc: '#ef4444', pd: '#b91c1c' },
          { pc: '#3b82f6', pd: '#1d4ed8' },
          { pc: '#ef4444', pd: '#b91c1c' },
          { pc: '#0ea5e9', pd: '#0369a1' },
          { pc: '#22c55e', pd: '#15803d' },
          { pc: '#eab308', pd: '#a16207' }
        ];

        seats.forEach((seatEl, idx) => {
          setTimeout(() => {
            if (!this._inHomeLobby) return;
            const p = document.createElement('div');
            p.className = 'hbus-boarded-pawn';
            p.style.setProperty('--pc', pawnCols[idx % pawnCols.length].pc);
            p.style.setProperty('--pd', pawnCols[idx % pawnCols.length].pd);
            seatEl.appendChild(p);
            sound.playPassengerBoard();
          }, 420 + idx * 180);
        });

        setTimeout(() => {
          if (!this._inHomeLobby) return;
          sound.playBusDepart();
          if (busLabel) busLabel.textContent = `LEVEL ${this.profile.currentLevel || this.levelNum}`;
          seats.forEach((s) => { s.innerHTML = ''; });
          if (heroBus) {
            heroBus.classList.remove('settled');
            if (liveVid) liveVid.classList.remove('settled');
            heroBus.style.animation = 'none';
            void heroBus.offsetWidth;
            heroBus.style.animation = '';
            setTimeout(() => {
              if (heroBus) heroBus.classList.add('settled');
              if (liveVid) {
                liveVid.classList.add('settled');
                liveVid.play().catch(() => {});
              }
            }, 950);
          }
        }, 1850);
      }

      if (sound.musicEnabled) {
        sound.startHomeMusic();
      }
    }

    switchHomeTab(tabName) {
      const tabs = ['shop', 'home', 'ranks'];
      tabs.forEach((t) => {
        const btn = document.getElementById(`nav-tab-${t}`);
        if (btn) btn.classList.toggle('active', t === tabName);
        const panel = document.getElementById(`home-panel-${t}`);
        if (panel) {
          panel.style.display = t === tabName ? (t === 'home' ? 'block' : 'flex') : 'none';
        }
      });

      // Swap 3D Bottom Navigation Bar art to match active tab!
      const barImg = document.getElementById('home-bottom-bar-img');
      if (barImg) {
        if (tabName === 'shop') barImg.src = barImg.dataset.shopSrc || 'home_bottom_bar_shop.png?v=52';
        else if (tabName === 'ranks') barImg.src = barImg.dataset.ranksSrc || 'home_bottom_bar_ranks.png?v=52';
        else barImg.src = barImg.dataset.homeSrc || 'home_bottom_bar.png?v=52';
        // On 'home' tab, #home-3d-canvas renders the animated 1152x2048 bottom bar in unified coordinate space
        barImg.style.opacity = tabName === 'home' ? '0' : '1';
      }

      // Hide Home top bar when viewing full-screen Shop or Leaderboard banner tabs (Exact Video 00:27 & 00:36!)
      const topBar = document.getElementById('home-top-bar');
      if (topBar) {
        topBar.style.display = tabName === 'home' ? 'flex' : 'none';
      }

      if (tabName === 'ranks') {
        this.populateLeaderboard();
      } else if (tabName === 'shop') {
        const sc = document.getElementById('shop-coin-text');
        if (sc) sc.textContent = `${this.profile.coins}`;
      } else if (tabName === 'home') {
        this.startHome3DScene();
      }
    }

    // =========================================================================
    // REAL-TIME 60-FPS 1152x2048 RETINA-HD 3D HOME LOBBY WORLD + GLB 3D MODELS
    // - 1:1 Custom Winding Road Level Map (Spot 1..7) with Green (Completed), Blue (Current), Grey (Upcoming)
    // - Auto-Windowing (Level 8 shifts off 1 -> 2..8, Level 9 -> 3..9) + Full Interactive Road Scroll (1..5000)
    // - Drifting 3D Fluffy White Pixar Clouds behind Golden Trophy, Skyscrapers & Clock Tower
    // - Spin Wheel rotating every 1 second underneath Golden Crown Pointer
    // - Articulated 3D Girl (lrki) hopping, tilting head, blinking & sparkling beside the Red Double-Decker Bus
    // - 4 Upper-Deck Cheering Kids, Bus Driver, Station Kids, Sailboat & Ticking Clock Tower
    // - Shining 3D Green Play Button with back-and-forth diagonal Flash Sweep & lively 3D Bounce/Tilt
    // =========================================================================
    startHome3DScene() {
      const canvas = document.getElementById('home-3d-canvas');
      if (!canvas) return;

      const curLvlNow = Math.max(1, this.profile.currentLevel || this.levelNum || 1);
      if (this._lastHomeSyncLevel !== curLvlNow) {
        this._lastHomeSyncLevel = curLvlNow;
        this._homeRoadScrollOffset = 0;
        this._homeRoadScrollVel = 0;
      }
      if (typeof this._homeRoadScrollOffset !== 'number') this._homeRoadScrollOffset = 0;
      if (typeof this._homeRoadScrollVel !== 'number') this._homeRoadScrollVel = 0;
      if (typeof this._homeRoadScrollWaveT !== 'number') this._homeRoadScrollWaveT = 0;

      // Load Retina Home Assets once (preloaded during Opening Splash Sequence!)
      this.ensureHomeAssetsLoaded();

      // Bind interactive road drag, mouse wheel & level node tap handlers once
      if (!this._homeRoadEventsBound) {
        this._homeRoadEventsBound = true;
        let isDragging = false;
        let startY = 0;
        let lastY = 0;
        let startX = 0;
        let dragMoved = 0;

        const toCanvasCoords = (clientX, clientY) => {
          const rect = canvas.getBoundingClientRect();
          const cx = ((clientX - rect.left) / Math.max(1, rect.width)) * 1152;
          const cy = ((clientY - rect.top) / Math.max(1, rect.height)) * 2048;
          return { x: cx, y: cy, rectH: Math.max(1, rect.height) };
        };

        const spotCenters2x = [
          { idx: 0, cx: 336, cy: 1110, r: 84 },
          { idx: 1, cx: 516, cy: 982,  r: 82 },
          { idx: 2, cx: 756, cy: 792,  r: 82 },
          { idx: 3, cx: 623, cy: 666,  r: 76 },
          { idx: 4, cx: 732, cy: 556,  r: 72 },
          { idx: 5, cx: 621, cy: 464,  r: 68 },
          { idx: 6, cx: 466, cy: 410,  r: 65 }
        ];

        const onPointerDown = (clientX, clientY) => {
          const pt = toCanvasCoords(clientX, clientY);
          // Allow road drag anywhere in the main map area (y = 180..1500)
          if (pt.y >= 180 && pt.y <= 1520) {
            isDragging = true;
            startY = clientY;
            lastY = clientY;
            startX = clientX;
            dragMoved = 0;
            this._homeRoadScrollVel = 0;
          }
        };

        const onPointerMove = (clientX, clientY) => {
          if (!isDragging) return;
          const dy = clientY - lastY;
          lastY = clientY;
          dragMoved += Math.abs(dy) + Math.abs(clientX - startX) * 0.2;
          const rect = canvas.getBoundingClientRect();
          const scaleY = 2048 / Math.max(1, rect.height);
          // Dragging down pulls higher levels down the road; dragging up goes back toward Level 1
          const deltaLevels = (dy * scaleY) / 72;
          const curLvl = Math.max(1, this.profile.currentLevel || this.levelNum || 1);
          const defBase = Math.max(1, curLvl - 6);
          const minOffset = 1 - defBase;
          const maxOffset = 4994 - defBase;
          const prevRound = Math.round(this._homeRoadScrollOffset);
          this._homeRoadScrollOffset = Math.max(minOffset, Math.min(maxOffset, this._homeRoadScrollOffset + deltaLevels));
          this._homeRoadScrollVel = deltaLevels * 0.65;
          if (Math.round(this._homeRoadScrollOffset) !== prevRound) {
            this._homeRoadScrollWaveT = performance.now();
            if (sound && sound.playClick) sound.playClick();
          }
        };

        const onPointerUp = (clientX, clientY) => {
          if (!isDragging) return;
          isDragging = false;
          if (dragMoved < 12) {
            const pt = toCanvasCoords(clientX, clientY);
            const curLvl = Math.max(1, this.profile.currentLevel || this.levelNum || 1);
            const defBase = Math.max(1, curLvl - 6);
            const minOffset = 1 - defBase;
            const maxOffset = 4994 - defBase;

            // If user tapped the bottom navigation bar region on the canvas (y >= 1760), switch tab directly
            if (pt.y >= 1760) {
              try { sound.playButtonClick(); } catch (err) {}
              if (pt.x < 380) this.switchHomeTab('shop');
              else if (pt.x <= 772) this.switchHomeTab('home');
              else this.switchHomeTab('ranks');
              return;
            }

            // If scrolled away from Current Level, tapping the top-center "↩ Return to Lv.X" pill snaps back!
            if (pt.x >= 200 && pt.x <= 560 && pt.y >= 138 && pt.y <= 210 && Math.round(this._homeRoadScrollOffset) !== 0) {
              this._homeRoadScrollOffset = 0;
              this._homeRoadScrollVel = 0;
              this._homeRoadScrollWaveT = performance.now();
              if (sound && sound.playClick) sound.playClick();
              return;
            }

            // Check if user tapped one of the 7 Road Milestone Level Discs
            const baseLvl = Math.max(1, Math.min(4994, defBase + Math.round(this._homeRoadScrollOffset)));
            for (let i = 0; i < spotCenters2x.length; i++) {
              const sc = spotCenters2x[i];
              const dist = Math.hypot(pt.x - sc.cx, pt.y - sc.cy);
              if (dist <= sc.r) {
                const tappedLvl = baseLvl + i;
                this._homeTappedSpotIdx = i;
                this._homeTappedSpotT = performance.now();
                if (tappedLvl === curLvl) {
                  const playBtn = document.getElementById('btn-home-play');
                  if (playBtn) playBtn.click();
                } else if (tappedLvl < curLvl) {
                  this.showToast(`✅ Level ${tappedLvl} Completed! (⭐⭐⭐)`);
                  if (sound && sound.playClick) sound.playClick();
                } else {
                  this.showToast(`🔒 Complete Level ${curLvl} to reach Level ${tappedLvl}!`);
                  if (sound && sound.playClick) sound.playClick();
                }
                return;
              }
            }
          }
        };

        canvas.addEventListener('click', (e) => {
          if (dragMoved >= 12) return;
          const pt = toCanvasCoords(e.clientX, e.clientY);
          if (pt.y >= 1760) {
            try { sound.playButtonClick(); } catch (err) {}
            if (pt.x < 380) this.switchHomeTab('shop');
            else if (pt.x <= 772) this.switchHomeTab('home');
            else this.switchHomeTab('ranks');
          }
        });

        canvas.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', (e) => onPointerUp(e.clientX, e.clientY));

        canvas.addEventListener('touchstart', (e) => {
          if (e.touches && e.touches.length === 1) {
            onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }
        }, { passive: true });
        canvas.addEventListener('touchmove', (e) => {
          if (isDragging && e.touches && e.touches.length === 1) {
            onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }, { passive: true });
        canvas.addEventListener('touchend', (e) => {
          const touch = (e.changedTouches && e.changedTouches[0]) || null;
          onPointerUp(touch ? touch.clientX : startX, touch ? touch.clientY : lastY);
        }, { passive: true });

        canvas.addEventListener('wheel', (e) => {
          e.preventDefault();
          const curLvl = Math.max(1, this.profile.currentLevel || this.levelNum || 1);
          const defBase = Math.max(1, curLvl - 6);
          const minOffset = 1 - defBase;
          const maxOffset = 4994 - defBase;
          const step = e.deltaY > 0 ? 1 : -1;
          const prevRound = Math.round(this._homeRoadScrollOffset);
          this._homeRoadScrollOffset = Math.max(minOffset, Math.min(maxOffset, Math.round(this._homeRoadScrollOffset) + step));
          if (Math.round(this._homeRoadScrollOffset) !== prevRound) {
            this._homeRoadScrollWaveT = performance.now();
          }
        }, { passive: false });
      }

      if (this._home3dRaf) {
        cancelAnimationFrame(this._home3dRaf);
        this._home3dRaf = null;
      }

      // Exact 2x Retina (1152x2048) coordinates for the 7 Road Milestone Spots
      const SPOTS_2X = [
        { k: 1, x: 248, y: 1044, w: 176, h: 152, numX: 336, numY: 1115, fs: 56 },
        { k: 2, x: 428, y: 916,  w: 176, h: 152, numX: 516, numY: 987,  fs: 54 },
        { k: 3, x: 668, y: 726,  w: 176, h: 152, numX: 756, numY: 796,  fs: 54 },
        { k: 4, x: 535, y: 600,  w: 176, h: 152, numX: 623, numY: 668,  fs: 48 },
        { k: 5, x: 644, y: 484,  w: 176, h: 152, numX: 732, numY: 556,  fs: 45 },
        { k: 6, x: 533, y: 392,  w: 176, h: 152, numX: 621, numY: 464,  fs: 43 },
        { k: 7, x: 378, y: 338,  w: 176, h: 152, numX: 466, numY: 410,  fs: 40 }
      ];

      // Helper to draw a 3D Fluffy White Pixar Cloud in the sky
      const drawFluffyCloud = (ctx, cx, cy, sc, alpha = 0.96) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(sc, sc);
        ctx.globalAlpha = alpha;

        // Soft cyan-blue cloud bottom shadow
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath();
        ctx.roundRect(-88, -8, 176, 36, 18);
        ctx.fill();

        const puffs = [
          { x: -52, y: 0, r: 28 },
          { x: -20, y: -16, r: 36 },
          { x: 22, y: -12, r: 32 },
          { x: 56, y: 2, r: 26 },
          { x: 0, y: 4, r: 30 }
        ];
        ctx.fillStyle = '#e0f2fe';
        puffs.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y + 4, p.r, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = '#ffffff';
        puffs.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.96, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      };

      // Helper to draw a sparkling 4-point star glint
      const drawStarGlint = (ctx, x, y, r, rot, col = '#ffffff', alpha = 1.0) => {
        if (alpha <= 0.02 || r <= 0.5) return;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = col;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const ang = (i * Math.PI) / 4;
          const rad = i % 2 === 0 ? r : r * 0.24;
          const px = Math.cos(ang) * rad;
          const py = Math.sin(ang) * rad;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      const startT = performance.now();
      const CW = 1152;
      const CH = 2048;
      const HOME_BUF_W = 720;
      const HOME_BUF_H = 1280;

      const tickHomeCanvas = (now) => {
        const homeEl = document.getElementById('home-lobby-screen');
        const homePanel = document.getElementById('home-panel-home');
        if (
          !homeEl ||
          homeEl.classList.contains('hidden') ||
          (homePanel && homePanel.style.display === 'none')
        ) {
          this._home3dRaf = null;
          return;
        }

        if (canvas.width !== HOME_BUF_W || canvas.height !== HOME_BUF_H) {
          canvas.width = HOME_BUF_W;
          canvas.height = HOME_BUF_H;
        }

        const ctx = canvas.getContext('2d');
        ctx.setTransform(HOME_BUF_W / CW, 0, 0, HOME_BUF_H / CH, 0, 0);

        const t = (now - startT) * 0.001;
        const assets = this._homeNewAssets || {};
        const bgImg = assets.bgImg;
        const skylineFgImg = assets.skylineFgImg;
        const spotsAtlasImg = assets.spotsAtlasImg;
        const girlImg = assets.girlImg;
        const spinWheelImg = assets.spinWheelImg;
        const spinOverlayImg = assets.spinOverlayImg;
        const playBtnImg = assets.playBtnImg;

        const curLvl = Math.max(1, this.profile.currentLevel || this.levelNum || 1);
        const defBase = Math.max(1, curLvl - 6);
        const minOffset = 1 - defBase;
        const maxOffset = 4994 - defBase;

        // Apply smooth scroll inertia
        if (Math.abs(this._homeRoadScrollVel) > 0.005) {
          const prevR = Math.round(this._homeRoadScrollOffset);
          this._homeRoadScrollOffset = Math.max(minOffset, Math.min(maxOffset, this._homeRoadScrollOffset + this._homeRoadScrollVel));
          this._homeRoadScrollVel *= 0.88;
          if (Math.round(this._homeRoadScrollOffset) !== prevR) {
            this._homeRoadScrollWaveT = now;
          }
        } else {
          // Gently settle fractional scroll offset toward nearest integer level
          const targetInt = Math.round(this._homeRoadScrollOffset);
          this._homeRoadScrollOffset += (targetInt - this._homeRoadScrollOffset) * 0.18;
        }

        const baseLevel = Math.max(1, Math.min(4994, defBase + Math.round(this._homeRoadScrollOffset)));

        // =====================================================================
        // 1. BASE 2X RETINA WORLD MAP + DRIFTING 3D SKY CLOUDS BEHIND SKYLINE
        // =====================================================================
        if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
          ctx.drawImage(bgImg, 0, 0, CW, CH);
        } else {
          ctx.fillStyle = '#2b8eff';
          ctx.fillRect(0, 0, CW, CH);
        }

        // Animated Azure Sky + Moving 3D Fluffy White Clouds behind Skyline & Golden Trophy ("pichey badal move kr rey hon")
        if (skylineFgImg && skylineFgImg.complete && skylineFgImg.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, CW, 336);
          ctx.clip();

          const skyG = ctx.createLinearGradient(0, 0, 0, 336);
          skyG.addColorStop(0.0, '#1a8cff');
          skyG.addColorStop(0.55, '#47adff');
          skyG.addColorStop(1.0, '#8cd3ff');
          ctx.fillStyle = skyG;
          ctx.fillRect(0, 0, CW, 336);

          // Drifting 3D Fluffy White Clouds at multiple parallax speeds
          const clouds = [
            { baseX: 120, y: 118, speed: 34, sc: 1.05, alpha: 0.95 },
            { baseX: 560, y: 102, speed: 46, sc: 1.22, alpha: 0.98 },
            { baseX: 940, y: 128, speed: 38, sc: 0.95, alpha: 0.92 },
            { baseX: 340, y: 188, speed: 26, sc: 0.85, alpha: 0.88 },
            { baseX: 780, y: 176, speed: 31, sc: 0.90, alpha: 0.90 }
          ];
          clouds.forEach((cl, idx) => {
            const span = CW + 320;
            const cx = ((cl.baseX + t * cl.speed) % span) - 160;
            const cy = cl.y + Math.sin(t * 1.4 + idx) * 4;
            drawFluffyCloud(ctx, cx, cy, cl.sc, cl.alpha);
          });

          // Rotating Golden Sunburst Rays behind the Giant Golden Trophy Cup (cx=454, cy=210)
          ctx.save();
          ctx.translate(454, 210);
          const trophyGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, 135);
          trophyGlow.addColorStop(0.0, 'rgba(255, 248, 175, 0.95)');
          trophyGlow.addColorStop(0.5, 'rgba(253, 224, 71, 0.45)');
          trophyGlow.addColorStop(1.0, 'rgba(253, 224, 71, 0.0)');
          ctx.fillStyle = trophyGlow;
          ctx.beginPath();
          ctx.arc(0, 0, 135, 0, Math.PI * 2);
          ctx.fill();

          ctx.rotate(t * 0.55);
          for (let r = 0; r < 12; r++) {
            ctx.save();
            ctx.rotate((r * Math.PI * 2) / 12);
            const rayG = ctx.createLinearGradient(0, 0, 128, 0);
            rayG.addColorStop(0.0, 'rgba(255, 255, 210, 0.72)');
            rayG.addColorStop(1.0, 'rgba(255, 255, 210, 0.0)');
            ctx.fillStyle = rayG;
            ctx.beginPath();
            ctx.moveTo(0, -4);
            ctx.lineTo(128, -14);
            ctx.lineTo(128, 14);
            ctx.lineTo(0, 4);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
          ctx.restore();

          // Draw Foreground Skyline (Golden Trophy, Skyscrapers, Clock Tower, Avatar, Coin Pill, Gear, Supplies) OVER the drifting clouds!
          ctx.drawImage(skylineFgImg, 0, 0, CW, 340);
          ctx.restore();
        }

        // Twinkling Golden Sparkles around the Giant Golden Trophy Cup & Ticking Clock Tower Hands
        drawStarGlint(ctx, 405, 178 + Math.sin(t * 3) * 4, 13 * (0.6 + 0.4 * Math.sin(t * 5.2)), t * 1.5, '#fef08a', 0.9);
        drawStarGlint(ctx, 502, 184 + Math.cos(t * 3) * 4, 12 * (0.6 + 0.4 * Math.cos(t * 4.8)), -t * 1.5, '#ffffff', 0.9);
        drawStarGlint(ctx, 454, 152, 14 * (0.5 + 0.5 * Math.sin(t * 6.4)), t * 2.0, '#fde047', 0.85);

        // Live Ticking Clock Hands on Clock Tower face (cx=840, cy=220)
        ctx.save();
        ctx.translate(840, 220);
        ctx.strokeStyle = '#78350f';
        ctx.lineCap = 'round';
        ctx.lineWidth = 3.2;
        const minAng = t * 0.4 - Math.PI * 0.5;
        const secAng = Math.floor(t * 2) * (Math.PI / 15) - Math.PI * 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(minAng) * 14, Math.sin(minAng) * 14);
        ctx.stroke();
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(secAng) * 18, Math.sin(secAng) * 18);
        ctx.stroke();
        ctx.restore();

        // Shimmering Water Ripples & Rocking White Sailboat on the River (cx=892, cy=522)
        for (let wIdx = 0; wIdx < 4; wIdx++) {
          const wx = 860 + ((wIdx * 32 + t * 18) % 95);
          const wy = 548 + (wIdx % 2) * 14;
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 + 0.25 * Math.sin(t * 4 + wIdx)})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(wx - 12, wy);
          ctx.lineTo(wx + 12, wy);
          ctx.stroke();
        }
        if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
          ctx.save();
          const boatBob = Math.sin(t * 2.8) * 3.5;
          const boatTilt = Math.sin(t * 2.2) * 0.045;
          ctx.translate(892, 518 + boatBob);
          ctx.rotate(boatTilt);
          ctx.beginPath();
          ctx.ellipse(0, 0, 42, 48, 0, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(bgImg, 850, 470, 84, 96, -42, -48, 84, 96);
          ctx.restore();
        }

        // =====================================================================
        // 2. TOP-LEFT LIVE COIN BALANCE ("210" Pill) & AVATAR SUNGLASSES GLINT
        // =====================================================================
        const coinBalance = this.profile && typeof this.profile.coins === 'number' ? this.profile.coins : 210;
        ctx.save();
        ctx.font = '900 44px "Fredoka", "Nunito", "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#0f2547';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${coinBalance}`, 386, 94);
        ctx.restore();

        // Periodic specular glint on Top-Left Avatar (cx=103, cy=96) + Custom Selected Avatar / Uploaded Real Photo Override!
        if (this.profile && this.profile.selectedAvatarId && this.profile.selectedAvatarId !== 'aviator_girl') {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(38, 30, 128, 128, 26);
          ctx.clip();
          if (this.profile.selectedAvatarId === 'custom_photo' && this._customPhotoImg && this._customPhotoImg.complete && this._customPhotoImg.naturalWidth > 0) {
            ctx.drawImage(this._customPhotoImg, 38, 30, 128, 128);
          } else if (this.profile.selectedAvatarId === 'girl_redcap' && this._win3dAssets && this._win3dAssets.girlImg && this._win3dAssets.girlImg.complete) {
            const gbg = ctx.createRadialGradient(102, 84, 8, 102, 94, 72);
            gbg.addColorStop(0, '#7dd3fc');
            gbg.addColorStop(1, '#0284c7');
            ctx.fillStyle = gbg;
            ctx.fillRect(38, 30, 128, 128);
            ctx.drawImage(this._win3dAssets.girlImg, 40, 32, 124, 124);
          } else {
            const avSpec = PROFILE_AVATARS.find((a) => a.id === this.profile.selectedAvatarId);
            const avAtlas = this._homeNewAssets && this._homeNewAssets.avatars100AtlasImg;
            if (avSpec && avSpec.type === 'atlas100' && avAtlas && avAtlas.complete && avAtlas.naturalWidth > 0) {
              ctx.drawImage(
                avAtlas,
                avSpec.atlasCol * 160,
                avSpec.atlasRow * 160,
                160,
                160,
                38,
                30,
                128,
                128
              );
            }
          }
          ctx.lineWidth = 7;
          ctx.strokeStyle = '#f59e0b';
          ctx.strokeRect(38, 30, 128, 128);
          ctx.restore();
        }
        const avGlint = (t % 3.2) / 0.6;
        if (avGlint <= 1.0) {
          drawStarGlint(ctx, 84 + avGlint * 38, 92, 11 * Math.sin(avGlint * Math.PI), t * 3, '#ffffff', 0.9);
        }

        // =====================================================================
        // 3. RIGHT-SIDE SUPPLIES & SPIN CARDS ("spin ghum ra ho har 1 sec mn")
        // =====================================================================
        // Supplies Card: Glossy sweep across blue coin backpack + bouncing red '!' badge
        ctx.save();
        ctx.beginPath();
        ctx.arc(1035, 282, 74, 0, Math.PI * 2);
        ctx.clip();
        const supSweep = ((t * 0.85) % 2.2) - 0.5;
        if (supSweep >= 0 && supSweep <= 1.0) {
          const sx = 940 + supSweep * 210;
          const sg = ctx.createLinearGradient(sx - 35, 200, sx + 35, 360);
          sg.addColorStop(0, 'rgba(255,255,255,0)');
          sg.addColorStop(0.5, 'rgba(255,255,255,0.48)');
          sg.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = sg;
          ctx.fillRect(940, 190, 200, 180);
        }
        ctx.restore();

        // Pulsing red '!' notification ring on Supplies (cx=960, cy=214)
        const bangPulse = (t * 1.6) % 1.0;
        ctx.save();
        ctx.strokeStyle = `rgba(255, 75, 75, ${(1 - bangPulse) * 0.85})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(960, 214, 28 + bangPulse * 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // SPIN WHEEL: Smooth 360-degree continuous circular rotation ("sahi sy gool ghum ra ho")
        // Centered at exact (1036, 510) with punch-through frame overlay at (936, 396, 200, 232)!
        const spinWheelAngle = t * 2.8;

        if (spinWheelImg && spinWheelImg.complete && spinWheelImg.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(1036, 510, 62, 0, Math.PI * 2);
          ctx.clip();
          ctx.translate(1036, 510);
          ctx.rotate(spinWheelAngle);
          ctx.drawImage(spinWheelImg, -66, -66, 132, 132);
          ctx.restore();
        }

        // Exact 200x232 Punch-Through Frame Overlay (Outer Bezel, Golden Crown, Pointer, Center Gem & "Spin" Pill)
        if (spinOverlayImg && spinOverlayImg.complete && spinOverlayImg.naturalWidth > 0) {
          ctx.drawImage(spinOverlayImg, 936, 396, 200, 232);
        }

        // =====================================================================
        // 4. WINDING ROAD LEVEL NODES (1..5000): GREEN (<cur), BLUE (===cur), GREY (>cur)
        // =====================================================================
        const waveAge = (now - (this._homeRoadScrollWaveT || 0)) * 0.001;
        for (let i = 0; i < SPOTS_2X.length; i++) {
          const sp = SPOTS_2X[i];
          const lvl = baseLevel + i;
          const isCompleted = lvl < curLvl;
          const isCurrent = lvl === curLvl;
          const row = isCompleted ? 0 : (isCurrent ? 1 : 2); // 0=Green, 1=Blue, 2=Grey

          // Wave pop animation when road is scrolled or spot is tapped
          let popScale = 1.0;
          let bobY = 0;
          if (waveAge >= 0 && waveAge < 0.45) {
            const localW = Math.max(0, 1 - Math.abs(waveAge * 14 - i) * 0.45);
            popScale += localW * 0.09;
            bobY -= localW * 7;
          }
          if (this._homeTappedSpotIdx === i && (now - (this._homeTappedSpotT || 0)) < 420) {
            const tapP = (now - this._homeTappedSpotT) / 420;
            popScale += Math.sin(tapP * Math.PI) * 0.14;
          }

          // Draw exact per-spot Green / Blue / Grey Pixar 3D Disc from home_spots_atlas_hd.jpg
          if (spotsAtlasImg && spotsAtlasImg.complete && spotsAtlasImg.naturalWidth > 0) {
            ctx.drawImage(
              spotsAtlasImg,
              i * 176,
              row * 152,
              176,
              152,
              sp.x,
              sp.y,
              sp.w,
              sp.h
            );
          }

          // Special 3D Pulse Halo, Orbiting Sparkles & Floating Pointer on CURRENT BLUE LEVEL!
          if (isCurrent) {
            const curPulse = 0.5 + 0.5 * Math.sin(t * 4.5);
            bobY += Math.sin(t * 4.5) * 4.5;
            popScale *= 1.0 + 0.045 * Math.sin(t * 4.5);

            ctx.save();
            ctx.translate(sp.numX, sp.numY + 4);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.35 + 0.45 * curPulse})`;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.ellipse(0, 0, (sp.fs * 1.38) + curPulse * 11, (sp.fs * 0.85) + curPulse * 7, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            drawStarGlint(ctx, sp.numX - sp.fs * 1.15, sp.numY - sp.fs * 0.5, 13 * curPulse, t * 2.5, '#7dd3fc', 0.95);
            drawStarGlint(ctx, sp.numX + sp.fs * 1.15, sp.numY - sp.fs * 0.3, 12 * (1 - curPulse * 0.5), -t * 2.5, '#fef08a', 0.95);
          }

          // Draw crisp 3D Level Number (1..5000) on top of the disc center
          ctx.save();
          ctx.translate(sp.numX, sp.numY + bobY);
          ctx.scale(popScale, popScale);
          const digitsLen = String(lvl).length;
          const fontSize = digitsLen >= 4 ? Math.round(sp.fs * 0.68) : (digitsLen === 3 ? Math.round(sp.fs * 0.82) : sp.fs);
          ctx.font = `900 ${fontSize}px "Fredoka", "Nunito", "Segoe UI", Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const strokeCol = isCompleted ? '#0d5418' : (isCurrent ? '#0c3278' : '#3b4254');
          ctx.lineJoin = 'round';
          ctx.miterLimit = 2;

          // 3D Extruded Bottom Shadow of Number
          ctx.fillStyle = strokeCol;
          ctx.strokeStyle = strokeCol;
          ctx.lineWidth = Math.max(5, fontSize * 0.18);
          ctx.strokeText(`${lvl}`, 0, 4);
          ctx.fillText(`${lvl}`, 0, 4);

          // Main Glossy White Number Face
          ctx.strokeStyle = strokeCol;
          ctx.lineWidth = Math.max(4, fontSize * 0.15);
          ctx.strokeText(`${lvl}`, 0, 0);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${lvl}`, 0, 0);
          ctx.restore();
        }

        // Compact Floating Return Pill ONLY when user scrolls the road away from default window
        const isScrolledAway = baseLevel !== defBase;
        if (isScrolledAway) {
          ctx.save();
          const pillX = 212;
          const pillY = 144;
          const pillW = 340;
          const pillH = 54;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillW, pillH, 27);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fef08a';
          ctx.font = '900 22px "Fredoka", "Segoe UI", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`Lv.${baseLevel}–${baseLevel + 6}  •  ↩ Back to Lv.${curLvl}`, pillX + pillW * 0.5, pillY + pillH * 0.5);
          ctx.restore();
        }

        // =====================================================================
        // 5. 4 UPPER-DECK KIDS: 100% UNTOUCHED PIXAR FACES + 0% JIGGLE + 2-SEC HAPPY LAUGHING ACTIONS
        // ("jiggle hta kr bachon mn movement daldo 2 sec ki har 2 sec mn har ek bacha koj alg krey mtlb sb khus horey hon has rey ho")
        // =====================================================================
        if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
          // Each kid takes a 2.0s turn (staggered by 0.5s). During their turn, we use a pure scale >= 1.00 laugh breath
          // anchored at their center so the animated kid is ALWAYS >= 100% of the static kid footprint (0% double-hat jiggle!)
          // and their original Pixar 3D face stays 100% pure and untouched (0% face kharab!).
          const kidsSpecs = [
            { offset: 0.0, cx: 742, cy: 932, rx: 56, ry: 52, emote: 'Haha! ♪', emoteX: 742, emoteY: 858, emoteCol: '#fef08a' },
            { offset: 0.5, cx: 888, cy: 944, rx: 54, ry: 50, emote: 'Hehe! ★', emoteX: 890, emoteY: 868, emoteCol: '#7dd3fc' },
            { offset: 1.0, cx: 692, cy: 1008, rx: 54, ry: 46, emote: 'Woohoo!', emoteX: 685, emoteY: 942, emoteCol: '#86efac' },
            { offset: 1.5, cx: 848, cy: 1012, rx: 54, ry: 46, emote: 'Yay! ♥',  emoteX: 852, emoteY: 946, emoteCol: '#f9a8d4' }
          ];

          kidsSpecs.forEach((kd) => {
            const p2s = (t + kd.offset) % 2.0;
            if (p2s < 0.95) {
              const actProg = p2s / 0.95;
              const env = Math.sin(actProg * Math.PI);
              // Laugh chuckle expansion: strictly >= 1.00 so static background kid never peeks out!
              const chuckle = 0.5 + 0.5 * Math.sin(actProg * Math.PI * 5);
              const scX = 1.0 + env * (0.025 + 0.022 * chuckle);
              const scY = 1.0 + env * (0.032 + 0.028 * chuckle);

              ctx.save();
              ctx.translate(kd.cx, kd.cy);
              ctx.scale(scX, scY);
              ctx.beginPath();
              ctx.ellipse(0, 0, kd.rx, kd.ry, 0, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(
                bgImg,
                kd.cx - kd.rx, kd.cy - kd.ry, kd.rx * 2, kd.ry * 2,
                -kd.rx, -kd.ry, kd.rx * 2, kd.ry * 2
              );
              ctx.restore();

              // Floating 3D Happy Laugh Note / Emote above the kid's head
              const bFloatY = kd.emoteY - actProg * 16;
              ctx.save();
              ctx.globalAlpha = Math.min(1, env * 1.25);
              ctx.font = '900 22px "Fredoka", "Segoe UI", sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.lineWidth = 5;
              ctx.strokeStyle = '#1e1b4b';
              ctx.strokeText(kd.emote, kd.emoteX, bFloatY);
              ctx.fillStyle = kd.emoteCol;
              ctx.fillText(kd.emote, kd.emoteX, bFloatY);
              ctx.restore();
            }
          });
        }

        // =====================================================================
        // 6. DYNAMIC "LEVEL X" PERFECTLY CENTERED & ANGLED ON BUS WHITE DESTINATION BOARD (Issue 4 Fix!)
        // =====================================================================
        ctx.save();
        ctx.translate(724, 1197);
        ctx.rotate(0.068); // Exact +3.9 deg tilt slope of the white destination board!
        const lvlStr = `LEVEL ${curLvl}`;
        const busFs = lvlStr.length > 9 ? 34 : 40;
        ctx.font = `900 ${busFs}px "Fredoka", "Nunito", "Segoe UI", Arial, sans-serif`;
        ctx.fillStyle = '#0c234a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(lvlStr, 0, 0);
        ctx.restore();

        // =====================================================================
        // 7. 3-SECOND SYNCHRONIZED BUS DRIVER HORN ("POMP! POMP!") & TEACHER GESTURE REACTION
        // (100% Untouched Pixar Faces on both Driver and Teacher — 0% face kharab!)
        // =====================================================================
        const cycle3s = t % 3.0;
        const isHonk1 = cycle3s >= 0.08 && cycle3s <= 0.42;
        const isHonk2 = cycle3s >= 0.50 && cycle3s <= 0.86;
        const isHonkingNow = isHonk1 || isHonk2;
        const isHonkWindow = cycle3s >= 0.05 && cycle3s <= 1.05;

        // A) BUS DRIVER HORN PRESS MOVEMENT (Every 3 Seconds at steering wheel below driver's untouched face)
        {
          ctx.save();
          const hornPressY = isHonkingNow ? 3 : 0;
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.arc(796, 1315, 20, Math.PI * 1.12, Math.PI * 1.88);
          ctx.stroke();

          ctx.fillStyle = isHonkingNow ? '#facc15' : '#ef4444';
          ctx.strokeStyle = '#7f1d1d';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(796, 1310 + hornPressY, 10, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          if (isHonkWindow) {
            // Driver's hand presses the center steering wheel horn button at (796, 1308) twice!
            const handY = isHonkingNow ? 1308 : 1301;
            ctx.fillStyle = '#fdba8c';
            ctx.strokeStyle = '#c26d3b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(798, handY, 9, 7, -0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Expanding Golden Sound Wave Arcs ))) & "POMP! POMP!" 3D Badge radiating from the Bus Horn!
            const wProg = isHonk1 ? ((cycle3s - 0.08) / 0.34) : (isHonk2 ? ((cycle3s - 0.50) / 0.36) : -1);
            if (wProg >= 0 && wProg <= 1.0) {
              for (let rIdx = 0; rIdx < 2; rIdx++) {
                const rad = 22 + (wProg + rIdx * 0.35) * 58;
                ctx.strokeStyle = `rgba(253, 224, 71, ${(1 - wProg) * 0.95})`;
                ctx.lineWidth = 4.5;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.arc(585, 1295, rad, Math.PI * 0.72, Math.PI * 1.28);
                ctx.stroke();
              }
            }

            const popScale = isHonkingNow ? 1.08 : 0.96;
            ctx.save();
            ctx.translate(572, 1236);
            ctx.scale(popScale, popScale);
            ctx.rotate(-0.08);
            ctx.fillStyle = '#facc15';
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.roundRect(-82, -22, 164, 44, 18);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#78350f';
            ctx.font = '900 20px "Fredoka", "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cycle3s < 0.48 ? 'POMP! 📯' : 'POMP! POMP!', 0, 1);
            ctx.restore();
          }
          ctx.restore();
        }

        // Warm Glowing Headlight Beams on the Red Double-Decker Bus (flash brighter when honking!)
        const hlAlpha = isHonkingNow ? 0.75 : (0.30 + 0.12 * Math.sin(t * 5.0));
        const hlRadius = isHonkingNow ? 78 : 54;
        [{ x: 612, y: 1344 }, { x: 822, y: 1352 }].forEach((hl) => {
          const hg = ctx.createRadialGradient(hl.x, hl.y, 4, hl.x, hl.y, hlRadius);
          hg.addColorStop(0.0, `rgba(255, 252, 205, ${Math.min(1, hlAlpha + 0.25)})`);
          hg.addColorStop(0.5, `rgba(253, 224, 71, ${hlAlpha})`);
          hg.addColorStop(1.0, 'rgba(253, 224, 71, 0)');
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(hl.x, hl.y, hlRadius, 0, Math.PI * 2);
          ctx.fill();
        });

        // B) TEACHER OUTSIDE BESIDE THE BUS (100% Pristine Pixar Face — Zero 2D ovals drawn on her face or arm!)
        // When the Bus Driver honks (cycle3s in 0.35s .. 1.95s), her full intact Pixar sprite leans/turns smoothly
        // toward the Bus Driver on her right with a 3D "OK! 👋" gesture bubble, then stands 100% straight!
        {
          const isTeacherReacting = cycle3s >= 0.35 && cycle3s <= 1.95;
          if (isTeacherReacting && girlImg && girlImg.complete && girlImg.naturalWidth > 0) {
            const reactP = (cycle3s - 0.35) / (1.95 - 0.35);
            const env = Math.sin(reactP * Math.PI);

            // Scale slightly >= 1.00 (1.00..1.045) anchored at her feet (397, 1450) while leaning gently toward the Bus (+0.035 rad)
            // so her intact Pixar sprite covers 100% of her static footprint with zero double-edge and zero face distortion!
            const sc = 1.0 + env * 0.045;
            const leanRot = env * 0.038;

            ctx.save();
            ctx.translate(397, 1450);
            ctx.rotate(leanRot);
            ctx.scale(sc, sc);
            ctx.drawImage(girlImg, -73, -210, 146, 212);
            ctx.restore();

            // Clean 3D Speech/Gesture Bubble ("OK! 👋") to the upper-right of her cap (never covering her face!)
            ctx.save();
            const bPop = Math.min(1, env * 1.4);
            ctx.translate(492, 1282 - env * 6);
            ctx.scale(bPop, bPop);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.roundRect(-48, -22, 96, 44, 18);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#0f2547';
            ctx.font = '900 20px "Fredoka", "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('OK! 👋', 0, 1);
            ctx.restore();
          }
        }

        // =====================================================================
        // 7. SHINING, FLASHING, MOVING 3D GREEN PLAY BUTTON ("play button bhi chamak ra ho flash ka ana jana or hilna ho")
        // =====================================================================
        if (playBtnImg && playBtnImg.complete && playBtnImg.naturalWidth > 0) {
          const pCX = 575;
          const pCY = 1617;
          const pW = 646;
          const pH = 230;

          // Lively 3D bounce, scale heartbeat & playful rock movement
          const pBounceY = Math.sin(t * 3.8) * 7.5;
          const pScaleX = 1.022 + Math.sin(t * 3.8) * 0.026;
          const pScaleY = 1.022 - Math.sin(t * 3.8) * 0.018 + Math.cos(t * 7.6) * 0.015;
          const pTilt = Math.sin(t * 2.4) * 0.024;

          // Responsive Road Drop Shadow under Play Button
          ctx.save();
          ctx.translate(pCX, pCY + 18);
          ctx.scale(pScaleX * 0.98, 1.0);
          ctx.fillStyle = 'rgba(10, 14, 32, 0.42)';
          ctx.beginPath();
          ctx.roundRect(-pW * 0.48, -pH * 0.45, pW * 0.96, pH * 0.92, pH * 0.46);
          ctx.fill();
          ctx.restore();

          // Outer Emerald Neon Glow Aura (Zero-Blur Fast GPU Path!)
          const auraAlpha = 0.18 + 0.12 * (0.5 + 0.5 * Math.sin(t * 4.2));
          ctx.save();
          ctx.translate(pCX, pCY + pBounceY);
          ctx.rotate(pTilt);
          ctx.scale(pScaleX, pScaleY);
          ctx.fillStyle = `rgba(74, 222, 128, ${auraAlpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.roundRect(-pW * 0.515, -pH * 0.515, pW * 1.03, pH * 1.03, pH * 0.515);
          ctx.fill();

          // Draw 2x Retina 3D Glossy Green Play Button
          ctx.drawImage(playBtnImg, -pW * 0.5, -pH * 0.5, pW, pH);

          // Clip inside Play Button Pill for Back-and-Forth Diagonal Mirror Flash Sweep ("flash ka ana jana")
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(-pW * 0.485, -pH * 0.46, pW * 0.97, pH * 0.88, pH * 0.44);
          ctx.clip();

          // Smooth back-and-forth flash sweep using sine wave (ana jana!)
          const flashPos = Math.sin(t * 2.35) * (pW * 0.62);
          ctx.save();
          ctx.translate(flashPos, 0);
          ctx.transform(1, 0, -0.42, 1, 0, 0); // Diagonal slant
          const flashG = ctx.createLinearGradient(-115, 0, 115, 0);
          flashG.addColorStop(0.0, 'rgba(255, 255, 255, 0.0)');
          flashG.addColorStop(0.28, 'rgba(254, 249, 195, 0.22)');
          flashG.addColorStop(0.5, 'rgba(255, 255, 240, 0.82)');
          flashG.addColorStop(0.72, 'rgba(254, 249, 195, 0.22)');
          flashG.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
          ctx.fillStyle = flashG;
          ctx.fillRect(-120, -pH * 0.6, 240, pH * 1.2);
          ctx.restore();
          ctx.restore();

          // Twinkling Star Sparkles around Play Button Rim
          drawStarGlint(ctx, -pW * 0.42, -pH * 0.34, 18 * (0.5 + 0.5 * Math.sin(t * 5.5)), t * 2.5, '#ffffff', 0.95);
          drawStarGlint(ctx, pW * 0.41, -pH * 0.30, 16 * (0.5 + 0.5 * Math.cos(t * 5.2)), -t * 2.5, '#fef08a', 0.95);
          drawStarGlint(ctx, pW * 0.18, pH * 0.36, 15 * (0.5 + 0.5 * Math.sin(t * 6.1 + 1.5)), t * 3.0, '#ffffff', 0.9);
          ctx.restore();
        }

        // =====================================================================
        // 8. BOTTOM NAVIGATION BAR: BOUNCING 3D GIRL PORTRAIT & SHINE
        // =====================================================================
        if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
          const navGirlBob = Math.sin(t * 3.2) * 3.2;
          ctx.save();
          ctx.translate(576, 1848 + navGirlBob);
          ctx.beginPath();
          ctx.ellipse(0, 0, 86, 86, 0, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(bgImg, 576 - 86, 1848 - 86, 172, 172, -86, -86, 172, 172);
          ctx.restore();
          drawStarGlint(ctx, 514, 1882 + navGirlBob, 11 * (0.5 + 0.5 * Math.sin(t * 5)), t * 2, '#fef08a', 0.88);
          drawStarGlint(ctx, 642, 1882 + navGirlBob, 11 * (0.5 + 0.5 * Math.cos(t * 5)), -t * 2, '#fef08a', 0.88);
        }

        this._home3dRaf = requestAnimationFrame(tickHomeCanvas);
      };

      this._home3dRaf = requestAnimationFrame(tickHomeCanvas);
    }

    // -----------------------------------------------------------------------
    // 7 RANKS (BRONZE -> ACE LV.5000), MILESTONE PRIZES, REAL PHOTO UPLOAD,
    // UNLOCKABLE PROFILE AVATARS & LIVE GAME INVENTORY
    // -----------------------------------------------------------------------
    getRankForLevel(lvl = 1) {
      const n = Math.max(1, lvl || 1);
      for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
        if (n >= RANK_TIERS[i].minLvl) {
          return RANK_TIERS[i];
        }
      }
      return RANK_TIERS[0];
    }

    _loadCustomPhotoCanvasImg(dataUrl) {
      if (!dataUrl) return;
      const im = new Image();
      im.src = dataUrl;
      this._customPhotoImg = im;
    }

    syncHomeRankBadgesOnly() {
      const myLvl = Math.max(1, this.profile.currentLevel || this.levelNum || 1);
      const rk = this.getRankForLevel(myLvl);
      const nextGiftLvl = Math.ceil((myLvl + 0.1) / 5) * 5;

      const hIco = document.getElementById('home-rank-ico');
      const hName = document.getElementById('home-rank-name');
      if (hIco) hIco.innerHTML = getRankEmblemHtml(rk.id, 26);
      if (hName) hName.textContent = rk.name;

      const rIco = document.getElementById('rtsc-badge-ico');
      const rTitle = document.getElementById('rtsc-rank-title');
      const rSub = document.getElementById('rtsc-next-sub');
      if (rIco) rIco.innerHTML = getRankEmblemHtml(rk.id, 38);
      if (rTitle) rTitle.textContent = `${rk.name} Rank (Lv.${myLvl})`;
      if (rSub) rSub.textContent = `🎁 Next Milestone Prize at Level ${nextGiftLvl}`;
    }

    showRewardPopupModal(opts = {}) {
      const modal = document.getElementById('modal-reward-popup');
      if (!modal) return;

      const badgeEl = document.getElementById('rp-badge-tag');
      const titleEl = document.getElementById('rp-main-title');
      const visualEl = document.getElementById('rp-hero-visual');
      const nameEl = document.getElementById('rp-hero-name');
      const subEl = document.getElementById('rp-hero-sub');
      const prizesEl = document.getElementById('rp-extra-prizes-list');
      const equipBtn = document.getElementById('btn-rp-equip');
      const claimBtn = document.getElementById('btn-rp-claim');

      if (badgeEl) badgeEl.textContent = opts.badge || '🎉 NEW REWARD UNLOCKED!';
      if (titleEl) titleEl.textContent = opts.title || 'Congratulations!';
      if (visualEl) visualEl.innerHTML = opts.visualHtml || '🎁';
      if (nameEl) nameEl.textContent = opts.name || 'Mystery Reward';
      if (subEl) subEl.textContent = opts.sub || '';

      if (prizesEl) {
        const chips = Array.isArray(opts.chips) ? opts.chips : [];
        prizesEl.innerHTML = chips.map((c) => `<span class="rp-prize-chip">${c}</span>`).join('');
      }

      this._activeRewardAvatarId = opts.avatarId || null;
      if (equipBtn) {
        if (opts.avatarId && opts.canEquip) {
          equipBtn.style.display = 'inline-flex';
          equipBtn.textContent = opts.equipLabel || '✨ Equip & Claim!';
        } else {
          equipBtn.style.display = 'none';
        }
      }
      if (claimBtn) {
        claimBtn.textContent = opts.claimLabel || '🎁 Awesome!';
      }

      try { sound.playWinFanfare(); } catch (e) {}
      this.openModal('modal-reward-popup');
    }

    flushPendingRewardPopups() {
      if (!this._pendingRewardPopups || this._pendingRewardPopups.length === 0) return;
      const modal = document.getElementById('modal-reward-popup');
      if (modal && modal.classList.contains('active')) return;
      const nextPop = this._pendingRewardPopups.shift();
      if (nextPop) {
        this.showRewardPopupModal(nextPop);
      }
    }

    checkAndGrantLevelMilestoneAndRankPrizes(completedLevel, newCurrentLevel) {
      if (!this.profile.claimedRanks || typeof this.profile.claimedRanks !== 'object') {
        this.profile.claimedRanks = { bronze: true };
      }
      if (!this.profile.claimedMilestones || typeof this.profile.claimedMilestones !== 'object') {
        this.profile.claimedMilestones = {};
      }
      if (!this._pendingRewardPopups) {
        this._pendingRewardPopups = [];
      }

      const extraPrizeChips = [];
      let milestoneTitle = null;

      // 1. Recurring Milestone Prizes every 5 & 10 Levels (plus Level 5000 Grand Ace Jackpot!)
      if (completedLevel >= 5 && completedLevel % 5 === 0 && !this.profile.claimedMilestones[completedLevel]) {
        this.profile.claimedMilestones[completedLevel] = true;
        if (completedLevel === 5000) {
          this.profile.coins += 50000;
          this.profile.boosters.vip = (this.profile.boosters.vip || 0) + 50;
          this.profile.boosters.shuffle = (this.profile.boosters.shuffle || 0) + 50;
          this.profile.boosters.magnet = (this.profile.boosters.magnet || 0) + 50;
          milestoneTitle = 'LEVEL 5000 ACE JACKPOT!';
          extraPrizeChips.push('💰 +50,000 Coins', '🚁 +50 VIP', '🔀 +50 Shuffle', '🧲 +50 Magnet');
        } else if (completedLevel % 10 === 0) {
          this.profile.coins += 200;
          this.profile.boosters.vip = (this.profile.boosters.vip || 0) + 1;
          this.profile.boosters.shuffle = (this.profile.boosters.shuffle || 0) + 1;
          milestoneTitle = `Level ${completedLevel} Milestone Gift!`;
          extraPrizeChips.push('🪙 +200 Coins', '🚁 +1 VIP', '🔀 +1 Shuffle');
        } else {
          this.profile.coins += 100;
          const bKeys = ['vip', 'shuffle', 'magnet'];
          const bNames = { vip: '🚁 +1 VIP', shuffle: '🔀 +1 Shuffle', magnet: '🧲 +1 Magnet' };
          const pickB = bKeys[(completedLevel / 5) % bKeys.length];
          this.profile.boosters[pickB] = (this.profile.boosters[pickB] || 0) + 1;
          milestoneTitle = `Level ${completedLevel} Milestone Gift!`;
          extraPrizeChips.push('🪙 +100 Coins', bNames[pickB]);
        }
      }

      // 2. Rank-Up Promotion Prizes (Silver Lv.25, Gold Lv.75, Platinum Lv.200, Diamond Lv.500, Crown Lv.1500, Ace Lv.5000)
      let unlockedRankTier = null;
      RANK_TIERS.forEach((tier) => {
        if (tier.minLvl > 1 && (newCurrentLevel >= tier.minLvl || completedLevel >= tier.minLvl) && !this.profile.claimedRanks[tier.id]) {
          this.profile.claimedRanks[tier.id] = true;
          unlockedRankTier = tier;
          if (tier.id !== 'ace' || completedLevel !== 5000) {
            this.profile.coins += tier.coinsPrize || 0;
            this.profile.boosters.vip = (this.profile.boosters.vip || 0) + (tier.vipPrize || 0);
            this.profile.boosters.shuffle = (this.profile.boosters.shuffle || 0) + (tier.shufflePrize || 0);
            this.profile.boosters.magnet = (this.profile.boosters.magnet || 0) + (tier.magnetPrize || 0);
          }
          extraPrizeChips.push(`🏆 ${tier.name} Rank (${tier.prizeLabel})`);
        }
      });

      // 3. New Character Profile Picture Unlock strictly every 50 levels (Lv. 50, 100, 150, ..., 5000)!
      const newlyUnlockedAvatar = PROFILE_AVATARS.find(
        (a) => a.unlockLvl >= 50 && (a.unlockLvl === completedLevel || a.unlockLvl === newCurrentLevel)
      );

      if (newlyUnlockedAvatar) {
        this._pendingRewardPopups.push({
          badge: '🖼️ NEW 50-LEVEL PROFILE PIC!',
          title: `Level ${newlyUnlockedAvatar.unlockLvl} Character Unlocked!`,
          visualHtml: getAvatarVisualHtml(newlyUnlockedAvatar),
          name: newlyUnlockedAvatar.name,
          sub: `Exclusive Character Profile Pic • Lv. ${newlyUnlockedAvatar.unlockLvl}`,
          chips: extraPrizeChips.length > 0 ? extraPrizeChips : ['🖼️ Added to Profile Collection!'],
          avatarId: newlyUnlockedAvatar.id,
          canEquip: true,
          equipLabel: '✨ Equip Now!',
          claimLabel: '🎁 Keep & Close'
        });
      } else if (unlockedRankTier) {
        this._pendingRewardPopups.push({
          badge: '🏆 RANK UP PROMOTION!',
          title: `${unlockedRankTier.name} Rank Achieved!`,
          visualHtml: getRankEmblemHtml(unlockedRankTier.id, 128),
          name: `${unlockedRankTier.name} Rank`,
          sub: `Reached Level ${unlockedRankTier.minLvl}`,
          chips: extraPrizeChips,
          canEquip: false,
          claimLabel: '🏆 Claim Rank Prize!'
        });
      } else if (milestoneTitle && extraPrizeChips.length > 0) {
        const rkNow = this.getRankForLevel(newCurrentLevel);
        this._pendingRewardPopups.push({
          badge: '🎁 MILESTONE LEVEL PRIZE!',
          title: milestoneTitle,
          visualHtml: getRankEmblemHtml(rkNow.id, 124),
          name: `${rkNow.name} Milestone Chest`,
          sub: `Level ${completedLevel} Cleared!`,
          chips: extraPrizeChips,
          canEquip: false,
          claimLabel: '🎁 Claim Prize!'
        });
      }
    }

    openPlayerHub(tabName = 'profile') {
      this.syncPlayerHubUI();
      this.switchPlayerHubTab(tabName);
      this.openModal('modal-profile');
    }

    switchPlayerHubTab(tabName = 'profile') {
      const tabs = ['profile', 'inventory', 'ranks'];
      tabs.forEach((t) => {
        const btn = document.getElementById(`hub-tab-btn-${t}`);
        if (btn) btn.classList.toggle('active', t === tabName);
        const pane = document.getElementById(`hub-pane-${t}`);
        if (pane) pane.style.display = t === tabName ? 'flex' : 'none';
      });
      const titleEl = document.getElementById('profile-modal-title');
      if (titleEl) {
        titleEl.textContent = tabName === 'inventory' ? 'My Inventory' : (tabName === 'ranks' ? 'Ranks & Prizes' : 'Player Profile');
      }
    }

    syncPlayerHubUI() {
      const myLvl = Math.max(1, this.profile.currentLevel || this.levelNum || 1);
      const rk = this.getRankForLevel(myLvl);

      this.syncHomeRankBadgesOnly();

      // 1. Top Profile Stats & Custom 3D Rank Badge
      const lvlEl = document.getElementById('prof-stat-level');
      if (lvlEl) lvlEl.textContent = `${myLvl}`;
      const passEl = document.getElementById('prof-stat-passengers');
      if (passEl) {
        const ph = this.profile.passengersHelped || 2800;
        passEl.textContent = ph >= 1000 ? `${(ph / 1000).toFixed(1)}K` : `${ph}`;
      }
      const daysEl = document.getElementById('prof-stat-days');
      if (daysEl) daysEl.textContent = `${this.profile.gameDays || 6}`;
      const inp = document.getElementById('profile-name-input');
      if (inp) inp.value = this.profile.playerName || localStorage.getItem('BFP_PLAYER_NAME') || 'player_60913';

      const rkEmoji = document.getElementById('prof-rank-emoji');
      const rkLbl = document.getElementById('prof-rank-label');
      if (rkEmoji) rkEmoji.innerHTML = getRankEmblemHtml(rk.id, 24);
      if (rkLbl) rkLbl.textContent = `${rk.name} Rank`;

      // 2. Top Selected Avatar Preview (Real Photo, Starter Image Avatar, or 100 Character Atlas Portrait!)
      const artImg = document.getElementById('prof-avatar-art');
      const svgBox = document.getElementById('prof-avatar-custom-svg');
      const selId = this.profile.selectedAvatarId || 'aviator_girl';

      if (selId === 'custom_photo' && this.profile.customPhotoDataUrl) {
        if (artImg) {
          artImg.style.display = 'block';
          artImg.src = this.profile.customPhotoDataUrl;
        }
        if (svgBox) svgBox.style.display = 'none';
      } else {
        const avSpec = PROFILE_AVATARS.find((a) => a.id === selId) || PROFILE_AVATARS[0];
        if (avSpec.type === 'img') {
          if (artImg) {
            artImg.style.display = 'block';
            artImg.src = avSpec.src;
          }
          if (svgBox) svgBox.style.display = 'none';
        } else {
          if (artImg) artImg.style.display = 'none';
          if (svgBox) {
            svgBox.style.display = 'flex';
            svgBox.innerHTML = getAvatarVisualHtml(avSpec);
          }
        }
      }

      // 3. Next 50-Level Character Profile Pic & Milestone Level Prize Progress Bar
      const nextAvatarLvl = Math.min(5000, Math.ceil((myLvl + 0.1) / 50) * 50);
      const nextMilestone = Math.ceil((myLvl + 0.1) / 5) * 5;
      const prevMilestone = nextMilestone - 5;
      const progPct = Math.max(10, Math.min(100, ((myLvl - prevMilestone) / 5) * 100));
      const pmcTitle = document.getElementById('pmc-next-gift-title');
      const pmcReward = document.getElementById('pmc-next-gift-reward');
      const pmcFill = document.getElementById('pmc-bar-fill');
      if (pmcTitle) pmcTitle.textContent = `🎁 Next Gift: Lv.${nextMilestone} • Next Pic: Lv.${nextAvatarLvl}`;
      if (pmcReward) {
        pmcReward.textContent = nextMilestone === 5000
          ? '+50,000 $ & +50 Boosters!'
          : (nextMilestone % 10 === 0 ? '+200 $ & +2 Boosters' : '+100 $ & +1 Booster');
      }
      if (pmcFill) pmcFill.style.width = `${progPct}%`;

      // 4. Populate 100 Character Profile Pictures Grid (Every 50 Levels: Lv.50 -> Lv.5000 + Starter + Real Photo!)
      const avGrid = document.getElementById('prof-avatars-grid');
      const avCountEl = document.getElementById('pas-unlocked-count');
      const unlockedCount = PROFILE_AVATARS.filter((a) => myLvl >= a.unlockLvl).length + (this.profile.customPhotoDataUrl ? 1 : 0);
      const totalAvCount = PROFILE_AVATARS.length + (this.profile.customPhotoDataUrl ? 1 : 0);
      if (avCountEl) avCountEl.textContent = `${unlockedCount} / ${totalAvCount} Unlocked`;

      if (avGrid) {
        avGrid.innerHTML = '';

        // If user uploaded a real photo from phone/PC, show it as Tile #1
        if (this.profile.customPhotoDataUrl) {
          const tile = document.createElement('button');
          tile.type = 'button';
          tile.className = `avatar-unlock-tile ${selId === 'custom_photo' ? 'selected' : ''}`;
          tile.innerHTML = `
            <img src="${this.profile.customPhotoDataUrl}" alt="My Photo" />
            <span class="aut-badge">${selId === 'custom_photo' ? '✓ Active' : '📷 My Pic'}</span>
          `;
          tile.addEventListener('click', () => {
            try { sound.playButtonClick(); } catch (err) {}
            this.profile.selectedAvatarId = 'custom_photo';
            this.syncPlayerHubUI();
            this.saveGameProgress(false);
          });
          avGrid.appendChild(tile);
        }

        PROFILE_AVATARS.forEach((av) => {
          const isUnlocked = myLvl >= av.unlockLvl;
          const isSelected = selId === av.id;
          const isOrnateLegend = av.unlockLvl >= 4550;
          const tile = document.createElement('button');
          tile.type = 'button';
          tile.className = `avatar-unlock-tile ${isOrnateLegend ? 'ornate-legend-tile' : ''} ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`;
          const visualHtml = getAvatarVisualHtml(av);
          const badgeTxt = isSelected ? '✓ Active' : (isUnlocked ? `Lv.${av.unlockLvl}` : `🔒 Lv.${av.unlockLvl}`);
          tile.innerHTML = `
            ${visualHtml}
            <span class="aut-badge">${badgeTxt}</span>
          `;
          tile.addEventListener('click', () => {
            try { sound.playButtonClick(); } catch (err) {}
            if (isUnlocked) {
              this.profile.selectedAvatarId = av.id;
              this.syncPlayerHubUI();
              this.saveGameProgress(false);
              this.showRewardPopupModal({
                badge: '🖼️ CHARACTER PROFILE PICTURE',
                title: `${av.name} Equipped!`,
                visualHtml,
                name: av.name,
                sub: av.unlockLvl === 1 ? 'Starter Character Avatar' : `Unlocked at Level ${av.unlockLvl}`,
                chips: ['✓ Active on Your Profile & Leaderboard'],
                avatarId: av.id,
                canEquip: false,
                claimLabel: '👍 Awesome!'
              });
            } else {
              // Open high-res 3D Preview Popup so player can inspect any of the 100 characters up close!
              this.showRewardPopupModal({
                badge: `🔒 UNLOCKS AT LEVEL ${av.unlockLvl}`,
                title: av.name,
                visualHtml,
                name: av.name,
                sub: `50-Level Milestone Character • Reach Level ${av.unlockLvl}`,
                chips: [`🎯 ${Math.max(1, av.unlockLvl - myLvl)} Levels Left to Unlock!`, '🪙 +200 Coins & +2 Boosters'],
                avatarId: av.id,
                canEquip: false,
                claimLabel: 'Got It!'
              });
            }
          });
          avGrid.appendChild(tile);
        });
      }

      // 5. Populate TAB 2: LIVE GAME INVENTORY GRID
      const invGrid = document.getElementById('inv-items-grid');
      if (invGrid) {
        const claimedMiles = Object.keys(this.profile.claimedMilestones || {}).length;
        const spinsLeft = Math.max(0, Math.min(10, this.profile.dailySpinsLeft ?? 10));
        const invItems = [
          { ico: '💰', name: 'Gold Coins', count: `$ ${this.profile.coins || 0}`, sub: 'Unlock +Slots & Revive' },
          { ico: '🚁', name: 'VIP Helicopter', count: `×${this.profile.boosters.vip || 0}`, sub: 'Airlift Blocked Vehicle' },
          { ico: '🔀', name: 'Color Shuffle', count: `×${this.profile.boosters.shuffle || 0}`, sub: 'Relocate All Vehicles' },
          { ico: '🧲', name: 'Super Magnet', count: `×${this.profile.boosters.magnet || 0}`, sub: 'Pull Matching Passengers' },
          { ico: '🎡', name: 'Daily Free Spins', count: `${spinsLeft} / 10`, sub: 'Resets Every 24 Hours' },
          { ico: getRankEmblemHtml(rk.id, 30), name: 'Current Rank', count: rk.name, sub: `Level ${myLvl} / 5000` },
          { ico: '🖼️', name: 'Profile Pictures', count: `${unlockedCount} / ${totalAvCount}`, sub: '100 Characters (Every 50 Lv)' },
          { ico: '🎁', name: 'Milestone Gifts', count: `${claimedMiles} Won`, sub: `Next Gift at Lv.${nextMilestone}` }
        ];
        invGrid.innerHTML = invItems.map((it) => `
          <div class="inv-item-card">
            <div class="inv-item-ico">${it.ico}</div>
            <div class="inv-item-info">
              <div class="inv-item-name">${it.name}</div>
              <div class="inv-item-count">${it.count}</div>
              <div class="inv-item-sub">${it.sub}</div>
            </div>
          </div>
        `).join('');
      }

      // 6. Populate TAB 3: 7 RANKS ROADMAP & PRIZES (BRONZE -> ACE LV.5000) WITH CUSTOM 3D EMBLEMS
      const ranksListEl = document.getElementById('ranks-roadmap-list');
      if (ranksListEl) {
        ranksListEl.innerHTML = RANK_TIERS.map((tier) => {
          const isCurrent = rk.id === tier.id;
          const isUnlocked = myLvl >= tier.minLvl;
          const rangeStr = tier.id === 'ace' ? 'Level 5000 (Max Legend)' : `Level ${tier.minLvl} – ${tier.maxLvl}`;
          const statusTag = isCurrent ? '⭐ CURRENT' : (isUnlocked ? '✓ UNLOCKED' : `🔒 Lv.${tier.minLvl}`);
          return `
            <div class="rank-tier-card ${isCurrent ? 'current-rank' : ''} ${isUnlocked ? 'unlocked-rank' : ''}" data-rank-id="${tier.id}" style="cursor:pointer;">
              <div class="rtc-left">
                <div class="rtc-badge">${getRankEmblemHtml(tier.id, 38)}</div>
                <div>
                  <div class="rtc-name">${tier.name} <small style="font-size:10px;color:#2563eb;">(${statusTag})</small></div>
                  <div class="rtc-lvl">${rangeStr}</div>
                </div>
              </div>
              <div class="rtc-prize">${tier.prizeLabel}</div>
            </div>
          `;
        }).join('');

        ranksListEl.querySelectorAll('.rank-tier-card').forEach((cardEl) => {
          cardEl.addEventListener('click', () => {
            const rId = cardEl.getAttribute('data-rank-id');
            const tier = RANK_TIERS.find((t) => t.id === rId);
            if (!tier) return;
            try { sound.playButtonClick(); } catch (err) {}
            const isUnlocked = myLvl >= tier.minLvl;
            this.showRewardPopupModal({
              badge: isUnlocked ? '🏆 RANK ACHIEVED!' : `🔒 UNLOCKS AT LEVEL ${tier.minLvl}`,
              title: `${tier.name} Rank`,
              visualHtml: getRankEmblemHtml(tier.id, 128),
              name: `${tier.name} Crest`,
              sub: tier.id === 'ace' ? 'Level 5000 Supreme Legend Rank' : `Levels ${tier.minLvl} – ${tier.maxLvl}`,
              chips: [tier.prizeLabel],
              canEquip: false,
              claimLabel: isUnlocked ? '🏆 Awesome!' : 'Got It!'
            });
          });
        });
      }
    }

    populateLeaderboard() {
      this.syncHomeRankBadgesOnly();
      const lockedEl = document.getElementById('leaderboard-locked-msg');
      const list = document.getElementById('home-ranks-list');
      const myLvl = Math.max(1, this.profile.currentLevel || 1);

      // Exact Competitor Video 00:36: "Reach level 29 to unlock Leaderboard!"
      if (myLvl < 29) {
        if (lockedEl) lockedEl.style.display = 'flex';
        if (list) list.style.display = 'none';
        return;
      }

      if (lockedEl) lockedEl.style.display = 'none';
      if (!list) return;
      list.style.display = 'flex';

      const myName = this.profile.playerName || localStorage.getItem('BFP_PLAYER_NAME') || 'You';
      const myPass = Math.max(2800, this.profile.passengersHelped || (myLvl * 95));

      const rivals = [
        { name: 'Ayesha K.', lvl: 50, pass: 4950 },
        { name: 'Hamza_Pro', lvl: 44, pass: 4320 },
        { name: 'ZainRacer', lvl: 38, pass: 3760 },
        { name: 'Sara_Bus', lvl: 34, pass: 3340 },
        { name: myName + ' (You)', lvl: myLvl, pass: myPass, isMe: true },
        { name: 'Bilal_99', lvl: 31, pass: 3020 },
        { name: 'MinaPlays', lvl: 29, pass: 2810 }
      ];
      // Sort by Highest Level first, then by Total Passengers Boarded!
      rivals.sort((a, b) => (b.lvl !== a.lvl ? b.lvl - a.lvl : (b.pass || 0) - (a.pass || 0)));

      list.innerHTML = '';
      rivals.forEach((r, idx) => {
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
        const rRank = this.getRankForLevel(r.lvl);
        const passStr = (r.pass || 0) >= 1000 ? `${((r.pass || 0) / 1000).toFixed(1)}K` : `${r.pass || 0}`;
        const row = document.createElement('div');
        row.className = 'rank-row' + (r.isMe ? ' me' : '');
        row.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="min-width:26px; font-weight:900; color:#b45309;">${medal}</span>
            ${getRankEmblemHtml(rRank.id, 24)}
            <span>${r.name}</span>
          </div>
          <div style="display:flex; align-items:center; gap:5px;">
            <span style="background:#fef3c7; color:#b45309; padding:3px 7px; border-radius:999px; font-size:11px; font-weight:900;">🧍‍♂️ ${passStr}</span>
            <span style="background:#dbeafe; color:#1d4ed8; padding:3px 9px; border-radius:999px; font-size:12px; font-weight:900;">Lv.${r.lvl}</span>
          </div>
        `;
        list.appendChild(row);
      });
    }

    syncSuppliesUI() {
      const supCoins = document.getElementById('supplies-coin-count');
      if (supCoins) supCoins.textContent = `${this.profile.coins}`;

      const curTier = Math.max(0, Math.min(5, this.profile.suppliesTier || 0));
      const dot = document.getElementById('supplies-alert-dot');
      if (dot) dot.style.display = curTier < 5 ? 'flex' : 'none';

      // Update Fuel Gauge Needle angle based on tier progress
      const needle = document.getElementById('gp-gauge-needle');
      if (needle) {
        const angles = [25, 10, -8, -25, -42, -55];
        const deg = angles[Math.min(angles.length - 1, curTier)];
        const rad = (deg * Math.PI) / 180;
        const x2 = 70 + Math.cos(rad) * 32;
        const y2 = 62 - Math.sin(rad) * 32;
        needle.setAttribute('x2', String(x2.toFixed(1)));
        needle.setAttribute('y2', String(y2.toFixed(1)));
      }

      const rows = document.querySelectorAll('#gp-tiers-list .gp-tier-row');
      rows.forEach((row) => {
        const tIdx = parseInt(row.getAttribute('data-tier') || '0', 10);
        const btn = row.querySelector('.btn-gp-claim');
        row.classList.toggle('active-tier', tIdx === curTier);
        if (!btn) return;

        if (tIdx < curTier) {
          btn.className = 'btn-gp-claim claimed-tier';
          btn.innerHTML = `<span>✓ Claimed</span>`;
        } else if (tIdx === curTier) {
          btn.className = 'btn-gp-claim';
          btn.innerHTML = `<span>Free</span><span class="ad-play-circle">▶</span>`;
        } else {
          if (tIdx === 1 && curTier === 0) {
            btn.className = 'btn-gp-claim';
            btn.innerHTML = `<span>Free</span><span class="ad-play-circle">▶</span>`;
          } else {
            btn.className = 'btn-gp-claim locked-tier';
            btn.innerHTML = `<span>Free</span><span class="ad-play-circle">▶</span><span class="gp-tier-lock">🔒</span>`;
          }
        }
      });
    }

    // -----------------------------------------------------------------------
    // FLYING GOLD COINS CELEBRATION -> RETURN TO HOME LOBBY (Video 03:21 - 03:25!)
    // -----------------------------------------------------------------------
    playFlyingCoinsAndReturnHome(coinsAmount, completedLevel) {
      if (this._fwInterval) { clearInterval(this._fwInterval); this._fwInterval = null; }
      const mw = document.getElementById('modal-win');
      if (mw) {
        mw.style.setProperty('display', 'none', 'important');
        mw.classList.remove('active');
      }

      const layer = document.getElementById('flying-coins-layer');
      const targetPill = document.getElementById('flying-coin-hud-pill');
      const targetVal = document.getElementById('flying-coin-hud-val');
      const startCoins = this.profile.coins;
      const strictReward = coinsAmount === 100 ? 100 : 50;
      const endCoins = this._winCoinsClaimed ? startCoins : (startCoins + strictReward);
      this._winCoinsClaimed = true;
      this.profile.coins = endCoins;
      this.saveGameProgress(false);

      if (!layer || !targetPill) {
        this.playSkyPlaneTransition(() => {
          this.openHomeScreen(completedLevel);
        });
        return;
      }

      targetPill.style.display = 'inline-flex';
      if (targetVal) targetVal.textContent = `${startCoins}`;

      const W = this.container.clientWidth || 400;
      const H = this.container.clientHeight || 800;
      const startX = W * 0.5 - 21;
      const startY = H * 0.52 - 21;
      const destX = 28;
      const destY = 16;

      const coinCount = 8;
      for (let i = 0; i < coinCount; i++) {
        const coin = document.createElement('div');
        coin.className = 'flying-gold-coin';
        coin.textContent = '$';
        const ox = startX + (Math.random() - 0.5) * 34;
        const oy = startY + (Math.random() - 0.5) * 34;
        coin.style.left = `${ox}px`;
        coin.style.top = `${oy}px`;
        layer.appendChild(coin);

        setTimeout(() => {
          coin.style.transform = `translate(${destX - ox}px, ${destY - oy}px) scale(0.65)`;
        }, 40 + i * 55);

        setTimeout(() => {
          sound.playPassengerBoard();
          const curShown = Math.round(startCoins + ((i + 1) / coinCount) * coinsAmount);
          if (targetVal) targetVal.textContent = `${curShown}`;
          coin.remove();
        }, 620 + i * 55);
      }

      setTimeout(() => {
        targetPill.style.display = 'none';
        this.playSkyPlaneTransition(() => {
          this.openHomeScreen(completedLevel);
        });
      }, 1250);
    }

    playSkyPlaneTransition(onMidpoint) {
      const sky = document.getElementById('sky-plane-transition');
      if (!sky) {
        if (onMidpoint) onMidpoint();
        return;
      }
      sound.playSkyWhoosh();
      sky.classList.remove('exit');
      sky.classList.add('enter');

      clearTimeout(this._skyMidTimer);
      clearTimeout(this._skyEndTimer);

      this._skyMidTimer = setTimeout(() => {
        if (onMidpoint) onMidpoint();
      }, 360);

      this._skyEndTimer = setTimeout(() => {
        sky.classList.remove('enter');
        sky.classList.add('exit');
        setTimeout(() => {
          sky.classList.remove('exit');
        }, 360);
      }, 820);
    }

    enterLevelFromHome() {
      const homeEl = document.getElementById('home-lobby-screen');
      if (homeEl) homeEl.classList.add('launching');
      sound.playCarStart();

      setTimeout(() => {
        this.playSkyPlaneTransition(() => {
          this._inHomeLobby = false;
          if (homeEl) {
            homeEl.classList.add('hidden');
            homeEl.classList.remove('launching');
            homeEl.style.display = 'none';
          }
          const hud = document.getElementById('hud-layer');
          if (hud) {
            hud.style.display = 'flex';
            hud.style.opacity = '1';
          }
          this.loadLevel(this.profile.currentLevel, true);
        });
      }, 170);
    }

    startOrResumeGame() {
      this.profile.activeMidLevelState = null;
      this.openHomeScreen();
    }

    // -----------------------------------------------------------------------
    // THREE.JS SCENE & CAMERA
    // -----------------------------------------------------------------------
    initThreeScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xd7deeb);

      const width = this.container.clientWidth || 450;
      const height = this.container.clientHeight || 850;
      const aspect = width / height;

      const minWidthWorld = 15.4;
      let fHeight = 30.8;
      if (fHeight * aspect < minWidthWorld) {
        fHeight = minWidthWorld / aspect;
      }
      this.frustumHeight = fHeight;

      this.camera = new THREE.OrthographicCamera(
        (-fHeight * aspect) / 2,
        (fHeight * aspect) / 2,
        fHeight / 2,
        -fHeight / 2,
        1,
        100
      );

      this.camera.position.set(0, 25.4, 13.2);
      this.camera.lookAt(0, 0, -0.35);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        stencil: false,
        powerPreference: 'high-performance'
      });
      this.viewWidth = width;
      this.viewHeight = height;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(width, height);
      this.renderer.shadowMap.enabled = false;
      this.renderer.toneMapping = THREE.NoToneMapping;

      // Rich, Deep, Saturated 3D Studio Lighting (Zero light blowout or pale pastel wash-out!)
      const ambient = new THREE.AmbientLight(0xffffff, 0.45);
      this.scene.add(ambient);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.22);
      hemiLight.position.set(0, 30, 0);
      this.scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xfffdf5, 0.54);
      dirLight.position.set(-7, 26, 14);
      dirLight.castShadow = false;
      this.scene.add(dirLight);

      this.envGroup = new THREE.Group();
      this.slotsGroup = new THREE.Group();
      this.vehiclesGroup = new THREE.Group();
      this.passengersGroup = new THREE.Group();
      this.fxGroup = new THREE.Group();

      this.scene.add(this.envGroup);
      this.scene.add(this.slotsGroup);
      this.scene.add(this.vehiclesGroup);
      this.scene.add(this.passengersGroup);
      this.scene.add(this.fxGroup);

      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2();

      window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
      const width = this.container.clientWidth || 450;
      const height = this.container.clientHeight || 850;
      this.viewWidth = width;
      this.viewHeight = height;
      const aspect = width / height;

      const minWidthWorld = 15.4;
      let fHeight = 30.8;
      if (fHeight * aspect < minWidthWorld) {
        fHeight = minWidthWorld / aspect;
      }
      this.frustumHeight = fHeight;

      this.camera.left = (-fHeight * aspect) / 2;
      this.camera.right = (fHeight * aspect) / 2;
      this.camera.top = fHeight / 2;
      this.camera.bottom = -fHeight / 2;
      this.camera.updateProjectionMatrix();

      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(width, height);
      this.updateSlotOverlays();
    }

    // -----------------------------------------------------------------------
    // SHARED CURVED U-FEEDER GEOMETRY & STUDIO-BAKED 3D ENVIRONMENT
    // -----------------------------------------------------------------------
    getFeederCurvePoint(side, u) {
      // Quadratic Bezier from Oval Junction (u=0) around smooth elbow to Top Feeder Road (u=1+)
      const p0x = side * 3.38, p0z = -8.62;
      const p1x = side * 5.28, p1z = -9.18;
      const p2x = side * 6.05, p2z = -17.20;

      if (u <= 1) {
        const inv = 1 - u;
        const x = inv * inv * p0x + 2 * inv * u * p1x + u * u * p2x;
        const z = inv * inv * p0z + 2 * inv * u * p1z + u * u * p2z;
        const tx = 2 * inv * (p1x - p0x) + 2 * u * (p2x - p1x);
        const tz = 2 * inv * (p1z - p0z) + 2 * u * (p2z - p1z);
        const len = Math.hypot(tx, tz) || 1;
        // Normal across road width, plus forward unit tangent (-tx/len, -tz/len) pointing down road toward oval!
        return { x, z, nx: -tz / len, nz: tx / len, fx: -tx / len, fz: -tz / len };
      } else {
        const extra = u - 1;
        const tx = 2 * (p2x - p1x);
        const tz = 2 * (p2z - p1z);
        const len = Math.hypot(tx, tz) || 1;
        return {
          x: p2x + tx * extra,
          z: p2z + tz * extra,
          nx: -tz / len,
          nz: tx / len,
          fx: -tx / len,
          fz: -tz / len
        };
      }
    }

    buildEnvironment3D(levelNum = 1) {
      while (this.envGroup.children.length > 0) {
        this.envGroup.remove(this.envGroup.children[0]);
      }

      // 6 Distinct Architectural & Park Themes that evolve as you Level Up!
      const ENV_THEMES = [
        {
          name: 'Emerald Fountain Plaza',
          farGrassHex: 0x558830,
          farLotHex: 0xaab5c8,
          grassStops: ['#689e3e', '#588c32', '#4a7a28'],
          islStops: ['#629839', '#4c7b28'],
          lotStops: ['#b8c3d6', '#abb7cc', '#9ca9bf'],
          roadStops: ['#494f60', '#414757', '#3b404f'],
          curbTop: '#eef3fb',
          curbSide: '#97a2b8',
          dappleRgba: 'rgba(134, 198, 78, 0.22)',
          archType: 'fountain'
        },
        {
          name: 'Golden Sunset Palm Resort',
          farGrassHex: 0x6d7c24,
          farLotHex: 0xc2b29b,
          grassStops: ['#879634', '#728228', '#5e6e1e'],
          islStops: ['#7c8c2e', '#617020'],
          lotStops: ['#d1c2ab', '#c4b39b', '#b3a188'],
          roadStops: ['#4d4754', '#433e4a', '#393540'],
          curbTop: '#fff7e6',
          curbSide: '#b8a68e',
          dappleRgba: 'rgba(250, 204, 21, 0.22)',
          archType: 'palm_oasis'
        },
        {
          name: 'Sakura Cherry Blossom Temple',
          farGrassHex: 0x458248,
          farLotHex: 0xb5b2c8,
          grassStops: ['#559658', '#468549', '#39733c'],
          islStops: ['#508f53', '#3d7840'],
          lotStops: ['#c5c2d8', '#b6b3ca', '#a5a1ba'],
          roadStops: ['#48475c', '#3f3e52', '#363547'],
          curbTop: '#fdf2f8',
          curbSide: '#a89fb8',
          dappleRgba: 'rgba(244, 114, 182, 0.20)',
          archType: 'sakura_torii'
        },
        {
          name: 'Royal Castle Kingdom',
          farGrassHex: 0x5c7526,
          farLotHex: 0xb0a99f,
          grassStops: ['#708a32', '#5f7827', '#4e651d'],
          islStops: ['#6a842e', '#536b20'],
          lotStops: ['#c2bbb0', '#b3aca0', '#a39b8e'],
          roadStops: ['#454854', '#3c3f4a', '#333640'],
          curbTop: '#f5f3ed',
          curbSide: '#9e988e',
          dappleRgba: 'rgba(251, 146, 60, 0.22)',
          archType: 'castle_kingdom'
        },
        {
          name: 'Carnival Starlight Garden',
          farGrassHex: 0x3b854e,
          farLotHex: 0xaab8cc,
          grassStops: ['#4ea163', '#3f8e53', '#327a44'],
          islStops: ['#48995d', '#357d47'],
          lotStops: ['#b8c6da', '#aab8cd', '#9aa9bf'],
          roadStops: ['#464c5e', '#3e4454', '#373c4b'],
          curbTop: '#f4f7fd',
          curbSide: '#96a2b8',
          dappleRgba: 'rgba(250, 204, 21, 0.22)',
          archType: 'cyber_neon'
        },
        {
          name: 'Royal Rose Botanical Garden',
          farGrassHex: 0x46883c,
          farLotHex: 0xaebbc9,
          grassStops: ['#599e4c', '#4a8c3e', '#3c7a31'],
          islStops: ['#539647', '#3f7c34'],
          lotStops: ['#bccad8', '#aebcc9', '#9eaab9'],
          roadStops: ['#474e5e', '#3e4554', '#363c49'],
          curbTop: '#f4f8ff',
          curbSide: '#94a5b8',
          dappleRgba: 'rgba(134, 239, 172, 0.22)',
          archType: 'alpine_crystal'
        }
      ];

      const themeIdx = (Math.max(1, levelNum) - 1) % ENV_THEMES.length;
      const theme = ENV_THEMES[themeIdx];
      this._builtEnvLevelNum = levelNum;

      // Ultra-wide fallback planes (MeshBasicMaterial so lighting never blows out colors)
      const farGrass = new THREE.Mesh(
        new THREE.PlaneGeometry(140, 40),
        new THREE.MeshBasicMaterial({ color: theme.farGrassHex })
      );
      farGrass.rotation.x = -Math.PI / 2;
      farGrass.position.set(0, -0.02, -20.72);
      farGrass.matrixAutoUpdate = false;
      farGrass.updateMatrix();
      this.envGroup.add(farGrass);

      const farLot = new THREE.Mesh(
        new THREE.PlaneGeometry(140, 50),
        new THREE.MeshBasicMaterial({ color: theme.farLotHex })
      );
      farLot.rotation.x = -Math.PI / 2;
      farLot.position.set(0, -0.02, 24.28);
      farLot.matrixAutoUpdate = false;
      farLot.updateMatrix();
      this.envGroup.add(farLot);

      const worldW = 28;
      const worldD = 48;
      const centerZ = 2.0; // spans z: [-22, +26]

      if (!this._groundTexCache) this._groundTexCache = {};
      let groundTex = this._groundTexCache[themeIdx];

      if (!groundTex) {
        // Fast Studio-Baked Ground Texture (36 px/unit = 1008x1728, zero CPU shadowBlur stall, cached per theme!)
        const S = 36;
        const cw = worldW * S; // 1008
        const ch = worldD * S; // 1728

        const canvas = document.createElement('canvas');
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');

        const px = (wx) => (wx + worldW * 0.5) * S;
        const py = (wz) => (wz - (centerZ - worldD * 0.5)) * S;
        const curbY = py(-0.72);

        // 1. Top Rich Deep Park Lawn (z < -0.72)
        const grassGrad = ctx.createLinearGradient(0, py(-18), 0, curbY);
        grassGrad.addColorStop(0, theme.grassStops[0]);
        grassGrad.addColorStop(0.55, theme.grassStops[1]);
        grassGrad.addColorStop(1, theme.grassStops[2]);
        ctx.fillStyle = grassGrad;
        ctx.fillRect(0, 0, cw, curbY + 2);

        // Soft sunlit lawn dapples
        const dappleSpots = [
          [0, -13.5, 4.5],
          [-6.2, -7.2, 2.8],
          [6.2, -7.2, 2.8]
        ];
        dappleSpots.forEach(([gx, gz, gr]) => {
          const rg = ctx.createRadialGradient(px(gx), py(gz), 0, px(gx), py(gz), gr * S);
          rg.addColorStop(0, theme.dappleRgba);
          rg.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
          ctx.fillStyle = rg;
          ctx.beginPath();
          ctx.arc(px(gx), py(gz), gr * S, 0, Math.PI * 2);
          ctx.fill();
        });

        // Tiny scattered park wildflowers / petals on lawn
        const drawTinyCluster = (fx, fz) => {
          const pts = [[0, 0], [-0.19, 0.11], [0.18, 0.13], [-0.12, -0.16], [0.15, -0.12]];
          pts.forEach(([ox, oz], idx) => {
            const cxp = px(fx + ox);
            const cyp = py(fz + oz);
            ctx.fillStyle = theme.archType === 'sakura_torii'
              ? 'rgba(251, 207, 232, 0.92)'
              : idx % 2 === 0 ? 'rgba(255,255,255,0.88)' : 'rgba(254,240,138,0.85)';
            ctx.beginPath();
            ctx.arc(cxp, cyp, 2.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = theme.archType === 'sakura_torii' ? '#ec4899' : '#eab308';
            ctx.beginPath();
            ctx.arc(cxp, cyp, 0.9, 0, Math.PI * 2);
            ctx.fill();
          });
        };
        drawTinyCluster(-2.55, -12.1);
        drawTinyCluster(2.55, -12.1);
        drawTinyCluster(-3.45, -14.2);
        drawTinyCluster(3.45, -14.2);
        drawTinyCluster(-6.55, -11.4);
        drawTinyCluster(6.55, -11.4);

        // 2. Lower Rich Parking Lot Plaza (z >= -0.72)
        const lotGrad = ctx.createLinearGradient(0, curbY, 0, py(16));
        lotGrad.addColorStop(0, theme.lotStops[0]);
        lotGrad.addColorStop(0.45, theme.lotStops[1]);
        lotGrad.addColorStop(1, theme.lotStops[2]);
        ctx.fillStyle = lotGrad;
        ctx.fillRect(0, curbY, cw, ch - curbY);

        // 3. Multi-Pass Seamless Connected Road Network (U-Feeders + Oval + Gate + Boarding Bay)
        const traceFeederPath = (side, yOff = 0) => {
          ctx.beginPath();
          const steps = 32;
          for (let i = 0; i <= steps; i++) {
            const u = (i / steps) * 1.35;
            const pt = this.getFeederCurvePoint(side, u);
            const x = px(pt.x);
            const y = py(pt.z) + yOff;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
        };

        const traceBoardingBay = (expandWorld = 0, yOff = 0) => {
          const e = expandWorld;
          const topZ = -5.42 - e;
          const botZ = -0.70 + e * 0.2;
          ctx.beginPath();
          ctx.moveTo(px(-14.2), py(botZ) + yOff);
          ctx.lineTo(px(-8.4 - e), py(-2.45 - e * 0.5) + yOff);
          ctx.quadraticCurveTo(
            px(-6.65 - e),
            py(topZ) + yOff,
            px(-4.95),
            py(topZ) + yOff
          );
          ctx.lineTo(px(4.95), py(topZ) + yOff);
          ctx.quadraticCurveTo(
            px(6.65 + e),
            py(topZ) + yOff,
            px(8.4 + e),
            py(-2.45 - e * 0.5) + yOff
          );
          ctx.lineTo(px(14.2), py(botZ) + yOff);
          ctx.lineTo(px(14.2), py(-0.68) + yOff);
          ctx.lineTo(px(-14.2), py(-0.68) + yOff);
          ctx.closePath();
        };

        const paintUnifiedRoadLayer = (expandWorld, colorOrGrad, yOff = 0) => {
          ctx.save();
          ctx.fillStyle = colorOrGrad;
          ctx.strokeStyle = colorOrGrad;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          const feederWidthPx = (2.02 + expandWorld * 2) * S;
          ctx.lineWidth = feederWidthPx;
          traceFeederPath(-1, yOff);
          ctx.stroke();
          traceFeederPath(1, yOff);
          ctx.stroke();

          // Central Oval Outer Footprint
          ctx.beginPath();
          ctx.ellipse(
            px(0),
            py(-8.55) + yOff,
            (4.36 + expandWorld) * S,
            (2.96 + expandWorld) * S,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Bottom Gate Neck connecting Oval Loop into Boarding Bay
          const neckHalfW = (0.98 + expandWorld) * S;
          ctx.beginPath();
          ctx.roundRect(
            px(0) - neckHalfW,
            py(-6.65) + yOff,
            neckHalfW * 2,
            (1.65 + expandWorld) * S,
            6
          );
          ctx.fill();

          // Flared Boarding Bay
          traceBoardingBay(expandWorld, yOff);
          ctx.fill();
          ctx.restore();
        };

        // Pass 1: Soft outer ambient shadow on the lawn (zero CPU shadowBlur!)
        paintUnifiedRoadLayer(0.27, 'rgba(18, 34, 10, 0.25)', 3.5);
        // Pass 2: 3D concrete curb side bevel
        paintUnifiedRoadLayer(0.23, theme.curbSide, 2.5);
        // Pass 3: Crisp raised white concrete curb top
        paintUnifiedRoadLayer(0.22, theme.curbTop, 0);
        // Pass 4: Subtle dark inner curb shadow lip on asphalt
        paintUnifiedRoadLayer(0.02, '#2d323e', 1.5);
        // Pass 5: Deep Dark Slate-Charcoal Asphalt fill across entire connected network!
        const roadGrad = ctx.createLinearGradient(0, py(-15), 0, curbY);
        roadGrad.addColorStop(0, theme.roadStops[0]);
        roadGrad.addColorStop(0.55, theme.roadStops[1]);
        roadGrad.addColorStop(1, theme.roadStops[2]);
        paintUnifiedRoadLayer(0.0, roadGrad, 0);

        // 4. Center Kidney/Bean Grass Island inside Oval Loop (Exact Competitor Shape!)
        const traceCenterIsland = (expandWorld = 0, yOff = 0) => {
          const rx = (2.16 + expandWorld) * S;
          const rz = (0.88 + expandWorld) * S;
          const cx0 = px(0);
          const cy0 = py(-8.52) + yOff;
          ctx.beginPath();
          ctx.moveTo(cx0 - rx, cy0 + rz * 0.05);
          ctx.bezierCurveTo(
            cx0 - rx, cy0 - rz * 1.05,
            cx0 - rx * 0.35, cy0 - rz * 0.72,
            cx0, cy0 - rz * 0.68
          );
          ctx.bezierCurveTo(
            cx0 + rx * 0.35, cy0 - rz * 0.72,
            cx0 + rx, cy0 - rz * 1.05,
            cx0 + rx, cy0 + rz * 0.05
          );
          ctx.bezierCurveTo(
            cx0 + rx, cy0 + rz * 1.08,
            cx0 - rx, cy0 + rz * 1.08,
            cx0 - rx, cy0 + rz * 0.05
          );
          ctx.closePath();
        };

        // Island asphalt drop shadow + 3D curb bevel + white curb + lush grass fill (zero CPU shadowBlur!)
        ctx.fillStyle = 'rgba(20, 24, 34, 0.32)';
        traceCenterIsland(0.24, 3.5);
        ctx.fill();

        ctx.fillStyle = '#aeb7ca';
        traceCenterIsland(0.20, 2.2);
        ctx.fill();

        ctx.fillStyle = '#f4f7fd';
        traceCenterIsland(0.20, 0);
        ctx.fill();

        const islGrass = ctx.createLinearGradient(0, py(-9.4), 0, py(-7.6));
        islGrass.addColorStop(0, theme.islStops[0]);
        islGrass.addColorStop(1, theme.islStops[1]);
        ctx.fillStyle = islGrass;
        traceCenterIsland(0.0, 0);
        ctx.fill();

        // 5. Crisp Horizontal 3D Concrete Curb Ledge at z = -0.72
        const ledgeTopY = py(-0.84);
        const ledgeMidY = py(-0.71);
        const ledgeBotY = py(-0.63);

        // Soft shadow cast downward onto the parking lot
        const ledgeShadow = ctx.createLinearGradient(0, ledgeBotY, 0, ledgeBotY + 9);
        ledgeShadow.addColorStop(0, 'rgba(35, 45, 68, 0.20)');
        ledgeShadow.addColorStop(1, 'rgba(35, 45, 68, 0.0)');
        ctx.fillStyle = ledgeShadow;
        ctx.fillRect(0, ledgeBotY, cw, 9);

        // Bright top face of concrete ledge
        ctx.fillStyle = '#f4f7fd';
        ctx.fillRect(0, ledgeTopY, cw, ledgeMidY - ledgeTopY);

        // 3D front bevel face of concrete ledge
        ctx.fillStyle = '#b4bdd0';
        ctx.fillRect(0, ledgeMidY, cw, ledgeBotY - ledgeMidY);

        groundTex = new THREE.CanvasTexture(canvas);
        if (this.renderer && this.renderer.capabilities) {
          groundTex.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
        }
        groundTex.needsUpdate = true;
        this._groundTexCache[themeIdx] = groundTex;
      }

      const groundPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(worldW, worldD),
        new THREE.MeshBasicMaterial({ map: groundTex })
      );
      groundPlane.rotation.x = -Math.PI / 2;
      groundPlane.position.set(0, 0.0, centerZ);
      this.envGroup.add(groundPlane);

      // 6. Dynamic 3D Architectural Landmarks & Roadside Props per Level Theme!
      this.buildThemeArchitecture3D(theme.archType);
    }

    buildThemeArchitecture3D(archType = 'fountain') {

      const archIndexMap = {
        fountain: 0,
        palm_oasis: 1,
        sakura_torii: 2,
        castle_kingdom: 3,
        cyber_neon: 4,
        alpine_crystal: 5
      };
      const archIdx = archIndexMap[archType] !== undefined ? archIndexMap[archType] : 0;
      this._currentArchIdx = archIdx;

      // 1. Place lush, organic rounded 3D Pixar Flowering Bushes & Rounded Trees cleanly on the outer park lawn
      // (Never place trees on the feeder roads at x = ±6.35, z = -12.6!)
      if (archType === 'fountain') {
        this.addBushWithFlowers(-5.25, -6.18);
        this.addBushWithFlowers(5.25, -6.18);
        this.addTree(-7.25, -8.40);
        this.addTree(7.25, -8.40);
      } else if (archType === 'palm_oasis') {
        this.addBushWithFlowers(-5.25, -6.18);
        this.addBushWithFlowers(5.25, -6.18);
        this.addTree(-7.25, -8.40);
        this.addTree(7.25, -8.40);
      } else if (archType === 'sakura_torii') {
        this.addBushWithFlowers(-5.25, -6.18);
        this.addBushWithFlowers(5.25, -6.18);
        this.addSakuraTree3D(-7.25, -8.45, 1.0);
        this.addSakuraTree3D(7.25, -8.45, 1.0);
      } else if (archType === 'castle_kingdom') {
        this.addBushWithFlowers(-5.25, -6.18);
        this.addBushWithFlowers(5.25, -6.18);
        this.addMapleTree3D(-7.25, -8.40);
        this.addMapleTree3D(7.25, -8.40);
      } else if (archType === 'cyber_neon') {
        this.addBushWithFlowers(-5.25, -6.18);
        this.addBushWithFlowers(5.25, -6.18);
        this.addSakuraTree3D(-7.25, -8.40, 0.96);
        this.addSakuraTree3D(7.25, -8.40, 0.96);
      } else {
        this.addBushWithFlowers(-5.25, -6.18);
        this.addBushWithFlowers(5.25, -6.18);
        this.addTree(-7.25, -8.40);
        this.addTree(7.25, -8.40);
      }

      // 2. Mount the Pixar 3D Architectural Landmark Sprite DEAD-CENTER inside the Center Kidney Grass Island!
      this.syncLevelArchitecturePropsOverlay();
    }

    syncLevelArchitecturePropsOverlay() {
      const layer = document.getElementById('go-awnings-layer');
      if (!layer) return;

      // Remove any old left/right upper lawn icons so the upper lawn stays clean
      ['lvl-arch-left', 'lvl-arch-right'].forEach((oldId) => {
        const oldEl = document.getElementById(oldId);
        if (oldEl) oldEl.remove();
      });

      const archIdx = typeof this._currentArchIdx === 'number' ? this._currentArchIdx : 0;
      let el = document.getElementById('lvl-arch-center');
      if (!el) {
        el = document.createElement('div');
        el.id = 'lvl-arch-center';
        layer.appendChild(el);
      }
      el.className = `level-arch-3d-prop level-arch-idx-${archIdx}`;
      el.style.width = '44px';
      el.style.height = '44px';
      // Positioned slightly higher inside the green kidney grass island (wx = 0, wy = 0, wz = -8.68) so it sits cleanly inside the grass and never overlaps the bottom white curb or passengers!
      const pt = this.projectToScreen(0.0, 0.0, -8.68);
      el.style.left = `${pt.x}px`;
      el.style.top = `${pt.y}px`;
    }

    addPalmTree3D(x, z, leanSign = 1) {
      const group = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
      const frondMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.55 });
      const cocoMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });

      for (let i = 0; i < 4; i++) {
        const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.14 - i * 0.015, 0.17 - i * 0.015, 0.38, 10), trunkMat);
        seg.position.set(leanSign * (i * i * 0.03), 0.18 + i * 0.32, 0);
        seg.rotation.z = -leanSign * i * 0.08;
        group.add(seg);
      }
      const topX = leanSign * 0.28;
      const topY = 1.35;
      for (let f = 0; f < 6; f++) {
        const ang = (f / 6) * Math.PI * 2;
        const frond = new THREE.Mesh(new THREE.SphereGeometry(0.46, 10, 8), frondMat);
        frond.scale.set(1.45, 0.22, 0.48);
        frond.position.set(topX + Math.cos(ang) * 0.48, topY - 0.04, Math.sin(ang) * 0.48);
        frond.rotation.y = -ang;
        frond.rotation.z = -0.32;
        group.add(frond);
      }
      const coco = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), cocoMat);
      coco.position.set(topX, topY - 0.10, 0);
      group.add(coco);
      group.position.set(x, 0.02, z);
      this.envGroup.add(group);
    }

    addSakuraTree3D(x, z, scale = 1) {
      const group = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.8 });
      const blossomMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 });
      const lightPinkMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.55 });

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 0.65, 10), trunkMat);
      trunk.position.y = 0.32;
      const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.75, 14, 12), blossomMat);
      c1.scale.set(1.1, 0.78, 1.0);
      c1.position.set(0, 0.86, 0);
      const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.52, 12, 10), lightPinkMat);
      c2.position.set(-0.38, 0.78, 0.25);
      const c3 = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 10), lightPinkMat);
      c3.position.set(0.38, 0.82, -0.20);
      group.add(trunk, c1, c2, c3);
      group.scale.set(scale, scale, scale);
      group.position.set(x, 0.02, z);
      this.envGroup.add(group);
    }

    addMapleTree3D(x, z) {
      const group = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.8 });
      const orangeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.68 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.65 });

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 0.62, 10), trunkMat);
      trunk.position.y = 0.31;
      const main = new THREE.Mesh(new THREE.SphereGeometry(0.78, 14, 12), orangeMat);
      main.scale.set(1.05, 0.82, 1.05);
      main.position.y = 0.85;
      const sub = new THREE.Mesh(new THREE.SphereGeometry(0.54, 12, 10), goldMat);
      sub.position.set(x < 0 ? 0.35 : -0.35, 0.74, 0.28);
      group.add(trunk, main, sub);
      group.position.set(x, 0.02, z);
      this.envGroup.add(group);
    }

    addCastleTurret3D(x, z, scale = 1) {
      const group = new THREE.Group();
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.55 });
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.25, metalness: 0.4 });

      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.56, 0.92, 14), wallMat);
      tower.position.y = 0.46;
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.54, 0.16, 14), wallMat);
      collar.position.y = 0.92;
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.64, 0.68, 14), roofMat);
      roof.position.y = 1.34;
      const flagBall = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), goldMat);
      flagBall.position.y = 1.72;
      group.add(tower, collar, roof, flagBall);
      group.scale.set(scale, scale, scale);
      group.position.set(x, 0.02, z);
      this.envGroup.add(group);
    }

    addCyberPylon3D(x, z, glowHex = 0x38bdf8) {
      const group = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.7 });
      const glowMat = new THREE.MeshBasicMaterial({ color: glowHex });

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 0.22, 8), bodyMat);
      base.position.y = 0.11;
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 1.15, 8), bodyMat);
      spire.position.y = 0.68;
      const ring1 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.09, 12), glowMat);
      ring1.position.y = 0.52;
      const ring2 = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.09, 12), glowMat);
      ring2.position.y = 0.92;
      const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), glowMat);
      orb.position.y = 1.38;
      group.add(base, spire, ring1, ring2, orb);
      group.position.set(x, 0.02, z);
      this.envGroup.add(group);
    }

    addPineTree3D(x, z, scale = 1) {
      const group = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.8 });
      const pineMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
      const snowTipMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.4 });

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.20, 0.45, 8), trunkMat);
      trunk.position.y = 0.22;
      const t1 = new THREE.Mesh(new THREE.ConeGeometry(0.72, 0.65, 12), pineMat);
      t1.position.y = 0.62;
      const t2 = new THREE.Mesh(new THREE.ConeGeometry(0.56, 0.58, 12), pineMat);
      t2.position.y = 0.98;
      const t3 = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.48, 12), snowTipMat);
      t3.position.y = 1.30;
      group.add(trunk, t1, t2, t3);
      group.scale.set(scale, scale, scale);
      group.position.set(x, 0.02, z);
      this.envGroup.add(group);
    }

    addBushWithFlowers(x, z) {
      const group = new THREE.Group();
      const shadowMesh = new THREE.Mesh(
        new THREE.CircleGeometry(0.78, 16),
        new THREE.MeshBasicMaterial({ color: 0x557a32, transparent: true, opacity: 0.35 })
      );
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.scale.set(1.25, 0.85, 1);
      shadowMesh.position.set(0, -0.17, 0.06);
      group.add(shadowMesh);

      const bushMat = new THREE.MeshStandardMaterial({
        color: 0x3f7e24,
        roughness: 0.78,
        metalness: 0.0
      });
      const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.50, 14, 12), bushMat);
      b1.scale.set(1.32, 0.68, 0.88);
      const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), bushMat);
      b2.position.set(-0.44, -0.05, 0.08);
      const b3 = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), bushMat);
      b3.position.set(0.44, -0.05, 0.08);
      group.add(b1, b2, b3);

      const pinkMat = new THREE.MeshBasicMaterial({ color: 0xffd1e3 });
      const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      [
        [-0.36, 0.28, 0.22, pinkMat],
        [-0.08, 0.33, 0.26, whiteMat],
        [0.26, 0.30, 0.20, pinkMat],
        [-0.20, 0.27, -0.12, whiteMat],
        [0.18, 0.30, -0.10, whiteMat]
      ].forEach(([fx, fy, fz, mat]) => {
        const fl = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 8), mat);
        fl.position.set(fx, fy, fz);
        group.add(fl);
      });

      group.position.set(x, 0.19, z);
      this.envGroup.add(group);
    }

    addTree(x, z) {
      const group = new THREE.Group();
      const treeMat = new THREE.MeshStandardMaterial({
        color: 0x346d1c,
        roughness: 0.80,
        metalness: 0.0
      });
      const main = new THREE.Mesh(new THREE.SphereGeometry(0.82, 16, 14), treeMat);
      main.scale.set(1.0, 0.82, 1.0);
      const sub = new THREE.Mesh(new THREE.SphereGeometry(0.56, 12, 10), treeMat);
      sub.position.set(x < 0 ? 0.35 : -0.35, -0.12, 0.32);
      group.add(main, sub);
      group.position.set(x, 0.52, z);
      this.envGroup.add(group);
    }

    // -----------------------------------------------------------------------
    // 8 ANGLED BOARDING SLOTS (1 VIP + 4 Normal + 3 Locked '+')
    // -----------------------------------------------------------------------
    getSlotDecalMaterial(mode) {
      if (!this._slotDecalMats) this._slotDecalMats = {};
      if (this._slotDecalMats[mode]) return this._slotDecalMats[mode];

      const cw = 256;
      const ch = 460;
      const canvas = document.createElement('canvas');
      canvas.width = cw * 2;
      canvas.height = ch * 2;
      const ctx = canvas.getContext('2d');
      ctx.scale(2, 2);
      ctx.clearRect(0, 0, cw, ch);

      const strokeCol = mode === 'vip' ? '#f6ae22' : mode === 'plus' ? '#6ae091' : '#dce2f0';
      const pad = 18;
      const w = cw - pad * 2;
      const h = ch - pad * 2;
      const r = 34;
      const gapHalf = 30; // Clean entrance gap at bottom-center like Competitor Level 6!

      // Subtle darker interior tint inside slot outline
      ctx.fillStyle = 'rgba(32, 36, 48, 0.16)';
      ctx.beginPath();
      ctx.roundRect(pad, pad, w, h, r);
      ctx.fill();

      // Rounded rectangle outline with bottom-center gap
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = 11;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      // Start right of bottom-center gap, go clockwise around right, top, left, end left of bottom gap
      ctx.moveTo(cw * 0.5 + gapHalf, pad + h);
      ctx.lineTo(pad + w - r, pad + h);
      ctx.arcTo(pad + w, pad + h, pad + w, pad + h - r, r);
      ctx.lineTo(pad + w, pad + r);
      ctx.arcTo(pad + w, pad, pad + w - r, pad, r);
      ctx.lineTo(pad + r, pad);
      ctx.arcTo(pad, pad, pad, pad + r, r);
      ctx.lineTo(pad, pad + h - r);
      ctx.arcTo(pad, pad + h, pad + r, pad + h, r);
      ctx.lineTo(cw * 0.5 - gapHalf, pad + h);
      ctx.stroke();

      if (mode === 'vip') {
        ctx.save();
        ctx.translate(cw * 0.5, ch * 0.5);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = '#f6ae22';
        ctx.font = '900 74px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('VIP', 0, 2);
        ctx.restore();
      } else if (mode === 'plus') {
        ctx.strokeStyle = '#6ae091';
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';
        const arm = 28;
        ctx.beginPath();
        ctx.moveTo(cw * 0.5 - arm, ch * 0.5);
        ctx.lineTo(cw * 0.5 + arm, ch * 0.5);
        ctx.moveTo(cw * 0.5, ch * 0.5 - arm);
        ctx.lineTo(cw * 0.5, ch * 0.5 + arm);
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(canvas);
      if (this.renderer && this.renderer.capabilities) {
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      }
      this._slotDecalMats[mode] = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false
      });
      return this._slotDecalMats[mode];
    }

    initSlots() {
      while (this.slotsGroup.children.length > 0) {
        this.slotsGroup.remove(this.slotsGroup.children[0]);
      }
      this.slots = [];

      const slotXPositions = [-5.85, -4.18, -2.51, -0.84, 0.84, 2.51, 4.18, 5.85];
      const slotZ = -3.22;
      const slotTilt = 0.36;

      slotXPositions.forEach((sx, idx) => {
        const isVip = idx === 0;
        const isLockedPlus = idx >= 5;
        const mode = isVip ? 'vip' : isLockedPlus ? 'plus' : 'normal';

        const slotGroup = new THREE.Group();
        slotGroup.position.set(sx, 0.02, slotZ);
        slotGroup.rotation.y = slotTilt;

        const decalMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(1.36, 2.42),
          this.getSlotDecalMaterial(mode)
        );
        decalMesh.rotation.x = -Math.PI / 2;
        slotGroup.add(decalMesh);

        this.slotsGroup.add(slotGroup);

        this.slots.push({
          index: idx,
          x: sx,
          z: slotZ,
          tilt: slotTilt,
          type: isVip ? 'vip' : isLockedPlus ? 'plus' : 'normal',
          unlocked: !isLockedPlus,
          vehicle: null,
          reserved: false,
          group: slotGroup,
          borderMesh: decalMesh,
          decalMesh
        });
      });
    }

    unlockPlusSlot(slotIndex, costCoins = 40) {
      const slot = this.slots[slotIndex];
      if (!slot || slot.unlocked) return false;

      if (this.profile.coins < costCoins) {
        this.spawnFloatingText(slot.x, slot.z, 'Need 🪙 ' + costCoins + ' Coins!', '#ff6b6b');
        sound.playCarBlocked();
        return false;
      }

      this.profile.coins -= costCoins;
      slot.unlocked = true;
      if (slot.decalMesh) {
        slot.decalMesh.material = this.getSlotDecalMaterial('normal');
        slot.decalMesh.visible = true;
      }

      sound.playBooster();
      this.spawnFloatingText(slot.x, slot.z, '➕ Slot Unlocked!', '#5ce68b');
      this.updateHUD();
      this.updateSlotOverlays();
      this.saveGameProgress(true);
      return true;
    }

    // -----------------------------------------------------------------------
    // 3D VEHICLE BUILDER (SMOOTH BEVELED 3D SEDANS, VANS & SLEEK COACH BUSES)
    // -----------------------------------------------------------------------
    createRoundedBoxGeo(w, h, d, radius = 0.2, bevel = 0.05) {
      const bv = Math.min(bevel, w * 0.22, h * 0.35, d * 0.22);
      const iw = Math.max(0.04, w - bv * 2);
      const id = Math.max(0.04, d - bv * 2);
      const ir = Math.max(0.015, Math.min(radius - bv, iw * 0.46, id * 0.46));

      const x0 = -iw * 0.5;
      const y0 = -id * 0.5;
      const shape = new THREE.Shape();
      shape.moveTo(x0 + ir, y0);
      shape.lineTo(x0 + iw - ir, y0);
      shape.quadraticCurveTo(x0 + iw, y0, x0 + iw, y0 + ir);
      shape.lineTo(x0 + iw, y0 + id - ir);
      shape.quadraticCurveTo(x0 + iw, y0 + id, x0 + iw - ir, y0 + id);
      shape.lineTo(x0 + ir, y0 + id);
      shape.quadraticCurveTo(x0, y0 + id, x0, y0 + id - ir);
      shape.lineTo(x0, y0 + ir);
      shape.quadraticCurveTo(x0, y0, x0 + ir, y0);

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: Math.max(0.02, h - bv * 2),
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: bv,
        bevelThickness: bv,
        curveSegments: 8
      });
      geo.translate(0, 0, bv);
      geo.rotateX(-Math.PI / 2);
      geo.computeVertexNormals();
      return geo;
    }

    initSharedVehicleResources() {
      if (this._vehResReady) return;
      this._vehResReady = true;

      this._vehBodyMats = {};
      this._vehDarkMats = {};
      this._vehLightMats = {};
      Object.keys(COLORS).forEach((k) => {
        const baseCol = new THREE.Color(COLORS[k].hex);
        const lightCol = baseCol.clone().lerp(new THREE.Color(0xffffff), 0.14);
        const darkCol = new THREE.Color(COLORS[k].darkHex).lerp(new THREE.Color(0x000000), 0.15);

        this._vehBodyMats[k] = new THREE.MeshStandardMaterial({
          color: baseCol,
          roughness: 0.44,
          metalness: 0.02
        });
        this._vehDarkMats[k] = new THREE.MeshStandardMaterial({
          color: darkCol,
          roughness: 0.52,
          metalness: 0.02
        });
        this._vehLightMats[k] = new THREE.MeshStandardMaterial({
          color: lightCol,
          roughness: 0.38,
          metalness: 0.02
        });
      });

      // Competitor Dark Charcoal Inset Windows + Cream-White Trim Belt
      this._vehGlassMat = new THREE.MeshStandardMaterial({
        color: 0x222838,
        roughness: 0.22,
        metalness: 0.16
      });
      this._vehCreamTrimMat = new THREE.MeshStandardMaterial({
        color: 0xf4f7fc,
        roughness: 0.30,
        metalness: 0.04
      });
      this._vehTireMat = new THREE.MeshStandardMaterial({
        color: 0x181d26,
        roughness: 0.80,
        metalness: 0.05
      });
      this._vehChromeMat = new THREE.MeshStandardMaterial({
        color: 0xe5ebf5,
        roughness: 0.28,
        metalness: 0.25
      });
      this._vehHlMat = new THREE.MeshBasicMaterial({ color: 0xfff3b0 });
      this._vehTaillightMat = new THREE.MeshBasicMaterial({ color: 0xff4757 });
      this._vehShadowMat = new THREE.MeshBasicMaterial({
        map: this.getVehicleShadowTexture(),
        transparent: true,
        depthWrite: false
      });

      const arrowMat = new THREE.MeshBasicMaterial({
        map: this.getArrowTexture(),
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2
      });

      const tireGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.14, 16);
      tireGeo.rotateZ(Math.PI / 2);
      const hubcapGeo = new THREE.CylinderGeometry(0.10, 0.10, 0.15, 14);
      hubcapGeo.rotateZ(Math.PI / 2);
      const hlPillGeo = new THREE.BoxGeometry(0.19, 0.08, 0.05);

      // 1. Smooth Rounded 3D Sedan ('car')
      this._carGeos = {
        shadowGeo: new THREE.PlaneGeometry(1.42, 2.12),
        bumperLipGeo: this.createRoundedBoxGeo(1.05, 0.10, 1.71, 0.24, 0.025),
        bodyGeo: this.createRoundedBoxGeo(1.03, 0.37, 1.68, 0.24, 0.065),
        hoodAccentGeo: this.createRoundedBoxGeo(0.68, 0.05, 0.42, 0.12, 0.02),
        cabinTrimGeo: this.createRoundedBoxGeo(0.87, 0.19, 0.94, 0.20, 0.03),
        fbGlassGeo: this.createRoundedBoxGeo(0.70, 0.17, 0.97, 0.14, 0.02),
        sideGlassGeo: new THREE.BoxGeometry(0.89, 0.14, 0.31),
        roofDomeGeo: this.createRoundedBoxGeo(0.81, 0.15, 0.80, 0.19, 0.055),
        tireGeo,
        hubcapGeo,
        hlPillGeo,
        arrowGeo: new THREE.PlaneGeometry(0.58, 0.66),
        arrowMat
      };

      // 2. Cute Two-Tone Rounded 3D Minivan ('van')
      this._vanGeos = {
        shadowGeo: new THREE.PlaneGeometry(1.46, 2.20),
        bumperLipGeo: this.createRoundedBoxGeo(1.07, 0.10, 1.79, 0.23, 0.025),
        bodyGeo: this.createRoundedBoxGeo(1.05, 0.39, 1.76, 0.23, 0.06),
        creamBeltGeo: this.createRoundedBoxGeo(1.00, 0.25, 1.58, 0.20, 0.04),
        fbGlassGeo: new THREE.BoxGeometry(0.80, 0.16, 1.60),
        sideGlassGeo: new THREE.BoxGeometry(1.02, 0.15, 0.31),
        roofDomeGeo: this.createRoundedBoxGeo(0.92, 0.15, 1.44, 0.19, 0.05),
        tireGeo,
        hubcapGeo,
        hlPillGeo,
        arrowGeo: new THREE.PlaneGeometry(0.62, 0.82),
        arrowMat
      };

      // 3. Sleek Pill-Rounded 3D Coach Bus ('bus')
      const busTireGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.15, 16);
      busTireGeo.rotateZ(Math.PI / 2);
      const busHubGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.16, 14);
      busHubGeo.rotateZ(Math.PI / 2);

      this._busGeos = {
        shadowGeo: new THREE.PlaneGeometry(1.56, 2.94),
        bumperLipGeo: this.createRoundedBoxGeo(1.15, 0.10, 2.49, 0.25, 0.025),
        bodyGeo: this.createRoundedBoxGeo(1.13, 0.47, 2.46, 0.25, 0.065),
        creamBeltGeo: this.createRoundedBoxGeo(1.09, 0.27, 2.34, 0.22, 0.04),
        fbGlassGeo: new THREE.BoxGeometry(0.88, 0.19, 2.36),
        sideGlassGeo: new THREE.BoxGeometry(1.11, 0.18, 0.29),
        roofDomeGeo: this.createRoundedBoxGeo(1.03, 0.17, 2.22, 0.22, 0.055),
        roofRailGeo: this.createRoundedBoxGeo(0.08, 0.04, 1.72, 0.03, 0.015),
        tireGeo: busTireGeo,
        hubcapGeo: busHubGeo,
        hlPillGeo,
        arrowGeo: new THREE.PlaneGeometry(0.68, 1.02),
        arrowMat
      };
    }

    getVehicleShadowTexture() {
      if (this._vehShadowTex) return this._vehShadowTex;
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 512;
      const ctx = c.getContext('2d');
      ctx.scale(2, 2);
      ctx.clearRect(0, 0, 128, 256);
      const grad = ctx.createRadialGradient(64, 128, 10, 64, 128, 60);
      grad.addColorStop(0, 'rgba(20, 28, 46, 0.48)');
      grad.addColorStop(0.62, 'rgba(20, 28, 46, 0.24)');
      grad.addColorStop(1, 'rgba(20, 28, 46, 0.0)');
      ctx.save();
      ctx.scale(1, 1.9);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(64, 67, 58, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      this._vehShadowTex = new THREE.CanvasTexture(c);
      return this._vehShadowTex;
    }

    createVehicleMesh(vehicleData) {
      this.initSharedVehicleResources();
      const group = new THREE.Group();
      const colorKey = COLORS[vehicleData.color] ? vehicleData.color : 'blue';
      const isBus = vehicleData.type === 'bus';
      const isVan = !isBus && (vehicleData.subType === 'van' || vehicleData.cap === 20);

      const bodyMat = this._vehBodyMats[colorKey];
      const lightMat = this._vehLightMats[colorKey];

      if (!isBus && !isVan) {
        // --- 1. SMOOTH ROUNDED 3D SEDAN ---
        const g = this._carGeos;

        const shadow = new THREE.Mesh(g.shadowGeo, this._vehShadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(0, 0.015, 0.03);
        group.add(shadow);

        const bumperLip = new THREE.Mesh(g.bumperLipGeo, this._vehChromeMat);
        bumperLip.position.y = 0.09;
        group.add(bumperLip);

        const chassis = new THREE.Mesh(g.bodyGeo, bodyMat);
        chassis.position.y = 0.12;
        group.add(chassis);

        const hoodAccent = new THREE.Mesh(g.hoodAccentGeo, lightMat);
        hoodAccent.position.set(0, 0.46, -0.50);
        group.add(hoodAccent);

        const cabinTrim = new THREE.Mesh(g.cabinTrimGeo, this._vehCreamTrimMat);
        cabinTrim.position.set(0, 0.44, 0.06);
        group.add(cabinTrim);

        const fbGlass = new THREE.Mesh(g.fbGlassGeo, this._vehGlassMat);
        fbGlass.position.set(0, 0.47, 0.06);
        group.add(fbGlass);

        for (const wz of [-0.14, 0.25]) {
          const sw = new THREE.Mesh(g.sideGlassGeo, this._vehGlassMat);
          sw.position.set(0, 0.50, wz);
          group.add(sw);
        }

        const roofDome = new THREE.Mesh(g.roofDomeGeo, bodyMat);
        roofDome.position.set(0, 0.58, 0.06);
        group.add(roofDome);

        for (const sx of [-0.30, 0.30]) {
          const hl = new THREE.Mesh(g.hlPillGeo, this._vehHlMat);
          hl.position.set(sx, 0.28, -0.83);
          const tl = new THREE.Mesh(g.hlPillGeo, this._vehTaillightMat);
          tl.position.set(sx, 0.29, 0.83);
          group.add(hl, tl);
        }

        for (const [wx, wz] of [[-0.47, -0.48], [0.47, -0.48], [-0.47, 0.48], [0.47, 0.48]]) {
          const wg = new THREE.Group();
          wg.position.set(wx, 0.19, wz);
          wg.add(new THREE.Mesh(g.tireGeo, this._vehTireMat));
          wg.add(new THREE.Mesh(g.hubcapGeo, this._vehChromeMat));
          group.add(wg);
        }

        const arrow = new THREE.Mesh(g.arrowGeo, g.arrowMat);
        arrow.rotation.x = -Math.PI / 2;
        arrow.position.set(0, 0.745, 0.06);
        group.add(arrow);

      } else if (isVan) {
        // --- 2. CUTE TWO-TONE 3D MINIVAN ---
        const g = this._vanGeos;

        const shadow = new THREE.Mesh(g.shadowGeo, this._vehShadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(0, 0.015, 0.03);
        group.add(shadow);

        const bumperLip = new THREE.Mesh(g.bumperLipGeo, this._vehChromeMat);
        bumperLip.position.y = 0.09;
        group.add(bumperLip);

        const body = new THREE.Mesh(g.bodyGeo, bodyMat);
        body.position.y = 0.12;
        group.add(body);

        const creamBelt = new THREE.Mesh(g.creamBeltGeo, this._vehCreamTrimMat);
        creamBelt.position.set(0, 0.44, 0.02);
        group.add(creamBelt);

        const fbGlass = new THREE.Mesh(g.fbGlassGeo, this._vehGlassMat);
        fbGlass.position.set(0, 0.51, 0.02);
        group.add(fbGlass);

        for (const wz of [-0.43, 0.02, 0.47]) {
          const sw = new THREE.Mesh(g.sideGlassGeo, this._vehGlassMat);
          sw.position.set(0, 0.52, wz);
          group.add(sw);
        }

        const roofDome = new THREE.Mesh(g.roofDomeGeo, bodyMat);
        roofDome.position.set(0, 0.65, 0.02);
        group.add(roofDome);

        for (const sx of [-0.32, 0.32]) {
          const hl = new THREE.Mesh(g.hlPillGeo, this._vehHlMat);
          hl.position.set(sx, 0.29, -0.87);
          const tl = new THREE.Mesh(g.hlPillGeo, this._vehTaillightMat);
          tl.position.set(sx, 0.30, 0.87);
          group.add(hl, tl);
        }

        for (const [wx, wz] of [[-0.48, -0.52], [0.48, -0.52], [-0.48, 0.52], [0.48, 0.52]]) {
          const wg = new THREE.Group();
          wg.position.set(wx, 0.19, wz);
          wg.add(new THREE.Mesh(g.tireGeo, this._vehTireMat));
          wg.add(new THREE.Mesh(g.hubcapGeo, this._vehChromeMat));
          group.add(wg);
        }

        const arrow = new THREE.Mesh(g.arrowGeo, g.arrowMat);
        arrow.rotation.x = -Math.PI / 2;
        arrow.position.set(0, 0.815, 0.02);
        group.add(arrow);

      } else {
        // --- 3. SLEEK PILL-ROUNDED 3D COACH BUS ---
        const g = this._busGeos;

        const shadow = new THREE.Mesh(g.shadowGeo, this._vehShadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(0, 0.015, 0.04);
        group.add(shadow);

        const bumperLip = new THREE.Mesh(g.bumperLipGeo, this._vehChromeMat);
        bumperLip.position.y = 0.10;
        group.add(bumperLip);

        const body = new THREE.Mesh(g.bodyGeo, bodyMat);
        body.position.y = 0.13;
        group.add(body);

        const creamBelt = new THREE.Mesh(g.creamBeltGeo, this._vehCreamTrimMat);
        creamBelt.position.set(0, 0.54, 0);
        group.add(creamBelt);

        const fbGlass = new THREE.Mesh(g.fbGlassGeo, this._vehGlassMat);
        fbGlass.position.set(0, 0.62, 0);
        group.add(fbGlass);

        for (const wz of [-0.80, -0.40, 0.0, 0.40, 0.80]) {
          const sw = new THREE.Mesh(g.sideGlassGeo, this._vehGlassMat);
          sw.position.set(0, 0.63, wz);
          group.add(sw);
        }

        const roofDome = new THREE.Mesh(g.roofDomeGeo, bodyMat);
        roofDome.position.set(0, 0.76, 0);
        group.add(roofDome);

        for (const rx of [-0.38, 0.38]) {
          const rail = new THREE.Mesh(g.roofRailGeo, lightMat);
          rail.position.set(rx, 0.91, 0);
          group.add(rail);
        }

        for (const sx of [-0.36, 0.36]) {
          const hl = new THREE.Mesh(g.hlPillGeo, this._vehHlMat);
          hl.position.set(sx, 0.31, -1.22);
          const tl = new THREE.Mesh(g.hlPillGeo, this._vehTaillightMat);
          tl.position.set(sx, 0.32, 1.22);
          group.add(hl, tl);
        }

        for (const [wx, wz] of [[-0.52, -0.76], [0.52, -0.76], [-0.52, 0.76], [0.52, 0.76]]) {
          const wg = new THREE.Group();
          wg.position.set(wx, 0.21, wz);
          wg.add(new THREE.Mesh(g.tireGeo, this._vehTireMat));
          wg.add(new THREE.Mesh(g.hubcapGeo, this._vehChromeMat));
          group.add(wg);
        }

        const arrow = new THREE.Mesh(g.arrowGeo, g.arrowMat);
        arrow.rotation.x = -Math.PI / 2;
        arrow.position.set(0, 0.945, 0);
        group.add(arrow);
      }

      group.rotation.y = LevelGenerator.getVehicleRotY(vehicleData);
      group.position.set(vehicleData.x, 0, vehicleData.z);
      group.userData.vehicleId = vehicleData.id;

      return group;
    }

    getArrowTexture() {
      if (this._arrowTex) return this._arrowTex;
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 640;
      const ctx = canvas.getContext('2d');
      ctx.scale(4, 4);
      ctx.clearRect(0, 0, 128, 160);

      ctx.shadowColor = 'rgba(15, 23, 42, 0.38)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;

      ctx.beginPath();
      ctx.moveTo(64, 18);
      ctx.lineTo(106, 66);
      ctx.lineTo(79, 66);
      ctx.lineTo(79, 140);
      ctx.lineTo(49, 140);
      ctx.lineTo(49, 66);
      ctx.lineTo(22, 66);
      ctx.closePath();

      ctx.lineJoin = 'round';
      ctx.lineWidth = 9;
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.58)';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.fill();

      this._arrowTex = new THREE.CanvasTexture(canvas);
      if (this.renderer && this.renderer.capabilities) {
        this._arrowTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      }
      return this._arrowTex;
    }

    // -----------------------------------------------------------------------
    // 3D REVOLVING OVAL LOOP & DUAL FEEDER PASSENGER MESHES (ULTRA-FAST INDEXED 3D RUNNERS!)
    // -----------------------------------------------------------------------
    initSharedStickmanResources() {
      if (this._mergedStickmanGeo) return;

      // Build a 10-frame Indexed 3D Articulated Running Character Table (this._stickmanRunFrames[0..9]) + Standing Pose (this._stickmanIdleGeo)
      // - Preserves .index buffer (NEVER calls .toNonIndexed()!), reducing vertex count 12x (308 indexed vertices vs 3,720 non-indexed!)
      // - Head & Torso stay 100% steady (ZERO vertical/sideways jiggle!)
      // - Left/Right Arms + Bent Forearms + Hands ("Hath") pump forward & backward around shoulder joints
      // - Left/Right Thighs + Bending Knees + Shins + Feet ("Pair") scissor forward & backward around hip joints!
      const buildPoseGeo = (swingPhase, isRunning) => {
        const parts = [];
        let totalVerts = 0;
        let totalIndices = 0;

        const addPart = (geo, aoMin, aoMax) => {
          const p = geo.attributes.position.array;
          const n = geo.attributes.normal.array;
          const idxArr = geo.index ? geo.index.array : null;
          const vCount = p.length / 3;
          let minY = Infinity, maxY = -Infinity;
          for (let i = 1; i < p.length; i += 3) {
            if (p[i] < minY) minY = p[i];
            if (p[i] > maxY) maxY = p[i];
          }
          const spanY = Math.max(0.01, maxY - minY);
          const c = new Float32Array(p.length);
          for (let i = 0; i < p.length; i += 3) {
            const t = (p[i + 1] - minY) / spanY;
            const ao = aoMin + t * (aoMax - aoMin);
            c[i] = ao;
            c[i + 1] = ao;
            c[i + 2] = ao;
          }
          parts.push({ pos: p, norm: n, col: c, idx: idxArr, vCount });
          totalVerts += vCount;
          totalIndices += idxArr ? idxArr.length : vCount;
        };

        // 1. Plump Glossy 3D Head (r = 0.218 so 4 heads across a row touch snugly shoulder-to-shoulder!)
        const headGeo = new THREE.SphereGeometry(0.218, 12, 8);
        headGeo.translate(0, 0.67, 0.03);
        addPart(headGeo, 0.74, 1.00);

        // 2. Darkened Neck Collar Crease separating head from shoulders
        const neckGeo = new THREE.CylinderGeometry(0.088, 0.112, 0.075, 8, 1);
        neckGeo.translate(0, 0.495, 0.01);
        addPart(neckGeo, 0.42, 0.56);

        // 3. Rounded Runner Torso (slightly leaned forward in running direction)
        const torsoGeo = new THREE.CylinderGeometry(0.125, 0.112, 0.25, 8, 1);
        torsoGeo.scale(1.12, 1.0, 0.92);
        torsoGeo.rotateX(0.10);
        torsoGeo.translate(0, 0.375, 0.01);
        addPart(torsoGeo, 0.55, 0.86);

        // 4. Articulated Left & Right Arms + Bent Forearms + Hands ("Hath" pumping forward & back!)
        for (const side of [-1, 1]) {
          const s = isRunning ? (side === -1 ? 1 : -1) * Math.sin(swingPhase) : (side === -1 ? 0.32 : -0.32);
          const shoulderTheta = -s * 0.98;

          const uArm = new THREE.CylinderGeometry(0.046, 0.042, 0.135, 6, 1);
          uArm.translate(side * 0.01, -0.065, 0);
          uArm.rotateX(shoulderTheta);
          uArm.translate(side * 0.162, 0.465, 0.01);
          addPart(uArm, 0.60, 0.86);

          const fArm = new THREE.CylinderGeometry(0.042, 0.038, 0.135, 6, 1);
          fArm.rotateX(-0.62);
          fArm.translate(side * 0.015, -0.175, 0.055);
          fArm.rotateX(shoulderTheta);
          fArm.translate(side * 0.162, 0.465, 0.01);
          addPart(fArm, 0.64, 0.90);

          const hand = new THREE.SphereGeometry(0.054, 6, 5);
          hand.translate(side * 0.018, -0.225, 0.105);
          hand.rotateX(shoulderTheta);
          hand.translate(side * 0.162, 0.465, 0.01);
          addPart(hand, 0.72, 0.96);
        }

        // 5. Articulated Left & Right Running Legs + Bending Knees + Shoes ("Pair" scissoring wide forward & back!)
        for (const side of [-1, 1]) {
          const s = isRunning ? (side === -1 ? -1 : 1) * Math.sin(swingPhase) : (side === -1 ? -0.36 : 0.36);
          const hipTheta = -s * 0.96;
          const kneeBend = Math.max(0, hipTheta * 0.62) + (isRunning ? 0.18 : 0.08);

          const thigh = new THREE.CylinderGeometry(0.056, 0.050, 0.135, 6, 1);
          thigh.translate(0, -0.065, 0);
          thigh.rotateX(hipTheta);
          thigh.translate(side * 0.084, 0.265, 0.0);
          addPart(thigh, 0.46, 0.74);

          const shin = new THREE.CylinderGeometry(0.048, 0.043, 0.125, 6, 1);
          shin.translate(0, -0.06, 0);
          shin.rotateX(kneeBend);
          shin.translate(0, -0.125, 0);
          shin.rotateX(hipTheta);
          shin.translate(side * 0.084, 0.265, 0.0);
          addPart(shin, 0.42, 0.68);

          const shoe = new THREE.SphereGeometry(0.060, 6, 5);
          shoe.scale(0.95, 0.66, 1.42);
          shoe.translate(0, -0.122, 0.036);
          shoe.rotateX(kneeBend);
          shoe.translate(0, -0.125, 0);
          shoe.rotateX(hipTheta);
          shoe.translate(side * 0.084, 0.265, 0.0);
          addPart(shoe, 0.38, 0.64);
        }

        const mergedPos = new Float32Array(totalVerts * 3);
        const mergedNorm = new Float32Array(totalVerts * 3);
        const mergedCol = new Float32Array(totalVerts * 3);
        const mergedIdx = new Uint16Array(totalIndices);

        let vOffset = 0;
        let iOffset = 0;
        for (const pt of parts) {
          mergedPos.set(pt.pos, vOffset * 3);
          mergedNorm.set(pt.norm, vOffset * 3);
          mergedCol.set(pt.col, vOffset * 3);
          if (pt.idx) {
            for (let j = 0; j < pt.idx.length; j++) {
              mergedIdx[iOffset + j] = pt.idx[j] + vOffset;
            }
            iOffset += pt.idx.length;
          } else {
            for (let j = 0; j < pt.vCount; j++) {
              mergedIdx[iOffset + j] = vOffset + j;
            }
            iOffset += pt.vCount;
          }
          vOffset += pt.vCount;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
        geo.setAttribute('normal', new THREE.BufferAttribute(mergedNorm, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(mergedCol, 3));
        geo.setIndex(new THREE.BufferAttribute(mergedIdx, 1));
        return geo;
      };

      this._stickmanRunFrames = [];
      const FRAME_COUNT = 10;
      for (let f = 0; f < FRAME_COUNT; f++) {
        const phase = (f / FRAME_COUNT) * Math.PI * 2;
        this._stickmanRunFrames.push(buildPoseGeo(phase, true));
      }
      this._stickmanIdleGeo = buildPoseGeo(0, false);
      this._mergedStickmanGeo = this._stickmanIdleGeo;

      this._stickColorMats = {};
      Object.keys(COLORS).forEach((k) => {
        this._stickColorMats[k] = new THREE.MeshStandardMaterial({
          color: COLORS[k].hex,
          roughness: 0.34,
          metalness: 0.02,
          vertexColors: true
        });
      });
    }

    setStickmanColor(sm, colorKey) {
      if (sm.userData.colorKey === colorKey) return;
      if (!this._stickColorMats) this.initSharedStickmanResources();
      sm.material = this._stickColorMats[colorKey] || this._stickColorMats.blue;
      sm.userData.colorKey = colorKey;
    }

    createStickmanMesh() {
      this.initSharedStickmanResources();
      const mesh = new THREE.Mesh(this._mergedStickmanGeo, this._stickColorMats.yellow);
      mesh.userData = { colorKey: 'yellow' };
      return mesh;
    }

    buildPassengerMeshPools() {
      if (
        this.ringRowMeshes &&
        this.ringRowMeshes.length === RING_SLOT_COUNT &&
        this.leftFeederMeshes &&
        this.leftFeederMeshes.length === 24
      ) {
        return;
      }
      this.ringRowMeshes = [];
      this.leftFeederMeshes = [];
      this.rightFeederMeshes = [];

      // 1. 32 Radial Rows in the Central Oval Ring (4 plump clay pawns per row)
      for (let k = 0; k < RING_SLOT_COUNT; k++) {
        const members = [];
        for (let m = 0; m < ROW_PASSENGERS; m++) {
          const sm = this.createStickmanMesh();
          this.passengersGroup.add(sm);
          members.push(sm);
        }
        this.ringRowMeshes.push(members);
      }

      // 2. 24 visible rows on Left & Right Curved U-Feeder Roads (fills full feeder road up to top of screen!)
      for (let r = 0; r < 24; r++) {
        const leftRow = [];
        const rightRow = [];
        for (let m = 0; m < ROW_PASSENGERS; m++) {
          const smL = this.createStickmanMesh();
          const smR = this.createStickmanMesh();
          this.passengersGroup.add(smL);
          this.passengersGroup.add(smR);
          leftRow.push(smL);
          rightRow.push(smR);
        }
        this.leftFeederMeshes.push(leftRow);
        this.rightFeederMeshes.push(rightRow);
      }
    }

    /**
     * Exact Video Level-Start Passenger March & Revolving Oval Loop Engine (Video 00:08 - 00:14!):
     * - When level starts, passengers march down in two continuous 4-abreast columns from the top of the
     *   Left & Right Feeder Roads behind the sliding "GO!" badges (with white footstep dust puffs),
     *   flow clockwise into the Top Half (Left stream) and Bottom Half (Right stream) of the Central Oval Ring,
     *   fill all 32 ring slots shoulder-to-shoulder, and revolve continuously at exact video speed!
     */
    updateRevolvingLoopAndFeederMeshes(dt, now) {
      if (this._passengersReleased === false) {
        for (let k = 0; k < RING_SLOT_COUNT; k++) {
          const members = this.ringRowMeshes[k];
          if (!members) continue;
          for (let m = 0; m < ROW_PASSENGERS; m++) {
            if (members[m]) members[m].visible = false;
          }
        }
        for (let r = 0; r < this.leftFeederMeshes.length; r++) {
          for (let m = 0; m < ROW_PASSENGERS; m++) {
            if (this.leftFeederMeshes[r][m]) this.leftFeederMeshes[r][m].visible = false;
            if (this.rightFeederMeshes[r][m]) this.rightFeederMeshes[r][m].visible = false;
          }
        }
        return;
      }

      const INTRO_TOTAL_STEPS = 38.0; // 23 steps down feeder road + 15 steps across half-oval = 38 steps (~2.75s)
      const speedMult = this._isHoldingFastSpin ? 3.2 : 1.0;

      if (typeof this.introMarchSteps !== 'number') {
        this.introMarchSteps = INTRO_TOTAL_STEPS;
      }

      const isIntroMarching = this.introMarchSteps < INTRO_TOTAL_STEPS;
      if (isIntroMarching) {
        // March at 13.8 row-steps/sec so feeder roads + oval ring fill in ~2.75s (exact video t=8.60s -> 11.35s!)
        this.introMarchSteps = Math.min(INTRO_TOTAL_STEPS, this.introMarchSteps + dt * 13.8 * speedMult);
        this.levelIntroRushProgress = this.introMarchSteps / INTRO_TOTAL_STEPS;
        this.ringRotationAngle = 0;

        // Update sliding "GO!" badges riding right in front of the leading Left & Right Feeder rows + footstep dust puffs!
        const leadStepsPastJunc = this.introMarchSteps - 23.0;
        if (leadStepsPastJunc < 0.8) {
          const leadU = Math.max(0.18, 0.225 + (-leadStepsPastJunc) * 0.041);
          const goU = Math.max(0.14, leadU - 0.095);
          const ptL = this.getFeederCurvePoint(-1, goU);
          const ptR = this.getFeederCurvePoint(1, goU);

          if (this._goBadgeLeftEl) {
            const scrL = this.projectToScreen(ptL.x, 0.65, ptL.z);
            this._goBadgeLeftEl.style.left = `${scrL.x}px`;
            this._goBadgeLeftEl.style.top = `${scrL.y}px`;
            if (leadStepsPastJunc > -1.2) this._goBadgeLeftEl.classList.add('open');
          }
          if (this._goBadgeRightEl) {
            const scrR = this.projectToScreen(ptR.x, 0.65, ptR.z);
            this._goBadgeRightEl.style.left = `${scrR.x}px`;
            this._goBadgeRightEl.style.top = `${scrR.y}px`;
            if (leadStepsPastJunc > -1.2) this._goBadgeRightEl.classList.add('open');
          }

          // Periodic white footstep dust puffs under the sprinting leading rows
          this._introDustTimer = (this._introDustTimer || 0) - dt;
          if (this._introDustTimer <= 0 && leadU < 1.15) {
            this._introDustTimer = 0.095;
            const dL = this.getFeederCurvePoint(-1, leadU);
            const dR = this.getFeederCurvePoint(1, leadU);
            this.spawnExhaustSmoke(dL.x, dL.z);
            this.spawnExhaustSmoke(dR.x, dR.z);
          }
        } else {
          if (this._goBadgeLeftEl) { this._goBadgeLeftEl.remove(); this._goBadgeLeftEl = null; }
          if (this._goBadgeRightEl) { this._goBadgeRightEl.remove(); this._goBadgeRightEl = null; }
        }
      } else {
        this.levelIntroRushProgress = 1;
        if (this._goBadgeLeftEl) { this._goBadgeLeftEl.remove(); this._goBadgeLeftEl = null; }
        if (this._goBadgeRightEl) { this._goBadgeRightEl.remove(); this._goBadgeRightEl = null; }

        // Exact Video Revolving Loop Speed (~1.68 rad/s -> 0.86*PI every 1.6s, 3.2x turbo while holding screen!)
        const loopSpeed = Math.min(2.05, 1.68 + Math.floor(this.levelNum / 15) * 0.035) * speedMult;
        this.ringRotationAngle = (this.ringRotationAngle + dt * loopSpeed) % (Math.PI * 2);

        // Refill any empty slots in the revolving oval ring as they pass the Left (PI) or Right (0) Curved Feeder Junctions!
        const juncTol = this._isHoldingFastSpin ? 0.48 : 0.28;
        for (let k = 0; k < RING_SLOT_COUNT; k++) {
          const rowData = this.ovalRingSlots[k];
          const isEmpty = !rowData || rowData.count <= 0;
          if (!isEmpty) continue;

          const theta = (this.ringRotationAngle + (k / RING_SLOT_COUNT) * Math.PI * 2) % (Math.PI * 2);
          const distLeft = Math.abs(theta - Math.PI);
          const distRight = Math.min(theta, Math.PI * 2 - theta);

          if (this.leftFeederRows.length > 0 && distLeft < juncTol) {
            const pulled = this.leftFeederRows.shift();
            pulled.joinBlend = 0.0;
            pulled.joinSide = -1;
            this.ovalRingSlots[k] = pulled;
            this._leftFeederSlideOffset = Math.min(6.0, (this._leftFeederSlideOffset || 0) + 1.0);
          } else if (this.rightFeederRows.length > 0 && distRight < juncTol) {
            const pulled = this.rightFeederRows.shift();
            pulled.joinBlend = 0.0;
            pulled.joinSide = 1;
            this.ovalRingSlots[k] = pulled;
            this._rightFeederSlideOffset = Math.min(6.0, (this._rightFeederSlideOffset || 0) + 1.0);
          }
        }
      }

      // Position all 32 radial rows (either snake-marching along feeder -> oval during intro, or revolving around oval!)
      const rx = 3.36;
      const rz = 2.02;
      // +0.31 3D camera-height parallax offset so bottom-arc heads sit cleanly below the center island's bottom white curb
      // and top-arc heads sit cleanly inside the top outer white curb (matching reference screenshot!)
      const centerZ = -8.24;

      for (let k = 0; k < RING_SLOT_COUNT; k++) {
        const rowData = this.ovalRingSlots[k];
        const members = this.ringRowMeshes[k];
        if (!members) continue;

        let baseX = 0;
        let baseZ = 0;
        let nx = 0;
        let nz = 1;
        let fwdX = 0;
        let fwdZ = 1;
        let hideDuringIntro = false;

        if (isIntroMarching) {
          // k = 0..15 enter from Right Feeder (side = +1) into Bottom Half of Oval (baseSlot = 0, i = 15 - k)
          // k = 16..31 enter from Left Feeder (side = -1) into Top Half of Oval (baseSlot = 16, i = 31 - k)
          const isLeftStream = k >= 16;
          const side = isLeftStream ? -1 : 1;
          const orderInStream = isLeftStream ? (31 - k) : (15 - k); // 0 is leading row, 15 is 16th row
          const baseSlot = isLeftStream ? 16 : 0;
          const stepsPastJunction = this.introMarchSteps - 23.0 - orderInStream;

          if (stepsPastJunction < 0) {
            // Still marching down the Curved U-Feeder Road toward the oval junction!
            const u = 0.225 + (-stepsPastJunction) * 0.041;
            if (u > 1.38) {
              hideDuringIntro = true;
            } else {
              const pt = this.getFeederCurvePoint(side, u);
              baseX = pt.x;
              baseZ = pt.z + 0.24;
              nx = pt.nx;
              nz = pt.nz;
              fwdX = pt.fx;
              fwdZ = pt.fz;
            }
          } else {
            // Has entered the Central Oval Ring and is marching clockwise along its half-arc!
            const slotPos = baseSlot + stepsPastJunction; // 0..15 or 16..31
            const rawTheta = ((slotPos / RING_SLOT_COUNT) * Math.PI * 2) % (Math.PI * 2);
            const targetTheta = rawTheta + 0.21 * Math.sin(2 * rawTheta);
            baseX = Math.cos(targetTheta) * rx;
            baseZ = centerZ + Math.sin(targetTheta) * rz;

            const rawNx = Math.cos(targetTheta) * rz;
            const rawNz = Math.sin(targetTheta) * rx;
            const nLen = Math.hypot(rawNx, rawNz) || 1;
            nx = rawNx / nLen;
            nz = rawNz / nLen;
            fwdX = -Math.sin(targetTheta) * rx;
            fwdZ = Math.cos(targetTheta) * rz;

            // Smooth 1-step corner blend right at the junction entrance (0 <= stepsPastJunction < 1)
            if (stepsPastJunction < 1.0) {
              const jb = stepsPastJunction;
              const mouthPt = this.getFeederCurvePoint(side, 0.225);
              baseX = mouthPt.x + (baseX - mouthPt.x) * jb;
              baseZ = (mouthPt.z + 0.24) + (baseZ - (mouthPt.z + 0.24)) * jb;
              nx = mouthPt.nx + (nx - mouthPt.nx) * jb;
              nz = mouthPt.nz + (nz - mouthPt.nz) * jb;
              fwdX = mouthPt.fx + (fwdX - mouthPt.fx) * jb;
              fwdZ = mouthPt.fz + (fwdZ - mouthPt.fz) * jb;
            }
          }
        } else {
          const rawTheta = (this.ringRotationAngle + (k / RING_SLOT_COUNT) * Math.PI * 2) % (Math.PI * 2);
          const targetTheta = rawTheta + 0.21 * Math.sin(2 * rawTheta);

          baseX = Math.cos(targetTheta) * rx;
          baseZ = centerZ + Math.sin(targetTheta) * rz;

          const rawNx = Math.cos(targetTheta) * rz;
          const rawNz = Math.sin(targetTheta) * rx;
          const nLen = Math.hypot(rawNx, rawNz) || 1;
          nx = rawNx / nLen;
          nz = rawNz / nLen;
          fwdX = -Math.sin(targetTheta) * rx;
          fwdZ = Math.cos(targetTheta) * rz;

          // Smoothly walk newly pulled feeder rows from the feeder waiting mouth (u=0.225) onto the revolving oval loop!
          if (rowData && typeof rowData.joinBlend === 'number' && rowData.joinBlend < 1) {
            rowData.joinBlend = Math.min(1, rowData.joinBlend + dt * (this._isHoldingFastSpin ? 14.0 : 6.2));
            const jb = 1 - Math.pow(1 - rowData.joinBlend, 2);
            const mouthPt = this.getFeederCurvePoint(rowData.joinSide || -1, 0.225);
            baseX = mouthPt.x + (baseX - mouthPt.x) * jb;
            baseZ = (mouthPt.z + 0.24) + (baseZ - (mouthPt.z + 0.24)) * jb;
            nx = mouthPt.nx + (nx - mouthPt.nx) * jb;
            nz = mouthPt.nz + (nz - mouthPt.nz) * jb;
            fwdX = mouthPt.fx + (fwdX - mouthPt.fx) * jb;
            fwdZ = mouthPt.fz + (fwdZ - mouthPt.fz) * jb;
          }
        }

        const yaw = Math.atan2(fwdX, fwdZ);
        const runRate = isIntroMarching ? 0.032 : (this._isHoldingFastSpin ? 0.038 : 0.022);
        const frames = this._stickmanRunFrames;
        const frameCount = frames ? frames.length : 0;

        for (let m = 0; m < ROW_PASSENGERS; m++) {
          const sm = members[m];
          if (!sm) continue;
          if (hideDuringIntro || !rowData || m >= rowData.count) {
            sm.visible = false;
            continue;
          }
          sm.visible = true;
          this.setStickmanColor(sm, rowData.color);

          // 0.415 radial spacing fills the road width curb-to-curb with 4 plump shoulder-to-shoulder runners!
          const radialOffset = (m - 1.5) * 0.415;
          const px = baseX + nx * radialOffset;
          const pz = baseZ + nz * radialOffset;
          const phase = now * runRate + k * 0.85 + m * 0.55;

          if (frameCount > 0) {
            const normPhase = (((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2);
            const fIdx = Math.floor(normPhase * frameCount) % frameCount;
            if (sm.userData.fIdx !== fIdx) {
              sm.userData.fIdx = fIdx;
              sm.geometry = frames[fIdx];
            }
          }

          // Steady y = 0 & rotation.z = 0 (ZERO head/body jiggle!), facing running direction while arms & legs actively pump!
          sm.position.set(px, 0, pz);
          sm.rotation.z = 0;
          sm.rotation.y = yaw;
        }
      }

      // 5. Position waiting rows along Left & Right Curved U-Feeder Roads (stationary when waiting, running when advancing!)
      this.positionFeederLane(this.leftFeederRows, this.leftFeederMeshes, -1, now, dt, isIntroMarching);
      this.positionFeederLane(this.rightFeederRows, this.rightFeederMeshes, 1, now, dt, isIntroMarching);
    }

    positionFeederLane(feederQueue, meshRows, side, now, dt = 0.016, isIntroMarching = false) {
      const decayRate = this._isHoldingFastSpin ? 14.5 : 6.2;
      if (!isIntroMarching) {
        if (side < 0) {
          this._leftFeederSlideOffset = (this._leftFeederSlideOffset || 0) * Math.exp(-dt * decayRate);
          if (this._leftFeederSlideOffset < 0.003) this._leftFeederSlideOffset = 0;
        } else {
          this._rightFeederSlideOffset = (this._rightFeederSlideOffset || 0) * Math.exp(-dt * decayRate);
          if (this._rightFeederSlideOffset < 0.003) this._rightFeederSlideOffset = 0;
        }
      }

      // During intro march, feeder rows follow directly behind the 16th ring row (38 - introMarchSteps steps behind junction!)
      const introBackSteps = isIntroMarching ? Math.max(0, 38.0 - (this.introMarchSteps || 0)) : 0;
      const slideOff = isIntroMarching
        ? introBackSteps
        : (side < 0 ? (this._leftFeederSlideOffset || 0) : (this._rightFeederSlideOffset || 0));

      const isMarchingForward = isIntroMarching || slideOff > 0.015 || this._isHoldingFastSpin;
      const frames = this._stickmanRunFrames;
      const frameCount = frames ? frames.length : 0;

      for (let r = 0; r < meshRows.length; r++) {
        const rowData = feederQueue[r];
        const members = meshRows[r];
        // Tight 0.041 row-to-row spacing along feeder road with ZERO stepWave vibration!
        const u = 0.232 + (r + slideOff) * 0.041;
        const hideOffTop = u > 1.38;
        const pt = this.getFeederCurvePoint(side, Math.min(1.42, u));
        const yaw = Math.atan2(pt.fx, pt.fz);

        for (let m = 0; m < ROW_PASSENGERS; m++) {
          const sm = members[m];
          if (hideOffTop || !rowData || m >= rowData.count) {
            sm.visible = false;
            continue;
          }
          sm.visible = true;
          this.setStickmanColor(sm, rowData.color);

          const lateralOffset = (m - 1.5) * 0.415;
          const targetX = pt.x + pt.nx * lateralOffset;
          const targetZ = pt.z + 0.24 + pt.nz * lateralOffset;

          if (isMarchingForward && frameCount > 0) {
            const phase = now * 0.030 - r * 0.85 + m * 0.55;
            const normPhase = (((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2);
            const fIdx = Math.floor(normPhase * frameCount) % frameCount;
            if (sm.userData.fIdx !== fIdx) {
              sm.userData.fIdx = fIdx;
              sm.geometry = frames[fIdx];
            }
          } else if (this._stickmanIdleGeo && sm.userData.fIdx !== -1) {
            sm.userData.fIdx = -1;
            sm.geometry = this._stickmanIdleGeo;
          }

          sm.position.set(targetX, 0, targetZ);
          sm.rotation.z = 0;
          sm.rotation.y = yaw;
        }
      }
    }

    // -----------------------------------------------------------------------
    // LEVEL INITIALIZATION & MID-LEVEL RESTORE
    // -----------------------------------------------------------------------
    clearLevelMeshes() {
      while (this.vehiclesGroup.children.length > 0) {
        this.vehiclesGroup.remove(this.vehiclesGroup.children[0]);
      }
      while (this.fxGroup.children.length > 0) {
        this.fxGroup.remove(this.fxGroup.children[0]);
      }
      this._smokePool = [];
      if (this.jumpingPassengers && this.jumpingPassengers.length > 0) {
        for (let i = 0; i < this.jumpingPassengers.length; i++) {
          this.releasePooledJumperMesh(this.jumpingPassengers[i].mesh);
        }
      }

      this.lotVehicles = [];
      this.movingVehicles = [];
      this.departingVehicles = [];
      this.jumpingPassengers = [];
      this.smokePuffs = [];
      this.confettiParticles = [];
      this.shockwaves = [];
      this.activeTrainTracks = [];
      this.activeBoosterMode = null;
      const bm = document.getElementById('booster-mode-banner');
      if (bm) bm.style.display = 'none';

      this.initSlots();
      this.buildPassengerMeshPools();
    }

    transitionToNextLevel(nextLevelNum) {
      if (this._fwInterval) { clearInterval(this._fwInterval); this._fwInterval = null; }
      const mw = document.getElementById('modal-win');
      if (mw) {
        mw.style.setProperty('display', 'none', 'important');
        mw.classList.remove('active');
      }

      this.playSkyPlaneTransition(() => {
        this._inHomeLobby = false;
        const hud = document.getElementById('hud-layer');
        if (hud) {
          hud.style.display = 'flex';
          hud.style.opacity = '1';
        }
        this.loadLevel(nextLevelNum, true);
      });
    }

    loadLevel(levelNum, fromTransition = false) {
      this._inHomeLobby = false;
      const liveVid = document.getElementById('home-live-bg-video');
      if (liveVid && !liveVid.paused) {
        liveVid.pause();
      }
      this.clearLevelMeshes();
      this.isLevelOver = false;
      this._deadlockHoldSec = 0;
      this._undoStack = [];
      this._departStreak = 0;
      this._lastDepartTime = 0;
      this._leftFeederSlideOffset = 7.5;
      this._rightFeederSlideOffset = 7.5;
      if (this._failModalTimer) { clearTimeout(this._failModalTimer); this._failModalTimer = null; }
      if (this._winCheckTimer) { clearTimeout(this._winCheckTimer); this._winCheckTimer = null; }
      if (this._goGateDelayTimer) { clearTimeout(this._goGateDelayTimer); this._goGateDelayTimer = null; }

      ['modal-win', 'modal-fail', 'modal-rate', 'modal-pause', 'modal-spin', 'modal-supplies', 'modal-profile'].forEach((id) => {
        this.closeModal(id);
      });

      const oosBanner = document.getElementById('out-of-space-banner');
      if (oosBanner) oosBanner.classList.remove('show');

      const awL = document.getElementById('awning-left');
      const awR = document.getElementById('awning-right');
      if (awL) awL.classList.remove('show');
      if (awR) awR.classList.remove('show');

      const hud = document.getElementById('hud-layer');
      if (hud) {
        hud.style.display = 'flex';
        hud.style.opacity = '1';
      }

      const targetLvl = Math.max(1, this.profile.highestLevel || levelNum);
      this.levelNum = targetLvl;
      this.profile.currentLevel = this.levelNum;
      this.profile.highestLevel = this.levelNum;

      // Refresh 3D World & Park Architecture so every Level Up reveals a fresh architectural theme!
      if (this._builtEnvLevelNum !== this.levelNum || this.envGroup.children.length === 0) {
        this.buildEnvironment3D(this.levelNum);
      } else {
        this.syncLevelArchitecturePropsOverlay();
      }

      const levelData = LevelGenerator.generateLevel(this.levelNum);
      this.totalBusesSentThisLevel = 0;
      this.totalDepartedThisLevel = 0;
      this.totalVehiclesInLevel = 0;
      if (this._extratimeInterval) { clearInterval(this._extratimeInterval); this._extratimeInterval = null; }
      this._extratimeShown = false;
      this.levelTimeTotal = 90;
      this.levelTimeLeft = 90;
      this._lastUrgentSecond = -1;

      levelData.vehicles.forEach((v, idx) => {
        const vObj = {
          ...v,
          maxCap: v.cap,
          mesh: null
        };
        vObj.mesh = this.createVehicleMesh(vObj);
        if (fromTransition) {
          vObj.mesh.scale.set(0.01, 0.01, 0.01);
          setTimeout(() => {
            if (vObj.mesh) vObj.mesh.scale.set(1, 1, 1);
          }, Math.min(280, idx * 12));
        }
        this.vehiclesGroup.add(vObj.mesh);
        this.lotVehicles.push(vObj);
      });

      this.totalVehiclesInLevel = this.lotVehicles.length;
      this.ovalRingSlots = levelData.ovalRingSlots;
      this.leftFeederRows = levelData.leftFeederRows;
      this.rightFeederRows = levelData.rightFeederRows;
      this.levelIntroRushProgress = 0;

      // Exact Competitor Challenge Tagline (Video 00:57 & 00:32!)
      const pctVal = this.levelNum === 6 ? '74.5' : `${64 + ((this.levelNum * 7) % 27)}.${(this.levelNum * 3) % 10}`;
      const tagEl = document.getElementById('challenge-tagline');
      const tagTxt = document.getElementById('challenge-tag-text');
      if (tagEl && tagTxt) {
        tagTxt.innerHTML = `<span class="challenge-tag-pct">${pctVal}%</span> of players found this level<br/>tricky too.`;
        tagEl.classList.add('show');
      }

      const vipOverlay = document.getElementById('vip-selection-overlay');
      if (vipOverlay) vipOverlay.style.display = 'none';
      this.activeBoosterMode = null;

      this._passengersReleased = false;
      this.introMarchSteps = 0;
      const gateDelay = fromTransition ? 1150 : 850;
      this._goGateDelayTimer = setTimeout(() => {
        if (tagEl) tagEl.classList.remove('show');
        this._passengersReleased = true;
        this.introMarchSteps = 0;
        this.levelIntroRushProgress = 0;
        this._leftFeederSlideOffset = 0;
        this._rightFeederSlideOffset = 0;
        this.spawnGoGatesIntro();
      }, gateDelay);

      this.updateHUD();
      this.updateSlotOverlays();
      this.checkAndAutoUnblockLot();
      this.saveGameProgress(false);
    }

    spawnGoGatesIntro() {
      sound.playGoCheer();
      if (sound.musicEnabled) sound.startMusic();

      if (this._goBadgeLeftEl) { this._goBadgeLeftEl.remove(); this._goBadgeLeftEl = null; }
      if (this._goBadgeRightEl) { this._goBadgeRightEl.remove(); this._goBadgeRightEl = null; }

      const ptL = this.getFeederCurvePoint(-1, 1.08);
      const ptR = this.getFeederCurvePoint(1, 1.08);
      const leftPos = this.projectToScreen(ptL.x, 0.65, ptL.z);
      const rightPos = this.projectToScreen(ptR.x, 0.65, ptR.z);

      const makeGoEl = (pos) => {
        const gate = document.createElement('div');
        gate.className = 'go-gate-badge';
        gate.style.left = `${pos.x}px`;
        gate.style.top = `${pos.y}px`;
        gate.textContent = 'GO!';
        this.fxLayer.appendChild(gate);
        return gate;
      };

      this._goBadgeLeftEl = makeGoEl(leftPos);
      this._goBadgeRightEl = makeGoEl(rightPos);
    }

    restoreMidLevelState(mid) {
      this.clearLevelMeshes();
      this.isLevelOver = false;
      this.levelNum = mid.levelNum;
      this.totalBusesSentThisLevel = mid.totalBusesSentThisLevel || 0;
      this.levelTimeTotal = mid.levelTimeTotal || 90;
      this.levelTimeLeft = typeof mid.levelTimeLeft === 'number' && mid.levelTimeLeft > 5 ? mid.levelTimeLeft : this.levelTimeTotal;
      this._lastUrgentSecond = -1;
      this.levelIntroRushProgress = 1;

      (mid.lotVehicles || []).forEach((v) => {
        const vObj = {
          ...v,
          maxCap: v.maxCap || v.cap,
          mesh: null
        };
        vObj.mesh = this.createVehicleMesh(vObj);
        this.vehiclesGroup.add(vObj.mesh);
        this.lotVehicles.push(vObj);
      });

      (mid.slots || []).forEach((savedSlot) => {
        const slot = this.slots[savedSlot.index];
        if (!slot) return;
        slot.unlocked = savedSlot.unlocked;
        if (slot.unlocked && slot.type === 'plus') {
          if (slot.decalMesh) {
            slot.decalMesh.material = this.getSlotDecalMaterial('normal');
            slot.decalMesh.visible = true;
          }
        }
        if (savedSlot.vehicle && savedSlot.vehicle.cap > 0) {
          const vObj = {
            ...savedSlot.vehicle,
            x: slot.x,
            z: slot.z,
            dir: 'UP',
            tilt: slot.tilt
          };
          vObj.mesh = this.createVehicleMesh(vObj);
          vObj.mesh.position.set(slot.x, 0, slot.z);
          vObj.mesh.rotation.y = slot.tilt;
          this.vehiclesGroup.add(vObj.mesh);
          slot.vehicle = vObj;
        }
      });

      this.ovalRingSlots = mid.ovalRingSlots || new Array(RING_SLOT_COUNT).fill(null);
      this.leftFeederRows = mid.leftFeederRows || [];
      this.rightFeederRows = mid.rightFeederRows || [];

      if (sound.musicEnabled) sound.startMusic();
      this.checkAndAutoUnblockLot();
      this.updateHUD();
      this.updateSlotOverlays();
      this.spawnFloatingText(0, -1, '💾 Resumed Saved Game!', '#5ce68b');
    }

    /**
     * Real-time safety guard: ensures that at least one vehicle in the parking lot
     * is ALWAYS unblocked and that the remaining set has 0 cyclic deadlocks!
     */
    checkAndAutoUnblockLot() {
      if (this.lotVehicles.length === 0) return;
      const anyFree = this.lotVehicles.some(
        (v) => !LevelGenerator.findBlockingVehicle(v, this.lotVehicles)
      );
      if (!anyFree) {
        LevelGenerator.enforceCleanVehicleSpacing(this.lotVehicles, 0.34);
      LevelGenerator.ensureNoCyclicDeadlock(this.lotVehicles);
        this.lotVehicles.forEach((v) => {
          if (v.mesh) this.vehiclesGroup.remove(v.mesh);
          v.mesh = this.createVehicleMesh(v);
          this.vehiclesGroup.add(v.mesh);
        });
      }
    }

    // -----------------------------------------------------------------------
    // PLAYER INTERACTION & VEHICLE MOVEMENT
    // -----------------------------------------------------------------------
    onCanvasPointerDown(event) {
      if (this.isLevelOver) return;
      sound.init();

      const rect = this.canvas.getBoundingClientRect();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;

      this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);

      const meshes = this.lotVehicles.map((v) => v.mesh);
      const intersects = this.raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj && !obj.userData.vehicleId && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData.vehicleId) {
          const vehicle = this.lotVehicles.find((v) => v.id === obj.userData.vehicleId);
          if (vehicle) {
            this.handleVehicleTap(vehicle);
          }
        }
      }
    }

    handleVehicleTap(vehicle) {
      if (vehicle.isBumping) return;

      const hint = document.getElementById('tutorial-hint');
      if (hint) hint.style.display = 'none';

      // VIP Airlift Booster Mode (Exact Video 01:12 -> 01:16!)
      if (this.activeBoosterMode === 'vip') {
        const vipSlot = this.slots[0];
        if (vipSlot.vehicle || vipSlot.reserved) {
          this.spawnFloatingText(vipSlot.x, vipSlot.z, 'VIP Slot Busy!', '#ff6b6b');
          return;
        }
        this.activeBoosterMode = null;
        const vipOverlay = document.getElementById('vip-selection-overlay');
        if (vipOverlay) vipOverlay.style.display = 'none';
        this.profile.boosters.vip = Math.max(0, this.profile.boosters.vip - 1);
        sound.playBooster();
        this.sendVehicleToSlot(vehicle, vipSlot, true);
        this.updateHUD();
        this.saveGameProgress(true);
        return;
      }

      // 1. Check if blocked by another vehicle (with smart last-2-cars mutual-unjam & auto-unblock!)
      let blocker = LevelGenerator.findBlockingVehicle(vehicle, this.lotVehicles);
      if (blocker) {
        // If only 2 vehicles remain in the lot and they mutually block each other, let the tapped one leave!
        if (
          this.lotVehicles.length <= 2 &&
          LevelGenerator.findBlockingVehicle(blocker, this.lotVehicles) === vehicle
        ) {
          blocker = null;
        } else {
          this.checkAndAutoUnblockLot();
          blocker = LevelGenerator.findBlockingVehicle(vehicle, this.lotVehicles);
          if (blocker) {
            this.triggerBlockedBumpAnimation(vehicle, blocker);
            return;
          }
        }
      }

      // 2. Find first available unlocked slot (Slots 1..7)
      const targetSlot = this.slots.find(
        (s) => s.index >= 1 && s.unlocked && !s.vehicle && !s.reserved
      );

      if (!targetSlot) {
        sound.playCarBlocked();
        this.showNoSpotsBanner();
        return;
      }

      sound.playCarStart();
      this.sendVehicleToSlot(vehicle, targetSlot, false);
    }

    showNoSpotsBanner() {
      const banner = document.getElementById('no-spots-banner');
      if (!banner) return;
      banner.classList.add('visible');
      clearTimeout(this._noSpotsTimer);
      this._noSpotsTimer = setTimeout(() => banner.classList.remove('visible'), 1300);
    }

    triggerBlockedBumpAnimation(vehicle, blocker) {
      sound.playCarBlocked();
      vehicle.isBumping = true;

      const { fx, fz } = LevelGenerator.getVehicleForward(vehicle);

      const startX = vehicle.x;
      const startZ = vehicle.z;
      const bumpDist = 0.42;

      const hitX = (vehicle.x + blocker.x) / 2;
      const hitZ = (vehicle.z + blocker.z) / 2;
      this.spawnShockwave(hitX, hitZ);
      this.spawnShockwave(blocker.x, blocker.z);
      this.spawnFloatingText(blocker.x, blocker.z, '⬆ Move First!', '#fde047');

      let t = 0;
      const animateBump = () => {
        t += 0.16;
        if (t < 1) {
          const offset = Math.sin(t * Math.PI) * bumpDist;
          vehicle.mesh.position.x = startX + fx * offset;
          vehicle.mesh.position.z = startZ + fz * offset;
          blocker.mesh.rotation.z = Math.sin(t * Math.PI * 2) * 0.11;
          if (blocker.mesh) {
            blocker.mesh.position.y = Math.sin(t * Math.PI) * 0.28;
          }
          requestAnimationFrame(animateBump);
        } else {
          vehicle.mesh.position.set(startX, 0, startZ);
          if (blocker.mesh) {
            blocker.mesh.rotation.z = 0;
            blocker.mesh.position.y = 0;
          }
          vehicle.isBumping = false;
        }
      };
      requestAnimationFrame(animateBump);
    }

    spawnShockwave(x, z) {
      const ringGeo = new THREE.RingGeometry(0.15, 0.32, 20);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff3b4e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(x, 0.9, z);
      this.fxGroup.add(ring);
      this.shockwaves.push({ mesh: ring, scale: 1, opacity: 0.9 });
    }

    getPooledJumperMesh(colorKey) {
      if (!this._jumperPool) this._jumperPool = [];
      let m = this._jumperPool.pop();
      if (!m) {
        m = this.createStickmanMesh();
      }
      m.visible = true;
      this.setStickmanColor(m, colorKey);
      if (m.parent !== this.passengersGroup) {
        this.passengersGroup.add(m);
      }
      return m;
    }

    releasePooledJumperMesh(m) {
      if (!m) return;
      m.visible = false;
      if (!this._jumperPool) this._jumperPool = [];
      if (this._jumperPool.length < 48) {
        this._jumperPool.push(m);
      } else if (m.parent) {
        m.parent.remove(m);
      }
    }

    spawnExhaustSmoke(x, z) {
      if (!this._sharedSmokeGeo) {
        this._sharedSmokeGeo = new THREE.SphereGeometry(0.22, 6, 6);
        this._sharedSmokeMat = new THREE.MeshBasicMaterial({
          color: 0xf8fafc,
          transparent: true,
          opacity: 0.72
        });
      }
      if (!this._smokePool) this._smokePool = [];
      let puff = this._smokePool.pop();
      if (!puff) {
        puff = new THREE.Mesh(this._sharedSmokeGeo, this._sharedSmokeMat);
      }
      puff.visible = true;
      puff.scale.set(1, 1, 1);
      puff.position.set(
        x + (Math.random() - 0.5) * 0.25,
        0.25,
        z + (Math.random() - 0.5) * 0.25
      );
      if (puff.parent !== this.fxGroup) {
        this.fxGroup.add(puff);
      }
      this.smokePuffs.push({
        mesh: puff,
        scale: 1,
        opacity: 0.85
      });
    }

    spawnConfettiBurst(x, z) {
      if (!this._confettiGeo) {
        this._confettiGeo = new THREE.PlaneGeometry(0.16, 0.24);
        const confettiColors = [0xffcc18, 0x2288ff, 0xf03242, 0x26d153, 0xa53dff, 0xffffff];
        this._confettiMats = confettiColors.map((c) => new THREE.MeshBasicMaterial({
          color: c,
          side: THREE.DoubleSide
        }));
      }
      for (let i = 0; i < 18; i++) {
        const p = new THREE.Mesh(this._confettiGeo, this._confettiMats[i % this._confettiMats.length]);
        p.position.set(x, 0.9, z - 0.6);
        this.fxGroup.add(p);
        this.confettiParticles.push({
          mesh: p,
          vx: (Math.random() - 0.5) * 4.5,
          vy: 3.5 + Math.random() * 3.5,
          vz: (Math.random() - 0.5) * 4.5,
          rx: (Math.random() - 0.5) * 10,
          ry: (Math.random() - 0.5) * 10,
          life: 0.75
        });
      }
    }

    sendVehicleToSlot(vehicle, targetSlot, isAirlift = false) {
      const idx = this.lotVehicles.findIndex((v) => v.id === vehicle.id);
      if (idx !== -1) {
        this.lotVehicles.splice(idx, 1);
      }

      targetSlot.reserved = true;
      this.totalBusesSentThisLevel++;

      const waypoints = [];
      if (isAirlift) {
        waypoints.push({ x: vehicle.x, y: 2.6, z: vehicle.z });
        waypoints.push({ x: targetSlot.x, y: 2.6, z: targetSlot.z });
        waypoints.push({ x: targetSlot.x, y: 0, z: targetSlot.z });
      } else {
        // Vector-based exit along exact vehicle nose angle (supports both straight & 45° diagonal formations!)
        const { fx, fz } = LevelGenerator.getVehicleForward(vehicle);
        const minX = -6.35, maxX = 6.35;
        const minZ = -1.15, maxZ = 11.85;

        let sX = Infinity;
        if (fx < -0.15) sX = Math.max(0.2, (minX - vehicle.x) / fx);
        else if (fx > 0.15) sX = Math.max(0.2, (maxX - vehicle.x) / fx);

        let sZ = Infinity;
        if (fz < -0.15) sZ = Math.max(0.2, (minZ - vehicle.z) / fz);
        else if (fz > 0.15) sZ = Math.max(0.2, (maxZ - vehicle.z) / fz);

        const sHit = Math.min(sX, sZ);
        const hitX = Math.max(minX, Math.min(maxX, vehicle.x + fx * sHit));
        const hitZ = Math.max(minZ, Math.min(maxZ, vehicle.z + fz * sHit));

        if (sZ <= sX && fz < 0) {
          // Exits straight/diagonally into Top Boarding Lane (z = -1.15)
          waypoints.push({ x: hitX, y: 0, z: minZ });
          waypoints.push({ x: targetSlot.x, y: 0, z: targetSlot.z });
        } else if (sX < sZ) {
          // Exits into Left or Right Perimeter Lane (x = ±6.35), then up to Top Lane
          const sideX = fx < 0 ? minX : maxX;
          waypoints.push({ x: sideX, y: 0, z: hitZ });
          waypoints.push({ x: sideX, y: 0, z: minZ });
          waypoints.push({ x: targetSlot.x, y: 0, z: targetSlot.z });
        } else {
          // Exits into Bottom Perimeter Lane (z = 11.85), around nearest side, up to Top Lane
          const sideX = hitX <= 0 ? minX : maxX;
          waypoints.push({ x: hitX, y: 0, z: maxZ });
          waypoints.push({ x: sideX, y: 0, z: maxZ });
          waypoints.push({ x: sideX, y: 0, z: minZ });
          waypoints.push({ x: targetSlot.x, y: 0, z: targetSlot.z });
        }
      }

      // Build smooth curved railway path & instant 3D Train/Tram Track when path is clear!
      let finalWaypoints = waypoints;
      let trackRecord = null;
      if (!isAirlift) {
        const startPt = { x: vehicle.x, y: 0, z: vehicle.z };
        const rawPts = [startPt, ...waypoints];
        finalWaypoints = this.buildSmoothRailPath(rawPts);
        trackRecord = this.spawnTrainTrackForPath(startPt, finalWaypoints, vehicle.color, vehicle.id);
      }

      this.movingVehicles.push({
        ...vehicle,
        targetSlot,
        waypoints: finalWaypoints,
        wpIndex: 0,
        smokeTimer: 0,
        speed: isAirlift ? 19 : 18.5,
        isTrainMode: !isAirlift,
        trackRecord
      });

      // Record move in Undo stack so player can recover from any accidental misclick in 1 tap!
      if (!this._undoStack) this._undoStack = [];
      this._undoStack.push({
        vehicleId: vehicle.id,
        origX: vehicle.x,
        origZ: vehicle.z,
        origDir: vehicle.dir,
        origTilt: vehicle.tilt || 0,
        origCap: vehicle.maxCap || vehicle.cap,
        origType: vehicle.type,
        origSubType: vehicle.subType,
        origColor: vehicle.color,
        slotIndex: targetSlot.index
      });

      // Immediately verify remaining lot vehicles have at least one unobstructed move (0 deadlocks!)
      this.checkAndAutoUnblockLot();

      this.saveGameProgress(false);
    }

    // -----------------------------------------------------------------------
    // 1-CLICK UNDO MOVE (Solves Misclick / Fat-Finger Complaint!)
    // -----------------------------------------------------------------------
    undoLastVehicleMove() {
      if (this.isLevelOver) return;
      if (!this._undoStack || this._undoStack.length === 0) {
        this.spawnFloatingText(0, 2, '↩ Nothing to Undo!', '#fde047');
        sound.playCarBlocked();
        return;
      }

      // Find the most recent undoable vehicle (either still driving into a slot or currently parked in a slot)
      let rec = null;
      let parkedSlot = null;
      let movingIdx = -1;

      while (this._undoStack.length > 0) {
        const cand = this._undoStack.pop();
        const mIdx = this.movingVehicles.findIndex((mv) => mv.id === cand.vehicleId);
        if (mIdx !== -1) {
          rec = cand;
          movingIdx = mIdx;
          break;
        }
        const sl = this.slots[cand.slotIndex];
        if (sl && sl.vehicle && sl.vehicle.id === cand.vehicleId) {
          rec = cand;
          parkedSlot = sl;
          break;
        }
      }

      if (!rec) {
        this.spawnFloatingText(0, 2, '↩ Bus Already Departed!', '#fde047');
        sound.playCarBlocked();
        return;
      }

      let vehObj = null;
      let boardedAlready = 0;

      if (movingIdx !== -1) {
        vehObj = this.movingVehicles[movingIdx];
        if (vehObj.trackRecord && vehObj.trackRecord.group) {
          this.fxGroup.remove(vehObj.trackRecord.group);
          vehObj.trackRecord.removed = true;
        }
        if (vehObj.targetSlot) {
          vehObj.targetSlot.reserved = false;
          vehObj.targetSlot.vehicle = null;
        }
        this.movingVehicles.splice(movingIdx, 1);
      } else if (parkedSlot && parkedSlot.vehicle) {
        vehObj = parkedSlot.vehicle;
        if (this.activeTrainTracks) {
          for (let tIdx = this.activeTrainTracks.length - 1; tIdx >= 0; tIdx--) {
            const tr = this.activeTrainTracks[tIdx];
            if (tr.vehicleId === rec.vehicleId && tr.group) {
              this.fxGroup.remove(tr.group);
              this.activeTrainTracks.splice(tIdx, 1);
            }
          }
        }
        boardedAlready = Math.max(0, rec.origCap - vehObj.cap);
        parkedSlot.vehicle = null;
        parkedSlot.reserved = false;
      }

      // Cancel any in-flight jumping passengers heading to this slot and count them to restore
      for (let i = this.jumpingPassengers.length - 1; i >= 0; i--) {
        const jp = this.jumpingPassengers[i];
        if (jp.targetSlotIndex === rec.slotIndex && jp.color === rec.origColor) {
          this.releasePooledJumperMesh(jp.mesh);
          this.jumpingPassengers.splice(i, 1);
          boardedAlready += 1;
        }
      }

      // Return any boarded passengers back into the revolving oval loop / feeder road so count stays 100% exact!
      let remToRestore = boardedAlready;
      for (let k = 0; k < RING_SLOT_COUNT && remToRestore > 0; k++) {
        const r = this.ovalRingSlots[k];
        if (r && r.color === rec.origColor && r.count < ROW_PASSENGERS) {
          const add = Math.min(remToRestore, ROW_PASSENGERS - r.count);
          r.count += add;
          remToRestore -= add;
        }
      }
      for (let k = 0; k < RING_SLOT_COUNT && remToRestore > 0; k++) {
        if (!this.ovalRingSlots[k] || this.ovalRingSlots[k].count <= 0) {
          const add = Math.min(remToRestore, ROW_PASSENGERS);
          this.ovalRingSlots[k] = { color: rec.origColor, count: add };
          remToRestore -= add;
        }
      }
      while (remToRestore > 0) {
        const add = Math.min(remToRestore, ROW_PASSENGERS);
        this.leftFeederRows.unshift({ color: rec.origColor, count: add });
        remToRestore -= add;
      }

      if (vehObj && vehObj.mesh) {
        this.vehiclesGroup.remove(vehObj.mesh);
      }

      const restoredVeh = {
        id: rec.vehicleId,
        x: rec.origX,
        z: rec.origZ,
        dir: rec.origDir,
        tilt: rec.origTilt,
        type: rec.origType,
        subType: rec.origSubType,
        color: rec.origColor,
        cap: rec.origCap,
        maxCap: rec.origCap,
        inFlightCount: 0,
        isBumping: false
      };
      restoredVeh.mesh = this.createVehicleMesh(restoredVeh);
      restoredVeh.baseRotY = restoredVeh.mesh.rotation.y;
      restoredVeh.shuffleAnim = 0.75;
      this.vehiclesGroup.add(restoredVeh.mesh);
      this.lotVehicles.push(restoredVeh);
      this.totalBusesSentThisLevel = Math.max(0, this.totalBusesSentThisLevel - 1);

      sound.playButtonClick();
      this.spawnShockwave(restoredVeh.x, restoredVeh.z);
      this.spawnFloatingText(restoredVeh.x, restoredVeh.z, '↩ Move Undone!', '#38bdf8');
      this.updateSlotOverlays();
      this.updatePassengerCountOnly();
      this.saveGameProgress(false);
    }

    // -----------------------------------------------------------------------
    // SMART AI HINT (Highlights the #1 Best Unblocked Vehicle Matching the Loop!)
    // -----------------------------------------------------------------------
    showSmartMoveHint() {
      if (this.isLevelOver || this.lotVehicles.length === 0) return;
      this.checkAndAutoUnblockLot();

      const unblocked = this.lotVehicles.filter(
        (v) => !LevelGenerator.findBlockingVehicle(v, this.lotVehicles)
      );
      const candidates = unblocked.length > 0 ? unblocked : this.lotVehicles;

      // Count passenger color demand in the revolving oval loop (3x weight) + front of feeder lanes (1x weight)
      const colorScore = {};
      for (let k = 0; k < RING_SLOT_COUNT; k++) {
        const r = this.ovalRingSlots[k];
        if (r && r.count > 0) {
          colorScore[r.color] = (colorScore[r.color] || 0) + r.count * 3;
        }
      }
      for (let i = 0; i < Math.min(4, this.leftFeederRows.length); i++) {
        const r = this.leftFeederRows[i];
        if (r && r.count > 0) colorScore[r.color] = (colorScore[r.color] || 0) + r.count;
      }
      for (let i = 0; i < Math.min(4, this.rightFeederRows.length); i++) {
        const r = this.rightFeederRows[i];
        if (r && r.count > 0) colorScore[r.color] = (colorScore[r.color] || 0) + r.count;
      }

      let bestVeh = candidates[0];
      let bestVal = -1;
      for (const v of candidates) {
        const sc = (colorScore[v.color] || 0) + (v.type === 'bus' ? 2 : 0);
        if (sc > bestVal) {
          bestVal = sc;
          bestVeh = v;
        }
      }

      if (bestVeh) {
        sound.playButtonClick();
        bestVeh.baseRotY = bestVeh.mesh ? bestVeh.mesh.rotation.y : 0;
        bestVeh.shuffleAnim = 0.9;
        this.spawnShockwave(bestVeh.x, bestVeh.z);
        this.spawnFloatingText(bestVeh.x, bestVeh.z, '💡 Best Move!', '#4ade80');
      }
    }

    // -----------------------------------------------------------------------
    // 3D TRAIN / TRAM TRACK BUILDER & WINGED BUS SKY FLIGHT ENGINE
    // -----------------------------------------------------------------------
    buildSmoothRailPath(rawPts) {
      if (!rawPts || rawPts.length <= 2) return rawPts ? rawPts.slice(1) : [];
      const smooth = [rawPts[0]];
      const cornerSteps = 6;

      for (let i = 1; i < rawPts.length - 1; i++) {
        const prev = rawPts[i - 1];
        const curr = rawPts[i];
        const next = rawPts[i + 1];

        const vx1 = prev.x - curr.x;
        const vz1 = prev.z - curr.z;
        const len1 = Math.hypot(vx1, vz1) || 1;

        const vx2 = next.x - curr.x;
        const vz2 = next.z - curr.z;
        const len2 = Math.hypot(vx2, vz2) || 1;

        const r = Math.min(1.25, len1 * 0.42, len2 * 0.42);
        const pA = { x: curr.x + (vx1 / len1) * r, y: 0, z: curr.z + (vz1 / len1) * r };
        const pB = { x: curr.x + (vx2 / len2) * r, y: 0, z: curr.z + (vz2 / len2) * r };

        for (let s = 0; s <= cornerSteps; s++) {
          const t = s / cornerSteps;
          const inv = 1 - t;
          smooth.push({
            x: inv * inv * pA.x + 2 * inv * t * curr.x + t * t * pB.x,
            y: 0,
            z: inv * inv * pA.z + 2 * inv * t * curr.z + t * t * pB.z
          });
        }
      }
      smooth.push(rawPts[rawPts.length - 1]);
      return smooth.slice(1);
    }

    spawnTrainTrackForPath(startPt, smoothWaypoints, colorKey, vehicleId) {
      if (!this.activeTrainTracks) this.activeTrainTracks = [];
      const pts = [];
      if (startPt) {
        pts.push({ x: startPt.x, z: startPt.z });
      }
      for (let i = 0; i < smoothWaypoints.length; i++) {
        pts.push({ x: smoothWaypoints[i].x, z: smoothWaypoints[i].z });
      }
      if (pts.length < 2) return null;

      if (!this._railTieGeo) {
        this._railTieGeo = new THREE.BoxGeometry(1.04, 0.036, 0.16);
        this._railTieMat = new THREE.MeshStandardMaterial({
          color: 0x4a3222,
          roughness: 0.75,
          metalness: 0.05
        });
        this._railSteelUnitGeo = new THREE.BoxGeometry(0.085, 0.055, 1.0);
        this._railCenterUnitGeo = new THREE.BoxGeometry(0.11, 0.042, 1.0);
      }

      const cInfo = COLORS[colorKey] || COLORS.blue;
      const trackGroup = new THREE.Group();
      const steelMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.25,
        metalness: 0.72,
        transparent: true,
        opacity: 1
      });
      const tieMat = this._railTieMat.clone();
      tieMat.transparent = true;
      tieMat.opacity = 1;
      const glowMat = new THREE.MeshBasicMaterial({
        color: cInfo.lightHex || cInfo.hex,
        transparent: true,
        opacity: 0.92
      });

      // Walk along polyline to place wooden railroad ties (sleepers) & dual steel rails
      let carryDist = 0;
      const tieSpacing = 0.44;

      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const segLen = Math.hypot(dx, dz);
        if (segLen < 0.04) continue;

        const rotY = Math.atan2(-dx, -dz);
        const midX = (a.x + b.x) * 0.5;
        const midZ = (a.z + b.z) * 0.5;
        // Right normal vector perpendicular to track heading
        const rx = Math.cos(rotY);
        const rz = -Math.sin(rotY);

        // Left & Right Metallic Steel Rails for this segment
        for (const side of [-0.33, 0.33]) {
          const railMesh = new THREE.Mesh(this._railSteelUnitGeo, steelMat);
          railMesh.scale.set(1, 1, segLen + 0.06);
          railMesh.position.set(midX + rx * side, 0.052, midZ + rz * side);
          railMesh.rotation.y = rotY;
          trackGroup.add(railMesh);
        }

        // Glowing Color-Matched Center Tram Guide Strip
        const centerStrip = new THREE.Mesh(this._railCenterUnitGeo, glowMat);
        centerStrip.scale.set(1, 1, segLen + 0.04);
        centerStrip.position.set(midX, 0.038, midZ);
        centerStrip.rotation.y = rotY;
        trackGroup.add(centerStrip);

        // Wooden Railroad Ties (Sleepers) every 0.44 units
        let d = carryDist;
        while (d <= segLen) {
          const t = d / segLen;
          const tx = a.x + dx * t;
          const tz = a.z + dz * t;
          const tie = new THREE.Mesh(this._railTieGeo, tieMat);
          tie.position.set(tx, 0.022, tz);
          tie.rotation.y = rotY;
          trackGroup.add(tie);
          d += tieSpacing;
        }
        carryDist = d - segLen;
      }

      this.fxGroup.add(trackGroup);
      const record = {
        group: trackGroup,
        vehicleId,
        materials: [steelMat, tieMat, glowMat],
        age: 0,
        fadingOut: false,
        fadeAlpha: 1.0,
        removed: false
      };
      this.activeTrainTracks.push(record);
      return record;
    }

    launchWingedBusTakeoff(departingBus) {
      if (!departingBus || !departingBus.mesh) return;
      const busMesh = departingBus.mesh;
      busMesh.scale.set(1, 1, 1);
      busMesh.rotation.order = 'YXZ';

      if (!this._wingPrimaryGeo) {
        this._wingPrimaryGeo = new THREE.BoxGeometry(1.48, 0.065, 0.58);
        this._wingSecondaryGeo = new THREE.BoxGeometry(1.12, 0.075, 0.42);
        this._wingInnerGeo = new THREE.BoxGeometry(0.76, 0.085, 0.30);
        this._wingGoldEdgeGeo = new THREE.BoxGeometry(1.52, 0.078, 0.14);
        this._wingWhiteMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.25,
          metalness: 0.1
        });
        this._wingGoldMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          roughness: 0.22,
          metalness: 0.35
        });
      }

      const cInfo = COLORS[departingBus.color] || COLORS.blue;
      const accentMat = new THREE.MeshStandardMaterial({
        color: cInfo.lightHex || cInfo.hex,
        roughness: 0.3,
        metalness: 0.1
      });

      const buildWingSide = (dirSign) => {
        const pivot = new THREE.Group();
        pivot.position.set(dirSign * 0.48, 0.58, 0.05);

        const sweep = dirSign * -0.22;

        // Primary white outer wing blade
        const pWing = new THREE.Mesh(this._wingPrimaryGeo, this._wingWhiteMat);
        pWing.position.set(dirSign * 0.72, 0.02, 0.08);
        pWing.rotation.y = sweep;
        pivot.add(pWing);

        // Golden leading-edge spar
        const gEdge = new THREE.Mesh(this._wingGoldEdgeGeo, this._wingGoldMat);
        gEdge.position.set(dirSign * 0.74, 0.03, -0.18);
        gEdge.rotation.y = sweep;
        pivot.add(gEdge);

        // Color-matched mid feather layer
        const sWing = new THREE.Mesh(this._wingSecondaryGeo, accentMat);
        sWing.position.set(dirSign * 0.54, 0.045, 0.16);
        sWing.rotation.y = sweep * 1.1;
        pivot.add(sWing);

        // Inner white feather layer
        const iWing = new THREE.Mesh(this._wingInnerGeo, this._wingWhiteMat);
        iWing.position.set(dirSign * 0.36, 0.065, 0.22);
        iWing.rotation.y = sweep * 1.2;
        pivot.add(iWing);

        pivot.scale.set(0.05, 0.05, 0.05);
        return pivot;
      };

      const leftWing = buildWingSide(-1);
      const rightWing = buildWingSide(1);
      busMesh.add(leftWing);
      busMesh.add(rightWing);

      this.departingVehicles.push({
        mesh: busMesh,
        leftWing,
        rightWing,
        flightTime: 0,
        startRotY: busMesh.rotation.y,
        smokeTimer: 0,
        speed: 9.5
      });
    }

    // -----------------------------------------------------------------------
    // BOARDING FROM REVOLVING OVAL LOOP AT BOTTOM GATE (Video 00:39-01:20)
    // -----------------------------------------------------------------------
    updateBoardingFromRevolvingLoop(dt) {
      if (this.isLevelOver) return;
      if (typeof this.introMarchSteps === 'number' && this.introMarchSteps < 34) return;

      this.boardingCooldown -= dt;
      if (this.boardingCooldown > 0) return;

      // Strict revolving loop rule: Parked vehicles ONLY board if their color is genuinely inside the revolving circle!
      // Colors waiting in feeder roads only enter the circle naturally when existing circle rows are cleared.

      // Find any row in the revolving oval ring that is near the bottom boarding gate (theta around PI/2 = 1.57)
      // and matches a parked vehicle's color!
      let boardedAny = false;

      for (let k = 0; k < RING_SLOT_COUNT; k++) {
        const rowData = this.ovalRingSlots[k];
        if (!rowData || rowData.count <= 0) continue;

        const theta = (this.ringRotationAngle + (k / RING_SLOT_COUNT) * Math.PI * 2) % (Math.PI * 2);
        // Bottom boarding zone of the oval ring (sin(theta) > 0.35 means near bottom gate!)
        if (Math.sin(theta) < 0.35) continue;

        const matchingSlot = this.slots.find(
          (s) =>
            s.vehicle &&
            s.vehicle.color === rowData.color &&
            s.vehicle.cap - (s.vehicle.inFlightCount || 0) > 0
        );

        if (matchingSlot) {
          this.boardingCooldown = this._isHoldingFastSpin ? 0.009 : 0.025; // Turbo boarding stream while holding screen!
          rowData.count -= 1;
          const startPos = this.ringRowMeshes[k][rowData.count].position;

          if (rowData.count <= 0) {
            this.ovalRingSlots[k] = null;
          }

          matchingSlot.vehicle.inFlightCount = (matchingSlot.vehicle.inFlightCount || 0) + 1;

          const jumper = this.getPooledJumperMesh(rowData.color);
          jumper.position.copy(startPos);

          this.jumpingPassengers.push({
            mesh: jumper,
            color: rowData.color,
            startX: startPos.x,
            startZ: startPos.z,
            endX: matchingSlot.x,
            endZ: matchingSlot.z,
            targetSlotIndex: matchingSlot.index,
            progress: 0
          });

          boardedAny = true;
          this.updatePassengerCountOnly();
          break;
        }
      }

      if (!boardedAny) {
        this.checkAllSlotsFullDeadlock(dt);
      } else {
        this._deadlockHoldSec = 0;
      }
    }

    checkAllSlotsFullDeadlock(dt = 0.016) {
      if (
        this.isLevelOver ||
        this._passengersReleased === false ||
        this.levelIntroRushProgress < 1 ||
        this.movingVehicles.length > 0 ||
        this.jumpingPassengers.length > 0 ||
        this.departingVehicles.length > 0
      ) {
        this._deadlockHoldSec = 0;
        return;
      }

      const unlockedNormalSlots = this.slots.filter((s) => s.index >= 1 && s.unlocked);
      const allFull = unlockedNormalSlots.length > 0 && unlockedNormalSlots.every((s) => s.vehicle !== null);
      if (!allFull) {
        this._deadlockHoldSec = 0;
        return;
      }

      // IMPORTANT: If the oval ring currently has empty slots AND feeder roads still have waiting passengers,
      // wait for the spinning ring to rotate to the feeder junctions and refill before declaring deadlock!
      const hasEmptyRingSlot = this.ovalRingSlots.some((r) => !r || r.count <= 0);
      const hasWaitingFeeder = this.leftFeederRows.length > 0 || this.rightFeederRows.length > 0;
      if (hasEmptyRingSlot && hasWaitingFeeder) {
        this._deadlockHoldSec = 0;
        return;
      }

      // Check if ANY passenger currently inside the revolving oval ring matches ANY parked bus
      const colorsInOvalRing = new Set();
      for (const r of this.ovalRingSlots) {
        if (r && r.count > 0) colorsInOvalRing.add(r.color);
      }

      const anyMatchingInRing = this.slots.some(
        (s) => s.vehicle && s.vehicle.cap > 0 && colorsInOvalRing.has(s.vehicle.color)
      );

      if (anyMatchingInRing) {
        this._deadlockHoldSec = 0;
        return;
      }

      // Require true deadlock to persist for 1.1s so mid-rotation frames never false-trigger!
      this._deadlockHoldSec = (this._deadlockHoldSec || 0) + dt;
      if (this._deadlockHoldSec < 1.1) return;
      this._deadlockHoldSec = 0;

      this.isLevelOver = true;
      this.failReason = 'slots';
      sound.playFailAlert();

      // Step 1: Pop in "Out of Space!" banner across screen (Exact Video 00:54!)
      const oosBanner = document.getElementById('out-of-space-banner');
      if (oosBanner) oosBanner.classList.add('show');

      const oosCoinEl = document.getElementById('oos-coin-count');
      if (oosCoinEl) oosCoinEl.textContent = `${this.profile.coins}`;

      // Step 2: Transition into "Out of Spots" Modal with Live Preview Animation (Video 00:56!)
      clearTimeout(this._failModalTimer);
      this._failModalTimer = setTimeout(() => {
        if (oosBanner) oosBanner.classList.remove('show');
        if (this.isLevelOver) {
          this.openModal('modal-fail');
          this.startOutOfSpotsPreviewAnim();
        }
      }, 950);
    }

    startOutOfSpotsPreviewAnim() {
      const canvas = document.getElementById('oos-preview-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = 320;
      const H = 150;
      if (canvas.width !== W * 3) {
        canvas.width = W * 3;
        canvas.height = H * 3;
      }
      ctx.setTransform(3, 0, 0, 3, 0, 0);

      if (this._oosAnimFrame) {
        cancelAnimationFrame(this._oosAnimFrame);
        this._oosAnimFrame = null;
      }

      const startT = performance.now();
      const busSpecs = [
        { x: 46, col: '#facc15', roof: '#fef08a', badge: '4', bCol: '#eab308' },
        { x: 104, col: '#9333ea', roof: '#d8b4fe', badge: '6', bCol: '#7e22ce' },
        { x: 162, col: '#ef4444', roof: '#fca5a5', badge: '4', bCol: '#dc2626' },
        { x: 220, col: '#22c55e', roof: '#86efac', badge: '8', bCol: '#16a34a' }
      ];

      const renderFrame = (now) => {
        const modal = document.getElementById('modal-fail');
        if (!modal || !modal.classList.contains('active')) {
          this._oosAnimFrame = null;
          return;
        }

        const elapsed = ((now - startT) / 1000) % 2.8;
        ctx.clearRect(0, 0, W, H);

        // Top green park strip
        ctx.fillStyle = '#8ec057';
        ctx.fillRect(0, 0, W, 34);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(0, 32, W, 5);

        // Asphalt boarding road
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, 37, W, H - 37);

        // Dashed yellow road line
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.55)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(10, 128);
        ctx.lineTo(W - 10, 128);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw 5 angled parking bays (4 occupied + 5th unlocking "+1" slot!)
        const slotXs = [46, 104, 162, 220, 276];
        slotXs.forEach((sx, idx) => {
          ctx.save();
          ctx.translate(sx, 82);
          ctx.rotate(-0.22);
          const isPlusSlot = idx === 4;
          const unlockedPhase = elapsed > 1.15;

          ctx.strokeStyle = isPlusSlot && unlockedPhase ? '#4ade80' : 'rgba(255,255,255,0.65)';
          ctx.lineWidth = isPlusSlot && unlockedPhase ? 3 : 2;
          ctx.strokeRect(-20, -32, 40, 64);

          if (isPlusSlot) {
            ctx.fillStyle = unlockedPhase ? 'rgba(74, 222, 128, 0.28)' : 'rgba(15, 23, 42, 0.35)';
            ctx.fillRect(-18, -30, 36, 60);
            ctx.fillStyle = unlockedPhase ? '#4ade80' : '#fde047';
            ctx.font = '900 18px "Segoe UI", Arial';
            ctx.textAlign = 'center';
            ctx.fillText(unlockedPhase ? '✓' : '+1', 0, 6);
          }
          ctx.restore();
        });

        // Animate 4 parked buses clearing out with confetti & smoke (elapsed 0.85s -> 2.1s)
        busSpecs.forEach((b, idx) => {
          const delay = idx * 0.08;
          const clearT = Math.max(0, (elapsed - (0.85 + delay)) / 0.65);
          if (clearT < 1) {
            const slideX = clearT > 0 ? Math.pow(clearT, 1.7) * 140 : 0;
            const scale = clearT > 0 ? Math.max(0.2, 1 - clearT * 0.35) : 1;

            ctx.save();
            ctx.translate(b.x + slideX, 82 - clearT * 18);
            ctx.rotate(-0.22 + clearT * 0.22);
            ctx.scale(scale, scale);

            // Bus shadow
            ctx.fillStyle = 'rgba(15,23,42,0.35)';
            ctx.fillRect(-15, -26, 32, 54);

            // Bus body
            ctx.fillStyle = b.col;
            ctx.beginPath();
            ctx.roundRect(-16, -28, 32, 54, 7);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Roof stripe
            ctx.fillStyle = b.roof;
            ctx.fillRect(-11, -18, 22, 34);

            // Windshield
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-12, -25, 24, 7);

            ctx.restore();

            // Capacity badge below slot
            if (clearT === 0) {
              ctx.fillStyle = b.bCol;
              ctx.beginPath();
              ctx.roundRect(b.x - 12, 108, 24, 18, 6);
              ctx.fill();
              ctx.strokeStyle = '#fff';
              ctx.lineWidth = 1.5;
              ctx.stroke();
              ctx.fillStyle = '#fff';
              ctx.font = '900 11px "Segoe UI", Arial';
              ctx.textAlign = 'center';
              ctx.fillText(b.badge, b.x, 121);
            }
          }

          // Confetti & white smoke burst when clearing!
          if (clearT > 0.02 && clearT < 0.95) {
            const cols = ['#fde047', '#38bdf8', '#f43f5e', '#4ade80', '#ffffff'];
            for (let p = 0; p < 5; p++) {
              const ang = (p / 5) * Math.PI * 2 + clearT * 3;
              const rad = clearT * 26;
              ctx.fillStyle = cols[p % cols.length];
              ctx.beginPath();
              ctx.arc(b.x + Math.cos(ang) * rad, 80 + Math.sin(ang) * rad, 3.2 * (1 - clearT * 0.5), 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });

        this._oosAnimFrame = requestAnimationFrame(renderFrame);
      };

      this._oosAnimFrame = requestAnimationFrame(renderFrame);
    }

    clearAllParkedBusesAndUnlockSpot() {
      // 1. Unlock 1 extra '+' boarding slot
      const lockedPlus = this.slots.find((s) => s.type === 'plus' && !s.unlocked);
      if (lockedPlus) {
        lockedPlus.unlocked = true;
        if (lockedPlus.decalMesh) {
          lockedPlus.decalMesh.material = this.getSlotDecalMaterial('normal');
          lockedPlus.decalMesh.visible = true;
        }
      }

      // 2. Clear ALL parked buses in normal slots & drain their matching passengers
      let clearedCount = 0;
      this.slots.forEach((slot) => {
        if (slot.index >= 1 && slot.vehicle) {
          const bus = slot.vehicle;
          const targetColor = bus.color;
          let toRemove = Math.max(0, bus.cap - (bus.inFlightCount || 0));

          for (let k = 0; k < RING_SLOT_COUNT && toRemove > 0; k++) {
            const r = this.ovalRingSlots[k];
            if (r && r.color === targetColor && r.count > 0) {
              const take = Math.min(toRemove, r.count);
              r.count -= take;
              toRemove -= take;
              if (r.count <= 0) this.ovalRingSlots[k] = null;
            }
          }
          for (let i = 0; i < this.leftFeederRows.length && toRemove > 0; i++) {
            const r = this.leftFeederRows[i];
            if (r && r.color === targetColor && r.count > 0) {
              const take = Math.min(toRemove, r.count);
              r.count -= take;
              toRemove -= take;
              if (r.count <= 0) {
                this.leftFeederRows.splice(i, 1);
                i--;
              }
            }
          }
          for (let i = 0; i < this.rightFeederRows.length && toRemove > 0; i++) {
            const r = this.rightFeederRows[i];
            if (r && r.color === targetColor && r.count > 0) {
              const take = Math.min(toRemove, r.count);
              r.count -= take;
              toRemove -= take;
              if (r.count <= 0) {
                this.rightFeederRows.splice(i, 1);
                i--;
              }
            }
          }

          slot.vehicle = null;
          slot.reserved = false;
          this.spawnConfettiBurst(slot.x, slot.z);
          this.launchWingedBusTakeoff(bus);
          clearedCount++;
        }
      });

      if (clearedCount > 0) {
        sound.playBusDepart();
      }
      this.buildPassengerMeshPools();
    }

    _showExtraTimeModal() {
      const modal = document.getElementById('modal-extratime');
      if (!modal) { this.isLevelOver = true; this.failReason = 'timeout'; return; }
      this.openModal('modal-extratime');
      let countdown = 5;
      const cdEl = document.getElementById('extratime-countdown');
      if (cdEl) cdEl.textContent = countdown;
      if (this._extratimeInterval) clearInterval(this._extratimeInterval);
      this._extratimeInterval = setInterval(() => {
        countdown--;
        if (cdEl) cdEl.textContent = Math.max(0, countdown);
        if (countdown <= 0) {
          clearInterval(this._extratimeInterval);
          this._extratimeInterval = null;
          this.closeModal('modal-extratime');
          this.isLevelOver = true;
          this.failReason = 'timeout';
          this._showFailAfterTimeout();
        }
      }, 1000);
    }

    _showFailAfterTimeout() {
      const fTitle = document.getElementById('fail-modal-title');
      const fSub   = document.getElementById('fail-modal-subtitle');
      const btnSlot = document.getElementById('btn-revive-slot');
      const btnFree = document.getElementById('btn-revive-free');
      if (fTitle) fTitle.textContent = "⏰ Time's Up!";
      if (fSub) fSub.textContent = 'Time ran out before all passengers boarded!';
      if (btnSlot) { btnSlot.style.display = 'none'; }
      if (btnFree) { btnFree.style.display = 'none'; }
      this.openModal('modal-fail');
    }

    checkLevelWinCondition() {
      if (this.isLevelOver || !this._splashStarted) return;
      if (this.totalBusesSentThisLevel === 0) return; // Cannot win before even playing!

      const remainingPass = this.getTotalRemainingPassengers();
      const totalInFlight = this.jumpingPassengers.length;

      // If 0 passengers remain anywhere on the map and no buses are left in the lot/moving,
      // any partially-filled bus still waiting in a slot has no more passengers to board — depart it!
      if (
        remainingPass === 0 &&
        totalInFlight === 0 &&
        this.lotVehicles.length === 0 &&
        this.movingVehicles.length === 0
      ) {
        let departedAny = false;
        for (const slot of this.slots) {
          if (slot.vehicle) {
            const departingBus = slot.vehicle;
            slot.vehicle = null;
            sound.playBusDepart();
            this.spawnConfettiBurst(slot.x, slot.z);
            this.launchWingedBusTakeoff(departingBus);
            departedAny = true;
          }
        }
        if (departedAny) {
          this.updateSlotOverlays();
          return; // wait for departing bus to finish driving off screen
        }
      }

      const anyParked = this.slots.some((s) => s.vehicle !== null);
      const allVehiclesGone =
        this.lotVehicles.length === 0 &&
        this.movingVehicles.length === 0 &&
        this.departingVehicles.length === 0 &&
        !anyParked &&
        (this.totalDepartedThisLevel || 0) > 0;

      if (allVehiclesGone && totalInFlight === 0) {
        if (this._winCheckTimer) return;
        this._winCheckTimer = setTimeout(() => {
          this._winCheckTimer = null;
          if (this.isLevelOver) return;
          const anyParked2 = this.slots.some((s) => s.vehicle !== null);
          if (
            this.jumpingPassengers.length > 0 ||
            this.lotVehicles.length > 0 ||
            this.movingVehicles.length > 0 ||
            this.departingVehicles.length > 0 ||
            anyParked2
          ) return;
          this._triggerWin();
        }, 180);
      }
    }

    _triggerWin() {
      if (this.isLevelOver) return;
      if (this.lotVehicles.length > 0 || this.movingVehicles.length > 0 || this.departingVehicles.length > 0) {
        return; // Guard: Never trigger win if vehicles are still active
      }
      this.isLevelOver = true;
      if (this._extratimeInterval) {
        clearInterval(this._extratimeInterval);
        this._extratimeInterval = null;
      }
      const etModal = document.getElementById('modal-extratime');
      if (etModal) etModal.classList.remove('active');

      const vipOverlay = document.getElementById('vip-selection-overlay');
      if (vipOverlay) vipOverlay.style.display = 'none';
      this.activeBoosterMode = null;

      sound.playWinFanfare();

      const coinsEarned = 50;
      const completedLevel = this.levelNum;
      this._lastCompletedLevel = completedLevel;
      this._winCoinsClaimed = false;

      this.profile.levelStars[this.levelNum] = 3;
      this.profile.passengersHelped = (this.profile.passengersHelped || 2800) + 45;
      this.profile.spinWinsProgress = Math.min(10, (this.profile.spinWinsProgress || 1) + 1);

      // Grant +1 Free Spin every 4 levels cleared (capped at 2 Free Spins max!)
      if (completedLevel % 4 === 0 && (this.profile.freeSpins || 0) < 2) {
        this.profile.freeSpins = Math.min(2, (this.profile.freeSpins || 0) + 1);
        if (this.profile.freeSpins >= 2) {
          this.profile.nextFreeSpinAt = 0;
        }
      }
      this.profile.currentLevel = this.levelNum + 1;
      if (this.profile.currentLevel > this.profile.highestLevel) {
        this.profile.highestLevel = this.profile.currentLevel;
      }
      this.profile.activeMidLevelState = null;

      // Check & Grant Recurring 5/10-Level Milestone Prizes, Rank-Up Prizes (Bronze -> Ace Lv.5000) & Avatar Unlocks!
      this.checkAndGrantLevelMilestoneAndRankPrizes(completedLevel, this.profile.currentLevel);

      this.saveGameProgress(true);

      const totalCoinsEl = document.getElementById('win-total-coins');
      if (totalCoinsEl) totalCoinsEl.textContent = `${this.profile.coins}`;
      const earnedCoinsEl = document.getElementById('win-coins-earned');
      if (earnedCoinsEl) earnedCoinsEl.textContent = `+${coinsEarned}`;

      // Show "Having Fun?" rating popup on Level 3 (just like Video 01:22!)
      if (completedLevel === 3 && !this.profile.ratedGame) {
        this.profile.ratedGame = true;
        this.openModal('modal-rate');
      } else {
        this.openWinScreenWithFireworks();
      }
      this.updateHUD();
    }

    openWinScreenWithFireworks() {
      if (
        this.lotVehicles.length > 0 ||
        this.movingVehicles.length > 0 ||
        this.departingVehicles.length > 0 ||
        this.totalBusesSentThisLevel === 0 ||
        !this.isLevelOver
      ) {
        const mw = document.getElementById('modal-win');
        if (mw) {
          mw.style.setProperty('display', 'none', 'important');
          mw.classList.remove('active');
        }
        return;
      }
      const mw = document.getElementById('modal-win');
      if (mw) {
        mw.style.setProperty('display', 'flex', 'important');
        mw.classList.add('active');
      }
      this.startFireworksCanvas();
      this.startWin3DScene();
    }

    // -----------------------------------------------------------------------
    // 60-FPS 3X RETINA 3D VICTORY SCENE (Custom 3D Red-Cap Girl, Zero Jiggle, Smooth Celebration!)
    // -----------------------------------------------------------------------
    startWin3DScene() {
      const canvas = document.getElementById('win-3d-canvas');
      if (!canvas) return;

      const stageEl = canvas.parentElement;
      const w = Math.max(320, (stageEl && stageEl.clientWidth) || 380);
      const h = Math.max(360, (stageEl && stageEl.clientHeight) || 430);
      const dpr = 3;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (!this._win3dAssets) {
        const loadImg = (src) => {
          const im = new Image();
          im.src = src;
          return im;
        };
        this._win3dAssets = {
          girlImg: loadImg('win_girl_clean_3d.png?v=63'),
          bannerImg: loadImg('win_banner_text_3d.png?v=49'),
          coinsImg: loadImg('win_coins_3d.png?v=49')
        };

        // Load binary .glb 3D Victory Scene asset if available
        if (window.THREE && THREE.GLTFLoader && !this._winGlbLoaded) {
          this._winGlbLoaded = true;
          try {
            const loader = new THREE.GLTFLoader();
            loader.load('win_scene_3d.glb?v=49', (gltf) => {
              this._winGlbScene = gltf.scene;
            }, undefined, () => {});
          } catch (e) {}
        }
      }

      if (this._win3dRaf) {
        cancelAnimationFrame(this._win3dRaf);
        this._win3dRaf = null;
      }

      const drawStarGlint = (x, y, rad, rot, col, alpha) => {
        if (rad <= 0.5 || alpha <= 0.02) return;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = col;
        ctx.beginPath();
        for (let k = 0; k < 8; k++) {
          const r = k % 2 === 0 ? rad : rad * 0.24;
          const a = (k * Math.PI) / 4;
          if (k === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      // Clean uniform-scale 3D sprite drawer (ZERO squash/stretch jiggle, ZERO dark double-finger artifacts!)
      const drawClean3DSprite = (img, cx, cy, dw, dh, rot, uniformScale, shadowBlur, shadowY) => {
        if (!img || !img.complete || img.naturalWidth <= 0) return;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.scale(uniformScale, uniformScale);
        ctx.shadowColor = 'rgba(8, 12, 28, 0.52)';
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetY = shadowY;
        ctx.drawImage(img, -dw * 0.5, -dh * 0.5, dw, dh);
        ctx.restore();
      };

      const startT = performance.now();
      const tickWin3D = (now) => {
        const mw = document.getElementById('modal-win');
        if (!mw || !mw.classList.contains('active')) {
          this._win3dRaf = null;
          return;
        }

        const t = (now - startT) * 0.001;
        const { girlImg, bannerImg, coinsImg } = this._win3dAssets;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        const cx = w * 0.5;

        // 1. USER'S CUSTOM 3D RED-CAP PIXAR GIRL AT TOP (768 x 790 aspect = 0.972)
        // Smooth celebratory float + gentle head/body sway + strictly uniform scale (0% jiggle!)
        const girlAspect = (girlImg && girlImg.naturalWidth > 0 && girlImg.naturalHeight > 0)
          ? (girlImg.naturalWidth / girlImg.naturalHeight)
          : 0.972;
        const girlH = Math.min(h * 0.52, 224);
        const girlW = girlH * girlAspect;
        const girlY = h * 0.27 + Math.sin(t * 2.0) * 5.0;
        const girlRot = Math.sin(t * 1.45) * 0.026;
        const girlSc = 1.0 + Math.sin(t * 2.0) * 0.018;

        // Soft warm golden celebration halo behind the girl
        const haloG = ctx.createRadialGradient(cx, girlY + 6, 12, cx, girlY + 6, girlW * 0.62);
        haloG.addColorStop(0, 'rgba(253, 224, 71, 0.26)');
        haloG.addColorStop(0.55, 'rgba(56, 189, 248, 0.12)');
        haloG.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = haloG;
        ctx.beginPath();
        ctx.arc(cx, girlY + 6, girlW * 0.62, 0, Math.PI * 2);
        ctx.fill();

        drawClean3DSprite(girlImg, cx, girlY, girlW, girlH, girlRot, girlSc, 22, 10);

        // Orbiting celebration star sparkles around her hands & cap
        drawStarGlint(cx - girlW * 0.48, girlY - girlH * 0.08, 12 * (0.5 + 0.5 * Math.sin(t * 4.4)), t * 2.0, '#fef08a', 0.92);
        drawStarGlint(cx + girlW * 0.48, girlY - girlH * 0.04, 11 * (0.5 + 0.5 * Math.cos(t * 4.2)), -t * 2.0, '#7dd3fc', 0.92);
        drawStarGlint(cx + girlW * 0.24, girlY - girlH * 0.46, 10 * (0.5 + 0.5 * Math.sin(t * 5.0 + 1.2)), t * 2.5, '#ffffff', 0.88);

        // 2. 3D "GREAT JOB!" BANNER IN FRONT OF GIRL (1104 x 240 aspect = 4.60)
        const banW = Math.min(w * 0.94, 358);
        const banH = banW / 4.60;
        const banY = h * 0.53 + Math.sin(t * 2.0 - 0.5) * 3.0;
        const banRot = -Math.sin(t * 1.45) * 0.015;
        const banSc = 1.0 + Math.sin(t * 2.6) * 0.015;
        drawClean3DSprite(bannerImg, cx, banY, banW, banH, banRot, banSc, 18, 8);

        drawStarGlint(cx - banW * 0.44, banY - banH * 0.34, 11 * (0.5 + 0.5 * Math.sin(t * 5.2)), t * 2.4, '#fef08a', 0.92);
        drawStarGlint(cx + banW * 0.43, banY - banH * 0.28, 10 * (0.5 + 0.5 * Math.cos(t * 4.8)), -t * 2.4, '#ffffff', 0.92);

        // 3. 3D UNCUT GOLD COINS TREASURE PILE ABOVE "+50" (397 x 260 aspect = 1.527)
        const coinW = Math.min(w * 0.54, 204);
        const coinH = coinW / 1.527;
        const coinY = h * 0.77 + Math.sin(t * 2.2 + 0.7) * 3.0;
        const coinRot = Math.sin(t * 1.6 + 0.4) * 0.018;
        const coinSc = 1.0 + Math.sin(t * 2.2 + 0.7) * 0.018;

        // Warm golden aura behind the 3D coin pile
        const cg = ctx.createRadialGradient(cx, coinY, 8, cx, coinY, coinW * 0.58);
        cg.addColorStop(0, 'rgba(250, 204, 21, 0.32)');
        cg.addColorStop(1, 'rgba(250, 204, 21, 0)');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(cx, coinY, coinW * 0.58, 0, Math.PI * 2);
        ctx.fill();

        drawClean3DSprite(coinsImg, cx, coinY, coinW, coinH, coinRot, coinSc, 16, 8);

        drawStarGlint(cx - coinW * 0.38, coinY - coinH * 0.18, 9 * (0.5 + 0.5 * Math.cos(t * 5.8)), t * 3, '#fef08a', 0.9);
        drawStarGlint(cx + coinW * 0.36, coinY - coinH * 0.25, 10 * (0.5 + 0.5 * Math.sin(t * 5.4)), -t * 3, '#ffffff', 0.9);

        this._win3dRaf = requestAnimationFrame(tickWin3D);
      };

      this._win3dRaf = requestAnimationFrame(tickWin3D);
    }

    startFireworksCanvas() {
      const fwCanvas = document.getElementById('fireworks-canvas');
      if (!fwCanvas) return;
      fwCanvas.width = this.container.clientWidth || 450;
      fwCanvas.height = this.container.clientHeight || 850;
      const ctx = fwCanvas.getContext('2d');

      this._fwParticles = [];
      this._fwConfetti = [];
      const colors = ['#ffcc18', '#ff3b5c', '#38bdf8', '#4ade80', '#c084fc', '#fb923c', '#ffffff'];

      // Spawn falling celebratory 3D confetti ribbons across the victory screen
      for (let c = 0; c < 42; c++) {
        this._fwConfetti.push({
          x: Math.random() * fwCanvas.width,
          y: -Math.random() * fwCanvas.height,
          vx: (Math.random() - 0.5) * 1.4,
          vy: 2.2 + Math.random() * 2.6,
          size: 7 + Math.random() * 6,
          color: colors[c % colors.length],
          rot: Math.random() * Math.PI * 2,
          rotSpd: (Math.random() - 0.5) * 0.14
        });
      }

      // Count-up "+0" -> "+50" on #win-coins-earned badge
      const earnedEl = document.getElementById('win-coins-earned');
      if (earnedEl) {
        const startCountT = performance.now();
        const tickCoins = (tNow) => {
          const p = Math.min(1, (tNow - startCountT) / 550);
          const val = Math.round(p * 50);
          earnedEl.textContent = `+${val}`;
          if (p < 1 && document.getElementById('modal-win').classList.contains('active')) {
            requestAnimationFrame(tickCoins);
          }
        };
        requestAnimationFrame(tickCoins);
      }

      const spawnBurst = () => {
        if (!document.getElementById('modal-win').classList.contains('active')) return;
        const bx = 50 + Math.random() * (fwCanvas.width - 100);
        const by = 60 + Math.random() * (fwCanvas.height * 0.48);
        const col = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 32; i++) {
          const ang = (i / 32) * Math.PI * 2;
          const spd = 1.8 + Math.random() * 4.2;
          this._fwParticles.push({
            x: bx,
            y: by,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            color: col,
            alpha: 1
          });
        }
      };

      spawnBurst();
      clearInterval(this._fwInterval);
      this._fwInterval = setInterval(spawnBurst, 580);

      const stepFw = () => {
        if (!document.getElementById('modal-win').classList.contains('active')) return;
        ctx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

        // Draw falling 3D tumbling confetti ribbons
        for (let c = 0; c < this._fwConfetti.length; c++) {
          const cf = this._fwConfetti[c];
          cf.x += cf.vx + Math.sin(cf.y * 0.03) * 0.6;
          cf.y += cf.vy;
          cf.rot += cf.rotSpd;
          if (cf.y > fwCanvas.height + 20) {
            cf.y = -15;
            cf.x = Math.random() * fwCanvas.width;
          }
          ctx.save();
          ctx.globalAlpha = 0.88;
          ctx.translate(cf.x, cf.y);
          ctx.rotate(cf.rot);
          ctx.scale(1, Math.max(0.25, Math.abs(Math.cos(cf.rot * 1.5))));
          ctx.fillStyle = cf.color;
          ctx.fillRect(-cf.size * 0.5, -cf.size * 0.25, cf.size, cf.size * 0.5);
          ctx.restore();
        }

        // Draw firework bursts
        for (let i = this._fwParticles.length - 1; i >= 0; i--) {
          const p = this._fwParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05;
          p.alpha -= 0.022;
          if (p.alpha <= 0) {
            this._fwParticles.splice(i, 1);
          } else {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(stepFw);
      };
      requestAnimationFrame(stepFw);
    }

    // -----------------------------------------------------------------------
    // 2D OVERLAY PROJECTION FOR SLOT CAPACITY BADGES & EMOJI BUBBLES
    // -----------------------------------------------------------------------
    projectToScreen(x, y, z) {
      if (!this._projVec) this._projVec = new THREE.Vector3();
      this.camera.updateMatrixWorld();
      this._projVec.set(x, y, z).project(this.camera);
      const width = this.viewWidth || this.container.clientWidth || 450;
      const height = this.viewHeight || this.container.clientHeight || 850;
      return {
        x: (this._projVec.x * 0.5 + 0.5) * width,
        y: (-(this._projVec.y * 0.5) + 0.5) * height
      };
    }

    updateSlotBadgeNumbersOnly() {
      if (!this.slotBadgesLayer) return;
      this.slots.forEach((slot) => {
        if (slot.vehicle && slot.vehicle.cap > 0 && slot._badgeEl) {
          slot._badgeEl.textContent = String(slot.vehicle.cap);
        } else if (!slot.vehicle && slot._badgeEl) {
          slot._badgeEl.remove();
          slot._badgeEl = null;
        }
      });
    }

    updateSlotOverlays() {
      this.syncLevelArchitecturePropsOverlay();
      if (!this.slotBadgesLayer) return;
      this.slotBadgesLayer.innerHTML = '';

      this.slots.forEach((slot) => {
        if (slot.vehicle && slot.vehicle.cap > 0) {
          const pos = this.projectToScreen(slot.x, 0.1, slot.z + 1.42);
          const cInfo = COLORS[slot.vehicle.color] || COLORS.blue;

          const badge = document.createElement('div');
          badge.className = 'slot-cap-badge';
          badge.style.left = `${pos.x}px`;
          badge.style.top = `${pos.y}px`;
          badge.style.background = cInfo.css;
          badge.style.color = cInfo.textCss;
          badge.style.borderColor = cInfo.borderCss;
          badge.textContent = `${slot.vehicle.cap}`;
          slot._badgeEl = badge;
          this.slotBadgesLayer.appendChild(badge);
        }

        if (slot.type === 'plus' && !slot.unlocked) {
          const pos = this.projectToScreen(slot.x, 0.1, slot.z);
          const hit = document.createElement('div');
          hit.className = 'slot-unlock-hit';
          hit.style.left = `${pos.x}px`;
          hit.style.top = `${pos.y}px`;
          hit.title = 'Unlock Extra Boarding Slot ($ 40 Coins)';

          const priceTag = document.createElement('div');
          priceTag.className = 'slot-unlock-price';
          priceTag.textContent = '$ 40';
          hit.appendChild(priceTag);

          hit.addEventListener('click', (e) => {
            e.stopPropagation();
            this.unlockPlusSlot(slot.index, 40);
          });
          this.slotBadgesLayer.appendChild(hit);
        }
      });
    }

    spawnRandomPassengerEmoji() {
      const populated = [];
      for (let k = 0; k < RING_SLOT_COUNT; k++) {
        if (this.ovalRingSlots[k] && this.ovalRingSlots[k].count > 0) {
          populated.push(this.ringRowMeshes[k][0].position);
        }
      }
      if (populated.length === 0) return;
      const pick = populated[Math.floor(Math.random() * populated.length)];
      const pos = this.projectToScreen(pick.x, 0.8, pick.z);
      const emojis = ['😅', '😴', '🥳', '🚌', '🎵'];
      const el = document.createElement('div');
      el.className = 'emoji-pop';
      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      this.fxLayer.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }

    spawnFloatingText(worldX, worldZ, text, color = '#ffffff') {
      const pos = this.projectToScreen(worldX, 1.0, worldZ);
      const el = document.createElement('div');
      el.className = 'float-text';
      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
      el.style.color = color;
      el.textContent = text;
      this.fxLayer.appendChild(el);
      setTimeout(() => el.remove(), 880);
    }

    // -----------------------------------------------------------------------
    // BOOSTERS (Exact Competitor Video Order: VIP [Lv4] | Shuffle [Lv8] | Magnet [Lv13])
    // -----------------------------------------------------------------------
    useShuffleBooster() {
      if (this.isLevelOver) return;
      if (this.levelNum < 8) {
        this.spawnFloatingText(0, 6, '🔒 Unlocks at Level 8!', '#ffdf5d');
        sound.playCarBlocked();
        return;
      }
      if (this.lotVehicles.length < 1) return;

      if (this.profile.boosters.shuffle <= 0) {
        this.playRewardedAd(() => {
          this.profile.boosters.shuffle = 1;
          this.updateHUD();
          this.useShuffleBooster();
        }, 'Watch Video for +1 Shuffle Booster!');
        return;
      } else {
        this.profile.boosters.shuffle = Math.max(0, this.profile.boosters.shuffle - 1);
      }

      sound.playBooster();

      // Record original (x, z, rotY) of every vehicle AND the original color at every spot so no double-swap ever cancels out!
      const oldCoords = new Map();
      this.lotVehicles.forEach((v) => {
        oldCoords.set(v.id, {
          x: v.x,
          z: v.z,
          rotY: v.mesh ? v.mesh.rotation.y : LevelGenerator.getVehicleRotY(v)
        });
      });

      const oppDir = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };

      // 1. Physically relocate every vehicle to a NEW spot across the parking lot (WITHOUT double-swapping colors back!)
      // Guarantees: every vehicle moves to a new spot, every spot gets a different color than before, and arrow directions flip too!
      const derangeGroupSpots = (group) => {
        if (group.length < 2) return;
        const origSpots = group.map((v) => ({
          x: v.x,
          z: v.z,
          dir: v.dir,
          tilt: v.tilt || 0,
          origColorAtSpot: v.color
        }));

        let bestPerm = null;
        let bestScore = -1;

        for (let attempt = 0; attempt < 36; attempt++) {
          // Build a derangement indices array where idx !== perm[idx]
          const perm = origSpots.map((_, i) => i);
          for (let i = perm.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [perm[i], perm[j]] = [perm[j], perm[i]];
          }
          // Fix any fixed points (perm[i] === i) so 100% of vehicles move to a DIFFERENT spot!
          for (let i = 0; i < perm.length; i++) {
            if (perm[i] === i) {
              const swapWith = (i + 1) % perm.length;
              [perm[i], perm[swapWith]] = [perm[swapWith], perm[i]];
            }
          }

          let movedCount = 0;
          let colorChangedSpots = 0;
          let totalDist = 0;

          for (let i = 0; i < group.length; i++) {
            const v = group[i];
            const targetSpot = origSpots[perm[i]];
            const d = Math.hypot(targetSpot.x - v.x, targetSpot.z - v.z);
            if (d > 0.35) movedCount++;
            if (v.color !== targetSpot.origColorAtSpot) colorChangedSpots++;
            totalDist += d;
          }

          const score = colorChangedSpots * 500 + movedCount * 200 + totalDist;
          if (score > bestScore) {
            bestScore = score;
            bestPerm = perm;
          }
        }

        if (bestPerm) {
          group.forEach((v, idx) => {
            const spot = origSpots[bestPerm[idx]];
            v.x = spot.x;
            v.z = spot.z;
            // Flip arrow direction on ~50% of spots so directions also visibly change!
            v.dir = (idx % 2 === 0 && oppDir[spot.dir]) ? oppDir[spot.dir] : spot.dir;
            v.tilt = spot.tilt;
          });
        }
      };

      const buses = this.lotVehicles.filter((v) => v.type === 'bus');
      const smalls = this.lotVehicles.filter((v) => v.type !== 'bus');
      derangeGroupSpots(buses);
      derangeGroupSpots(smalls);

      // If only 1 bus (or 1 small vehicle) remained so it couldn't swap spots within its footprint group,
      // flip its direction and swap its color with another same-capacity vehicle (or cycle its spot)
      if (buses.length === 1 && oppDir[buses[0].dir]) {
        buses[0].dir = oppDir[buses[0].dir];
      }
      if (smalls.length === 1 && oppDir[smalls[0].dir]) {
        smalls[0].dir = oppDir[smalls[0].dir];
      }

      // 2. Ensure 0 cyclic deadlocks after position & direction shuffle!
      LevelGenerator.enforceCleanVehicleSpacing(this.lotVehicles, 0.34);
      LevelGenerator.ensureNoCyclicDeadlock(this.lotVehicles);

      // 3. SMART SHUFFLE GUARANTEE: Place the colors most needed by the revolving oval loop onto unblocked outer vehicles!
      const loopColorDemand = {};
      for (let k = 0; k < RING_SLOT_COUNT; k++) {
        const r = this.ovalRingSlots[k];
        if (r && r.count > 0) {
          loopColorDemand[r.color] = (loopColorDemand[r.color] || 0) + r.count * 3;
        }
      }
      for (let i = 0; i < Math.min(3, this.leftFeederRows.length); i++) {
        const r = this.leftFeederRows[i];
        if (r && r.count > 0) loopColorDemand[r.color] = (loopColorDemand[r.color] || 0) + r.count;
      }
      for (let i = 0; i < Math.min(3, this.rightFeederRows.length); i++) {
        const r = this.rightFeederRows[i];
        if (r && r.count > 0) loopColorDemand[r.color] = (loopColorDemand[r.color] || 0) + r.count;
      }

      const unblockedList = this.lotVehicles.filter(
        (v) => !LevelGenerator.findBlockingVehicle(v, this.lotVehicles)
      );
      const unblockedSet = new Set(unblockedList);
      const blockedList = this.lotVehicles.filter((v) => !unblockedSet.has(v));

      // If any high-demand color is stuck on a blocked vehicle and not on any unblocked vehicle,
      // physically swap the parking spots (x, z, dir, tilt) of that blocked vehicle and a low-demand unblocked vehicle of the same type!
      blockedList.sort((a, b) => (loopColorDemand[b.color] || 0) - (loopColorDemand[a.color] || 0));
      for (const blk of blockedList) {
        const blkDemand = loopColorDemand[blk.color] || 0;
        if (blkDemand <= 0) continue;
        const alreadyOnUnblocked = Array.from(unblockedSet).some((u) => u.color === blk.color);
        if (!alreadyOnUnblocked) {
          let swapTarget = null;
          let minDem = blkDemand;
          for (const u of unblockedSet) {
            if ((u.type === 'bus') === (blk.type === 'bus')) {
              const uDem = loopColorDemand[u.color] || 0;
              if (uDem < minDem) {
                minDem = uDem;
                swapTarget = u;
              }
            }
          }
          if (swapTarget) {
            const tx = swapTarget.x, tz = swapTarget.z, tDir = swapTarget.dir, tTilt = swapTarget.tilt;
            swapTarget.x = blk.x;
            swapTarget.z = blk.z;
            swapTarget.dir = blk.dir;
            swapTarget.tilt = blk.tilt;
            blk.x = tx;
            blk.z = tz;
            blk.dir = tDir;
            blk.tilt = tTilt;
            unblockedSet.delete(swapTarget);
            unblockedSet.add(blk);
          }
        }
      }

      LevelGenerator.enforceCleanVehicleSpacing(this.lotVehicles, 0.34);
      LevelGenerator.ensureNoCyclicDeadlock(this.lotVehicles);

      this.lotVehicles.forEach((v, idx) => {
        if (v.mesh) this.vehiclesGroup.remove(v.mesh);
        v.mesh = this.createVehicleMesh(v);
        const oldP = oldCoords.get(v.id) || { x: v.x, z: v.z, rotY: LevelGenerator.getVehicleRotY(v) };
        v.shuffleFromX = oldP.x;
        v.shuffleFromZ = oldP.z;
        v.shuffleTargetX = v.x;
        v.shuffleTargetZ = v.z;
        v.shuffleFromRotY = oldP.rotY;
        v.baseRotY = LevelGenerator.getVehicleRotY(v);
        v.shuffleArcSide = idx % 2 === 0 ? 1 : -1;
        v.mesh.position.set(oldP.x, 0, oldP.z);
        v.mesh.rotation.y = oldP.rotY;
        v.shuffleAnim = 1.0;
        this.vehiclesGroup.add(v.mesh);
      });

      this.spawnFloatingText(0, 4.5, '🔀 Vehicles Shuffled!', '#4ade80');
      this.updateHUD();
      this.saveGameProgress(true);
    }

    useVipBooster() {
      if (this.isLevelOver) return;
      if (this.levelNum < 4) {
        this.spawnFloatingText(0, 6, '🔒 Unlocks at Level 4!', '#ffdf5d');
        sound.playCarBlocked();
        return;
      }
      if (this.lotVehicles.length === 0) return;

      const vipSlot = this.slots[0];
      if (!vipSlot) return;

      if (vipSlot.vehicle || vipSlot.reserved) {
        this.spawnFloatingText(vipSlot.x, vipSlot.z, 'VIP Slot Full!', '#ff6b6b');
        sound.playCarBlocked();
        return;
      }

      const vipOverlay = document.getElementById('vip-selection-overlay');

      // Toggle off if already in VIP selection mode
      if (this.activeBoosterMode === 'vip') {
        this.activeBoosterMode = null;
        if (vipOverlay) vipOverlay.style.display = 'none';
        return;
      }

      // If count is 0 (+ badge shown), watch short ad to get +1 VIP and enter selection mode!
      if (this.profile.boosters.vip <= 0) {
        this.playRewardedAd(() => {
          this.profile.boosters.vip = 1;
          this.updateHUD();
          this.activeBoosterMode = 'vip';
          if (vipOverlay) vipOverlay.style.display = 'block';
          sound.playButtonClick();
        }, 'Watch Video for +1 VIP Booster!');
        return;
      }

      // Enter Interactive "Select a Vehicle for the VIP Spot" mode (Exact Video 01:12.0!)
      this.activeBoosterMode = 'vip';
      if (vipOverlay) vipOverlay.style.display = 'block';
      sound.playButtonClick();
    }

    useMagnetBooster() {
      if (this.isLevelOver) return;
      if (this.levelNum < 13) {
        this.spawnFloatingText(0, 6, '🔒 Unlocks at Level 13!', '#ffdf5d');
        sound.playCarBlocked();
        return;
      }

      if (this.profile.boosters.magnet <= 0) {
        this.playRewardedAd(() => {
          this.profile.boosters.magnet = 1;
          this.updateHUD();
          this.useMagnetBooster();
        }, 'Watch Video for +1 Magnet Booster!');
        return;
      }

      // 1. Find a parked vehicle with open seats — OR if no slot has a vehicle yet, auto-park an unblocked vehicle first!
      let occupiedSlot = this.slots.find(
        (s) => s.vehicle && (s.vehicle.cap - (s.vehicle.inFlightCount || 0)) > 0
      );

      if (!occupiedSlot && this.lotVehicles.length > 0) {
        const freeSlot =
          this.slots.find((s) => s.index >= 1 && s.unlocked && !s.vehicle && !s.reserved) ||
          (!this.slots[0].vehicle && !this.slots[0].reserved ? this.slots[0] : null);

        if (freeSlot) {
          const availColors = new Set();
          for (const r of this.ovalRingSlots) if (r && r.count > 0) availColors.add(r.color);
          for (const r of this.leftFeederRows) if (r && r.count > 0) availColors.add(r.color);
          for (const r of this.rightFeederRows) if (r && r.count > 0) availColors.add(r.color);

          let autoVeh =
            this.lotVehicles.find((v) => availColors.has(v.color) && !LevelGenerator.findBlockingVehicle(v, this.lotVehicles)) ||
            this.lotVehicles.find((v) => availColors.has(v.color)) ||
            this.lotVehicles[0];

          if (autoVeh) {
            const vIdx = this.lotVehicles.findIndex((v) => v.id === autoVeh.id);
            if (vIdx !== -1) this.lotVehicles.splice(vIdx, 1);
            this.totalBusesSentThisLevel++;
            autoVeh.mesh.position.set(freeSlot.x, 0, freeSlot.z);
            autoVeh.mesh.rotation.y = freeSlot.tilt;
            freeSlot.vehicle = autoVeh;
            freeSlot.reserved = false;
            occupiedSlot = freeSlot;
            this.updateSlotOverlays();
          }
        }
      }

      if (!occupiedSlot || !occupiedSlot.vehicle) {
        this.spawnFloatingText(0, -3, 'Wait for a bus to park!', '#ffdf5d');
        return;
      }

      const bus = occupiedSlot.vehicle;
      const targetColor = bus.color;
      let neededSeats = Math.max(0, bus.cap - (bus.inFlightCount || 0));
      if (neededSeats <= 0) {
        this.spawnFloatingText(occupiedSlot.x, occupiedSlot.z, 'Bus is already filling!', '#ffdf5d');
        return;
      }

      let availableMatching = 0;
      for (const r of this.ovalRingSlots) {
        if (r && r.color === targetColor && r.count > 0) availableMatching += r.count;
      }
      for (const r of this.leftFeederRows) {
        if (r && r.color === targetColor && r.count > 0) availableMatching += r.count;
      }
      for (const r of this.rightFeederRows) {
        if (r && r.color === targetColor && r.count > 0) availableMatching += r.count;
      }

      if (availableMatching <= 0) {
        this.spawnFloatingText(occupiedSlot.x, occupiedSlot.z, 'No ' + targetColor + ' passengers left!', '#ff6b6b');
        return;
      }

      this.profile.boosters.magnet = Math.max(0, this.profile.boosters.magnet - 1);
      sound.playBooster();

      // Pull up to neededSeats matching passengers directly & launch them through the air into the bus!
      const spawnOrigins = [];

      // 1. Pull from Oval Ring first
      for (let k = 0; k < RING_SLOT_COUNT && neededSeats > 0; k++) {
        const r = this.ovalRingSlots[k];
        if (r && r.color === targetColor && r.count > 0) {
          const take = Math.min(neededSeats, r.count);
          for (let c = 0; c < take; c++) {
            const memberMesh = this.ringRowMeshes[k] && this.ringRowMeshes[k][Math.max(0, r.count - 1 - c)];
            const sx = memberMesh ? memberMesh.position.x : 0;
            const sz = memberMesh ? memberMesh.position.z : -8.55;
            spawnOrigins.push({ x: sx, z: sz });
          }
          r.count -= take;
          neededSeats -= take;
          if (r.count <= 0) this.ovalRingSlots[k] = null;
        }
      }

      // 2. Pull from Left Feeder Road
      for (let i = 0; i < this.leftFeederRows.length && neededSeats > 0; i++) {
        const r = this.leftFeederRows[i];
        if (r && r.color === targetColor && r.count > 0) {
          const take = Math.min(neededSeats, r.count);
          const pt = this.getFeederCurvePoint(-1, Math.min(1, 0.12 + i * 0.05));
          for (let c = 0; c < take; c++) {
            spawnOrigins.push({ x: pt.x, z: pt.z });
          }
          r.count -= take;
          neededSeats -= take;
          if (r.count <= 0) {
            this.leftFeederRows.splice(i, 1);
            i--;
          }
        }
      }

      // 3. Pull from Right Feeder Road
      for (let i = 0; i < this.rightFeederRows.length && neededSeats > 0; i++) {
        const r = this.rightFeederRows[i];
        if (r && r.color === targetColor && r.count > 0) {
          const take = Math.min(neededSeats, r.count);
          const pt = this.getFeederCurvePoint(1, Math.min(1, 0.12 + i * 0.05));
          for (let c = 0; c < take; c++) {
            spawnOrigins.push({ x: pt.x, z: pt.z });
          }
          r.count -= take;
          neededSeats -= take;
          if (r.count <= 0) {
            this.rightFeederRows.splice(i, 1);
            i--;
          }
        }
      }

      spawnOrigins.forEach((orig, idx) => {
        bus.inFlightCount = (bus.inFlightCount || 0) + 1;
        const jumper = this.getPooledJumperMesh(targetColor);
        jumper.position.set(orig.x, 0, orig.z);

        this.jumpingPassengers.push({
          mesh: jumper,
          color: targetColor,
          startX: orig.x,
          startZ: orig.z,
          endX: occupiedSlot.x,
          endZ: occupiedSlot.z,
          targetSlotIndex: occupiedSlot.index,
          progress: -idx * 0.025,
          arcHeight: 1.9
        });
      });

      this.spawnFloatingText(occupiedSlot.x, occupiedSlot.z, `🧲 +${spawnOrigins.length} Magnetized!`, '#5ce68b');
      this.updatePassengerCountOnly();
      this.updateHUD();
      this.saveGameProgress(true);
    }

    // -----------------------------------------------------------------------
    // MAIN 60FPS ANIMATION LOOP
    // -----------------------------------------------------------------------
    animate(now) {
      requestAnimationFrame(this.animate);
      if (this._inHomeLobby) {
        this.lastFrameTime = now;
        return;
      }
      const dt = Math.min((now - this.lastFrameTime) / 1000, 0.065);
      this.lastFrameTime = now;

      // Smoothly pan 3D camera forward during Next-Level transition (Competitor Video frame_050)
      if (this.cameraPanOffsetZ && Math.abs(this.cameraPanOffsetZ) > 0.01) {
        this.cameraPanOffsetZ *= Math.max(0, 1 - dt * 5.2);
        if (Math.abs(this.cameraPanOffsetZ) <= 0.01) this.cameraPanOffsetZ = 0;
        this.camera.position.set(0, 25.4, 13.2 + this.cameraPanOffsetZ);
        this.camera.lookAt(0, 0, -0.35 + this.cameraPanOffsetZ * 0.72);
      }

      // Continuous win-condition safety check when all vehicles have left the lot
      if (
        !this.isLevelOver &&
        this._splashStarted &&
        this.totalBusesSentThisLevel > 0 &&
        this.lotVehicles.length === 0 &&
        this.movingVehicles.length === 0 &&
        this.departingVehicles.length === 0
      ) {
        this.checkLevelWinCondition();
      }

      // 1. Update vehicles gliding along 3D Train Tracks into Boarding Slots + Exhaust Smoke
      for (let i = this.movingVehicles.length - 1; i >= 0; i--) {
        const mv = this.movingVehicles[i];
        mv.smokeTimer = (mv.smokeTimer || 0) - dt;
        if (mv.smokeTimer <= 0) {
          mv.smokeTimer = 0.068;
          this.spawnExhaustSmoke(mv.mesh.position.x, mv.mesh.position.z);
        }

        const target = mv.waypoints[mv.wpIndex];
        const dx = target.x - mv.mesh.position.x;
        const dy = (target.y || 0) - mv.mesh.position.y;
        const dz = target.z - mv.mesh.position.z;
        const dist = Math.hypot(dx, dy, dz);

        const step = mv.speed * dt;
        if (dist <= Math.max(0.24, step * 1.05)) {
          mv.mesh.position.set(target.x, target.y || 0, target.z);
          mv.wpIndex++;
          if (mv.wpIndex >= mv.waypoints.length) {
            mv.mesh.position.set(mv.targetSlot.x, 0, mv.targetSlot.z);
            mv.mesh.rotation.set(0, mv.targetSlot.tilt, 0);
            mv.targetSlot.vehicle = mv;
            mv.targetSlot.reserved = false;
            if (mv.trackRecord) {
              mv.trackRecord.fadingOut = true;
            }
            this.movingVehicles.splice(i, 1);
            this.updateSlotOverlays();
            this.saveGameProgress(false);
          }
        } else {
          mv.mesh.position.x += (dx / dist) * step;
          mv.mesh.position.y += (dy / dist) * step;
          mv.mesh.position.z += (dz / dist) * step;
          if (Math.hypot(dx, dz) > 0.04) {
            mv.mesh.rotation.y = Math.atan2(-dx, -dz);
          }
          if (mv.isTrainMode) {
            // Subtle rhythmic tram/train-on-rails rock & wheel bounce
            mv.mesh.rotation.z = Math.sin(now * 0.032) * 0.028;
            mv.mesh.position.y = Math.abs(Math.sin(now * 0.042)) * 0.04;
          }
        }
      }

      // 1AA. Animate 3D Train Tracks (instant materialization pop & smooth dissolve after bus parks)
      if (this.activeTrainTracks && this.activeTrainTracks.length > 0) {
        for (let i = this.activeTrainTracks.length - 1; i >= 0; i--) {
          const tr = this.activeTrainTracks[i];
          if (tr.removed) {
            this.activeTrainTracks.splice(i, 1);
            continue;
          }
          tr.age += dt;
          if (!tr.fadingOut) {
            const popS = Math.min(1, tr.age / 0.065);
            if (tr.group) tr.group.scale.y = popS;
          } else {
            tr.fadeAlpha -= dt * 3.2;
            if (tr.fadeAlpha <= 0) {
              if (tr.group) this.fxGroup.remove(tr.group);
              this.activeTrainTracks.splice(i, 1);
            } else {
              for (let m = 0; m < tr.materials.length; m++) {
                tr.materials[m].opacity = tr.fadeAlpha;
              }
              if (tr.group) tr.group.scale.y = Math.max(0.1, tr.fadeAlpha);
            }
          }
        }
      }

      // 1A. Animate 3D vehicle physical position-flight & arc across the lot when Shuffle Booster is triggered
      for (let i = 0; i < this.lotVehicles.length; i++) {
        const lv = this.lotVehicles[i];
        if (lv.shuffleAnim && lv.shuffleAnim > 0 && lv.mesh) {
          lv.shuffleAnim = Math.max(0, lv.shuffleAnim - dt * 1.55);
          const p = 1 - lv.shuffleAnim;
          const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          const fromX = typeof lv.shuffleFromX === 'number' ? lv.shuffleFromX : lv.x;
          const fromZ = typeof lv.shuffleFromZ === 'number' ? lv.shuffleFromZ : lv.z;
          const toX = typeof lv.shuffleTargetX === 'number' ? lv.shuffleTargetX : lv.x;
          const toZ = typeof lv.shuffleTargetZ === 'number' ? lv.shuffleTargetZ : lv.z;

          const dx = toX - fromX;
          const dz = toZ - fromZ;
          const dist = Math.hypot(dx, dz) || 1;
          const nx = -dz / dist;
          const nz = dx / dist;
          const lateralArc = Math.sin(p * Math.PI) * 0.75 * (lv.shuffleArcSide || 1);

          lv.mesh.position.x = fromX + dx * ease + nx * lateralArc;
          lv.mesh.position.z = fromZ + dz * ease + nz * lateralArc;
          lv.mesh.position.y = Math.sin(p * Math.PI) * 2.15;

          const startRot = typeof lv.shuffleFromRotY === 'number' ? lv.shuffleFromRotY : (lv.baseRotY || 0);
          const endRot = lv.baseRotY || 0;
          lv.mesh.rotation.y = startRot + (endRot - startRot) * ease + Math.sin(p * Math.PI) * 0.45;

          if (lv.shuffleAnim === 0) {
            lv.mesh.position.set(lv.x, 0, lv.z);
            lv.mesh.rotation.y = LevelGenerator.getVehicleRotY(lv);
          }
        }
      }

      // Tick Free Spin & Supplies 15-min cooldown check once per second
      this._spinTickAccum = (this._spinTickAccum || 0) + dt;
      if (this._spinTickAccum >= 1.0) {
        this._spinTickAccum = 0;
        this.checkFreeSpinRefill(true);
        if (this._inHomeLobby) {
          this.syncSuppliesUI();
        }
        const spinModal = document.getElementById('modal-spin');
        if (spinModal && spinModal.classList.contains('active')) {
          this.syncSpinModalUI();
        }
        const supModal = document.getElementById('modal-supplies');
        if (supModal && supModal.classList.contains('active')) {
          this.syncSuppliesUI();
        }
      }

      if (!this._cachedPauseModal) {
        this._cachedPauseModal = document.getElementById('modal-pause');
      }
      const isPaused = (this._cachedPauseModal && this._cachedPauseModal.classList.contains('active')) || this._inHomeLobby;

      // 2. Continuously revolve Central Oval Ring & update Feeder Lanes (freeze while Paused or in Home Lobby!)
      if (!isPaused) {
        this.updateRevolvingLoopAndFeederMeshes(dt, now);
        // 3. Board matching passengers at the bottom gate of the revolving oval
        this.updateBoardingFromRevolvingLoop(dt);
      }

      // 4. Periodic cute passenger emoji bubble
      this.emojiCooldown -= dt;
      if (this.emojiCooldown <= 0 && !this.isLevelOver && !isPaused) {
        this.emojiCooldown = 3.5 + Math.random() * 2.5;
        this.spawnRandomPassengerEmoji();
      }

      // 5. Animate jumping passengers sprinting/magnet-flying into parked buses
      for (let i = this.jumpingPassengers.length - 1; i >= 0; i--) {
        if (isPaused) break;
        const jp = this.jumpingPassengers[i];
        jp.progress += dt * 6.4;
        if (jp.progress >= 1) {
          this.releasePooledJumperMesh(jp.mesh);
          this.jumpingPassengers.splice(i, 1);

          const slot = this.slots[jp.targetSlotIndex];
          if (slot && slot.vehicle) {
            slot.vehicle.cap = Math.max(0, slot.vehicle.cap - 1);
            slot.vehicle.inFlightCount = Math.max(0, (slot.vehicle.inFlightCount || 1) - 1);
            sound.playPassengerBoard();

            slot.vehicle.bounceTimer = 0.065;
            if (slot.vehicle.mesh) {
              slot.vehicle.mesh.scale.set(1.08, 1.12, 1.08);
            }

            this.updateSlotBadgeNumbersOnly();
            this.updatePassengerCountOnly();

            if (slot.vehicle.cap === 0) {
              const departingBus = slot.vehicle;
              slot.vehicle = null;
              departingBus.mesh.scale.set(1, 1, 1);
              sound.playBusDepart();
              this.spawnConfettiBurst(slot.x, slot.z);

              // Track consecutive full bus departures (Visual combo only — ZERO extra coins added mid-level; strictly +50 on Level Win!)
              if (now - (this._lastDepartTime || 0) < 6500) {
                this._departStreak = (this._departStreak || 1) + 1;
              } else {
                this._departStreak = 1;
              }
              this._lastDepartTime = now;

              this.launchWingedBusTakeoff(departingBus);
              this.updateSlotOverlays();
              this.saveGameProgress(false);
            }
          }
        } else {
          const t = Math.max(0, jp.progress);
          jp.mesh.position.x = jp.startX + (jp.endX - jp.startX) * t;
          jp.mesh.position.z = jp.startZ + (jp.endZ - jp.startZ) * t;
          jp.mesh.position.y = Math.sin(t * Math.PI) * (jp.arcHeight || 1.1);
        }
      }

      // 5B. Decay slot vehicle bounce scale without setTimeout allocations
      for (let sIdx = 0; sIdx < this.slots.length; sIdx++) {
        const sv = this.slots[sIdx].vehicle;
        if (sv && sv.bounceTimer > 0) {
          sv.bounceTimer -= dt;
          if (sv.bounceTimer <= 0 && sv.mesh) {
            sv.mesh.scale.set(1, 1, 1);
          }
        }
      }

      // 6. Update departing full buses: Unfold 3D Wings ("Bus k Phank"), Flap & Soar Up Into the Sky at Normal Speed!
      for (let i = this.departingVehicles.length - 1; i >= 0; i--) {
        const dv = this.departingVehicles[i];
        dv.flightTime = (dv.flightTime || 0) + dt;
        const ft = dv.flightTime;

        // Unfold 3D Left & Right Wings smoothly in first 0.28s, then flap at a natural normal pace!
        if (dv.leftWing && dv.rightWing) {
          const unfold = ft < 0.28
            ? 0.05 + (ft / 0.28) * 1.08
            : 1.0 + Math.max(0, 0.22 - (ft - 0.28)) * 0.55;
          dv.leftWing.scale.set(unfold, unfold, unfold);
          dv.rightWing.scale.set(unfold, unfold, unfold);

          const flap = Math.sin(ft * 14.5) * 0.38;
          dv.leftWing.rotation.z = -flap;
          dv.rightWing.rotation.z = flap;
        }

        // Smoothly align yaw toward right-sky takeoff heading & pitch nose UPWARD into the sky!
        const targetYaw = -Math.PI * 0.45;
        const yawBlend = Math.min(1, ft / 0.42);
        const startY = typeof dv.startRotY === 'number' ? dv.startRotY : targetYaw;
        dv.mesh.rotation.y = startY + (targetYaw - startY) * yawBlend;
        dv.mesh.rotation.x = Math.min(0.36, Math.max(0, (ft - 0.10) * 0.75));
        dv.mesh.rotation.z = Math.sin(ft * 6.5) * 0.055;

        // Smooth normal flight speed & graceful climb into the sky
        dv.speed = Math.min(16.5, (dv.speed || 9.5) + dt * 8.5);
        const liftT = Math.max(0, ft - 0.12);
        dv.mesh.position.x += dv.speed * dt;
        dv.mesh.position.z -= dv.speed * 0.18 * dt;
        dv.mesh.position.y = Math.pow(liftT, 1.45) * 4.8;

        dv.smokeTimer -= dt;
        if (dv.smokeTimer <= 0) {
          dv.smokeTimer = 0.075;
          this.spawnExhaustSmoke(dv.mesh.position.x - 0.9, dv.mesh.position.z);
        }
        if (dv.mesh.position.x > 13.5 || dv.mesh.position.y > 12.0) {
          this.vehiclesGroup.remove(dv.mesh);
          this.departingVehicles.splice(i, 1);
          this.totalDepartedThisLevel = (this.totalDepartedThisLevel || 0) + 1;
          this.checkLevelWinCondition();
        }
      }

      // 7. Animate exhaust smoke puffs (using zero-allocation pool)
      for (let i = this.smokePuffs.length - 1; i >= 0; i--) {
        const sp = this.smokePuffs[i];
        sp.scale += dt * 3.2;
        sp.opacity -= dt * 2.1;
        sp.mesh.position.y += dt * 0.8;
        if (sp.opacity <= 0) {
          sp.mesh.visible = false;
          if (!this._smokePool) this._smokePool = [];
          if (this._smokePool.length < 32) {
            this._smokePool.push(sp.mesh);
          } else {
            this.fxGroup.remove(sp.mesh);
          }
          this.smokePuffs.splice(i, 1);
        } else {
          const s = sp.scale * Math.max(0.2, sp.opacity);
          sp.mesh.scale.set(s, s, s);
        }
      }

      // 8. Animate confetti particles
      for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
        const cp = this.confettiParticles[i];
        cp.life -= dt;
        if (cp.life <= 0) {
          this.fxGroup.remove(cp.mesh);
          this.confettiParticles.splice(i, 1);
        } else {
          cp.mesh.position.x += cp.vx * dt;
          cp.mesh.position.y += cp.vy * dt;
          cp.mesh.position.z += cp.vz * dt;
          cp.vy -= 9.8 * dt;
          cp.mesh.rotation.x += cp.rx * dt;
          cp.mesh.rotation.y += cp.ry * dt;
        }
      }

      // 9. Animate collision shockwave rings
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.scale += dt * 7;
        sw.opacity -= dt * 2.5;
        if (sw.opacity <= 0) {
          this.fxGroup.remove(sw.mesh);
          this.shockwaves.splice(i, 1);
        } else {
          sw.mesh.scale.set(sw.scale, sw.scale, 1);
          sw.mesh.material.opacity = sw.opacity;
        }
      }

      this.renderer.render(this.scene, this.camera);
    }

    // -----------------------------------------------------------------------
    // HUD, BOOSTERS & LUCKY SPIN WHEEL UI
    // -----------------------------------------------------------------------
    isAnyModalOpen() {
      const ids = [
        'modal-pause',
        'modal-spin',
        'modal-win',
        'modal-fail',
        'modal-rate',
        'modal-supplies',
        'modal-profile',
        'modal-extratime'
      ];
      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (el && el.classList.contains('active')) {
          const disp = window.getComputedStyle(el).display;
          if (disp !== 'none') return true;
        }
      }
      return false;
    }

    formatTimer(sec) {
      const s = Math.max(0, Math.ceil(sec || 0));
      const m = Math.floor(s / 60);
      const r = s % 60;
      return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
    }

    updateTimerDisplayOnly() {
      if (!this._timerTextEl) this._timerTextEl = document.getElementById('level-timer-text');
      if (!this._timerPillEl) this._timerPillEl = document.getElementById('hud-timer-pill');

      const secInt = Math.max(0, Math.ceil(this.levelTimeLeft || 0));
      if (this._lastShownTimerSec !== secInt) {
        this._lastShownTimerSec = secInt;
        if (this._timerTextEl) {
          this._timerTextEl.textContent = this.formatTimer(secInt);
        }
        if (this._timerPillEl) {
          if (secInt <= 15 && secInt > 0) {
            this._timerPillEl.classList.add('timer-urgent');
          } else {
            this._timerPillEl.classList.remove('timer-urgent');
          }
        }
      }
    }

    updatePassengerCountOnly() {
      if (!this._passLeftEl) this._passLeftEl = document.getElementById('passenger-left-text');
      const rem = this.getTotalRemainingPassengers();
      if (this._lastShownPassCount !== rem && this._passLeftEl) {
        this._lastShownPassCount = rem;
        this._passLeftEl.textContent = String(rem);
      }
    }

    updateHUD() {
      const lvlEl = document.getElementById('level-title-text');
      if (lvlEl) lvlEl.textContent = `Level ${this.levelNum}`;
      this._lastShownTimerSec = -1;
      this.updateTimerDisplayOnly();

      const coinIds = ['coin-count-text', 'home-coin-text', 'shop-coin-text', 'oos-coin-count', 'win-total-coins', 'supplies-coin-count', 'spin-coin-count'];
      coinIds.forEach((cid) => {
        const el = document.getElementById(cid);
        if (el) el.textContent = `${this.profile.coins}`;
      });

      const homeBusLvl = document.getElementById('home-bus-level-label');
      if (homeBusLvl) homeBusLvl.textContent = `LEVEL ${this.profile.currentLevel || this.levelNum}`;

      this.syncHomeRankBadgesOnly();

      this._lastShownPassCount = -1;
      this.updatePassengerCountOnly();

      const hudNameEl = document.getElementById('hud-player-name');
      if (hudNameEl) {
        const pName = this.profile.playerName || localStorage.getItem('BFP_PLAYER_NAME') || 'player_60913';
        if (hudNameEl.textContent !== pName) hudNameEl.textContent = pName;
      }

      // Exact Competitor Video Booster Unlock Order: VIP (Lv4) | Shuffle (Lv8) | Magnet (Lv13)
      this.renderBoosterCard(
        'vip',
        4,
        '🚁',
        'VIP',
        '',
        this.profile.boosters.vip
      );
      this.renderBoosterCard(
        'shuffle',
        8,
        '🪩',
        'Shuffle',
        '',
        this.profile.boosters.shuffle
      );
      this.renderBoosterCard(
        'magnet',
        13,
        '🚌',
        'Magnet',
        '',
        this.profile.boosters.magnet
      );
    }

    renderBoosterCard(key, unlockLvl, emojiIcon, unlockedTitle, priceSub, count) {
      const iconEl = document.getElementById(`booster-${key}-icon`);
      const labelEl = document.getElementById(`booster-${key}-label`);
      const subEl = document.getElementById(`booster-${key}-sub`);
      const countEl = document.getElementById(`booster-${key}-count`);
      if (!iconEl || !labelEl || !subEl || !countEl) return;

      const isLocked = this.levelNum < unlockLvl;
      const iconKey = isLocked ? 'locked' : `unlocked_${key}`;

      if (iconEl.dataset.iconState !== iconKey) {
        iconEl.dataset.iconState = iconKey;
        iconEl.innerHTML = isLocked
          ? PADLOCK_SVG
          : (BOOSTER_ICONS_SVG[key] || `<span style="font-size:28px;">${emojiIcon}</span>`);
      }

      if (isLocked) {
        labelEl.textContent = `Level ${unlockLvl}`;
        subEl.textContent = '';
        countEl.style.display = 'none';
      } else {
        labelEl.textContent = unlockedTitle;
        subEl.textContent = '';
        countEl.style.display = 'flex';
        if (count > 0) {
          countEl.textContent = `${count}`;
          countEl.classList.remove('plus-mode');
        } else {
          // Exact Video 01:21.0: When booster count is 0, show Green '+' Circle!
          countEl.textContent = '+';
          countEl.classList.add('plus-mode');
        }
      }
    }

    syncSettingsButtons() {
      const sfxBtn = document.getElementById('toggle-sfx');
      const musBtn = document.getElementById('toggle-music');
      const vibeBtn = document.getElementById('toggle-vibe');
      if (sfxBtn) {
        sfxBtn.className = `comp-switch ${sound.sfxEnabled ? 'on' : 'off'}`;
      }
      if (musBtn) {
        musBtn.className = `comp-switch ${sound.musicEnabled ? 'on' : 'off'}`;
      }
      if (vibeBtn) {
        vibeBtn.className = `comp-switch ${sound.vibeEnabled ? 'on' : 'off'}`;
      }
    }

    populateLevelMap() {
      const grid = document.getElementById('level-grid-container');
      if (!grid) return;
      grid.innerHTML = '';

      for (let lvl = 1; lvl <= 5000; lvl++) {
        const cell = document.createElement('div');
        const unlocked = lvl <= Math.max(this.profile.highestLevel, 10);
        const isCurrent = lvl === this.levelNum;
        cell.className = `lvl-cell ${isCurrent ? 'current' : ''} ${!unlocked ? 'locked' : ''}`;

        const stars = this.profile.levelStars[lvl] || 0;
        const starStr = stars > 0 ? '⭐'.repeat(stars) : lvl % 5 === 0 ? '🔥' : '';
        cell.innerHTML = `<span>${lvl}</span><span class="lvl-cell-stars">${starStr}</span>`;

        if (unlocked) {
          cell.addEventListener('click', () => {
            document.getElementById('modal-map').classList.remove('active');
            document.getElementById('modal-pause').classList.remove('active');
            this.loadLevel(lvl);
          });
        }
        grid.appendChild(cell);
      }
    }

    // -----------------------------------------------------------------------
    // EXACT 6-SLICE PURPLE & GOLD COCKPIT LUCKY SPIN WHEEL (Video 00:42.5!)
    // -----------------------------------------------------------------------
    drawLuckySpinWheel(wheelRotRad = null) {
      const canvas = document.getElementById('spin-wheel-canvas');
      if (!canvas) return;
      canvas.style.transition = 'none';
      canvas.style.transform = 'none';
      if (typeof wheelRotRad === 'number') {
        this._wheelAngleRad = wheelRotRad;
      }
      const rotOffset = this._wheelAngleRad || 0;

      const ctx = canvas.getContext('2d');
      const baseSize = 300;
      if (canvas.width !== baseSize * 3) {
        canvas.width = baseSize * 3;
        canvas.height = baseSize * 3;
      }
      ctx.setTransform(3, 0, 0, 3, 0, 0);
      const cx = baseSize / 2;
      const cy = baseSize / 2;
      const r = cx - 4;

      this.wheelSlices = [
        { label: '30', icon: 'Coins', color: '#e9d5ff', type: 'coins', amount: 30 },
        { label: 'x1', icon: 'VIP Helicopter', color: '#a855f7', type: 'vip', amount: 1 },
        { label: '500', icon: 'Jackpot Coins', color: '#facc15', type: 'coins', amount: 500 },
        { label: 'x1', icon: 'Super Bus', color: '#a855f7', type: 'magnet', amount: 1 },
        { label: '150', icon: 'Coins', color: '#e9d5ff', type: 'coins', amount: 150 },
        { label: 'x1', icon: 'Color Shuffle', color: '#a855f7', type: 'shuffle', amount: 1 }
      ];

      const arc = (Math.PI * 2) / this.wheelSlices.length;
      ctx.clearRect(0, 0, baseSize, baseSize);

      const draw3DSlicePrizeIcon = (slice) => {
        ctx.save();
        if (slice.type === 'coins' && slice.amount < 500) {
          // 3D Gold Coin Stack
          [-6, 5].forEach((ox, idx) => {
            const oy = idx === 0 ? 3 : -2;
            ctx.fillStyle = '#b45309';
            ctx.beginPath();
            ctx.arc(ox, oy + 2.5, 12.5, 0, Math.PI * 2);
            ctx.fill();

            const cg = ctx.createRadialGradient(ox - 4, oy - 4, 2, ox, oy, 12.5);
            cg.addColorStop(0, '#fef08a');
            cg.addColorStop(0.55, '#facc15');
            cg.addColorStop(1, '#d97706');
            ctx.fillStyle = cg;
            ctx.beginPath();
            ctx.arc(ox, oy, 12.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 1.8;
            ctx.strokeStyle = '#fef9c3';
            ctx.stroke();

            ctx.fillStyle = '#92400e';
            ctx.font = '900 13px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', ox, oy + 0.5);
          });
        } else if (slice.type === 'coins' && slice.amount >= 500) {
          // 3D Golden Treasure Bag + Coins for 500 Jackpot
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.ellipse(0, 4, 15, 13, 0, 0, Math.PI * 2);
          ctx.fill();
          const bg = ctx.createRadialGradient(-4, -2, 2, 0, 3, 15);
          bg.addColorStop(0, '#fde047');
          bg.addColorStop(0.6, '#eab308');
          bg.addColorStop(1, '#a16207');
          ctx.fillStyle = bg;
          ctx.beginPath();
          ctx.ellipse(0, 2, 14, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ca8a04';
          ctx.beginPath();
          ctx.moveTo(-7, -8);
          ctx.lineTo(7, -8);
          ctx.lineTo(4, -14);
          ctx.lineTo(-4, -14);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#15803d';
          ctx.font = '900 14px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$', 0, 3);
        } else if (slice.type === 'vip') {
          // Upright 3D VIP Helicopter Booster (Tail boom, landing skids, cabin, cockpit window & top rotor!)
          // Landing skids
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(-10, 12);
          ctx.lineTo(11, 12);
          ctx.moveTo(-5, 8);
          ctx.lineTo(-5, 12);
          ctx.moveTo(5, 8);
          ctx.lineTo(5, 12);
          ctx.stroke();
          // Tail boom & fin
          ctx.fillStyle = '#dc2626';
          ctx.strokeStyle = '#7f1d1d';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(-9, 1);
          ctx.lineTo(-19, -2);
          ctx.lineTo(-19, -7);
          ctx.lineTo(-15, -2);
          ctx.lineTo(-9, 4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          // Main helicopter body
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.ellipse(2, 2, 12, 8.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Cockpit windshield
          ctx.fillStyle = '#7dd3fc';
          ctx.beginPath();
          ctx.ellipse(7, 1, 5.5, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          // Top rotor mast & golden blades
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(2, -7);
          ctx.lineTo(2, -11);
          ctx.moveTo(-14, -11);
          ctx.lineTo(18, -11);
          ctx.stroke();
        } else if (slice.type === 'magnet') {
          // Upright 3D Red Double-Decker Super Bus Booster (Wheels always on bottom!)
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#7f1d1d';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-14, -11, 28, 19, 5);
          ctx.fill();
          ctx.stroke();
          // Gold stripe
          ctx.fillStyle = '#facc15';
          ctx.fillRect(-13, 1, 26, 3);
          // Windows
          ctx.fillStyle = '#bae6fd';
          ctx.fillRect(-10, -7, 8, 6.5);
          ctx.fillRect(1, -7, 9, 6.5);
          // Wheels on bottom
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(-8, 9.5, 4, 0, Math.PI * 2);
          ctx.arc(8, 9.5, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.arc(-8, 9.5, 1.6, 0, Math.PI * 2);
          ctx.arc(8, 9.5, 1.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 3D Rainbow Color Shuffle Magic Orb
          const cols = ['#ef4444', '#3b82f6', '#22c55e', '#facc15'];
          for (let q = 0; q < 4; q++) {
            ctx.fillStyle = cols[q];
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, 13.5, (q * Math.PI) / 2, ((q + 1) * Math.PI) / 2);
            ctx.closePath();
            ctx.fill();
          }
          ctx.lineWidth = 2.2;
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, 13.5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-4, -4, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      };

      this.wheelSlices.forEach((slice, i) => {
        // Center slice 0 ("30") right under top pin (-PI/2) + current wheel rotation angle
        const startAngle = i * arc - Math.PI / 2 - arc / 2 + rotOffset;
        const endAngle = startAngle + arc;
        const midAngle = startAngle + arc * 0.5;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = slice.color;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#9333ea';
        ctx.stroke();

        // Rim peg dot
        const pegX = cx + Math.cos(startAngle) * (r - 8);
        const pegY = cy + Math.sin(startAngle) * (r - 8);
        ctx.beginPath();
        ctx.arc(pegX, pegY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f3e8ff';
        ctx.fill();

        // Draw 3D Prize Icon & Label UPRIGHT at their radial slice coordinates (Never upside-down even after spinning!)
        const iconDist = r * 0.68;
        const textDist = r * 0.39;
        const ix = cx + Math.cos(midAngle) * iconDist;
        const iy = cy + Math.sin(midAngle) * iconDist;
        const tx = cx + Math.cos(midAngle) * textDist;
        const ty = cy + Math.sin(midAngle) * textDist;

        ctx.save();
        ctx.translate(ix, iy);
        draw3DSlicePrizeIcon(slice);
        ctx.restore();

        ctx.save();
        ctx.translate(tx, ty);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '900 18px "Segoe UI", Arial';
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#4c1d95';
        ctx.strokeText(slice.label, 0, 0);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(slice.label, 0, 0);
        ctx.restore();
      });
    }

    spinLuckyWheel() {
      if (this._isSpinning) return;
      this.checkFreeSpinRefill(false);

      const left = Math.max(0, Math.min(10, this.profile.dailySpinsLeft));
      if (left <= 0) {
        const remMs = Math.max(0, (this.profile.dailySpinsResetAt || (Date.now() + 86400000)) - Date.now());
        const hrs = Math.floor(remMs / 3600000);
        const mins = Math.floor((remMs % 3600000) / 60000);
        this.showAdsUnavailableToast(`Daily 10 Spins used! Resets in ${hrs}h ${mins}m`);
        return;
      }

      // Each of the 10 Daily Free Spins requires watching 1 Rewarded Ad:
      // 1 Ad watched -> 1 Spin plays (10/10 -> 9/10); 2nd Spin -> 2nd Ad, etc.
      this.playRewardedAd(() => {
        if (!this.profile.dailySpinsResetAt || this.profile.dailySpinsResetAt <= Date.now()) {
          this.profile.dailySpinsResetAt = Date.now() + 24 * 60 * 60 * 1000;
        }
        this.profile.dailySpinsLeft = Math.max(0, (this.profile.dailySpinsLeft || 10) - 1);
        this.syncSpinModalUI();
        this.saveGameProgress(false);
        this._executeWheelSpin();
      }, `Lucky Spin — Watch Ad for Spin (${left}/10)!`);
    }

    _executeWheelSpin() {
      if (this._isSpinning) return;
      this._isSpinning = true;
      sound.playBooster();

      const sliceIdx = Math.floor(Math.random() * this.wheelSlices.length);
      const sliceRad = (Math.PI * 2) / this.wheelSlices.length;
      const targetRad = (Math.PI * 2) * 5 + (Math.PI * 2 - sliceIdx * sliceRad);
      const durationMs = 3200;
      const startT = performance.now();

      const stepWheel = (now) => {
        const p = Math.min(1, Math.max(0, (now - startT) / durationMs));
        const eased = 1 - Math.pow(1 - p, 3.6);
        this.drawLuckySpinWheel(eased * targetRad);

        if (p < 1) {
          requestAnimationFrame(stepWheel);
        } else {
          try {
            const won = this.wheelSlices[sliceIdx];
            if (won) {
              if (won.type === 'coins') this.profile.coins += won.amount;
              else if (won.type === 'vip') this.profile.boosters.vip += won.amount;
              else if (won.type === 'shuffle') this.profile.boosters.shuffle += won.amount;
              else if (won.type === 'magnet') this.profile.boosters.magnet += won.amount;
              sound.playWinFanfare();
              const resEl = document.getElementById('spin-result-text');
              if (resEl) resEl.textContent = `🎉 You Won: ${won.icon} ${won.label}!`;
            }
            this.updateHUD();
            this.syncSpinModalUI();
            this.saveGameProgress(true);
          } finally {
            this._isSpinning = false;
          }
        }
      };
      requestAnimationFrame(stepWheel);
    }

    // -----------------------------------------------------------------------
    // BIND ALL UI BUTTONS (SINGLE-FIRE DEBOUNCED MOBILE & PC TAP HANDLERS!)
    // -----------------------------------------------------------------------
    bindUIEvents() {
      this.canvas.addEventListener('pointerdown', (e) => this.onCanvasPointerDown(e));

      // Press & Hold on Screen -> Fast Spin Revolving Loop (3.5x Speed while held, normal speed on release!)
      const startFastSpin = () => {
        if (!this._inHomeLobby && !this.isLevelOver && !this.isAnyModalOpen()) {
          this._isHoldingFastSpin = true;
        }
      };
      const stopFastSpin = () => {
        this._isHoldingFastSpin = false;
      };
      this.canvas.addEventListener('pointerdown', startFastSpin, { passive: true });
      this.canvas.addEventListener('touchstart', startFastSpin, { passive: true });
      this.canvas.addEventListener('mousedown', startFastSpin, { passive: true });
      window.addEventListener('pointerup', stopFastSpin, { passive: true });
      window.addEventListener('pointercancel', stopFastSpin, { passive: true });
      window.addEventListener('touchend', stopFastSpin, { passive: true });
      window.addEventListener('touchcancel', stopFastSpin, { passive: true });
      window.addEventListener('mouseup', stopFastSpin, { passive: true });
      window.addEventListener('blur', stopFastSpin, { passive: true });

      const bindTap = (id, fn, cooldownMs = 380) => {
        const el = document.getElementById(id);
        if (!el) return;
        let lastFire = 0;
        const handler = (e) => {
          const nowT = performance.now();
          if (nowT - lastFire < cooldownMs) {
            if (e && e.cancelable) e.preventDefault();
            if (e && e.stopPropagation) e.stopPropagation();
            return;
          }
          lastFire = nowT;
          if (e && e.cancelable) e.preventDefault();
          if (e && e.stopPropagation) e.stopPropagation();
          try { sound.init(); } catch (err) {}
          fn(e);
        };
        el.addEventListener('pointerdown', handler);
        el.addEventListener('touchstart', handler, { passive: false });
        el.addEventListener('click', handler);
      };

      // Rewarded Ad Close / Claim Button
      bindTap('btn-close-rad', () => {
        if (this._finishCurrentRewardedAd) {
          this._finishCurrentRewardedAd();
        }
      }, 250);

      // Tap dim top area during VIP selection to cancel VIP mode cleanly
      bindTap('vip-dim-top', () => {
        this.activeBoosterMode = null;
        const vipOverlay = document.getElementById('vip-selection-overlay');
        if (vipOverlay) vipOverlay.style.display = 'none';
      }, 250);

      // =====================================================================
      // 1. HOME LOBBY SCREEN BUTTONS & NAVIGATION TABS (Video 00:07 - 00:51)
      // =====================================================================
      bindTap('btn-home-play', () => this.enterLevelFromHome(), 500);
      bindTap('home-double-bus', () => this.enterLevelFromHome(), 500);

      bindTap('nav-tab-shop', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.switchHomeTab('shop');
      }, 220);
      bindTap('nav-tab-home', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.switchHomeTab('home');
      }, 220);
      bindTap('nav-tab-ranks', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.switchHomeTab('ranks');
      }, 220);

      bindTap('btn-home-coins', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.switchHomeTab('shop');
      }, 250);

      bindTap('btn-home-settings', () => {
        try { sound.playButtonClick(); } catch (err) {}
        const pHead = document.getElementById('pause-modal-heading');
        if (pHead) pHead.textContent = 'Settings';
        const gActions = document.getElementById('pause-gameplay-actions');
        if (gActions) gActions.style.display = 'none';
        this.syncSettingsButtons();
        this.openModal('modal-pause');
      }, 250);

      // Home Avatar / Player Hub Modal (Profile & Pics | Inventory | Ranks & Prizes!)
      bindTap('btn-home-avatar', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.openPlayerHub('profile');
      }, 250);

      bindTap('btn-home-rank-badge', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.openPlayerHub('ranks');
      }, 250);

      bindTap('btn-home-inventory', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.openPlayerHub('inventory');
      }, 250);

      bindTap('btn-ranks-open-roadmap', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.openPlayerHub('ranks');
      }, 250);

      bindTap('btn-ranks-open-inv', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.openPlayerHub('inventory');
      }, 250);

      bindTap('hub-tab-btn-profile', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.switchPlayerHubTab('profile');
      }, 180);

      bindTap('hub-tab-btn-inventory', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.switchPlayerHubTab('inventory');
      }, 180);

      bindTap('hub-tab-btn-ranks', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.switchPlayerHubTab('ranks');
      }, 180);

      // Cycle through unlocked avatars on tapping the top Profile Avatar Box
      bindTap('btn-cycle-avatar', () => {
        try { sound.playButtonClick(); } catch (err) {}
        const myLvl = Math.max(1, this.profile.currentLevel || this.levelNum || 1);
        const unlocked = PROFILE_AVATARS.filter((a) => myLvl >= a.unlockLvl).map((a) => a.id);
        if (this.profile.customPhotoDataUrl) {
          unlocked.unshift('custom_photo');
        }
        const curIdx = unlocked.indexOf(this.profile.selectedAvatarId);
        const nextId = unlocked[(curIdx + 1) % Math.max(1, unlocked.length)] || 'aviator_girl';
        this.profile.selectedAvatarId = nextId;
        this.syncPlayerHubUI();
        this.saveGameProgress(false);
      }, 220);

      // Direct Real Photo Upload from Phone / Gallery / PC
      const photoInput = document.getElementById('profile-photo-input');
      const uploadBtn = document.getElementById('btn-upload-real-photo');
      if (uploadBtn && photoInput) {
        uploadBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          try { sound.playButtonClick(); } catch (err) {}
          photoInput.click();
        });
        photoInput.addEventListener('change', (e) => {
          const file = e.target && e.target.files && e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            const rawUrl = ev.target && ev.target.result;
            if (!rawUrl) return;
            const img = new Image();
            img.onload = () => {
              // Center-crop & resize to crisp 256x256 square JPEG data URL for fast localStorage & 60-FPS rendering
              const c = document.createElement('canvas');
              c.width = 256;
              c.height = 256;
              const cctx = c.getContext('2d');
              const side = Math.min(img.width, img.height);
              const sx = (img.width - side) * 0.5;
              const sy = (img.height - side) * 0.5;
              cctx.drawImage(img, sx, sy, side, side, 0, 0, 256, 256);
              const dataUrl = c.toDataURL('image/jpeg', 0.88);
              this.profile.customPhotoDataUrl = dataUrl;
              this.profile.selectedAvatarId = 'custom_photo';
              this._loadCustomPhotoCanvasImg(dataUrl);
              sound.playWinFanfare();
              this.syncPlayerHubUI();
              this.updateHUD();
              this.saveGameProgress(true);
              this.showAdsUnavailableToast('📷 Real Profile Picture Updated!');
            };
            img.src = rawUrl;
          };
          reader.readAsDataURL(file);
        });
      }

      const saveAndCloseProfile = () => {
        try { sound.playButtonClick(); } catch (err) {}
        const inp = document.getElementById('profile-name-input');
        if (inp && inp.value.trim()) {
          this.profile.playerName = inp.value.trim();
          try { localStorage.setItem('BFP_PLAYER_NAME', this.profile.playerName); } catch (e) {}
        }
        this.updateHUD();
        this.saveGameProgress(false);
        this.closeModal('modal-profile');
      };
      bindTap('btn-save-profile', saveAndCloseProfile, 250);
      bindTap('btn-close-profile', saveAndCloseProfile, 250);

      // 3D Celebration Reward & Character / Rank Unlock Popup Handlers
      const closeRewardPopupAndNext = () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.closeModal('modal-reward-popup');
        setTimeout(() => {
          this.flushPendingRewardPopups();
        }, 220);
      };
      bindTap('btn-close-reward-popup', closeRewardPopupAndNext, 220);
      bindTap('btn-rp-claim', closeRewardPopupAndNext, 220);
      bindTap('btn-rp-equip', () => {
        try { sound.playWinFanfare(); } catch (err) {}
        if (this._activeRewardAvatarId) {
          this.profile.selectedAvatarId = this._activeRewardAvatarId;
          this.syncPlayerHubUI();
          this.saveGameProgress(true);
        }
        this.closeModal('modal-reward-popup');
        setTimeout(() => {
          this.flushPendingRewardPopups();
        }, 220);
      }, 220);

      // Home Supplies Gas Pump Dispenser Modal (Exact Video 00:39.9!)
      bindTap('btn-home-supplies', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.syncSuppliesUI();
        this.openModal('modal-supplies');
      }, 250);
      bindTap('btn-close-supplies', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.closeModal('modal-supplies');
      }, 250);

      const tierAmounts = [15, 20, 50, 70, 100];
      const tierBtns = document.querySelectorAll('#gp-tiers-list .btn-gp-claim');
      tierBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tIdx = parseInt(btn.getAttribute('data-tier') || '0', 10);
          const curTier = Math.max(0, Math.min(5, this.profile.suppliesTier || 0));

          if (tIdx < curTier) {
            return; // already claimed
          }
          if (tIdx > curTier && !(tIdx === 1 && curTier === 0)) {
            this.showAdsUnavailableToast('Ads are not available right now');
            return;
          }

          const grantTier = () => {
            const rewardCoins = tierAmounts[tIdx] || 15;
            this.profile.coins += rewardCoins;
            this.profile.suppliesTier = Math.max(curTier, tIdx + 1);
            if (this.profile.suppliesTier >= 5) {
              setTimeout(() => {
                this.profile.suppliesTier = 0;
                this.syncSuppliesUI();
              }, 1500);
            }
            sound.playWinFanfare();
            this.updateHUD();
            this.syncSuppliesUI();
            this.saveGameProgress(true);
          };

          // All "Free ▶" tiers in Bus Supplies require Rewarded Video Ads ("Ads are not available right now" while ads are off!)
          this.playRewardedAd(grantTier, `Bus Supplies — Claim +${tierAmounts[tIdx]} Free Coins!`);
        });
      });

      // Exact Competitor Shop Packs & Bundles (Video 00:27 - 00:34!)
      const shopRewards = {
        noads: { coins: 0, vip: 0, shuffle: 0, magnet: 0, noAds: true, label: '🚫 No Ads Activated!' },
        adfree_bundle: { coins: 1500, vip: 1, shuffle: 1, magnet: 1, noAds: true, label: '🎁 Ad-Free Bundle +1,500 Coins!' },
        beginner_bundle: { coins: 1000, vip: 2, shuffle: 2, magnet: 2, noAds: false, label: '🎁 Beginner Bundle +1,000 Coins!' },
        advanced_bundle: { coins: 5000, vip: 1, shuffle: 1, magnet: 1, noAds: false, label: '🛒 Advanced Bundle +5,000 Coins!' },
        expert_bundle: { coins: 10000, vip: 3, shuffle: 3, magnet: 3, noAds: false, label: '🚗 Expert Bundle +10,000 Coins!' },
        ultimate_bundle: { coins: 25000, vip: 4, shuffle: 4, magnet: 4, noAds: false, label: '🚌 Ultimate Bundle +25,000 Coins!' },
        coins_1000: { coins: 1000, vip: 0, shuffle: 0, magnet: 0, noAds: false, label: '🪙 +1,000 Coins!' },
        coins_5000: { coins: 5000, vip: 0, shuffle: 0, magnet: 0, noAds: false, label: '🪙 +5,000 Coins!' },
        coins_10000: { coins: 10000, vip: 0, shuffle: 0, magnet: 0, noAds: false, label: '🪙 +10,000 Coins!' },
        coins_25000: { coins: 25000, vip: 0, shuffle: 0, magnet: 0, noAds: false, label: '💰 +25,000 Coins!' },
        coins_50000: { coins: 50000, vip: 0, shuffle: 0, magnet: 0, noAds: false, label: '💰 +50,000 Coins!' },
        coins_100000: { coins: 100000, vip: 0, shuffle: 0, magnet: 0, noAds: false, label: '👑 +100,000 Coins!' }
      };

      const shopEls = document.querySelectorAll('[data-pack]');
      shopEls.forEach((el) => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const packKey = el.getAttribute('data-pack');
          const spec = shopRewards[packKey];
          if (!spec) return;

          // Only grant paid Shop pack if real Native In-App Billing SDK is active
          if (window.AndroidBilling && typeof window.AndroidBilling.purchasePack === 'function') {
            window.onNativePurchaseSuccess = () => {
              if (spec.coins) this.profile.coins += spec.coins;
              if (spec.vip) this.profile.boosters.vip = (this.profile.boosters.vip || 0) + spec.vip;
              if (spec.shuffle) this.profile.boosters.shuffle = (this.profile.boosters.shuffle || 0) + spec.shuffle;
              if (spec.magnet) this.profile.boosters.magnet = (this.profile.boosters.magnet || 0) + spec.magnet;
              if (spec.noAds) this.profile.noAds = true;
              sound.playWinFanfare();
              this.updateHUD();
              this.saveGameProgress(true);
            };
            window.AndroidBilling.purchasePack(packKey);
            return;
          }

          // Otherwise do NOT add free coins/boosters; show clear unavailable notice!
          this.showAdsUnavailableToast('Purchases are not available right now');
        });
      });

      // Out of Spots Boost Pack Card (Paid In-App Purchase)
      bindTap('btn-oos-boost-pack', () => {
        if (window.AndroidBilling && typeof window.AndroidBilling.purchasePack === 'function') {
          window.AndroidBilling.purchasePack('oos_boost_pack');
          return;
        }
        this.showAdsUnavailableToast('Purchases are not available right now');
      }, 500);

      // =====================================================================
      // 2. GAMEPLAY HUD TOP BAR: RESTART, UNDO, HINT & PAUSE
      // =====================================================================
      bindTap('btn-undo', () => {
        this.undoLastVehicleMove();
      }, 300);

      bindTap('btn-hint', () => {
        this.showSmartMoveHint();
      }, 350);

      bindTap('btn-restart', () => {
        const btn = document.getElementById('btn-restart');
        if (btn) {
          const svg = btn.querySelector('svg');
          if (svg) {
            svg.style.transition = 'transform 0.38s ease';
            svg.style.transform = 'rotate(-360deg)';
            setTimeout(() => {
              svg.style.transition = 'none';
              svg.style.transform = 'rotate(0deg)';
            }, 400);
          }
        }
        this.playSkyPlaneTransition(() => {
          this.loadLevel(this.levelNum, true);
        });
      }, 600);

      bindTap('btn-pause', () => {
        try { sound.playButtonClick(); } catch (err) {}
        const pHead = document.getElementById('pause-modal-heading');
        if (pHead) pHead.textContent = 'Settings';
        const gActions = document.getElementById('pause-gameplay-actions');
        if (gActions) gActions.style.display = 'grid';
        this.syncSettingsButtons();
        this.openModal('modal-pause');
      });

      // Lucky Spin Open / Spin / Close
      const openSpin = () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.drawLuckySpinWheel();
        this.syncSpinModalUI();
        const resEl = document.getElementById('spin-result-text');
        if (resEl) resEl.textContent = '';
        this.openModal('modal-spin');
      };
      bindTap('btn-home-spin', openSpin);
      bindTap('btn-lucky-spin', openSpin);
      bindTap('btn-open-spin-top', openSpin);
      bindTap('btn-do-spin', () => this.spinLuckyWheel(), 500);
      bindTap('btn-close-spin', () => {
        if (this._isSpinning) return;
        try { sound.playButtonClick(); } catch (err) {}
        this.closeModal('modal-spin');
      }, 250);

      // Allow tapping dark backdrop around modals to close cleanly
      ['modal-spin', 'modal-pause', 'modal-supplies', 'modal-profile'].forEach((mId) => {
        const mEl = document.getElementById(mId);
        if (mEl) {
          mEl.addEventListener('click', (e) => {
            if (e.target === mEl && !(mId === 'modal-spin' && this._isSpinning)) {
              this.closeModal(mId);
            }
          });
        }
      });

      // Boosters (Single-fire debounced so 1 tap = strictly 1 booster!)
      bindTap('booster-vip', () => this.useVipBooster(), 350);
      bindTap('booster-shuffle', () => this.useShuffleBooster(), 420);
      bindTap('booster-magnet', () => this.useMagnetBooster(), 420);

      bindTap('btn-cancel-booster', () => {
        this.activeBoosterMode = null;
        const vipOverlay = document.getElementById('vip-selection-overlay');
        if (vipOverlay) vipOverlay.style.display = 'none';
      });

      // "Having Fun?" Rating Modal
      const closeRateToWin = () => {
        this.closeModal('modal-rate');
        this.openWinScreenWithFireworks();
      };
      bindTap('btn-close-rate', closeRateToWin);
      bindTap('btn-rate-up', closeRateToWin);
      bindTap('btn-rate-down', closeRateToWin);

      // =====================================================================
      // 3. GREAT JOB! WIN MODAL: "$ 100 ▶" (2x Ad) & "Next" (50 Coins Base!)
      // =====================================================================
      let _winAdvancing = false;
      bindTap('btn-next-level', () => {
        if (_winAdvancing) return;
        _winAdvancing = true;
        setTimeout(() => { _winAdvancing = false; }, 1400);
        try { sound.playButtonClick(); } catch (err) {}
        const completedLvl = this._lastCompletedLevel || this.levelNum;
        this.playFlyingCoinsAndReturnHome(50, completedLvl);
      }, 600);

      bindTap('btn-win-ad-double', () => {
        if (_winAdvancing) return;
        try { sound.playButtonClick(); } catch (err) {}
        this.playRewardedAd(() => {
          _winAdvancing = true;
          setTimeout(() => { _winAdvancing = false; }, 1400);
          const completedLvl = this._lastCompletedLevel || this.levelNum;
          this.playFlyingCoinsAndReturnHome(100, completedLvl);
        }, 'Watch Video for 2x Reward (100 Coins)!');
      }, 600);

      // =====================================================================
      // 4. EXACT COMPETITOR "Out of Spots" MODAL HANDLERS (Affordable 150 Coin Revive!)
      // =====================================================================
      bindTap('btn-revive-slot', () => {
        const cost = this.profile.coins >= 150 ? 150 : (this.profile.coins >= 40 ? 40 : 0);
        if (this.profile.coins < 40) {
          this.spawnFloatingText(0, -2, 'Tap Boost Pack or ▶ Free!', '#fde047');
          sound.playCarBlocked();
          return;
        }
        this.profile.coins -= cost;
        this.clearAllParkedBusesAndUnlockSpot();
        this.closeModal('modal-fail');
        this.isLevelOver = false;
        this.failReason = null;
        this.updateSlotOverlays();
        this.updateHUD();
        this.saveGameProgress(true);
      }, 450);

      // "▶ Free" Revive Button -> Watch Rewarded Ad to Clear ALL parked buses & unlock +1 extra spot!
      bindTap('btn-revive-free', () => {
        this.playRewardedAd(() => {
          this.clearAllParkedBusesAndUnlockSpot();
          this.closeModal('modal-fail');
          this.isLevelOver = false;
          this.failReason = null;
          this.updateSlotOverlays();
          this.updateHUD();
          this.saveGameProgress(true);
        }, 'Out of Spots — Clear All Buses & Unlock +1 Spot!');
      }, 450);

      // "Restart" Button inside Out of Spots -> Plays Airplane Sky Transition & Restarts Level!
      bindTap('btn-fail-retry', () => {
        this.closeModal('modal-fail');
        this.playSkyPlaneTransition(() => {
          this.loadLevel(this.levelNum, true);
        });
      }, 550);

      // "Hold to see the map" Interactive Peek Feature
      const holdMapBtn = document.getElementById('hold-see-map-btn');
      const failModalEl = document.getElementById('modal-fail');
      if (holdMapBtn && failModalEl) {
        const startPeek = (e) => {
          if (e && e.cancelable) e.preventDefault();
          failModalEl.classList.add('peeking-map');
        };
        const endPeek = () => {
          failModalEl.classList.remove('peeking-map');
        };
        holdMapBtn.addEventListener('pointerdown', startPeek);
        holdMapBtn.addEventListener('touchstart', startPeek, { passive: false });
        window.addEventListener('pointerup', endPeek);
        window.addEventListener('touchend', endPeek);
        window.addEventListener('touchcancel', endPeek);
      }

      // Settings / Pause Modal Buttons (Video 01:06.0: "Home" & "Restart")
      bindTap('btn-close-pause', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.closeModal('modal-pause');
      }, 220);
      bindTap('btn-resume', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.closeModal('modal-pause');
      }, 220);
      bindTap('btn-pause-restart', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.closeModal('modal-pause');
        this.playSkyPlaneTransition(() => {
          this.loadLevel(this.levelNum, true);
        });
      }, 500);
      bindTap('btn-pause-home', () => {
        try { sound.playButtonClick(); } catch (err) {}
        this.closeModal('modal-pause');
        this.playSkyPlaneTransition(() => {
          this.openHomeScreen();
        });
      }, 500);

      // Sound, Music & Vibration Toggles
      bindTap('toggle-sfx', () => {
        sound.sfxEnabled = !sound.sfxEnabled;
        this.profile.sfx = sound.sfxEnabled;
        this.syncSettingsButtons();
        this.saveGameProgress(false);
      }, 200);
      bindTap('toggle-music', () => {
        sound.musicEnabled = !sound.musicEnabled;
        this.profile.music = sound.musicEnabled;
        if (sound.musicEnabled) {
          if (this._inHomeLobby) sound.startHomeMusic();
          else sound.startMusic();
        } else {
          sound.stopMusic();
        }
        this.syncSettingsButtons();
        this.saveGameProgress(false);
      }, 200);
      bindTap('toggle-vibe', () => {
        sound.vibeEnabled = !sound.vibeEnabled;
        this.profile.vibe = sound.vibeEnabled;
        if (sound.vibeEnabled) sound.vibrate(25);
        this.syncSettingsButtons();
        this.saveGameProgress(false);
      }, 200);

      window.addEventListener('pointerdown', () => {
        sound.init();
        if (this._inHomeLobby && sound.musicEnabled && !sound.musicTimer) {
          sound.startHomeMusic();
        }
      }, { passive: true });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          const winOpen = document.getElementById('modal-win').classList.contains('active');
          const rateOpen = document.getElementById('modal-rate').classList.contains('active');
          if (this._splashStarted && !this._inHomeLobby && !winOpen && !rateOpen) {
            this._leftMidLevel = true;
          }
          this.saveGameProgress(false);
        } else if (this._leftMidLevel) {
          this._leftMidLevel = false;
          document.getElementById('modal-fail').classList.remove('active');
          document.getElementById('modal-pause').classList.remove('active');
          this.loadLevel(this.profile.currentLevel, true);
        }
      });

      window.addEventListener('beforeunload', () => this.saveGameProgress(false));
    }

    emergencyClearOneSlot() {
      const occupied = this.slots.find((s) => s.index >= 1 && s.vehicle);
      if (!occupied) return;

      const bus = occupied.vehicle;
      const targetColor = bus.color;
      let toRemove = bus.cap;

      // Drain matching passengers from oval ring first, then feeder lanes
      for (let k = 0; k < RING_SLOT_COUNT && toRemove > 0; k++) {
        const r = this.ovalRingSlots[k];
        if (r && r.color === targetColor && r.count > 0) {
          const take = Math.min(toRemove, r.count);
          r.count -= take;
          toRemove -= take;
          if (r.count <= 0) this.ovalRingSlots[k] = null;
        }
      }
      for (let i = 0; i < this.leftFeederRows.length && toRemove > 0; i++) {
        const r = this.leftFeederRows[i];
        if (r && r.color === targetColor) {
          const take = Math.min(toRemove, r.count);
          r.count -= take;
          toRemove -= take;
          if (r.count <= 0) {
            this.leftFeederRows.splice(i, 1);
            i--;
          }
        }
      }
      for (let i = 0; i < this.rightFeederRows.length && toRemove > 0; i++) {
        const r = this.rightFeederRows[i];
        if (r && r.color === targetColor) {
          const take = Math.min(toRemove, r.count);
          r.count -= take;
          toRemove -= take;
          if (r.count <= 0) {
            this.rightFeederRows.splice(i, 1);
            i--;
          }
        }
      }

      occupied.vehicle = null;
      sound.playBusDepart();
      this.spawnConfettiBurst(occupied.x, occupied.z);
      this.launchWingedBusTakeoff(bus);
    }
  }

  function bootBusFeverGame() {
    if (window.BFP_PORTAL_ACTIVE === true) {
      return;
    }
    if (!window.busFeverGame) {
      window.busFeverGame = new BusFeverGame();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootBusFeverGame);
  } else {
    bootBusFeverGame();
  }
  setTimeout(bootBusFeverGame, 100);
})();




