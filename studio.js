const { chromium } = require('playwright');
const { spawnSync } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

const WORK_DIR = path.join(__dirname, '.studio_temp');
const OUT_DIR = path.join(__dirname, 'output');

const clr = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  purple: '\x1b[38;5;141m',
  neon: '\x1b[38;5;84m',
  white: '\x1b[38;5;255m',
  gray: '\x1b[38;5;244m'
};

const ask = (rl, query) => new Promise((resolve) => rl.question(query, resolve));

const clearScreen = () => {
  process.stdout.write('\x1b[2J\x1b[3J\x1b[H');
};

const printUI = () => {
  clearScreen();
  console.log(`${clr.purple}────────────────────────────────────────────────────────────────────────${clr.reset}`);
  console.log(`  ${clr.neon}●${clr.reset} ${clr.bold}${clr.purple}POURHAJIDEV </> ${clr.white}SHOWCASE STUDIO${clr.reset}               ${clr.gray}[STUDIO V4.0]${clr.reset}`);
  console.log(`${clr.purple}────────────────────────────────────────────────────────────────────────${clr.reset}\n`);
};

(async () => {
  printUI();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const urlInput = await ask(rl, `  ${clr.purple}URL ${clr.gray}(Enter for http://localhost:3000):${clr.reset} `);
  const TARGET_URL = urlInput.trim() || 'http://localhost:3000';

  printUI();
  console.log(`  ${clr.neon}✔ Target:${clr.reset} ${clr.white}${TARGET_URL}${clr.reset}\n`);
  const nameInput = await ask(rl, `  ${clr.purple}Project / File Name ${clr.gray}(Enter for default):${clr.reset} `);
  const rawBaseName = nameInput.trim().replace(/[^a-zA-Z0-9_-]/g, '_');

  printUI();
  console.log(`  ${clr.neon}✔ Target:${clr.reset} ${clr.white}${TARGET_URL}${clr.reset}`);
  console.log(`  ${clr.neon}✔ File Name:${clr.reset} ${clr.white}${rawBaseName || 'Auto-Generated'}${clr.reset}\n`);
  console.log(`  ${clr.bold}${clr.purple}[ VIDEO DURATION ]${clr.reset}`);
  console.log(`  ${clr.gray}Enter total duration between 10 to 30 seconds.${clr.reset}`);
  const durInput = await ask(rl, `  ${clr.purple}Duration in seconds ${clr.gray}(Default: 15s):${clr.reset} `);
  let parsedSec = parseInt(durInput.trim(), 10);
  if (isNaN(parsedSec) || parsedSec < 10) parsedSec = 15;
  if (parsedSec > 30) parsedSec = 30;
  const TOTAL_DURATION_SEC = parsedSec;

  printUI();
  console.log(`  ${clr.neon}✔ Target:${clr.reset} ${clr.white}${TARGET_URL}${clr.reset}`);
  console.log(`  ${clr.neon}✔ File Name:${clr.reset} ${clr.white}${rawBaseName || 'Auto-Generated'}${clr.reset}`);
  console.log(`  ${clr.neon}✔ Duration:${clr.reset}  ${clr.white}${TOTAL_DURATION_SEC} Seconds${clr.reset}\n`);
  console.log(`  ${clr.bold}${clr.purple}[ DEVICE VIEWPORT ]${clr.reset}`);
  console.log(`  ${clr.neon}1${clr.reset} ─ Desktop  ${clr.gray}(MacBook Pro Frame)${clr.reset}`);
  console.log(`  ${clr.neon}2${clr.reset} ─ Tablet   ${clr.gray}(iPad Air Pro)${clr.reset}`);
  console.log(`  ${clr.neon}3${clr.reset} ─ Mobile   ${clr.gray}(iPhone 15 Chassis)${clr.reset}\n`);
  const devChoice = await ask(rl, `  ${clr.purple}Select [1-3]:${clr.reset} `);
  const devMode = devChoice.trim() || '1';

  printUI();
  console.log(`  ${clr.neon}✔ Target:${clr.reset} ${clr.white}${TARGET_URL}${clr.reset}`);
  console.log(`  ${clr.neon}✔ Duration:${clr.reset}  ${clr.white}${TOTAL_DURATION_SEC}s${clr.reset}`);
  console.log(`  ${clr.neon}✔ Device:${clr.reset} ${clr.white}Option ${devMode}${clr.reset}\n`);
  console.log(`  ${clr.bold}${clr.purple}[ OUTPUT ASPECT RATIO ]${clr.reset}`);
  console.log(`  ${clr.neon}1${clr.reset} ─ 16:9 Landscape  ${clr.gray}(YouTube, Web, Monitor)${clr.reset}`);
  console.log(`  ${clr.neon}2${clr.reset} ─ 9:16 Vertical   ${clr.gray}(Instagram Story, Reels, Shorts)${clr.reset}`);
  console.log(`  ${clr.neon}3${clr.reset} ─ 3:4  Portrait   ${clr.gray}(Instagram Feed, Dribbble)${clr.reset}`);
  console.log(`  ${clr.neon}4${clr.reset} ─ 1:1  Square     ${clr.gray}(LinkedIn, Carousel, X)${clr.reset}\n`);
  const ratioChoice = await ask(rl, `  ${clr.purple}Select [1-4]:${clr.reset} `);
  const rMode = ratioChoice.trim() || '1';

  printUI();
  console.log(`  ${clr.neon}✔ Target:${clr.reset} ${clr.white}${TARGET_URL}${clr.reset}`);
  console.log(`  ${clr.neon}✔ Duration:${clr.reset}  ${clr.white}${TOTAL_DURATION_SEC}s${clr.reset}`);
  console.log(`  ${clr.neon}✔ Device:${clr.reset} ${clr.white}Option ${devMode}${clr.reset}`);
  console.log(`  ${clr.neon}✔ Ratio:${clr.reset}  ${clr.white}Option ${rMode}${clr.reset}\n`);
  console.log(`  ${clr.bold}${clr.purple}[ OUTPUT FILE SIZE & QUALITY ]${clr.reset}`);
  console.log(`  ${clr.neon}1${clr.reset} ─ Maximum Quality  ${clr.gray}(Ultra 4K/60fps Master - High Bitrate)${clr.reset}`);
  console.log(`  ${clr.neon}2${clr.reset} ─ Optimized / Low  ${clr.gray}(Compressed - Fast Send for Telegram/Instagram)${clr.reset}\n`);
  const qualChoice = await ask(rl, `  ${clr.purple}Select [1-2]:${clr.reset} `);
  rl.close();

  const isLowSize = qualChoice.trim() === '2';
  const crfValue = isLowSize ? '26' : '16';
  const presetSpeed = isLowSize ? 'fast' : 'slow';

  let device;
  if (devMode === '3' || devMode.toLowerCase() === 'mobile') {
    device = {
      type: 'mobile',
      rawW: 414, rawH: 896,
      rigW: 446, rigH: 940,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      isMobile: true
    };
  } else if (devMode === '2' || devMode.toLowerCase() === 'tablet') {
    device = {
      type: 'tablet',
      rawW: 1024, rawH: 768,
      rigW: 1090, rigH: 846,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      isMobile: true
    };
  } else {
    device = {
      type: 'desktop',
      rawW: 1680, rawH: 945,
      rigW: 1740, rigH: 1015,
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      isMobile: false
    };
  }

  let stageDim;
  if (rMode === '2') {
    stageDim = { label: '9x16_Vertical', w: 1080, h: 1920, isVerticalStory: true };
  } else if (rMode === '3') {
    stageDim = { label: '3x4_Portrait', w: 1080, h: 1440, isVerticalStory: false };
  } else if (rMode === '4') {
    stageDim = { label: '1x1_Square', w: 1080, h: 1080, isVerticalStory: false };
  } else {
    stageDim = { label: '16x9_Landscape', w: 1920, h: 1080, isVerticalStory: false };
  }

  let baseScale, zoomAmp, animPreset;
  if (stageDim.isVerticalStory && device.type === 'desktop') {
    baseScale = 0.58;
    zoomAmp = 0.03;
    animPreset = 'desktop_vertical_fit';
  } else if (stageDim.isVerticalStory && device.type === 'mobile') {
    baseScale = 1.62;
    zoomAmp = 0.05;
    animPreset = 'mobile_vertical';
  } else {
    const fit = Math.min((stageDim.w * 0.90) / device.rigW, (stageDim.h * 0.90) / device.rigH);
    baseScale = Number(fit.toFixed(3));
    zoomAmp = Number((baseScale * 0.045).toFixed(3));
    animPreset = 'standard';
  }

  printUI();
  console.log(`  ${clr.neon}⚙ Mode:${clr.reset} ${device.type.toUpperCase()} ➔ ${stageDim.label} (${TOTAL_DURATION_SEC}s)`);
  console.log(`  ${clr.purple}⠋ Initializing Chromium engine...${clr.reset}\n`);

  if (fs.existsSync(WORK_DIR)) fs.rmSync(WORK_DIR, { recursive: true, force: true });
  fs.mkdirSync(WORK_DIR, { recursive: true });
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--enable-gpu',
      '--use-gl=angle',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--disable-web-security',
      '--allow-file-access-from-files',
      '--no-sandbox'
    ]
  });

  const rawContext = await browser.newContext({
    viewport: { width: device.rawW, height: device.rawH },
    userAgent: device.userAgent,
    isMobile: device.isMobile,
    hasTouch: device.isMobile,
    deviceScaleFactor: 1,
    recordVideo: { dir: WORK_DIR, size: { width: device.rawW, height: device.rawH } }
  });

  const page = await rawContext.newPage();
  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});

  await page.addStyleTag({
    content: `
      ::-webkit-scrollbar { display: none !important; }
      * { scrollbar-width: none !important; }
      #pro-cursor {
        position: fixed;
        top: 0; left: 0;
        width: 28px; height: 28px;
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-4px, -4px);
        filter: drop-shadow(0 6px 14px rgba(0,0,0,0.45));
      }
    `
  });

  console.log(`  ${clr.neon}⠋ Recording continuous fluid scroll (${TOTAL_DURATION_SEC}s)...${clr.reset}`);

  await page.evaluate(async ({ vw, vh, isMob, totalSec }) => {
    const cursor = document.createElement('div');
    cursor.id = 'pro-cursor';
    if (isMob) {
      cursor.innerHTML = '<div style="width:24px;height:24px;border-radius:50%;background:rgba(16,185,129,0.35);border:2px solid rgba(168,85,247,0.95);box-shadow:0 0 16px rgba(16,185,129,0.85);"></div>';
    } else {
      cursor.innerHTML = '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 4L26 15.5L16.5 18L12 27L7 4Z" fill="#0f172a" stroke="#10b981" stroke-width="2.2" stroke-linejoin="round"/></svg>';
    }
    document.body.appendChild(cursor);

    let cx = vw / 2, cy = vh / 2;
    const setPos = (x, y) => {
      cx = x; cy = y;
      cursor.style.left = x + 'px';
      cursor.style.top = y + 'px';
    };
    setPos(cx, cy);

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const totalMs = totalSec * 1000;
    const headerPauseMs = 1500;
    const footerPauseMs = 1500;
    const scrollDuration = Math.max(2000, totalMs - headerPauseMs - footerPauseMs);

    await sleep(headerPauseMs);

    const getMaxScroll = () => {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      ) - window.innerHeight;
    };

    const targetMaxY = Math.max(0, getMaxScroll());

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    if (targetMaxY > 0) {
      await new Promise(resolve => {
        const start = performance.now();
        function frame(now) {
          const p = Math.min((now - start) / scrollDuration, 1);
          const ep = easeInOutCubic(p);
          const currentY = targetMaxY * ep;
          window.scrollTo(0, currentY);

          const curX = vw / 2 + Math.sin(p * Math.PI * 4) * (vw * 0.15);
          const curY = vh / 2 + Math.cos(p * Math.PI * 2) * (vh * 0.12);
          setPos(curX, curY);

          if (p < 1) {
            requestAnimationFrame(frame);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(frame);
      });
    }

    await sleep(footerPauseMs);
  }, { vw: device.rawW, vh: device.rawH, isMob: device.isMobile, totalSec: TOTAL_DURATION_SEC });

  const rawVideo = page.video();
  await rawContext.close();
  const rawVideoPath = await rawVideo.path();
  const safeRawPath = path.join(WORK_DIR, 'raw.webm');
  fs.renameSync(rawVideoPath, safeRawPath);

  console.log(`  ${clr.purple}⠋ Synthesizing stage layout...${clr.reset}`);

  const stageHtmlPath = path.join(WORK_DIR, 'stage.html');
  const isPhone = device.type === 'mobile';

  const stageHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${stageDim.w}px; height: ${stageDim.h}px;
    overflow: hidden;
    background: #040508;
    display: flex; align-items: center; justify-content: center;
    perspective: 2500px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
  }
  .ambient {
    position: absolute; inset: -20%;
    background:
      radial-gradient(circle at 20% 25%, rgba(168, 85, 247, 0.48) 0%, transparent 45%),
      radial-gradient(circle at 80% 75%, rgba(16, 185, 129, 0.38) 0%, transparent 45%),
      radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.28) 0%, transparent 55%);
    filter: blur(85px);
    animation: bgShift 9s ease-in-out infinite alternate;
    z-index: 0;
  }
  .grid-overlay {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(16, 185, 129, 0.035) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(168, 85, 247, 0.035) 1px, transparent 1px);
    background-size: 54px 54px;
    mask-image: radial-gradient(circle at center, black 50%, transparent 92%);
    -webkit-mask-image: radial-gradient(circle at center, black 50%, transparent 92%);
    z-index: 1;
  }
  @keyframes bgShift {
    0% { transform: scale(1) rotate(0deg); }
    100% { transform: scale(1.12) rotate(4deg); }
  }
  .rig {
    position: relative;
    width: ${device.rigW}px;
    height: ${device.rigH}px;
    transform-style: preserve-3d;
    z-index: 5;
    will-change: transform;
  }
  .external-brand-pill {
    position: absolute;
    top: -55px; left: 50%;
    transform: translateX(-50%);
    background: rgba(8, 10, 18, 0.85);
    border: 1px solid rgba(168, 85, 247, 0.55);
    color: #f8fafc;
    font-size: 14px; font-weight: 700; letter-spacing: 0.8px;
    padding: 6px 28px; border-radius: 999px;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 0 25px rgba(168, 85, 247, 0.35);
    white-space: nowrap;
    z-index: 20;
  }
  .external-brand-pill span.code {
    color: #10b981;
    font-weight: 800;
    text-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
  }
  .external-brand-pill::before {
    content: ""; display: inline-block;
    width: 8px; height: 8px; border-radius: 50%;
    background: #10b981; box-shadow: 0 0 12px #10b981;
  }
  .device-frame {
    width: 100%; height: 100%;
    background: rgba(12, 14, 22, 0.94);
    border-radius: ${isPhone ? '46px' : '20px'};
    border: ${isPhone ? '8px solid #232738' : '1.5px solid rgba(168, 85, 247, 0.26)'};
    box-shadow:
      0 45px 90px -15px rgba(0, 0, 0, 0.95),
      0 25px 60px -20px rgba(168, 85, 247, 0.38),
      0 15px 40px -20px rgba(16, 185, 129, 0.28),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    overflow: hidden;
    display: flex; flex-direction: column;
    position: relative;
  }
  .topbar {
    height: ${isPhone ? '0px' : '46px'};
    background: linear-gradient(180deg, #1b1e2c 0%, #10121c 100%);
    border-bottom: ${isPhone ? 'none' : '1px solid rgba(168, 85, 247, 0.16)'};
    display: ${isPhone ? 'none' : 'flex'};
    align-items: center;
    padding: 0 22px;
    position: relative;
    flex-shrink: 0;
  }
  .dots { display: flex; gap: 9px; }
  .dot { width: 13px; height: 13px; border-radius: 50%; }
  .dot.r { background: #ff5f56; box-shadow: 0 0 8px rgba(255,95,86,0.4); }
  .dot.y { background: #ffbd2e; box-shadow: 0 0 8px rgba(255,189,46,0.4); }
  .dot.g { background: #27c93f; box-shadow: 0 0 8px rgba(39,201,63,0.4); }
  .viewport {
    width: 100%;
    flex: 1;
    position: relative; overflow: hidden;
    background: #090a10;
  }
  video {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  .glare {
    position: absolute; inset: -100%;
    background: linear-gradient(115deg, transparent 43%, rgba(255,255,255,0.06) 48%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.06) 52%, transparent 57%);
    pointer-events: none; z-index: 10;
    will-change: transform;
  }
</style>
</head>
<body>
  <div class="ambient"></div>
  <div class="grid-overlay"></div>
  <div class="rig" id="rig">
    <div class="external-brand-pill">PourhajiDeV <span class="code">&lt;/&gt;</span></div>
    <div class="device-frame">
      <div class="topbar">
        <div class="dots">
          <div class="dot r"></div>
          <div class="dot y"></div>
          <div class="dot g"></div>
        </div>
      </div>
      <div class="viewport">
        <video id="vid" src="raw.webm" muted playsinline></video>
      </div>
      <div class="glare" id="glare"></div>
    </div>
  </div>
  <script>
    const vid = document.getElementById('vid');
    const rig = document.getElementById('rig');
    const glare = document.getElementById('glare');
    window.__done = false;

    const PRESET = "${animPreset}";
    const BASE_SCALE = ${baseScale};
    const ZOOM_AMP = ${zoomAmp};

    const easeOutBack = (t) => {
      const c1 = 1.70158; const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

    vid.addEventListener('loadedmetadata', () => {
      const dur = vid.duration || 10;
      vid.play();

      function render() {
        const t = vid.currentTime;
        const p = Math.min(t / dur, 1);

        let scale, rx, ry, rz, tx, ty;

        if (PRESET === 'desktop_vertical_fit') {
          if (p < 0.15) {
            const ip = easeOutBack(p / 0.15);
            scale = (BASE_SCALE * 0.90) + (BASE_SCALE * 0.10) * ip;
            rx = 8 * (1 - ip) + 2 * ip;
            ry = -9 * (1 - ip) - 3 * ip;
            rz = -2 * (1 - ip);
            tx = -15 * (1 - ip);
            ty = 20 * (1 - ip);
          } else if (p < 0.85) {
            const mp = (p - 0.15) / 0.70;
            scale = BASE_SCALE + Math.sin(mp * Math.PI * 2) * ZOOM_AMP;
            rx = 2.5 + Math.cos(mp * Math.PI * 2) * 1.5;
            ry = -3 + Math.sin(mp * Math.PI * 2) * 3;
            rz = Math.sin(mp * Math.PI) * 1;
            tx = Math.sin(mp * Math.PI * 2) * 10;
            ty = Math.cos(mp * Math.PI * 2) * 8;
          } else {
            const op = easeInOutSine((p - 0.85) / 0.15);
            scale = BASE_SCALE * (1 - op) + (BASE_SCALE * 0.98) * op;
            rx = 2.5 * (1 - op);
            ry = -3 * (1 - op);
            rz = 0;
            tx = 0; ty = 0;
          }
        } else {
          if (p < 0.13) {
            const ip = easeOutBack(p / 0.13);
            scale = (BASE_SCALE * 0.84) + (BASE_SCALE * 0.16) * ip;
            rx = 16 * (1 - ip) + 4 * ip;
            ry = -15 * (1 - ip) - 6 * ip;
            rz = -3 * (1 - ip) + 1 * ip;
            tx = -35 * (1 - ip);
            ty = 45 * (1 - ip);
          } else if (p < 0.87) {
            const mp = (p - 0.13) / 0.74;
            scale = BASE_SCALE + Math.sin(mp * Math.PI * 2) * ZOOM_AMP;
            rx = 4 * Math.cos(mp * Math.PI * 2) + 1.5;
            ry = -6 * Math.cos(mp * Math.PI * 3) * 3;
            rz = 1 * Math.cos(mp * Math.PI * 2);
            tx = Math.sin(mp * Math.PI * 2) * 18;
            ty = Math.cos(mp * Math.PI * 2) * 12;
          } else {
            const op = easeInOutSine((p - 0.87) / 0.13);
            scale = BASE_SCALE * (1 - op) + (BASE_SCALE * 0.97) * op;
            rx = 5.5 * (1 - op);
            ry = 6 * (1 - op);
            rz = 1 * (1 - op);
            tx = 0; ty = 0;
          }
        }

        rig.style.transform = "translate3d(" + tx + "px, " + ty + "px, 0px) scale(" + scale + ") rotateX(" + rx + "deg) rotateY(" + ry + "deg) rotateZ(" + rz + "deg)";
        glare.style.transform = "translateX(" + ((p - 0.5) * 85) + "%) rotate(" + (ry * 0.7) + "deg)";

        if (!vid.ended && p < 1) {
          requestAnimationFrame(render);
        } else {
          setTimeout(() => { window.__done = true; }, 350);
        }
      }
      requestAnimationFrame(render);
    });

    vid.addEventListener('ended', () => {
      setTimeout(() => { window.__done = true; }, 350);
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(stageHtmlPath, stageHtml);

  const stageDir = path.join(WORK_DIR, 'stage_rec');
  fs.mkdirSync(stageDir, { recursive: true });

  const stageContext = await browser.newContext({
    viewport: { width: stageDim.w, height: stageDim.h },
    deviceScaleFactor: 1,
    recordVideo: { dir: stageDir, size: { width: stageDim.w, height: stageDim.h } }
  });

  const stagePage = await stageContext.newPage();
  stagePage.setDefaultTimeout(300000);

  await stagePage.goto(`file://${stageHtmlPath}`);

  const dynamicTimeout = Math.max(120000, (TOTAL_DURATION_SEC + 30) * 1000);
  await stagePage.waitForFunction(() => window.__done === true, null, { timeout: dynamicTimeout });

  const stageVideo = stagePage.video();
  await stageContext.close();
  await browser.close();

  const stageVideoPath = await stageVideo.path();
  const filePrefix = rawBaseName ? rawBaseName : `PourhajiDeV_${device.type}_${stageDim.label}`;
  const finalOutput = path.join(OUT_DIR, `${filePrefix}_${Date.now()}.mp4`);

  console.log(`  ${clr.neon}⠋ Encoding 60fps MP4 (CRF: ${crfValue}, Preset: ${presetSpeed})...${clr.reset}`);

  spawnSync('ffmpeg', [
    '-y',
    '-i', stageVideoPath,
    '-vf', 'fps=60,eq=contrast=1.04:saturation=1.08',
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
