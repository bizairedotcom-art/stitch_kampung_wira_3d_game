# MULTIMEDIA_QA_REPORT.md — Laporan Jaminan Kualiti Aset, 3D & Audio

## 1. Inventori Aset Tempatan (`ASSET_MANIFEST.json`)
- **Imej Templat Stitch Setempat (`public/assets/stitch/`)**: **91 fail** (JPG & tangkapan skrin diorama asal).
- **Imej Janaan Khas (`public/assets/generated/`)**: **7 fail** (5.6 MB jumlah keseluruhan — 4 potret sahabat, 2 bangunan subjek, 1 ikon aplikasi).
- **Fon Tempatan (`public/fonts/`)**: **15 fail `.ttf`** (`Rubik`, `Plus Jakarta Sans`, `Material Symbols Outlined`), dimuat melalui `@font-face` tanpa CDN luaran.
- **Ikon PWA (`public/`)**: **5 fail** (`icon.svg`, `apple-touch-icon.png`, `pwa-192x192.png`, `pwa-512x512.png`, `pwa-maskable-512x512.png`).

## 2. Pengesahan Binaan Pengeluaran (`vite build`)
Ketulan binaan diasingkan dalam `dist/assets/`:
- `three-C2eBPboa.js` (~1.3 MB tidak mampat)
- `index-BULgyjRS.js` (~616 KB)
- `react-DeLoXG_s.js` (~552 KB)
- `index-DctZuwNo.css` (~253 KB)
- `gsap-DVMjBCVq.js` (~151 KB)
- `workbox-window.prod.es5-CzJxx9q2.js` (~7.3 KB) + `rolldown-runtime-CO0Nlsmt.js` (~1.2 KB)

## 3. Jaminan Kualiti Enjin 3D & Audio
- **WebGL & Sandaran 2D**: `ThreeViewport.tsx` mengesan pemacu perisian (`isSoftwareGl`), menurunkan `pixelRatio`, mendengar `webglcontextlost`, dan menyediakan paparan sandaran 2D apabila WebGL tidak tersedia atau `fallback2DMode` diaktifkan.
- **Audio Web Audio API**: `audioEngine.ts` mensintesis 15 lagu bertema Nusantara dan 8 kesan bunyi secara prosedur tanpa kebergantungan fail MP3 luaran, serta menyokong *volume ducking* ketika `SpeechSynthesis` aktif dan berhenti automatik semasa `visibilitychange` (tab disembunyikan).
- **Keupayaan Tidak Tersedia**: Penjanaan muzik Lyria dan video Veo tidak tersedia dalam persekitaran ini dan digantikan oleh sintesis Web Audio + babak animasi Three.js/GSAP (didokumenkan dalam `AI_CAPABILITY_REPORT.md` & `VIDEO_CATALOG.md`).
