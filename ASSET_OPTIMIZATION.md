# ASSET_OPTIMIZATION.md — Strategi Pengoptimuman Aset & Prestasi 3D/PWA

## 1. Penyetempatan Fon & Imej (Sifar Kebergantungan CDN Luaran)
- **15 fail fon `.ttf`** (`Rubik`, `Plus Jakarta Sans`, `Material Symbols Outlined`) disalin ke `/public/fonts/` dan dimuat terus melalui `@font-face` dalam `src/index.css`.
- **91 imej templat asal Stitch** disetempatkan ke `/public/assets/stitch/` (`remote-*.jpg` dan tangkapan skrin diorama).
- **7 imej janaan khusus** (`building_arena_wira`, `building_pentas_irama`, `companion_{kancil,enggang,utan,badak}`, `kampung_wira_icon`) disimpan setempat dalam `/public/assets/generated/`.
- **Ikon PWA** (`icon.svg`, `pwa-192x192.png`, `pwa-512x512.png`, `pwa-maskable-512x512.png`, `apple-touch-icon.png`) dijana terus dalam `/public/`.

## 2. Pengasingan Ketulan Vite / Rolldown (`vite.config.ts`)
Pengasingan ketulan manual (`manualChunks`) memecahkan kebergantungan berat supaya pemuatan awal UI kekal pantas:
- `three` (`three-C2eBPboa.js` — ~1.3 MB tidak mampat) dimuat apabila babak 3D diperlukan.
- `gsap` (`gsap-DVMjBCVq.js` — ~151 KB) diasingkan daripada teras aplikasi.
- `react` (`react-DeLoXG_s.js` — ~552 KB) merangkumi `react`, `react-dom`, `react-router-dom`.
- Teras aplikasi (`index-*.js` — ~616 KB) & CSS (`index-*.css` — ~253 KB).

## 3. Pengoptimuman Three.js (`ThreeViewport.tsx` & `VillageScene3D.ts`)
- **Pengesanan Perisian WebGL (`isSoftwareGl`)**: Menurunkan `pixelRatio` maksimum kepada `1` dan mematikan peta bayang berat pada pemacu perisian (seperti SwiftShader/llvmpipe) supaya kadar bingkai kekal stabil.
- **Pratetapan Grafik (`GraphicsPreset`)**: Empat mod (`low`, `medium`, `high`, `ultra`) mengawal antialias, resolusi bayang, dan kepadatan objek.
- **`InstancedMesh` Pokok Kelapa**: Pokok hiasan sekeliling kampung dijana menggunakan `THREE.InstancedMesh` bagi mengurangkan panggilan lukis (*draw calls*).
- **Pembersihan Memori**: Setiap `ThreeViewport` memanggil fungsi `dispose()` ke atas geometri, bahan, tekstur dan `WebGLRenderer` semasa komponen dinyahpasang serta mendengar `webglcontextlost`.
- **Sandaran 2D Automatik**: Sekiranya konteks WebGL gagal atau mod 2D diaktifkan oleh pengguna, papan 2D Nusantara dipaparkan tanpa ralat.

## 4. Caching PWA (`vite-plugin-pwa`)
- Had fail pra-cache Workbox ditetapkan kepada `5 MiB` supaya fon dan himpunan utama dicache dengan selamat.
- Aset `/assets/*` menggunakan strategi `CacheFirst` (maksimum 200 entri, tempoh 30 hari).
