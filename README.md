# Kampung Wira 3D — Permainan Pendidikan KSSR Semakan 2017 Tahun 1 (SK)

**Kampung Wira 3D** ialah aplikasi web pengembaraan pendidikan 3D dan pembinaan kampung Nusantara untuk murid berumur **7 tahun (Tahun 1, Tahap 1, Sekolah Kebangsaan sahaja)** berpandukan kurikulum **KSSR Semakan 2017** dengan Bahasa Melayu sebagai bahasa pengantar utama.

## Ciri Utama
- **15 Subjek KSSR Tahun 1 SK Lengkap**: Matematik (8 bab), Sains (10 unit), Bahasa Melayu, Bahasa Inggeris (CEFR), Pendidikan Islam (7 bidang, RTL, ditanda untuk semakan asatizah), Pendidikan Moral (14 nilai murni Diri Saya), Pendidikan Seni Visual, Pendidikan Muzik, PJPK, serta 6 Bahasa Elektif SK (Bahasa Arab, Bahasa Cina SK, Bahasa Tamil SK, Bahasa Iban, Bahasa Kadazandusun, Bahasa Semai).
- **35 Enjin Aktiviti Interaktif & Penilaian**: Setiap daripada **59 subtopik** merangkumi langkah pelajaran berpandu suara, demonstrasi interaktif, latihan terbimbing, latihan kendiri, dan **10 soalan penilaian berfakta** (**590 item penilaian** kesemuanya).
- **Dunia 3D Three.js Masa Nyata + Mod 2D Aksesibiliti**: Kampung isometrik 3D (`VillageScene3D`), Studio Avatar Modular 3D (`AvatarScene3D`), 5 Sahabat Rimba 3D (`CompanionEngine3D` — Rimau, Kancil, Enggang, Utan, Badak), dan babak dalaman zon pelajaran (`SubjectScene3D`), lengkap dengan tetapan kualiti grafik dan sokongan `Reduced Motion` / `Mod 2D`.
- **Pengekalan 41 Templat Google Stitch Asal**: Kesemua 41 fail HTML asal dikekalkan tanpa ubah suai di `design-reference/original-templates/` dan dipetakan di `TEMPLATE_MAPPING.md`.
- **Bahagian Pelayan Express + Sokongan Luar Talian PWA**: Storan berterusan `.data/kampung-wira-db.json`, pengesahan kata laluan `bcryptjs`, **Mod Demo Tetamu** berlabel jelas, barisan penyegerakan IndexedDB + `vite-plugin-pwa`, dan opsyen Tutor Pintar pelayan (`/api/v1/tutor` menggunakan `@google/genai` `gemini-4-hydrogen` dengan sandaran pedagogi tempatan).

## Skrip Pembangunan
```bash
npm install
npm run dev                  # Pelayan penuh Express + Vite pada port 3000
npm run build                # Bina pakej pengeluaran (dist/)
npm run lint                 # Semakan TypeScript (tsc --noEmit)
npm run validate:curriculum  # Audit kurikulum & jana CURRICULUM_INVENTORY.json
npm test                     # Jalankan ujian Vitest (tests/kampungWira.test.ts)
```

## Dokumen Rujukan
- `TEMPLATE_MAPPING.md` — Pemetaan 41 templat asal Stitch ke laluan React & babak 3D
- `CURRICULUM_COVERAGE.md` & `CURRICULUM_INVENTORY.json` — Liputan 15 subjek KSSR Tahun 1 SK
- `GAME_ENGINE_CATALOG.md` — Katalog 35 enjin aktiviti interaktif
- `CONTENT_VERIFICATION.md` — Audit ketepatan fakta & status semakan pendidik
- `API_CONTRACT.md` — Spesifikasi REST `/api/v1/*` & idempotensi ganjaran
- `THREEJS_SCENE_CATALOG.md`, `ART_DIRECTION.md`, `CHARACTER_BIBLE.md`, `ANIMATION_CATALOG.md`
- `SOUNDTRACK_CATALOG.md`, `VIDEO_CATALOG.md`, `AI_CAPABILITY_REPORT.md`
- `ASSET_OPTIMIZATION.md`, `ASSET_MANIFEST.json`, `TEST_REPORT.md`, `MULTIMEDIA_QA_REPORT.md`
