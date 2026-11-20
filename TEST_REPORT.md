# TEST_REPORT.md — Laporan Pengesahan Binaan, Kurikulum, Ujian & Pelayan

Laporan ini merekodkan keputusan sebenar bagi setiap arahan pengesahan yang dijalankan terhadap Kampung Wira 3D.

## 1. Semakan Jenis TypeScript (`npm run lint` / `tsc --noEmit`)
- **Keputusan**: **LULUS (Exit Code 0)**
- **Output**: Tiada ralat sintaks atau jenis merentas `src/`, `server.ts`, `scripts/`, dan `tests/`.

## 2. Binaan Pengeluaran Vite + PWA (`npm run build`)
- **Keputusan**: **LULUS (Exit Code 0)**
- **Output**: Menghasilkan `dist/` lengkap dengan pengasingan ketulan `three`, `gsap`, `react`, `index` serta PWA manifest & servis pekerja Workbox.

## 3. Audit Kurikulum (`npm run validate:curriculum`)
- **Keputusan**: **LULUS (Exit Code 0)**
- **Ringkasan yang dijana ke `CURRICULUM_INVENTORY.json`**:
  - `subjectCount`: **15**
  - `chapterCount`: **36**
  - `subtopicCount`: **59**
  - `assessmentItemCount`: **590** (minimum 10 soalan bagi setiap subtopik)
  - `guidedItemCount`: **177**
  - `independentItemCount`: **236**
  - `awaitingReviewSubtopics`: **13** (Pendidikan Islam + 6 Bahasa Elektif SK)

## 4. Ujian Automatik Vitest (`npm test`)
- **Fail Ujian**: `tests/kampungWira.test.ts`
- **Keputusan**: **9 / 9 LULUS (0 gagal)**
  1. `passes full curriculum structural & assessment audit across all 15 SK subjects` — LULUS
  2. `covers all 8 Matematik chapters, 10 Sains units, 7 Pendidikan Islam fields, and 14 Pendidikan Moral values` — LULUS
  3. `ensures every subtopic has >= 10 assessments with valid options, hints, and explanations` — LULUS
  4. `flags religious and elective-language subtopics as awaiting_educator_review without inventing KPM DSKP codes` — LULUS
  5. `computes mastery status accurately across lesson, practice, and assessment modes` — LULUS
  6. `prevents duplicate reward crediting via transactionId idempotency` — LULUS
  7. `calculates learner level correctly from XP` — LULUS
  8. `provides 5 Malaysian companions, 15 subject buildings, and non-overlapping initial village plots` — LULUS
  9. `supports demo login, learner avatar update, idempotent progress, village construction & artworks without Laravel` — LULUS

## 5. Pengesahan Pelayan Langsung Port 3000 (`tsx server.ts`)
- `GET /` ➔ **HTTP 200**
- `GET /api/v1/health` ➔ **HTTP 200** (`{"status":"ok","app":"Kampung Wira 3D"}`)
- `POST /api/v1/auth/demo` ➔ **HTTP 200** (Menghasilkan sesi kuki Mod Demo Tetamu)
- `GET /api/v1/learners/lrn-demo-1/bundle` ➔ **HTTP 200** (`8554` bait data profil, 15 bangunan desa, misi, lencana, inventori)
- `POST /api/v1/tutor` ➔ **HTTP 200** (`"source":"gemini"` membalas soalan Matematik Tahun 1 dalam Bahasa Melayu mesra kanak-kanak)
