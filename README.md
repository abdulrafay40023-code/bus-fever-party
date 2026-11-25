# 🚌 Bus Fever Party 3D (Complete 5,000-Level Edition — v70)

**Live Production App:** [https://bus-fever-party-3d.vercel.app](https://bus-fever-party-3d.vercel.app)

## ✨ Key Game Features
- **5,000 Progressively Challenging Solvable Levels**: Built with an exact **2D Separating Axis Theorem (SAT) Oriented Bounding Box (OBB) Spacing Enforcer** so buses, vans, and cars always have clean visual breathing space and never overlap or touch.
- **6 Rotating Pixar 3D Park Architecture Themes (`level_architecture_3d.glb` & `level_arch_atlas_hd.png`)**:
  1. Marble Star Water Fountain Plaza
  2. Tropical Coconut Palm Oasis
  3. Japanese Sakura Cherry Blossom & Torii Garden
  4. Royal Fairytale Castle Gazebo Courtyard
  5. Carnival Starlight Carousel Pavilion
  6. Royal Rose Botanical Parterre Garden
- **7 Competitive Rank Tiers (`ranks_3d.glb` & `ranks_atlas_hd.png`)**:
  - `Bronze` (Lv. 1–24), `Silver` (Lv. 25–74), `Gold` (Lv. 75–199), `Platinum` (Lv. 200–499), `Diamond` (Lv. 500–1499), `Crown` (Lv. 1500–4999), and **`Ace Legend`** (Lv. 5000 Jackpot: +50,000 Coins & +50 All Boosters!).
- **100 Custom Character Profile Pictures (`avatars_100_3d.glb` & `avatars_100_atlas.jpg`)**:
  - Unlocking strictly every **50 Levels** (`Lv. 50, 100, 150, ..., 5000`), including the special ornate 3D RPG frames on the final 10 legendary avatars (`Lv. 4550` – `Lv. 5000`), plus direct **Real Photo Upload** from Phone / PC Gallery.
- **3D Celebration Reward Popup (`#modal-reward-popup`)**:
  - Pops up whenever a new 50-Level Character Profile Picture, Rank Promotion, or Milestone Level Prize is unlocked.
- **Live Game Inventory & 10 Daily Rewarded Ad Spins**:
  - Full inventory tracking Gold Coins, VIP Helicopter, Color Shuffle, Super Magnet, Daily Free Spins (`10/10` resetting strictly every 24 hours), Current Rank, Profile Pictures, and Milestone Gifts.

## 📂 Folder Structure
- `index.html` — Main HTML5 WebGL / Canvas 2D Game Shell
- `game.js` — Complete 3D Game Engine, 5,000-Level Generator, Physics, Audio Synthesizer & UI Controller
- `styles.css` — 3D Glossy Mobile & Desktop Responsive UI Stylesheet
- `three.min.js` — Bundled Three.js 3D WebGL Engine
- `build_standalone.js` — Node.js Builder for Single-File Offline HTML (`Bus-Fever-Party.html`)
- `Organized_Assets/`
  - `1_3D_GLB_Models/` — All Binary glTF 2.0 (`.glb`) 3D Models (`ranks_3d.glb`, `avatars_100_3d.glb`, `level_architecture_3d.glb`, `home_bus_3d.glb`, `home_girl_3d.glb`, etc.)
  - `2_Rank_Icons_3D/` — Custom Transparent 3D Rank Emblems (`rank_bronze.png` – `rank_ace.png` & `ranks_atlas_hd.png`)
  - `3_100_Character_Profile_Pics/` — 100 Character Profile Pictures HD Atlas (`avatars_100_atlas.jpg` & `avatars_100_3d.glb`)
  - `4_Playable_Builds_APK_EXE_HTML/` — Ready-to-play standalone offline `Bus-Fever-Party.html`, Windows Desktop `Bus-Fever-Party.exe`, and Android `Bus-Fever-Party.apk`
