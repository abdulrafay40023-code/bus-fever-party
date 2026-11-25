const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

function toDataUrl(filePath, mime) {
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

const iconDataUrl = toDataUrl(path.join(distDir, 'icon_192.png'), 'image/png');
const loadingBgDataUrl = toDataUrl(path.join(distDir, 'loading_bg.jpg'), 'image/jpeg');
const homeCityBgDataUrl = toDataUrl(path.join(distDir, 'home_city_bg.jpg'), 'image/jpeg');
const homeNewBgDataUrl = toDataUrl(path.join(distDir, 'home_new_bg_hd.jpg'), 'image/jpeg');
const greatJobDataUrl = toDataUrl(path.join(distDir, 'great_job_banner.png'), 'image/png');
const ranksAtlasDataUrl = toDataUrl(path.join(distDir, 'ranks_atlas_hd.png'), 'image/png');
const avatars100AtlasDataUrl = toDataUrl(path.join(distDir, 'avatars_100_atlas.jpg'), 'image/jpeg');
const levelArchAtlasDataUrl = toDataUrl(path.join(distDir, 'level_arch_atlas_hd.png'), 'image/png');

let css = fs.readFileSync(path.join(distDir, 'styles.css'), 'utf8');
css = css.replace(/url\(['"]?loading_bg\.jpg(?:\?v=\d+)?['"]?\)/g, `url('${loadingBgDataUrl}')`);
css = css.replace(/url\(['"]?home_city_bg\.jpg(?:\?v=\d+)?['"]?\)/g, `url('${homeCityBgDataUrl}')`);
css = css.replace(/url\(['"]?home_new_bg_hd\.jpg(?:\?v=\d+)?['"]?\)/g, `url('${homeNewBgDataUrl}')`);
css = css.replace(/url\(['"]?ranks_atlas_hd\.png(?:\?v=\d+)?['"]?\)/g, `url('${ranksAtlasDataUrl}')`);
css = css.replace(/url\(['"]?avatars_100_atlas\.jpg(?:\?v=\d+)?['"]?\)/g, `url('${avatars100AtlasDataUrl}')`);
css = css.replace(/url\(['"]?level_arch_atlas_hd\.png(?:\?v=\d+)?['"]?\)/g, `url('${levelArchAtlasDataUrl}')`);

const threeJs = fs.readFileSync(path.join(distDir, 'three.min.js'), 'utf8');
let gameJs = fs.readFileSync(path.join(distDir, 'game.js'), 'utf8');

const inlineGameAssets = [
  ['loading_bg.jpg', 'image/jpeg'],
  ['home_new_bg_hd.jpg', 'image/jpeg'],
  ['home_skyline_fg_hd.png', 'image/png'],
  ['home_spots_atlas_hd.jpg', 'image/jpeg'],
  ['home_girl_hd.png', 'image/png'],
  ['home_spin_wheel_hd.png', 'image/png'],
  ['home_spin_overlay_hd.png', 'image/png'],
  ['home_play_btn_hd.png', 'image/png'],
  ['win_girl_clean_3d.png', 'image/png'],
  ['win_banner_text_3d.png', 'image/png'],
  ['win_coins_3d.png', 'image/png'],
  ['ranks_atlas_hd.png', 'image/png'],
  ['avatars_100_atlas.jpg', 'image/jpeg']
];
inlineGameAssets.forEach(([fn, mime]) => {
  const fp = path.join(distDir, fn);
  if (fs.existsSync(fp)) {
    const du = toDataUrl(fp, mime);
    const re = new RegExp(`'${fn.replace('.', '\\.')}(?:\\?v=\\d+)?'`, 'g');
    gameJs = gameJs.replace(re, `'${du}'`);
  }
});

let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// Replace external assets with inline data URLs and scripts for 100% standalone 1-file offline play
html = html.replace(/href="icon_192\.png"/g, `href="${iconDataUrl}"`);
html = html.replace(/src="icon_192\.png"/g, `src="${iconDataUrl}"`);
html = html.replace(/href="bus_fever_hd\.ico"/g, `href="${iconDataUrl}"`);
html = html.replace(/src="great_job_banner\.png(?:\?v=\d+)?"/g, `src="${greatJobDataUrl}"`);

const home3dPngs = [
  'home_avatar_3d.png',
  'home_coin_pill_3d.png',
  'home_gear_3d.png',
  'home_supplies_3d.png',
  'home_spin_3d.png',
  'home_spin_fg_3d.png',
  'home_cloud_3d.png',
  'home_bus_3d.png',
  'home_play_3d.png',
  'home_bottom_bar.png'
];
home3dPngs.forEach((fn) => {
  const fp = path.join(distDir, fn);
  if (fs.existsSync(fp)) {
    const du = toDataUrl(fp, 'image/png');
    const re = new RegExp(`src="${fn.replace('.', '\\.')}(?:\\?v=\\d+)?"`, 'g');
    html = html.replace(re, `src="${du}"`);
  }
});
html = html.replace(/<link rel="stylesheet" href="styles\.css(?:\?v=\d+)?"\s*\/?>/, `<style>\n${css}\n</style>`);
html = html.replace(
  /<script src="three\.min\.js"><\/script>[\s\S]*?<script src="game\.js(?:\?v=\d+)?"><\/script>/,
  `<script>window.BFP_STANDALONE = true;</script>\n<script>\n${threeJs}\n</script>\n<script>\n${gameJs}\n</script>`
);

const outStandalone = path.join(distDir, 'Bus-Fever-Party.html');
fs.writeFileSync(outStandalone, html, 'utf8');
console.log('Created standalone offline game file:', outStandalone, (fs.statSync(outStandalone).size / 1024).toFixed(1) + ' KB');

const desktopStandalone = 'C:\\Users\\Rafay\\Desktop\\BusFeverParty_PlayNow.html';
try {
  fs.writeFileSync(desktopStandalone, html, 'utf8');
  console.log('Updated Desktop standalone file:', desktopStandalone);
} catch (e) {}

const desktopExe = 'C:\\Users\\Rafay\\Desktop\\Bus Fever Party.exe';
if (fs.existsSync(desktopExe)) {
  fs.copyFileSync(desktopExe, path.join(distDir, 'Bus-Fever-Party.exe'));
  console.log('Copied Bus-Fever-Party.exe to dist/');
}
