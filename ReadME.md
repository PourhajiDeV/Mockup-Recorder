# Mockup Recorder 🎬

A lightweight CLI tool to automatically record websites and render them inside interactive, animated 3D device mockups (MacBook Pro & iPhone) — ready for social media showcases.

Built with **Playwright**, **CSS 3D transforms**, and **FFmpeg**.

---

## What it does

Instead of manually recording your screen, importing it into video editing software, and aligning it with mockups:

1. Opens the target URL (local dev server or live URL).
2. Smoothly auto-scrolls through the page while recording clean viewports (no scrollbars).
3. Injects the captured screen into a 3D stage featuring realistic devices.
4. Renders the final scene into a smooth, ready-to-share 60fps `.mp4` file.

---

## Prerequisites

Before running the tool, ensure you have the following installed on your machine:

- **Node.js** (v16 or higher)
- **FFmpeg** (must be accessible in your system's `PATH`)
  - Ubuntu/Debian: `sudo apt install ffmpeg`
  - macOS: `brew install ffmpeg`
  - Windows: Download via [ffmpeg.org](https://ffmpeg.org/download.html) or run `winget install Gyan.FFmpeg`

---

## Installation

### Local Setup (from source)

1. Clone the repository:
```bash
git clone [https://github.com/PourhajiDeV/Mockup-Recorder.git](https://github.com/PourhajiDeV/Mockup-Recorder.git)
cd Mockup-Recorder
```

2. Install dependencies:
```bash
npm install
```

3. Link the package globally to enable the CLI command:
```bash
npm link
```

*(On Linux/macOS, ensure execution permissions via `chmod +x studio.js`)*

---

## Usage

Run the command in your terminal from any folder:

```bash
web-record
```

The interactive prompt will ask for:

- **URL:** Target web page (default: `http://localhost:3000`).
- **File Name:** Output filename prefix.
- **Brand Text:** Optional text displayed at the bottom of the stage (leave blank to skip).
- **Duration:** Recording time (10 to 30 seconds).
- **Stage Style:**
  - `1` — Realistic MacBook Pro (Front view)
  - `2` — 3D Dual Combo Studio (Tilted MacBook + Floating iPhone)
- **Aspect Ratio:**
  - `1` — 9:16 Vertical (Reels / Shorts / TikTok)
  - `2` — 16:9 Landscape (YouTube / Desktop)
  - `3` — 3:4 Portrait (Instagram Feed)
- **Quality Preset:** Master quality (CRF 16) or lightweight compressed output (CRF 26).

All generated videos are saved automatically in the `output/` directory inside your current working path.

---

## Features

- **Automated Smooth Scroll:** Calculates page height and uses an ease-in-out cubic curve for natural scrolling dynamics.
- **Headless Pipeline:** Runs Chromium under the hood with GPU flags for stable canvas/WebGL rendering.
- **Pure CSS 3D Staging:** Realistic reflections, dynamic island details, camera notch, and perspective depth without heavy 3D engine overhead.
- **Cross-Platform:** Works on Linux, macOS, and Windows.

---

## License

MIT