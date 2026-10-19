#!/usr/bin/env node

const { chromium } = require('playwright');
const { spawnSync } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

const WORK_DIR = path.join(process.cwd(), '.studio_temp');
const OUT_DIR = path.join(process.cwd(), 'output');

const clr = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  purple: '\x1b[38;5;141m',
  neon: '\x1b[38;5;84m',
  white: '\x1b[38;5;255m',
  gray: '\x1b[38;5;244m',
  red: '\x1b[38;5;196m'
};

const ask = (rl, query) => new Promise((resolve) => rl.question(query, resolve));

const clearScreen = () => {
  process.stdout.write('\x1b[2J\x1b[3J\x1b[H');
};

const printUI = () => {
  clearScreen();
  console.log(`${clr.purple}────────────────────────────────────────────────────────────────────────${clr.reset}`);
  console.log(`  ${clr.neon}●${clr.reset} ${clr.bold}${clr.purple}SHOWCASE STUDIO ENGINE${clr.reset}                        ${clr.gray}[ULTRA V6.0]${clr.reset}`);
  console.log(`${clr.purple}────────────────────────────────────────────────────────────────────────${clr.reset}\n`);
};

const checkFFmpeg = () => {
  try {
    const res = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return res.status === 0;
  } catch (e) {
    return false;
  }
};

(async () => {
  printUI();

  if (!checkFFmpeg()) {
    console.log(`  ${clr.red}✖ Error: FFmpeg is not installed or not found in system PATH.${clr.reset}`);
    console.log(`  ${clr.gray}Please install FFmpeg and make sure it is added to your environment variables.${clr.reset}\n`);
    process.exit(1);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const urlInput = await ask(rl, `  ${clr.purple}URL ${clr.gray}(Enter for http://localhost:3000):${clr.reset} `);
  const TARGET_URL = urlInput.trim() || 'http://localhost:3000';

  printUI();
  console.log(`  ${clr.neon}✔ Target:${clr.reset} ${clr.white}${TARGET_URL}${clr.reset}\n`);
  const nameInput = await ask(rl, `  ${clr.purple}File Name ${clr.gray}(Enter for default):${clr.reset} `);
  const rawBaseName = nameInput.trim().replace(/[^a-zA-Z0-9_-]/g, '_');

  printUI();
  console.log(`  ${clr.neon}✔ Target:${clr.reset}    ${clr.white}${TARGET_URL}${clr.reset}`);
  console.log(`  ${clr.neon}✔ File Name:${clr.reset} ${clr.white}${rawBaseName || 'Auto'}${clr.reset}\n`);
  const brandInput = await ask(rl, `  ${clr.purple}Bottom Brand Text ${clr.gray}(Leave empty for none):${clr.reset} `);
  const BRAND_TEXT = brandInput.trim();

  printUI();
  console.log(`  ${clr.neon}✔ Target:${clr.reset}    ${clr.white}${TARGET_URL}${clr.reset}`);
  console.log(`  ${clr.neon}✔ File Name:${clr.reset} ${clr.white}${rawBaseName || 'Auto'}${clr.reset}`);
  console.log(`  ${clr.neon}✔ Brand:${clr.reset}     ${clr.white}${BRAND_TEXT || 'None'}${clr.reset}\n`);
  const durInput = await ask(rl, `  ${clr.purple}Duration in seconds ${clr.gray}(Default: 15s | 10-30):${clr.reset} `);
  let parsedSec = parseInt(durInput.trim(), 10);
  if (isNaN(parsedSec) || parsedSec < 10) parsedSec = 15;
  if (parsedSec > 30) parsedSec = 30;
  const TOTAL_DURATION_SEC = parsedSec;

  printUI();
  console.log(`  ${clr.neon}✔ Target:${clr.reset}    ${clr.white}${TARGET_URL}${clr.reset}`);
  console.log(`  ${clr.neon}✔ Brand:${clr.reset}     ${clr.white}${BRAND_TEXT || 'None'}${clr.reset}`);
  console.log(`  ${clr.neon}✔ Duration:${clr.reset}  ${clr.white}${TOTAL_DURATION_SEC}s${clr.reset}\n`);
  console.log(`  ${clr.bold}${clr.purple}[ SHOWCASE TEMPLATE STYLE ]${clr.reset}`);
  console.log(`  ${clr.neon}1${clr.reset} ─ Realistic MacBook Pro   ${clr.gray}(Front view, keyboard base)${clr.reset}`);
  console.log(`  ${clr.neon}2${clr.reset} ─ 3D Dual Combo Studio    ${clr.gray}(Tilted Big MacBook + Floating iPhone beside it)${clr.reset}\n`);
  const styleChoice = await ask(rl, `  ${clr.purple}Select Style [1-2]:${clr.reset} `);
  const styleMode = styleChoice.trim() === '2' ? 'combo3d' : 'macbook';

  printUI();
  console.log(`  ${clr.neon}✔ Target:${clr.reset}    ${clr.white}${TARGET_URL}${clr.reset}`);
  console.log(`  ${clr.neon}✔ Brand:${clr.reset}     ${clr.white}${BRAND_TEXT || 'None'}${clr.reset}`);
  console.log(`  ${clr.neon}✔ Duration:${clr.reset}  ${clr.white}${TOTAL_DURATION_SEC}s${clr.reset}`);
  console.log(`  ${clr.neon}✔ Style:${clr.reset}     ${clr.white}${styleMode.toUpperCase()}${clr.reset}\n`);
  console.log(`  ${clr.bold}${clr.purple}[ OUTPUT ASPECT RATIO ]${clr.reset}`);
  console.log(`  ${clr.neon}1${clr.reset} ─ 9:16 Vertical   ${clr.gray}(Instagram Story, Reels, Shorts)${clr.reset}`);
  console.log(`  ${clr.neon}2${clr.reset} ─ 16:9 Landscape  ${clr.gray}(YouTube, Web, Desktop)${clr.reset}`);
  console.log(`  ${clr.neon}3${clr.reset} ─ 3:4  Portrait   ${clr.gray}(Instagram Feed Post)${clr.reset}\n`);
  const ratioChoice = await ask(rl, `  ${clr.purple}Select Ratio [1-3]:${clr.reset} `);
  const rMode = ratioChoice.trim() || '1';

  let stageW = 1080, stageH = 1920, ratioLabel = '9x16_Vertical';
  if (rMode === '2') { stageW = 1920; stageH = 1080; ratioLabel = '16x9_Landscape'; }
  else if (rMode === '3') { stageW = 1080; stageH = 1440; ratioLabel = '3x4_Portrait'; }

  printUI();
  console.log(`  ${clr.neon}✔ Target:${clr.reset}    ${clr.white}${TARGET_URL}${clr.reset}`);
  console.log(`  ${clr.neon}✔ Brand:${clr.reset}     ${clr.white}${BRAND_TEXT || 'None'}${clr.reset}`);
  console.log(`  ${clr.neon}✔ Settings:${clr.reset}  ${styleMode.toUpperCase()} | ${ratioLabel} | ${TOTAL_DURATION_SEC}s\n`);
  console.log(`  ${clr.bold}${clr.purple}[ OUTPUT QUALITY & FILE SIZE ]${clr.reset}`);
  console.log(`  ${clr.neon}1${clr.reset} ─ Ultra 4K Quality ${clr.gray}(Master Bitrate - CRF 16)${clr.reset}`);
  console.log(`  ${clr.neon}2${clr.reset} ─ Lightweight      ${clr.gray}(Compressed for Telegram/Instagram - CRF 26)${clr.reset}\n`);
  const qualChoice = await ask(rl, `  ${clr.purple}Select Quality [1-2]:${clr.reset} `);
  rl.close();

  const isLow = qualChoice.trim() === '2';
  const crfValue = isLow ? '26' : '16';
  const presetSpeed = isLow ? 'fast' : 'slow';

  printUI();
  console.log(`  ${clr.neon}🚀 Starting recording pipeline...${clr.reset}\n`);

  if (fs.existsSync(WORK_DIR)) fs.rmSync(WORK_DIR, { recursive: true, force: true });
  fs.mkdirSync(WORK_DIR, { recursive: true });
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-gpu', '--use-gl=angle', '--enable-webgl', '--no-sandbox']
  });

  const recordSite = async (vw, vh, isMob, outFile) => {
    const ctx = await browser.newContext({
      viewport: { width: vw, height: vh },
      isMobile: isMob,
      hasTouch: isMob,
      deviceScaleFactor: 1,
      recordVideo: { dir: WORK_DIR, size: { width: vw, height: vh } }
    });
    const p = await ctx.newPage();
    try {
      await p.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
    } catch (err) {
      await ctx.close();
      await browser.close();
      if (fs.existsSync(WORK_DIR)) fs.rmSync(WORK_DIR, { recursive: true, force: true });
      printUI();
      console.log(`  ${clr.red}✖ Failed to load URL: ${TARGET_URL}${clr.reset}`);
      console.log(`  ${clr.gray}Details: ${err.message}${clr.reset}\n`);
      process.exit(1);
    }

    await p.addStyleTag({
      content: `::-webkit-scrollbar{display:none!important;}*{scrollbar-width:none!important;}`
    });

    await p.evaluate(async (totalSec) => {
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      await sleep(1500);

      const getMaxY = () => Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      ) - window.innerHeight;

      const targetY = Math.max(0, getMaxY());
      const scrollMs = Math.max(2000, (totalSec - 3) * 1000);

      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      if (targetY > 0) {
        await new Promise(resolve => {
          const start = performance.now();
          function frame(now) {
            const p = Math.min((now - start) / scrollMs, 1);
            window.scrollTo(0, targetY * easeInOutCubic(p));
            if (p < 1) requestAnimationFrame(frame);
            else resolve();
          }
          requestAnimationFrame(frame);
        });
      }
      await sleep(1500);
    }, TOTAL_DURATION_SEC);

    const vid = p.video();
    await ctx.close();
    const pth = await vid.path();
    fs.renameSync(pth, outFile);
  };

  console.log(`  ${clr.purple}⠋ Recording Desktop viewport...${clr.reset}`);
  const desktopWebm = path.join(WORK_DIR, 'desktop.webm');
  await recordSite(1680, 1050, false, desktopWebm);

  let mobileWebm = null;
  if (styleMode === 'combo3d') {
    console.log(`  ${clr.purple}⠋ Recording Mobile viewport...${clr.reset}`);
    mobileWebm = path.join(WORK_DIR, 'mobile.webm');
    await recordSite(430, 932, true, mobileWebm);
  }

  console.log(`  ${clr.neon}⠋ Assembling 3D Studio Stage...${clr.reset}`);

  let stageInnerHtml = '';
  const comboScale = stageH === 1920 ? 1.0 : (stageH === 1440 ? 0.88 : 0.82);
  const brandSection = BRAND_TEXT ? `
      <div class="bottom-brand">
        <div class="brand-text">${BRAND_TEXT}</div>
      </div>
  ` : '';

  if (styleMode === 'macbook') {
    const mbScale = stageH === 1920 ? 1.02 : (stageH === 1440 ? 0.96 : 0.88);
    stageInnerHtml = `
      <div class="macbook-wrap" style="transform: scale(${mbScale});">
        <div class="macbook-screen">
          <div class="camera-notch"><div class="lens"></div></div>
          <div class="screen-glass">
            <video id="vid1" src="desktop.webm" muted playsinline></video>
          </div>
        </div>
        <div class="macbook-base">
          <div class="opening-notch"></div>
        </div>
        <div class="macbook-bottom-lip"></div>
      </div>
      ${brandSection}
    `;
  } else {
    stageInnerHtml = `
      <div class="combo-stage" style="transform: scale(${comboScale});">
        <div class="laptop-3d" id="laptop3d">
          <div class="mb-lid">
            <div class="camera-notch"><div class="lens"></div></div>
            <div class="mb-display">
              <video id="vid1" src="desktop.webm" muted playsinline></video>
              <div class="glass-shine"></div>
            </div>
          </div>
          <div class="mb-chassis">
            <div class="mb-groove"></div>
          </div>
          <div class="mb-shadow"></div>
        </div>

        <div class="iphone-3d" id="iphone3d">
          <div class="iphone-bezel">
            <div class="dynamic-island"></div>
            <div class="iphone-display">
              <video id="vid2" src="mobile.webm" muted playsinline></video>
              <div class="glass-shine"></div>
            </div>
            <div class="home-indicator"></div>
          </div>
        </div>
      </div>
      ${brandSection}
    `;
  }

  const stageHtmlPath = path.join(WORK_DIR, 'stage.html');
  const stageHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${stageW}px; height: ${stageH}px;
    overflow: hidden;
    background: radial-gradient(circle at 50% 35%, #2e0f54 0%, #100521 55%, #040108 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Tahoma, sans-serif;
    position: relative;
    perspective: 2600px;
  }
  .bg-glow {
    position: absolute; inset: 0;
    background:
      radial-gradient(circle at 35% 35%, rgba(168, 85, 247, 0.5) 0%, transparent 55%),
      radial-gradient(circle at 75% 65%, rgba(16, 185, 129, 0.35) 0%, transparent 50%);
    filter: blur(90px);
    pointer-events: none;
    z-index: 1;
  }
  .grid-floor {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(circle at center, black 40%, transparent 88%);
    -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 88%);
    z-index: 2;
  }
  .macbook-wrap {
    z-index: 10;
    display: flex; flex-direction: column; align-items: center;
    filter: drop-shadow(0 45px 75px rgba(0,0,0,0.95)) drop-shadow(0 15px 35px rgba(168,85,247,0.3));
  }
  .macbook-screen {
    width: 980px; height: 612px;
    background: #000000;
    border-radius: 20px 20px 0 0;
    padding: 18px 18px 24px 18px;
    border: 3px solid #374151;
    position: relative;
  }
  .camera-notch {
    position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
    width: 60px; height: 5px;
    display: flex; align-items: center; justify-content: center; z-index: 5;
  }
  .lens { width: 6px; height: 6px; border-radius: 50%; background: #1e293b; box-shadow: 0 0 3px #38bdf8; }
  .screen-glass {
    width: 100%; height: 100%;
    border-radius: 6px;
    overflow: hidden;
    background: #0b0f19;
  }
  .screen-glass video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .macbook-base {
    width: 1030px; height: 18px;
    background: linear-gradient(180deg, #9ca3af 0%, #4b5563 40%, #1f2937 100%);
    border-radius: 0 0 10px 10px;
    position: relative;
    box-shadow: 0 4px 12px rgba(0,0,0,0.6);
  }
  .opening-notch {
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 140px; height: 7px;
    background: #111827;
    border-radius: 0 0 7px 7px;
  }
  .macbook-bottom-lip {
    width: 1050px; height: 4px;
    background: #111827;
    border-radius: 0 0 12px 12px;
  }
  .combo-stage {
    position: relative;
    width: 1080px; height: 1200px;
    display: flex; align-items: center; justify-content: center;
    transform-style: preserve-3d;
    z-index: 10;
  }
  .laptop-3d {
    position: absolute;
    left: -140px;
    top: 130px;
    width: 1120px;
    transform-style: preserve-3d;
    transform: perspective(2200px) rotateY(22deg) rotateX(6deg) rotateZ(-4deg);
    filter: drop-shadow(-30px 50px 70px rgba(0,0,0,0.95)) drop-shadow(0 0 45px rgba(168,85,247,0.35));
    will-change: transform;
    z-index: 12;
  }
  .mb-lid {
    width: 1080px; height: 675px;
    background: #090b10;
    border-radius: 26px 26px 0 0;
    padding: 20px 20px 26px 20px;
    border: 3.5px solid #475569;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);
    position: relative;
  }
  .mb-display {
    width: 100%; height: 100%;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    background: #0f172a;
  }
  .mb-display video {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  .mb-chassis {
    width: 1140px; height: 24px;
    margin-left: -30px;
    background: linear-gradient(90deg, #64748b 0%, #cbd5e1 25%, #94a3b8 50%, #334155 100%);
    border-radius: 0 0 16px 16px;
    position: relative;
    box-shadow: 0 14px 30px rgba(0,0,0,0.9), inset 0 2px 3px rgba(255,255,255,0.6);
  }
  .mb-groove {
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 160px; height: 8px;
    background: #1e293b;
    border-radius: 0 0 8px 8px;
  }
  .iphone-3d {
    position: absolute;
    right: 45px;
    bottom: 95px;
    width: 390px; height: 810px;
    transform-style: preserve-3d;
    transform: perspective(2200px) rotateY(-18deg) rotateX(5deg) rotateZ(3deg) translateZ(120px);
    filter: drop-shadow(-35px 45px 65px rgba(0,0,0,0.98)) drop-shadow(0 0 40px rgba(16,185,129,0.4));
    will-change: transform;
    z-index: 25;
  }
  .iphone-bezel {
    width: 100%; height: 100%;
    background: #090a0f;
    border-radius: 56px;
    padding: 13px;
    border: 5px solid #64748b;
    box-shadow:
      inset 0 0 0 2px #000000,
      inset 0 0 12px rgba(255,255,255,0.25),
      8px 0 0 #334155;
    position: relative;
    display: flex; flex-direction: column;
  }
  .dynamic-island {
    position: absolute; top: 24px; left: 50%; transform: translateX(-50%);
    width: 106px; height: 28px;
    background: #000000;
    border-radius: 20px;
    z-index: 30;
    box-shadow: inset 0 0 4px rgba(255,255,255,0.15);
  }
  .dynamic-island::after {
    content: "";
    position: absolute; right: 18px; top: 50%; transform: translateY(-50%);
    width: 9px; height: 9px; border-radius: 50%;
    background: radial-gradient(circle, #38bdf8 0%, #0f172a 70%);
  }
  .iphone-display {
    width: 100%; height: 100%;
    border-radius: 44px;
    overflow: hidden;
    position: relative;
    background: #0f172a;
  }
  .iphone-display video {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  .home-indicator {
    position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
    width: 120px; height: 5px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
    z-index: 30;
  }
  .glass-shine {
    position: absolute; inset: 0;
    background: linear-gradient(125deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 35%, transparent 45%);
    pointer-events: none;
    z-index: 20;
  }
  .bottom-brand {
    position: absolute;
    bottom: 75px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 40;
    display: flex; align-items: center; justify-content: center;
    filter: drop-shadow(0 0 22px rgba(168, 85, 247, 0.8));
  }
  .brand-text {
    color: #ffffff;
    font-size: 36px;
    font-weight: 900;
    letter-spacing: 3.5px;
    white-space: nowrap;
  }
</style>
</head>
<body>
  <div class="bg-glow"></div>
  <div class="grid-floor"></div>
  ${stageInnerHtml}
  <script>
    const v1 = document.getElementById('vid1');
    const v2 = document.getElementById('vid2');
    const laptop = document.getElementById('laptop3d');
    const iphone = document.getElementById('iphone3d');
    window.__done = false;

    let v1Ready = false, v2Ready = !v2;
    function checkStart() {
      if (v1Ready && v2Ready) {
        v1.play();
        if (v2) v2.play();
        if (laptop && iphone) requestAnimationFrame(animateCombo);
      }
    }

    function animateCombo() {
      const t = v1.currentTime || 0;
      const dur = v1.duration || 15;
      const p = Math.min(t / dur, 1);

      const lapRy = 22 + Math.sin(p * Math.PI * 2) * 3;
      const lapRx = 6 + Math.cos(p * Math.PI * 2) * 2;
      const lapY = Math.sin(p * Math.PI * 2) * -14;
      laptop.style.transform = \`perspective(2200px) translateY(\${lapY}px) rotateY(\${lapRy}deg) rotateX(\${lapRx}deg) rotateZ(-4deg)\`;

      const phRy = -18 + Math.cos(p * Math.PI * 2) * 3.5;
      const phRx = 5 + Math.sin(p * Math.PI * 2) * 2;
      const phY = Math.cos(p * Math.PI * 2) * 16;
      iphone.style.transform = \`perspective(2200px) translateY(\${phY}px) rotateY(\${phRy}deg) rotateX(\${phRx}deg) rotateZ(3deg) translateZ(120px)\`;

      if (!v1.ended && p < 1) {
        requestAnimationFrame(animateCombo);
      }
    }

    v1.addEventListener('canplaythrough', () => { v1Ready = true; checkStart(); }, { once: true });
    if (v2) {
      v2.addEventListener('canplaythrough', () => { v2Ready = true; checkStart(); }, { once: true });
    }

    v1.addEventListener('ended', () => {
      setTimeout(() => { window.__done = true; }, 500);
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(stageHtmlPath, stageHtml);

  const stageDir = path.join(WORK_DIR, 'stage_rec');
  fs.mkdirSync(stageDir, { recursive: true });

  const stageContext = await browser.newContext({
    viewport: { width: stageW, height: stageH },
    deviceScaleFactor: 1,
    recordVideo: { dir: stageDir, size: { width: stageW, height: stageH } }
  });

  const stagePage = await stageContext.newPage();
  stagePage.setDefaultTimeout(300000);
  await stagePage.goto(`file://${stageHtmlPath}`);

  console.log(`  ${clr.purple}⠋ Rendering cinematic stage output...${clr.reset}`);
  const maxWait = Math.max(120000, (TOTAL_DURATION_SEC + 40) * 1000);
  await stagePage.waitForFunction(() => window.__done === true, null, { timeout: maxWait });

  const stageVideo = stagePage.video();
  await stageContext.close();
  await browser.close();

  const stageVideoPath = await stageVideo.path();
  const filePrefix = rawBaseName ? rawBaseName : `Showcase_${styleMode}_${ratioLabel}`;
  const finalOutput = path.join(OUT_DIR, `${filePrefix}_${Date.now()}.mp4`);

  console.log(`  ${clr.neon}⠋ Encoding 60fps MP4 (CRF: ${crfValue}, Preset: ${presetSpeed})...${clr.reset}`);

  spawnSync('ffmpeg', [
    '-y',
    '-i', stageVideoPath,
    '-vf', 'fps=60,eq=contrast=1.03:saturation=1.06',
    '-c:v', 'libx264',
    '-preset', presetSpeed,
    '-crf', crfValue,
    '-pix_fmt', 'yuv420p',
    finalOutput
  ], { stdio: 'ignore' });

  fs.rmSync(WORK_DIR, { recursive: true, force: true });

  printUI();
  console.log(`  ${clr.neon}✔ Render Complete!${clr.reset}`);
  console.log(`  ${clr.purple}Saved File:${clr.reset} ${clr.white}${finalOutput}${clr.reset}\n`);
})();