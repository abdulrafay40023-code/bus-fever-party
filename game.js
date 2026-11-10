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
  const RING_SLOT_COUNT = 28; // 28 radial rows of 4 passengers revolving around the central oval
  const ROW_PASSENGERS = 4;   // 4 stickmen side-by-side per row

  const COLORS = {
    yellow: {
      id: 'yellow',
      name: 'Yellow',
      hex: 0xffcc18,
      darkHex: 0xc49000,
      css: '#ffcc18',
      borderCss: '#fff0a6',
      textCss: '#241a00'
    },
    blue: {
      id: 'blue',
      name: 'Blue',
      hex: 0x2288ff,
      darkHex: 0x0d52b8,
      css: '#2288ff',
      borderCss: '#a8d4ff',
      textCss: '#ffffff'
    },
    red: {
      id: 'red',
      name: 'Red',
      hex: 0xf03242,
      darkHex: 0xa3121e,
      css: '#f03242',
      borderCss: '#ffb3b9',
      textCss: '#ffffff'
    },
    green: {
      id: 'green',
      name: 'Green',
      hex: 0x26d153,
      darkHex: 0x108a31,
      css: '#26d153',
      borderCss: '#aef7c0',
      textCss: '#082910'
    },
    purple: {
      id: 'purple',
      name: 'Purple',
      hex: 0xa53dff,
      darkHex: 0x6214ad,
      css: '#a53dff',
      borderCss: '#dfb5ff',
      textCss: '#ffffff'
    },
    orange: {
      id: 'orange',
      name: 'Orange',
      hex: 0xff7b19,
      darkHex: 0xb54700,
      css: '#ff7b19',
      borderCss: '#ffd0ab',
      textCss: '#ffffff'
    },
    cyan: {
      id: 'cyan',
      name: 'Cyan',
      hex: 0x06b6d4,
      darkHex: 0x0e7490,
      css: '#06b6d4',
      borderCss: '#a5f3fc',
      textCss: '#042f2e'
    },
    pink: {
      id: 'pink',
      name: 'Pink',
      hex: 0xec4899,
      darkHex: 0x9d174d,
      css: '#ec4899',
      borderCss: '#fbcfe8',
      textCss: '#ffffff'
    },
    lime: {
      id: 'lime',
      name: 'Lime',
      hex: 0x84cc16,
      darkHex: 0x3f6212,
      css: '#84cc16',
      borderCss: '#d9f99d',
      textCss: '#1a2e05'
    },
    indigo: {
      id: 'indigo',
      name: 'Indigo',
      hex: 0x6366f1,
      darkHex: 0x3730a3,
      css: '#6366f1',
      borderCss: '#c7d2fe',
      textCss: '#ffffff'
    }
  };
  const ALL_COLOR_KEYS = Object.keys(COLORS);

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

  // =========================================================================
  // SYNTHESIZED SOUND & PARTY MUSIC ENGINE (Matching Video Audio Cues!)
  // =========================================================================
  class SoundEngine {
    constructor() {
      this.ctx = null;
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
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type, duration, vol = 0.14, slideTo = null) {
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

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    }

    playGoCheer() {
      // Rising crowd cheer chord when GO! gates open (Video 00:29)
      const freqs = [330, 440, 554.37, 659.25];
      freqs.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'triangle', 0.35, 0.12, f * 1.18), idx * 45);
      });
    }

    playCarStart() {
      this.playTone(210, 'triangle', 0.14, 0.16, 420);
      setTimeout(() => this.playTone(320, 'sine', 0.11, 0.12, 500), 55);
    }

    playCarBlocked() {
      this.playTone(145, 'sawtooth', 0.14, 0.2, 82);
      setTimeout(() => this.playTone(110, 'square', 0.17, 0.18, 68), 75);
    }

    playPassengerBoard() {
      // Rapid bubbly pop sound matching Video 00:39-01:20
      const nowMs = performance.now();
      if (nowMs - this.lastBoardTime < 300) {
        this.comboCount = Math.min(24, this.comboCount + 1);
      } else {
        this.comboCount = 0;
      }
      this.lastBoardTime = nowMs;
      const baseFreq = 440 + (this.comboCount % 12) * 32;
      this.playTone(baseFreq, 'sine', 0.065, 0.13, baseFreq * 1.3);
    }

    playBusDepart() {
      // Happy 3-note chime when bus fills up and confetti pops (Video 00:41, 00:46)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((n, i) => {
        setTimeout(() => this.playTone(n, 'triangle', 0.18, 0.16, n * 1.02), i * 65);
      });
    }

    playWinFanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((n, idx) => {
        setTimeout(() => this.playTone(n, 'triangle', 0.28, 0.2, n * 1.04), idx * 105);
      });
    }

    playFailAlert() {
      const notes = [350, 300, 250, 195];
      notes.forEach((n, idx) => {
        setTimeout(() => this.playTone(n, 'sawtooth', 0.22, 0.15, n * 0.9), idx * 120);
      });
    }

    playBooster() {
      this.playTone(400, 'sine', 0.22, 0.18, 880);
      setTimeout(() => this.playTone(620, 'triangle', 0.24, 0.18, 1180), 95);
    }

    startMusic() {
      if (this.musicTimer) clearInterval(this.musicTimer);
      if (!this.musicEnabled) return;
      // Light playful pizzicato/marimba loop like Video background music
      const notes = [261.6, 329.6, 392.0, 329.6, 293.7, 369.9, 440.0, 369.9, 349.2, 440.0, 523.2, 392.0];
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
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      }, 310);
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

      let numColors = 4;
      if (levelNum >= 7) numColors = 5;
      if (levelNum >= 14) numColors = 6;
      if (levelNum >= 28) numColors = 7;
      if (levelNum >= 55 && levelNum % 5 === 0) numColors = 8;

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
      const clampedLvl = Math.max(1, Math.min(1000, levelNum));
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

      const archetype = levelNum % 8;
      const slots = this.buildDistinctFormationArchetype(archetype, levelNum, rand);

      // Bus capacities scale with level difficulty (28 -> 32 -> 36 -> 40)
      const busCap = levelNum < 8 ? 28 : levelNum < 20 ? 32 : levelNum % 5 === 0 ? 40 : 32;

      const vehicles = slots.map((s, idx) => {
        // Ensure every color in colorPool appears and adjacent vehicles have varied colors
        const color = colorPool[(idx + Math.floor(rand() * colorPool.length)) % colorPool.length];
        const cap = s.type === 'bus' ? busCap : 16;
        return {
          id: `lvl${levelNum}_v${idx}`,
          x: s.x,
          z: s.z,
          dir: s.dir,
          type: s.type,
          color: color,
          cap: cap,
          tilt: s.tilt || 0
        };
      });

      this.ensureNoCyclicDeadlock(vehicles);
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
        // Archetype 2: CHEVRON WINGS & CONVOY (23 vehicles)
        list.push({ x: -2.2, z: 0.5, dir: 'LEFT', type: 'bus', tilt: -0.14 });
        list.push({ x: 2.2, z: 0.5, dir: 'RIGHT', type: 'bus', tilt: 0.14 });

        list.push({ x: -4.1, z: 2.4, dir: 'LEFT', type: 'car' });
        list.push({ x: -1.9, z: 2.4, dir: 'RIGHT', type: 'car' });
        list.push({ x: 1.9, z: 2.4, dir: 'LEFT', type: 'car' });
        list.push({ x: 4.1, z: 2.4, dir: 'RIGHT', type: 'car' });

        [-3.4, -1.7, 0.0, 1.7, 3.4].forEach((cx, i) => {
          list.push({
            x: cx,
            z: 4.5,
            dir: i === 2 ? 'UP' : 'DOWN',
            type: i % 2 === 0 ? 'bus' : 'car'
          });
        });

        list.push({ x: -4.1, z: 6.7, dir: 'LEFT', type: 'car' });
        list.push({ x: -1.9, z: 6.7, dir: 'LEFT', type: 'car' });
        list.push({ x: 0.0, z: 6.9, dir: 'DOWN', type: 'car' });
        list.push({ x: 1.9, z: 6.7, dir: 'RIGHT', type: 'car' });
        list.push({ x: 4.1, z: 6.7, dir: 'RIGHT', type: 'car' });

        list.push({ x: -4.1, z: 8.3, dir: 'LEFT', type: 'car' });
        list.push({ x: -1.9, z: 8.3, dir: 'RIGHT', type: 'car' });
        list.push({ x: 1.9, z: 8.3, dir: 'LEFT', type: 'car' });
        list.push({ x: 4.1, z: 8.3, dir: 'RIGHT', type: 'car' });

        list.push({ x: -2.3, z: 10.3, dir: 'LEFT', type: 'bus' });
        list.push({ x: 2.3, z: 10.3, dir: 'RIGHT', type: 'bus' });
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
        // Archetype 5: DOUBLE GAUNTLET (26 vehicles)
        list.push({ x: -3.3, z: 0.55, dir: 'LEFT', type: 'bus' });
        list.push({ x: 0.0, z: 0.55, dir: 'UP', type: 'car' });
        list.push({ x: 3.3, z: 0.55, dir: 'RIGHT', type: 'bus' });

        [-3.9, -2.6, -1.3, 1.3, 2.6, 3.9].forEach((cx, i) => {
          list.push({ x: cx, z: 2.6, dir: i % 2 === 0 ? 'UP' : 'DOWN', type: 'car' });
          list.push({ x: cx, z: 5.0, dir: i % 2 === 0 ? 'DOWN' : 'UP', type: 'car' });
        });

        list.push({ x: 0.0, z: 3.6, dir: 'DOWN', type: 'bus' });

        [-3.4, 0.0, 3.4].forEach((cx, idx) => {
          list.push({ x: cx, z: 7.2, dir: idx === 0 ? 'LEFT' : idx === 2 ? 'RIGHT' : 'LEFT', type: 'bus' });
          list.push({ x: cx, z: 8.8, dir: idx === 0 ? 'LEFT' : idx === 2 ? 'RIGHT' : 'RIGHT', type: 'car' });
        });

        list.push({ x: -2.3, z: 10.5, dir: 'LEFT', type: 'bus' });
        list.push({ x: 0.0, z: 10.5, dir: 'DOWN', type: 'car' });
        list.push({ x: 2.3, z: 10.5, dir: 'RIGHT', type: 'bus' });
      } else {
        // Archetype 6 & 7: MEGA HIGHWAY GRIDLOCK (28 vehicles)
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
      }

      if (shouldFlip) {
        list.forEach((item) => {
          if (item.dir === 'LEFT' || item.dir === 'RIGHT') {
            item.dir = flipDir(item.dir);
          }
        });
      }

      return list;
    }

    static getVehicleBounds(v) {
      const isHorizontal = v.dir === 'LEFT' || v.dir === 'RIGHT';
      const len = v.type === 'bus' ? 2.38 : 1.64;
      const wid = v.type === 'bus' ? 1.12 : 1.02;
      const hw = (isHorizontal ? len : wid) * 0.45;
      const hd = (isHorizontal ? wid : len) * 0.45;
      return {
        minX: v.x - hw,
        maxX: v.x + hw,
        minZ: v.z - hd,
        maxZ: v.z + hd
      };
    }

    static findBlockingVehicle(target, allVehicles) {
      const b1 = this.getVehicleBounds(target);
      let closestBlocker = null;
      let minDist = Infinity;

      for (const other of allVehicles) {
        if (other.id === target.id) continue;
        const b2 = this.getVehicleBounds(other);

        if (target.dir === 'UP') {
          const xOverlap = Math.min(b1.maxX, b2.maxX) - Math.max(b1.minX, b2.minX);
          if (xOverlap > 0.14 && b2.maxZ <= b1.minZ + 0.35) {
            const dist = b1.minZ - b2.maxZ;
            if (dist < minDist) {
              minDist = dist;
              closestBlocker = other;
            }
          }
        } else if (target.dir === 'DOWN') {
          const xOverlap = Math.min(b1.maxX, b2.maxX) - Math.max(b1.minX, b2.minX);
          if (xOverlap > 0.14 && b2.minZ >= b1.maxZ - 0.35) {
            const dist = b2.minZ - b1.maxZ;
            if (dist < minDist) {
              minDist = dist;
              closestBlocker = other;
            }
          }
        } else if (target.dir === 'LEFT') {
          const zOverlap = Math.min(b1.maxZ, b2.maxZ) - Math.max(b1.minZ, b2.minZ);
          if (zOverlap > 0.14 && b2.maxX <= b1.minX + 0.35) {
            const dist = b1.minX - b2.maxX;
            if (dist < minDist) {
              minDist = dist;
              closestBlocker = other;
            }
          }
        } else if (target.dir === 'RIGHT') {
          const zOverlap = Math.min(b1.maxZ, b2.maxZ) - Math.max(b1.minZ, b2.minZ);
          if (zOverlap > 0.14 && b2.minX >= b1.maxX - 0.35) {
            const dist = b2.minX - b1.maxX;
            if (dist < minDist) {
              minDist = dist;
              closestBlocker = other;
            }
          }
        }
      }

      return closestBlocker;
    }

    static ensureNoCyclicDeadlock(vehicles) {
      const remaining = vehicles.map((v) => v);
      const dirs = ['UP', 'LEFT', 'RIGHT', 'DOWN'];
      let guard = 0;

      while (remaining.length > 0 && guard < 200) {
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
        for (const v of remaining) {
          const origDir = v.dir;
          for (const d of dirs) {
            v.dir = d;
            if (!this.findBlockingVehicle(v, remaining)) {
              fixed = true;
              break;
            }
          }
          if (fixed) break;
          v.dir = origDir;
        }
        if (!fixed) {
          remaining.sort((a, b) => Math.hypot(b.x, b.z - 5.5) - Math.hypot(a.x, a.z - 5.5));
          const outer = remaining[0];
          outer.dir = outer.z < 5.5 ? 'UP' : 'DOWN';
        }
      }
    }

    /**
     * Simulates peeling unblocked vehicles and builds the exact 4-abreast passenger rows
     * for the Central Revolving Oval Ring + Left Feeder Road + Right Feeder Road,
     * plus calculates the level's Countdown Timer!
     */
    static finalizeWithRevolvingFeederQueues(levelNum, vehicles) {
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
      // Mix rows within small waves of 3 vehicles so the revolving ring has rich color variety
      // while remaining 100% solvable without ever needing to auto-swap colors!
      const allRows = [];
      const waveSize = 3;
      for (let w = 0; w < exitSequence.length; w += waveSize) {
        const waveVehicles = exitSequence.slice(w, w + waveSize);
        const waveRows = [];
        for (const v of waveVehicles) {
          const numRows = Math.round(v.cap / ROW_PASSENGERS);
          for (let r = 0; r < numRows; r++) {
            waveRows.push({
              color: v.color,
              count: ROW_PASSENGERS
            });
          }
        }
        // Interleave waveRows deterministically
        for (let i = waveRows.length - 1; i > 0; i--) {
          const j = Math.floor(rand() * (i + 1));
          const tmp = waveRows[i];
          waveRows[i] = waveRows[j];
          waveRows[j] = tmp;
        }
        allRows.push(...waveRows);
      }

      // First 28 rows populate the Central Revolving Oval Ring; remaining rows split into Left & Right Feeder Roads!
      const ovalRingSlots = new Array(RING_SLOT_COUNT).fill(null);
      const initialRingCount = Math.min(RING_SLOT_COUNT, allRows.length);
      for (let i = 0; i < initialRingCount; i++) {
        ovalRingSlots[i] = allRows[i];
      }

      const leftFeederRows = [];
      const rightFeederRows = [];
      for (let i = initialRingCount; i < allRows.length; i++) {
        if (i % 2 === 0) leftFeederRows.push(allRows[i]);
        else rightFeederRows.push(allRows[i]);
      }

      // Timer strictly between 60s (01:00) and 90s (01:30) as requested!
      let timeLimitSeconds = 60;
      if (levelNum === 1) timeLimitSeconds = 60;       // 01:00
      else if (levelNum === 2) timeLimitSeconds = 70;  // 01:10
      else if (levelNum === 3) timeLimitSeconds = 80;  // 01:20
      else {
        // Levels 4..1000: 75s (01:15) to 90s (01:30) max
        timeLimitSeconds = Math.min(90, 70 + (levelNum % 5) * 5);
      }

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
      this.levelTimeTotal = 95;
      this.levelTimeLeft = 95;
      this._lastUrgentSecond = -1;
      this.activeBoosterMode = null;
      this.isLevelOver = false;
      this.boardingCooldown = 0;
      this.emojiCooldown = 2.5;
      this._splashStarted = false;

      this.initThreeScene();
      this.buildEnvironment3D();
      this.initSlots();
      this.loadSaveData();
      this.bindUIEvents();
      this.drawLuckySpinWheel();

      // Run Opening Studio Splash ("Novaria") + Castle Loading Screen (0% -> 100%)
      // If web portal is active, wait until user enters name & clicks PLAY NOW / DOWNLOAD!
      if (!window.BFP_PORTAL_ACTIVE) {
        this.runOpeningSplashSequence();
      }

      this.lastFrameTime = performance.now();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
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

      // Step 1: Show "Novaria" purple splash for 1.3s, then fade to Castle Loading Screen
      setTimeout(() => {
        if (studioEl) studioEl.classList.add('hidden');
        setTimeout(() => {
          if (studioEl) studioEl.style.display = 'none';
        }, 450);

        // Step 2: Animate Loading Progress Bar (0% -> 29% -> 30% -> 84% -> 100% like Video!)
        const steps = [
          { delay: 150, pct: 18 },
          { delay: 450, pct: 29 },
          { delay: 800, pct: 30 },
          { delay: 1150, pct: 84 },
          { delay: 1550, pct: 100 }
        ];
        steps.forEach((st) => {
          setTimeout(() => {
            if (fillEl) fillEl.style.width = `${st.pct}%`;
            if (pctEl) pctEl.textContent = `${st.pct}%`;
          }, st.delay);
        });

        // Step 3: Enter Game & Trigger GO! Gates Rush
        setTimeout(() => {
          if (loadingEl) loadingEl.classList.add('hidden');
          setTimeout(() => {
            if (loadingEl) loadingEl.style.display = 'none';
          }, 450);
          this.startOrResumeGame();
        }, 1850);
      }, 1250);
    }

    // -----------------------------------------------------------------------
    // SAVE & LOAD SYSTEM (Mid-Level + Campaign Persistence)
    // -----------------------------------------------------------------------
    loadSaveData() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.profile = { ...this.profile, ...parsed };
          this.profile.boosters = {
            shuffle: 3,
            vip: 2,
            magnet: 2,
            ...(parsed.boosters || {})
          };
          // Lock progression strictly to currentLevel so player cannot skip ahead or go back
          this.profile.currentLevel = Math.max(1, this.profile.currentLevel || 1);
          this.profile.highestLevel = this.profile.currentLevel;
        }
        const savedName = localStorage.getItem('BFP_PLAYER_NAME');
        if (savedName && !this.profile.playerName) {
          this.profile.playerName = savedName;
        }
      } catch (e) {
        console.warn('Could not read save data:', e);
      }
      sound.sfxEnabled = this.profile.sfx !== false;
      sound.musicEnabled = this.profile.music !== false;
      this.syncSettingsButtons();
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
      try {
        const remainingPass = this.getTotalRemainingPassengers();
        if (!this.isLevelOver && (this.lotVehicles.length > 0 || remainingPass > 0)) {
          const slotData = this.slots.map((s) => ({
            index: s.index,
            type: s.type,
            unlocked: s.unlocked,
            vehicle: s.vehicle
              ? {
                  id: s.vehicle.id,
                  type: s.vehicle.type,
                  color: s.vehicle.color,
                  cap: s.vehicle.cap + (s.vehicle.inFlightCount || 0),
                  maxCap: s.vehicle.maxCap
                }
              : null
          }));

          for (const mv of this.movingVehicles) {
            if (mv.targetSlot && !slotData[mv.targetSlot.index].vehicle) {
              slotData[mv.targetSlot.index].vehicle = {
                id: mv.id,
                type: mv.type,
                color: mv.color,
                cap: mv.cap,
                maxCap: mv.maxCap
              };
            }
          }

          this.profile.activeMidLevelState = {
            levelNum: this.levelNum,
            lotVehicles: this.lotVehicles.map((v) => ({
              id: v.id,
              x: v.x,
              z: v.z,
              dir: v.dir,
              type: v.type,
              color: v.color,
              cap: v.cap,
              maxCap: v.maxCap,
              tilt: v.tilt || 0
            })),
            slots: slotData,
            ovalRingSlots: this.ovalRingSlots.map((r) => (r ? { ...r } : null)),
            leftFeederRows: this.leftFeederRows.map((r) => ({ ...r })),
            rightFeederRows: this.rightFeederRows.map((r) => ({ ...r })),
            totalBusesSentThisLevel: this.totalBusesSentThisLevel,
            levelTimeLeft: this.levelTimeLeft,
            levelTimeTotal: this.levelTimeTotal
          };
        } else {
          this.profile.activeMidLevelState = null;
        }

        localStorage.setItem(SAVE_KEY, JSON.stringify(this.profile));
        if (showToast) {
          this.triggerSaveToast();
        }
      } catch (e) {
        console.warn('Could not save progress:', e);
      }
    }

    triggerSaveToast() {
      const toast = document.getElementById('save-toast');
      if (!toast) return;
      toast.classList.add('visible');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => toast.classList.remove('visible'), 1300);
    }

    startOrResumeGame() {
      const mid = this.profile.activeMidLevelState;
      if (
        mid &&
        mid.levelNum === this.profile.currentLevel &&
        mid.ovalRingSlots &&
        mid.ovalRingSlots.some((r) => r && r.count > 0)
      ) {
        this.restoreMidLevelState(mid);
      } else {
        this.loadLevel(this.profile.currentLevel);
      }
    }

    // -----------------------------------------------------------------------
    // THREE.JS SCENE & CAMERA
    // -----------------------------------------------------------------------
    initThreeScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xcfd5e6);

      const width = this.container.clientWidth || 450;
      const height = this.container.clientHeight || 850;
      const aspect = width / height;

      this.frustumHeight = 29.5;
      this.camera = new THREE.OrthographicCamera(
        (-this.frustumHeight * aspect) / 2,
        (this.frustumHeight * aspect) / 2,
        this.frustumHeight / 2,
        -this.frustumHeight / 2,
        1,
        100
      );

      this.camera.position.set(0, 28, 11.2);
      this.camera.lookAt(0, 0, -0.55);

      const isMobileGPU = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || width < 600;
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: !isMobileGPU,
        alpha: false,
        stencil: false,
        powerPreference: 'high-performance'
      });
      this.viewWidth = width;
      this.viewHeight = height;
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileGPU ? 1.15 : 1.5));
      this.renderer.shadowMap.enabled = false;

      const ambient = new THREE.AmbientLight(0xffffff, 0.76);
      this.scene.add(ambient);

      const dirLight = new THREE.DirectionalLight(0xfffaf0, 0.68);
      dirLight.position.set(10, 26, 12);
      dirLight.castShadow = false;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      const d = 16;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
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

      const minWidthWorld = 15.2;
      let fHeight = 29.5;
      if (fHeight * aspect < minWidthWorld) {
        fHeight = minWidthWorld / aspect;
      }
      this.frustumHeight = fHeight;

      this.camera.left = (-fHeight * aspect) / 2;
      this.camera.right = (fHeight * aspect) / 2;
      this.camera.top = fHeight / 2;
      this.camera.bottom = -fHeight / 2;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.updateSlotOverlays();
    }

    // -----------------------------------------------------------------------
    // 3D ENVIRONMENT: GRASS PARK, OVAL ROUNDABOUT & DUAL FEEDER ROADS
    // -----------------------------------------------------------------------
    buildEnvironment3D() {
      // Bottom Parking Lot Floor
      const lotGeo = new THREE.PlaneGeometry(110, 32);
      const lotMat = new THREE.MeshLambertMaterial({ color: 0xcfd5e6 });
      const lotMesh = new THREE.Mesh(lotGeo, lotMat);
      lotMesh.rotation.x = -Math.PI / 2;
      lotMesh.position.set(0, -0.05, 6.2);
      lotMesh.receiveShadow = true;
      this.envGroup.add(lotMesh);

      // Top Green Park Terrain
      const grassGeo = new THREE.PlaneGeometry(110, 22);
      const grassMat = new THREE.MeshLambertMaterial({ color: 0x80b660 });
      const grassMesh = new THREE.Mesh(grassGeo, grassMat);
      grassMesh.rotation.x = -Math.PI / 2;
      grassMesh.position.set(0, 0.0, -10.8);
      grassMesh.receiveShadow = true;
      this.envGroup.add(grassMesh);

      // Middle Boarding Bay Asphalt
      const bayGeo = new THREE.PlaneGeometry(110, 4.9);
      const bayMat = new THREE.MeshLambertMaterial({ color: 0x6e7382 });
      const bayMesh = new THREE.Mesh(bayGeo, bayMat);
      bayMesh.rotation.x = -Math.PI / 2;
      bayMesh.position.set(0, 0.02, -3.15);
      bayMesh.receiveShadow = true;
      this.envGroup.add(bayMesh);

      const curbMat = new THREE.MeshLambertMaterial({ color: 0xe8ecf5 });
      const dividerMesh = new THREE.Mesh(new THREE.BoxGeometry(110, 0.16, 0.18), curbMat);
      dividerMesh.position.set(0, 0.08, -0.72);
      this.envGroup.add(dividerMesh);

      const leftCurb = new THREE.Mesh(new THREE.BoxGeometry(50, 0.22, 0.22), curbMat);
      leftCurb.position.set(-25.8, 0.11, -5.55);
      this.envGroup.add(leftCurb);

      const rightCurb = new THREE.Mesh(new THREE.BoxGeometry(50, 0.22, 0.22), curbMat);
      rightCurb.position.set(25.8, 0.11, -5.55);
      this.envGroup.add(rightCurb);

      // Central Oval Roundabout Ring
      const roadMat = new THREE.MeshLambertMaterial({ color: 0x686d7a });
      const ovalOuter = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.4, 0.06, 48), roadMat);
      ovalOuter.scale.set(1.08, 1, 0.68);
      ovalOuter.position.set(0, 0.04, -8.55);
      this.envGroup.add(ovalOuter);

      const ovalBorder = new THREE.Mesh(new THREE.CylinderGeometry(4.62, 4.62, 0.04, 48), curbMat);
      ovalBorder.scale.set(1.08, 1, 0.68);
      ovalBorder.position.set(0, 0.02, -8.55);
      this.envGroup.add(ovalBorder);

      // Inner green grass island in center of oval
      const innerIslandBorder = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 0.14, 36), curbMat);
      innerIslandBorder.scale.set(1.2, 1, 0.55);
      innerIslandBorder.position.set(0, 0.07, -8.55);
      this.envGroup.add(innerIslandBorder);

      const innerIslandGrass = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.72, 0.18, 36), grassMat);
      innerIslandGrass.scale.set(1.2, 1, 0.55);
      innerIslandGrass.position.set(0, 0.09, -8.55);
      this.envGroup.add(innerIslandGrass);

      this.buildFeederRoad(-1, roadMat, curbMat);
      this.buildFeederRoad(1, roadMat, curbMat);

      this.addBushWithFlowers(-4.8, -6.15);
      this.addBushWithFlowers(4.8, -6.15);
      this.addTree(-7.1, -9.2);
      this.addTree(7.1, -9.2);
    }

    buildFeederRoad(side, roadMat, curbMat) {
      const segments = 16;
      for (let i = 0; i < segments; i++) {
        const t = i / (segments - 1);
        const x = side * (4.15 + t * 1.95);
        const z = -9.1 - t * 6.5;
        const angle = side * 0.26;

        const segRoad = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.06, 0.65), roadMat);
        segRoad.position.set(x, 0.04, z);
        segRoad.rotation.y = angle;
        this.envGroup.add(segRoad);

        const segBorder = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.7), curbMat);
        segBorder.position.set(x, 0.02, z);
        segBorder.rotation.y = angle;
        this.envGroup.add(segBorder);
      }
    }

    addBushWithFlowers(x, z) {
      const group = new THREE.Group();
      const bushMat = new THREE.MeshLambertMaterial({ color: 0x5c9c42 });
      const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 10), bushMat);
      b1.scale.set(1.3, 0.7, 0.9);
      const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), bushMat);
      b2.position.set(-0.45, -0.05, 0.1);
      const b3 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), bushMat);
      b3.position.set(0.45, -0.05, 0.1);
      group.add(b1, b2, b3);

      const flowerMat = new THREE.MeshBasicMaterial({ color: 0xffd6e7 });
      [
        [-0.35, 0.32, 0.25],
        [0.0, 0.38, 0.3],
        [0.35, 0.3, 0.22],
        [-0.18, 0.28, -0.15],
        [0.22, 0.32, -0.1]
      ].forEach(([fx, fy, fz]) => {
        const fl = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), flowerMat);
        fl.position.set(fx, fy, fz);
        group.add(fl);
      });

      group.position.set(x, 0.2, z);
      this.envGroup.add(group);
    }

    addTree(x, z) {
      const treeMat = new THREE.MeshLambertMaterial({ color: 0x4e8c38 });
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.95, 14, 12), treeMat);
      crown.position.set(x, 0.65, z);
      crown.castShadow = true;
      this.envGroup.add(crown);
    }

    // -----------------------------------------------------------------------
    // 8 ANGLED BOARDING SLOTS (1 VIP + 4 Normal + 3 Locked '+')
    // -----------------------------------------------------------------------
    initSlots() {
      while (this.slotsGroup.children.length > 0) {
        this.slotsGroup.remove(this.slotsGroup.children[0]);
      }
      this.slots = [];

      const slotXPositions = [-5.95, -4.25, -2.55, -0.85, 0.85, 2.55, 4.25, 5.95];
      const slotZ = -3.35;
      const slotTilt = 0.36;

      slotXPositions.forEach((sx, idx) => {
        const isVip = idx === 0;
        const isLockedPlus = idx >= 5;

        const slotGroup = new THREE.Group();
        slotGroup.position.set(sx, 0.04, slotZ);
        slotGroup.rotation.y = slotTilt;

        const borderColor = isVip ? 0xf5b027 : isLockedPlus ? 0x62c98b : 0xdbe2f0;
        const fillColor = 0x5c6170;

        const borderMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(1.36, 2.38),
          new THREE.MeshBasicMaterial({ color: borderColor })
        );
        borderMesh.rotation.x = -Math.PI / 2;
        slotGroup.add(borderMesh);

        const padMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(1.18, 2.18),
          new THREE.MeshBasicMaterial({ color: fillColor })
        );
        padMesh.rotation.x = -Math.PI / 2;
        padMesh.position.y = 0.01;
        slotGroup.add(padMesh);

        let decalMesh = null;
        if (isVip || isLockedPlus) {
          const canvas = document.createElement('canvas');
          canvas.width = 128;
          canvas.height = 256;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, 128, 256);

          if (isVip) {
            ctx.save();
            ctx.translate(64, 128);
            ctx.rotate(Math.PI / 2);
            ctx.fillStyle = '#f5b027';
            ctx.font = '900 48px "Segoe UI", Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('VIP', 0, 0);
            ctx.restore();
          } else if (isLockedPlus) {
            ctx.fillStyle = '#5ce68b';
            ctx.font = '900 68px "Segoe UI", Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('+', 64, 128);
          }

          const tex = new THREE.CanvasTexture(canvas);
          decalMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1.1, 2.1),
            new THREE.MeshBasicMaterial({ map: tex, transparent: true })
          );
          decalMesh.rotation.x = -Math.PI / 2;
          decalMesh.position.y = 0.02;
          slotGroup.add(decalMesh);
        }

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
          borderMesh,
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
      slot.borderMesh.material.color.setHex(0xdbe2f0);
      if (slot.decalMesh) slot.decalMesh.visible = false;

      sound.playBooster();
      this.spawnFloatingText(slot.x, slot.z, '➕ Slot Unlocked!', '#5ce68b');
      this.updateHUD();
      this.updateSlotOverlays();
      this.saveGameProgress(true);
      return true;
    }

    // -----------------------------------------------------------------------
    // 3D VEHICLE BUILDER (SHARED GEOMETRIES & FAST LAMBERT MATERIALS)
    // -----------------------------------------------------------------------
    initSharedVehicleResources() {
      if (this._vehResReady) return;
      this._vehResReady = true;

      this._vehBodyMats = {};
      this._vehDarkMats = {};
      Object.keys(COLORS).forEach((k) => {
        this._vehBodyMats[k] = new THREE.MeshLambertMaterial({ color: COLORS[k].hex });
        this._vehDarkMats[k] = new THREE.MeshLambertMaterial({ color: COLORS[k].darkHex });
      });
      this._vehGlassMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      this._vehWheelMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
      this._vehHlMat = new THREE.MeshBasicMaterial({ color: 0xfff799 });

      const buildTypeGeos = (isBus) => {
        const length = isBus ? 2.38 : 1.64;
        const width = isBus ? 1.12 : 1.02;
        const bodyHeight = isBus ? 0.78 : 0.48;
        const cabinLen = isBus ? length * 0.94 : length * 0.68;

        return {
          length,
          width,
          bodyHeight,
          cabinLen,
          chassisGeo: new THREE.BoxGeometry(width, bodyHeight * 0.65, length),
          cabinGeo: new THREE.BoxGeometry(width * 0.94, bodyHeight * 0.65, cabinLen),
          glassGeo: new THREE.BoxGeometry(width * 0.97, bodyHeight * 0.38, cabinLen * 0.86),
          axleGeo: new THREE.BoxGeometry(width * 1.06, 0.26, 0.34),
          arrowGeo: new THREE.PlaneGeometry(width * 0.84, cabinLen * 0.78),
          arrowMat: new THREE.MeshBasicMaterial({
            map: this.getArrowTexture(),
            transparent: true,
            depthTest: false
          })
        };
      };

      this._busGeos = buildTypeGeos(true);
      this._carGeos = buildTypeGeos(false);
    }

    createVehicleMesh(vehicleData) {
      this.initSharedVehicleResources();
      const group = new THREE.Group();
      const colorKey = COLORS[vehicleData.color] ? vehicleData.color : 'blue';
      const isBus = vehicleData.type === 'bus';
      const g = isBus ? this._busGeos : this._carGeos;

      const bodyMat = this._vehBodyMats[colorKey];
      const darkMat = this._vehDarkMats[colorKey];

      const chassis = new THREE.Mesh(g.chassisGeo, darkMat);
      chassis.position.y = g.bodyHeight * 0.35;
      group.add(chassis);

      const cabin = new THREE.Mesh(g.cabinGeo, bodyMat);
      cabin.position.y = g.bodyHeight * 0.82;
      group.add(cabin);

      const windows = new THREE.Mesh(g.glassGeo, this._vehGlassMat);
      windows.position.y = g.bodyHeight * 0.84;
      group.add(windows);

      const frontAxle = new THREE.Mesh(g.axleGeo, this._vehWheelMat);
      frontAxle.position.set(0, 0.15, -g.length * 0.3);
      group.add(frontAxle);

      const rearAxle = new THREE.Mesh(g.axleGeo, this._vehWheelMat);
      rearAxle.position.set(0, 0.15, g.length * 0.3);
      group.add(rearAxle);

      const arrowPlane = new THREE.Mesh(g.arrowGeo, g.arrowMat);
      arrowPlane.rotation.x = -Math.PI / 2;
      arrowPlane.position.y = g.bodyHeight * 1.15 + 0.03;
      arrowPlane.renderOrder = 2;
      group.add(arrowPlane);

      let rotY = 0;
      if (vehicleData.dir === 'UP') rotY = 0;
      else if (vehicleData.dir === 'DOWN') rotY = Math.PI;
      else if (vehicleData.dir === 'LEFT') rotY = Math.PI / 2;
      else if (vehicleData.dir === 'RIGHT') rotY = -Math.PI / 2;

      if (vehicleData.tilt) {
        rotY += vehicleData.tilt;
      }

      group.rotation.y = rotY;
      group.position.set(vehicleData.x, 0, vehicleData.z);
      group.userData.vehicleId = vehicleData.id;

      return group;
    }

    getArrowTexture() {
      if (this._arrowTex) return this._arrowTex;
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 128, 160);

      ctx.beginPath();
      ctx.moveTo(64, 16);
      ctx.lineTo(108, 66);
      ctx.lineTo(80, 66);
      ctx.lineTo(80, 142);
      ctx.lineTo(48, 142);
      ctx.lineTo(48, 66);
      ctx.lineTo(20, 66);
      ctx.closePath();

      ctx.lineJoin = 'round';
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#141923';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.fill();

      this._arrowTex = new THREE.CanvasTexture(canvas);
      return this._arrowTex;
    }

    // -----------------------------------------------------------------------
    // 3D REVOLVING OVAL LOOP & DUAL FEEDER PASSENGER MESHES (SINGLE-MESH MERGED!)
    // -----------------------------------------------------------------------
    initSharedStickmanResources() {
      if (this._mergedStickmanGeo) return;

      const torsoGeo = new THREE.CylinderGeometry(0.145, 0.165, 0.36, 6).toNonIndexed();
      torsoGeo.translate(0, 0.2, 0);
      const headGeo = new THREE.SphereGeometry(0.175, 7, 5).toNonIndexed();
      headGeo.translate(0, 0.48, 0);

      const pos1 = torsoGeo.attributes.position.array;
      const pos2 = headGeo.attributes.position.array;
      const norm1 = torsoGeo.attributes.normal.array;
      const norm2 = headGeo.attributes.normal.array;

      const mergedPos = new Float32Array(pos1.length + pos2.length);
      mergedPos.set(pos1, 0);
      mergedPos.set(pos2, pos1.length);

      const mergedNorm = new Float32Array(norm1.length + norm2.length);
      mergedNorm.set(norm1, 0);
      mergedNorm.set(norm2, norm1.length);

      this._mergedStickmanGeo = new THREE.BufferGeometry();
      this._mergedStickmanGeo.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
      this._mergedStickmanGeo.setAttribute('normal', new THREE.BufferAttribute(mergedNorm, 3));

      this._stickColorMats = {};
      Object.keys(COLORS).forEach((k) => {
        this._stickColorMats[k] = new THREE.MeshLambertMaterial({ color: COLORS[k].hex });
      });
    }

    setStickmanColor(sm, colorKey) {
      if (sm.userData.colorKey === colorKey) return;
      this.initSharedStickmanResources();
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
      // Reuse existing pool across levels (0 allocations on level change!)
      if (this.ringRowMeshes && this.ringRowMeshes.length === RING_SLOT_COUNT) {
        return;
      }
      this.ringRowMeshes = [];
      this.leftFeederMeshes = [];
      this.rightFeederMeshes = [];

      // 1. 28 Radial Rows in the Central Oval Ring (4 stickmen per row)
      for (let k = 0; k < RING_SLOT_COUNT; k++) {
        const members = [];
        for (let m = 0; m < ROW_PASSENGERS; m++) {
          const sm = this.createStickmanMesh();
          this.passengersGroup.add(sm);
          members.push(sm);
        }
        this.ringRowMeshes.push(members);
      }

      // 2. 12 visible rows on Left Feeder Road & Right Feeder Road
      for (let r = 0; r < 12; r++) {
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
     * Updates 3D positions of all revolving oval ring passengers & feeder lane passengers!
     * AND handles refilling empty oval ring slots from the Left & Right Feeder Roads!
     */
    updateRevolvingLoopAndFeederMeshes(dt, now) {
      // 1. Advance intro rush (when GO! gates open at level start)
      if (this.levelIntroRushProgress < 1) {
        this.levelIntroRushProgress = Math.min(1, this.levelIntroRushProgress + dt * 1.45);
      }

      // 2. Continuously rotate the Central Oval Ring counter-clockwise (matching Video 00:30-01:20!)
      const prevAngle = this.ringRotationAngle;
      const loopSpeed = Math.min(1.9, 1.45 + Math.floor(this.levelNum / 10) * 0.04);
      this.ringRotationAngle = (this.ringRotationAngle + dt * loopSpeed) % (Math.PI * 2);

      // 3. Refill any empty slots in the revolving oval ring as they pass the Left or Right Feeder Junctions!
      const leftJunctionAngle = 3.55;  // Top-Left of oval ring
      const rightJunctionAngle = 5.85; // Top-Right of oval ring

      for (let k = 0; k < RING_SLOT_COUNT; k++) {
        const rowData = this.ovalRingSlots[k];
        const isEmpty = !rowData || rowData.count <= 0;
        if (!isEmpty) continue;

        const theta = (this.ringRotationAngle + (k / RING_SLOT_COUNT) * Math.PI * 2) % (Math.PI * 2);

        // Check if near Top-Left Feeder Junction
        if (this.leftFeederRows.length > 0 && Math.abs(theta - leftJunctionAngle) < 0.24) {
          this.ovalRingSlots[k] = this.leftFeederRows.shift();
        } else if (this.rightFeederRows.length > 0 && Math.abs(theta - rightJunctionAngle) < 0.24) {
          this.ovalRingSlots[k] = this.rightFeederRows.shift();
        }
      }

      // 4. Position all 28 radial rows revolving around the Central Oval Ring
      const rx = 3.35;
      const rz = 1.95;
      const centerZ = -8.55;

      for (let k = 0; k < RING_SLOT_COUNT; k++) {
        const rowData = this.ovalRingSlots[k];
        const members = this.ringRowMeshes[k];
        const theta = (this.ringRotationAngle + (k / RING_SLOT_COUNT) * Math.PI * 2) % (Math.PI * 2);

        const baseX = Math.cos(theta) * rx;
        const baseZ = centerZ + Math.sin(theta) * rz;
        const nx = Math.cos(theta);
        const nz = Math.sin(theta);

        // Intro rush offset from top feeder gates during first 0.7s of level
        const introOffsetZ = (1 - this.levelIntroRushProgress) * -5.2;

        for (let m = 0; m < ROW_PASSENGERS; m++) {
          const sm = members[m];
          if (!rowData || m >= rowData.count) {
            sm.visible = false;
            continue;
          }
          sm.visible = true;
          this.setStickmanColor(sm, rowData.color);

          const radialOffset = (m - 1.5) * 0.36;
          const px = baseX + nx * radialOffset;
          const pz = baseZ + nz * radialOffset + introOffsetZ;
          const bobY = Math.abs(Math.sin(now * 0.011 + k * 0.6 + m * 0.3)) * 0.14;

          sm.position.set(px, bobY, pz);
        }
      }

      // 5. Position waiting rows on Left Feeder Road & Right Feeder Road
      this.positionFeederLane(this.leftFeederRows, this.leftFeederMeshes, -1, now);
      this.positionFeederLane(this.rightFeederRows, this.rightFeederMeshes, 1, now);
    }

    positionFeederLane(feederQueue, meshRows, side, now) {
      for (let r = 0; r < meshRows.length; r++) {
        const rowData = feederQueue[r];
        const members = meshRows[r];
        const t = r / 16;
        const baseX = side * (4.15 + t * 1.95);
        const baseZ = -9.35 - t * 6.2;
        const nx = side * 0.96;
        const nz = -0.25;

        for (let m = 0; m < ROW_PASSENGERS; m++) {
          const sm = members[m];
          if (!rowData || m >= rowData.count) {
            sm.visible = false;
            continue;
          }
          sm.visible = true;
          this.setStickmanColor(sm, rowData.color);

          const lateralOffset = (m - 1.5) * 0.35;
          const targetX = baseX + nx * lateralOffset;
          const targetZ = baseZ + nz * lateralOffset;

          sm.position.x += (targetX - sm.position.x) * 0.22;
          sm.position.z += (targetZ - sm.position.z) * 0.22;
          sm.position.y = Math.abs(Math.sin(now * 0.008 + r * 0.5)) * 0.09;
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

      this.lotVehicles = [];
      this.movingVehicles = [];
      this.departingVehicles = [];
      this.jumpingPassengers = [];
      this.smokePuffs = [];
      this.confettiParticles = [];
      this.shockwaves = [];
      this.activeBoosterMode = null;
      document.getElementById('booster-mode-banner').style.display = 'none';

      this.initSlots();
      this.buildPassengerMeshPools();
    }

    loadLevel(levelNum) {
      this.clearLevelMeshes();
      this.isLevelOver = false;
      // Strict progression: always play at highest unlocked level (cannot go back to beaten levels or skip ahead)
      const targetLvl = Math.max(1, this.profile.highestLevel || levelNum);
      this.levelNum = targetLvl;
      this.profile.currentLevel = this.levelNum;
      this.profile.highestLevel = this.levelNum;

      const levelData = LevelGenerator.generateLevel(this.levelNum);
      this.totalBusesSentThisLevel = 0;
      this.levelTimeTotal = levelData.timeLimitSeconds || 120;
      this.levelTimeLeft = this.levelTimeTotal;
      this._lastUrgentSecond = -1;

      levelData.vehicles.forEach((v) => {
        const vObj = {
          ...v,
          maxCap: v.cap,
          mesh: null
        };
        vObj.mesh = this.createVehicleMesh(vObj);
        this.vehiclesGroup.add(vObj.mesh);
        this.lotVehicles.push(vObj);
      });

      this.ovalRingSlots = levelData.ovalRingSlots;
      this.leftFeederRows = levelData.leftFeederRows;
      this.rightFeederRows = levelData.rightFeederRows;
      this.levelIntroRushProgress = 0;

      // Trigger GO! gates opening animation & crowd cheer (Video 00:28-00:29!)
      this.spawnGoGatesIntro();

      // Update difficulty badge & tutorial hint
      const meta = LevelGenerator.getLevelMeta(this.levelNum);
      const diffEl = document.getElementById('difficulty-tag');
      if (diffEl) {
        diffEl.textContent = meta.name;
        diffEl.className = `difficulty-tag ${meta.isHard ? 'hard' : ''}`;
      }

      const hint = document.getElementById('tutorial-hint');
      if (hint) {
        hint.textContent = `Level ${this.levelNum}: ${meta.name} — Match buses with the spinning loop!`;
        hint.style.display = 'block';
      }

      this.updateHUD();
      this.updateSlotOverlays();
      this.checkAndAutoUnblockLot();
      this.saveGameProgress(false);
    }

    spawnGoGatesIntro() {
      sound.playGoCheer();
      if (sound.musicEnabled) sound.startMusic();

      const leftPos = this.projectToScreen(-4.9, 0.5, -11.5);
      const rightPos = this.projectToScreen(4.9, 0.5, -11.5);

      [leftPos, rightPos].forEach((pos) => {
        const gate = document.createElement('div');
        gate.className = 'go-gate-badge';
        gate.style.left = `${pos.x}px`;
        gate.style.top = `${pos.y}px`;
        gate.textContent = 'GO!';
        this.fxLayer.appendChild(gate);
        setTimeout(() => gate.classList.add('open'), 380);
        setTimeout(() => gate.remove(), 850);
      });
    }

    restoreMidLevelState(mid) {
      this.clearLevelMeshes();
      this.isLevelOver = false;
      this.levelNum = mid.levelNum;
      this.totalBusesSentThisLevel = mid.totalBusesSentThisLevel || 0;
      this.levelTimeTotal = mid.levelTimeTotal || 120;
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
          slot.borderMesh.material.color.setHex(0xdbe2f0);
          if (slot.decalMesh) slot.decalMesh.visible = false;
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

      // VIP Airlift Booster Mode
      if (this.activeBoosterMode === 'vip') {
        const vipSlot = this.slots[0];
        if (vipSlot.vehicle || vipSlot.reserved) {
          this.spawnFloatingText(vipSlot.x, vipSlot.z, 'VIP Slot Busy!', '#ff6b6b');
          return;
        }
        this.activeBoosterMode = null;
        document.getElementById('booster-mode-banner').style.display = 'none';
        this.profile.boosters.vip = Math.max(0, this.profile.boosters.vip - 1);
        sound.playBooster();
        this.sendVehicleToSlot(vehicle, vipSlot, true);
        return;
      }

      // 1. Check if blocked by another vehicle
      this.checkAndAutoUnblockLot();
      const blocker = LevelGenerator.findBlockingVehicle(vehicle, this.lotVehicles);
      if (blocker) {
        this.triggerBlockedBumpAnimation(vehicle, blocker);
        return;
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

      const dirVec = { x: 0, z: 0 };
      if (vehicle.dir === 'UP') dirVec.z = -1;
      else if (vehicle.dir === 'DOWN') dirVec.z = 1;
      else if (vehicle.dir === 'LEFT') dirVec.x = -1;
      else if (vehicle.dir === 'RIGHT') dirVec.x = 1;

      const startX = vehicle.x;
      const startZ = vehicle.z;
      const bumpDist = 0.42;

      const hitX = (vehicle.x + blocker.x) / 2;
      const hitZ = (vehicle.z + blocker.z) / 2;
      this.spawnShockwave(hitX, hitZ);

      let t = 0;
      const animateBump = () => {
        t += 0.16;
        if (t < 1) {
          const offset = Math.sin(t * Math.PI) * bumpDist;
          vehicle.mesh.position.x = startX + dirVec.x * offset;
          vehicle.mesh.position.z = startZ + dirVec.z * offset;
          blocker.mesh.rotation.z = Math.sin(t * Math.PI * 2) * 0.08;
          requestAnimationFrame(animateBump);
        } else {
          vehicle.mesh.position.set(startX, 0, startZ);
          blocker.mesh.rotation.z = 0;
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

    spawnExhaustSmoke(x, z) {
      if (!this._sharedSmokeGeo) {
        this._sharedSmokeGeo = new THREE.SphereGeometry(0.22, 6, 6);
      }
      const smokeGeo = this._sharedSmokeGeo;
      const smokeMat = new THREE.MeshBasicMaterial({
        color: 0xf8fafc,
        transparent: true,
        opacity: 0.8
      });
      const puff = new THREE.Mesh(smokeGeo, smokeMat);
      puff.position.set(
        x + (Math.random() - 0.5) * 0.25,
        0.25,
        z + (Math.random() - 0.5) * 0.25
      );
      this.fxGroup.add(puff);
      this.smokePuffs.push({
        mesh: puff,
        scale: 1,
        opacity: 0.85
      });
    }

    spawnConfettiBurst(x, z) {
      const confettiColors = [0xffcc18, 0x2288ff, 0xf03242, 0x26d153, 0xa53dff, 0xffffff];
      for (let i = 0; i < 24; i++) {
        const geo = new THREE.PlaneGeometry(0.16, 0.24);
        const mat = new THREE.MeshBasicMaterial({
          color: confettiColors[i % confettiColors.length],
          side: THREE.DoubleSide
        });
        const p = new THREE.Mesh(geo, mat);
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
        if (vehicle.dir === 'UP') {
          waypoints.push({ x: vehicle.x, y: 0, z: -1.1 });
          waypoints.push({ x: targetSlot.x, y: 0, z: targetSlot.z });
        } else if (vehicle.dir === 'LEFT') {
          waypoints.push({ x: -6.3, y: 0, z: vehicle.z });
          waypoints.push({ x: -6.3, y: 0, z: -1.1 });
          waypoints.push({ x: targetSlot.x, y: 0, z: targetSlot.z });
        } else if (vehicle.dir === 'RIGHT') {
          waypoints.push({ x: 6.3, y: 0, z: vehicle.z });
          waypoints.push({ x: 6.3, y: 0, z: -1.1 });
          waypoints.push({ x: targetSlot.x, y: 0, z: targetSlot.z });
        } else if (vehicle.dir === 'DOWN') {
          const sideX = vehicle.x <= 0 ? -6.3 : 6.3;
          waypoints.push({ x: vehicle.x, y: 0, z: 11.8 });
          waypoints.push({ x: sideX, y: 0, z: 11.8 });
          waypoints.push({ x: sideX, y: 0, z: -1.1 });
          waypoints.push({ x: targetSlot.x, y: 0, z: targetSlot.z });
        }
      }

      this.movingVehicles.push({
        ...vehicle,
        targetSlot,
        waypoints,
        wpIndex: 0,
        smokeTimer: 0,
        speed: isAirlift ? 34 : 40
      });

      this.saveGameProgress(false);
    }

    // -----------------------------------------------------------------------
    // BOARDING FROM REVOLVING OVAL LOOP AT BOTTOM GATE (Video 00:39-01:20)
    // -----------------------------------------------------------------------
    updateBoardingFromRevolvingLoop(dt) {
      if (this.isLevelOver) return;

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
          this.boardingCooldown = 0.025; // Ultra-snappy boarding stream!
          rowData.count -= 1;
          const startPos = this.ringRowMeshes[k][rowData.count].position;

          if (rowData.count <= 0) {
            this.ovalRingSlots[k] = null;
          }

          matchingSlot.vehicle.inFlightCount = (matchingSlot.vehicle.inFlightCount || 0) + 1;

          const jumper = this.createStickmanMesh();
          this.setStickmanColor(jumper, rowData.color);
          jumper.position.copy(startPos);
          this.passengersGroup.add(jumper);

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
        this.checkAllSlotsFullDeadlock();
      }
    }

    checkAllSlotsFullDeadlock() {
      if (this.movingVehicles.length > 0 || this.jumpingPassengers.length > 0) return;

      const unlockedNormalSlots = this.slots.filter((s) => s.index >= 1 && s.unlocked);
      const allFull = unlockedNormalSlots.every((s) => s.vehicle !== null);
      if (!allFull) return;

      // Check if ANY passenger currently inside the revolving oval ring matches ANY parked bus
      const colorsInOvalRing = new Set();
      for (const r of this.ovalRingSlots) {
        if (r && r.count > 0) colorsInOvalRing.add(r.color);
      }

      const anyMatchingInRing = this.slots.some(
        (s) => s.vehicle && s.vehicle.cap > 0 && colorsInOvalRing.has(s.vehicle.color)
      );

      if (!anyMatchingInRing) {
        this.isLevelOver = true;
        this.failReason = 'slots';
        sound.playFailAlert();
        const fTitle = document.getElementById('fail-modal-title');
        const fSub = document.getElementById('fail-modal-subtitle');
        const btnSlot = document.getElementById('btn-revive-slot');
        const btnFree = document.getElementById('btn-revive-free');
        if (fTitle) fTitle.textContent = '🚨 All Slots Full!';
        if (fSub) fSub.textContent = 'All boarding slots are occupied and none match the passengers in the spinning loop!';
        if (btnSlot) btnSlot.textContent = '➕ Unlock Extra Slot & Clear 1 Bus (🪙 40)';
        if (btnFree) btnFree.textContent = '🎁 Emergency VIP Rescue (Free)';
        setTimeout(() => {
          document.getElementById('modal-fail').classList.add('active');
        }, 450);
      }
    }

    checkLevelWinCondition() {
      if (this.isLevelOver) return;
      const anyParked = this.slots.some((s) => s.vehicle !== null);
      const remainingPass = this.getTotalRemainingPassengers();

      if (
        remainingPass === 0 &&
        this.lotVehicles.length === 0 &&
        this.movingVehicles.length === 0 &&
        this.jumpingPassengers.length === 0 &&
        !anyParked
      ) {
        this.isLevelOver = true;
        sound.playWinFanfare();

        const coinsEarned = 20 + this.levelNum * 10;
        this.profile.coins += coinsEarned;
        this.profile.levelStars[this.levelNum] = 3;

        const completedLevel = this.levelNum;
        this.profile.currentLevel = this.levelNum + 1;
        if (this.profile.currentLevel > this.profile.highestLevel) {
          this.profile.highestLevel = this.profile.currentLevel;
        }
        this.profile.activeMidLevelState = null;
        this.saveGameProgress(true);

        document.getElementById('win-total-coins').textContent = `${this.profile.coins}`;
        document.getElementById('win-coins-earned').textContent = `${coinsEarned}`;

        // Show "Having Fun?" rating popup on Level 3 (just like Video 01:22!)
        if (completedLevel === 3 && !this.profile.ratedGame) {
          this.profile.ratedGame = true;
          document.getElementById('modal-rate').classList.add('active');
        } else {
          this.openWinScreenWithFireworks();
        }
        this.updateHUD();
      }
    }

    openWinScreenWithFireworks() {
      document.getElementById('modal-win').classList.add('active');
      this.startFireworksCanvas();
    }

    startFireworksCanvas() {
      const fwCanvas = document.getElementById('fireworks-canvas');
      if (!fwCanvas) return;
      fwCanvas.width = this.container.clientWidth || 450;
      fwCanvas.height = this.container.clientHeight || 850;
      const ctx = fwCanvas.getContext('2d');

      this._fwParticles = [];
      const spawnBurst = () => {
        if (!document.getElementById('modal-win').classList.contains('active')) return;
        const bx = 60 + Math.random() * (fwCanvas.width - 120);
        const by = 80 + Math.random() * (fwCanvas.height * 0.45);
        const colors = ['#ffcc18', '#ff3b5c', '#38bdf8', '#4ade80', '#c084fc'];
        const col = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 28; i++) {
          const ang = (i / 28) * Math.PI * 2;
          const spd = 1.5 + Math.random() * 3.5;
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
      this._fwInterval = setInterval(spawnBurst, 650);

      const stepFw = () => {
        if (!document.getElementById('modal-win').classList.contains('active')) return;
        ctx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
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
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
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
          hit.title = 'Unlock Extra Boarding Slot (🪙 40 Coins)';

          const priceTag = document.createElement('div');
          priceTag.className = 'slot-unlock-price';
          priceTag.textContent = '🪙 40';
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
    // BOOSTERS
    // -----------------------------------------------------------------------
    useShuffleBooster() {
      if (this.levelNum < 4) {
        this.spawnFloatingText(0, 6, '🔒 Unlocks at Level 4!', '#ffdf5d');
        sound.playCarBlocked();
        return;
      }
      if (this.lotVehicles.length < 2) return;

      if (this.profile.boosters.shuffle <= 0) {
        if (this.profile.coins >= 60) {
          this.profile.coins -= 60;
          this.profile.boosters.shuffle += 1;
        } else {
          this.spawnFloatingText(0, 6, 'Need 🪙 60 Coins!', '#ff6b6b');
          sound.playCarBlocked();
          return;
        }
      }

      this.profile.boosters.shuffle--;
      sound.playBooster();

      const buses = this.lotVehicles.filter((v) => v.type === 'bus');
      const cars = this.lotVehicles.filter((v) => v.type !== 'bus');

      const shuffleGroupColors = (group) => {
        const colors = group.map((v) => v.color);
        for (let i = colors.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [colors[i], colors[j]] = [colors[j], colors[i]];
        }
        group.forEach((v, idx) => {
          v.color = colors[idx];
          this.vehiclesGroup.remove(v.mesh);
          v.mesh = this.createVehicleMesh(v);
          this.vehiclesGroup.add(v.mesh);
        });
      };

      shuffleGroupColors(buses);
      shuffleGroupColors(cars);

      this.spawnFloatingText(0, 4.5, '🔀 Colors Shuffled!', '#ffdf5d');
      this.updateHUD();
      this.saveGameProgress(true);
    }

    useVipBooster() {
      if (this.levelNum < 8) {
        this.spawnFloatingText(0, 6, '🔒 Unlocks at Level 8!', '#ffdf5d');
        sound.playCarBlocked();
        return;
      }
      if (this.lotVehicles.length === 0) return;
      if (this.slots[0].vehicle || this.slots[0].reserved) {
        this.spawnFloatingText(this.slots[0].x, this.slots[0].z, 'VIP Slot Full!', '#ff6b6b');
        return;
      }

      if (this.profile.boosters.vip <= 0) {
        if (this.profile.coins >= 80) {
          this.profile.coins -= 80;
          this.profile.boosters.vip += 1;
        } else {
          this.spawnFloatingText(0, 6, 'Need 🪙 80 Coins!', '#ff6b6b');
          sound.playCarBlocked();
          return;
        }
      }

      this.activeBoosterMode = 'vip';
      document.getElementById('booster-mode-banner').style.display = 'flex';
      this.updateHUD();
    }

    useMagnetBooster() {
      if (this.levelNum < 13) {
        this.spawnFloatingText(0, 6, '🔒 Unlocks at Level 13!', '#ffdf5d');
        sound.playCarBlocked();
        return;
      }

      const occupiedSlot = this.slots.find((s) => s.vehicle && s.vehicle.cap > 0);
      if (!occupiedSlot) {
        this.spawnFloatingText(0, -3, 'Park a bus in a slot first!', '#ffdf5d');
        return;
      }

      if (this.profile.boosters.magnet <= 0) {
        if (this.profile.coins >= 80) {
          this.profile.coins -= 80;
          this.profile.boosters.magnet += 1;
        } else {
          this.spawnFloatingText(0, 6, 'Need 🪙 80 Coins!', '#ff6b6b');
          sound.playCarBlocked();
          return;
        }
      }

      this.profile.boosters.magnet--;
      sound.playBooster();

      // Swap matching color rows from feeder lanes into the revolving oval ring!
      const targetColor = occupiedSlot.vehicle.color;
      for (let k = 0; k < RING_SLOT_COUNT; k++) {
        const ringRow = this.ovalRingSlots[k];
        if (ringRow && ringRow.color !== targetColor) {
          const matchLeftIdx = this.leftFeederRows.findIndex((r) => r.color === targetColor);
          if (matchLeftIdx !== -1) {
            const temp = this.ovalRingSlots[k];
            this.ovalRingSlots[k] = this.leftFeederRows[matchLeftIdx];
            this.leftFeederRows[matchLeftIdx] = temp;
            continue;
          }
          const matchRightIdx = this.rightFeederRows.findIndex((r) => r.color === targetColor);
          if (matchRightIdx !== -1) {
            const temp = this.ovalRingSlots[k];
            this.ovalRingSlots[k] = this.rightFeederRows[matchRightIdx];
            this.rightFeederRows[matchRightIdx] = temp;
          }
        }
      }

      this.spawnFloatingText(occupiedSlot.x, occupiedSlot.z, '🧲 Crowd Sorted!', '#5ce68b');
      this.updateHUD();
      this.saveGameProgress(true);
    }

    // -----------------------------------------------------------------------
    // MAIN 60FPS ANIMATION LOOP
    // -----------------------------------------------------------------------
    animate(now) {
      requestAnimationFrame(this.animate);
      const dt = Math.min((now - this.lastFrameTime) / 1000, 0.08);
      this.lastFrameTime = now;

      // 1. Update vehicles driving from parking lot into Boarding Slots + Exhaust Smoke
      for (let i = this.movingVehicles.length - 1; i >= 0; i--) {
        const mv = this.movingVehicles[i];
        mv.smokeTimer = (mv.smokeTimer || 0) - dt;
        if (mv.smokeTimer <= 0) {
          mv.smokeTimer = 0.075;
          this.spawnExhaustSmoke(mv.mesh.position.x, mv.mesh.position.z);
        }

        const target = mv.waypoints[mv.wpIndex];
        const dx = target.x - mv.mesh.position.x;
        const dy = (target.y || 0) - mv.mesh.position.y;
        const dz = target.z - mv.mesh.position.z;
        const dist = Math.hypot(dx, dy, dz);

        if (dist < 0.38) {
          mv.mesh.position.set(target.x, target.y || 0, target.z);
          mv.wpIndex++;
          if (mv.wpIndex >= mv.waypoints.length) {
            mv.mesh.position.set(mv.targetSlot.x, 0, mv.targetSlot.z);
            mv.mesh.rotation.y = mv.targetSlot.tilt;
            mv.targetSlot.vehicle = mv;
            mv.targetSlot.reserved = false;
            this.movingVehicles.splice(i, 1);
            this.updateSlotOverlays();
            this.saveGameProgress(false);
          }
        } else {
          const step = mv.speed * dt;
          mv.mesh.position.x += (dx / dist) * step;
          mv.mesh.position.y += (dy / dist) * step;
          mv.mesh.position.z += (dz / dist) * step;
          if (Math.hypot(dx, dz) > 0.05) {
            mv.mesh.rotation.y = Math.atan2(-dx, -dz);
          }
        }
      }

      // 1B. Update Level Countdown Timer (when game is active and no modal is open)
      if (!this.isLevelOver && this._splashStarted && !window.BFP_PORTAL_ACTIVE && this.levelIntroRushProgress >= 1) {
        if (!this.isAnyModalOpen()) {
          this.levelTimeLeft = Math.max(0, this.levelTimeLeft - dt);
          this.updateTimerDisplayOnly();
          if (this.levelTimeLeft <= 10 && this.levelTimeLeft > 0) {
            const sec = Math.ceil(this.levelTimeLeft);
            if (sec !== this._lastUrgentSecond) {
              this._lastUrgentSecond = sec;
              sound.playTone(680, 'sine', 0.05, 0.08);
            }
          }
          if (this.levelTimeLeft <= 0) {
            this.isLevelOver = true;
            this.failReason = 'timeout';
            sound.playFailAlert();
            const fTitle = document.getElementById('fail-modal-title');
            const fSub = document.getElementById('fail-modal-subtitle');
            const btnSlot = document.getElementById('btn-revive-slot');
            const btnFree = document.getElementById('btn-revive-free');
            if (fTitle) fTitle.textContent = "⏰ Time's Up!";
            if (fSub) fSub.textContent = 'Time ran out before all passengers boarded the buses!';
            if (btnSlot) btnSlot.textContent = '⏱️ +45s Extra Time & Clear 1 Bus (🪙 40)';
            if (btnFree) btnFree.textContent = '🎁 +30s Bonus Time (Free)';
            document.getElementById('modal-fail').classList.add('active');
          }
        }
      }

      // 2. Continuously revolve Central Oval Ring & update Feeder Lanes
      this.updateRevolvingLoopAndFeederMeshes(dt, now);

      // 3. Board matching passengers at the bottom gate of the revolving oval
      this.updateBoardingFromRevolvingLoop(dt);

      // 4. Periodic cute passenger emoji bubble
      this.emojiCooldown -= dt;
      if (this.emojiCooldown <= 0 && !this.isLevelOver) {
        this.emojiCooldown = 3.5 + Math.random() * 2.5;
        this.spawnRandomPassengerEmoji();
      }

      // 5. Animate jumping passengers sprinting into parked buses
      for (let i = this.jumpingPassengers.length - 1; i >= 0; i--) {
        const jp = this.jumpingPassengers[i];
        jp.progress += dt * 6.4;
        if (jp.progress >= 1) {
          this.passengersGroup.remove(jp.mesh);
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
              this.departingVehicles.push({
                mesh: departingBus.mesh,
                smokeTimer: 0,
                speed: 36
              });
              this.updateSlotOverlays();
              this.saveGameProgress(true);
            }
          }
        } else {
          const t = jp.progress;
          jp.mesh.position.x = jp.startX + (jp.endX - jp.startX) * t;
          jp.mesh.position.z = jp.startZ + (jp.endZ - jp.startZ) * t;
          jp.mesh.position.y = Math.sin(t * Math.PI) * 1.1;
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

      // 6. Update departing full buses driving off to the right with smoke puffs
      for (let i = this.departingVehicles.length - 1; i >= 0; i--) {
        const dv = this.departingVehicles[i];
        dv.mesh.rotation.y = -Math.PI / 2;
        dv.mesh.position.x += dv.speed * dt;
        dv.smokeTimer -= dt;
        if (dv.smokeTimer <= 0) {
          dv.smokeTimer = 0.08;
          this.spawnExhaustSmoke(dv.mesh.position.x - 1.0, dv.mesh.position.z);
        }
        if (dv.mesh.position.x > 11) {
          this.vehiclesGroup.remove(dv.mesh);
          this.departingVehicles.splice(i, 1);
          this.checkLevelWinCondition();
        }
      }

      // 7. Animate exhaust smoke puffs
      for (let i = this.smokePuffs.length - 1; i >= 0; i--) {
        const sp = this.smokePuffs[i];
        sp.scale += dt * 3.2;
        sp.opacity -= dt * 2.1;
        sp.mesh.position.y += dt * 0.8;
        if (sp.opacity <= 0) {
          this.fxGroup.remove(sp.mesh);
          this.smokePuffs.splice(i, 1);
        } else {
          sp.mesh.scale.set(sp.scale, sp.scale, sp.scale);
          sp.mesh.material.opacity = sp.opacity;
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
      if (!this._modalEls) {
        this._modalEls = [
          document.getElementById('modal-pause'),
          document.getElementById('modal-spin'),
          document.getElementById('modal-win'),
          document.getElementById('modal-fail'),
          document.getElementById('modal-rate')
        ].filter(Boolean);
      }
      for (let i = 0; i < this._modalEls.length; i++) {
        if (this._modalEls[i].classList.contains('active')) return true;
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
      document.getElementById('level-title-text').textContent = `Level ${this.levelNum}`;
      this._lastShownTimerSec = -1;
      this.updateTimerDisplayOnly();
      document.getElementById('coin-count-text').textContent = `${this.profile.coins}`;
      this._lastShownPassCount = -1;
      this.updatePassengerCountOnly();

      const hudNameEl = document.getElementById('hud-player-name');
      if (hudNameEl) {
        const pName = this.profile.playerName || localStorage.getItem('BFP_PLAYER_NAME') || 'Player';
        const label = `👤 ${pName}`;
        if (hudNameEl.textContent !== label) hudNameEl.textContent = label;
      }

      this.renderBoosterCard(
        'shuffle',
        4,
        '🔀',
        'Shuffle',
        '🪙 60',
        this.profile.boosters.shuffle
      );
      this.renderBoosterCard(
        'vip',
        8,
        '🚁',
        'VIP Pick',
        '🪙 80',
        this.profile.boosters.vip
      );
      this.renderBoosterCard(
        'magnet',
        13,
        '🧲',
        'Magnet',
        '🪙 80',
        this.profile.boosters.magnet
      );

      const spinBadge = document.getElementById('spin-badge');
      if (spinBadge) {
        spinBadge.textContent = this.profile.freeSpins > 0 ? this.profile.freeSpins : '!';
      }
    }

    renderBoosterCard(key, unlockLvl, emojiIcon, unlockedTitle, priceSub, count) {
      const iconEl = document.getElementById(`booster-${key}-icon`);
      const labelEl = document.getElementById(`booster-${key}-label`);
      const subEl = document.getElementById(`booster-${key}-sub`);
      const countEl = document.getElementById(`booster-${key}-count`);

      const isLocked = this.levelNum < unlockLvl;
      const iconKey = isLocked ? 'locked' : 'unlocked';

      if (iconEl.dataset.iconState !== iconKey) {
        iconEl.dataset.iconState = iconKey;
        iconEl.innerHTML = isLocked ? PADLOCK_SVG : `<span style="font-size:28px;">${emojiIcon}</span>`;
      }

      if (isLocked) {
        labelEl.textContent = `Level ${unlockLvl}`;
        subEl.textContent = '';
        countEl.style.display = 'none';
      } else {
        labelEl.textContent = unlockedTitle;
        subEl.textContent = count > 0 ? 'FREE' : priceSub;
        countEl.style.display = 'flex';
        countEl.textContent = `${count}`;
      }
    }

    syncSettingsButtons() {
      const sfxBtn = document.getElementById('toggle-sfx');
      const musBtn = document.getElementById('toggle-music');
      if (sfxBtn) {
        sfxBtn.textContent = sound.sfxEnabled ? 'ON' : 'OFF';
        sfxBtn.className = `toggle-btn ${sound.sfxEnabled ? 'on' : 'off'}`;
      }
      if (musBtn) {
        musBtn.textContent = sound.musicEnabled ? 'ON' : 'OFF';
        musBtn.className = `toggle-btn ${sound.musicEnabled ? 'on' : 'off'}`;
      }
    }

    populateLevelMap() {
      const grid = document.getElementById('level-grid-container');
      if (!grid) return;
      grid.innerHTML = '';

      for (let lvl = 1; lvl <= 1000; lvl++) {
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

    drawLuckySpinWheel() {
      const canvas = document.getElementById('spin-wheel-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = cx - 8;

      this.wheelSlices = [
        { label: '+150 🪙', color: '#f59e0b', type: 'coins', amount: 150 },
        { label: '+1 VIP 🚁', color: '#3b82f6', type: 'vip', amount: 1 },
        { label: '+80 🪙', color: '#ef4444', type: 'coins', amount: 80 },
        { label: '+1 Shuffle', color: '#10b981', type: 'shuffle', amount: 1 },
        { label: '+300 🪙', color: '#8b5cf6', type: 'coins', amount: 300 },
        { label: '+1 Magnet', color: '#ec4899', type: 'magnet', amount: 1 },
        { label: '+100 🪙', color: '#f97316', type: 'coins', amount: 100 },
        { label: 'JACKPOT 500', color: '#eab308', type: 'coins', amount: 500 }
      ];

      const arc = (Math.PI * 2) / this.wheelSlices.length;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.wheelSlices.forEach((slice, i) => {
        const startAngle = i * arc - Math.PI / 2;
        const endAngle = startAngle + arc;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = slice.color;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 13px "Segoe UI", Arial';
        ctx.fillText(slice.label, r - 14, 5);
        ctx.restore();
      });

      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#fde047';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#b45309';
      ctx.stroke();
    }

    spinLuckyWheel() {
      if (this._isSpinning) return;
      if (this.profile.freeSpins <= 0 && this.profile.coins < 50) {
        document.getElementById('spin-result-text').textContent = 'Need 50 Coins to spin!';
        return;
      }

      if (this.profile.freeSpins > 0) {
        this.profile.freeSpins--;
      } else {
        this.profile.coins -= 50;
      }
      this.updateHUD();

      this._isSpinning = true;
      sound.playBooster();

      const sliceIdx = Math.floor(Math.random() * this.wheelSlices.length);
      const sliceDeg = 360 / this.wheelSlices.length;
      const targetDeg = 360 * 5 + (360 - sliceIdx * sliceDeg - sliceDeg / 2);

      const canvas = document.getElementById('spin-wheel-canvas');
      canvas.style.transition = 'none';
      canvas.style.transform = 'rotate(0deg)';
      void canvas.offsetWidth;
      canvas.style.transition = 'transform 3.2s cubic-bezier(0.15, 0.88, 0.22, 1)';
      canvas.style.transform = `rotate(${targetDeg}deg)`;

      setTimeout(() => {
        this._isSpinning = false;
        const won = this.wheelSlices[sliceIdx];
        if (won.type === 'coins') this.profile.coins += won.amount;
        else if (won.type === 'vip') this.profile.boosters.vip += won.amount;
        else if (won.type === 'shuffle') this.profile.boosters.shuffle += won.amount;
        else if (won.type === 'magnet') this.profile.boosters.magnet += won.amount;

        sound.playWinFanfare();
        document.getElementById('spin-result-text').textContent = `🎉 You Won: ${won.label}!`;
        document.getElementById('btn-do-spin').textContent =
          this.profile.freeSpins > 0
            ? `🎰 SPIN AGAIN (${this.profile.freeSpins} FREE)`
            : '🎰 SPIN (🪙 50 Coins)';
        this.updateHUD();
        this.saveGameProgress(true);
      }, 3300);
    }

    // -----------------------------------------------------------------------
    // BIND ALL UI BUTTONS
    // -----------------------------------------------------------------------
    bindUIEvents() {
      this.canvas.addEventListener('pointerdown', (e) => this.onCanvasPointerDown(e));

      document.getElementById('btn-restart').addEventListener('click', () => {
        sound.playCarStart();
        this.loadLevel(this.levelNum);
      });

      document.getElementById('btn-pause').addEventListener('click', () => {
        document.getElementById('pause-stats-line').textContent =
          `Level ${this.levelNum} • Auto-Save Active`;
        document.getElementById('modal-pause').classList.add('active');
      });

      const openSpin = () => {
        document.getElementById('btn-do-spin').textContent =
          this.profile.freeSpins > 0
            ? `🎰 SPIN NOW (${this.profile.freeSpins} FREE!)`
            : '🎰 SPIN (🪙 50 Coins)';
        document.getElementById('modal-spin').classList.add('active');
      };
      document.getElementById('btn-lucky-spin').addEventListener('click', openSpin);
      document.getElementById('btn-open-spin-top').addEventListener('click', openSpin);
      document.getElementById('btn-do-spin').addEventListener('click', () => this.spinLuckyWheel());
      document.getElementById('btn-close-spin').addEventListener('click', () => {
        document.getElementById('modal-spin').classList.remove('active');
      });

      // Boosters
      document.getElementById('booster-shuffle').addEventListener('click', () => this.useShuffleBooster());
      document.getElementById('booster-vip').addEventListener('click', () => this.useVipBooster());
      document.getElementById('booster-magnet').addEventListener('click', () => this.useMagnetBooster());

      document.getElementById('btn-cancel-booster').addEventListener('click', () => {
        this.activeBoosterMode = null;
        document.getElementById('booster-mode-banner').style.display = 'none';
      });

      // "Having Fun?" Rating Modal (Video 01:22)
      const closeRateToWin = () => {
        document.getElementById('modal-rate').classList.remove('active');
        this.openWinScreenWithFireworks();
      };
      document.getElementById('btn-close-rate').addEventListener('click', closeRateToWin);
      document.getElementById('btn-rate-up').addEventListener('click', closeRateToWin);
      document.getElementById('btn-rate-down').addEventListener('click', closeRateToWin);

      // Win Modal
      document.getElementById('btn-next-level').addEventListener('click', () => {
        document.getElementById('modal-win').classList.remove('active');
        this.loadLevel(this.levelNum + 1);
      });
      document.getElementById('btn-win-spin').addEventListener('click', () => {
        document.getElementById('modal-win').classList.remove('active');
        this.profile.freeSpins += 1;
        this.loadLevel(this.levelNum + 1);
        openSpin();
      });

      // Fail / Revive Modal (handles both All Slots Full and Time's Up!)
      document.getElementById('btn-revive-slot').addEventListener('click', () => {
        if (this.profile.coins < 40) {
          this.profile.coins = 40;
        }
        this.profile.coins -= 40;
        if (this.failReason === 'timeout' || this.levelTimeLeft <= 10) {
          this.levelTimeLeft += 60;
        }
        const lockedPlus = this.slots.find((s) => s.type === 'plus' && !s.unlocked);
        if (lockedPlus) {
          lockedPlus.unlocked = true;
          lockedPlus.borderMesh.material.color.setHex(0xdbe2f0);
          if (lockedPlus.decalMesh) lockedPlus.decalMesh.visible = false;
        }
        this.emergencyClearOneSlot();
        document.getElementById('modal-fail').classList.remove('active');
        this.isLevelOver = false;
        this.updateSlotOverlays();
        this.updateHUD();
        this.saveGameProgress(true);
      });

      document.getElementById('btn-revive-free').addEventListener('click', () => {
        if (this.failReason === 'timeout' || this.levelTimeLeft <= 10) {
          this.levelTimeLeft += 45;
        } else {
          this.emergencyClearOneSlot();
        }
        document.getElementById('modal-fail').classList.remove('active');
        this.isLevelOver = false;
        this.updateSlotOverlays();
        this.updateHUD();
        this.saveGameProgress(true);
      });

      document.getElementById('btn-fail-retry').addEventListener('click', () => {
        document.getElementById('modal-fail').classList.remove('active');
        this.loadLevel(this.levelNum);
      });

      // Pause Modal
      document.getElementById('btn-close-pause').addEventListener('click', () => {
        document.getElementById('modal-pause').classList.remove('active');
      });
      document.getElementById('btn-resume').addEventListener('click', () => {
        document.getElementById('modal-pause').classList.remove('active');
      });
      document.getElementById('btn-pause-restart').addEventListener('click', () => {
        document.getElementById('modal-pause').classList.remove('active');
        this.loadLevel(this.levelNum);
      });

      // Sound & Music Toggles
      document.getElementById('toggle-sfx').addEventListener('click', () => {
        sound.sfxEnabled = !sound.sfxEnabled;
        this.profile.sfx = sound.sfxEnabled;
        this.syncSettingsButtons();
        this.saveGameProgress(false);
      });
      document.getElementById('toggle-music').addEventListener('click', () => {
        sound.musicEnabled = !sound.musicEnabled;
        this.profile.music = sound.musicEnabled;
        if (sound.musicEnabled) sound.startMusic();
        else sound.stopMusic();
        this.syncSettingsButtons();
        this.saveGameProgress(false);
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
      this.departingVehicles.push({
        mesh: bus.mesh,
        smokeTimer: 0,
        speed: 28
      });
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.busFeverGame = new BusFeverGame();
  });
})();
